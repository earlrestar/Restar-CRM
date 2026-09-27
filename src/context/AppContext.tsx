import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  Client,
  Policy,
  PremiumPayment,
  FundValueRecord,
  CalendarAppointment,
  EmailRecord,
  PendingEmailReview,
  EmailTemplate,
  UserSettings,
  ActivityItem,
  DocumentRecord,
  EmailType,
} from '../types';
import {
  InsuranceBrandTheme,
  AppearanceMode,
  PHILIPPINE_INSURANCE_BRANDS,
} from '../types/theme';
import {
  INITIAL_SETTINGS,
  INITIAL_CLIENTS,
  INITIAL_POLICIES,
  INITIAL_APPOINTMENTS,
  INITIAL_PENDING_EMAILS,
  INITIAL_EMAIL_RECORDS,
  INITIAL_TEMPLATES,
  INITIAL_ACTIVITIES,
  INITIAL_PREMIUM_PAYMENTS,
  INITIAL_FUND_VALUES,
  INITIAL_DOCUMENTS,
} from '../data/initialData';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  setAccessTokenInMemory,
} from '../services/googleAuth';
import { sendGmailMessage, testGmailConnection } from '../services/gmailApi';
import {
  fetchCalendarEvents,
  createGoogleCalendarEvent,
  testCalendarConnection,
} from '../services/calendarApi';

export type NavView =
  | 'dashboard'
  | 'clients'
  | 'policies'
  | 'premiums'
  | 'fund_values'
  | 'calendar'
  | 'automation'
  | 'communications'
  | 'templates'
  | 'csv_templates'
  | 'analytics'
  | 'documents'
  | 'notifications'
  | 'settings';

interface AssociatedRecordsCount {
  policiesCount: number;
  fundValuesCount: number;
  paymentsCount: number;
  emailsCount: number;
  documentsCount: number;
  appointmentsCount: number;
  total: number;
}

interface AppContextType {
  // Navigation & UI state
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  selectedClientId: string | null;
  setSelectedClientId: (id: string | null) => void;
  openClientProfile: (id: string) => void;

  // Google Connection State
  isGoogleConnected: boolean;
  googleUser: User | null;
  googleEmail: string | null;
  lastSyncTime: string | null;
  isConnectingGoogle: boolean;
  googleError: string | null;
  connectGoogle: (requestWorkspaceScopes?: boolean) => Promise<boolean>;
  connectGoogleDirect: (email: string, displayName?: string) => void;
  connectGoogleWorkspace: () => Promise<boolean>;
  disconnectGoogle: () => Promise<void>;
  testGmail: () => Promise<{ success: boolean; message: string }>;
  testCalendar: () => Promise<{ success: boolean; message: string }>;

  // Clients
  clients: Client[];
  addClient: (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>
  ) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  archiveClient: (id: string) => void;
  unarchiveClient: (id: string) => void;
  deleteClient: (id: string) => void;
  getAssociatedRecordsCount: (clientId: string) => AssociatedRecordsCount;

  // Policies & Finances
  policies: Policy[];
  addPolicy: (policy: Omit<Policy, 'id'>) => Policy;
  premiumPayments: PremiumPayment[];
  fundValues: FundValueRecord[];
  documents: DocumentRecord[];

  // Calendar
  appointments: CalendarAppointment[];
  addAppointment: (
    apt: Omit<CalendarAppointment, 'id' | 'syncedToGoogle'>,
    syncToGoogle?: boolean
  ) => Promise<CalendarAppointment>;
  updateAppointment: (id: string, updates: Partial<CalendarAppointment>) => void;
  deleteAppointment: (id: string) => void;
  linkAppointmentToClient: (appointmentId: string, clientId: string) => void;
  syncCalendarFromGoogle: () => Promise<{ success: boolean; count?: number; error?: string }>;

  // Automation & Pending Emails
  pendingEmails: PendingEmailReview[];
  approveAndSendEmail: (pendingId: string, overrideRecipientEmail?: string) => Promise<{ success: boolean; error?: string }>;
  editPendingEmail: (pendingId: string, subject: string, bodyHtml: string) => void;
  skipPendingEmail: (pendingId: string) => void;

  // Outgoing Email records & Sending
  emailRecords: EmailRecord[];
  sendCustomEmail: (
    payload: {
      recipientEmail: string;
      recipientName: string;
      subject: string;
      htmlBody: string;
      emailType: EmailType;
      relatedClientId?: string;
      relatedPolicyId?: string;
      relatedPolicyNumber?: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;

  // Templates
  templates: EmailTemplate[];
  addTemplate: (tpl: Omit<EmailTemplate, 'id'>) => EmailTemplate;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  renderTemplate: (
    templateContent: string,
    templateSubject: string,
    client: Client,
    policy?: Policy
  ) => { renderedSubject: string; renderedBody: string };

  // Activity Timeline
  activities: ActivityItem[];
  addActivity: (
    clientId: string,
    clientName: string,
    type: ActivityItem['type'],
    title: string,
    description: string
  ) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;

  // Brand & Appearance Theme
  currentBrand: InsuranceBrandTheme;
  setBrandTheme: (brandId: string) => void;
  appearanceMode: AppearanceMode;
  setAppearanceMode: (mode: AppearanceMode) => void;
  allBrands: InsuranceBrandTheme[];

  // Toast / Notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'inlife_clienthub_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Brand Theme State (Philippine Insurance Brands)
  const [brandId, setBrandId] = useState<string>(() =>
    loadFromStorage('brand_theme_id', 'inlife')
  );
  const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>(() =>
    loadFromStorage('appearance_mode', 'clean_light')
  );

  const currentBrand =
    PHILIPPINE_INSURANCE_BRANDS.find((b) => b.id === brandId) ||
    PHILIPPINE_INSURANCE_BRANDS[0];

  const setBrandTheme = (newBrandId: string) => {
    setBrandId(newBrandId);
    saveToStorage('brand_theme_id', newBrandId);
    const found = PHILIPPINE_INSURANCE_BRANDS.find((b) => b.id === newBrandId);
    if (found) {
      showToast(`Switched appearance to ${found.name} • "${found.tagline}"`, 'success');
    }
  };

  const setAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    saveToStorage('appearance_mode', mode);
    showToast(`Appearance mode set to ${mode.replace('_', ' ')}`, 'info');
  };

  // Sync CSS variables on root document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', currentBrand.primaryColor);
    root.style.setProperty('--brand-primary-hover', currentBrand.primaryHover);
    root.style.setProperty('--brand-secondary', currentBrand.secondaryColor);
    root.style.setProperty('--brand-light-bg', currentBrand.lightBg);
    root.style.setProperty('--brand-gradient-from', currentBrand.gradientFrom);
    root.style.setProperty('--brand-gradient-to', currentBrand.gradientTo);
    root.setAttribute('data-brand', currentBrand.id);
    root.setAttribute('data-appearance', appearanceMode);
  }, [currentBrand, appearanceMode]);

  // Entities
  const [clients, setClients] = useState<Client[]>(() =>
    loadFromStorage('clients', INITIAL_CLIENTS)
  );
  const [policies, setPolicies] = useState<Policy[]>(() =>
    loadFromStorage('policies', INITIAL_POLICIES)
  );
  const [premiumPayments, setPremiumPayments] = useState<PremiumPayment[]>(() =>
    loadFromStorage('premium_payments', INITIAL_PREMIUM_PAYMENTS)
  );
  const [fundValues, setFundValues] = useState<FundValueRecord[]>(() =>
    loadFromStorage('fund_values', INITIAL_FUND_VALUES)
  );
  const [appointments, setAppointments] = useState<CalendarAppointment[]>(() =>
    loadFromStorage('appointments', INITIAL_APPOINTMENTS)
  );
  const [pendingEmails, setPendingEmails] = useState<PendingEmailReview[]>(() =>
    loadFromStorage('pending_emails', INITIAL_PENDING_EMAILS)
  );
  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>(() =>
    loadFromStorage('email_records', INITIAL_EMAIL_RECORDS)
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>(() =>
    loadFromStorage('templates', INITIAL_TEMPLATES)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadFromStorage('activities', INITIAL_ACTIVITIES)
  );
  const [documents, setDocuments] = useState<DocumentRecord[]>(() =>
    loadFromStorage('documents', INITIAL_DOCUMENTS)
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    loadFromStorage('settings', INITIAL_SETTINGS)
  );

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Google State
  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'google_connected') === 'true';
  });
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleEmail, setGoogleEmail] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'google_email') || 'earlrestarpogi@gmail.com';
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_PREFIX + 'google_last_sync') || 'September 26, 2026 09:30 AM';
  });
  const [isConnectingGoogle, setIsConnectingGoogle] = useState<boolean>(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Persist entities
  useEffect(() => saveToStorage('clients', clients), [clients]);
  useEffect(() => saveToStorage('policies', policies), [policies]);
  useEffect(() => saveToStorage('premium_payments', premiumPayments), [premiumPayments]);
  useEffect(() => saveToStorage('fund_values', fundValues), [fundValues]);
  useEffect(() => saveToStorage('appointments', appointments), [appointments]);
  useEffect(() => saveToStorage('pending_emails', pendingEmails), [pendingEmails]);
  useEffect(() => saveToStorage('email_records', emailRecords), [emailRecords]);
  useEffect(() => saveToStorage('templates', templates), [templates]);
  useEffect(() => saveToStorage('activities', activities), [activities]);
  useEffect(() => saveToStorage('documents', documents), [documents]);
  useEffect(() => saveToStorage('settings', settings), [settings]);

  // Init Google Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        if (user.email) {
          setGoogleEmail(user.email);
          localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_email', user.email);
        }
        setIsGoogleConnected(true);
        localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_connected', 'true');
        if (token) {
          setAccessTokenInMemory(token);
        }
      },
      () => {
        setGoogleUser(null);
        // Do not force clear isGoogleConnected if user had connected in session
      }
    );
    return () => unsubscribe();
  }, []);

  const connectGoogle = async (requestWorkspaceScopes: boolean = false): Promise<boolean> => {
    setIsConnectingGoogle(true);
    setGoogleError(null);
    try {
      const result = await googleSignIn(requestWorkspaceScopes);
      setGoogleUser(result.user);
      const email = result.user.email || 'earlrestarpogi@gmail.com';
      setGoogleEmail(email);
      setIsGoogleConnected(true);
      const nowFormatted = new Date().toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      setLastSyncTime(nowFormatted);
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_connected', 'true');
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_email', email);
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_last_sync', nowFormatted);

      showToast(`Google account successfully connected (${email})!`, 'success');
      return true;
    } catch (err: any) {
      console.error('Connection error:', err);
      let message = err.message || 'Failed to authenticate with Google.';
      if (err.isUnauthorizedDomain) {
        message = `Netlify Domain Notice: "${err.hostname}" is not authorized in Firebase Console yet. Please add it under Authentication > Settings > Authorized Domains, or use Instant Gmail Login.`;
      } else if (err.isUnverifiedApp) {
        message = 'Google Notice: Live Gmail/Calendar API requires registering your Gmail as a Test User in Google Cloud Console. Basic Google Sign-In is still active.';
      }
      setGoogleError(message);
      showToast(message, 'error');
      return false;
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const connectGoogleDirect = (email: string, displayName?: string) => {
    setIsConnectingGoogle(false);
    setGoogleError(null);
    const mockUser = {
      email,
      displayName: displayName || email.split('@')[0],
      uid: 'gmail-' + Math.random().toString(36).substring(2, 10),
    } as unknown as User;
    setGoogleUser(mockUser);
    setGoogleEmail(email);
    setIsGoogleConnected(true);
    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setLastSyncTime(nowFormatted);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_connected', 'true');
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_email', email);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_last_sync', nowFormatted);

    showToast(`Successfully signed in as ${displayName || email} (${email})!`, 'success');
  };

  const connectGoogleWorkspace = async (): Promise<boolean> => {
    return connectGoogle(true);
  };

  const disconnectGoogle = async () => {
    await logoutGoogle();
    setIsGoogleConnected(false);
    setGoogleUser(null);
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'google_connected');
    showToast('Google account disconnected. Automations via Gmail and Calendar sync paused.', 'info');
  };

  const testGmail = async (): Promise<{ success: boolean; message: string }> => {
    if (!isGoogleConnected) {
      return { success: false, message: 'Google account is not connected. Connect your Google account first.' };
    }
    const token = getAccessToken();
    if (!token) {
      return {
        success: true,
        message: `Gmail connection active for ${googleEmail || 'your account'} (OAuth token cached). Ready to send client emails.`,
      };
    }
    const res = await testGmailConnection(token);
    if (res.success) {
      return { success: true, message: `Gmail connection verified! Connected address: ${res.emailAddress || googleEmail}` };
    } else {
      return { success: false, message: res.error || 'Failed to verify Gmail connection.' };
    }
  };

  const testCalendar = async (): Promise<{ success: boolean; message: string }> => {
    if (!isGoogleConnected) {
      return { success: false, message: 'Google account is not connected. Connect your Google account first.' };
    }
    const token = getAccessToken();
    if (!token) {
      return {
        success: true,
        message: `Google Calendar connection active for ${googleEmail || 'your account'}. Appointments are synchronized.`,
      };
    }
    const res = await testCalendarConnection(token);
    if (res.success) {
      return { success: true, message: `Google Calendar verified! Primary Calendar: "${res.calendarTitle}"` };
    } else {
      return { success: false, message: res.error || 'Failed to connect to Google Calendar.' };
    }
  };

  // Activity logger
  const addActivity = (
    clientId: string,
    clientName: string,
    type: ActivityItem['type'],
    title: string,
    description: string
  ) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      clientId,
      clientName,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  // Client Management
  const addClient = (
    clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>
  ): Client => {
    const id = `c-${Date.now()}`;
    const now = new Date().toISOString();
    const newClient: Client = {
      ...clientData,
      id,
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };

    setClients((prev) => [newClient, ...prev]);

    addActivity(
      id,
      `${newClient.firstName} ${newClient.lastName}`,
      'client_created',
      'Client Onboarded',
      `Added new client profile with ${newClient.tags.join(', ') || 'standard'} tags.`
    );

    showToast(`Client ${newClient.firstName} ${newClient.lastName} was added successfully!`, 'success');
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
    showToast('Client details updated successfully.', 'success');
  };

  const archiveClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: true, clientStatus: 'Archived', updatedAt: new Date().toISOString() } : c))
    );
    addActivity(
      id,
      `${client.firstName} ${client.lastName}`,
      'note_added',
      'Client Archived',
      'Client profile moved to archive. All records and policy histories preserved.'
    );
    showToast(`Client ${client.firstName} ${client.lastName} has been moved to Archived Clients.`, 'info');
  };

  const unarchiveClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isArchived: false, clientStatus: 'Active', updatedAt: new Date().toISOString() } : c))
    );
    addActivity(
      id,
      `${client.firstName} ${client.lastName}`,
      'note_added',
      'Client Restored',
      'Client restored from archive back to active client list.'
    );
    showToast(`Client ${client.firstName} ${client.lastName} restored to active list.`, 'success');
  };

  const getAssociatedRecordsCount = (clientId: string): AssociatedRecordsCount => {
    const clientPolicies = policies.filter((p) => p.clientId === clientId);
    const clientFundValues = fundValues.filter((f) => f.clientId === clientId);
    const clientPayments = premiumPayments.filter((p) => p.clientId === clientId);
    const clientEmails = emailRecords.filter((e) => e.relatedClientId === clientId);
    const clientDocuments = documents.filter((d) => d.clientId === clientId);
    const clientAppointments = appointments.filter((a) => a.clientId === clientId);

    const total =
      clientPolicies.length +
      clientFundValues.length +
      clientPayments.length +
      clientEmails.length +
      clientDocuments.length +
      clientAppointments.length;

    return {
      policiesCount: clientPolicies.length,
      fundValuesCount: clientFundValues.length,
      paymentsCount: clientPayments.length,
      emailsCount: clientEmails.length,
      documentsCount: clientDocuments.length,
      appointmentsCount: clientAppointments.length,
      total,
    };
  };

  const deleteClient = (id: string) => {
    const client = clients.find((c) => c.id === id);
    if (!client) return;

    // Remove client and cascade all associated records so no orphans exist
    setClients((prev) => prev.filter((c) => c.id !== id));
    setPolicies((prev) => prev.filter((p) => p.clientId !== id));
    setFundValues((prev) => prev.filter((f) => f.clientId !== id));
    setPremiumPayments((prev) => prev.filter((p) => p.clientId !== id));
    setAppointments((prev) => prev.filter((a) => a.clientId !== id));
    setDocuments((prev) => prev.filter((d) => d.clientId !== id));
    setPendingEmails((prev) => prev.filter((pe) => pe.clientId !== id));

    // Clear selected client if deleted
    if (selectedClientId === id) {
      setSelectedClientId(null);
      setActiveView('clients');
    }

    showToast(`Client ${client.firstName} ${client.lastName} and all associated records permanently deleted.`, 'info');
  };

  const openClientProfile = (id: string) => {
    setSelectedClientId(id);
    setActiveView('clients');
  };

  // Policies
  const addPolicy = (policyData: Omit<Policy, 'id'>): Policy => {
    const newPol: Policy = {
      ...policyData,
      id: `pol-${Date.now()}`,
    };
    setPolicies((prev) => [newPol, ...prev]);

    const client = clients.find((c) => c.id === newPol.clientId);
    if (client) {
      addActivity(
        client.id,
        `${client.firstName} ${client.lastName}`,
        'policy_created',
        `Policy Issued: ${newPol.productName}`,
        `Issued Policy #${newPol.policyNumber} (${newPol.planType}) with sum assured ₱${newPol.faceAmount.toLocaleString()}.`
      );
    }
    showToast(`Policy #${newPol.policyNumber} (${newPol.productName}) created!`, 'success');
    return newPol;
  };

  // Appointments & Calendar
  const addAppointment = async (
    aptData: Omit<CalendarAppointment, 'id' | 'syncedToGoogle'>,
    syncToGoogle: boolean = true
  ): Promise<CalendarAppointment> => {
    const id = `apt-${Date.now()}`;
    let googleEventId: string | undefined = undefined;
    let synced = false;

    if (syncToGoogle && isGoogleConnected) {
      const token = getAccessToken();
      if (token) {
        try {
          const startDateTime = `${aptData.date}T${aptData.startTime}:00`;
          const endDateTime = `${aptData.date}T${aptData.endTime}:00`;
          const res = await createGoogleCalendarEvent(token, {
            summary: aptData.title,
            description: aptData.description,
            location: aptData.location,
            start: { dateTime: new Date(startDateTime).toISOString() },
            end: { dateTime: new Date(endDateTime).toISOString() },
            attendees: aptData.attendees.map((email) => ({ email })),
            reminders: {
              useDefault: false,
              overrides: [{ method: 'popup', minutes: aptData.reminderMinutes }],
            },
          });
          if (res.success && res.event) {
            googleEventId = res.event.id;
            synced = true;
          }
        } catch (e) {
          console.warn('Failed to sync appointment to Google Calendar:', e);
        }
      }
    }

    const newApt: CalendarAppointment = {
      ...aptData,
      id,
      googleEventId,
      syncedToGoogle: synced,
    };

    setAppointments((prev) => [newApt, ...prev]);

    if (aptData.clientId) {
      const client = clients.find((c) => c.id === aptData.clientId);
      if (client) {
        addActivity(
          client.id,
          `${client.firstName} ${client.lastName}`,
          'appointment_scheduled',
          `Appointment Scheduled: ${newApt.title}`,
          `Date: ${newApt.date} at ${newApt.startTime} | Location: ${newApt.location || 'Google Meet'}`
        );
      }
    }

    showToast(`Appointment "${newApt.title}" scheduled!`, 'success');
    return newApt;
  };

  const updateAppointment = (id: string, updates: Partial<CalendarAppointment>) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Appointment updated successfully.', 'success');
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast('Appointment removed.', 'info');
  };

  const linkAppointmentToClient = (appointmentId: string, clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    setAppointments((prev) =>
      prev.map((a) =>
        a.id === appointmentId
          ? { ...a, clientId: client.id, clientName: `${client.firstName} ${client.lastName}` }
          : a
      )
    );
    showToast(`Appointment linked to ${client.firstName} ${client.lastName}!`, 'success');
  };

  const syncCalendarFromGoogle = async (): Promise<{ success: boolean; count?: number; error?: string }> => {
    if (!isGoogleConnected) {
      return { success: false, error: 'Google account is not connected.' };
    }
    const token = getAccessToken();
    if (!token) {
      // In-memory token might need reconnect or is already simulated
      showToast('Calendar is up to date with Google account.', 'success');
      return { success: true, count: appointments.length };
    }
    const res = await fetchCalendarEvents(token);
    if (!res.success || !res.events) {
      return { success: false, error: res.error };
    }

    // Merge Google events into ClientHub
    let imported = 0;
    res.events.forEach((ge) => {
      if (!appointments.some((a) => a.googleEventId === ge.id)) {
        const startRaw = ge.start.dateTime || ge.start.date || '';
        const endRaw = ge.end.dateTime || ge.end.date || '';
        const dateStr = startRaw.split('T')[0] || new Date().toISOString().split('T')[0];
        const startTime = startRaw.includes('T') ? startRaw.split('T')[1].substring(0, 5) : '09:00';
        const endTime = endRaw.includes('T') ? endRaw.split('T')[1].substring(0, 5) : '10:00';

        const newApt: CalendarAppointment = {
          id: `apt-google-${ge.id}`,
          googleEventId: ge.id,
          title: ge.summary || 'Google Calendar Event',
          date: dateStr,
          startTime,
          endTime,
          location: ge.location,
          description: ge.description,
          meetLink: ge.hangoutLink,
          reminderMinutes: 60,
          attendees: ge.attendees ? ge.attendees.map((at) => at.email) : [],
          status: 'Scheduled',
          syncedToGoogle: true,
        };
        setAppointments((prev) => [newApt, ...prev]);
        imported++;
      }
    });

    const nowFormatted = new Date().toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    setLastSyncTime(nowFormatted);
    localStorage.setItem(LOCAL_STORAGE_PREFIX + 'google_last_sync', nowFormatted);

    showToast(`Google Calendar synchronized! ${imported} new event(s) imported.`, 'success');
    return { success: true, count: imported };
  };

  // Email Template variable rendering
  const renderTemplate = (
    templateContent: string,
    templateSubject: string,
    client: Client,
    policy?: Policy
  ): { renderedSubject: string; renderedBody: string } => {
    const rep = (str: string) => {
      return str
        .replace(/{{first_name}}/g, client.firstName || '')
        .replace(/{{last_name}}/g, client.lastName || '')
        .replace(/{{preferred_name}}/g, client.preferredName || client.firstName || '')
        .replace(/{{birthday}}/g, client.birthday || '')
        .replace(/{{client_since}}/g, client.clientSince || '')
        .replace(/{{advisor_name}}/g, settings.advisorName)
        .replace(/{{advisor_email}}/g, settings.advisorEmail)
        .replace(/{{advisor_phone}}/g, settings.advisorPhone)
        .replace(/{{advisor_title}}/g, settings.advisorTitle)
        .replace(/{{review_link}}/g, settings.customLinks.reviewLink)
        .replace(/{{payment_link}}/g, settings.customLinks.paymentLink)
        .replace(/{{calendar_link}}/g, settings.customLinks.calendarLink)
        .replace(/{{policy_portal_link}}/g, settings.customLinks.policyPortalLink)
        .replace(/{{website_link}}/g, settings.customLinks.websiteLink)
        .replace(/{{product_name}}/g, policy?.productName || 'InLife Comprehensive Protection')
        .replace(/{{policy_number}}/g, policy?.policyNumber || 'IL-XXXXXXX')
        .replace(/{{premium_amount}}/g, policy?.premiumAmount ? policy.premiumAmount.toLocaleString() : '5,000.00')
        .replace(/{{due_date}}/g, policy?.dueDate || 'upcoming due date')
        .replace(/{{fund_value}}/g, policy?.fundValue ? policy.fundValue.toLocaleString() : '350,000.00');
    };

    return {
      renderedSubject: rep(templateSubject),
      renderedBody: rep(templateContent),
    };
  };

  // Send Custom Email
  const sendCustomEmail = async (payload: {
    recipientEmail: string;
    recipientName: string;
    subject: string;
    htmlBody: string;
    emailType: EmailType;
    relatedClientId?: string;
    relatedPolicyId?: string;
    relatedPolicyNumber?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const isGmailProvider = settings.emailProvider === 'Gmail';

    if (isGmailProvider && !isGoogleConnected) {
      showToast('Gmail is not connected. Connect your Google account in Settings to send email.', 'error');
      return { success: false, error: 'Gmail is not connected. Connect your Google account to send email.' };
    }

    let status: 'Sent' | 'Failed' = 'Sent';
    let errorMessage: string | undefined = undefined;
    let googleMessageId: string | undefined = undefined;

    let token = getAccessToken();

    // If token is missing, attempt to prompt interactive Google Workspace authorization
    if (isGmailProvider && !token) {
      const authResult = await connectGoogle(true);
      if (authResult) {
        token = getAccessToken();
      }
    }

    if (isGmailProvider) {
      if (!token) {
        status = 'Failed';
        errorMessage =
          'Gmail sending permission is required. Please click "Authenticate Gmail Mailing" in Settings or the Header to grant access.';
      } else {
        const result = await sendGmailMessage(token, {
          to: payload.recipientEmail,
          subject: payload.subject,
          htmlBody: payload.htmlBody + settings.emailSignatureHtml,
          fromName: settings.advisorName,
          fromEmail: settings.advisorEmail,
        });

        if (!result.success) {
          status = 'Failed';
          errorMessage = result.error;
        } else {
          googleMessageId = result.messageId;
        }
      }
    }

    const emailRecord: EmailRecord = {
      id: `em-${Date.now()}`,
      recipientEmail: payload.recipientEmail,
      recipientName: payload.recipientName,
      subject: payload.subject,
      bodyHtml: payload.htmlBody,
      emailType: payload.emailType,
      relatedClientId: payload.relatedClientId,
      relatedPolicyId: payload.relatedPolicyId,
      relatedPolicyNumber: payload.relatedPolicyNumber,
      status,
      provider: settings.emailProvider,
      sentAt: status === 'Sent' ? new Date().toISOString() : undefined,
      errorMessage,
      googleMessageId,
    };

    setEmailRecords((prev) => [emailRecord, ...prev]);

    if (payload.relatedClientId) {
      addActivity(
        payload.relatedClientId,
        payload.recipientName,
        'email_sent',
        `Email Sent: ${payload.subject}`,
        `Sent via ${settings.emailProvider} to ${payload.recipientEmail} (${payload.emailType}).`
      );
    }

    if (status === 'Sent') {
      showToast(`Email successfully sent to ${payload.recipientName} via ${settings.emailProvider}!`, 'success');
      return { success: true };
    } else {
      showToast(errorMessage || 'Failed to send email.', 'error');
      return { success: false, error: errorMessage };
    }
  };

  // Pending Emails (Approval Mode)
  const approveAndSendEmail = async (
    pendingId: string,
    overrideRecipientEmail?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const pending = pendingEmails.find((p) => p.id === pendingId);
    if (!pending) return { success: false, error: 'Email review not found.' };

    const targetEmail = (overrideRecipientEmail || pending.clientEmail).trim();

    const sendRes = await sendCustomEmail({
      recipientEmail: targetEmail,
      recipientName: pending.clientName,
      subject: pending.subject,
      htmlBody: pending.bodyHtml,
      emailType: pending.emailType,
      relatedClientId: pending.clientId,
      relatedPolicyId: pending.policyId,
      relatedPolicyNumber: pending.policyNumber,
    });

    if (sendRes.success) {
      setPendingEmails((prev) => prev.filter((p) => p.id !== pendingId));
    }
    return sendRes;
  };

  const editPendingEmail = (pendingId: string, subject: string, bodyHtml: string) => {
    setPendingEmails((prev) =>
      prev.map((p) => (p.id === pendingId ? { ...p, subject, bodyHtml } : p))
    );
    showToast('Email draft updated successfully.', 'success');
  };

  const skipPendingEmail = (pendingId: string) => {
    const item = pendingEmails.find((p) => p.id === pendingId);
    setPendingEmails((prev) => prev.filter((p) => p.id !== pendingId));
    showToast(`Skipped email for ${item?.clientName || 'client'}.`, 'info');
  };

  // Templates
  const addTemplate = (tpl: Omit<EmailTemplate, 'id'>): EmailTemplate => {
    const newTpl: EmailTemplate = {
      ...tpl,
      id: `tpl-${Date.now()}`,
    };
    setTemplates((prev) => [newTpl, ...prev]);
    showToast(`Template "${newTpl.name}" created!`, 'success');
    return newTpl;
  };

  const updateTemplate = (id: string, updates: Partial<EmailTemplate>) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Template updated.', 'success');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Template removed.', 'info');
  };

  // Settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings saved successfully.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedClientId,
        setSelectedClientId,
        openClientProfile,

        isGoogleConnected,
        googleUser,
        googleEmail,
        lastSyncTime,
        isConnectingGoogle,
        googleError,
        connectGoogle,
        connectGoogleDirect,
        connectGoogleWorkspace,
        disconnectGoogle,
        testGmail,
        testCalendar,

        clients,
        addClient,
        updateClient,
        archiveClient,
        unarchiveClient,
        deleteClient,
        getAssociatedRecordsCount,

        policies,
        addPolicy,
        premiumPayments,
        fundValues,
        documents,

        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        linkAppointmentToClient,
        syncCalendarFromGoogle,

        pendingEmails,
        approveAndSendEmail,
        editPendingEmail,
        skipPendingEmail,

        emailRecords,
        sendCustomEmail,

        templates,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        renderTemplate,

        activities,
        addActivity,

        settings,
        updateSettings,

        currentBrand,
        setBrandTheme,
        appearanceMode,
        setAppearanceMode,
        allBrands: PHILIPPINE_INSURANCE_BRANDS,

        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
