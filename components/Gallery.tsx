
import React, { useState } from 'react';
import { WorksheetData } from '../types';

interface GalleryProps {
  worksheets: WorksheetData[];
  onView: (ws: WorksheetData) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ worksheets, onView, onDelete, onBack }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredWorksheets = worksheets.filter(ws => {
    if (filter === 'all') return true;
    return ws.sections.some(s => s.type === filter);
  });

  const categories = [
    { id: 'all', label: 'All Missions', icon: 'fa-layer-group' },
    { id: 'math', label: 'Math Battles', icon: 'fa-calculator' },
    { id: 'reading', label: 'Reading Quests', icon: 'fa-book' },
    { id: 'maze', label: 'Secret Mazes', icon: 'fa-route' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-5xl font-kids font-bold text-blue-600 drop-shadow-sm">Mission Database</h2>
          <p className="text-gray-400 font-medium mt-1">Review your completed SuperSheets.</p>
        </div>
        <button 
          onClick={onBack}
          className="bg-white border-2 border-gray-100 text-gray-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <i className="fas fa-plus-circle mr-2"></i> Create New
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              filter === cat.id 
                ? 'bg-blue-600 text-white shadow-md transform scale-105' 
                : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200'
            }`}
          >
            <i className={`fas ${cat.icon}`}></i>
            {cat.label}
          </button>
        ))}
      </div>

      {filteredWorksheets.length === 0 ? (
        <div className="bg-white rounded-[40px] p-24 text-center border-4 border-dashed border-gray-50">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-database text-4xl text-gray-200"></i>
          </div>
          <p className="text-gray-400 text-xl font-medium">No missions found in this category.</p>
          <button 
            onClick={() => setFilter('all')}
            className="mt-4 text-blue-500 font-bold hover:underline"
          >
            Show all missions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorksheets.map(ws => (
            <div key={ws.id} className="bg-white rounded-[32px] overflow-hidden shadow-xl border-2 border-transparent hover:border-blue-300 transition-all flex flex-col group hover:-translate-y-2">
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-4">
                   <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                     {ws.kidName}'s QUEST
                   </span>
                   <span className="text-gray-300 text-[10px] font-bold">
                     {new Date(ws.timestamp).toLocaleDateString()}
                   </span>
                </div>
                <h3 className="text-2xl font-kids font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                  {ws.title}
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 italic">{ws.theme}</p>
                
                <div className="flex flex-wrap gap-1.5">
                  {ws.sections.map((s, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg bg-gray-50 text-[9px] font-bold text-gray-400 uppercase">
                      {s.type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                <button 
                  onClick={() => onView(ws)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-95"
                >
                  View Mission
                </button>
                <button 
                  onClick={() => onDelete(ws.id)}
                  className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Delete Mission"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
