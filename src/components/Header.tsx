import React, { useState } from 'react';
import { Shield, Bell, User, Globe, AlertTriangle, Menu, X, CheckCircle } from 'lucide-react';
import { FarmerProfile, Language } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  farmer: FarmerProfile;
  lang: Language;
  setLang: (lang: Language) => void;
  unreadCount: number;
  onOpenAuth: (mode: 'login' | 'register' | 'admin') => void;
  onSwitchUserRole: (role: 'farmer' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  farmer,
  lang,
  setLang,
  unreadCount,
  onOpenAuth,
  onSwitchUserRole,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard },
    { id: 'scan', label: t.navScan, highlight: true },
    { id: 'weather', label: t.navWeather },
    { id: 'outbreaks', label: t.navOutbreaks },
    { id: 'alerts', label: t.navAlerts, badge: unreadCount },
    { id: 'diseases', label: t.navDiseases },
    { id: 'history', label: t.navHistory },
    { id: 'admin', label: t.navAdmin },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & SIH Pill */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900">{t.appName}</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  SIH 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">{t.appTagline}</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    item.highlight && !active
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold'
                      : active
                      ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-xs font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Controls: Language, Notification Bell, User profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1" />
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  lang === 'en' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  lang === 'hi' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLang('or')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  lang === 'or' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>

            {/* Quick Alerts Bell */}
            <button
              id="header-alerts-bell"
              onClick={() => setCurrentTab('alerts')}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              title="Alert Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Pill / Menu */}
            <div className="relative">
              <button
                id="header-user-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  farmer.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {farmer.name.charAt(0)}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-bold text-slate-800 leading-none">{farmer.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {farmer.role === 'admin' ? 'Admin' : `${farmer.village}`}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-100 py-2 z-50 text-sm">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-900">{farmer.name}</p>
                    <p className="text-xs text-slate-500">{farmer.email}</p>
                    <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                      {farmer.role === 'admin' ? 'KVK Agronomist' : `${farmer.village}, ${farmer.district}`}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Farmer Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      onSwitchUserRole(farmer.role === 'farmer' ? 'admin' : 'farmer');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-indigo-700 font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4 text-indigo-500" />
                    <span>Switch to {farmer.role === 'farmer' ? 'Admin Portal' : 'Farmer Mode'}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      onOpenAuth('login');
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Switch Account / Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 py-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-base font-medium ${
                  currentTab === item.id ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
