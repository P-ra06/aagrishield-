import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Shield, CheckCircle2, Radio, Layers, Info, Filter } from 'lucide-react';
import { VillageMarker, OutbreakAlert, Language } from '../types';
import { translations } from '../translations';

interface OutbreakMapViewProps {
  outbreaks: OutbreakAlert[];
  lang: Language;
}

export const OutbreakMapView: React.FC<OutbreakMapViewProps> = ({ outbreaks, lang }) => {
  const t = translations[lang];

  const [villages, setVillages] = useState<VillageMarker[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<VillageMarker | null>(null);
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string>('All');

  useEffect(() => {
    fetch('/api/villages')
      .then(res => res.json())
      .then(data => {
        setVillages(data);
        if (data.length > 0) setSelectedVillage(data[0]);
      })
      .catch(console.error);
  }, []);

  const diseasesList = ['All', 'Late Blight', 'Rice Blast', 'Yellow Rust', 'Downy Mildew'];

  const filteredVillages = villages.filter(v => {
    if (selectedDiseaseFilter === 'All') return true;
    return v.primaryDisease?.toLowerCase().includes(selectedDiseaseFilter.toLowerCase());
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return { pin: 'bg-rose-600', ring: 'bg-rose-400', text: 'text-rose-600', border: 'border-rose-500' };
      case 'HIGH':
        return { pin: 'bg-amber-500', ring: 'bg-amber-300', text: 'text-amber-600', border: 'border-amber-500' };
      case 'MODERATE':
        return { pin: 'bg-yellow-500', ring: 'bg-yellow-200', text: 'text-yellow-600', border: 'border-yellow-500' };
      default:
        return { pin: 'bg-emerald-500', ring: 'bg-emerald-200', text: 'text-emerald-600', border: 'border-emerald-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200 mb-2">
            <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Community Epidemic Early Warning Radar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Village Disease Outbreak Radar Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time geospatial clustering across neighboring agricultural panchayats.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-white p-2 rounded-xl border border-slate-200 shadow-xs overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1 mr-1 shrink-0" />
          {diseasesList.map(dis => (
            <button
              key={dis}
              onClick={() => setSelectedDiseaseFilter(dis)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                selectedDiseaseFilter === dis
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {dis}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG / Canvas Map View (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between min-h-[520px]">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2 bg-slate-800/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold">AgriShield Geo Radar • Sector North-East & Central</span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 mr-1" /> Critical Outbreak
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1 ml-2" /> High Watch
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1 ml-2" /> Safe
            </div>
          </div>

          {/* SVG Map Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Scaled Interactive Village Pins */}
          <div className="relative my-auto py-12 flex items-center justify-center min-h-[360px]">
            {/* Radar Sweep Animation Circle */}
            <div className="absolute w-72 h-72 rounded-full border border-emerald-500/20 animate-ping pointer-events-none" />
            <div className="absolute w-96 h-96 rounded-full border border-teal-500/10 pointer-events-none" />

            {/* Render Village Nodes */}
            <div className="relative w-full max-w-lg h-80">
              {filteredVillages.map((village, idx) => {
                const color = getRiskColor(village.risk);
                const isSelected = selectedVillage?.id === village.id;

                // Relative positioning formula based on index for aesthetic radar layout
                const positions = [
                  { top: '35%', left: '42%' }, // Balarampur (Center)
                  { top: '25%', left: '55%' }, // Remuna
                  { top: '55%', left: '38%' }, // Soro
                  { top: '65%', left: '60%' }, // Athagarh
                  { top: '75%', left: '72%' }, // Pipili
                  { top: '20%', left: '20%' }, // Baramati
                  { top: '45%', left: '15%' }, // Niphad
                  { top: '15%', left: '80%' }, // Karnal Rural
                ];
                const pos = positions[idx % positions.length];

                return (
                  <div
                    key={village.id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    onClick={() => setSelectedVillage(village)}
                  >
                    {/* Outbreak Pulsing Rings for High/Critical Risk */}
                    {(village.risk === 'CRITICAL' || village.risk === 'HIGH') && (
                      <span className={`absolute -inset-3 rounded-full opacity-75 animate-ping ${color.ring}`} />
                    )}

                    {/* Pin Head */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full ${color.pin} text-white font-extrabold text-xs shadow-lg transition-transform transform group-hover:scale-125 ${
                      isSelected ? 'ring-4 ring-white' : ''
                    }`}>
                      {village.cases}
                    </div>

                    {/* Village Label Pill */}
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-900/90 text-slate-200 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none">
                      {village.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map Footer Bar */}
          <div className="z-10 bg-slate-800/80 backdrop-blur-xs p-3 rounded-xl border border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <span>Radius Range: 25 km Perimeter</span>
            <span className="text-emerald-400 font-semibold">Live Village Sensors Synchronized</span>
          </div>
        </div>

        {/* Selected Village & Active Outbreaks Flyout Panel (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedVillage ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monitored Panchayat</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedVillage.name}</h3>
                  <p className="text-xs text-slate-500">{selectedVillage.district}, {selectedVillage.state}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${getRiskColor(selectedVillage.risk).pin} text-white`}>
                  {selectedVillage.risk} RISK
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Active Cases</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{selectedVillage.cases}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500">Primary Pathogen</div>
                  <div className="text-xs font-bold text-rose-700 mt-1.5 truncate">{selectedVillage.primaryDisease || 'None'}</div>
                </div>
              </div>

              <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Epidemiological Advisory:</span>
                </div>
                <p className="text-amber-800 leading-relaxed">
                  {selectedVillage.cases >= 5
                    ? `Active disease transmission threshold exceeded in ${selectedVillage.name}. Farmers within 5 km should immediately check foliar undersides and apply protective fungicide spray.`
                    : `Infection levels are currently stable in ${selectedVillage.name}. Maintain standard crop hygiene and report any new spots.`}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1">
                <div>Geo Coordinates: {selectedVillage.lat.toFixed(4)}° N, {selectedVillage.lng.toFixed(4)}° E</div>
                <div>Surveillance Node: KVK Regional Agro-Unit</div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center text-slate-500">
              Click any village pin on the map to inspect its real-time case data.
            </div>
          )}

          {/* Multi-Village Active Outbreak Clusters */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span>Active Outbreak Clusters ({outbreaks.length})</span>
              <span className="text-[10px] text-rose-600 font-extrabold bg-rose-50 px-2 py-0.5 rounded">Emergency</span>
            </h4>

            <div className="space-y-2.5">
              {outbreaks.map((ob) => (
                <div key={ob.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ob.disease} ({ob.crop})</span>
                    <span className="text-[10px] font-extrabold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                      {ob.case_count} Cases
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Epicenter: <strong>{ob.focal_village}</strong> ({ob.district})
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Affected: {ob.affected_villages.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
