import React from 'react';
import { Shield, Sparkles, MapPin, Award } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

export const Footer: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{t.appName}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                Smart India Hackathon
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              AI-driven agricultural ecosystem integrating computer vision disease diagnostics, real-time Open-Meteo epidemiological spore risk computation, and automated cross-village outbreak quarantine clustering.
            </p>
            <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                Gemini 2.5 Multimodal AI
              </span>
              <span className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-teal-400" />
                Village Cluster Radar
              </span>
              <span className="flex items-center">
                <Award className="w-3.5 h-3.5 mr-1 text-amber-400" />
                ICAR Agronomy Index
              </span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Core Modules</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Real-time Foliar AI Classification</li>
              <li>• Village Outbreak Geo Clustering</li>
              <li>• Open-Meteo Microclimate Index</li>
              <li>• Chemical & Bio Dosage Prescriptions</li>
              <li>• English, Hindi & Odia Translation</li>
            </ul>
          </div>

          {/* System Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">SIH Prototype Spec</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• REST Backend: Django & Express</li>
              <li>• Neural Architecture: MobileNetV3 / ResNet</li>
              <li>• Frontend: React 19, Vite, Tailwind CSS</li>
              <li>• Database: Relational Schema & Outbreak Aggregation</li>
              <li>• Status: <span className="text-emerald-400 font-semibold">Live Operational</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 AgriShield. Smart India Hackathon Prototype. Dedicated to Indian Farmers.</p>
          <p className="mt-2 sm:mt-0">Balasore • Cuttack • Pune • Nashik • Karnal • Ludhiana</p>
        </div>
      </div>
    </footer>
  );
};
