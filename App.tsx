
import React, { useState } from 'react';
import { ScholarPapers } from './components/ScholarPapers';
import { Button } from './components/ui/Button';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [searchName, setSearchName] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setSearchName(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto">
        
        {/* Header / Description */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Scholar React Component</h1>
          <p className="text-slate-600 max-w-lg mx-auto">
            A drop-in React component to visualize academic papers. 
            <br />
            <code>npm install scholar-papers-react</code>
          </p>
        </div>

        {/* Search Input (Demo Control) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter scholar name (e.g. Yoshua Bengio)"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Render Component
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            <span>Try:</span>
            {['Geoffrey Hinton', 'Yann LeCun', 'Fei-Fei Li'].map(name => (
              <button 
                key={name}
                onClick={() => { setInputValue(name); setSearchName(name); }}
                className="text-indigo-600 hover:underline"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* The Actual Component Usage */}
        {searchName && (
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
            <div className="mb-6 pb-4 border-b border-dashed border-slate-200">
              <span className="text-xs font-mono text-slate-400 block mb-1">Usage:</span>
              <code className="text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded block w-full overflow-x-auto">
                &lt;ScholarPapers username="{searchName}" /&gt;
              </code>
            </div>
            
            {/* Component Instance */}
            <ScholarPapers username={searchName} />
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
