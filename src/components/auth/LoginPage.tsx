import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  Building,
  KeyRound,
  Sparkles,
  Users,
  Calendar,
  Zap,
  ChevronRight,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { AppAccount } from '../../types';
import { useApp } from '../../context/AppContext';

interface LoginPageProps {
  onLogin: (account: AppAccount) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const { connectGoogle, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('InLife Makati Financial Center');
  const [role, setRole] = useState('Financial Adviser');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle Form Sign In
  const handleSubmitSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your adviser email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim();
      const userSlug = trimmedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const initials = trimmedEmail
        .split('@')[0]
        .slice(0, 2)
        .toUpperCase();

      // If user logs in with Earl's email, give Earl profile
      if (trimmedEmail.toLowerCase() === 'earlrestarpogi@gmail.com') {
        onLogin({
          id: 'earl_restar',
          email: 'earlrestarpogi@gmail.com',
          name: 'Earl Restar',
          role: 'Senior Wealth Management Adviser',
          unitBranch: 'InLife Makati Financial Center — Agape Unit',
          phone: '+63 917 890 1234',
          initials: 'ER',
          brandId: 'inlife',
        });
        showToast('Welcome back, Earl Restar!', 'success');
      } else {
        const displayName = trimmedEmail
          .split('@')[0]
          .replace(/[._]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());

        onLogin({
          id: `account_${userSlug}`,
          email: trimmedEmail,
          name: displayName || 'Financial Adviser',
          role: 'Accredited Financial Adviser',
          unitBranch: 'InLife Agency Network',
          initials: initials || 'FA',
          brandId: 'inlife',
          isCustom: true,
        });
        showToast(`Signed in to your isolated workspace!`, 'success');
      }
      setIsLoading(false);
    }, 400);
  };

  // Handle Form Registration
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full adviser name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const userSlug = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
      const nameParts = name.trim().split(' ');
      const initials =
        nameParts.length >= 2
          ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
          : name.slice(0, 2).toUpperCase();

      const newAccount: AppAccount = {
        id: `account_${userSlug}`,
        email: email.trim(),
        name: name.trim(),
        role: role.trim() || 'Financial Adviser',
        unitBranch: branch.trim() || 'InLife Makati Financial Center',
        initials: initials || 'FA',
        brandId: 'inlife',
        isCustom: true,
      };

      onLogin(newAccount);
      setIsLoading(false);
      showToast(`Account created! Welcome to your private InLife ClientHub, ${name.trim()}.`, 'success');
    }, 600);
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const success = await connectGoogle(false);
      if (success) {
        // Will be picked up or we can read from localStorage
        const storedEmail = localStorage.getItem('inlife_clienthub_google_email') || 'earlrestarpogi@gmail.com';
        const userSlug = storedEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
        
        // If it's Earl's Google email, bind to Earl's account
        if (storedEmail.toLowerCase().includes('earlrestar')) {
          onLogin({
            id: 'earl_restar',
            email: 'earlrestarpogi@gmail.com',
            name: 'Earl Restar',
            role: 'Senior Wealth Management Adviser',
            unitBranch: 'InLife Makati Financial Center — Agape Unit',
            phone: '+63 917 890 1234',
            initials: 'ER',
            brandId: 'inlife',
          });
        } else {
          onLogin({
            id: `google_${userSlug}`,
            email: storedEmail,
            name: storedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            role: 'Financial Adviser',
            unitBranch: 'InLife Metro Manila Agency',
            initials: 'GA',
            brandId: 'inlife',
            isCustom: true,
          });
        }
        showToast('Authenticated via Google successfully!', 'success');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google sign-in could not be completed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 selection:bg-red-600 selection:text-white">
      {/* Top Banner Navigation */}
      <header className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-red-900/40">
            IL
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">InLife ClientHub</span>
              <span className="text-[10px] bg-red-950 border border-red-800/60 text-red-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Adviser Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              The Insular Life Assurance Co., Ltd. &bull; Enterprise CRM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full text-[11px] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted Per-User Privacy</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Column: Branding & Feature Overview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-red-950 via-slate-900 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/40 border border-red-700/40 text-red-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                <span>Next-Gen Adviser OS</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Empowering InLife Advisers to Protect Filipino Families
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Sign in to access your secure portfolio, automated premium notices, and Google Workspace integrations.
                </p>
              </div>

              {/* Pillars list */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-900/30 border border-red-700/30 text-red-400 shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Strict Account Privacy</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Each adviser account has dedicated isolated records. Your clients, policies, notes, and metrics remain strictly private to you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-900/30 border border-blue-700/30 text-blue-400 shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Real-Time Dynamic Metrics</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Live portfolio tracking: real-time client totals, in-force policies, VUL fund values, and due premiums computed on the fly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-900/30 border border-emerald-700/30 text-emerald-400 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Google Calendar & Gmail Sync</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      One-click dispatch of policy reminders, birthday greetings, and client appointments directly with your authenticated Google account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Compliance Badge */}
            <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bank-Grade 256-Bit SSL &bull; Compliant with PH Data Privacy Act of 2012</span>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-slate-900">
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex border-b border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'signin'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Adviser Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'border-red-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  New Account
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 bg-red-950/70 border border-red-800 text-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider absolute">
                  Or Adviser Email
                </span>
              </div>

              {/* Tab: Sign In */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSubmitSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Adviser Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. earlrestarpogi@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Signing In...' : 'Log In to My Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Tab: Register New Adviser Account */}
              {activeTab === 'register' && (
                <form onSubmit={handleSubmitRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Dela Cruz"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. john.delacruz@inlife.com.ph"
                        className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Title / Role
                      </label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Financial Adviser"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Branch / Agency
                      </label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="InLife Makati"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-bold">✓ Privacy Guarantee:</span> Your new account starts with an isolated, empty book of business. No other adviser will see your clients or policies.
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <span>{isLoading ? 'Creating Account...' : 'Create Account & Enter'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Legal Links Footer */}
            <div className="pt-6 mt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-3">
              <span>&copy; 2026 InLife ClientHub</span>
              <span>&bull;</span>
              <button
                type="button"
                onClick={onOpenPrivacy}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span>&bull;</span>
              <button
                type="button"
                onClick={onOpenTerms}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
