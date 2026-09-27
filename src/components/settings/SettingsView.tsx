import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Mail,
  Calendar,
  Zap,
  Palette,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  LogOut,
  Link as LinkIcon,
  Save,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthModal } from '../auth/AuthModal';

export const SettingsView: React.FC = () => {
  const {
    isGoogleConnected,
    googleEmail,
    lastSyncTime,
    isConnectingGoogle,
    googleError,
    connectGoogle,
    connectGoogleWorkspace,
    disconnectGoogle,
    testGmail,
    testCalendar,
    settings,
    updateSettings,
    showToast,
    currentBrand,
    setBrandTheme,
    appearanceMode,
    setAppearanceMode,
    allBrands,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'integrations' | 'email' | 'calendar' | 'automation' | 'appearance'
  >('integrations');

  const [testResult, setTestResult] = useState<{
    type: 'gmail' | 'calendar';
    success: boolean;
    message: string;
  } | null>(null);

  const [isTesting, setIsTesting] = useState<'gmail' | 'calendar' | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Email Links form state (Section 20)
  const [links, setLinks] = useState(settings.customLinks);

  // Sender info state
  const [senderInfo, setSenderInfo] = useState({
    advisorName: settings.advisorName,
    advisorEmail: settings.advisorEmail,
    advisorPhone: settings.advisorPhone,
    advisorTitle: settings.advisorTitle,
    unitBranch: settings.unitBranch,
  });

  const [signatureHtml, setSignatureHtml] = useState(settings.emailSignatureHtml);

  const handleTestGmail = async () => {
    setIsTesting('gmail');
    setTestResult(null);
    const res = await testGmail();
    setIsTesting(null);
    setTestResult({ type: 'gmail', success: res.success, message: res.message });
  };

  const handleTestCalendar = async () => {
    setIsTesting('calendar');
    setTestResult(null);
    const res = await testCalendar();
    setIsTesting(null);
    setTestResult({ type: 'calendar', success: res.success, message: res.message });
  };

  const handleSaveSenderAndLinks = () => {
    updateSettings({
      ...senderInfo,
      customLinks: links,
      emailSignatureHtml: signatureHtml,
    });
    showToast('Email settings and custom links saved successfully.', 'success');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-red-600" />
          <span>System Settings & Integrations</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure Google Workspace API integration, Gmail programmatic sending, calendar preferences, and merge links.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'integrations', label: 'Google Integration', icon: Shield },
          { id: 'email', label: 'Email & Links', icon: Mail },
          { id: 'calendar', label: 'Calendar Settings', icon: Calendar },
          { id: 'automation', label: 'Automation Rules', icon: Zap },
          { id: 'appearance', label: 'Appearance', icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. GOOGLE INTEGRATION TAB (Sections 4, 6, 30) */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Google Account Connection</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                  OAuth 2.0 Secure
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authorizes InLife ClientHub to send automated client emails directly through your personal
                Gmail account and synchronize appointments on Google Calendar with minimal scoped permissions.
              </p>
            </div>

            {googleError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{googleError}</span>
              </div>
            )}

            {/* Status Panel */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase">Google Account</span>
                  <p className="font-extrabold text-slate-900 text-sm mt-0.5 truncate">
                    {isGoogleConnected ? googleEmail || 'earlrestarpogi@gmail.com' : 'Not Connected'}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase">Gmail Sending</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
                    {isGoogleConnected ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-700">🟢 Connected</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <span className="text-slate-500">⚪ Disconnected</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase">Google Calendar</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-sm">
                    {isGoogleConnected ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-700">🟢 Connected</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        <span className="text-slate-500">⚪ Disconnected</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase">Last Synchronized</span>
                  <p className="font-semibold text-slate-700 mt-1">
                    {lastSyncTime || 'September 26, 2026 12:00 AM'}
                  </p>
                </div>
              </div>

              {/* Action Buttons as requested in Section 6 */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-3">
                {isGoogleConnected ? (
                  <>
                    <button
                      onClick={handleTestGmail}
                      disabled={isTesting === 'gmail'}
                      className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-red-600 ${isTesting === 'gmail' ? 'animate-spin' : ''}`}
                      />
                      <span>Test Gmail Connection</span>
                    </button>

                    <button
                      onClick={handleTestCalendar}
                      disabled={isTesting === 'calendar'}
                      className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <RefreshCw
                        className={`w-3.5 h-3.5 text-blue-600 ${
                          isTesting === 'calendar' ? 'animate-spin' : ''
                        }`}
                      />
                      <span>Test Calendar Connection</span>
                    </button>

                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Switch Account / Client</span>
                    </button>

                    <button
                      onClick={async () => {
                        const success = await connectGoogleWorkspace();
                        if (success) {
                          showToast('Gmail mailing successfully authenticated! Ready to send emails.', 'success');
                        }
                      }}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold text-red-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Authorize live Gmail API sending and Google Calendar sync"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-600" />
                      <span>Re-Authenticate Gmail Mailing</span>
                    </button>

                    <button
                      onClick={disconnectGoogle}
                      className="px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-2 transition-colors ml-auto"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Google</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={async () => {
                        const success = await connectGoogleWorkspace();
                        if (success) {
                          showToast('Gmail mailing authenticated successfully!', 'success');
                        }
                      }}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-red-700/25 active:scale-98 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Authenticate Gmail Mailing (Send Emails)</span>
                    </button>

                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Direct Gmail / Client Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Test result feedback banner */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                  testResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Security Guarantee Box (Section 30) */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-500 space-y-2">
              <h4 className="font-bold text-slate-800 uppercase text-[11px] flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-red-600" />
                <span>Enterprise Security & Least-Privilege Access (Section 30)</span>
              </h4>
              <p>
                InLife ClientHub uses official Google OAuth 2.0 with minimal required scopes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>
                  <code className="text-red-700 font-mono">https://www.googleapis.com/auth/gmail.send</code> —
                  Authorizes sending automated client notices without granting permission to read your inbox.
                </li>
                <li>
                  <code className="text-blue-700 font-mono">https://www.googleapis.com/auth/calendar.events</code> —
                  Reads and schedules client consultations on your Google Calendar.
                </li>
                <li>
                  OAuth access tokens are cached strictly in memory during your active session and never stored in localStorage or exposed to third parties.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. EMAIL & DYNAMIC LINKS TAB (Sections 7, 20) */}
      {activeTab === 'email' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
            {/* Email Provider Selection (Section 7) */}
            <div className="space-y-3">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                Email Provider Configuration (Section 7)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    settings.emailProvider === 'Gmail'
                      ? 'border-red-600 bg-red-50/30 ring-1 ring-red-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="emailProvider"
                    checked={settings.emailProvider === 'Gmail'}
                    onChange={() => updateSettings({ emailProvider: 'Gmail' })}
                    className="mt-1 text-red-600 accent-red-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Gmail (Recommended / Default)</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sends directly through your connected Google Account via the official Gmail API.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    settings.emailProvider === 'Other / Resend'
                      ? 'border-red-600 bg-red-50/30 ring-1 ring-red-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="emailProvider"
                    checked={settings.emailProvider === 'Other / Resend'}
                    onChange={() => updateSettings({ emailProvider: 'Other / Resend' })}
                    className="mt-1 text-red-600 accent-red-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-sm">Other / Resend SMTP Relay</span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Alternative cloud delivery service for high-volume corporate broadcasts.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Adviser Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Default Sender Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase">Adviser Full Name</label>
                  <input
                    type="text"
                    value={senderInfo.advisorName}
                    onChange={(e) => setSenderInfo({ ...senderInfo, advisorName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase">Sender Email</label>
                  <input
                    type="email"
                    value={senderInfo.advisorEmail}
                    onChange={(e) => setSenderInfo({ ...senderInfo, advisorEmail: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase">Mobile Number</label>
                  <input
                    type="text"
                    value={senderInfo.advisorPhone}
                    onChange={(e) => setSenderInfo({ ...senderInfo, advisorPhone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase">Professional Title</label>
                  <input
                    type="text"
                    value={senderInfo.advisorTitle}
                    onChange={(e) => setSenderInfo({ ...senderInfo, advisorTitle: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 uppercase">Unit / Branch</label>
                  <input
                    type="text"
                    value={senderInfo.unitBranch}
                    onChange={(e) => setSenderInfo({ ...senderInfo, unitBranch: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email Links Configuration (Section 20: Hyperlink Merge Fields) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-red-600" />
                    <span>Email Links & Dynamic URLs (Section 20)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Define custom URLs inserted dynamically via merge fields like{' '}
                    <code className="text-red-600 font-mono">{'{{review_link}}'}</code> or{' '}
                    <code className="text-red-600 font-mono">{'{{payment_link}}'}</code>.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 uppercase">
                    Policy Review Booking Link ({'{{review_link}}'})
                  </label>
                  <input
                    type="url"
                    value={links.reviewLink}
                    onChange={(e) => setLinks({ ...links, reviewLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase">
                    InLife QuickPay Link ({'{{payment_link}}'})
                  </label>
                  <input
                    type="url"
                    value={links.paymentLink}
                    onChange={(e) => setLinks({ ...links, paymentLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase">
                    Google Calendar Booking Link ({'{{calendar_link}}'})
                  </label>
                  <input
                    type="url"
                    value={links.calendarLink}
                    onChange={(e) => setLinks({ ...links, calendarLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase">
                    Customer Portal Link ({'{{policy_portal_link}}'})
                  </label>
                  <input
                    type="url"
                    value={links.policyPortalLink}
                    onChange={(e) => setLinks({ ...links, policyPortalLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase">
                    InLife Official Website ({'{{website_link}}'})
                  </label>
                  <input
                    type="url"
                    value={links.websiteLink}
                    onChange={(e) => setLinks({ ...links, websiteLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase">Adviser Facebook Page</label>
                  <input
                    type="url"
                    value={links.facebookLink}
                    onChange={(e) => setLinks({ ...links, facebookLink: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Email Signature */}
            <div className="space-y-2 pt-4 border-t border-slate-100 text-xs">
              <label className="font-bold text-slate-700 uppercase">
                Email HTML Signature (Appended to Outbound Emails)
              </label>
              <textarea
                rows={5}
                value={signatureHtml}
                onChange={(e) => setSignatureHtml(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveSenderAndLinks}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Save Email Settings & Links</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. CALENDAR SETTINGS */}
      {activeTab === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
            Calendar Synchronization Settings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 uppercase">Default Calendar View</label>
              <select
                value={settings.calendarDefaultView}
                onChange={(e) =>
                  updateSettings({ calendarDefaultView: e.target.value as any })
                }
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="month">Month View</option>
                <option value="week">Week View</option>
                <option value="day">Day View</option>
                <option value="agenda">Agenda View</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">
                Default Appointment Reminder Notification
              </label>
              <select
                value={settings.calendarDefaultReminderMinutes}
                onChange={(e) =>
                  updateSettings({
                    calendarDefaultReminderMinutes: Number(e.target.value),
                  })
                }
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value={1440}>1 day before (24 hours)</option>
                <option value={180}>3 hours before</option>
                <option value={60}>1 hour before</option>
                <option value={30}>30 minutes before</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. AUTOMATION TAB */}
      {activeTab === 'automation' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
            Global Automation Mode
          </h2>
          <p className="text-xs text-slate-500">
            Control whether emails are delivered immediately upon trigger or held in the review queue.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() =>
                updateSettings({
                  automation: { ...settings.automation, mode: 'APPROVAL_REQUIRED' },
                })
              }
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                settings.automation.mode === 'APPROVAL_REQUIRED'
                  ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold text-slate-900 text-sm">🛡️ Approval Required Mode</span>
              <p className="text-xs text-slate-500 mt-1">
                ClientHub prepares reminder drafts for review. You can customize, edit, and click "Approve & Send" before anything is emailed.
              </p>
            </div>

            <div
              onClick={() =>
                updateSettings({
                  automation: { ...settings.automation, mode: 'AUTOMATIC' },
                })
              }
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                settings.automation.mode === 'AUTOMATIC'
                  ? 'border-emerald-600 bg-emerald-50/20 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold text-slate-900 text-sm">⚡ Automatic Transmission</span>
              <p className="text-xs text-slate-500 mt-1">
                Emails are sent directly through Gmail automatically on the scheduled trigger day.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. APPEARANCE TAB */}
      {activeTab === 'appearance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Palette className="w-5 h-5 text-red-600" />
                <span>Dashboard Appearance & Philippine Insurance Brands</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the visual identity, primary colors, and appearance modes of your CRM dashboard.
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Appearance Display Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'clean_light', title: 'Clean Light', desc: 'Standard advisor light mode' },
                { id: 'executive_dark', title: 'Executive Dark', desc: 'Deep obsidian charcoal with neon accents' },
                { id: 'vibrant_contrast', title: 'Vibrant Corporate', desc: 'High-contrast gradient headers' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setAppearanceMode(m.id as any)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    appearanceMode === m.id
                      ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 font-bold'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs text-slate-900">{m.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-normal">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Philippine Insurance Brand Themes ({allBrands.length} Available)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {allBrands.map((b) => {
                const isSelected = currentBrand.id === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setBrandTheme(b.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-50/80 shadow-xs ring-2 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})`,
                        }}
                      >
                        {b.monogram}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 truncate">{b.name}</h4>
                          {isSelected && (
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 italic truncate mt-0.5">
                          "{b.tagline}"
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: b.primaryColor }}
                        />
                        <span className="font-mono text-[10px]">{b.primaryColor}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{b.monogram}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Auth & Netlify Diagnostics Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
