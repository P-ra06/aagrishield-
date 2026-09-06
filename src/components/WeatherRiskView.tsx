import React, { useState, useEffect } from 'react';
import { CloudRain, Thermometer, Droplets, Wind, AlertTriangle, ShieldCheck, RefreshCw, Sliders, Info, CheckCircle2 } from 'lucide-react';
import { WeatherData, DiseaseRiskData, Language } from '../types';
import { translations } from '../translations';

interface WeatherRiskViewProps {
  initialWeather: WeatherData | null;
  lang: Language;
}

export const WeatherRiskView: React.FC<WeatherRiskViewProps> = ({ initialWeather, lang }) => {
  const t = translations[lang];

  const districts = ['Balasore', 'Cuttack', 'Puri', 'Pune', 'Nashik', 'Karnal', 'Ludhiana'];
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialWeather?.district || 'Balasore');
  const [weather, setWeather] = useState<WeatherData | null>(initialWeather);
  const [riskData, setRiskData] = useState<DiseaseRiskData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // What-If Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simTemp, setSimTemp] = useState<number>(24);
  const [simHumidity, setSimHumidity] = useState<number>(85);
  const [simRainfall, setSimRainfall] = useState<number>(3.5);
  const [simWind, setSimWind] = useState<number>(12);

  const fetchDistrictRisk = async (district: string, temp?: number, hum?: number, rain?: number, wind?: number) => {
    setLoading(true);
    try {
      let url = `/api/risk?district=${district}`;
      if (temp !== undefined) url += `&temp=${temp}&humidity=${hum}&rainfall=${rain}&wind=${wind}`;

      const res = await fetch(url);
      const data = await res.json();
      setRiskData(data);
      if (!temp) {
        setWeather(data.weather);
        setSimTemp(data.weather.temperature);
        setSimHumidity(data.weather.humidity);
        setSimRainfall(data.weather.rainfall);
        setSimWind(data.weather.wind_speed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistrictRisk(selectedDistrict);
  }, [selectedDistrict]);

  const handleSimulateChange = (temp: number, hum: number, rain: number, wind: number) => {
    setSimTemp(temp);
    setSimHumidity(hum);
    setSimRainfall(rain);
    setSimWind(wind);
    setIsSimulating(true);
    fetchDistrictRisk(selectedDistrict, temp, hum, rain, wind);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    fetchDistrictRisk(selectedDistrict);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return { bg: 'bg-rose-50 border-rose-300 text-rose-900', badge: 'bg-rose-600 text-white', ring: 'ring-rose-500' };
      case 'HIGH':
        return { bg: 'bg-amber-50 border-amber-300 text-amber-900', badge: 'bg-amber-600 text-white', ring: 'ring-amber-500' };
      case 'MODERATE':
        return { bg: 'bg-yellow-50 border-yellow-300 text-yellow-900', badge: 'bg-yellow-600 text-white', ring: 'ring-yellow-500' };
      default:
        return { bg: 'bg-emerald-50 border-emerald-300 text-emerald-900', badge: 'bg-emerald-600 text-white', ring: 'ring-emerald-500' };
    }
  };

  const currentLevel = riskData?.risk_level || 'LOW';
  const colors = getRiskColor(currentLevel);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 mb-2">
            <CloudRain className="w-3.5 h-3.5 text-teal-600" />
            <span>Open-Meteo Satellite Atmospheric Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Weather Epidemiological Risk Forecaster
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time correlation of microclimate thresholds with fungal, bacterial, and pest sporulation.
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-600 pl-2">Region:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-emerald-500"
          >
            {districts.map(d => (
              <option key={d} value={d}>{d} District</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Risk Status Banner */}
      <div className={`p-6 sm:p-8 rounded-2xl border-2 transition-all shadow-sm ${colors.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-black/10">
          <div className="space-y-1">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${colors.badge}`}>
              {currentLevel} DISEASE RISK
            </span>
            <h2 className="text-xl sm:text-2xl font-black">{riskData?.risk_category}</h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {isSimulating ? (
              <div className="flex items-center space-x-2 bg-amber-200/80 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300">
                <Sliders className="w-4 h-4" />
                <span>Simulated Microclimate Active</span>
                <button
                  onClick={handleResetSimulation}
                  className="ml-2 underline font-bold cursor-pointer hover:text-amber-950"
                >
                  Reset to Live
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Live Satellite Synchronization</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Epidemiological Assessment</h4>
            <ul className="space-y-2 text-xs leading-relaxed">
              {riskData?.reasons?.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Vulnerable Pathogens:</h4>
              <div className="flex flex-wrap gap-1.5">
                {riskData?.possible_diseases?.map((dis, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-md bg-white/80 border border-black/10 text-xs font-bold">
                    {dis}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Immediate Preventive Advisory</h4>
            <div className="space-y-2 text-xs">
              {riskData?.preventive_actions?.map((act, idx) => (
                <div key={idx} className="bg-white/80 p-2.5 rounded-lg border border-black/10 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Microclimate Simulator */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-teal-600" />
              <span>Interactive "What-If" Weather Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Drag the sliders below to test how extreme monsoon, fog, or drought swings affect pathogen outbreak triggers in real time.
            </p>
          </div>
          {isSimulating && (
            <button
              onClick={handleResetSimulation}
              className="text-xs font-bold text-teal-700 hover:text-teal-900 border border-teal-200 bg-teal-50 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Reset to Live Values
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Temperature Slider */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center"><Thermometer className="w-4 h-4 mr-1 text-red-500" /> Temperature</span>
              <span className="text-sm font-extrabold text-slate-900">{simTemp}°C</span>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="0.5"
              value={simTemp}
              onChange={(e) => handleSimulateChange(Number(e.target.value), simHumidity, simRainfall, simWind)}
              className="w-full accent-red-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>10°C (Cold)</span>
              <span>45°C (Heatwave)</span>
            </div>
          </div>

          {/* Humidity Slider */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center"><Droplets className="w-4 h-4 mr-1 text-blue-500" /> Humidity</span>
              <span className="text-sm font-extrabold text-blue-700">{simHumidity}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={simHumidity}
              onChange={(e) => handleSimulateChange(simTemp, Number(e.target.value), simRainfall, simWind)}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>20% (Arid)</span>
              <span>100% (Saturated)</span>
            </div>
          </div>

          {/* Rainfall Slider */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center"><CloudRain className="w-4 h-4 mr-1 text-teal-500" /> Rain (24h)</span>
              <span className="text-sm font-extrabold text-teal-700">{simRainfall} mm</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={simRainfall}
              onChange={(e) => handleSimulateChange(simTemp, simHumidity, Number(e.target.value), simWind)}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>0 mm (Dry)</span>
              <span>50 mm (Heavy Rain)</span>
            </div>
          </div>

          {/* Wind Speed Slider */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center"><Wind className="w-4 h-4 mr-1 text-slate-500" /> Wind Velocity</span>
              <span className="text-sm font-extrabold text-slate-800">{simWind} km/h</span>
            </div>
            <input
              type="range"
              min="2"
              max="40"
              step="1"
              value={simWind}
              onChange={(e) => handleSimulateChange(simTemp, simHumidity, simRainfall, Number(e.target.value))}
              className="w-full accent-slate-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
              <span>2 km/h (Calm)</span>
              <span>40 km/h (Squall)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
