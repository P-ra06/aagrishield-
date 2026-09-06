import React from 'react';
import { Shield, Sparkles, CloudRain, AlertTriangle, ArrowRight, CheckCircle2, Eye, MapPin, Database, Zap, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface LandingPageProps {
  lang: Language;
  onNavigate: (tab: string) => void;
  onQuickSampleScan: (sampleKey: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ lang, onNavigate, onQuickSampleScan }) => {
  const t = translations[lang];

  const sampleLeaves = [
    {
      id: 'sample-potato-late-blight',
      title: 'Potato Late Blight',
      crop: 'Potato',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=400&auto=format&fit=crop&q=80',
      tag: 'Critical Outbreak Risk'
    },
    {
      id: 'sample-tomato-early-blight',
      title: 'Tomato Early Blight',
      crop: 'Tomato',
      image: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=400&auto=format&fit=crop&q=80',
      tag: 'Target Spots Observed'
    },
    {
      id: 'sample-rice-blast',
      title: 'Rice Leaf Blast',
      crop: 'Rice',
      image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=400&auto=format&fit=crop&q=80',
      tag: 'Spindle Necrosis'
    },
    {
      id: 'sample-wheat-rust',
      title: 'Wheat Stripe Rust',
      crop: 'Wheat',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
      tag: 'Linear Pustules'
    }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 bg-gradient-to-b from-emerald-50/70 via-teal-50/30 to-white border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Top Banner Tag */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold mb-6 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Smart India Hackathon 2026 • AI-Powered Crop Defense</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {t.heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                <button
                  id="hero-scan-btn"
                  onClick={() => onNavigate('scan')}
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-200 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{t.btnStartScanning}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  id="hero-outbreak-map-btn"
                  onClick={() => onNavigate('outbreaks')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{t.btnExploreMap}</span>
                </button>

                <button
                  id="hero-dashboard-btn"
                  onClick={() => onNavigate('dashboard')}
                  className="px-5 py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm border border-emerald-200 transition-all cursor-pointer"
                >
                  <span>Open Farmer Dashboard</span>
                </button>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" /> Real AI Vision (Gemini 2.5 Flash)
                </span>
                <span className="flex items-center text-teal-700">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-teal-600" /> Live Open-Meteo Weather
                </span>
                <span className="flex items-center text-amber-700">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-amber-600" /> Cross-Village Outbreak Alerting
                </span>
                <span className="flex items-center text-indigo-700">
                  <CheckCircle2 className="w-4 h-4 mr-1 text-indigo-600" /> Odia, Hindi & English
                </span>
              </div>
            </div>

            {/* Visual Interactive Showcase Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-100 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Live Outbreak Alert</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Balasore District</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-100">
                    <div>
                      <div className="text-sm font-bold text-rose-900">Late Blight (Potato)</div>
                      <div className="text-xs text-rose-700 mt-0.5">3 Villages Affected: Balarampur, Remuna, Soro</div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-rose-200 text-rose-900">
                      27 Cases
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>Live Weather Risk: Severe Fungal</span>
                      <span className="text-amber-600 font-bold">84% Humidity</span>
                    </div>
                    <p className="text-slate-500">Recent rain and warm fog trigger rapid Phytophthora spore dispersal.</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs font-bold text-slate-700 mb-2">Test Live AI Leaf Diagnosis With Sample:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {sampleLeaves.slice(0, 2).map(sample => (
                        <button
                          key={sample.id}
                          onClick={() => onQuickSampleScan(sample.id)}
                          className="flex items-center space-x-2 p-2 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left cursor-pointer"
                        >
                          <img src={sample.image} alt={sample.title} className="w-9 h-9 rounded object-cover" />
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-slate-800 truncate">{sample.crop}</div>
                            <div className="text-[10px] text-emerald-600 font-medium truncate">Test Scan →</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Architectural Pillars of AgriShield */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Engineered Specifically for Rural Indian Agriculture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Moving beyond simple image classification into community-wide epidemic containment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-emerald-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">1. Foliar AI Diagnosis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Uploads of leaf photographs are analyzed through multimodal agronomist models. Delivers exact disease identification, confidence score, and symptom breakdowns within seconds.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">2. Weather-Based Risk</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Live Open-Meteo microclimate metrics (temperature, humidity, precipitation, wind) feed into epidemiological formulas to forecast fungal and bacterial spore explosions before symptoms emerge.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-rose-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">3. Village Outbreak Radar</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Aggregates detections across neighboring villages within a configurable time window. When threshold cases are confirmed, an automatic community outbreak perimeter alert is dispatched.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">4. Actionable Agronomy</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Provides farmers with certified chemical and biological treatment steps including exact tank dosages (g/L), resistance-rotation guidelines, and ICAR prevention practices in English, Hindi, and Odia.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Sample Leaf Playground */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-10 text-white shadow-xl">
          <div className="max-w-2xl mb-6">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">Instant Evaluation Sandbox</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">Try Verified Sample Leaf Scans</h2>
            <p className="text-sm text-emerald-100 mt-2">
              Select any verified crop leaf below to test the end-to-end AI diagnosis, treatment recommendation, and outbreak aggregation system instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleLeaves.map((leaf) => (
              <div
                key={leaf.id}
                onClick={() => onQuickSampleScan(leaf.id)}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-xl p-3 border border-white/15 cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
              >
                <div className="relative h-36 rounded-lg overflow-hidden mb-3">
                  <img src={leaf.image} alt={leaf.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white">
                    {leaf.tag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{leaf.title}</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">Crop: {leaf.crop}</p>
                </div>
                <button className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-xs flex items-center justify-center space-x-1 cursor-pointer">
                  <span>Diagnose Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live System Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">100%</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Live Backend APIs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-700">8</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Villages Monitored</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-700">25+</div>
            <div className="text-xs text-slate-500 font-medium mt-1">ICAR Crop Diseases</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-700">3</div>
            <div className="text-xs text-slate-500 font-medium mt-1">Regional Languages</div>
          </div>
        </div>
      </section>
    </div>
  );
};
