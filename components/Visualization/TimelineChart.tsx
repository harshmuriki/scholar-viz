import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Paper } from '../../types';

interface TimelineChartProps {
  papers: Paper[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ papers }) => {
  // Aggregate data by year
  const yearMap = new Map<number, { count: number, citations: number }>();
  
  papers.forEach(p => {
    const current = yearMap.get(p.year) || { count: 0, citations: 0 };
    yearMap.set(p.year, {
      count: current.count + 1,
      citations: current.citations + p.citations
    });
  });

  const chartData = Array.from(yearMap.entries())
    .map(([year, data]) => ({
      year,
      count: data.count,
      citations: data.citations
    }))
    .sort((a, b) => a.year - b.year);

  return (
    <div className="h-[400px] w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
        <span className="bg-emerald-100 text-emerald-700 p-2 rounded-lg mr-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        Publication Impact Over Time
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCitations" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            itemStyle={{ color: '#0f172a', fontWeight: 600 }}
          />
          <Area 
            type="monotone" 
            dataKey="citations" 
            stroke="#059669" 
            fillOpacity={1} 
            fill="url(#colorCitations)" 
            name="Citations"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};