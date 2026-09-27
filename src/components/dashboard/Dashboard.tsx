import React, { useState } from 'react';
import {
  Users,
  Shield,
  TrendingUp,
  CreditCard,
  Calendar,
  Mail,
  Cake,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Send,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PendingEmailReview } from '../../types';
import { DashboardBrandBar } from './DashboardBrandBar';

interface DashboardProps {
  onOpenNewAppointment: () => void;
  onOpenAddClient: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenNewAppointment,
  onOpenAddClient,
}) => {
  const {
    clients,
    policies,
    appointments,
    pendingEmails,
    activities,
    setActiveView,
    openClientProfile,
    approveAndSendEmail,
    skipPendingEmail,
    sendCustomEmail,
    isGoogleConnected,
    googleEmail,
    settings,
    currentBrand,
    appearanceMode,
  } = useApp();

  const [reviewModalEmail, setReviewModalEmail] = useState<PendingEmailReview | null>(null);
  const [reviewRecipientEmail, setReviewRecipientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Stats calculation
  const totalClients = 186; // Reference metric from prompt with active dynamic breakdown
  const activeClientsCount = clients.filter((c) => !c.isArchived).length;
  const activePoliciesCount = 214;
  const totalFundValue = '₱18.7M';
  const premiumsDueAmount = '₱428K';

  // Today's Appointments (Sept 26, 2026)
  const todayDateStr = '2026-09-26';
  const todayAppointments = appointments.filter((a) => a.date === todayDateStr);

  // Upcoming Appointments (Next 7 days: Sept 27 - Oct 3, 2026)
  const upcomingAppointments = appointments
    .filter((a) => a.date > todayDateStr)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 5);

  // Upcoming Premiums (next due policies)
  const upcomingPremiums = policies
    .filter((p) => p.status === 'In Force' && p.dueDate >= '2026-09-26')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4)
    .map((pol) => {
      const client = clients.find((c) => c.id === pol.clientId);
      return {
        policy: pol,
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Valued Client',
        client,
      };
    });

  // Upcoming Birthdays (Late September)
  const upcomingBirthdays = clients
    .filter((c) => !c.isArchived && (c.birthday.includes('-09-') || c.birthday.includes('-10-')))
    .sort((a, b) => a.birthday.substring(5).localeCompare(b.birthday.substring(5)))
    .slice(0, 4);

  const handleApprove = async (pendingId: string, emailOverride?: string) => {
    setIsProcessing(pendingId);
    await approveAndSendEmail(pendingId, emailOverride || reviewRecipientEmail || undefined);
    setIsProcessing(null);
    if (reviewModalEmail?.id === pendingId) {
      setReviewModalEmail(null);
    }
  };

  const handleQuickGreeting = async (client: (typeof clients)[0]) => {
    await sendCustomEmail({
      recipientEmail: client.email,
      recipientName: `${client.firstName} ${client.lastName}`,
      subject: `Happy Birthday from ${currentBrand.shortName}, ${client.firstName}! 🎂🎈`,
      htmlBody: `<p>Dear ${client.firstName}, wishing you a joyful and blessed birthday from your ${currentBrand.shortName} family!</p>`,
      emailType: 'Birthday',
      relatedClientId: client.id,
    });
  };

  const isDark = appearanceMode === 'executive_dark';

  return (
    <div className={`p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Brand & Appearance Quick Switcher Ribbon */}
      <DashboardBrandBar />

      {/* Welcome Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white shadow-xl'
            : appearanceMode === 'vibrant_contrast'
            ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-800 text-white shadow-lg'
            : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-md shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${currentBrand.gradientFrom}, ${currentBrand.gradientTo})`,
                }}
              >
                {currentBrand.monogram}
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight flex items-center gap-2">
                  <span>GOOD MORNING, EARL</span>
                  <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs text-slate-400 mt-1 font-medium">
                  Saturday, September 26, 2026 • {currentBrand.defaultBranch} •{' '}
                  <span
                    className="italic font-bold"
                    style={{
                      color:
                        currentBrand.id === 'sunlife'
                          ? '#f59e0b'
                          : currentBrand.primaryColor,
                    }}
                  >
                    "{currentBrand.tagline}"
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveView('calendar')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <Calendar
                className="w-4 h-4"
                style={{ color: currentBrand.primaryColor }}
              />
              <span>View Google Calendar</span>
            </button>
            <button
              onClick={() => setActiveView('automation')}
              style={{
                backgroundColor: currentBrand.primaryColor,
                color: currentBrand.id === 'sunlife' ? '#0f172a' : '#ffffff',
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Review Emails ({pendingEmails.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Clients */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Clients
            </span>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold"
              style={{
                backgroundColor: `${currentBrand.primaryColor}18`,
                color: currentBrand.primaryColor,
              }}
            >
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{totalClients}</span>
            <span className="text-xs font-bold text-emerald-600">Active Portfolio</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {activeClientsCount} tracked in {currentBrand.shortName} CRM
          </p>
        </div>

        {/* Card 2: Active Policies */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Policies
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{activePoliciesCount}</span>
            <span className="text-xs font-bold text-blue-600">96.8% Persistency</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">VUL, Whole Life, Critical Illness</p>
        </div>

        {/* Card 3: Total Fund Value */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Fund Value
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{totalFundValue}</span>
            <span className="text-xs font-bold text-emerald-600">+12.4% YTD</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Growth & equity index funds</p>
        </div>

        {/* Card 4: Premiums Due */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Premiums Due
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black">{premiumsDueAmount}</span>
            <span className="text-xs font-bold text-amber-600">This Month</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Automated reminders queued</p>
        </div>
      </div>

      {/* Main Grid: Today's Appointments & Emails to Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Appointments (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Appointments Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                  Today's Appointments
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                  {todayAppointments.length}
                </span>
              </div>
              <button
                onClick={() => setActiveView('calendar')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
              >
                <span>View Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3.5 flex items-start justify-between gap-4 group hover:bg-slate-50/80 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold shrink-0 mt-0.5 text-center min-w-[72px]">
                      {apt.startTime}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                        {apt.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{apt.location || 'Google Meet'}</p>
                      {apt.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                          "{apt.description}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {apt.meetLink && (
                      <a
                        href={apt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        <span>Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {apt.clientId && (
                      <button
                        onClick={() => openClientProfile(apt.clientId!)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium"
                      >
                        Profile
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments (7 Days Table) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                Upcoming Appointments (Next 7 Days)
              </h2>
              <button
                onClick={onOpenNewAppointment}
                className="text-xs font-semibold text-slate-700 hover:text-red-600 flex items-center gap-1"
              >
                <span>+ New Appointment</span>
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 uppercase tracking-wider font-semibold">
                    <th className="py-2.5 pr-3">Date</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Appointment</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 pl-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingAppointments.map((apt) => (
                    <tr
                      key={apt.id}
                      onClick={() => apt.clientId && openClientProfile(apt.clientId)}
                      className="hover:bg-slate-50 cursor-pointer group transition-colors"
                    >
                      <td className="py-3 pr-3 font-semibold text-slate-900">
                        {new Date(apt.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">{apt.startTime}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800 group-hover:text-red-600">
                        {apt.clientName || 'Unassigned'}
                      </td>
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[160px]">{apt.title}</td>
                      <td className="py-3 px-3 text-slate-500 truncate max-w-[140px]">
                        {apt.location || 'Google Meet'}
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                          {apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Emails to Review & Activities (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emails to Review (Approval Mode) */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                    Emails to Review
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                    {pendingEmails.length} Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Approval Required mode active</p>
              </div>
              <button
                onClick={() => setActiveView('automation')}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                Review All
              </button>
            </div>

            {pendingEmails.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                No emails pending review. All automated queues clear!
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {pendingEmails.slice(0, 3).map((pending) => (
                  <div
                    key={pending.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 space-y-2 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            pending.emailType === 'Birthday'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {pending.emailType}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">
                          {pending.clientName}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400">{pending.reason}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-1 italic">
                      "{pending.subject}"
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-200/60 text-xs">
                      <button
                        onClick={() => {
                          setReviewModalEmail(pending);
                          setReviewRecipientEmail(pending.clientEmail);
                        }}
                        className="text-slate-600 hover:text-slate-900 font-medium underline"
                      >
                        Preview Draft
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => skipPendingEmail(pending.id)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-700 rounded font-medium text-[11px]"
                        >
                          Skip
                        </button>
                        <button
                          onClick={() => handleApprove(pending.id)}
                          disabled={isProcessing === pending.id}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isProcessing === pending.id ? 'Sending...' : 'Approve & Send'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Premiums Due Widget */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                Upcoming Premiums
              </h2>
              <button
                onClick={() => setActiveView('premiums')}
                className="text-xs font-semibold text-slate-600 hover:text-red-600"
              >
                View Tracker
              </button>
            </div>
            <div className="divide-y divide-slate-100 mt-2">
              {upcomingPremiums.map(({ policy, clientName, client }) => (
                <div key={policy.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{clientName}</p>
                    <p className="text-slate-500">
                      {policy.productName} • Due{' '}
                      {new Date(policy.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900">
                      ₱{policy.premiumAmount.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-amber-600 font-semibold">{policy.paymentFrequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Birthdays */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-rose-600" />
                <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase">
                  Upcoming Birthdays
                </h2>
              </div>
            </div>
            <div className="divide-y divide-slate-100 mt-2">
              {upcomingBirthdays.map((client) => {
                const birthdayFormatted = new Date(client.birthday).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div key={client.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-slate-500">{birthdayFormatted}</p>
                    </div>
                    <button
                      onClick={() => handleQuickGreeting(client)}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded text-[11px] border border-rose-200 flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-2.5 h-2.5" />
                      <span>Send Greeting</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Client Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 tracking-tight uppercase pb-3 border-b border-slate-100">
              Recent Client Activity
            </h2>
            <div className="space-y-3 mt-3">
              {activities.slice(0, 4).map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-1.5 shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800">{act.title}</p>
                    <p className="text-slate-500">{act.description}</p>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal for Pending Email */}
      {reviewModalEmail && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Review Email Before Sending
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {reviewModalEmail.clientName} ({reviewModalEmail.clientEmail})
                </h3>
              </div>
              <button
                onClick={() => setReviewModalEmail(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Recipient Email Address *
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setReviewRecipientEmail(
                      (googleEmail || 'earlrestarpogi@gmail.com').trim()
                    )
                  }
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer"
                >
                  Send Test to My Gmail ({googleEmail || 'earlrestarpogi@gmail.com'})
                </button>
              </div>
              <input
                type="email"
                required
                value={reviewRecipientEmail}
                onChange={(e) => setReviewRecipientEmail(e.target.value)}
                placeholder="client.email@domain.com"
                className="w-full mt-1 px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Notice: Sample demo emails (.sample) do not have active mailboxes. Click "Send Test to My Gmail" to receive this email directly in your inbox.
              </p>
            </div>

            {/* Sender and Delivery Diagnostics Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">
                  Sending From: {googleEmail || 'earlrestarpogi@gmail.com'}
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  Gmail API
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Dispatched directly through Google servers. A copy will immediately appear in your Gmail <strong>Sent</strong> mailbox (mail.google.com).
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{reviewModalEmail.subject}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Body Preview</label>
              <div
                className="mt-1 p-4 rounded-xl border border-slate-200 bg-slate-50 max-h-80 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: reviewModalEmail.bodyHtml }}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setReviewModalEmail(null)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-sm font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleApprove(reviewModalEmail.id, reviewRecipientEmail)}
                disabled={isProcessing === reviewModalEmail.id}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-md shadow-red-700/20 active:scale-98 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isProcessing === reviewModalEmail.id
                    ? 'Transmitting via Gmail...'
                    : 'Approve & Send via Gmail'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
