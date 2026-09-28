import React from 'react';
import {
  LayoutDashboard,
  Users,
  Shield,
  CreditCard,
  TrendingUp,
  Calendar as CalendarIcon,
  Zap,
  Mail,
  FileCode,
  FileSpreadsheet,
  BarChart3,
  FileText,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Lock,
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    pendingEmails,
    setSelectedClientId,
    clients,
    policies,
    fundValues,
    appointments,
    currentBrand,
    currentAccount,
    logoutAccount,
    metrics,
  } = useApp();

  const navItems: Array<{
    id: NavView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'clients',
      label: 'Clients',
      icon: Users,
      badge: metrics.activeClients,
    },
    {
      id: 'policies',
      label: 'Policies',
      icon: Shield,
      badge: metrics.activePolicies,
    },
    {
      id: 'premiums',
      label: 'Premium Tracker',
      icon: CreditCard,
      badge: metrics.upcomingPremiumsCount > 0 ? metrics.upcomingPremiumsCount : undefined,
    },
    {
      id: 'fund_values',
      label: 'Fund Values',
      icon: TrendingUp,
      badge: fundValues.length > 0 ? fundValues.length : undefined,
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: CalendarIcon,
      badge: appointments.length > 0 ? appointments.length : undefined,
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      badge: metrics.pendingReviewsCount > 0 ? metrics.pendingReviewsCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    { id: 'communications', label: 'Communications', icon: Mail },
    { id: 'templates', label: 'Email Templates', icon: Mail },
    { id: 'csv_templates', label: 'CSV Templates', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg text-white font-black tracking-wider text-base shrink-0 transition-transform active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${currentBrand.gradientFrom}, ${currentBrand.gradientTo})`,
          }}
        >
          {currentBrand.monogram}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-white tracking-tight text-base flex items-center gap-1.5">
            <span className="truncate">{currentBrand.shortName}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0"
              style={{
                backgroundColor: `${currentBrand.primaryColor}33`,
                color: currentBrand.id === 'sunlife' ? '#fde047' : currentBrand.primaryColor,
              }}
            >
              Hub
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium truncate">
            {currentBrand.name} CRM
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          const isSunLife = currentBrand.id === 'sunlife';

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                if (item.id === 'clients') {
                  setSelectedClientId(null);
                }
              }}
              style={
                isActive
                  ? {
                      backgroundColor: currentBrand.primaryColor,
                      color: isSunLife ? '#0f172a' : '#ffffff',
                    }
                  : undefined
              }
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'shadow-md font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? isSunLife
                        ? 'text-slate-900'
                        : 'text-white'
                      : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    item.badgeColor || (isActive ? 'bg-black/20 text-current' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Adviser Card Footer with Account Isolation & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-xs">
          <div
            className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: currentBrand.primaryColor }}
          >
            {currentAccount?.initials || 'FA'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {currentAccount?.name || 'Financial Adviser'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {currentAccount?.role || `${currentBrand.shortName} Advisory`}
            </p>
          </div>
          <button
            type="button"
            onClick={logoutAccount}
            title="Log Out & Switch Account"
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock className="w-2.5 h-2.5" />
            <span>Private Sandbox</span>
          </span>
          <span className="text-slate-500 font-mono text-[9px]">
            ID: {currentAccount?.id.slice(0, 10)}
          </span>
        </div>

        {/* Legal & OAuth Compliance Links */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-900">
          <a
            href="/privacy"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/privacy');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:text-slate-300 transition-colors underline cursor-pointer"
          >
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a
            href="/terms"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/terms');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:text-slate-300 transition-colors underline cursor-pointer"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </aside>
  );
};
