import React, { useState } from 'react';
import {
  Zap,
  CheckCircle,
  Clock,
  Send,
  Edit,
  SkipForward,
  AlertTriangle,
  Cake,
  CreditCard,
  Calendar,
  Sparkles,
  ChevronRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PendingEmailReview } from '../../types';

export const AutomationCenter: React.FC = () => {
  const {
    pendingEmails,
    approveAndSendEmail,
    editPendingEmail,
    skipPendingEmail,
    settings,
    updateSettings,
    isGoogleConnected,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'settings'>('queue');
  const [selectedPending, setSelectedPending] = useState<PendingEmailReview | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const isApprovalRequired = settings.automation.mode === 'APPROVAL_REQUIRED';

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    await approveAndSendEmail(id);
    setIsProcessing(null);
    if (selectedPending?.id === id) {
      setSelectedPending(null);
      setIsEditing(false);
    }
  };

  const handleStartEdit = (item: PendingEmailReview) => {
    setSelectedPending(item);
    setEditSubject(item.subject);
    setEditBody(item.bodyHtml);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPending) return;
    editPendingEmail(selectedPending.id, editSubject, editBody);
    setIsEditing(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Automation & Communications Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated birthday wishes, premium reminders, and calendar follow-ups.
          </p>
        </div>

        {/* Mode Selector Toggle (AUTOMATIC vs APPROVAL REQUIRED) */}
        <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() =>
              updateSettings({
                automation: { ...settings.automation, mode: 'AUTOMATIC' },
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !isApprovalRequired
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Automatic Send
          </button>
          <button
            onClick={() =>
              updateSettings({
                automation: { ...settings.automation, mode: 'APPROVAL_REQUIRED' },
              })
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isApprovalRequired
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛡️ Approval Required ({pendingEmails.length})
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Emails to Review</span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px]">
            {pendingEmails.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Automation Rules & Triggers</span>
        </button>
      </div>

      {/* Tab 1: Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">Adviser Approval Workflow Active:</span> ClientHub prepares
              high-priority communications based on upcoming birthdays, premiums due, and policy reviews.
              Review, personalize, and approve emails before they are sent from your Gmail account.
            </div>
          </div>

          {pendingEmails.length === 0 ? (
            <div className="py-16 bg-white rounded-xl border border-slate-200 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800">All Communications Clear</h3>
              <p className="text-xs text-slate-500">
                No automated emails waiting in the review queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingEmails.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-amber-300 transition-all"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.emailType === 'Birthday'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.emailType}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{item.clientName}</h3>
                      <span className="text-xs text-slate-400">({item.clientEmail})</span>
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {item.reason}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold">{item.subject}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit Draft</span>
                    </button>

                    <button
                      onClick={() => skipPendingEmail(item.id)}
                      className="px-3 py-1.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Skip
                    </button>

                    <button
                      onClick={() => handleApprove(item.id)}
                      disabled={isProcessing === item.id}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-98 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isProcessing === item.id ? 'Sending...' : 'Approve & Send'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Automation Rules & Triggers Settings */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              Automated Email Workflows
            </h3>

            {/* Birthday Automation */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-start gap-3">
                <Cake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Birthday Greetings Automation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically prepare and deliver personalized birthday greetings with custom review links.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.automation.birthdayEnabled}
                onChange={(e) =>
                  updateSettings({
                    automation: { ...settings.automation, birthdayEnabled: e.target.checked },
                  })
                }
                className="w-5 h-5 text-red-600 rounded focus:ring-red-500 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Premium Reminders Breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Premium Reminders Schedule</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Trigger automated notices at specific intervals relative to policy premium due dates.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {[
                  { key: 'thirtyDays', label: '30 Days Before' },
                  { key: 'fourteenDays', label: '14 Days Before' },
                  { key: 'sevenDays', label: '7 Days Before' },
                  { key: 'oneDay', label: '1 Day Before' },
                  { key: 'dueDate', label: 'On Due Date' },
                  { key: 'overdue', label: 'Grace Period / Overdue' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(settings.automation.premiumReminderDays as any)[item.key]}
                      onChange={(e) =>
                        updateSettings({
                          automation: {
                            ...settings.automation,
                            premiumReminderDays: {
                              ...settings.automation.premiumReminderDays,
                              [item.key]: e.target.checked,
                            },
                          },
                        })
                      }
                      className="text-red-600 rounded accent-red-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Appointment Reminders & Follow-up Automation (Section 25) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Google Calendar Appointment + Email Automation (Section 25)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Coordinate email reminders and post-meeting thank you notes with your Google Calendar events.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800">3 Days Before Meeting Reminder</span>
                    <p className="text-slate-400 text-[11px]">
                      Send friendly appointment notification with agenda
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.automation.appointmentRemindersEnabled.threeDaysBefore}
                    onChange={(e) =>
                      updateSettings({
                        automation: {
                          ...settings.automation,
                          appointmentRemindersEnabled: {
                            ...settings.automation.appointmentRemindersEnabled,
                            threeDaysBefore: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 text-red-600 accent-red-600"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800">1 Day Before Meeting Reminder</span>
                    <p className="text-slate-400 text-[11px]">
                      Confirm time and send Google Meet video link
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.automation.appointmentRemindersEnabled.oneDayBefore}
                    onChange={(e) =>
                      updateSettings({
                        automation: {
                          ...settings.automation,
                          appointmentRemindersEnabled: {
                            ...settings.automation.appointmentRemindersEnabled,
                            oneDayBefore: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 text-red-600 accent-red-600"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800">Post-Meeting "Thank You" Follow-up</span>
                    <p className="text-slate-400 text-[11px]">
                      Automatically send appreciation message after consultation concludes
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.automation.appointmentRemindersEnabled.postMeetingThankYou}
                    onChange={(e) =>
                      updateSettings({
                        automation: {
                          ...settings.automation,
                          appointmentRemindersEnabled: {
                            ...settings.automation.appointmentRemindersEnabled,
                            postMeetingThankYou: e.target.checked,
                          },
                        },
                      })
                    }
                    className="w-4 h-4 text-red-600 accent-red-600"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Pending Draft Modal */}
      {isEditing && selectedPending && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 lg:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Edit Email Draft for {selectedPending.clientName}
                </h3>
                <p className="text-xs text-slate-500">
                  Adjust subject or body prior to approving and transmitting via Gmail.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 uppercase">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 uppercase">Email Body (HTML/Text)</label>
                <textarea
                  rows={10}
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  className="w-full mt-1 p-3 border border-slate-200 rounded-lg font-mono text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Save Draft
              </button>
              <button
                onClick={async () => {
                  handleSaveEdit();
                  await handleApprove(selectedPending.id);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save & Send Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
