
import { Paper, ScholarProfile } from "../types";

// --- Semantic Scholar Implementation ---
async function getSemanticScholarData(name: string): Promise<ScholarProfile | null> {
  try {
    // Search for author
    const searchUrl = `https://api.semanticscholar.org/graph/v1/author/search?query=${encodeURIComponent(name)}&fields=authorId,name,citationCount,hIndex,affiliations`;
    const searchRes = await fetch(searchUrl);
    
    if (!searchRes.ok) return null;
    
    const searchData = await searchRes.json();
    if (!searchData.data || searchData.data.length === 0) return null;

    // Use the first result (most relevant)
    const author = searchData.data[0];
    
    // Fetch papers for this author
    const papersUrl = `https://api.semanticscholar.org/graph/v1/author/${author.authorId}/papers?fields=title,year,citationCount,authors,venue,url,externalIds,abstract&limit=50`;
    const papersRes = await fetch(papersUrl);
    if (!papersRes.ok) return null;
    
    const papersData = await papersRes.json();
    
    const papers: Paper[] = (papersData.data || [])
      .map((p: any) => ({
        title: p.title,
        year: p.year || new Date().getFullYear(),
        citations: p.citationCount || 0,
        authors: p.authors ? p.authors.map((a: any) => a.name) : [],
        venue: p.venue || "",
        link: p.url || (p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : `https://www.semanticscholar.org/paper/${p.paperId}`),
        abstract: p.abstract
      }))
      .sort((a: Paper, b: Paper) => b.citations - a.citations);

    return {
      name: author.name,
      affiliation: author.affiliations && author.affiliations.length > 0 ? author.affiliations[0] : "",
      papers: papers
    };
  } catch (e) {
    console.warn("Semantic Scholar attempt failed:", e);
    return null;
  }
}

// --- OpenAlex Implementation (Fallback) ---
async function getOpenAlexData(name: string): Promise<ScholarProfile | null> {
  try {
    const searchUrl = `https://api.openalex.org/authors?search=${encodeURIComponent(name)}`;
    const searchRes = await fetch(searchUrl);
    
    if (!searchRes.ok) return null;
    
    const searchData = await searchRes.json();
    if (!searchData.results || searchData.results.length === 0) return null;

    // Take the top result
    const author = searchData.results[0];
    const authorId = author.id;

    const worksUrl = `https://api.openalex.org/works?filter=author.id:${authorId}&sort=cited_by_count:desc&per_page=50`;
    const worksRes = await fetch(worksUrl);
    
    if (!worksRes.ok) return null;
    
    const worksData = await worksRes.json();
    
    const papers: Paper[] = (worksData.results || []).map((w: any) => {
      const venue = w.primary_location?.source?.display_name || "";
      const authors = w.authorships ? w.authorships.map((a: any) => a.author.display_name) : [];
      const link = w.doi || w.landing_page_url || w.ids?.mag ? `https://academic.microsoft.com/paper/${w.ids.mag}` : "#";

      return {
        title: w.title,
        year: w.publication_year || new Date().getFullYear(),
        citations: w.cited_by_count || 0,
        authors: authors,
        venue: venue,
        link: link,
      };
    });

    return {
      name: author.display_name,
      affiliation: author.last_known_institution?.display_name || "",
      papers: papers
    };

  } catch (e) {
    console.warn("OpenAlex attempt failed:", e);
    return null;
  }
}

// --- Main Service Function ---
export const fetchScholarData = async (scholarName: string): Promise<ScholarProfile> => {
  // 1. Try Semantic Scholar
  const ssData = await getSemanticScholarData(scholarName);
  if (ssData && ssData.papers.length > 0) {
    return ssData;
  }

  // 2. Try OpenAlex
  const oaData = await getOpenAlexData(scholarName);
  if (oaData && oaData.papers.length > 0) {
    return oaData;
  }

  // 3. Fail
  throw new Error(`Could not find papers for "${scholarName}".`);
};
