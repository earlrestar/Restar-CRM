import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Video,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CalendarAppointment, Client } from '../../types';

interface CalendarViewProps {
  onOpenNewAppointment: () => void;
  onSelectClient: (client: Client) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onOpenNewAppointment,
  onSelectClient,
}) => {
  const {
    appointments,
    clients,
    isGoogleConnected,
    googleEmail,
    lastSyncTime,
    syncCalendarFromGoogle,
    settings,
    openClientProfile,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date('2026-09-26'));
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>(
    settings.calendarDefaultView || 'month'
  );
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncCalendarFromGoogle();
    setIsSyncing(false);
  };

  // Month generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 8 = September 2026

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const getAppointmentsForDate = (dateStr: string) => {
    return appointments.filter((a) => a.date === dateStr);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-red-600" />
              <span>InLife Advisory Calendar</span>
            </h1>
            {isGoogleConnected ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Google Calendar Synced</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                Local CRM Calendar
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isGoogleConnected
              ? `Connected to ${googleEmail} • Last synchronized: ${lastSyncTime}`
              : 'Connect your Google account in Settings to sync with Google Calendar & Google Meet.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {isGoogleConnected && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin text-red-600' : ''}`} />
              <span>Sync Google</span>
            </button>
          )}

          <button
            onClick={onOpenNewAppointment}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-red-700/25 active:scale-98 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        {/* Date Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date('2026-09-26'))}
              className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-white rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1.5 hover:bg-white rounded-md text-slate-600 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* View Mode Selector (Month, Week, Day, Agenda) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
          {(['month', 'week', 'day', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                viewMode === mode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Renders */}
      {/* 1. MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[560px]">
            {/* Empty offset days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50/50 p-2 min-h-[100px]" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayAppointments = getAppointmentsForDate(dateStr);
              const isToday = dateStr === '2026-09-26';

              return (
                <div
                  key={dateStr}
                  className={`p-2 min-h-[110px] hover:bg-slate-50/60 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-red-50/20' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday ? 'bg-red-600 text-white' : 'text-slate-800'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayAppointments.length > 0 && (
                      <span className="text-[10px] font-bold text-red-600">
                        {dayAppointments.length} apt{dayAppointments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[85px]">
                    {dayAppointments.map((apt) => (
                      <button
                        key={apt.id}
                        onClick={() => setSelectedAppointment(apt)}
                        className="w-full text-left p-1 rounded bg-slate-100 hover:bg-red-100/60 text-slate-800 border-l-2 border-red-600 text-[11px] leading-tight block truncate transition-colors"
                      >
                        <span className="font-bold">{apt.startTime}</span> {apt.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AGENDA VIEW */}
      {viewMode === 'agenda' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            All Scheduled InLife Appointments
          </div>
          {appointments
            .slice()
            .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
            .map((apt) => (
              <div
                key={apt.id}
                onClick={() => setSelectedAppointment(apt)}
                className="p-4 hover:bg-slate-50/80 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 text-center shrink-0 min-w-[80px]">
                    <span className="text-[11px] font-bold uppercase text-slate-500 block">
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-slate-900 block leading-tight">
                      {new Date(apt.date).getDate()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">{apt.startTime}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{apt.title}</h4>
                      {apt.clientName && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-semibold">
                          {apt.clientName}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {apt.startTime} – {apt.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.location || 'Google Meet'}</span>
                      </div>
                    </div>
                    {apt.description && (
                      <p className="text-xs text-slate-500 italic mt-0.5">{apt.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.meetLink && (
                    <a
                      href={apt.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Meet</span>
                    </a>
                  )}
                  {apt.clientId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openClientProfile(apt.clientId!);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                    >
                      Profile
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 3. WEEK VIEW & DAY VIEW */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              {viewMode === 'day' ? 'Today’s Detailed Agenda (Sep 26, 2026)' : 'Weekly Schedule'}
            </h3>
            <span className="text-xs text-slate-400">8:00 AM – 6:00 PM Advisory Hours</span>
          </div>

          <div className="space-y-3">
            {appointments
              .filter((a) => (viewMode === 'day' ? a.date === '2026-09-26' : true))
              .map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-slate-50/50 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 text-center font-bold text-xs text-slate-800 bg-slate-100 py-2 rounded-lg">
                      {apt.startTime}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{apt.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {apt.date} • {apt.location || 'Google Meet'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.meetLink && (
                      <a
                        href={apt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold"
                      >
                        Join Meet
                      </a>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Google Calendar Appointment
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedAppointment.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-red-600" />
                <span className="font-semibold">
                  {selectedAppointment.date} from {selectedAppointment.startTime} to{' '}
                  {selectedAppointment.endTime}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{selectedAppointment.location || 'Google Meet (Virtual)'}</span>
              </div>

              {selectedAppointment.meetLink && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Video className="w-4 h-4 text-emerald-600" />
                    <span>Google Meet Video Link</span>
                  </div>
                  <a
                    href={selectedAppointment.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 bg-emerald-600 text-white rounded font-bold hover:bg-emerald-700"
                  >
                    Join
                  </a>
                </div>
              )}

              {selectedAppointment.description && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Description</span>
                  <p className="mt-1 text-slate-700 leading-relaxed">
                    {selectedAppointment.description}
                  </p>
                </div>
              )}

              {selectedAppointment.clientId && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <span className="text-slate-500">Linked Client Profile:</span>
                  <button
                    onClick={() => {
                      openClientProfile(selectedAppointment.clientId!);
                      setSelectedAppointment(null);
                    }}
                    className="text-red-600 font-bold hover:underline"
                  >
                    {selectedAppointment.clientName || 'View Profile'} →
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
