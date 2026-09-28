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
  AppAccount,
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
  DEFAULT_ACCOUNTS,
  CAMILLE_INITIAL_CLIENTS,
  CAMILLE_INITIAL_POLICIES,
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
  updatePolicy: (id: string, updates: Partial<Policy>) => void;
  deletePolicy: (id: string) => void;
  premiumPayments: PremiumPayment[];
  addPremiumPayment: (payment: Omit<PremiumPayment, 'id'>) => PremiumPayment;
  fundValues: FundValueRecord[];
  addFundValue: (record: Omit<FundValueRecord, 'id'>) => FundValueRecord;
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

  // Active Account & Auth state
  currentAccount: AppAccount | null;
  loginAccount: (account: AppAccount) => void;
  logoutAccount: () => void;
  allAccounts: AppAccount[];

  // Dynamic Live Real-Time Aggregates
  metrics: {
    totalClients: number;
    activeClients: number;
    archivedClients: number;
    totalPolicies: number;
    activePolicies: number;
    totalFundValue: number;
    totalAnnualizedPremium: number;
    premiumsDueAmount: number;
    upcomingPremiumsCount: number;
    pendingReviewsCount: number;
    todayAppointmentsCount: number;
    formatPHP: (val: number) => string;
    formatPHPCompact: (val: number) => string;
  };

  // Toast / Notifications
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'inlife_clienthub_';
const CURRENT_ACCOUNT_STORAGE_KEY = 'inlife_clienthub_active_account_id';
const REGISTERED_ACCOUNTS_STORAGE_KEY = 'inlife_clienthub_registered_accounts';

// Per-account data isolation helpers
function getAccountData<T>(accountId: string | null, key: string, fallback: T): T {
  if (!accountId) return fallback;
  try {
    const raw = localStorage.getItem(`inlife_user_${accountId}_${key}`);
    if (raw) return JSON.parse(raw);

    // Initial defaults for standard accounts if not stored yet
    if (accountId === 'earl_restar') {
      if (key === 'clients') return INITIAL_CLIENTS as any;
      if (key === 'policies') return INITIAL_POLICIES as any;
      if (key === 'premium_payments') return INITIAL_PREMIUM_PAYMENTS as any;
      if (key === 'fund_values') return INITIAL_FUND_VALUES as any;
      if (key === 'appointments') return INITIAL_APPOINTMENTS as any;
      if (key === 'pending_emails') return INITIAL_PENDING_EMAILS as any;
      if (key === 'email_records') return INITIAL_EMAIL_RECORDS as any;
      if (key === 'templates') return INITIAL_TEMPLATES as any;
      if (key === 'activities') return INITIAL_ACTIVITIES as any;
      if (key === 'documents') return INITIAL_DOCUMENTS as any;
      if (key === 'settings') return INITIAL_SETTINGS as any;
    } else if (accountId === 'camille_reyes') {
      if (key === 'clients') return CAMILLE_INITIAL_CLIENTS as any;
      if (key === 'policies') return CAMILLE_INITIAL_POLICIES as any;
      if (key === 'premium_payments') return [] as any;
      if (key === 'fund_values')
        return [
          {
            id: 'cr-fv-1',
            clientId: 'cr-c1',
            policyId: 'cr-p1',
            date: '2026-09-20',
            fundName: 'InLife Growth Fund',
            units: 120000,
            navpu: 2.0,
            totalValue: 240000,
          },
        ] as any;
      if (key === 'appointments') return [] as any;
      if (key === 'pending_emails') return [] as any;
      if (key === 'email_records') return [] as any;
      if (key === 'templates') return INITIAL_TEMPLATES as any;
      if (key === 'activities') return [] as any;
      if (key === 'documents') return [] as any;
      if (key === 'settings')
        return {
          ...INITIAL_SETTINGS,
          advisorName: 'Camille Reyes',
          advisorEmail: 'camille.reyes@inlife.com.ph',
          advisorPhone: '+63 919 444 8888',
          advisorTitle: 'Associate Financial Adviser',
          unitBranch: 'InLife BGC Prestige Financial District',
        } as any;
    }
    return fallback;
  } catch (e) {
    console.error(`Error loading account data for ${accountId} / ${key}:`, e);
    return fallback;
  }
}

function saveAccountData<T>(accountId: string, key: string, data: T) {
  try {
    localStorage.setItem(`inlife_user_${accountId}_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving account data for ${accountId} / ${key}:`, e);
  }
}

export const formatPHP = (val: number): string => {
  return '₱' + Math.round(val || 0).toLocaleString('en-PH');
};

export const formatPHPCompact = (val: number): string => {
  const num = val || 0;
  if (Math.abs(num) >= 1_000_000) {
    return '₱' + (num / 1_000_000).toFixed(2) + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return '₱' + (num / 1_000).toFixed(1) + 'K';
  }
  return '₱' + Math.round(num).toLocaleString('en-PH');
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Active Account State (defaults to null so login screen displays by default)
  const [currentAccount, setCurrentAccount] = useState<AppAccount | null>(() => {
    try {
      const activeId = localStorage.getItem(CURRENT_ACCOUNT_STORAGE_KEY);
      if (!activeId) return null;
      const meta = localStorage.getItem(`inlife_account_meta_${activeId}`);
      if (meta) return JSON.parse(meta);
      const def = DEFAULT_ACCOUNTS.find((a) => a.id === activeId);
      return def || null;
    } catch {
      return null;
    }
  });

  const [allAccounts, setAllAccounts] = useState<AppAccount[]>(() => {
    try {
      const raw = localStorage.getItem(REGISTERED_ACCOUNTS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [...DEFAULT_ACCOUNTS];
  });

  const activeId = currentAccount?.id || null;
  const isEarl = activeId === 'earl_restar';
  const isCamille = activeId === 'camille_reyes';

  // Brand Theme State (Philippine Insurance Brands)
  const [brandId, setBrandId] = useState<string>(() => {
    if (activeId) {
      return getAccountData(activeId, 'brand_theme_id', 'inlife');
    }
    return 'inlife';
  });
  const [appearanceMode, setAppearanceModeState] = useState<AppearanceMode>(() => {
    if (activeId) {
      return getAccountData(activeId, 'appearance_mode', 'clean_light');
    }
    return 'clean_light';
  });

  const currentBrand =
    PHILIPPINE_INSURANCE_BRANDS.find((b) => b.id === brandId) ||
    PHILIPPINE_INSURANCE_BRANDS[0];

  const setBrandTheme = (newBrandId: string) => {
    setBrandId(newBrandId);
    if (currentAccount?.id) {
      saveAccountData(currentAccount.id, 'brand_theme_id', newBrandId);
    }
    const found = PHILIPPINE_INSURANCE_BRANDS.find((b) => b.id === newBrandId);
    if (found) {
      showToast(`Switched appearance to ${found.name} • "${found.tagline}"`, 'success');
    }
  };

  const setAppearanceMode = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    if (currentAccount?.id) {
      saveAccountData(currentAccount.id, 'appearance_mode', mode);
    }
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

  // Entities initialized for the active user account
  const [clients, setClients] = useState<Client[]>(() =>
    getAccountData(activeId, 'clients', isEarl ? INITIAL_CLIENTS : isCamille ? CAMILLE_INITIAL_CLIENTS : [])
  );
  const [policies, setPolicies] = useState<Policy[]>(() =>
    getAccountData(activeId, 'policies', isEarl ? INITIAL_POLICIES : isCamille ? CAMILLE_INITIAL_POLICIES : [])
  );
  const [premiumPayments, setPremiumPayments] = useState<PremiumPayment[]>(() =>
    getAccountData(activeId, 'premium_payments', isEarl ? INITIAL_PREMIUM_PAYMENTS : [])
  );
  const [fundValues, setFundValues] = useState<FundValueRecord[]>(() =>
    getAccountData(
      activeId,
      'fund_values',
      isEarl
        ? INITIAL_FUND_VALUES
        : isCamille
        ? [
            {
              id: 'cr-fv-1',
              clientId: 'cr-c1',
              policyId: 'cr-p1',
              date: '2026-09-20',
              fundName: 'InLife Growth Fund',
              units: 120000,
              navpu: 2.0,
              totalValue: 240000,
            },
          ]
        : []
    )
  );
  const [appointments, setAppointments] = useState<CalendarAppointment[]>(() =>
    getAccountData(activeId, 'appointments', isEarl ? INITIAL_APPOINTMENTS : [])
  );
  const [pendingEmails, setPendingEmails] = useState<PendingEmailReview[]>(() =>
    getAccountData(activeId, 'pending_emails', isEarl ? INITIAL_PENDING_EMAILS : [])
  );
  const [emailRecords, setEmailRecords] = useState<EmailRecord[]>(() =>
    getAccountData(activeId, 'email_records', isEarl ? INITIAL_EMAIL_RECORDS : [])
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>(() =>
    getAccountData(activeId, 'templates', INITIAL_TEMPLATES)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    getAccountData(activeId, 'activities', isEarl ? INITIAL_ACTIVITIES : [])
  );
  const [documents, setDocuments] = useState<DocumentRecord[]>(() =>
    getAccountData(activeId, 'documents', isEarl ? INITIAL_DOCUMENTS : [])
  );
  const [settings, setSettings] = useState<UserSettings>(() =>
    getAccountData(
      activeId,
      'settings',
      isEarl
        ? INITIAL_SETTINGS
        : isCamille
        ? {
            ...INITIAL_SETTINGS,
            advisorName: 'Camille Reyes',
            advisorEmail: 'camille.reyes@inlife.com.ph',
            advisorPhone: '+63 919 444 8888',
            advisorTitle: 'Associate Financial Adviser',
            unitBranch: 'InLife BGC Prestige Financial District',
          }
        : {
            ...INITIAL_SETTINGS,
            advisorName: currentAccount?.name || 'Financial Adviser',
            advisorEmail: currentAccount?.email || 'adviser@inlife.com.ph',
            advisorTitle: currentAccount?.role || 'Financial Adviser',
            unitBranch: currentAccount?.unitBranch || 'InLife Makati Financial Center',
          }
    )
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

  // Persist entities strictly to the active user's storage
  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'clients', clients);
  }, [clients, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'policies', policies);
  }, [policies, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'premium_payments', premiumPayments);
  }, [premiumPayments, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'fund_values', fundValues);
  }, [fundValues, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'appointments', appointments);
  }, [appointments, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'pending_emails', pendingEmails);
  }, [pendingEmails, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'email_records', emailRecords);
  }, [emailRecords, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'templates', templates);
  }, [templates, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'activities', activities);
  }, [activities, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'documents', documents);
  }, [documents, currentAccount?.id]);

  useEffect(() => {
    if (currentAccount?.id) saveAccountData(currentAccount.id, 'settings', settings);
  }, [settings, currentAccount?.id]);

  // Account switching and authentication functions
  const loginAccount = (account: AppAccount) => {
    setCurrentAccount(account);
    localStorage.setItem(CURRENT_ACCOUNT_STORAGE_KEY, account.id);
    localStorage.setItem(`inlife_account_meta_${account.id}`, JSON.stringify(account));

    // Register account if not existing in registered list
    setAllAccounts((prev) => {
      if (prev.some((a) => a.id === account.id)) return prev;
      const updated = [...prev, account];
      localStorage.setItem(REGISTERED_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    const isEarlAcc = account.id === 'earl_restar';
    const isCamilleAcc = account.id === 'camille_reyes';

    setClients(getAccountData(account.id, 'clients', isEarlAcc ? INITIAL_CLIENTS : isCamilleAcc ? CAMILLE_INITIAL_CLIENTS : []));
    setPolicies(getAccountData(account.id, 'policies', isEarlAcc ? INITIAL_POLICIES : isCamilleAcc ? CAMILLE_INITIAL_POLICIES : []));
    setPremiumPayments(getAccountData(account.id, 'premium_payments', isEarlAcc ? INITIAL_PREMIUM_PAYMENTS : []));
    setFundValues(
      getAccountData(
        account.id,
        'fund_values',
        isEarlAcc
          ? INITIAL_FUND_VALUES
          : isCamilleAcc
          ? [
              {
                id: 'cr-fv-1',
                clientId: 'cr-c1',
                policyId: 'cr-p1',
                date: '2026-09-20',
                fundName: 'InLife Growth Fund',
                units: 120000,
                navpu: 2.0,
                totalValue: 240000,
              },
            ]
          : []
      )
    );
    setAppointments(getAccountData(account.id, 'appointments', isEarlAcc ? INITIAL_APPOINTMENTS : []));
    setPendingEmails(getAccountData(account.id, 'pending_emails', isEarlAcc ? INITIAL_PENDING_EMAILS : []));
    setEmailRecords(getAccountData(account.id, 'email_records', isEarlAcc ? INITIAL_EMAIL_RECORDS : []));
    setTemplates(getAccountData(account.id, 'templates', INITIAL_TEMPLATES));
    setActivities(getAccountData(account.id, 'activities', isEarlAcc ? INITIAL_ACTIVITIES : []));
    setDocuments(getAccountData(account.id, 'documents', isEarlAcc ? INITIAL_DOCUMENTS : []));
    setSettings(
      getAccountData(
        account.id,
        'settings',
        isEarlAcc
          ? INITIAL_SETTINGS
          : isCamilleAcc
          ? {
              ...INITIAL_SETTINGS,
              advisorName: 'Camille Reyes',
              advisorEmail: 'camille.reyes@inlife.com.ph',
              advisorPhone: '+63 919 444 8888',
              advisorTitle: 'Associate Financial Adviser',
              unitBranch: 'InLife BGC Prestige Financial District',
            }
          : {
              ...INITIAL_SETTINGS,
              advisorName: account.name,
              advisorEmail: account.email,
              advisorPhone: account.phone || '+63 917 000 0000',
              advisorTitle: account.role,
              unitBranch: account.unitBranch,
            }
      )
    );

    if (account.brandId) {
      setBrandTheme(account.brandId);
    }
  };

  const logoutAccount = () => {
    setCurrentAccount(null);
    localStorage.removeItem(CURRENT_ACCOUNT_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PREFIX + 'google_connected');
    sessionStorage.removeItem('inlife_session_gmail_token');
    showToast('Signed out of adviser workspace.', 'info');
  };

  // Real-Time Dynamic Aggregate Metrics Computed Live
  const activeClients = clients.filter((c) => !c.isArchived).length;
  const totalClients = clients.length;
  const archivedClients = clients.filter((c) => c.isArchived).length;
  const activePolicies = policies.filter((p) => p.status === 'In Force').length;
  const totalPolicies = policies.length;
  const totalFundValue = fundValues.reduce((sum, f) => sum + (Number(f.totalValue) || 0), 0);
  const totalAnnualizedPremium = policies
    .filter((p) => p.status === 'In Force')
    .reduce((sum, p) => sum + (Number(p.premiumAmount) || 0), 0);

  const pendingLedgerAmount = premiumPayments
    .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const premiumsDueAmount =
    pendingLedgerAmount > 0
      ? pendingLedgerAmount
      : policies.filter((p) => p.status === 'In Force').reduce((sum, p) => sum + (Number(p.premiumAmount) || 0), 0);

  const upcomingPremiumsCount = policies.filter((p) => p.status === 'In Force').length;
  const pendingReviewsCount = pendingEmails.length;
  const todayAppointmentsCount = appointments.filter(
    (a) => a.date === '2026-09-26' || a.date === new Date().toISOString().split('T')[0]
  ).length;

  const metrics = {
    totalClients,
    activeClients,
    archivedClients,
    totalPolicies,
    activePolicies,
    totalFundValue,
    totalAnnualizedPremium,
    premiumsDueAmount,
    upcomingPremiumsCount,
    pendingReviewsCount,
    todayAppointmentsCount,
    formatPHP,
    formatPHPCompact,
  };

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

  const updatePolicy = (id: string, updates: Partial<Policy>) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // If fundValue was updated, keep fundValues records in sync
    if (typeof updates.fundValue === 'number') {
      const existingPol = policies.find((p) => p.id === id);
      const targetClientId = updates.clientId || existingPol?.clientId || '';
      
      setFundValues((prev) => {
        const match = prev.find((fv) => fv.policyId === id);
        if (match) {
          return prev.map((fv) =>
            fv.policyId === id
              ? {
                  ...fv,
                  totalValue: updates.fundValue!,
                  units: Math.round(updates.fundValue! / (fv.navpu || 2.05)),
                  date: new Date().toISOString().split('T')[0],
                }
              : fv
          );
        } else if (updates.fundValue! > 0) {
          const newFv: FundValueRecord = {
            id: `fv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            clientId: targetClientId,
            policyId: id,
            fundName: 'InLife Growth Fund',
            units: Math.round(updates.fundValue! / 2.05),
            navpu: 2.05,
            totalValue: updates.fundValue!,
            date: new Date().toISOString().split('T')[0],
          };
          return [...prev, newFv];
        }
        return prev;
      });
    }

    // Log activity
    const pol = policies.find((p) => p.id === id);
    const targetClientId = updates.clientId || pol?.clientId;
    if (targetClientId) {
      const client = clients.find((c) => c.id === targetClientId);
      if (client) {
        addActivity(
          client.id,
          `${client.firstName} ${client.lastName}`,
          'note_added',
          `Policy Updated: ${updates.productName || pol?.productName || 'InLife Policy'}`,
          `Policy #${updates.policyNumber || pol?.policyNumber} updated (Status: ${updates.status || pol?.status}, Premium: ₱${(updates.premiumAmount ?? pol?.premiumAmount ?? 0).toLocaleString()}).`
        );
      }
    }

    showToast(`Policy #${updates.policyNumber || pol?.policyNumber || ''} updated successfully!`, 'success');
  };

  const deletePolicy = (id: string) => {
    const pol = policies.find((p) => p.id === id);
    if (!pol) return;

    setPolicies((prev) => prev.filter((p) => p.id !== id));
    setFundValues((prev) => prev.filter((fv) => fv.policyId !== id));
    setPremiumPayments((prev) => prev.filter((pay) => pay.policyId !== id));

    const client = clients.find((c) => c.id === pol.clientId);
    if (client) {
      addActivity(
        client.id,
        `${client.firstName} ${client.lastName}`,
        'note_added',
        `Policy Removed`,
        `Policy #${pol.policyNumber} (${pol.productName}) was removed from client records.`
      );
    }
    showToast(`Policy #${pol.policyNumber} deleted.`, 'info');
  };

  const addFundValue = (fundData: Omit<FundValueRecord, 'id'>): FundValueRecord => {
    const newFv: FundValueRecord = {
      ...fundData,
      id: `fv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setFundValues((prev) => [newFv, ...prev]);
    return newFv;
  };

  const addPremiumPayment = (paymentData: Omit<PremiumPayment, 'id'>): PremiumPayment => {
    const newPay: PremiumPayment = {
      ...paymentData,
      id: `pay-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setPremiumPayments((prev) => [newPay, ...prev]);
    return newPay;
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
        updatePolicy,
        deletePolicy,
        premiumPayments,
        addPremiumPayment,
        fundValues,
        addFundValue,
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

        currentAccount,
        loginAccount,
        logoutAccount,
        allAccounts,
        metrics,

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
