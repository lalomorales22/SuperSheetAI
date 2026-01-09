
import React, { useRef } from 'react';
import { WorksheetData } from '../types';
import MazeGenerator from './MazeGenerator';

interface WorksheetDisplayProps {
  data: WorksheetData;
  onBack: () => void;
  onSave?: (data: WorksheetData) => void;
}

const WorksheetDisplay: React.FC<WorksheetDisplayProps> = ({ data, onBack, onSave }) => {
  const worksheetRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.focus();
    window.print();
  };

  const isMinecraftTheme = data.theme?.toLowerCase().includes('minecraft');
  const isFortniteTheme = data.theme?.toLowerCase().includes('fortnite');

  const parseMathQuestion = (question: string) => {
    // Improved regex to handle different spacing styles from AI
    const match = question.match(/(\d+)\s*([\+\-x\/])\s*(\d+)/);
    if (match) {
      return {
        num1: match[1],
        op: match[2],
        num2: match[3]
      };
    }
    return null;
  };

  const renderSection = (section: any, index: number) => {
    const isMath = section.type === 'math';
    const isMaze = section.type === 'maze';

    return (
      <div key={index} className={`mb-4 p-4 rounded-2xl border-2 border-gray-100 bg-white/40 relative overflow-hidden ${isMinecraftTheme ? 'border-4 border-green-700/10' : ''}`}>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-kids font-bold uppercase tracking-tight text-gray-700">
            {section.title}
          </h3>
        </div>
        
        {isMaze ? (
          <div className="py-2 flex flex-col items-center">
            <MazeGenerator 
              width={section.mazeConfig?.width || 12} 
              height={section.mazeConfig?.height || 12} 
              seed={section.mazeConfig?.seed || 12345}
            />
            <p className="mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest italic">Help the hero find the exit!</p>
          </div>
        ) : (
          <div className={`grid ${isMath ? 'grid-cols-4 gap-x-2 gap-y-4' : 'grid-cols-1 gap-4'}`}>
            {section.items.map((item: any, itemIdx: number) => {
              const mathParts = isMath ? parseMathQuestion(item.question) : null;
              
              return (
                <div 
                  key={item.id || itemIdx} 
                  className={`bg-white/90 rounded-xl border border-gray-50 flex flex-col ${isMath ? 'items-center justify-center py-3 px-1' : 'p-3 items-start'}`}
                >
                  {!isMath ? (
                    <>
                      <p className="text-sm mb-1 font-medium text-gray-800 leading-tight">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold mr-2">{itemIdx + 1}</span>
                        {item.question}
                      </p>
                      {item.instruction && <p className="text-[10px] text-gray-400 italic mb-1 ml-7">{item.instruction}</p>}
                      <div className="mt-2 h-6 ml-7 max-w-[95%] w-full border-b border-dashed border-blue-100"></div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center w-full">
                      <span className="text-[8px] text-gray-300 font-bold mb-0.5 uppercase self-start pl-1">{itemIdx + 1}</span>
                      {mathParts ? (
                        <div className="flex flex-col items-end font-mono text-xl text-gray-800 leading-tight pr-2">
                          <div>{mathParts.num1}</div>
                          <div className="border-b-2 border-gray-800 w-full min-w-[32px] text-right pb-1 flex justify-between gap-2">
                            <span className="text-sm opacity-40 font-sans">{mathParts.op}</span>
                            <span>{mathParts.num2}</span>
                          </div>
                          <div className="h-5 w-full"></div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-base font-bold mb-1">{item.question}</p>
                          <div className="border-b border-dashed border-blue-100 w-10 h-5 mx-auto"></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-4 mb-6 no-print">
        <button 
          onClick={onBack}
          className="bg-white text-gray-600 px-4 py-2 rounded-xl font-bold shadow-sm hover:shadow-md border border-gray-200 transition-all flex items-center gap-2"
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="flex gap-2">
          {onSave && (
            <button 
              onClick={() => onSave(data)}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <i className="fas fa-bookmark"></i> Save Gallery
            </button>
          )}
          <button 
            onClick={handlePrint}
            className="bg-green-600 text-white px-7 py-2 rounded-xl font-bold shadow-md hover:bg-green-700 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <i className="fas fa-file-pdf"></i> Print / Save PDF
          </button>
        </div>
      </div>

      <div 
        id="printable-worksheet"
        ref={worksheetRef}
        className={`worksheet-page bg-white w-full max-w-[800px] mx-auto min-h-[1056px] p-10 relative overflow-hidden border-t-[12px] ${isMinecraftTheme ? 'border-green-600' : isFortniteTheme ? 'border-purple-600' : 'border-blue-500'}`}
      >
        <header className="text-center mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <div className="w-48 border-b-2 border-gray-300 mb-0.5 flex items-end h-6 px-2 font-kids text-blue-500 font-bold text-sm">Name:</div>
              <p className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-300">Hero Sign-In</p>
            </div>
            <div className="text-right">
              <div className="w-24 border-b-2 border-gray-300 mb-0.5 h-6"></div>
              <p className="text-[8px] uppercase font-bold tracking-[0.2em] text-gray-300">Date</p>
            </div>
          </div>
          
          <h1 className="text-3xl font-kids font-bold text-gray-800 mb-0.5 uppercase tracking-tight">
            {data.title}
          </h1>
          <p className="text-blue-500 font-bold uppercase tracking-[0.3em] text-[9px] mb-4">{data.theme}</p>
          
          <div className="bg-yellow-50/70 border border-yellow-100 rounded-xl p-3 inline-block max-w-lg shadow-sm">
            <p className="text-yellow-800 font-medium italic text-sm leading-snug">
              "{data.heroMessage}"
            </p>
          </div>
        </header>

        <main className="relative z-10">
          {data.sections.map((section, idx) => renderSection(section, idx))}
        </main>

        <footer className="mt-8 pt-4 border-t border-gray-100 flex justify-between items-center text-gray-400 text-[9px]">
          <div className="flex items-center gap-2 italic">
            {data.funFact && (
              <span className="max-w-[350px]">
                <i className="fas fa-lightbulb text-yellow-400 mr-1"></i> 
                <span className="font-bold text-[8px] uppercase text-gray-300 mr-1">Did you know?</span> 
                {data.funFact}
              </span>
            )}
          </div>
          <div className="font-bold tracking-[0.2em] uppercase text-blue-200">Supersheet AI</div>
        </footer>
      </div>
    </div>
  );
};

export default WorksheetDisplay;
