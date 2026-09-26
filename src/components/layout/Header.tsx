import React, { useState } from 'react';
import {
  Search,
  Plus,
  CalendarPlus,
  CheckCircle2,
  AlertCircle,
  Bell,
  RefreshCw,
  Palette,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenAddClient: () => void;
  onOpenNewAppointment: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddClient, onOpenNewAppointment }) => {
  const {
    isGoogleConnected,
    googleEmail,
    setActiveView,
    clients,
    openClientProfile,
    syncCalendarFromGoogle,
    pendingEmails,
    currentBrand,
    setBrandTheme,
    allBrands,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showBrandMenu, setShowBrandMenu] = useState(false);

  const searchResults = searchTerm.trim()
    ? clients.filter(
        (c) =>
          !c.isArchived &&
          (`${c.firstName} ${c.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.mobileNumber.includes(searchTerm))
      )
    : [];

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncCalendarFromGoogle();
    setIsSyncing(false);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Bar & Client Quick Jump */}
      <div className="relative w-80 lg:w-96">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name, email, phone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </div>

        {/* Quick Search Dropdown */}
        {isSearching && searchTerm.trim() && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-72 overflow-y-auto">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Clients Matching "{searchTerm}"
            </div>
            {searchResults.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-500">No matching clients found.</div>
            ) : (
              searchResults.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    openClientProfile(client.id);
                    setIsSearching(false);
                    setSearchTerm('');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between group transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{client.email} • {client.occupation}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {client.clientStatus}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Google Status Badge */}
        {isGoogleConnected ? (
          <button
            onClick={() => setActiveView('settings')}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition-colors"
            title={`Connected to Google (${googleEmail})`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-emerald-900">Google Connected</span>
            <span className="text-emerald-700/80 font-normal">({googleEmail})</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveView('settings')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Connect Google Account</span>
          </button>
        )}

        {/* Sync Button */}
        {isGoogleConnected && (
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            title="Synchronize Google Calendar"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        )}

        {/* Pending Reviews Notification */}
        <button
          onClick={() => setActiveView('automation')}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title={`${pendingEmails.length} emails awaiting approval`}
        >
          <Bell className="w-4 h-4" />
          {pendingEmails.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500"></span>
          )}
        </button>

        {/* Brand Theme Palette Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowBrandMenu(!showBrandMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-all shadow-2xs"
            title="Change Insurance Brand & Colors"
          >
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-xs"
              style={{ backgroundColor: currentBrand.primaryColor }}
            />
            <span className="hidden lg:inline">{currentBrand.shortName}</span>
            <Palette className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showBrandMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-scaleIn">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>PH Insurance Brands</span>
                <span className="text-[10px] text-slate-500 font-mono">10 Brands</span>
              </div>
              <div className="max-h-64 overflow-y-auto p-1 space-y-0.5">
                {allBrands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBrandTheme(b.id);
                      setShowBrandMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                      currentBrand.id === b.id
                        ? 'bg-slate-100 text-slate-900 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: b.primaryColor }}
                      />
                      <span>{b.name}</span>
                    </div>
                    {currentBrand.id === b.id && (
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action: + New Appointment */}
        <button
          onClick={onOpenNewAppointment}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all shadow-xs"
        >
          <CalendarPlus className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">+ New Appointment</span>
        </button>

        {/* Action: + Add Client */}
        <button
          onClick={onOpenAddClient}
          style={{
            backgroundColor: currentBrand.primaryColor,
            color: currentBrand.id === 'sunlife' ? '#0f172a' : '#ffffff',
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Client</span>
        </button>
      </div>
    </header>
  );
};
