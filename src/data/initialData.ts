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
} from '../types';

export const INITIAL_SETTINGS: UserSettings = {
  advisorName: 'Earl Restar',
  advisorEmail: 'earlrestarpogi@gmail.com',
  advisorPhone: '+63 917 890 1234',
  advisorTitle: 'Senior Wealth Management Adviser',
  unitBranch: 'InLife Makati Financial Center — Agape Unit',
  emailProvider: 'Gmail',
  customLinks: {
    reviewLink: 'https://inlife.com.ph/advisor-review/earl-restar',
    paymentLink: 'https://pay.insularlife.com.ph/quickpay',
    calendarLink: 'https://calendar.google.com/calendar/u/0/r',
    policyPortalLink: 'https://customer.insularlife.com.ph',
    websiteLink: 'https://www.insularlife.com.ph',
    facebookLink: 'https://facebook.com/InLifeAdviserEarl',
  },
  automation: {
    mode: 'APPROVAL_REQUIRED', // The user prompt explicitly emphasizes the 2 modes and Approval Required queue
    birthdayEnabled: true,
    premiumReminderDays: {
      thirtyDays: true,
      fourteenDays: true,
      sevenDays: true,
      oneDay: true,
      dueDate: true,
      overdue: true,
    },
    policyAnniversaryEnabled: true,
    annualReviewEnabled: true,
    appointmentRemindersEnabled: {
      threeDaysBefore: true,
      oneDayBefore: true,
      postMeetingThankYou: true,
    },
    newsletterEnabled: false,
  },
  emailSignatureHtml: `<div style="font-family: Arial, sans-serif; font-size: 13px; color: #333; line-height: 1.5; margin-top: 20px; border-top: 2px solid #00529B; padding-top: 12px;">
  <strong style="color: #00529B; font-size: 15px;">Earl Restar</strong><br/>
  <span>Senior Wealth Management Adviser | MDRT Aspirant</span><br/>
  <span>Insular Life Assurance Company Ltd.</span><br/>
  <span>Mobile: +63 917 890 1234 | Email: earlrestarpogi@gmail.com</span><br/>
  <span style="color: #718096; font-size: 11px;">"A Filipino company dedicated to safeguarding what matters most."</span>
</div>`,
  calendarDefaultView: 'month',
  calendarDefaultReminderMinutes: 60,
};

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'c-1',
    firstName: 'Maria',
    middleName: 'Clara',
    lastName: 'Santos',
    preferredName: 'Maria',
    birthday: '1989-10-14',
    gender: 'Female',
    civilStatus: 'Married',
    occupation: 'VP of Marketing, FinTech Corp',
    address: 'Unit 24B, Tower One, Legaspi Village, Makati City',
    email: 'maria.santos.sample@gmail.com',
    mobileNumber: '+63 918 555 0101',
    facebook: 'facebook.com/mariacsantos',
    preferredContactMethod: 'Email',
    clientSince: '2021-04-12',
    clientStatus: 'Amorsolo Circle',
    source: 'Referral from John Dela Cruz',
    adviserNotes: 'High net worth profile. Interested in offshore asset allocation and educational fund for her 5-year-old daughter. Prefers afternoon consultations.',
    tags: ['Amorsolo Circle', 'HNWI', 'Executive', 'Referral'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2021-04-12T08:00:00Z',
    updatedAt: '2026-09-20T10:15:00Z',
  },
  {
    id: 'c-2',
    firstName: 'Juan',
    middleName: 'Alfonso',
    lastName: 'Dela Cruz',
    preferredName: 'Juan',
    birthday: '1985-09-29', // Birthday in 3 days!
    gender: 'Male',
    civilStatus: 'Married',
    occupation: 'Senior Software Architect',
    address: '12 Acacia Avenue, Valle Verde 2, Pasig City',
    email: 'juan.delacruz.ph@gmail.com',
    mobileNumber: '+63 917 123 4567',
    facebook: 'facebook.com/juan.delacruz.tech',
    preferredContactMethod: 'Mobile Number',
    clientSince: '2019-08-15',
    clientStatus: 'Active',
    source: 'Online Campaign',
    adviserNotes: 'Key client holding 3 policies: Resilience, Abundance, and iProtect. Has upcoming birthday on September 29.',
    tags: ['Tech', 'Multiple Policies', 'Long Term'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: true,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2019-08-15T09:30:00Z',
    updatedAt: '2026-09-22T14:20:00Z',
  },
  {
    id: 'c-3',
    firstName: 'John',
    middleName: 'Robert',
    lastName: 'Dela Cruz',
    preferredName: 'John',
    birthday: '1992-05-18',
    gender: 'Male',
    civilStatus: 'Single',
    occupation: 'Managing Director, Logistics PH',
    address: 'Penthouse 3, Serendra, BGC, Taguig City',
    email: 'john.delacruz.biz@gmail.com',
    mobileNumber: '+63 919 888 2345',
    facebook: 'facebook.com/johndcruz',
    preferredContactMethod: 'Email',
    clientSince: '2022-01-10',
    clientStatus: 'Active',
    source: 'BNI Networking Group',
    adviserNotes: 'Scheduled for policy review today at 11:30 AM to discuss increasing health rider protection.',
    tags: ['Executive', 'Logistics', 'Health Focus'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: true,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2022-01-10T11:00:00Z',
    updatedAt: '2026-09-24T16:00:00Z',
  },
  {
    id: 'c-4',
    firstName: 'Ana',
    middleName: 'Patricia',
    lastName: 'Reyes',
    preferredName: 'Ana',
    birthday: '1994-11-03',
    gender: 'Female',
    civilStatus: 'Single',
    occupation: 'Attending Physician, St. Luke\'s Medical Center',
    address: 'Unit 1802, The Proscenium, Rockwell, Makati',
    email: 'dr.anareyes.md@gmail.com',
    mobileNumber: '+63 920 999 1122',
    preferredContactMethod: 'Facebook Messenger',
    clientSince: '2023-06-20',
    clientStatus: 'Active',
    source: 'Medical Mission Referral',
    adviserNotes: 'Financial planning meeting today at 2:00 PM. Interested in disability protection and retirement corpus planning.',
    tags: ['Doctor', 'Medical', 'Retirement Planning'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: false,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2023-06-20T10:00:00Z',
    updatedAt: '2026-09-25T09:10:00Z',
  },
  {
    id: 'c-5',
    firstName: 'Mark',
    middleName: 'Louie',
    lastName: 'Cruz',
    preferredName: 'Mark',
    birthday: '1987-03-22',
    gender: 'Male',
    civilStatus: 'Married',
    occupation: 'Creative Director, Apex Media',
    address: '45 Sunset Drive, Corinthian Gardens, Quezon City',
    email: 'mark.cruz.creative@gmail.com',
    mobileNumber: '+63 917 555 9876',
    preferredContactMethod: 'Phone Call',
    clientSince: '2020-11-05',
    clientStatus: 'Active',
    source: 'Facebook Ad',
    adviserNotes: 'Follow-up call today at 4:30 PM regarding Retire Assure annuity and fund allocation.',
    tags: ['Creative', 'VUL Investor'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: true,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2020-11-05T13:45:00Z',
    updatedAt: '2026-09-21T11:30:00Z',
  },
  {
    id: 'c-6',
    firstName: 'Beatriz',
    middleName: 'Marie',
    lastName: 'Alvarez',
    preferredName: 'Bea',
    birthday: '1991-09-28', // Tomorrow!
    gender: 'Female',
    civilStatus: 'Single',
    occupation: 'Head of People, GrowthWorks Inc.',
    address: '32 San Lorenzo Village, Makati City',
    email: 'beatriz.alvarez.ph@gmail.com',
    mobileNumber: '+63 922 456 7890',
    preferredContactMethod: 'Email',
    clientSince: '2022-09-15',
    clientStatus: 'Active',
    source: 'HR Corporate Talk',
    adviserNotes: 'Birthday greeting queued for review. Inlife Global Care Worldwide holder.',
    tags: ['HR', 'Corporate Client', 'Global Medical'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2022-09-15T08:30:00Z',
    updatedAt: '2026-09-24T18:00:00Z',
  },
  {
    id: 'c-7',
    firstName: 'Fernando',
    middleName: 'Jose',
    lastName: 'Montenegro',
    preferredName: 'Nando',
    birthday: '1975-12-04',
    gender: 'Male',
    civilStatus: 'Married',
    occupation: 'Real Estate Developer',
    address: '14 McKinley Road, Forbes Park, Makati City',
    email: 'f.montenegro.holdings@gmail.com',
    mobileNumber: '+63 917 111 2233',
    preferredContactMethod: 'Email',
    clientSince: '2018-03-14',
    clientStatus: 'Amorsolo Circle',
    source: 'Direct Personal Contact',
    adviserNotes: 'Major account holding Solid Fund Builder single-pay high equity wealth accumulation plan.',
    tags: ['Amorsolo Circle', 'HNWI', 'Estate Planning'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2018-03-14T10:00:00Z',
    updatedAt: '2026-09-25T15:00:00Z',
  },
  {
    id: 'c-8',
    firstName: 'Roberto',
    middleName: 'Tan',
    lastName: 'Lim',
    preferredName: 'Roberto',
    birthday: '1979-04-19',
    gender: 'Male',
    civilStatus: 'Married',
    occupation: 'Managing Director, Horizon Logistics',
    address: '77 Greenhills West, San Juan City',
    email: 'roberto.lim.horizon@gmail.com',
    mobileNumber: '+63 918 333 4455',
    preferredContactMethod: 'Email',
    clientSince: '2022-09-01',
    clientStatus: 'Amorsolo Circle',
    source: 'Chamber of Commerce',
    adviserNotes: 'Executive holding Inlife Global Care Excl. USA comprehensive healthcare plan.',
    tags: ['Amorsolo Circle', 'Global Medical', 'HNWI'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2022-09-01T14:00:00Z',
    updatedAt: '2026-09-20T12:00:00Z',
  },
  {
    id: 'c-9',
    firstName: 'Carmen',
    middleName: 'De Leon',
    lastName: 'Tan',
    preferredName: 'Carmen',
    birthday: '1995-07-22',
    gender: 'Female',
    civilStatus: 'Single',
    occupation: 'Senior UX Designer, Tech Global',
    address: 'Unit 1205, Avant Residences, BGC, Taguig City',
    email: 'carmen.tan.design@gmail.com',
    mobileNumber: '+63 917 888 4321',
    preferredContactMethod: 'Email',
    clientSince: '2024-01-15',
    clientStatus: 'Active',
    source: 'Instagram InLife Campaign',
    adviserNotes: 'Protected under 5-Year Renewable iProtect 5 term policy. Potential candidate for Abundance 20 next year.',
    tags: ['Young Professional', 'Term Life', 'Tech'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: true,
      marketingCommunications: true,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2026-09-22T09:00:00Z',
  },
  {
    id: 'c-10',
    firstName: 'Gabriel',
    middleName: 'Santos',
    lastName: 'Ramos',
    preferredName: 'Gabe',
    birthday: '1998-11-12',
    gender: 'Male',
    civilStatus: 'Single',
    occupation: 'Junior Financial Analyst',
    address: '88 Katipunan Avenue, Loyola Heights, Quezon City',
    email: 'gabe.ramos.ph@gmail.com',
    mobileNumber: '+63 920 444 7890',
    preferredContactMethod: 'Mobile Number',
    clientSince: '2025-06-01',
    clientStatus: 'Active',
    source: 'University Alumni Referral',
    adviserNotes: 'Starting career with pure protection via iProtect 1 term life plan. Very responsive.',
    tags: ['First Time Buyer', 'Term Life', 'Analyst'],
    communicationPreferences: {
      birthdayGreetings: true,
      premiumReminders: true,
      newsletter: false,
      marketingCommunications: false,
      policyReviewReminders: true,
    },
    isArchived: false,
    createdAt: '2025-06-01T11:30:00Z',
    updatedAt: '2026-09-24T14:15:00Z',
  }
];

export const INITIAL_POLICIES: Policy[] = [
  // Maria Santos
  {
    id: 'pol-101',
    clientId: 'c-1',
    policyNumber: 'IL-9823441',
    productName: 'Resilience CIE',
    planType: 'Comprehensive Critical Illness Endowment',
    faceAmount: 3000000,
    premiumAmount: 5000,
    paymentFrequency: 'Monthly',
    status: 'In Force',
    issueDate: '2021-04-20',
    dueDate: '2026-09-30', // Due in 4 days!
    nextBillingDate: '2026-10-30',
    anniversaryDate: '2027-04-20',
    fundValue: 342500,
    riders: ['Critical Illness Plus (100 conditions)', 'Daily Hospital Confinement', 'Accidental Death & Dismemberment'],
  },
  {
    id: 'pol-102',
    clientId: 'c-1',
    policyNumber: 'IL-9856722',
    productName: 'Abundance 20',
    planType: 'Variable Universal Life (20-Pay Wealth Accumulation)',
    faceAmount: 2000000,
    premiumAmount: 25000,
    paymentFrequency: 'Quarterly',
    status: 'In Force',
    issueDate: '2022-08-15',
    dueDate: '2026-11-15',
    nextBillingDate: '2026-11-15',
    anniversaryDate: '2027-08-15',
    fundValue: 685000,
    riders: ['Waiver of Premium on Disability', 'Term Booster Rider'],
  },
  // Juan Dela Cruz - 3 Policies (Resilience CHS, Abundance 65, iProtect 10)
  {
    id: 'pol-201',
    clientId: 'c-2',
    policyNumber: 'IL-8192033',
    productName: 'Resilience CHS',
    planType: 'Comprehensive Health Solution',
    faceAmount: 2500000,
    premiumAmount: 18500,
    paymentFrequency: 'Semi-Annual',
    status: 'In Force',
    issueDate: '2019-09-05',
    dueDate: '2026-10-05',
    nextBillingDate: '2026-10-05',
    anniversaryDate: '2027-09-05',
    fundValue: 410000,
    riders: ['Comprehensive Cancer Rider', 'Hospital Cash Benefit'],
  },
  {
    id: 'pol-202',
    clientId: 'c-2',
    policyNumber: 'IL-8594012',
    productName: 'Abundance 65',
    planType: 'Variable Universal Life (Pay to Age 65)',
    faceAmount: 3500000,
    premiumAmount: 45000,
    paymentFrequency: 'Semi-Annual',
    status: 'In Force',
    issueDate: '2020-03-12',
    dueDate: '2026-09-28', // Due in 2 days!
    nextBillingDate: '2027-03-12',
    anniversaryDate: '2027-03-12',
    fundValue: 1240000,
    riders: ['Accidental Death Benefit', 'Payor Waiver'],
  },
  {
    id: 'pol-203',
    clientId: 'c-2',
    policyNumber: 'IL-9102844',
    productName: 'iProtect 10',
    planType: '10-Year Renewable & Convertible Term Life',
    faceAmount: 5000000,
    premiumAmount: 22000,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2021-02-18',
    dueDate: '2027-02-18',
    nextBillingDate: '2027-02-18',
    anniversaryDate: '2027-02-18',
    fundValue: 0,
    riders: ['Total Disability Benefit'],
  },
  // John Dela Cruz
  {
    id: 'pol-301',
    clientId: 'c-3',
    policyNumber: 'IL-9481720',
    productName: 'Wealth Assure Plus',
    planType: 'Customizable Variable Universal Life',
    faceAmount: 4000000,
    premiumAmount: 30000,
    paymentFrequency: 'Quarterly',
    status: 'In Force',
    issueDate: '2022-01-25',
    dueDate: '2026-10-25',
    nextBillingDate: '2026-10-25',
    anniversaryDate: '2027-01-25',
    fundValue: 920000,
    riders: ['Accidental Death & Dismemberment', 'Critical Illness Rider'],
  },
  // Ana Reyes
  {
    id: 'pol-401',
    clientId: 'c-4',
    policyNumber: 'IL-9912048',
    productName: 'Resilience Female Cancer',
    planType: 'Specialized Female Health & Cancer Care',
    faceAmount: 3000000,
    premiumAmount: 68000,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2023-07-01',
    dueDate: '2026-10-01',
    nextBillingDate: '2026-10-01',
    anniversaryDate: '2027-07-01',
    fundValue: 185000,
    riders: ['Special Early Stage Female Cancer Rider', 'Waiver on Critical Illness'],
  },
  // Mark Cruz
  {
    id: 'pol-501',
    clientId: 'c-5',
    policyNumber: 'IL-8840192',
    productName: 'Retire Assure',
    planType: 'Guaranteed Pension & Retirement Income',
    faceAmount: 2000000,
    premiumAmount: 12500,
    paymentFrequency: 'Monthly',
    status: 'In Force',
    issueDate: '2020-11-20',
    dueDate: '2026-10-20',
    nextBillingDate: '2026-10-20',
    anniversaryDate: '2026-11-20',
    fundValue: 560000,
    riders: ['Accidental Death Benefit'],
  },
  // Patricia Gomez
  {
    id: 'pol-601',
    clientId: 'c-6',
    policyNumber: 'IL-6102941',
    productName: 'Inlife Global Care Worldwide',
    planType: 'Worldwide International Medical Insurance (Including USA)',
    faceAmount: 100000000,
    premiumAmount: 145000,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2023-05-10',
    dueDate: '2026-11-10',
    nextBillingDate: '2026-11-10',
    anniversaryDate: '2027-05-10',
    fundValue: 0,
    riders: ['Global Medical Evacuation & Repatriation', 'Prescription Drug Rider'],
  },
  // Fernando Montenegro
  {
    id: 'pol-701',
    clientId: 'c-7',
    policyNumber: 'IL-7281903',
    productName: 'Solid Fund Builder',
    planType: 'Single-Pay / High Equity Wealth Accumulation VUL',
    faceAmount: 25000000,
    premiumAmount: 250000,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2018-04-10',
    dueDate: '2027-04-10',
    nextBillingDate: '2027-04-10',
    anniversaryDate: '2027-04-10',
    fundValue: 14750000,
    riders: ['Comprehensive Estate Transfer Rider', 'Global Equity Allocation'],
  },
  // Roberto Lim
  {
    id: 'pol-801',
    clientId: 'c-8',
    policyNumber: 'IL-5920311',
    productName: 'Inlife Global Care Excl. USA',
    planType: 'Worldwide International Medical Insurance (Excluding USA)',
    faceAmount: 75000000,
    premiumAmount: 98000,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2022-09-01',
    dueDate: '2026-10-15',
    nextBillingDate: '2026-10-15',
    anniversaryDate: '2027-09-01',
    fundValue: 0,
    riders: ['Emergency International Medical Assistance', 'Second Medical Opinion Rider'],
  },
  // Carmen Tan
  {
    id: 'pol-901',
    clientId: 'c-9',
    policyNumber: 'IL-4819200',
    productName: 'iProtect 5',
    planType: '5-Year Renewable & Convertible Term Life',
    faceAmount: 3000000,
    premiumAmount: 14500,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2024-01-15',
    dueDate: '2027-01-15',
    nextBillingDate: '2027-01-15',
    anniversaryDate: '2027-01-15',
    fundValue: 0,
    riders: ['Accidental Death Benefit'],
  },
  // Gabriel Ramos
  {
    id: 'pol-1001',
    clientId: 'c-10',
    policyNumber: 'IL-3829104',
    productName: 'iProtect 1',
    planType: '1-Year Renewable Term Life Protection',
    faceAmount: 2000000,
    premiumAmount: 6500,
    paymentFrequency: 'Annual',
    status: 'In Force',
    issueDate: '2025-06-01',
    dueDate: '2026-06-01',
    nextBillingDate: '2026-06-01',
    anniversaryDate: '2026-06-01',
    fundValue: 0,
    riders: ['Total and Permanent Disability'],
  },
];

export const INITIAL_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: 'apt-1',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    title: 'Client Consultation — Maria Santos',
    date: '2026-09-26', // Today!
    startTime: '09:00',
    endTime: '10:00',
    location: 'InLife Makati Financial Center, 15th Flr Boardroom',
    description: 'Review portfolio performance and discuss child education endowment proposal for daughter.',
    meetLink: 'https://meet.google.com/xyz-inlife-makati',
    reminderMinutes: 60,
    attendees: ['maria.santos.sample@gmail.com', 'earlrestarpogi@gmail.com'],
    status: 'Confirmed',
    syncedToGoogle: true,
  },
  {
    id: 'apt-2',
    clientId: 'c-3',
    clientName: 'John Dela Cruz',
    title: 'Policy Review — John Dela Cruz',
    date: '2026-09-26', // Today!
    startTime: '11:30',
    endTime: '12:30',
    location: 'Google Meet (Virtual)',
    description: 'Annual health rider review and Wealth Assure Plus fund rebalancing.',
    meetLink: 'https://meet.google.com/abc-rev-johnd',
    reminderMinutes: 30,
    attendees: ['john.delacruz.biz@gmail.com', 'earlrestarpogi@gmail.com'],
    status: 'Confirmed',
    syncedToGoogle: true,
  },
  {
    id: 'apt-3',
    clientId: 'c-4',
    clientName: 'Ana Reyes',
    title: 'Financial Planning Meeting — Ana Reyes',
    date: '2026-09-26', // Today!
    startTime: '14:00',
    endTime: '15:15',
    location: 'Wildflour Cafe + Bakery, Rockwell, Makati',
    description: 'Comprehensive retirement mapping and Resilience Female Cancer coverage discussion.',
    reminderMinutes: 120,
    attendees: ['dr.anareyes.md@gmail.com', 'earlrestarpogi@gmail.com'],
    status: 'Confirmed',
    syncedToGoogle: true,
  },
  {
    id: 'apt-4',
    clientId: 'c-5',
    clientName: 'Mark Cruz',
    title: 'Follow-up Call — Mark Cruz',
    date: '2026-09-26', // Today!
    startTime: '16:30',
    endTime: '17:00',
    location: 'Phone Call (+63 917 555 9876)',
    description: 'Confirm Retire Assure annuity details and discuss market dividend yield.',
    reminderMinutes: 30,
    attendees: ['mark.cruz.creative@gmail.com'],
    status: 'Scheduled',
    syncedToGoogle: true,
  },
  {
    id: 'apt-5',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    title: 'Annual Policy Review — Maria Santos',
    date: '2026-09-28', // In 2 days
    startTime: '14:00',
    endTime: '15:00',
    location: 'Google Meet',
    description: 'Deep dive into 5-year Resilience CIE policy review and beneficiary updates.',
    meetLink: 'https://meet.google.com/inlife-santos-rev',
    reminderMinutes: 1440,
    attendees: ['maria.santos.sample@gmail.com'],
    status: 'Scheduled',
    syncedToGoogle: true,
  },
  {
    id: 'apt-6',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    title: 'Fund Review — Maria Santos',
    date: '2026-10-10',
    startTime: '10:00',
    endTime: '11:00',
    location: 'The Coffee Academics, BGC',
    description: 'Q3 InLife Equity Fund performance check for Abundance 20.',
    reminderMinutes: 1440,
    attendees: ['maria.santos.sample@gmail.com'],
    status: 'Scheduled',
    syncedToGoogle: true,
  },
  {
    id: 'apt-7',
    clientId: 'c-2',
    clientName: 'Juan Dela Cruz',
    title: 'Coffee & Birthday Catch-up — Juan Dela Cruz',
    date: '2026-09-30',
    startTime: '15:00',
    endTime: '16:00',
    location: 'Dean & Deluca, Capitol Commons, Pasig',
    description: 'Hand over InLife birthday token and review Abundance 65 fund allocation.',
    reminderMinutes: 180,
    attendees: ['juan.delacruz.ph@gmail.com'],
    status: 'Confirmed',
    syncedToGoogle: true,
  }
];

export const INITIAL_PENDING_EMAILS: PendingEmailReview[] = [
  {
    id: 'pending-1',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    clientEmail: 'maria.santos.sample@gmail.com',
    policyId: 'pol-101',
    policyNumber: 'IL-9823441',
    policyProduct: 'Resilience CIE',
    emailType: 'Premium Reminder',
    subject: 'InLife Reminder: Premium Due for Policy #IL-9823441 (Resilience CIE)',
    dueDate: '2026-09-30',
    generatedDate: '2026-09-26',
    reason: 'Due date approaching in 4 days (₱5,000.00)',
    bodyHtml: `
<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">InLife Premium Notice</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>Maria</strong>,</p>
    <p>Greetings of good health and peace of mind from Insular Life!</p>
    <p>This is a friendly reminder that your premium for policy <strong>#IL-9823441 (Resilience CIE)</strong> is scheduled for payment on <strong>September 30, 2026</strong>.</p>
    <div style="background-color: #F0F7FF; border-left: 4px solid #00529B; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px;"><strong>Policy Number:</strong> IL-9823441</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Plan:</strong> Resilience CIE (Comprehensive Critical Illness Endowment)</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Amount Due:</strong> ₱5,000.00</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Due Date:</strong> September 30, 2026</p>
    </div>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://pay.insularlife.com.ph/quickpay" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 15px;">PAY PREMIUM ONLINE</a>
    </div>
    <p style="font-size: 13px; color: #718096;">Maintaining your premium ensures your family's financial security and health protection remain continuous and active.</p>
    <p>Warm regards,<br/><strong>Earl Restar</strong><br/>InLife Senior Wealth Management Adviser</p>
  </div>
</div>`,
  },
  {
    id: 'pending-2',
    clientId: 'c-2',
    clientName: 'Juan Dela Cruz',
    clientEmail: 'juan.delacruz.ph@gmail.com',
    policyId: 'pol-202',
    policyNumber: 'IL-8594012',
    policyProduct: 'Abundance 65',
    emailType: 'Premium Reminder',
    subject: 'Upcoming Premium Notice: Abundance 65 (IL-8594012)',
    dueDate: '2026-09-28',
    generatedDate: '2026-09-26',
    reason: 'Due date approaching in 2 days (₱45,000.00)',
    bodyHtml: `
<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">InLife Premium Notice</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Hi <strong>Juan</strong>,</p>
    <p>A gentle reminder regarding your semi-annual premium for <strong>Abundance 65 (Policy #IL-8594012)</strong> due on <strong>September 28, 2026</strong> in the amount of <strong>₱45,000.00</strong>.</p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="https://pay.insularlife.com.ph/quickpay" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">PROCEED TO QUICKPAY</a>
    </div>
    <p>Thank you for your continued trust in Insular Life!</p>
    <p>Best regards,<br/><strong>Earl Restar</strong></p>
  </div>
</div>`,
  },
  {
    id: 'pending-3',
    clientId: 'c-2',
    clientName: 'Juan Dela Cruz',
    clientEmail: 'juan.delacruz.ph@gmail.com',
    emailType: 'Birthday',
    subject: 'Happy Birthday from InLife, Juan! 🎂🎈',
    generatedDate: '2026-09-26',
    reason: 'Upcoming birthday on September 29',
    bodyHtml: `
<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #00529B 0%, #002D54 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
    <span style="font-size: 40px;">🎂</span>
    <h1 style="color: #FFFFFF; margin: 8px 0 0; font-size: 26px;">Happy Birthday, Juan!</h1>
  </div>
  <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>Juan</strong>,</p>
    <p>On behalf of Insular Life and our entire advisory team, I want to wish you a very happy, joyous, and blessed birthday on September 29!</p>
    <p>May this coming year bring you and your family abundant health, prosperity, and continued success in all your endeavors.</p>
    <p>It remains my great honor to walk alongside you as your financial adviser and protector of your dreams.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="https://inlife.com.ph/advisor-review/earl-restar" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">SCHEDULE AN ANNUAL CHAT</a>
    </div>
    <p>Cheers to another wonderful year!</p>
    <p>Warmest regards,<br/><strong>Earl Restar</strong><br/>Your InLife Financial Adviser</p>
  </div>
</div>`,
  },
  {
    id: 'pending-4',
    clientId: 'c-6',
    clientName: 'Beatriz Alvarez',
    clientEmail: 'beatriz.alvarez.ph@gmail.com',
    emailType: 'Birthday',
    subject: 'Warmest Birthday Wishes, Bea! 🎉✨',
    generatedDate: '2026-09-26',
    reason: 'Upcoming birthday tomorrow on September 28',
    bodyHtml: `
<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #00529B 0%, #002D54 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
    <span style="font-size: 40px;">🎉</span>
    <h1 style="color: #FFFFFF; margin: 8px 0 0; font-size: 26px;">Happy Birthday, Bea!</h1>
  </div>
  <div style="padding: 30px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>Bea</strong>,</p>
    <p>Wishing you a wonderful birthday filled with joy, laughter, and relaxation with your loved ones!</p>
    <p>Thank you for trusting Insular Life with your personal protection goals.</p>
    <p>Wishing you continued milestones and abundant peace of mind this year.</p>
    <p>With warm regards,<br/><strong>Earl Restar</strong></p>
  </div>
</div>`,
  },
  {
    id: 'pending-5',
    clientId: 'c-4',
    clientName: 'Ana Reyes',
    clientEmail: 'dr.anareyes.md@gmail.com',
    policyId: 'pol-401',
    policyNumber: 'IL-9912048',
    policyProduct: 'Resilience Female Cancer',
    emailType: 'Premium Reminder',
    subject: 'Notice of Premium Due: Resilience Female Cancer (Policy #IL-9912048)',
    dueDate: '2026-10-01',
    generatedDate: '2026-09-26',
    reason: 'Annual premium due in 5 days (₱68,000.00)',
    bodyHtml: `
<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">InLife Premium Notice</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>Dr. Ana</strong>,</p>
    <p>We hope you are having a productive week. Your annual premium for <strong>Resilience Female Cancer (Policy #IL-9912048)</strong> is due on <strong>October 01, 2026</strong>.</p>
    <p><strong>Amount:</strong> ₱68,000.00</p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="https://pay.insularlife.com.ph/quickpay" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">PAY VIA INLIFE PORTAL</a>
    </div>
    <p>Warm regards,<br/><strong>Earl Restar</strong></p>
  </div>
</div>`,
  }
];

export const INITIAL_EMAIL_RECORDS: EmailRecord[] = [
  {
    id: 'em-1',
    recipientEmail: 'maria.santos.sample@gmail.com',
    recipientName: 'Maria Santos',
    subject: 'Confirmation: Consultation on Saturday Sep 26 at 9:00 AM',
    bodyHtml: '<p>Hi Maria, looking forward to our consultation tomorrow morning at InLife Makati Financial Center.</p>',
    emailType: 'Appointment Confirmation',
    relatedClientId: 'c-1',
    status: 'Sent',
    provider: 'Gmail',
    sentAt: '2026-09-25T14:30:00Z',
    googleMessageId: 'gm_18e9a2b847c01',
  },
  {
    id: 'em-2',
    recipientEmail: 'john.delacruz.biz@gmail.com',
    recipientName: 'John Dela Cruz',
    subject: 'Meeting Link: Annual Policy Review — Sep 26 at 11:30 AM',
    bodyHtml: '<p>Hi John, here is the Google Meet link for our review: https://meet.google.com/abc-rev-johnd</p>',
    emailType: 'Appointment Reminder',
    relatedClientId: 'c-3',
    status: 'Sent',
    provider: 'Gmail',
    sentAt: '2026-09-25T17:15:00Z',
    googleMessageId: 'gm_18e9a4f912a10',
  },
  {
    id: 'em-3',
    recipientEmail: 'mark.cruz.creative@gmail.com',
    recipientName: 'Mark Cruz',
    subject: 'Retire Assure Portfolio Performance Update: Q3 2026',
    bodyHtml: '<p>Hi Mark, your Retire Assure policy fund value has grown to ₱560,000. Let us discuss during our call today.</p>',
    emailType: 'Annual Review',
    relatedClientId: 'c-5',
    relatedPolicyId: 'pol-501',
    relatedPolicyNumber: 'IL-8840192',
    status: 'Sent',
    provider: 'Gmail',
    sentAt: '2026-09-24T09:00:00Z',
    googleMessageId: 'gm_18e8df8172900',
  }
];

export const INITIAL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Standard InLife Birthday Greeting',
    category: 'Birthday',
    subject: 'Happy Birthday from InLife, {{first_name}}! 🎂🎈',
    description: 'Warm birthday greeting with customizable advisory note and consultation link.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background: linear-gradient(135deg, #00529B 0%, #002D54 100%); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
    <span style="font-size: 42px;">🎂</span>
    <h1 style="color: #FFFFFF; margin: 8px 0 0; font-size: 26px;">Happy Birthday, {{first_name}}!</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>{{preferred_name}}</strong>,</p>
    <p>On behalf of Insular Life, I wish you a year ahead filled with good health, abundance, joy, and peace of mind.</p>
    <p>It remains my great pleasure to assist you in securing what matters most to you and your loved ones.</p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="{{review_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">SCHEDULE YOUR ANNUAL REVIEW</a>
    </div>
    <p>May your day be filled with celebration and gratitude!</p>
    <p>Warmest regards,<br/><strong>{{advisor_name}}</strong><br/>{{advisor_email}} | {{advisor_phone}}</p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-2',
    name: 'Upcoming Premium Notice (Pre-Due)',
    category: 'Premium Reminder',
    subject: 'InLife Notice: Premium Due for {{product_name}} (Policy #{{policy_number}})',
    description: 'Notice sent 30, 14, 7, or 1 day prior to premium due date with QuickPay button.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 22px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">InLife Premium Notice</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>{{first_name}}</strong>,</p>
    <p>We hope you are having a wonderful week. This is a friendly reminder that your premium for policy <strong>#{{policy_number}} ({{product_name}})</strong> is scheduled for payment on <strong>{{due_date}}</strong>.</p>
    <div style="background-color: #F0F7FF; border-left: 4px solid #00529B; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px;"><strong>Policy Number:</strong> {{policy_number}}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Product Plan:</strong> {{product_name}}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Premium Amount:</strong> ₱{{premium_amount}}</p>
      <p style="margin: 4px 0; font-size: 14px;"><strong>Due Date:</strong> {{due_date}}</p>
    </div>
    <div style="text-align: center; margin: 26px 0;">
      <a href="{{payment_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">PAY PREMIUM ONLINE NOW</a>
    </div>
    <p style="font-size: 13px; color: #718096;">Timely payments ensure that your insurance protection and health benefits remain continuously active without interruption.</p>
    <p>If you have already settled this payment, please disregard this notice.</p>
    <p>Best regards,<br/><strong>{{advisor_name}}</strong><br/>{{advisor_email}}</p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-3',
    name: 'Overdue Premium & Grace Period Notice',
    category: 'Overdue Premium',
    subject: 'Urgent: Grace Period Notice for InLife Policy #{{policy_number}}',
    description: 'Urgent notice for premiums past due within 31-day grace period.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 22px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">InLife Grace Period Notice</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>{{first_name}}</strong>,</p>
    <p>Our records indicate that the premium for <strong>{{product_name}} (#{{policy_number}})</strong> was due on <strong>{{due_date}}</strong> and remains unsettled.</p>
    <p>Your policy is currently covered under the <strong>31-day Grace Period</strong>. To prevent any lapse in your family's coverage, please settle your premium of <strong>₱{{premium_amount}}</strong> as soon as possible.</p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="{{payment_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">SETTLE PREMIUM ONLINE</a>
    </div>
    <p>If you need assistance exploring payment options, please do not hesitate to contact me directly at {{advisor_phone}}.</p>
    <p>Sincerely,<br/><strong>{{advisor_name}}</strong></p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-4',
    name: 'Annual Policy Review Invitation',
    category: 'Annual Review',
    subject: 'Time for your Annual InLife Policy Review, {{first_name}}',
    description: 'Invitation to review coverage, fund values, and milestones.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">Annual Financial Portfolio Review</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Hi <strong>{{preferred_name}}</strong>,</p>
    <p>As another year passes, life brings exciting new milestones—career advancements, family growth, and new financial goals.</p>
    <p>To ensure your <strong>{{product_name}}</strong> policy (and current estimated fund value of <strong>₱{{fund_value}}</strong>) remains fully aligned with your life plans, I would love to invite you to our 30-minute Annual Policy Review.</p>
    <div style="text-align: center; margin: 28px 0;">
      <a href="{{calendar_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; display: inline-block;">SCHEDULE APPOINTMENT ON CALENDAR</a>
    </div>
    <p>Looking forward to catching up soon!</p>
    <p>Best regards,<br/><strong>{{advisor_name}}</strong><br/>{{advisor_phone}}</p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-5',
    name: 'Appointment Confirmation & Google Meet Link',
    category: 'Appointment Confirmation',
    subject: 'Confirmed: Financial Consultation with {{advisor_name}}',
    description: 'Sent upon scheduling an appointment with calendar links.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 22px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">Appointment Confirmed</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>{{first_name}}</strong>,</p>
    <p>Our upcoming financial consultation is confirmed. I look forward to meeting with you to discuss your protection and investment portfolio.</p>
    <p>If you need to reschedule or have any documents you would like us to review ahead of time, please reply to this email.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="{{calendar_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">VIEW ON GOOGLE CALENDAR</a>
    </div>
    <p>Warm regards,<br/><strong>{{advisor_name}}</strong><br/>{{advisor_email}}</p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-6',
    name: 'Appointment Reminder (1 Day Before)',
    category: 'Appointment Reminder',
    subject: 'Reminder: Our InLife Consultation Tomorrow',
    description: 'Automated 1-day reminder before calendar appointment.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="padding: 24px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px;">
    <p>Hi <strong>{{preferred_name}}</strong>,</p>
    <p>Just a quick and friendly reminder about our scheduled policy review tomorrow. I have prepared your latest fund valuation and portfolio summary.</p>
    <p>See you then!</p>
    <p>Warm regards,<br/><strong>{{advisor_name}}</strong></p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-7',
    name: 'Post-Meeting Thank You',
    category: 'Thank You',
    subject: 'Thank you for your time today, {{first_name}}',
    description: 'Follow-up email sent after completing a consultation or review.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="padding: 26px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px;">
    <p>Dear <strong>{{first_name}}</strong>,</p>
    <p>Thank you very much for taking the time to meet with me today. It was great catching up and reviewing your progress toward your financial security goals.</p>
    <p>I will follow up shortly with the agreed action items and proposal documentation.</p>
    <p>Always here to assist you and your family.</p>
    <p>Sincerely,<br/><strong>{{advisor_name}}</strong><br/>{{advisor_title}}</p>
  </div>
</div>`,
    isDefault: true,
  },
  {
    id: 'tpl-8',
    name: 'Welcome to InLife Family',
    category: 'Welcome',
    subject: 'Welcome to Insular Life, {{first_name}}! 🇵🇭',
    description: 'Welcoming new policyholders upon issue of first policy.',
    content: `<div style="font-family: Arial, sans-serif; color: #2D3748; max-width: 600px; margin: 0 auto; line-height: 1.6;">
  <div style="background-color: #00529B; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: #FFFFFF; margin: 0; font-size: 22px;">Welcome to Insular Life!</h1>
  </div>
  <div style="padding: 28px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-top: none; border-radius: 0 0 8px 8px;">
    <p>Dear <strong>{{first_name}}</strong>,</p>
    <p>Congratulations and welcome to the InLife family! As the first and largest Filipino life insurance company with over 113 years of service, we are deeply committed to protecting your family's future.</p>
    <p>Your policy <strong>#{{policy_number}} ({{product_name}})</strong> is officially in force.</p>
    <div style="text-align: center; margin: 26px 0;">
      <a href="{{policy_portal_link}}" style="background-color: #00529B; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">ACCESS CUSTOMER PORTAL</a>
    </div>
    <p>Thank you for entrusting me with your family's financial journey.</p>
    <p>Warm regards,<br/><strong>{{advisor_name}}</strong></p>
  </div>
</div>`,
    isDefault: true,
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    type: 'email_sent',
    title: 'Email Sent: Appointment Confirmation',
    description: 'Confirmation sent for consultation today at 9:00 AM via Gmail.',
    timestamp: '2026-09-25T14:30:00Z',
    iconName: 'Mail',
  },
  {
    id: 'act-2',
    clientId: 'c-3',
    clientName: 'John Dela Cruz',
    type: 'appointment_scheduled',
    title: 'Appointment Added: Policy Review',
    description: 'Scheduled on Google Calendar for today at 11:30 AM.',
    timestamp: '2026-09-25T11:00:00Z',
    iconName: 'Calendar',
  },
  {
    id: 'act-3',
    clientId: 'c-5',
    clientName: 'Mark Cruz',
    type: 'fund_value_updated',
    title: 'Fund Value Updated: Retire Assure',
    description: 'Portfolio NAVPU updated; new total fund value ₱560,000 for Retire Assure plan.',
    timestamp: '2026-09-24T16:00:00Z',
    iconName: 'TrendingUp',
  },
  {
    id: 'act-4',
    clientId: 'c-1',
    clientName: 'Maria Santos',
    type: 'document_uploaded',
    title: 'Document Uploaded: Resilience CIE Policy Contract',
    description: 'Official digital e-policy contract PDF archived.',
    timestamp: '2026-09-20T10:15:00Z',
    iconName: 'FileText',
  },
  {
    id: 'act-5',
    clientId: 'c-2',
    clientName: 'Juan Dela Cruz',
    type: 'premium_payment',
    title: 'Premium Payment Logged: Resilience CHS',
    description: 'Semi-annual payment of ₱18,500 acknowledged via QuickPay.',
    timestamp: '2026-09-18T13:20:00Z',
    iconName: 'CreditCard',
  }
];

export const INITIAL_PREMIUM_PAYMENTS: PremiumPayment[] = [
  {
    id: 'pay-1',
    clientId: 'c-1',
    policyId: 'pol-101',
    policyNumber: 'IL-9823441',
    amount: 5000,
    paymentDate: '2026-08-30',
    dueDate: '2026-08-30',
    referenceNumber: 'QP-20260830-8812',
    status: 'Paid',
    paymentMethod: 'InLife QuickPay (Credit Card)',
  },
  {
    id: 'pay-2',
    clientId: 'c-2',
    policyId: 'pol-201',
    policyNumber: 'IL-8192033',
    amount: 18500,
    paymentDate: '2026-09-18',
    dueDate: '2026-09-05',
    referenceNumber: 'QP-20260918-4521',
    status: 'Paid',
    paymentMethod: 'GCash',
  },
  {
    id: 'pay-3',
    clientId: 'c-2',
    policyId: 'pol-202',
    policyNumber: 'IL-8594012',
    amount: 45000,
    paymentDate: '',
    dueDate: '2026-09-28',
    referenceNumber: 'PENDING-20260928',
    status: 'Pending',
    paymentMethod: 'Auto Debit Arrangement (BPI)',
  },
  {
    id: 'pay-4',
    clientId: 'c-1',
    policyId: 'pol-101',
    policyNumber: 'IL-9823441',
    amount: 5000,
    paymentDate: '',
    dueDate: '2026-09-30',
    referenceNumber: 'PENDING-20260930',
    status: 'Pending',
    paymentMethod: 'Credit Card',
  }
];

export const INITIAL_FUND_VALUES: FundValueRecord[] = [
  {
    id: 'fv-1',
    clientId: 'c-1',
    policyId: 'pol-102',
    date: '2026-09-25',
    fundName: 'InLife Growth Fund (Equity)',
    units: 14250.85,
    navpu: 48.067,
    totalValue: 685000,
  },
  {
    id: 'fv-2',
    clientId: 'c-2',
    policyId: 'pol-202',
    date: '2026-09-25',
    fundName: 'InLife Select Equity Fund',
    units: 24500.12,
    navpu: 50.612,
    totalValue: 1240000,
  },
  {
    id: 'fv-3',
    clientId: 'c-3',
    policyId: 'pol-301',
    date: '2026-09-25',
    fundName: 'InLife Balanced Fund',
    units: 28450.0,
    navpu: 32.337,
    totalValue: 920000,
  },
  {
    id: 'fv-4',
    clientId: 'c-5',
    policyId: 'pol-501',
    date: '2026-09-25',
    fundName: 'InLife Growth Fund',
    units: 11650.0,
    navpu: 48.067,
    totalValue: 560000,
  },
  {
    id: 'fv-5',
    clientId: 'c-7',
    policyId: 'pol-701',
    date: '2026-09-25',
    fundName: 'InLife Global Technology Fund',
    units: 185000.0,
    navpu: 79.73,
    totalValue: 14750000,
  }
];

export const INITIAL_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-1',
    clientId: 'c-1',
    title: 'Resilience CIE Policy Contract e-Policy',
    category: 'Policy Contract',
    fileName: 'IL-9823441_Policy_Contract_Signed.pdf',
    uploadDate: '2021-04-22',
    fileSize: '3.4 MB',
  },
  {
    id: 'doc-2',
    clientId: 'c-1',
    title: 'Child Education Endowment Proposal 2026',
    category: 'Proposal',
    fileName: 'Maria_Santos_Education_Proposal_v2.pdf',
    uploadDate: '2026-09-20',
    fileSize: '1.8 MB',
  },
  {
    id: 'doc-3',
    clientId: 'c-2',
    title: 'Abundance 65 VUL Contract & Fund Allocation',
    category: 'Policy Contract',
    fileName: 'IL-8594012_Abundance_65_Policy.pdf',
    uploadDate: '2020-03-15',
    fileSize: '4.1 MB',
  },
  {
    id: 'doc-4',
    clientId: 'c-4',
    title: 'Resilience Female Cancer Health KYC & Med Declaration',
    category: 'KYC',
    fileName: 'Dr_Ana_Reyes_Medical_KYC.pdf',
    uploadDate: '2023-06-25',
    fileSize: '2.2 MB',
  }
];
