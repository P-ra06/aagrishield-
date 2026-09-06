import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, AlertTriangle, ShieldCheck, Thermometer, Droplets, X, ArrowRight } from 'lucide-react';
import { DiseaseItem, Language } from '../types';
import { translations } from '../translations';

interface DiseaseDirectoryViewProps {
  lang: Language;
}

export const DiseaseDirectoryView: React.FC<DiseaseDirectoryViewProps> = ({ lang }) => {
  const t = translations[lang];

  const [diseases, setDiseases] = useState<DiseaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [activeModalDisease, setActiveModalDisease] = useState<DiseaseItem | null>(null);

  useEffect(() => {
    fetch('/api/diseases')
      .then(res => res.json())
      .then(data => setDiseases(data))
      .catch(console.error);
  }, []);

  const crops = ['All', 'Potato', 'Tomato', 'Rice', 'Wheat', 'Corn', 'Cotton', 'Grape'];

  const filtered = diseases.filter(d => {
    const matchesCrop = selectedCrop === 'All' || d.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.pathogen.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>ICAR Crop Pathology Reference Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.allDiseasesTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Detailed symptoms, pathogen triggers, certified chemical spray dosages, and resistance prevention protocols.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t.searchDiseasePlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCrop === crop
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalDisease(item)}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                  {item.crop}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-bold">
                  {item.severity} Severity
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                  <p className="text-[11px] text-slate-500 italic">{item.pathogen} ({item.pathogen_type})</p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{item.symptoms}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs font-bold text-emerald-600 hover:text-emerald-700">
              <span>View Treatment & Dosage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal / Drawer */}
      {activeModalDisease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
              <img src={activeModalDisease.image} alt={activeModalDisease.name} className="w-full h-full object-cover opacity-80" />
              <button
                onClick={() => setActiveModalDisease(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-600 uppercase">
                  {activeModalDisease.crop}
                </span>
                <h2 className="text-2xl font-black mt-1 text-white">{activeModalDisease.name}</h2>
                <p className="text-xs text-emerald-200 italic">{activeModalDisease.pathogen}</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Climate Triggers Box */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <div>
                    <span className="text-slate-500">Optimal Temp:</span>{' '}
                    <strong className="text-slate-800">{activeModalDisease.optimal_temp_min}°C – {activeModalDisease.optimal_temp_max}°C</strong>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="text-slate-500">Critical Humidity:</span>{' '}
                    <strong className="text-slate-800">&gt;{activeModalDisease.critical_humidity_pct}% RH</strong>
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Foliar Symptoms</h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg">
                  {activeModalDisease.symptoms}
                </p>
              </div>

              {/* Curative Treatment */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Prescribed Treatment & Spray Dosages</span>
                </h4>
                <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                  {activeModalDisease.treatment}
                </p>
              </div>

              {/* Prevention */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Cultural & Preventive Practices</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                  {activeModalDisease.prevention}
                </p>
              </div>

              {/* Danger Warning Signs */}
              {activeModalDisease.warning_signs && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-amber-900 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Danger Signs:</span>
                  </span>
                  <p className="text-amber-800">{activeModalDisease.warning_signs}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
