
import React, { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';
import WorksheetDisplay from './components/WorksheetDisplay';
import Gallery from './components/Gallery';
import { generateWorksheet } from './services/gemini';
import { KidProfile, WorksheetData, AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.PROFILE);
  const [profile, setProfile] = useState<KidProfile | null>(null);
  const [request, setRequest] = useState('');
  const [worksheet, setWorksheet] = useState<WorksheetData | null>(null);
  const [gallery, setGallery] = useState<WorksheetData[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('Summoning knowledge...');

  // Load gallery from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('supersheet_gallery');
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gallery", e);
      }
    }
  }, []);

  const handleProfileSubmit = (data: KidProfile) => {
    setProfile(data);
    setState(AppState.CHATTING);
  };

  const handleGenerate = async () => {
    if (!profile || !request.trim()) return;
    
    setState(AppState.GENERATING);
    setLoadingMessage(`Designing a mission for ${profile.name}...`);
    
    try {
      const data = await generateWorksheet(profile, request);
      setWorksheet(data);
      setState(AppState.VIEWING);
    } catch (error) {
      console.error(error);
      alert("Magic field failure! Please try again.");
      setState(AppState.CHATTING);
    }
  };

  const saveToGallery = (ws: WorksheetData) => {
    const exists = gallery.find(item => item.id === ws.id);
    if (!exists) {
      const newGallery = [ws, ...gallery];
      setGallery(newGallery);
      localStorage.setItem('supersheet_gallery', JSON.stringify(newGallery));
      alert("Saved to Gallery! 🚀");
    } else {
      alert("Already in your Gallery!");
    }
  };

  const deleteFromGallery = (id: string) => {
    if (window.confirm("Delete this worksheet forever?")) {
      const newGallery = gallery.filter(ws => ws.id !== id);
      setGallery(newGallery);
      localStorage.setItem('supersheet_gallery', JSON.stringify(newGallery));
    }
  };

  const openGallery = () => {
    setState(AppState.GALLERY);
  };

  const viewFromGallery = (ws: WorksheetData) => {
    setWorksheet(ws);
    setState(AppState.VIEWING);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Global Header for Navigation (No print) */}
      <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center no-print">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => setState(AppState.CHATTING)}>
            <div className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">S</div>
            <h1 className="font-kids font-bold text-xl text-gray-800">SuperSheet AI</h1>
         </div>
         <button 
           onClick={openGallery}
           className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center gap-2"
         >
           <i className="fas fa-images"></i> My Gallery ({gallery.length})
         </button>
      </header>

      <main>
        {state === AppState.PROFILE && (
          <div className="flex items-center justify-center py-12 px-4">
            <ProfileForm onSubmit={handleProfileSubmit} />
          </div>
        )}

        {state === AppState.CHATTING && profile && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-xl w-full border border-gray-100">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-kids font-bold text-gray-800">What are we learning, {profile.name}?</h2>
                <p className="text-gray-400 text-sm mt-1">Describe the worksheet you want below.</p>
              </div>

              <div className="space-y-4">
                <textarea 
                  className="w-full px-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-blue-400 outline-none h-32 text-lg resize-none shadow-sm transition-all"
                  placeholder="e.g. 10 math problems (subtraction) and a story about a dragon..."
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                />
                
                <div className="flex flex-wrap gap-2">
                   {['Minecraft Subtraction', 'Fortnite Spelling', 'Dinosaur Addition', 'Space Story'].map(label => (
                     <button 
                       key={label}
                       onClick={() => setRequest(label + " worksheet for a 1st grader.")}
                       className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all"
                     >
                       {label}
                     </button>
                   ))}
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={!request.trim()}
                  className={`w-full py-4 rounded-2xl text-xl font-bold shadow-lg transition-all ${
                    request.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 text-gray-300'
                  }`}
                >
                  Generate Magic ✨
                </button>
                
                <button 
                  onClick={() => setState(AppState.PROFILE)}
                  className="w-full text-gray-400 text-xs font-bold mt-2 hover:underline"
                >
                  Edit Student Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {state === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
            <h2 className="text-xl font-kids font-bold text-gray-800 animate-pulse text-center">{loadingMessage}</h2>
          </div>
        )}

        {state === AppState.VIEWING && worksheet && (
          <WorksheetDisplay 
            data={worksheet} 
            onBack={() => setState(AppState.CHATTING)} 
            onSave={saveToGallery}
          />
        )}

        {state === AppState.GALLERY && (
          <Gallery 
            worksheets={gallery} 
            onView={viewFromGallery} 
            onDelete={deleteFromGallery} 
            onBack={() => setState(AppState.CHATTING)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
