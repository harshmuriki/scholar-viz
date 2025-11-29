
import React from 'react';
import { Paper } from '../types';

interface PaperCardProps {
  paper: Paper;
}

export const PaperCard: React.FC<PaperCardProps> = ({ paper }) => {
  return (
    <a 
      href={paper.link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group bg-white p-4 sm:p-5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {paper.title}
        </h3>
        
        <div className="text-sm text-slate-600 line-clamp-1">
          {paper.authors.join(', ')}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
            {paper.year}
          </span>
          {paper.venue && (
            <span className="flex items-center gap-1 line-clamp-1">
              {paper.venue}
            </span>
          )}
          <span className="flex items-center gap-1 text-indigo-600">
            {paper.citations} citations
          </span>
        </div>
      </div>
    </a>
  );
};
