import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { FarmerDashboard } from './components/FarmerDashboard';
import { UploadDetection } from './components/UploadDetection';
import { DetectionResultView } from './components/DetectionResultView';
import { DiseaseHistoryView } from './components/DiseaseHistoryView';
import { WeatherRiskView } from './components/WeatherRiskView';
import { OutbreakMapView } from './components/OutbreakMapView';
import { AlertsView } from './components/AlertsView';
import { DiseaseDirectoryView } from './components/DiseaseDirectoryView';
import { FarmerProfileView } from './components/FarmerProfileView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import {
  FarmerProfile,
  WeatherData,
  DiseaseRiskData,
  DetectionResult,
  OutbreakAlert,
  AlertNotification,
  Language
} from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [lang, setLang] = useState<Language>('en');

  // Core Data State
  const [farmer, setFarmer] = useState<FarmerProfile>({
    id: 'farmer-101',
    name: 'Rameshwar Pradhan',
    email: 'rameshwar.farmer@agrishield.in',
    phone: '+91 98610 23456',
    village: 'Balarampur',
    district: 'Balasore',
    state: 'Odisha',
    crops_grown: ['Potato', 'Tomato', 'Rice'],
    preferred_language: 'en',
    role: 'farmer',
    farm_size_acres: 3.5,
    created_at: new Date().toISOString(),
  });

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [risk, setRisk] = useState<DiseaseRiskData | null>(null);
  const [recentDetections, setRecentDetections] = useState<DetectionResult[]>([]);
  const [activeOutbreaks, setActiveOutbreaks] = useState<OutbreakAlert[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(0);
  const [cropHealthScore, setCropHealthScore] = useState<number>(76);

  // Active Detection Result
  const [activeDetectionResult, setActiveDetectionResult] = useState<DetectionResult | null>(null);
  const [activeOutbreakTrigger, setActiveOutbreakTrigger] = useState<OutbreakAlert | null>(null);
  const [preSelectedSample, setPreSelectedSample] = useState<string | null>(null);

  // Auth Dialog
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');

  // Initial Data Fetch
  const refreshDashboardData = async () => {
    try {
      const dashRes = await fetch('/api/dashboard');
      if (dashRes.ok) {
        const d = await dashRes.json();
        if (d.farmer) setFarmer(d.farmer);
        if (d.weather) setWeather(d.weather);
        if (d.disease_risk) setRisk(d.disease_risk);
        if (d.recent_detections) setRecentDetections(d.recent_detections);
        if (d.active_outbreaks) setActiveOutbreaks(d.active_outbreaks);
        if (typeof d.unread_alerts_count === 'number') setUnreadAlertsCount(d.unread_alerts_count);
        if (typeof d.crop_health_score === 'number') setCropHealthScore(d.crop_health_score);
      }

      const alertsRes = await fetch('/api/alerts');
      if (alertsRes.ok) {
        const a = await alertsRes.json();
        setAlerts(a.alerts || []);
        setUnreadAlertsCount(a.unread_count || 0);
      }

      const outbreaksRes = await fetch('/api/outbreaks');
      if (outbreaksRes.ok) {
        const ob = await outbreaksRes.json();
        setActiveOutbreaks(ob.outbreaks || []);
      }
    } catch (e) {
      console.error('[Dashboard Sync Error]', e);
    }
  };

  useEffect(() => {
    refreshDashboardData();
  }, []);

  // Handlers
  const handleDetectionComplete = (detection: DetectionResult, outbreakAlert: OutbreakAlert | null) => {
    setActiveDetectionResult(detection);
    setActiveOutbreakTrigger(outbreakAlert);
    setRecentDetections(prev => [detection, ...prev]);
    setCurrentTab('result');
    refreshDashboardData();
  };

  const handleSelectDetection = (detection: DetectionResult) => {
    setActiveDetectionResult(detection);
    setActiveOutbreakTrigger(null);
    setCurrentTab('result');
  };

  const handleMarkRead = async (id: string) => {
    try {
      await fetch(`/api/alerts/${id}/read`, { method: 'POST' });
      setAlerts(prev => prev.map(a => (a.id === id ? { ...a, is_read: true } : a)));
      setUnreadAlertsCount(prev => Math.max(prev - 1, 0));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
    setUnreadAlertsCount(0);
  };

  const handleOpenAuth = (mode: 'login' | 'register' | 'admin') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (user: FarmerProfile) => {
    setFarmer(user);
    if (user.preferred_language) setLang(user.preferred_language);
    if (user.role === 'admin') setCurrentTab('admin');
    else setCurrentTab('dashboard');
    refreshDashboardData();
  };

  const handleSwitchUserRole = (newRole: 'farmer' | 'admin') => {
    setFarmer(prev => ({ ...prev, role: newRole }));
    if (newRole === 'admin') setCurrentTab('admin');
    else setCurrentTab('dashboard');
  };

  const handleQuickSampleScan = (sampleKey: string) => {
    setPreSelectedSample(sampleKey);
    setCurrentTab('scan');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* Sticky Header with Navigation & Quick Actions */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        farmer={farmer}
        lang={lang}
        setLang={setLang}
        unreadCount={unreadAlertsCount}
        onOpenAuth={handleOpenAuth}
        onSwitchUserRole={handleSwitchUserRole}
      />

      {/* Main Dynamic View Router */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            lang={lang}
            onNavigate={setCurrentTab}
            onQuickSampleScan={handleQuickSampleScan}
          />
        )}

        {currentTab === 'dashboard' && (
          <FarmerDashboard
            farmer={farmer}
            weather={weather}
            risk={risk}
            recentDetections={recentDetections}
            activeOutbreaks={activeOutbreaks}
            cropHealthScore={cropHealthScore}
            lang={lang}
            onNavigate={setCurrentTab}
            onSelectDetection={handleSelectDetection}
          />
        )}

        {currentTab === 'scan' && (
          <UploadDetection
            lang={lang}
            onDetectionComplete={handleDetectionComplete}
            preSelectedSample={preSelectedSample}
          />
        )}

        {currentTab === 'result' && activeDetectionResult && (
          <DetectionResultView
            detection={activeDetectionResult}
            outbreakAlert={activeOutbreakTrigger}
            lang={lang}
            onBackToScan={() => {
              setPreSelectedSample(null);
              setCurrentTab('scan');
            }}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'history' && (
          <DiseaseHistoryView
            detections={recentDetections}
            lang={lang}
            onSelectDetection={handleSelectDetection}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'weather' && (
          <WeatherRiskView
            initialWeather={weather}
            lang={lang}
          />
        )}

        {currentTab === 'outbreaks' && (
          <OutbreakMapView
            outbreaks={activeOutbreaks}
            lang={lang}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            alerts={alerts}
            lang={lang}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'diseases' && (
          <DiseaseDirectoryView
            lang={lang}
          />
        )}

        {currentTab === 'profile' && (
          <FarmerProfileView
            farmer={farmer}
            lang={lang}
            onUpdateProfile={(updated) => {
              setFarmer(updated);
              if (updated.preferred_language) setLang(updated.preferred_language);
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView
            lang={lang}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer lang={lang} />

      {/* Quick Auth & Demo Login Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        lang={lang}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
