import React from 'react';
import { Bell, Sparkles, CheckCircle2, Calendar, CreditCard, Cake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { pendingEmails, appointments, clients, setActiveView, openClientProfile } = useApp();

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-red-600" />
          <span>Notifications & Action Items</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          High-priority advisory notifications, pending communications, and calendar alerts.
        </p>
      </div>

      <div className="space-y-4">
        {pendingEmails.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Email Ready for Review: {item.clientName}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                <p className="text-xs text-slate-400 mt-1 italic">"{item.subject}"</p>
              </div>
            </div>
            <button
              onClick={() => setActiveView('automation')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shrink-0"
            >
              Review Now
            </button>
          </div>
        ))}

        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Today’s Consultations (4 Appointments)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Maria Santos (9:00 AM), John Dela Cruz (11:30 AM), Ana Reyes (2:00 PM), Mark Cruz (4:30 PM).
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('calendar')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shrink-0"
          >
            View Calendar
          </button>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Cake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Upcoming Client Birthdays: Juan Dela Cruz (Sep 29) &amp; Beatriz Alvarez (Sep 28)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Personalized greetings have been drafted for review.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('automation')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shrink-0"
          >
            Review Greetings
          </button>
        </div>
      </div>
    </div>
  );
};
