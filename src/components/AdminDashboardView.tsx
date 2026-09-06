import React, { useState, useEffect } from 'react';
import { Shield, Users, Eye, AlertTriangle, Settings, Sliders, CheckCircle2, TrendingUp, MapPin, Activity } from 'lucide-react';
import { Language } from '../types';

interface AdminDashboardViewProps {
  lang: Language;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ lang }) => {
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [thresholdCases, setThresholdCases] = useState(3);
  const [timeframeDays, setTimeframeDays] = useState(7);
  const [radiusKm, setRadiusKm] = useState(25);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      setAdminData(data);
      if (data.threshold_settings) {
        setThresholdCases(data.threshold_settings.threshold_cases);
        setTimeframeDays(data.threshold_settings.timeframe_days);
        setRadiusKm(data.threshold_settings.radius_km);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/outbreaks/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threshold_cases: thresholdCases,
          timeframe_days: timeframeDays,
          radius_km: radiusKm,
        }),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !adminData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading agricultural surveillance data...
      </div>
    );
  }

  const { metrics, disease_distribution, crop_distribution, village_cases, recent_outbreaks } = adminData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200 mb-2">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>KVK & Agronomy Surveillance Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Regional Outbreak & Crop Analytics Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            District-wide disease telemetry, pathogen frequency, and epidemic cluster controls.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs cursor-pointer self-start md:self-auto"
        >
          Refresh Telemetry
        </button>
      </div>

      {/* Top 4 Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.total_farmers}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">+14 new this week</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Foliar Scans Processed</span>
            <Eye className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{metrics.total_scans}</div>
          <p className="text-[11px] text-teal-600 font-semibold">Real AI vision diagnoses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Outbreaks</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">{metrics.active_outbreaks}</div>
          <p className="text-[11px] text-rose-600 font-semibold">Under perimeter containment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>High Risk Panchayats</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">{metrics.high_risk_villages}</div>
          <p className="text-[11px] text-slate-500 font-semibold">Out of {metrics.monitored_villages} monitored</p>
        </div>
      </div>

      {/* Disease Distribution & Crop Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Disease Frequency Bar Breakdown */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Primary Pathogen Prevalence</h3>
            <span className="text-xs text-slate-400">Past 30 Days</span>
          </div>

          <div className="space-y-3 pt-2">
            {disease_distribution.map((item: any) => {
              const maxCount = Math.max(...disease_distribution.map((d: any) => d.count), 50);
              const percentage = Math.round((item.count / maxCount) * 100);

              return (
                <div key={item.disease} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{item.disease}</span>
                    <span className="text-slate-500 font-bold">{item.count} detections</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crops Under Attack */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Crop Vulnerability Index</h3>

          <div className="space-y-3 pt-2">
            {crop_distribution.map((item: any) => (
              <div key={item.crop} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-bold text-slate-800">{item.crop}</span>
                <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded">
                  {item.count}% acreage affected
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Village Hotspot Table & Outbreak Threshold Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Village Cases Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Village Surveillance Hotspots</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="pb-2">Village</th>
                  <th className="pb-2">Active Cases</th>
                  <th className="pb-2">Primary Disease</th>
                  <th className="pb-2">Risk Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {village_cases.map((v: any) => (
                  <tr key={v.village} className="hover:bg-slate-50">
                    <td className="py-2.5 font-bold text-slate-900">{v.village}</td>
                    <td className="py-2.5 font-semibold text-slate-700">{v.cases}</td>
                    <td className="py-2.5 text-slate-600">{v.disease || 'None'}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        v.risk === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                        v.risk === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {v.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Configurable Outbreak Threshold Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Outbreak Detection Algorithm Thresholds</span>
            </h3>
            <p className="text-xs text-slate-500">
              When confirmed cases of the same disease reach this threshold within the window, an automatic community outbreak alert is dispatched.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 pt-2">
            {settingsSaved && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Threshold parameters saved!</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Trigger Threshold (Cases)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={thresholdCases}
                onChange={(e) => setThresholdCases(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
              <span className="text-[10px] text-slate-400">Current default: 3 cases in district</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Evaluation Window (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={timeframeDays}
                onChange={(e) => setTimeframeDays(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Containment Radius (Kilometers)</label>
              <input
                type="number"
                min="5"
                max="100"
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs cursor-pointer"
            >
              Update Outbreak Threshold Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
