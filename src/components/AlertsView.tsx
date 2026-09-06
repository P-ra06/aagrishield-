import React, { useState } from 'react';
import { Bell, AlertTriangle, CloudRain, CheckCircle, CheckCheck, Eye, ShieldAlert, Sparkles } from 'lucide-react';
import { AlertNotification, Language } from '../types';
import { translations } from '../translations';

interface AlertsViewProps {
  alerts: AlertNotification[];
  lang: Language;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (tab: string) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  lang,
  onMarkRead,
  onMarkAllRead,
  onNavigate,
}) => {
  const t = translations[lang];
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'OUTBREAK' | 'WEATHER'>('ALL');

  const filtered = alerts.filter(a => {
    if (filter === 'UNREAD') return !a.is_read;
    if (filter === 'OUTBREAK') return a.type === 'OUTBREAK';
    if (filter === 'WEATHER') return a.type === 'WEATHER_RISK';
    return true;
  });

  const getAlertIcon = (type: string, severity: string) => {
    if (type === 'OUTBREAK' || severity === 'CRITICAL') {
      return <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />;
    }
    if (type === 'WEATHER_RISK') {
      return <CloudRain className="w-5 h-5 text-amber-600 shrink-0" />;
    }
    if (type === 'DETECTION') {
      return <AlertTriangle className="w-5 h-5 text-indigo-600 shrink-0" />;
    }
    return <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Agricultural Alert Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Community outbreak warnings, weather spore notices, and foliar diagnosis alerts.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>{t.markAllRead}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'UNREAD' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread Only ({alerts.filter(a => !a.is_read).length})
        </button>
        <button
          onClick={() => setFilter('OUTBREAK')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'OUTBREAK' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Village Outbreaks
        </button>
        <button
          onClick={() => setFilter('WEATHER')}
          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            filter === 'WEATHER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Weather Advisories
        </button>
      </div>

      {/* Alert Feed */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="font-semibold text-base">No notifications found in this category.</p>
          <p className="text-xs mt-1">All agricultural alerts have been cleared.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                item.is_read
                  ? 'bg-white border-slate-200 opacity-80'
                  : item.severity === 'CRITICAL'
                  ? 'bg-rose-50/80 border-rose-300 shadow-xs ring-1 ring-rose-200'
                  : 'bg-white border-emerald-200 shadow-xs'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="mt-0.5">{getAlertIcon(item.type, item.severity)}</div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-bold ${item.severity === 'CRITICAL' ? 'text-rose-950' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>
                    {!item.is_read && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{item.message}</p>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-3 pt-1">
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span>Village: {item.village}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                {item.type === 'OUTBREAK' && (
                  <button
                    onClick={() => onNavigate('outbreaks')}
                    className="text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    View Radar Map
                  </button>
                )}
                {!item.is_read && (
                  <button
                    onClick={() => onMarkRead(item.id)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
