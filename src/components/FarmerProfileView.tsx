import React, { useState } from 'react';
import { User, Phone, MapPin, Globe, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { translations } from '../translations';

interface FarmerProfileViewProps {
  farmer: FarmerProfile;
  lang: Language;
  onUpdateProfile: (updated: FarmerProfile) => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  farmer,
  lang,
  onUpdateProfile,
}) => {
  const t = translations[lang];

  const [name, setName] = useState(farmer.name);
  const [phone, setPhone] = useState(farmer.phone);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);
  const [cropsGrown, setCropsGrown] = useState(farmer.crops_grown.join(', '));
  const [farmSize, setFarmSize] = useState(farmer.farm_size_acres);
  const [preferredLang, setPreferredLang] = useState<Language>(farmer.preferred_language);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          village,
          district,
          state,
          crops_grown: cropsGrown.split(',').map(s => s.trim()),
          farm_size_acres: farmSize,
          preferred_language: preferredLang,
        }),
      });

      const data = await res.json();
      onUpdateProfile(data.user);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Farmer Agronomic Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your village and crop details determine local outbreak alerts and tailored pathogen warnings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile and surveillance parameters updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Farmer Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Phone / WhatsApp for SMS Alerts</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Village / Panchayat</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Cultivated Farm Size (Acres)</label>
            <input
              type="number"
              step="0.1"
              value={farmSize}
              onChange={(e) => setFarmSize(Number(e.target.value))}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Crops Grown (Comma separated)</label>
          <input
            type="text"
            value={cropsGrown}
            onChange={(e) => setCropsGrown(e.target.value)}
            placeholder="Potato, Tomato, Rice, Wheat"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
          />
          <p className="text-[11px] text-slate-400">Used to filter relevant outbreak alerts.</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700">Preferred Communication Language</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी (Hindi)' },
              { id: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
            ].map(item => (
              <button
                type="button"
                key={item.id}
                onClick={() => setPreferredLang(item.id as Language)}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                  preferredLang === item.id
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
