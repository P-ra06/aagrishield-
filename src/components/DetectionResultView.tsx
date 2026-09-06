import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ArrowLeft, Printer, MapPin, Sparkles, BookOpen, Clock, AlertOctagon } from 'lucide-react';
import { DetectionResult, OutbreakAlert, Language } from '../types';
import { translations } from '../translations';

interface DetectionResultViewProps {
  detection: DetectionResult;
  outbreakAlert: OutbreakAlert | null;
  lang: Language;
  onBackToScan: () => void;
  onNavigate: (tab: string) => void;
}

export const DetectionResultView: React.FC<DetectionResultViewProps> = ({
  detection,
  outbreakAlert,
  lang,
  onBackToScan,
  onNavigate,
}) => {
  const t = translations[lang];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Severe':
      case 'High':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToScan}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Scan Another Leaf</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-xs hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => onNavigate('outbreaks')}
            className="flex items-center space-x-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-2 rounded-lg shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Outbreak Radar</span>
          </button>
        </div>
      </div>

      {/* Community Outbreak Escalation Banner if this detection triggered an outbreak */}
      {outbreakAlert && (
        <div className="bg-rose-600 text-white rounded-2xl p-5 shadow-lg space-y-2 animate-pulse">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-6 h-6 text-rose-200 shrink-0" />
            <h3 className="text-base sm:text-lg font-extrabold uppercase tracking-wide">
              🚨 Community Outbreak Alert Triggered!
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            This diagnosis has pushed confirmed cases of <strong>{detection.disease}</strong> to <strong>{outbreakAlert.case_count} cases</strong> in {outbreakAlert.district} across villages: {outbreakAlert.affected_villages.join(', ')}.
            Perimeter containment advisory broadcasted.
          </p>
        </div>
      )}

      {/* Main Diagnostic Certificate Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Foliar Pathological Diagnosis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {detection.disease}
            </h1>
            <p className="text-emerald-100 text-sm mt-0.5">
              Identified Host Crop: <strong className="text-white">{detection.crop}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 text-center border border-white/20">
              <div className="text-2xl font-black text-emerald-300">{detection.confidence_percentage}</div>
              <div className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">AI Confidence</div>
            </div>
            <div className={`px-3 py-2 rounded-xl text-xs font-extrabold border ${getSeverityBadge(detection.severity)}`}>
              {detection.severity} Severity
            </div>
          </div>
        </div>

        {/* Certificate Body Grid */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Scanned Leaf Thumbnail & Metadata */}
            <div className="md:col-span-4 space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={detection.image_url}
                  alt={detection.disease}
                  className="w-full h-52 object-cover"
                />
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Analysis Engine:</span>
                  <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px]">{detection.engine}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="font-semibold text-slate-800">{new Date(detection.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-slate-800">{detection.village || 'Balarampur'}, {detection.district || 'Balasore'}</span>
                </div>
              </div>
            </div>

            {/* Pathological Symptoms Breakdown */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center space-x-1.5 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Observed Foliar Symptoms</span>
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {detection.symptoms}
                </p>
              </div>

              {/* Immediate Warning Signs Box */}
              {detection.warning_signs && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{t.warningSigns}:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed">{detection.warning_signs}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section: Recommended Curative Treatment (Chemical & Biological with Dosage) */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{t.recommendedTreatment}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {detection.treatment.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-950 flex items-start space-x-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="leading-relaxed font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Preventive Agronomic Measures */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>{t.preventiveGuidelines}</span>
            </h3>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-700">
              {detection.prevention.map((prev, idx) => (
                <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="leading-relaxed">{prev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
