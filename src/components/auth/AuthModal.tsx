import React, { useState } from 'react';
import {
  X,
  Mail,
  Shield,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  UserCheck,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'domain-help' | 'clients' | 'verification-help';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const {
    isGoogleConnected,
    googleEmail,
    connectGoogle,
    connectGoogleDirect,
    connectGoogleWorkspace,
    disconnectGoogle,
    isConnectingGoogle,
    googleError,
    clients,
    currentBrand,
    testGmail,
    sendCustomEmail,
    showToast,
    settings,
    updateSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'domain-help' | 'clients' | 'verification-help'>(defaultTab);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'your-site.netlify.app';
  const isNetlify = currentHostname.includes('netlify.app');
  const brandColor = currentBrand?.primaryColor || '#00529B';

  const handleCopyHostname = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomLogin = (role: 'adviser' | 'client') => {
    if (!customEmail) return;
    connectGoogleDirect(customEmail, customName || (role === 'adviser' ? 'Earl Restar' : 'Valued Client'));
    onClose();
  };

  const handleQuickClientLogin = (email: string, name: string) => {
    connectGoogleDirect(email, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: brandColor }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Google & Gmail Account Access
              </h2>
              <p className="text-xs text-slate-500">
                Log in via Google OAuth, any Gmail account, or client portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification if connected */}
        {isGoogleConnected && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-950">Currently Connected:</span>
              <span className="font-semibold text-emerald-800">{googleEmail}</span>
            </div>
            <button
              onClick={() => disconnectGoogle()}
              className="text-emerald-700 hover:text-red-600 font-bold underline transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('login')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Google Sign-In & Direct
          </button>
          <button
            onClick={() => setActiveTab('verification-help')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'verification-help'
                ? 'border-red-600 text-red-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span>Fix "Access Blocked"</span>
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`pb-2.5 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'clients'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Client Demo Logins
          </button>
          <button
            onClick={() => setActiveTab('domain-help')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'domain-help'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {isNetlify && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
            <span>Netlify / Domain Setup</span>
          </button>
        </div>

        {/* Tab 1: Google Sign In & Direct Email */}
        {activeTab === 'login' && (
          <div className="space-y-4 text-xs">
            {googleError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Google Authentication Notice</span>
                </div>
                <p className="text-[11px] text-red-700 leading-relaxed">{googleError}</p>
                {googleError.includes('unauthorized') ? (
                  <button
                    onClick={() => setActiveTab('domain-help')}
                    className="mt-1 text-[11px] font-bold text-red-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    View 2-step fix for Netlify authorized domain →
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('verification-help')}
                    className="mt-1 text-[11px] font-bold text-red-900 underline flex items-center gap-1 cursor-pointer"
                  >
                    View 30-second fix for "Access blocked: has not completed Google verification" →
                  </button>
                )}
              </div>
            )}

            {/* Live Test Sender if already connected */}
            {isGoogleConnected && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-emerald-950">
                      Gmail Sending Ready for: {googleEmail}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    API Active
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your Google connection is active. You can now send automated premium reminders, birthday greetings, and customized policy notices directly through Gmail.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={async () => {
                      setIsSendingTest(true);
                      setTestResultMsg(null);
                      try {
                        const target = googleEmail || 'earlrestarpogi@gmail.com';
                        const res = await sendCustomEmail({
                          recipientEmail: target,
                          recipientName: 'Earl Restar',
                          subject: 'InLife Gmail Integration Verified! 🚀',
                          htmlBody: `<div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
                            <h2 style="color: #00529B;">InLife Mailing Service Verified</h2>
                            <p>Greetings from your Insular Life CRM system!</p>
                            <p>This email confirms that your Gmail account (<strong>${target}</strong>) is authenticated and authorized to transmit automated policy updates, birthday greetings, and client notices directly via the official Google Gmail API.</p>
                            <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Sent securely via InLife Financial Adviser CRM</p>
                          </div>`,
                          emailType: 'Custom',
                        });
                        if (res.success) {
                          setTestResultMsg(`Test email dispatched successfully to ${target}! Check your inbox.`);
                        } else {
                          setTestResultMsg(`Test email status: ${res.error || 'Simulated delivery recorded in audit log.'}`);
                        }
                      } finally {
                        setIsSendingTest(false);
                      }
                    }}
                    disabled={isSendingTest}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isSendingTest ? 'Sending Test Email...' : 'Send Live Test Email via Gmail'}</span>
                  </button>
                  <button
                    onClick={async () => {
                      const res = await testGmail();
                      setTestResultMsg(res.message);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold rounded-lg text-xs transition-colors"
                  >
                    Verify Profile
                  </button>
                </div>
                {testResultMsg && (
                  <p className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 p-2 rounded-lg border border-emerald-200 mt-2">
                    {testResultMsg}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Google Authentication Options
              </span>

              {/* Primary: Authenticate Gmail Mailing */}
              <button
                onClick={async () => {
                  const success = await connectGoogleWorkspace();
                  if (success) {
                    showToast('Gmail mailing successfully authenticated! Ready to send emails.', 'success');
                    onClose();
                  }
                }}
                disabled={isConnectingGoogle}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black flex items-center justify-center gap-3 shadow-md shadow-red-700/20 active:scale-98 transition-all cursor-pointer text-xs"
              >
                <Mail className="w-4 h-4" />
                <span>
                  {isConnectingGoogle
                    ? 'Authenticating Gmail API with Google...'
                    : 'Authenticate Gmail Mailing & Calendar (Send Emails)'}
                </span>
              </button>

              {/* Secondary: Basic Google Sign-In */}
              <button
                onClick={async () => {
                  const success = await connectGoogle(false);
                  if (success) onClose();
                }}
                disabled={isConnectingGoogle}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-700 flex items-center justify-center gap-3 shadow-2xs hover:border-slate-400 active:scale-98 transition-all cursor-pointer text-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Basic Sign-In Only (Profile & Email)</span>
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase">
                Or Instant Gmail Access (Works Everywhere)
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Gmail / Work Email Address:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. earlrestarpogi@gmail.com or your client's email"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Display Name (Optional):
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Earl Restar"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleCustomLogin('adviser')}
                  disabled={!customEmail}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Log in as Adviser</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomLogin('client')}
                  disabled={!customEmail}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Log in as Client</span>
                </button>
              </div>

              {/* Quick autofill for Earl Restar */}
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Adviser Quick-Select:</span>
                <button
                  onClick={() => {
                    setCustomEmail('earlrestarpogi@gmail.com');
                    setCustomName('Earl Restar');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-bold"
                >
                  Use earlrestarpogi@gmail.com
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Client Demo Logins */}
        {activeTab === 'clients' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600 text-[11px]">
              Select any of the 10 demo clients below to simulate logging in as that client with their registered Gmail account:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {clients.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleQuickClientLogin(c.email, `${c.firstName} ${c.lastName}`)}
                  className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 group-hover:text-blue-700">
                        {c.firstName} {c.lastName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {c.clientStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{c.email}</p>
                  </div>
                  <div className="mt-2 text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                    <span>Log in as client</span>
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Netlify / Domain Help */}
        {activeTab === 'domain-help' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Fixing "auth/unauthorized-domain" on Netlify</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Firebase Authentication restricts Google OAuth popups only to domains added to its whitelist. To allow users to click the Google button from your Netlify deployment:
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Step 1: Copy your current website domain
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentHostname}
                  className="flex-1 bg-white font-mono text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-800 select-all"
                />
                <button
                  onClick={handleCopyHostname}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Domain'}</span>
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pt-2 border-t border-slate-200">
                Step 2: Add to Firebase Console Authorized Domains
              </span>
              <div className="space-y-2 text-[11px] text-slate-600">
                <p>
                  1. Open the Firebase Console for project <strong className="text-slate-900">gen-lang-client-0450981798</strong>.
                </p>
                <p>
                  2. Go to <strong>Authentication → Settings → Authorized domains</strong>.
                </p>
                <p>
                  3. Click <strong>"Add domain"</strong> and paste <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">{currentHostname}</code>.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://console.firebase.google.com/project/gen-lang-client-0450981798/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs"
                >
                  <span>Open Firebase Auth Settings</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px]">
              <strong className="block font-bold mb-0.5">Note on Google App Verification:</strong>
              Basic Google Sign-in requires NO verification. Only if you use direct Gmail sending or Google Calendar sync does Google Cloud require you to add your email as a "Test user" in Google Cloud Console &gt; OAuth consent screen &gt; Test users.
            </div>
          </div>
        )}

        {/* Tab 4: Google Verification / Access Blocked Fix */}
        {activeTab === 'verification-help' && (
          <div className="space-y-4 text-xs animate-fadeIn">
            {/* Warning summary */}
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl space-y-1.5 text-red-900">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Why did Google show "Access blocked"?</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-800">
                Because this app requested the restricted scope <code className="bg-red-100 px-1 py-0.5 rounded font-mono text-[10px]">https://www.googleapis.com/auth/gmail.send</code> while the Google Cloud project is in <strong>Testing</strong> mode. Google automatically blocks any email not explicitly registered in the project's <strong>Test Users</strong> list.
              </p>
            </div>

            {/* Solution A: 30-Second Fix in Google Cloud Console */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wide">
                  Option 1: Add Your Email as a Google Cloud Test User (30-Sec Fix)
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  Enables Real Gmail API
                </span>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-[11px] text-slate-700 leading-relaxed">
                <li>
                  Click the button below to open Google Cloud Console for project <strong className="font-mono text-slate-900">gen-lang-client-0450981798</strong>:
                  <div className="mt-1.5 mb-2 pl-4">
                    <a
                      href="https://console.cloud.google.com/apis/credentials/consent?project=gen-lang-client-0450981798"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-xs shadow-xs"
                    >
                      <span>Open Google Cloud OAuth Consent Screen</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </li>
                <li>
                  Scroll down to the <strong>"Test users"</strong> section and click <strong>"+ ADD USERS"</strong>.
                </li>
                <li>
                  Type <strong className="text-slate-900 bg-white px-1.5 py-0.5 border border-slate-200 rounded font-mono">earlrestarpogi@gmail.com</strong> (or your Gmail address) and click <strong>SAVE</strong>.
                </li>
                <li>
                  Return to this tab and click <strong>"Retry Gmail Authentication"</strong> below. When Google displays <em>"Google hasn't verified this app"</em>, click <strong>"Advanced"</strong> → <strong>"Go to gen-lang-client-0450981798.firebaseapp.com (unsafe)"</strong> → Click <strong>Allow</strong>.
                </li>
              </ol>

              <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                <button
                  onClick={async () => {
                    const success = await connectGoogleWorkspace();
                    if (success) {
                      showToast('Gmail mailing authenticated successfully! You can now send live emails.', 'success');
                      onClose();
                    }
                  }}
                  disabled={isConnectingGoogle}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isConnectingGoogle ? 'Connecting...' : 'Retry Gmail Authentication'}</span>
                </button>
              </div>
            </div>

            {/* Solution B: Instant bypass without Google Cloud setup */}
            <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-950 uppercase text-[11px] tracking-wide">
                  Option 2: Instant Login & Direct Mailing (No Google Cloud Setup Required)
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                  Instant
                </span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                If you prefer not to configure Google Cloud Console, you can log in immediately with standard non-sensitive scopes (which Google never blocks) and use the built-in InLife Enterprise Mailer:
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={async () => {
                    const success = await connectGoogle(false);
                    if (success) {
                      showToast('Signed in with Google Account successfully!', 'success');
                      onClose();
                    }
                  }}
                  disabled={isConnectingGoogle}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sign In with Google (Basic Profile - Never Blocked)</span>
                </button>

                <button
                  onClick={() => {
                    updateSettings({ emailProvider: 'Other / Resend' });
                    showToast('Switched to InLife Direct Mailer! Ready to send emails.', 'success');
                    onClose();
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Use InLife Direct Mailer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
