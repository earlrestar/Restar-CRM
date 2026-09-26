import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Video, Bell, Users, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client } from '../../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClient?: Client;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedClient,
}) => {
  const { clients, addAppointment, isGoogleConnected } = useApp();

  const [clientId, setClientId] = useState(preselectedClient?.id || '');
  const [title, setTitle] = useState(
    preselectedClient
      ? `Policy Consultation — ${preselectedClient.firstName} ${preselectedClient.lastName}`
      : ''
  );
  const [date, setDate] = useState('2026-09-28');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [location, setLocation] = useState('Google Meet');
  const [description, setDescription] = useState(
    'Review policy benefits, discuss fund value growth, and review family protection coverage.'
  );
  const [enableMeet, setEnableMeet] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(60);
  const [attendeesInput, setAttendeesInput] = useState(
    preselectedClient ? preselectedClient.email : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    setIsSubmitting(true);

    const client = clients.find((c) => c.id === clientId);
    const clientName = client ? `${client.firstName} ${client.lastName}` : undefined;

    const attendees = attendeesInput
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a.includes('@'));

    const meetLink = enableMeet ? `https://meet.google.com/inl-${Math.random().toString(36).substring(2, 6)}` : undefined;

    await addAppointment(
      {
        clientId: clientId || undefined,
        clientName,
        title: title.trim(),
        date,
        startTime,
        endTime,
        location: enableMeet ? 'Google Meet (Virtual)' : location,
        description,
        meetLink,
        reminderMinutes: Number(reminderMinutes),
        attendees,
        status: 'Scheduled',
      },
      true // Sync to Google Calendar if connected
    );

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 lg:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Schedule InLife Appointment</h2>
              <p className="text-xs text-slate-500">
                {isGoogleConnected
                  ? 'Will automatically sync to your Google Calendar.'
                  : 'Saves to InLife Calendar (Connect Google in Settings for 2-way sync).'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client Selection */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Associated Client</label>
            <select
              value={clientId}
              onChange={(e) => {
                const id = e.target.value;
                setClientId(id);
                const c = clients.find((item) => item.id === id);
                if (c) {
                  setTitle(`Policy Consultation — ${c.firstName} ${c.lastName}`);
                  setAttendeesInput(c.email);
                }
              }}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="">No specific client / General appointment</option>
              {clients
                .filter((c) => !c.isArchived)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.occupation})
                  </option>
                ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Appointment Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Policy Review — Maria Santos"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Date *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 uppercase">Start Time *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 uppercase">End Time *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Location & Google Meet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase">Location</label>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={enableMeet}
                  onChange={(e) => setEnableMeet(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 accent-red-600"
                />
                <span>Include Google Meet Link</span>
              </label>
            </div>
            {!enableMeet && (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. InLife Makati Branch or Client Office"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            )}
          </div>

          {/* Attendees */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Attendees (comma-separated emails)</label>
            <input
              type="text"
              value={attendeesInput}
              onChange={(e) => setAttendeesInput(e.target.value)}
              placeholder="e.g. client@example.com, assistant@example.com"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Reminders Selector (Section 16: 1 day, 3 hrs, 1 hr, 30 mins) */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Reminder Notification</label>
            <select
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value={1440}>1 day before (24 hours)</option>
              <option value={180}>3 hours before</option>
              <option value={60}>1 hour before</option>
              <option value={30}>30 minutes before</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Meeting Agenda & Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline items to discuss..."
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Syncing...' : 'Save & Sync Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
