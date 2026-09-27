import React from 'react';
import { FileText, ArrowLeft, Shield, Mail } from 'lucide-react';

interface LegalPageProps {
  onBack?: () => void;
}

export const TermsOfService: React.FC<LegalPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-900 text-white p-8 sm:p-10">
          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-white mb-6 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Application</span>
            </button>
          )}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-xs">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-300">
                Legal Agreement
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Terms of Service</h1>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Effective Date: September 27, 2026 | Last Updated: September 27, 2026
          </p>
          <p className="text-xs text-red-200 mt-1 font-medium">
            Application: InLife ClientHub &mdash; Insular Life Financial Adviser CRM
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                1
              </span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using the InLife ClientHub application ("the Service"), operated by Earl Restar ("Developer"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                2
              </span>
              Description of the Service
            </h2>
            <p>
              InLife ClientHub is an administrative CRM, portfolio tracking, and automated communications dashboard built for financial advisers of The Insular Life Assurance Company, Ltd. The Service allows advisers to track insurance policies, organize client details, schedule appointments via Google Calendar, and send client notifications, greetings, and premium payment reminders through authorized email services including Google Gmail API.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                3
              </span>
              Use of Google Accounts &amp; Email Sending
            </h2>
            <p>
              When using integrated Google services, you agree:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-slate-600">
              <li>You will only send emails to legitimate clients or individuals with whom you have an existing commercial or advisory relationship.</li>
              <li>You will not use the Service to transmit unsolicited commercial email (spam) or violate Google's Acceptable Use Policies.</li>
              <li>You are solely responsible for all content, disclosures, and communications transmitted under your authenticated Google account credentials.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                4
              </span>
              Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied. To the maximum extent permitted by applicable law, the Developer disclaims liability for any indirect, incidental, or consequential damages resulting from the use or inability to use the Service.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" />
              Contact Information
            </h2>
            <p className="text-xs text-slate-600">
              For any questions regarding these Terms, please contact:
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p><strong>Maintainer:</strong> Earl Restar</p>
              <p><strong>Email:</strong> <a href="mailto:earlrestarpogi@gmail.com" className="text-red-600 underline font-bold">earlrestarpogi@gmail.com</a></p>
              <p><strong>Organization:</strong> Insular Life Assurance Co., Ltd. &mdash; Financial Adviser Hub</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-8 py-4 border-t border-slate-200 text-center text-xs text-slate-500">
          &copy; 2026 InLife ClientHub &bull; All Rights Reserved &bull;{' '}
          <a href="/privacy" className="text-red-600 hover:underline font-bold">Privacy Policy</a> &bull;{' '}
          <a href="/" className="text-slate-700 hover:underline">Application Home</a>
        </div>
      </div>
    </div>
  );
};
