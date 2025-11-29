import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Paper } from '../../types';

interface CitationChartProps {
  papers: Paper[];
}

export const CitationChart: React.FC<CitationChartProps> = ({ papers }) => {
  // Take top 10 papers for the chart to keep it readable
  const chartData = papers.slice(0, 10).map(p => ({
    name: p.title.length > 20 ? p.title.substring(0, 20) + '...' : p.title,
    fullName: p.title,
    citations: p.citations,
    year: p.year
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-slate-200 shadow-xl rounded-lg text-sm max-w-xs z-50">
          <p className="font-bold text-slate-800 mb-1">{payload[0].payload.fullName}</p>
          <p className="text-indigo-600 font-semibold">Citations: {payload[0].value}</p>
          <p className="text-slate-500 text-xs">Year: {payload[0].payload.year}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
        <span className="bg-indigo-100 text-indigo-700 p-2 rounded-lg mr-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20V10" />
            <path d="M18 20V4" />
            <path d="M6 20v-4" />
          </svg>
        </span>
        Top Cited Papers
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            interval={0} 
            tick={{ fontSize: 11, fill: '#64748b' }}
            height={60}
          />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="citations" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#4f46e5' : '#818cf8'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};