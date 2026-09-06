import React, { useState } from 'react';
import { Search, Calendar, MapPin, Eye, Filter } from 'lucide-react';
import { DetectionResult, Language } from '../types';
import { translations } from '../translations';

interface DiseaseHistoryViewProps {
  detections: DetectionResult[];
  lang: Language;
  onSelectDetection: (detection: DetectionResult) => void;
  onNavigate: (tab: string) => void;
}

export const DiseaseHistoryView: React.FC<DiseaseHistoryViewProps> = ({
  detections,
  lang,
  onSelectDetection,
  onNavigate,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');

  const crops = ['All', 'Potato', 'Tomato', 'Rice', 'Wheat', 'Corn', 'Cotton'];

  const filtered = detections.filter(d => {
    const matchesCrop = selectedCrop === 'All' || d.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesQuery = d.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCrop && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Foliar Disease Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse all verified pathological inspections and agronomic treatment prescriptions.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scan')}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 self-start md:self-auto cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          <span>New Leaf Scan</span>
        </button>
      </div>

      {/* Search & Filter Tabs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search past scans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-emerald-500"
          />
        </div>

        {/* Crop Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {crops.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCrop(crop)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Grid of Past Scans */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="font-semibold text-base">No scans found matching your search.</p>
          <p className="text-xs mt-1">Try changing the crop filter or scanning a new leaf photo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDetection(item)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img src={item.image_url} alt={item.disease} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                    {item.crop}
                  </span>
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.severity === 'Severe' || item.severity === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {item.severity} Severity
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{item.disease}</h3>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.confidence_percentage}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.symptoms}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="font-bold text-emerald-600 hover:text-emerald-700">View Prescription →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
