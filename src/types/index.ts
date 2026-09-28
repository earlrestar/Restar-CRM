export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';
export type CivilStatus = 'Single' | 'Married' | 'Widowed' | 'Separated';
export type ClientStatus = 'Active' | 'Inactive' | 'Prospect' | 'Amorsolo Circle' | 'Archived' | 'VIP';
export type ContactMethod = 'Email' | 'Mobile Number' | 'Phone Call' | 'Facebook Messenger';

export interface CommunicationPreferences {
  birthdayGreetings: boolean;
  premiumReminders: boolean;
  newsletter: boolean;
  marketingCommunications: boolean;
  policyReviewReminders: boolean;
}

export interface Client {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  birthday: string; // YYYY-MM-DD
  gender: Gender;
  civilStatus: CivilStatus;
  occupation: string;
  address: string;
  email: string;
  mobileNumber: string;
  facebook?: string;
  preferredContactMethod: ContactMethod;
  clientSince: string;
  clientStatus: ClientStatus;
  source: string;
  adviserNotes?: string;
  tags: string[];
  communicationPreferences: CommunicationPreferences;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PolicyStatus = 'In Force' | 'Grace Period' | 'Lapsed' | 'Paid Up' | 'Claimed';
export type PaymentFrequency = 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';

export interface Policy {
  id: string;
  clientId: string;
  policyNumber: string;
  productName: string; // e.g. "iProtect 1", "iProtect 5", "iProtect 10", "Abundance 20", "Abundance 65", "Resilience CIE", "Resilience CHS", "Resilience Female Cancer", "Retire Assure", "Wealth Assure Plus", "Solid Fund Builder", "Inlife Global Care Worldwide", "Inlife Global Care Excl. USA"
  planType: string; // e.g. "VUL", "Traditional Whole Life", "Term Life", "Health", "Global Medical"
  faceAmount: number;
  premiumAmount: number;
  paymentFrequency: PaymentFrequency;
  status: PolicyStatus;
  issueDate: string;
  dueDate: string;
  nextBillingDate: string;
  anniversaryDate: string;
  fundValue: number;
  riders: string[];
}

export interface PremiumPayment {
  id: string;
  clientId: string;
  policyId: string;
  policyNumber: string;
  amount: number;
  paymentDate: string;
  dueDate: string;
  referenceNumber: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod: string;
}

export interface FundValueRecord {
  id: string;
  clientId: string;
  policyId: string;
  date: string;
  fundName: string;
  units: number;
  navpu: number;
  totalValue: number;
}

export interface CalendarAppointment {
  id: string;
  googleEventId?: string;
  clientId?: string;
  clientName?: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  description?: string;
  meetLink?: string;
  reminderMinutes: number; // e.g. 1440 (1 day), 180 (3 hrs), 60 (1 hr), 30
  attendees: string[];
  status: 'Confirmed' | 'Scheduled' | 'Completed' | 'Cancelled';
  syncedToGoogle: boolean;
}

export type EmailType =
  | 'Birthday'
  | 'Premium Reminder'
  | 'Overdue Premium'
  | 'Policy Anniversary'
  | 'Annual Review'
  | 'Newsletter'
  | 'Holiday Greeting'
  | 'Appointment Confirmation'
  | 'Appointment Reminder'
  | 'Thank You'
  | 'Welcome'
  | 'Custom';

export type EmailStatus = 'Draft' | 'Scheduled' | 'Sending' | 'Sent' | 'Failed';

export interface EmailRecord {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  emailType: EmailType;
  relatedClientId?: string;
  relatedPolicyId?: string;
  relatedPolicyNumber?: string;
  status: EmailStatus;
  provider: 'Gmail' | 'Other / Resend';
  sentAt?: string;
  scheduledFor?: string;
  errorMessage?: string;
  googleMessageId?: string;
}

export interface PendingEmailReview {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  policyId?: string;
  policyNumber?: string;
  policyProduct?: string;
  emailType: EmailType;
  subject: string;
  bodyHtml: string;
  dueDate?: string;
  generatedDate: string;
  reason: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: EmailType;
  subject: string;
  content: string; // HTML format with merge tags
  description: string;
  isDefault?: boolean;
}

export interface EmailCustomLinks {
  reviewLink: string;
  paymentLink: string;
  calendarLink: string;
  policyPortalLink: string;
  websiteLink: string;
  facebookLink: string;
}

export type AutomationMode = 'AUTOMATIC' | 'APPROVAL_REQUIRED';

export interface AutomationSettings {
  mode: AutomationMode;
  birthdayEnabled: boolean;
  premiumReminderDays: {
    thirtyDays: boolean;
    fourteenDays: boolean;
    sevenDays: boolean;
    oneDay: boolean;
    dueDate: boolean;
    overdue: boolean;
  };
  policyAnniversaryEnabled: boolean;
  annualReviewEnabled: boolean;
  appointmentRemindersEnabled: {
    threeDaysBefore: boolean;
    oneDayBefore: boolean;
    postMeetingThankYou: boolean;
  };
  newsletterEnabled: boolean;
}

export interface UserSettings {
  advisorName: string;
  advisorEmail: string;
  advisorPhone: string;
  advisorTitle: string;
  unitBranch: string;
  emailProvider: 'Gmail' | 'Other / Resend';
  customLinks: EmailCustomLinks;
  automation: AutomationSettings;
  emailSignatureHtml: string;
  calendarDefaultView: 'month' | 'week' | 'day' | 'agenda';
  calendarDefaultReminderMinutes: number;
}

export type ActivityType =
  | 'client_created'
  | 'policy_created'
  | 'premium_payment'
  | 'fund_value_updated'
  | 'email_sent'
  | 'birthday_greeting'
  | 'appointment_scheduled'
  | 'document_uploaded'
  | 'note_added';

export interface ActivityItem {
  id: string;
  clientId: string;
  clientName: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  iconName?: string;
  metadata?: Record<string, any>;
}

export interface DocumentRecord {
  id: string;
  clientId: string;
  title: string;
  category: 'Policy Contract' | 'Proposal' | 'Application' | 'Receipt' | 'Claim Form' | 'KYC';
  fileName: string;
  uploadDate: string;
  fileSize: string;
}

export interface AppAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  unitBranch: string;
  phone?: string;
  initials: string;
  brandId: string;
  avatarUrl?: string;
  isCustom?: boolean;
}

