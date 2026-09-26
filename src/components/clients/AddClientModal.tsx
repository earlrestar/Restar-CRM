import React, { useState } from 'react';
import { X, User, Phone, Briefcase, BellRing } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Gender, CivilStatus, ClientStatus, ContactMethod, CommunicationPreferences } from '../../types';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const { addClient, openClientProfile } = useApp();

  // Form State
  // Personal Info
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [birthday, setBirthday] = useState('1990-01-01');
  const [gender, setGender] = useState<Gender>('Male');
  const [civilStatus, setCivilStatus] = useState<CivilStatus>('Single');
  const [occupation, setOccupation] = useState('');
  const [address, setAddress] = useState('');

  // Contact Info
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [facebook, setFacebook] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState<ContactMethod>('Email');

  // Adviser Info
  const [clientSince, setClientSince] = useState(new Date().toISOString().split('T')[0]);
  const [clientStatus, setClientStatus] = useState<ClientStatus>('Active');
  const [source, setSource] = useState('Referral');
  const [adviserNotes, setAdviserNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // Communication Preferences
  const [prefs, setPrefs] = useState<CommunicationPreferences>({
    birthdayGreetings: true,
    premiumReminders: true,
    newsletter: true,
    marketingCommunications: false,
    policyReviewReminders: true,
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !mobileNumber.trim()) {
      setError('Please fill in required fields: First Name, Last Name, Email, and Mobile Number.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newClient = addClient({
      firstName: firstName.trim(),
      middleName: middleName.trim() || undefined,
      lastName: lastName.trim(),
      preferredName: preferredName.trim() || firstName.trim(),
      birthday,
      gender,
      civilStatus,
      occupation: occupation.trim() || 'Professional',
      address: address.trim() || 'Metro Manila, Philippines',
      email: email.trim(),
      mobileNumber: mobileNumber.trim(),
      facebook: facebook.trim() || undefined,
      preferredContactMethod,
      clientSince,
      clientStatus,
      source: source.trim() || 'Direct Client',
      adviserNotes: adviserNotes.trim() || undefined,
      tags: tags.length > 0 ? tags : ['New Client'],
      communicationPreferences: prefs,
    });

    onClose();
    // Open new client profile directly as requested in step 3
    openClientProfile(newClient.id);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 lg:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span>+ Add New InLife Client</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in client profile, advisory notes, and communication preferences.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-red-600" />
              <span>1. Personal Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Juan"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="e.g. Alfonso"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Dela Cruz"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Preferred Name / Nickname</label>
                <input
                  type="text"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  placeholder="e.g. Johnny"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Birthday *</label>
                <input
                  type="date"
                  required
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Civil Status</label>
                <select
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value as CivilStatus)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Occupation</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="e.g. Managing Director"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Residential / Office Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Penthouse 3, Serendra BGC, Taguig City"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 2: Contact Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>2. Contact Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. juan@example.com"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="e.g. +63 917 123 4567"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Facebook / Messenger Profile</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  placeholder="e.g. facebook.com/juandelacruz"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Preferred Contact Method</label>
                <select
                  value={preferredContactMethod}
                  onChange={(e) => setPreferredContactMethod(e.target.value as ContactMethod)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="Email">Email</option>
                  <option value="Mobile Number">Mobile Number (SMS)</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Facebook Messenger">Facebook Messenger</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Adviser Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <span>3. Adviser Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Client Since</label>
                <input
                  type="date"
                  value={clientSince}
                  onChange={(e) => setClientSince(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Client Status</label>
                <select
                  value={clientStatus}
                  onChange={(e) => setClientStatus(e.target.value as ClientStatus)}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Amorsolo Circle">Amorsolo Circle (HNWI)</option>
                  <option value="Prospect">Prospect</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700">Lead Source</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Referral, BNI, Campaign"
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. HNWI, Doctor, Corporate, Multiple Policies"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Adviser Confidential Notes</label>
              <textarea
                rows={2}
                value={adviserNotes}
                onChange={(e) => setAdviserNotes(e.target.value)}
                placeholder="Key goals, family background, financial milestones, meeting preferences..."
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Communication Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              <span>4. Communication Preferences (Automated Toggles)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">Birthday Greetings</span>
                  <p className="text-[11px] text-slate-400">Automated birthday greetings via Gmail</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.birthdayGreetings}
                  onChange={(e) => setPrefs({ ...prefs, birthdayGreetings: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">Premium Reminders</span>
                  <p className="text-[11px] text-slate-400">Notices 30d, 14d, 7d, and due date</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.premiumReminders}
                  onChange={(e) => setPrefs({ ...prefs, premiumReminders: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">Policy Review Reminders</span>
                  <p className="text-[11px] text-slate-400">Annual review invitations & follow-up</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.policyReviewReminders}
                  onChange={(e) => setPrefs({ ...prefs, policyReviewReminders: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-800">Quarterly Newsletter</span>
                  <p className="text-[11px] text-slate-400">Market digest & financial tips</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.newsletter}
                  onChange={(e) => setPrefs({ ...prefs, newsletter: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 cursor-pointer sm:col-span-2">
                <div>
                  <span className="text-xs font-bold text-slate-800">Marketing Communications</span>
                  <p className="text-[11px] text-slate-400">New InLife product launches and promos</p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.marketingCommunications}
                  onChange={(e) => setPrefs({ ...prefs, marketingCommunications: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                />
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md shadow-blue-700/25 active:scale-98 transition-all"
            >
              Save Client Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
