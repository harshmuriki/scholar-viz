
export interface Paper {
  title: string;
  year: number;
  citations: number;
  authors: string[];
  venue: string;
  link: string;
  abstract?: string;
}

export interface ScholarProfile {
  name: string;
  affiliation: string;
  papers: Paper[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
