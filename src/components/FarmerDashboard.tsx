import React from 'react';
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle, ShieldCheck, ArrowRight, Eye, Sparkles, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { FarmerProfile, WeatherData, DiseaseRiskData, DetectionResult, OutbreakAlert, Language } from '../types';
import { translations } from '../translations';

interface FarmerDashboardProps {
  farmer: FarmerProfile;
  weather: WeatherData | null;
  risk: DiseaseRiskData | null;
  recentDetections: DetectionResult[];
  activeOutbreaks: OutbreakAlert[];
  cropHealthScore: number;
  lang: Language;
  onNavigate: (tab: string) => void;
  onSelectDetection: (detection: DetectionResult) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  weather,
  risk,
  recentDetections,
  activeOutbreaks,
  cropHealthScore,
  lang,
  onNavigate,
  onSelectDetection,
}) => {
  const t = translations[lang];

  // Risk styling helper
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'bg-rose-100 text-rose-800 border-rose-300', dot: 'bg-rose-600', label: 'Critical Risk' };
      case 'HIGH':
        return { bg: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', label: 'High Spore Risk' };
      case 'MODERATE':
        return { bg: 'bg-yellow-100 text-yellow-800 border-yellow-300', dot: 'bg-yellow-500', label: 'Moderate Watch' };
      default:
        return { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500', label: 'Low Risk / Favorable' };
    }
  };

  const riskBadge = getRiskBadge(risk?.risk_level || 'LOW');

  // Filter outbreaks relevant to farmer's district
  const districtOutbreaks = activeOutbreaks.filter(
    o => o.district.toLowerCase() === farmer.district.toLowerCase()
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Farmer Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-600/60 text-emerald-100 text-xs font-semibold border border-emerald-400/30">
              <MapPin className="w-3.5 h-3.5" />
              <span>{farmer.village}, {farmer.district}, {farmer.state}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t.welcomeBack}, {farmer.name}!
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Crops under protection: <span className="font-semibold text-white">{farmer.crops_grown.join(', ')}</span> ({farmer.farm_size_acres} acres)
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              id="dashboard-scan-btn"
              onClick={() => onNavigate('scan')}
              className="px-5 py-3 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-md flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>{t.btnStartScanning}</span>
            </button>
            <button
              onClick={() => onNavigate('outbreaks')}
              className="px-4 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm border border-emerald-500/40 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Outbreak Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Outbreak Emergency Banner if Active in District */}
      {districtOutbreaks.length > 0 && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-4 sm:p-5 rounded-xl shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-bold text-rose-950 flex items-center gap-2">
                  <span>🚨 Community Outbreak Active in {farmer.district}: {districtOutbreaks[0].disease}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-extrabold">
                    {districtOutbreaks[0].case_count} Verified Cases
                  </span>
                </h3>
                <p className="text-sm text-rose-800 mt-1">
                  Affecting: <strong className="font-semibold">{districtOutbreaks[0].affected_villages.join(', ')}</strong>.
                  Prophylactic copper or mancozeb spraying recommended within 5 km buffer.
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => onNavigate('outbreaks')}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 underline flex items-center cursor-pointer"
                  >
                    View Outbreak Radar & Protocol Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Live Weather Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <CloudRain className="w-5 h-5 text-teal-600" />
              <span>{t.currentWeather}</span>
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {weather?.district || farmer.district}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-4xl font-extrabold text-slate-900">{weather?.temperature ?? 27.2}°C</span>
              <p className="text-xs text-slate-500 mt-0.5">Live Open-Meteo Satellite Feed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700 font-bold">
              <Thermometer className="w-6 h-6" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-[11px] text-slate-500 flex items-center justify-center">
                <Droplets className="w-3 h-3 mr-1 text-blue-500" /> Humidity
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{weather?.humidity ?? 84}%</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-[11px] text-slate-500 flex items-center justify-center">
                <CloudRain className="w-3 h-3 mr-1 text-teal-500" /> Rain
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{weather?.rainfall ?? 0} mm</div>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg">
              <div className="text-[11px] text-slate-500 flex items-center justify-center">
                <Wind className="w-3 h-3 mr-1 text-slate-500" /> Wind
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">{weather?.wind_speed ?? 10} km/h</div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="w-full text-center text-xs font-bold text-teal-700 hover:text-teal-900 pt-1 cursor-pointer"
          >
            Detailed Weather Risk Model →
          </button>
        </div>

        {/* 2. Disease Risk Gauge Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{t.diseaseRisk}</span>
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${riskBadge.bg}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${riskBadge.dot}`}></span>
              {riskBadge.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-slate-800">
              {risk?.risk_category || 'Elevated Spore Germination Index'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {risk?.reasons?.[0] || 'Ambient humidity and temperature levels are conducive for foliar pathogens.'}
            </p>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs space-y-1">
            <div className="font-bold text-emerald-900">Recommended Farmer Action:</div>
            <p className="text-emerald-800">
              {risk?.preventive_actions?.[0] || 'Conduct morning field walk and scout leaf undersides.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('weather')}
            className="w-full text-center text-xs font-bold text-emerald-700 hover:text-emerald-900 pt-1 cursor-pointer"
          >
            Run What-If Weather Simulations →
          </button>
        </div>

        {/* 3. Crop Health & Farm Overview */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>{t.cropHealth}</span>
            </h3>
            <span className="text-sm font-extrabold text-indigo-700">
              {cropHealthScore}% Normal
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                cropHealthScore > 80 ? 'bg-emerald-500' : cropHealthScore > 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${cropHealthScore}%` }}
            />
          </div>

          <div className="space-y-2 pt-1 text-xs">
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Potato (Late Blight threat)</span>
              <span className="font-bold text-amber-600">Surveillance</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Tomato (Healthy canopy)</span>
              <span className="font-bold text-emerald-600">Stable</span>
            </div>
            <div className="flex items-center justify-between text-slate-700">
              <span className="font-medium">Rice (Boot leaf stage)</span>
              <span className="font-bold text-emerald-600">Stable</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('diseases')}
            className="w-full text-center text-xs font-bold text-indigo-700 hover:text-indigo-900 pt-1 cursor-pointer"
          >
            Browse Crop Disease Library (25+) →
          </button>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.recentScans}</h2>
            <p className="text-xs text-slate-500">Your recent leaf analyses with verified treatments</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center cursor-pointer"
          >
            <span>View Full History</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentDetections.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectDetection(item)}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img src={item.image_url} alt={item.disease} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-bold">
                    {item.crop}
                  </div>
                  <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[10px] font-bold ${
                    item.severity === 'Severe' || item.severity === 'High'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {item.severity} Severity
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-base">{item.disease}</h3>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.confidence_percentage} Conf.
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.symptoms}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
                <span className="font-bold text-emerald-600 hover:text-emerald-700">View Treatment →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
