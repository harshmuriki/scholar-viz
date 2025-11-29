
import React, { useState, useEffect, useMemo } from 'react';
import { PaperCard } from './PaperCard';
import { fetchScholarData } from '../services/geminiService';
import { ScholarProfile, LoadingState } from '../types';

interface ScholarPapersProps {
  username: string;
  limit?: number;
}

type SortOption = 'citations_desc' | 'year_desc' | 'year_asc';

interface FilterSettings {
  sortBy: SortOption;
  minYear: string;
  maxYear: string;
}

const STORAGE_KEY = 'scholar_papers_settings';

export const ScholarPapers: React.FC<ScholarPapersProps> = ({ username, limit = 50 }) => {
  const [profile, setProfile] = useState<ScholarProfile | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Initialize settings from local storage or defaults
  const [settings, setSettings] = useState<FilterSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { sortBy: 'citations_desc', minYear: '', maxYear: '' };
    } catch {
      return { sortBy: 'citations_desc', minYear: '', maxYear: '' };
    }
  });

  // Save settings to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Fetch Data
  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      setStatus(LoadingState.LOADING);
      setError(null);
      setProfile(null);
      
      try {
        const data = await fetchScholarData(username);
        // We store the full raw data set here so we can filter/sort it locally
        setProfile(data);
        setStatus(LoadingState.COMPLETE);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load papers.");
        setStatus(LoadingState.ERROR);
      }
    };

    loadData();
  }, [username]);

  // Update helper
  const updateSetting = (key: keyof FilterSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Filter, Sort, and Limit Logic
  const displayedPapers = useMemo(() => {
    if (!profile) return [];

    let result = [...profile.papers];

    // 1. Filter by Year
    if (settings.minYear) {
      const min = parseInt(settings.minYear);
      if (!isNaN(min)) result = result.filter(p => p.year >= min);
    }
    if (settings.maxYear) {
      const max = parseInt(settings.maxYear);
      if (!isNaN(max)) result = result.filter(p => p.year <= max);
    }

    // 2. Sort
    result.sort((a, b) => {
      switch (settings.sortBy) {
        case 'year_desc':
          return b.year - a.year; // Newest first
        case 'year_asc':
          return a.year - b.year; // Oldest first
        case 'citations_desc':
        default:
          return b.citations - a.citations; // Most cited first
      }
    });

    // 3. Limit (Applied last so we show the top X matching the criteria)
    if (limit && limit > 0) {
      result = result.slice(0, limit);
    }

    return result;
  }, [profile, settings, limit]);

  if (!username) return null;

  if (status === LoadingState.LOADING) {
    return (
      <div className="w-full py-8 text-center space-y-4 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto mb-8"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (status === LoadingState.ERROR) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm">
        Error: {error}
      </div>
    );
  }

  if (!profile || profile.papers.length === 0) {
    return (
      <div className="p-4 bg-slate-50 text-slate-500 rounded-lg border border-slate-100 text-center">
        No papers found for "{username}".
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-slate-500 text-sm">{profile.affiliation}</p>
            </div>
            <div className="mt-2 md:mt-0 text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">
              Showing {displayedPapers.length} of {profile.papers.length} Fetched
            </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 text-sm pt-2">
            {/* Sort Control */}
            <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Sort:</span>
                <select 
                    value={settings.sortBy}
                    onChange={(e) => updateSetting('sortBy', e.target.value)}
                    className="bg-white border border-slate-200 text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:border-indigo-400 transition-colors"
                >
                    <option value="citations_desc">Most Cited</option>
                    <option value="year_desc">Newest First</option>
                    <option value="year_asc">Oldest First</option>
                </select>
            </div>

            {/* Filter Control */}
            <div className="flex items-center gap-2 sm:ml-auto">
                <span className="text-slate-500 font-medium">Year:</span>
                <input 
                    type="number" 
                    placeholder="From"
                    value={settings.minYear}
                    onChange={(e) => updateSetting('minYear', e.target.value)}
                    className="w-20 bg-white border border-slate-200 text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-400">-</span>
                <input 
                    type="number" 
                    placeholder="To"
                    value={settings.maxYear}
                    onChange={(e) => updateSetting('maxYear', e.target.value)}
                    className="w-20 bg-white border border-slate-200 text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
        </div>
      </div>

      <div className="space-y-3">
        {displayedPapers.length > 0 ? (
            displayedPapers.map((paper, index) => (
              <PaperCard key={`${paper.title}-${index}`} paper={paper} />
            ))
        ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-slate-500">No papers match the selected filters.</p>
                <button 
                  onClick={() => setSettings({ sortBy: 'citations_desc', minYear: '', maxYear: '' })}
                  className="mt-2 text-indigo-600 hover:underline text-sm font-medium"
                >
                  Clear Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
