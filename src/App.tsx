import React, { useState } from 'react';
import { AppProvider, useApp, NavView } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ClientList } from './components/clients/ClientList';
import { ClientProfile } from './components/clients/ClientProfile';
import { AddClientModal } from './components/clients/AddClientModal';
import { CalendarView } from './components/calendar/CalendarView';
import { NewAppointmentModal } from './components/calendar/NewAppointmentModal';
import { AutomationCenter } from './components/automation/AutomationCenter';
import { CommunicationsHub } from './components/communications/CommunicationsHub';
import { ComposeEmailModal } from './components/communications/ComposeEmailModal';
import { EmailTemplates } from './components/templates/EmailTemplates';
import { CsvTemplatesView } from './components/templates/CsvTemplatesView';
import { PoliciesView } from './components/policies/PoliciesView';
import { AddPolicyModal } from './components/policies/AddPolicyModal';
import { PremiumTracker } from './components/premiums/PremiumTracker';
import { FundValuesView } from './components/fundvalues/FundValuesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { DocumentsView } from './components/documents/DocumentsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';
import { Client, Policy } from './types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function AppContent() {
  const {
    activeView,
    setActiveView,
    selectedClientId,
    setSelectedClientId,
    clients,
    toast,
  } = useApp();

  // Modal States
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isComposeEmailOpen, setIsComposeEmailOpen] = useState(false);
  const [isAddPolicyOpen, setIsAddPolicyOpen] = useState(false);

  const [modalTargetClient, setModalTargetClient] = useState<Client | undefined>(undefined);
  const [modalTargetPolicy, setModalTargetPolicy] = useState<Policy | undefined>(undefined);

  const handleOpenAddClient = () => {
    setIsAddClientOpen(true);
  };

  const handleOpenNewAppointment = (client?: Client) => {
    setModalTargetClient(client);
    setIsNewAppointmentOpen(true);
  };

  const handleOpenComposeEmail = (client?: Client, policy?: Policy) => {
    setModalTargetClient(client);
    setModalTargetPolicy(policy);
    setIsComposeEmailOpen(true);
  };

  const handleOpenAddPolicy = (client?: Client) => {
    setModalTargetClient(client);
    setIsAddPolicyOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans antialiased text-slate-800 overflow-hidden">
      {/* 13-Item Sidebar as required in Section 28 */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenAddClient={handleOpenAddClient}
          onOpenNewAppointment={() => handleOpenNewAppointment()}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50">
          {activeView === 'dashboard' && (
            <Dashboard
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onOpenAddClient={handleOpenAddClient}
            />
          )}

          {activeView === 'clients' && (
            <>
              {selectedClientId ? (
                <ClientProfile
                  clientId={selectedClientId}
                  onBack={() => setSelectedClientId(null)}
                  onScheduleAppointment={(c) => handleOpenNewAppointment(c)}
                  onComposeEmail={(c, p) => handleOpenComposeEmail(c, p)}
                  onAddPolicy={(c) => handleOpenAddPolicy(c)}
                />
              ) : (
                <ClientList
                  onOpenAddClient={handleOpenAddClient}
                  onSelectClient={(c) => setSelectedClientId(c.id)}
                  onComposeEmail={(c) => handleOpenComposeEmail(c)}
                  onScheduleAppointment={(c) => handleOpenNewAppointment(c)}
                />
              )}
            </>
          )}

          {activeView === 'policies' && (
            <PoliciesView
              onOpenAddPolicy={() => handleOpenAddPolicy()}
              onSelectClient={(c) => {
                setSelectedClientId(c.id);
                setActiveView('clients');
              }}
            />
          )}

          {activeView === 'premiums' && <PremiumTracker />}

          {activeView === 'fund_values' && <FundValuesView />}

          {activeView === 'calendar' && (
            <CalendarView
              onOpenNewAppointment={() => handleOpenNewAppointment()}
              onSelectClient={(c) => {
                setSelectedClientId(c.id);
                setActiveView('clients');
              }}
            />
          )}

          {activeView === 'automation' && <AutomationCenter />}

          {activeView === 'communications' && (
            <CommunicationsHub
              onComposeEmail={(c, p) => handleOpenComposeEmail(c, p)}
            />
          )}

          {activeView === 'templates' && <EmailTemplates />}
          {activeView === 'csv_templates' && <CsvTemplatesView />}

          {activeView === 'analytics' && <AnalyticsView />}

          {activeView === 'documents' && <DocumentsView />}

          {activeView === 'notifications' && <NotificationsView />}

          {activeView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals */}
      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />

      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => {
          setIsNewAppointmentOpen(false);
          setModalTargetClient(undefined);
        }}
        preselectedClient={modalTargetClient}
      />

      <ComposeEmailModal
        isOpen={isComposeEmailOpen}
        onClose={() => {
          setIsComposeEmailOpen(false);
          setModalTargetClient(undefined);
          setModalTargetPolicy(undefined);
        }}
        preselectedClient={modalTargetClient}
        preselectedPolicy={modalTargetPolicy}
      />

      <AddPolicyModal
        isOpen={isAddPolicyOpen}
        onClose={() => {
          setIsAddPolicyOpen(false);
          setModalTargetClient(undefined);
        }}
        preselectedClient={modalTargetClient}
      />

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-slate-900 text-white border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="leading-tight max-w-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
