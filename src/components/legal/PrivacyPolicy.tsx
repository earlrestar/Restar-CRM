import React from 'react';
import { Shield, ArrowLeft, Mail, Lock, CheckCircle, FileText } from 'lucide-react';

interface LegalPageProps {
  onBack?: () => void;
}

export const PrivacyPolicy: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-slate-900 text-white p-8 sm:p-10">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-red-100 hover:text-white mb-6 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Application</span>
            </button>
          )}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-200">
                Official Policy
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-xs text-red-100 mt-2">
            Effective Date: September 27, 2026 | Last Updated: September 27, 2026
          </p>
          <p className="text-xs text-red-200 mt-1 font-medium">
            Application: InLife ClientHub &mdash; Insular Life Financial Adviser CRM
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                1
              </span>
              Introduction &amp; Scope
            </h2>
            <p>
              InLife ClientHub ("we", "our", or "the Application") is a client relationship and policy management portal developed for accredited Insular Life (InLife) financial advisers, maintained by Earl Restar (
              <a href="mailto:earlrestarpogi@gmail.com" className="text-red-600 font-semibold underline">
                earlrestarpogi@gmail.com
              </a>
              ).
            </p>
            <p>
              This Privacy Policy explains how our Application accesses, uses, stores, and protects your information when you use our services and authenticate using Google OAuth services.
            </p>
          </section>

          {/* Section 2: Google User Data */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                2
              </span>
              Google API Services &amp; User Data Accessed
            </h2>
            <p>
              When you connect your Google Account with InLife ClientHub, we request access strictly to the following Google API scopes for the explicit functional purposes detailed below:
            </p>

            <div className="grid gap-3 sm:grid-cols-2 mt-2">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span>https://www.googleapis.com/auth/gmail.send</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <strong>Purpose:</strong> Allows the adviser to dispatch client premium payment notices, birthday greetings, annual financial review invitations, and policy updates directly through their authenticated Gmail account.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>https://www.googleapis.com/auth/calendar.events</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <strong>Purpose:</strong> Allows scheduling client consultations, financial check-ups, and policy review sessions directly to your Google Calendar.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>userinfo.email &amp; userinfo.profile</span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  <strong>Purpose:</strong> Displays your adviser name and verified Google email address in the CRM interface and attaches your professional credentials to outgoing communications.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Google Limited Use Disclosure */}
          <section className="space-y-3 bg-red-50/70 border border-red-200 p-5 rounded-xl">
            <h2 className="text-base font-black text-red-950 flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-600" />
              Google API Services User Data Policy (Limited Use Disclosure)
            </h2>
            <p className="text-xs text-red-900 leading-relaxed font-medium">
              InLife ClientHub's use and transfer to any other app of information received from Google APIs will adhere to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold text-red-700 hover:text-red-900"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements:
            </p>
            <ul className="list-disc list-inside text-xs text-red-900 space-y-1.5 pl-2">
              <li>
                We <strong>never</strong> transfer or sell Google user data to third parties, advertising platforms, data brokers, or information resellers.
              </li>
              <li>
                We <strong>never</strong> use Google user data for serving personalized, retargeted, or interest-based advertisements.
              </li>
              <li>
                We <strong>never</strong> use Google user data to train, fine-tune, or improve machine learning or artificial intelligence models.
              </li>
              <li>
                Humans do not read your private email messages. The Gmail scope is strictly write/send-only (<code className="bg-red-100 px-1 py-0.5 rounded font-mono text-[11px]">gmail.send</code>) and does not permit reading your inbox.
              </li>
            </ul>
          </section>

          {/* Section 4: Data Storage */}
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                3
              </span>
              Data Retention &amp; Security
            </h2>
            <p>
              Google OAuth access tokens are stored securely in your web browser's isolated local storage (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-xs">localStorage</code>) to enable seamless sending during your active session.
            </p>
            <p>
              You can instantly revoke access and clear all cached tokens at any time by clicking <strong>"Disconnect Google"</strong> in Settings or the Account modal, or via your{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 underline font-semibold"
              >
                Google Account Permissions Manager
              </a>
              .
            </p>
          </section>

          {/* Section 5: Contact */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              Contact Information &amp; Data Privacy Officer
            </h2>
            <p className="text-xs text-slate-600">
              If you have any questions about this Privacy Policy, your personal data, or Google API integrations, please reach out directly:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p><strong>App Developer &amp; Adviser:</strong> Earl Restar</p>
              <p><strong>Email:</strong> <a href="mailto:earlrestarpogi@gmail.com" className="text-red-600 underline font-bold">earlrestarpogi@gmail.com</a></p>
              <p><strong>Organization:</strong> Insular Life Assurance Co., Ltd. &mdash; Financial Adviser Hub</p>
              <p><strong>Location:</strong> Makati City, Metro Manila, Philippines</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-8 py-4 border-t border-slate-200 text-center text-xs text-slate-500">
          &copy; 2026 InLife ClientHub &bull; All Rights Reserved &bull;{' '}
          <a href="/terms" className="text-red-600 hover:underline font-bold">Terms of Service</a> &bull;{' '}
          <a href="/" className="text-slate-700 hover:underline">Application Home</a>
        </div>
      </div>
    </div>
  );
};
