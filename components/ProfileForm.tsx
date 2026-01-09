
import React, { useState } from 'react';
import { KidProfile } from '../types';

interface ProfileFormProps {
  onSubmit: (profile: KidProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<KidProfile>({
    name: '',
    age: 7,
    grade: '1st Grade',
    interests: [],
    strengths: '',
    struggles: ''
  });
  
  const [interestInput, setInterestInput] = useState('');

  const addInterest = () => {
    if (interestInput.trim()) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput('');
    }
  };

  const removeInterest = (index: number) => {
    const newInterests = [...formData.interests];
    newInterests.splice(index, 1);
    setFormData({ ...formData, interests: newInterests });
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl max-w-2xl w-full border-4 border-blue-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-kids font-bold text-blue-600 mb-2">Create a Super Profile! 🚀</h2>
        <p className="text-gray-500">Tell us about the hero we are building for.</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hero's Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all"
              placeholder="e.g. Leo"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Age & Grade</label>
            <div className="flex gap-2">
              <input 
                type="number" 
                className="w-20 px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })}
              />
              <select 
                className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all"
                value={formData.grade}
                onChange={e => setFormData({ ...formData, grade: e.target.value })}
              >
                <option>Kindergarten</option>
                <option>1st Grade</option>
                <option>2nd Grade</option>
                <option>3rd Grade</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">What do they LOVE? (Interests)</label>
          <div className="flex gap-2 mb-2">
            <input 
              type="text" 
              className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all"
              placeholder="Minecraft, Fortnite, Dinosaurs..."
              value={interestInput}
              onChange={e => setInterestInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addInterest()}
            />
            <button 
              onClick={addInterest}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-xl font-bold transition-all"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, idx) => (
              <span key={idx} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                {interest}
                <button onClick={() => removeInterest(idx)} className="text-yellow-900 hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Super Strengths</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all h-24"
              placeholder="What are they good at? (e.g. adding numbers, drawing)"
              value={formData.strengths}
              onChange={e => setFormData({ ...formData, strengths: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">The Challenge Zone</label>
            <textarea 
              className="w-full px-4 py-3 rounded-xl border-2 border-blue-50 focus:border-blue-400 outline-none transition-all h-24"
              placeholder="What are they struggling with? (e.g. spelling, subtraction)"
              value={formData.struggles}
              onChange={e => setFormData({ ...formData, struggles: e.target.value })}
            />
          </div>
        </div>

        <button 
          onClick={() => onSubmit(formData)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-xl font-bold shadow-lg transform hover:-translate-y-1 transition-all"
        >
          Save Hero Profile 🌟
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
