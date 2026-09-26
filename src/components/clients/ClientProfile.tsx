import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  Shield,
  CreditCard,
  TrendingUp,
  FileText,
  Clock,
  MoreVertical,
  Archive,
  Trash2,
  Download,
  Edit,
  Plus,
  Send,
  Link as LinkIcon,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Crown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client, Policy } from '../../types';

interface ClientProfileProps {
  clientId: string;
  onBack: () => void;
  onScheduleAppointment: (client: Client) => void;
  onComposeEmail: (client: Client, policy?: Policy) => void;
  onAddPolicy: (client: Client) => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
  clientId,
  onBack,
  onScheduleAppointment,
  onComposeEmail,
  onAddPolicy,
}) => {
  const {
    clients,
    policies,
    fundValues,
    premiumPayments,
    appointments,
    emailRecords,
    documents,
    activities,
    archiveClient,
    unarchiveClient,
    deleteClient,
    getAssociatedRecordsCount,
    linkAppointmentToClient,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'policies' | 'appointments' | 'timeline' | 'communications' | 'documents'
  >('overview');

  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedAppointmentToLink, setSelectedAppointmentToLink] = useState('');

  const client = clients.find((c) => c.id === clientId);

  if (!client) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Client not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold"
        >
          Return to Clients List
        </button>
      </div>
    );
  }

  // Related Entities
  const clientPolicies = policies.filter((p) => p.clientId === clientId);
  const clientFundValues = fundValues.filter((f) => f.clientId === clientId);
  const clientPayments = premiumPayments.filter((p) => p.clientId === clientId);
  const clientAppointments = appointments.filter((a) => a.clientId === clientId);
  const clientEmails = emailRecords.filter((e) => e.relatedClientId === clientId);
  const clientDocs = documents.filter((d) => d.clientId === clientId);
  const clientTimeline = activities
    .filter((a) => a.clientId === clientId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const totalFundValue = clientPolicies.reduce((acc, pol) => acc + pol.fundValue, 0);
  const totalCoverage = clientPolicies.reduce((acc, pol) => acc + pol.faceAmount, 0);

  // Associated records for deletion check
  const recordCounts = getAssociatedRecordsCount(clientId);

  // Unlinked appointments for "Link to Client"
  const unlinkedAppointments = appointments.filter((a) => !a.clientId || a.clientId !== clientId);

  const handleExportData = () => {
    const data = {
      client,
      policies: clientPolicies,
      fundValues: clientFundValues,
      premiumPayments: clientPayments,
      appointments: clientAppointments,
      communications: clientEmails,
      documents: clientDocs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InLife_Client_${client.firstName}_${client.lastName}_Data.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Client data exported successfully.', 'success');
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationText !== 'DELETE') {
      showToast('Please type DELETE in capital letters to confirm.', 'error');
      return;
    }
    deleteClient(client.id);
  };

  const handleLinkAppointment = () => {
    if (!selectedAppointmentToLink) return;
    linkAppointmentToClient(selectedAppointmentToLink, client.id);
    setShowLinkModal(false);
    setSelectedAppointmentToLink('');
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Navigation & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Clients</span>
        </button>

        {/* Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsActionsOpen(!isActionsOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-lg text-sm font-semibold shadow-xs transition-all"
          >
            <span>Actions</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>

          {isActionsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
              <button
                onClick={() => {
                  onComposeEmail(client);
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Send className="w-3.5 h-3.5 text-slate-500" />
                <span>Send Email to Client</span>
              </button>

              <button
                onClick={() => {
                  onScheduleAppointment(client);
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Schedule Appointment</span>
              </button>

              <button
                onClick={() => {
                  onAddPolicy(client);
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Add InLife Policy</span>
              </button>

              <div className="my-1 border-t border-slate-100"></div>

              <button
                onClick={() => {
                  handleExportData();
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Client Data (JSON)</span>
              </button>

              {client.isArchived ? (
                <button
                  onClick={() => {
                    unarchiveClient(client.id);
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Restore from Archive</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowArchiveConfirm(true);
                    setIsActionsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2.5"
                >
                  <Archive className="w-3.5 h-3.5 text-amber-600" />
                  <span>Archive Client</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100"></div>

              <button
                onClick={() => {
                  setShowDeleteModal(true);
                  setIsActionsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span>Delete Client</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Client Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-800 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-700/20 shrink-0">
              {client.firstName[0]}
              {client.lastName[0]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {client.firstName} {client.middleName ? `${client.middleName} ` : ''}
                  {client.lastName}
                </h1>
                {client.preferredName && (
                  <span className="text-sm text-slate-500 font-medium">({client.preferredName})</span>
                )}
                {client.isArchived ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-200 text-slate-700">
                    Archived
                  </span>
                ) : client.clientStatus === 'Amorsolo Circle' || (client.clientStatus as string) === 'VIP' ? (
                  <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-gradient-to-r from-amber-100 via-amber-200/80 to-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                    <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Amorsolo Circle</span>
                  </span>
                ) : client.clientStatus === 'Active' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                ) : client.clientStatus === 'Prospect' ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                    Prospect
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {client.clientStatus}
                  </span>
                )}
                {client.isArchived && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Archived Status
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 mt-1 font-medium">{client.occupation}</p>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.address}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {client.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Fund Value
              </span>
              <p className="text-xl font-black text-slate-900">₱{totalFundValue.toLocaleString()}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Sum Assured
              </span>
              <p className="text-lg font-bold text-slate-700">₱{totalCoverage.toLocaleString()}</p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-500 font-medium">
              Client since {new Date(client.clientSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-3 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'policies', label: `Policies & Funds (${clientPolicies.length})` },
            { id: 'appointments', label: `Appointments (${clientAppointments.length})` },
            { id: 'communications', label: `Emails (${clientEmails.length})` },
            { id: 'timeline', label: `Timeline (${clientTimeline.length})` },
            { id: 'documents', label: `Documents (${clientDocs.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Contents */}
      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                Personal & Family Details
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Birthday:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {new Date(client.birthday).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Gender:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{client.gender}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Civil Status:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{client.civilStatus}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Preferred Contact:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{client.preferredContactMethod}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Lead Source:</span>
                  <p className="font-bold text-slate-800 mt-0.5">{client.source}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Facebook:</span>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">{client.facebook || 'None'}</p>
                </div>
              </div>

              {client.adviserNotes && (
                <div className="pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-500 uppercase">Adviser Confidential Notes</span>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                    {client.adviserNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Policy Snapshot */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Active InLife Policies
                </h3>
                <button
                  onClick={() => onAddPolicy(client)}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  + Add Policy
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {clientPolicies.map((pol) => (
                  <div key={pol.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {pol.productName}{' '}
                        <span className="text-xs font-normal text-slate-500">({pol.policyNumber})</span>
                      </p>
                      <p className="text-slate-500 mt-0.5">
                        {pol.planType} • Due {pol.dueDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900">₱{pol.premiumAmount.toLocaleString()}</p>
                      <p className="text-slate-400 text-[11px]">{pol.paymentFrequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Communication Preferences */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                Automated Communication Settings
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Birthday Greetings</span>
                  <span
                    className={`font-bold ${
                      client.communicationPreferences.birthdayGreetings ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {client.communicationPreferences.birthdayGreetings ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Premium Reminders</span>
                  <span
                    className={`font-bold ${
                      client.communicationPreferences.premiumReminders ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {client.communicationPreferences.premiumReminders ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Policy Review Reminders</span>
                  <span
                    className={`font-bold ${
                      client.communicationPreferences.policyReviewReminders ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {client.communicationPreferences.policyReviewReminders ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Quarterly Newsletter</span>
                  <span
                    className={`font-bold ${
                      client.communicationPreferences.newsletter ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {client.communicationPreferences.newsletter ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="font-medium text-slate-700">Marketing Communications</span>
                  <span
                    className={`font-bold ${
                      client.communicationPreferences.marketingCommunications ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {client.communicationPreferences.marketingCommunications ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wide">Quick Advisory Actions</h3>
              <p className="text-xs text-slate-400">
                Execute client operations directly synced to Gmail and Google Calendar.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onComposeEmail(client)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email Notice</span>
                </button>
                <button
                  onClick={() => onScheduleAppointment(client)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Book Review Meeting</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Policies & Fund Values Tab */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">InLife Policy Portfolio</h3>
            <button
              onClick={() => onAddPolicy(client)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add InLife Policy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientPolicies.map((pol) => (
              <div key={pol.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Policy #{pol.policyNumber}
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">{pol.productName}</h4>
                    <p className="text-xs text-slate-500">{pol.planType}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
                    {pol.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sum Assured:</span>
                    <span className="font-bold text-slate-800">₱{pol.faceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Premium:</span>
                    <span className="font-bold text-slate-800">
                      ₱{pol.premiumAmount.toLocaleString()} ({pol.paymentFrequency})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fund Value:</span>
                    <span className="font-bold text-emerald-600">₱{pol.fundValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Due Date:</span>
                    <span className="font-bold text-amber-700">{pol.dueDate}</span>
                  </div>
                </div>

                {pol.riders.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Attached Riders</span>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600">
                      {pol.riders.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Google Calendar Appointments</h3>
              <p className="text-xs text-slate-500">Synchronized appointments linked to {client.firstName}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLinkModal(true)}
                className="px-3.5 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Link Existing Calendar Event</span>
              </button>
              <button
                onClick={() => onScheduleAppointment(client)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Appointment</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {clientAppointments.length === 0 ? (
              <div className="py-12 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                No appointments linked yet. Click "+ New Appointment" to schedule on Google Calendar.
              </div>
            ) : (
              clientAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{apt.title}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px]">
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {apt.date} • {apt.startTime} - {apt.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{apt.location || 'Google Meet'}</span>
                      </div>
                    </div>
                    {apt.description && (
                      <p className="text-xs text-slate-500 italic mt-1">{apt.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {apt.meetLink && (
                      <a
                        href={apt.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5"
                      >
                        <span>Join Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Communications Tab */}
      {activeTab === 'communications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Email Communication History</h3>
              <p className="text-xs text-slate-500">All automated and direct emails sent through Gmail</p>
            </div>
            <button
              onClick={() => onComposeEmail(client)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Compose Email</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            {clientEmails.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No emails recorded for this client yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Date Sent</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientEmails.map((em) => (
                    <tr key={em.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{em.subject}</td>
                      <td className="py-3 px-4 text-slate-600">{em.emailType}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {em.sentAt ? new Date(em.sentAt).toLocaleDateString() : 'Pending'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{em.provider}</td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            em.status === 'Sent'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {em.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* 5. Client Timeline Tab (Section 26) */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Unified Client Timeline</h3>
              <p className="text-xs text-slate-500">
                Complete chronological history combining client onboarding, policies, premiums, fund values,
                emails, birthdays, appointments, and documents.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-8 shadow-xs">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {clientTimeline.map((item) => (
                <div key={item.id} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-xs"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                      <span className="text-xs text-slate-400">
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Client Documents & Contracts</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                    {doc.category}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{doc.title}</h4>
                <p className="text-xs text-slate-400">{doc.fileName} • {doc.fileSize}</p>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-500">
                  <span>Uploaded {doc.uploadDate}</span>
                  <button className="text-blue-600 font-bold hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archive Client Modal */}
      {showArchiveConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <Archive className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Archive Client?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Archiving <strong>{client.firstName} {client.lastName}</strong> is the recommended alternative to permanent deletion.
            </p>
            <ul className="text-xs text-slate-500 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <li>✓ Disappears from your normal active client list</li>
              <li>✓ Remains safely stored in the database</li>
              <li>✓ Retains all policy, payment, and communication history</li>
              <li>✓ Can be recovered anytime from the Archived Clients filter</li>
            </ul>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowArchiveConfirm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  archiveClient(client.id);
                  setShowArchiveConfirm(false);
                }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs"
              >
                Archive Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Deletion Modal with Associated Records Warning & Type 'DELETE' */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 lg:p-8 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Permanently Delete Client & Records?
                </h3>
                <p className="text-xs text-red-600 font-semibold">
                  Warning: This action is irreversible.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong>{client.firstName} {client.lastName}</strong> and their associated records?
            </p>

            {/* Associated Records Count Warning Box */}
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-red-900 uppercase tracking-wide">
                Associated Records Affected:
              </span>
              <div className="grid grid-cols-2 gap-2 text-red-800">
                <div>• {recordCounts.policiesCount} Policy record(s)</div>
                <div>• {recordCounts.fundValuesCount} Fund value record(s)</div>
                <div>• {recordCounts.paymentsCount} Premium payment(s)</div>
                <div>• {recordCounts.emailsCount} Communication log(s)</div>
                <div>• {recordCounts.documentsCount} Document(s)</div>
                <div>• {recordCounts.appointmentsCount} Calendar appointment(s)</div>
              </div>
            </div>

            {/* Recommendation to Archive */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <strong>Recommended alternative:</strong> Use <strong>Archive Client</strong> instead to keep historical financial data intact.
            </div>

            {/* Type DELETE Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                To proceed, type <span className="text-red-600 font-mono">DELETE</span> below:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText('');
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteConfirmationText !== 'DELETE'}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  deleteConfirmationText === 'DELETE'
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Permanently Delete Client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Existing Calendar Appointment Modal (Section 14) */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Link Calendar Appointment to {client.firstName}
            </h3>
            <p className="text-xs text-slate-500">
              Select an existing Google Calendar appointment to associate with this client's profile.
            </p>

            <select
              value={selectedAppointmentToLink}
              onChange={(e) => setSelectedAppointmentToLink(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="">Select an appointment...</option>
              {unlinkedAppointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  {apt.date} {apt.startTime} — {apt.title}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkAppointment}
                disabled={!selectedAppointmentToLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Link to Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
