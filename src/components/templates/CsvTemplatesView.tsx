import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Upload,
  Info,
  ChevronDown,
  ChevronUp,
  FileCode,
  FileText,
  Shield,
  CreditCard,
  TrendingUp,
  Calendar as CalendarIcon,
  Crown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus, Gender, CivilStatus, ContactMethod } from '../../types';

interface CsvTemplateDefinition {
  id: string;
  title: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
  fileName: string;
  description: string;
  headers: string[];
  sampleRows: string[][];
  dataDictionary: Array<{
    column: string;
    required: boolean;
    type: string;
    description: string;
    example: string;
  }>;
}

export const CSV_TEMPLATES: CsvTemplateDefinition[] = [
  {
    id: 'clients_masterlist',
    title: 'Clients Masterlist Template',
    category: 'Client Relationship Management',
    badge: 'Primary',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Users,
    fileName: 'inlife_clients_masterlist_template.csv',
    description:
      'Comprehensive client master record template for importing policyholders and prospects into InLife ClientHub. Includes Amorsolo Circle premier status tier.',
    headers: [
      'first_name',
      'middle_name',
      'last_name',
      'preferred_name',
      'birthday',
      'gender',
      'civil_status',
      'occupation',
      'address',
      'email',
      'mobile_number',
      'preferred_contact_method',
      'client_since',
      'client_status',
      'source',
      'tags',
      'adviser_notes',
    ],
    sampleRows: [
      [
        'Fernando',
        'Enrique',
        'Montenegro',
        'Nando',
        '1975-12-04',
        'Male',
        'Married',
        'Real Estate Developer',
        '14 McKinley Road Forbes Park Makati City',
        'f.montenegro.holdings@gmail.com',
        '+63 917 111 2233',
        'Email',
        '2018-03-14',
        'Amorsolo Circle',
        'Direct Personal Contact',
        'Amorsolo Circle; HNWI; Estate Planning',
        'Major account with multiple comprehensive estate protection plans.',
      ],
      [
        'Maria',
        'Clara',
        'Santos',
        'Maria',
        '1988-06-15',
        'Female',
        'Married',
        'VP of Marketing FinTech Corp',
        'Unit 24B Tower One Legaspi Village Makati City',
        'maria.santos.sample@gmail.com',
        '+63 918 555 0101',
        'Email',
        '2021-04-12',
        'Amorsolo Circle',
        'Referral from John Dela Cruz',
        'Amorsolo Circle; HNWI; Executive; Referral',
        'High net worth profile. Interested in offshore asset allocation and educational fund.',
      ],
      [
        'Juan',
        'Alfonso',
        'Dela Cruz',
        'Juan',
        '1985-09-29',
        'Male',
        'Married',
        'Senior Software Architect',
        'Block 12 Lot 5 Ayala Alabang Village Muntinlupa',
        'juan.delacruz.tech@gmail.com',
        '+63 917 888 1234',
        'Mobile Number',
        '2020-02-15',
        'Active',
        'Facebook Advisory Campaign',
        'Tech; Family Protection; VUL',
        'Goal is early retirement by age 50 and full college education fund for 2 children.',
      ],
      [
        'Beatrice',
        'Marie',
        'Villanueva',
        'Bea',
        '1996-03-22',
        'Female',
        'Single',
        'Management Consultant',
        'Tower 2 The Residences Greenbelt Makati',
        'beatrice.villanueva@consulting.ph',
        '+63 919 234 5678',
        'Email',
        '2024-05-10',
        'Prospect',
        'Referral from Maria Santos',
        'Prospect; Corporate; Health Cover',
        'Looking for comprehensive critical illness cover with early stage rider.',
      ],
    ],
    dataDictionary: [
      { column: 'first_name', required: true, type: 'String', description: 'Client given name', example: 'Fernando' },
      { column: 'middle_name', required: false, type: 'String', description: 'Middle name or initial', example: 'Enrique' },
      { column: 'last_name', required: true, type: 'String', description: 'Family name / surname', example: 'Montenegro' },
      { column: 'preferred_name', required: false, type: 'String', description: 'Nickname or preferred address', example: 'Nando' },
      { column: 'birthday', required: true, type: 'Date (YYYY-MM-DD)', description: 'Birthdate for age & birthday automation', example: '1975-12-04' },
      { column: 'gender', required: true, type: 'Enum', description: 'Male, Female, Other, Prefer not to say', example: 'Male' },
      { column: 'civil_status', required: true, type: 'Enum', description: 'Single, Married, Widowed, Separated', example: 'Married' },
      { column: 'occupation', required: true, type: 'String', description: 'Occupation / Industry profile', example: 'Real Estate Developer' },
      { column: 'address', required: false, type: 'String', description: 'Home or office billing address', example: 'Forbes Park, Makati City' },
      { column: 'email', required: true, type: 'Email', description: 'Primary contact email for reminders', example: 'f.montenegro.holdings@gmail.com' },
      { column: 'mobile_number', required: true, type: 'Phone', description: 'Mobile contact with country code', example: '+63 917 111 2233' },
      { column: 'preferred_contact_method', required: true, type: 'Enum', description: 'Email, Mobile Number, Phone Call', example: 'Email' },
      { column: 'client_since', required: true, type: 'Date (YYYY-MM-DD)', description: 'Relationship start date', example: '2018-03-14' },
      { column: 'client_status', required: true, type: 'Enum', description: 'Active, Amorsolo Circle, Prospect, Inactive', example: 'Amorsolo Circle' },
      { column: 'source', required: false, type: 'String', description: 'Lead or referral origin', example: 'Direct Personal Contact' },
      { column: 'tags', required: false, type: 'Semicolon-delimited', description: 'Keywords and segmentation categories', example: 'Amorsolo Circle; HNWI; Estate Planning' },
      { column: 'adviser_notes', required: false, type: 'Text', description: 'Confidential advisor consultation notes', example: 'Major account with multiple comprehensive estate protection plans.' },
    ],
  },
  {
    id: 'amorsolo_circle_roster',
    title: 'Amorsolo Circle Premier Roster Template',
    category: 'High-Net-Worth Advisory',
    badge: 'Premier HNWI',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Crown,
    fileName: 'inlife_amorsolo_circle_roster_template.csv',
    description:
      'Bespoke template crafted specifically for Insular Life Amorsolo Circle elite members, family offices, and high-net-worth estate planning accounts.',
    headers: [
      'first_name',
      'last_name',
      'preferred_name',
      'email',
      'mobile_number',
      'client_status',
      'annual_premium_bracket',
      'total_face_amount_php',
      'advisory_focus',
      'designated_trust_reference',
      'concierge_priority',
      'review_schedule',
      'tags',
    ],
    sampleRows: [
      [
        'Fernando',
        'Montenegro',
        'Nando',
        'f.montenegro.holdings@gmail.com',
        '+63 917 111 2233',
        'Amorsolo Circle',
        'PHP 500k - 1M+',
        '25000000',
        'Generational Wealth Transfer & Estate Tax Shield',
        'Montenegro Family Irrevocable Trust',
        'Priority 1 / Direct Line',
        'Semi-Annual (June / Dec)',
        'Amorsolo Circle; HNWI; Forbes Park; Real Estate; Key Client',
      ],
      [
        'Maria Clara',
        'Santos',
        'Maria',
        'maria.santos.sample@gmail.com',
        '+63 918 555 0101',
        'Amorsolo Circle',
        'PHP 250k - 500k',
        '10000000',
        'Offshore Wealth Diversification & Education Fund',
        'Santos Legacy Trust 2021',
        'Priority 1 / Private Office',
        'Annual (October)',
        'Amorsolo Circle; HNWI; FinTech; Legaspi Village; Executive',
      ],
      [
        'Roberto',
        'Chua',
        'Tito Bert',
        'roberto.chua.enterprises@gmail.com',
        '+63 917 555 9988',
        'Amorsolo Circle',
        'PHP 1M+',
        '50000000',
        'Business Succession & Key Person Insurance',
        'Chua Consolidated Holdings SPV',
        'VIP Concierge',
        'Quarterly Review',
        'Amorsolo Circle; Ultra HNWI; Manufacturing; Succession',
      ],
    ],
    dataDictionary: [
      { column: 'first_name', required: true, type: 'String', description: 'Premier member first name', example: 'Fernando' },
      { column: 'last_name', required: true, type: 'String', description: 'Premier member last name', example: 'Montenegro' },
      { column: 'email', required: true, type: 'Email', description: 'Confidential executive email', example: 'f.montenegro.holdings@gmail.com' },
      { column: 'mobile_number', required: true, type: 'Phone', description: 'Direct mobile phone', example: '+63 917 111 2233' },
      { column: 'client_status', required: true, type: 'Literal', description: 'Must be "Amorsolo Circle"', example: 'Amorsolo Circle' },
      { column: 'annual_premium_bracket', required: false, type: 'String', description: 'Annual premium allocation tier', example: 'PHP 500k - 1M+' },
      { column: 'total_face_amount_php', required: true, type: 'Number', description: 'Aggregate sum assured (PHP)', example: '25000000' },
      { column: 'advisory_focus', required: true, type: 'String', description: 'Estate tax, succession, asset protection', example: 'Generational Wealth Transfer' },
      { column: 'tags', required: false, type: 'String', description: 'HNWI keywords', example: 'Amorsolo Circle; HNWI' },
    ],
  },
  {
    id: 'policies_masterlist',
    title: 'Policy Records Template',
    category: 'Policy Underwriting & Portfolio',
    badge: 'Core Portfolio',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Shield,
    fileName: 'inlife_policies_template.csv',
    description:
      'Standard template for policy portfolios including VUL, Traditional Whole Life, Term Life, and Critical Illness plans.',
    headers: [
      'policy_number',
      'client_email',
      'product_name',
      'plan_type',
      'face_amount',
      'premium_amount',
      'payment_frequency',
      'status',
      'issue_date',
      'due_date',
      'next_billing_date',
      'anniversary_date',
      'fund_value',
      'riders',
    ],
    sampleRows: [
      [
        'IL-2021-99881',
        'f.montenegro.holdings@gmail.com',
        'Solid Fund Builder',
        'VUL',
        '15000000',
        '180000',
        'Annual',
        'In Force',
        '2021-03-14',
        '2027-03-14',
        '2027-03-14',
        '2027-03-14',
        '12450000',
        'Accidental Death Benefit; Critical Illness Rider Plus',
      ],
      [
        'IL-2022-77123',
        'maria.santos.sample@gmail.com',
        'Abundance 20',
        'VUL',
        '5000000',
        '75000',
        'Annual',
        'In Force',
        '2022-04-12',
        '2027-04-12',
        '2027-04-12',
        '2027-04-12',
        '4120000',
        'Waiver of Premium; Enhanced Hospital Income Benefit',
      ],
      [
        'IL-2023-44119',
        'juan.delacruz.tech@gmail.com',
        'Resilience CIE',
        'Health',
        '2500000',
        '14500',
        'Quarterly',
        'In Force',
        '2023-09-15',
        '2026-10-15',
        '2026-10-15',
        '2027-09-15',
        '0',
        'Major Critical Illness Early Stage 50; Daily Hospitalization Cash',
      ],
      [
        'IL-2024-11002',
        'beatrice.villanueva@consulting.ph',
        'iProtect 10',
        'Term Life',
        '3000000',
        '48000',
        'Annual',
        'In Force',
        '2024-05-10',
        '2027-05-10',
        '2027-05-10',
        '2027-05-10',
        '85000',
        'Total and Permanent Disability; Term Insurance Rider',
      ],
    ],
    dataDictionary: [
      { column: 'policy_number', required: true, type: 'String', description: 'InLife unique policy contract number', example: 'IL-2021-99881' },
      { column: 'client_email', required: true, type: 'Email', description: 'Matches existing client record', example: 'f.montenegro.holdings@gmail.com' },
      { column: 'product_name', required: true, type: 'String', description: 'Official InLife plan name (e.g. Wealth Assure Plus, Resilience CIE, Abundance 20, iProtect 10)', example: 'Wealth Assure Plus' },
      { column: 'plan_type', required: true, type: 'Enum', description: 'VUL, Traditional Whole Life, Term Life, Health', example: 'VUL' },
      { column: 'face_amount', required: true, type: 'Number', description: 'Base sum assured (PHP)', example: '15000000' },
      { column: 'premium_amount', required: true, type: 'Number', description: 'Modal installment premium (PHP)', example: '180000' },
      { column: 'payment_frequency', required: true, type: 'Enum', description: 'Annual, Semi-Annual, Quarterly, Monthly', example: 'Annual' },
      { column: 'status', required: true, type: 'Enum', description: 'In Force, Grace Period, Paid Up, Lapsed', example: 'In Force' },
      { column: 'due_date', required: true, type: 'Date (YYYY-MM-DD)', description: 'Next premium due date', example: '2027-03-14' },
      { column: 'fund_value', required: false, type: 'Number', description: 'Current accumulated VUL fund value', example: '12450000' },
    ],
  },
  {
    id: 'premiums_ledger',
    title: 'Premium Payments & Remittance Ledger',
    category: 'Billing & Remittances',
    badge: 'Finance',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CreditCard,
    fileName: 'inlife_premium_payments_ledger_template.csv',
    description:
      'Remittance tracking template to log official receipt numbers, payment gateways (ADA, InLife Online, Maya, OTC), and billing reconciliations.',
    headers: [
      'policy_number',
      'client_name',
      'amount',
      'payment_date',
      'due_date',
      'reference_number',
      'status',
      'payment_method',
    ],
    sampleRows: [
      [
        'IL-2021-99881',
        'Fernando Montenegro',
        '180000',
        '2026-03-10',
        '2026-03-14',
        'OR-9912048',
        'Paid',
        'Auto-Debit Arrangement (BDO Private Bank)',
      ],
      [
        'IL-2022-77123',
        'Maria Clara Santos',
        '75000',
        '2026-04-08',
        '2026-04-12',
        'PR-4491023',
        'Paid',
        'InLife Customer Portal (BPI Credit Card)',
      ],
      [
        'IL-2023-44119',
        'Juan Dela Cruz',
        '14500',
        '2026-09-22',
        '2026-10-15',
        'REF-7733091',
        'Paid',
        'Maya e-Wallet Gateway',
      ],
    ],
    dataDictionary: [
      { column: 'policy_number', required: true, type: 'String', description: 'Referenced policy number', example: 'IL-2021-99881' },
      { column: 'client_name', required: true, type: 'String', description: 'Client full name', example: 'Fernando Montenegro' },
      { column: 'amount', required: true, type: 'Number', description: 'Payment amount remitted (PHP)', example: '180000' },
      { column: 'payment_date', required: true, type: 'Date (YYYY-MM-DD)', description: 'Actual transaction date', example: '2026-03-10' },
      { column: 'due_date', required: true, type: 'Date (YYYY-MM-DD)', description: 'Contractual due date', example: '2026-03-14' },
      { column: 'reference_number', required: true, type: 'String', description: 'OR or payment confirmation code', example: 'OR-9912048' },
      { column: 'status', required: true, type: 'Enum', description: 'Paid, Pending, Overdue', example: 'Paid' },
      { column: 'payment_method', required: true, type: 'String', description: 'ADA, Credit Card, Portal, Maya, OTC', example: 'Auto-Debit Arrangement' },
    ],
  },
  {
    id: 'fund_values_ledger',
    title: 'VUL Fund Values & NAVPU Ledger',
    category: 'VUL Investment Tracking',
    badge: 'Investments',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: TrendingUp,
    fileName: 'inlife_vul_fund_values_template.csv',
    description:
      'Historical valuation template to log InLife unitized funds (Growth, Equity, Balanced, Fixed Income) with NAVPU and total peso values.',
    headers: [
      'policy_number',
      'client_name',
      'valuation_date',
      'fund_name',
      'units_owned',
      'navpu',
      'total_fund_value',
    ],
    sampleRows: [
      [
        'IL-2021-99881',
        'Fernando Montenegro',
        '2026-09-25',
        'Peso Growth Fund',
        '258410.25',
        '48.1792',
        '12450000',
      ],
      [
        'IL-2022-77123',
        'Maria Clara Santos',
        '2026-09-25',
        'Peso Balanced Fund',
        '118937.64',
        '34.6400',
        '4120000',
      ],
      [
        'IL-2024-11002',
        'Beatrice Villanueva',
        '2026-09-25',
        'Peso Fixed Income Fund',
        '3617.02',
        '23.5000',
        '85000',
      ],
    ],
    dataDictionary: [
      { column: 'policy_number', required: true, type: 'String', description: 'Linked VUL policy contract', example: 'IL-2021-99881' },
      { column: 'client_name', required: true, type: 'String', description: 'Policyholder name', example: 'Fernando Montenegro' },
      { column: 'valuation_date', required: true, type: 'Date (YYYY-MM-DD)', description: 'Date of NAVPU statement', example: '2026-09-25' },
      { column: 'fund_name', required: true, type: 'String', description: 'InLife Fund Portfolio Name', example: 'Peso Growth Fund' },
      { column: 'units_owned', required: true, type: 'Number', description: 'Total units allocated', example: '258410.25' },
      { column: 'navpu', required: true, type: 'Number', description: 'Net Asset Value Per Unit (PHP)', example: '48.1792' },
      { column: 'total_fund_value', required: true, type: 'Number', description: 'Units multiplied by NAVPU', example: '12450000' },
    ],
  },
  {
    id: 'appointments_template',
    title: 'Advisory Appointments & Reviews Schedule',
    category: 'Calendar & Consultations',
    badge: 'Schedule',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: CalendarIcon,
    fileName: 'inlife_appointments_schedule_template.csv',
    description:
      'Template for bulk scheduling annual policy reviews, Amorsolo Circle estate conferences, and birthday courtesy visits synced with Google Calendar.',
    headers: [
      'title',
      'client_name_or_email',
      'date',
      'start_time',
      'end_time',
      'location_or_meet',
      'description',
      'reminder_minutes',
      'status',
    ],
    sampleRows: [
      [
        'Amorsolo Circle Annual Estate Review',
        'f.montenegro.holdings@gmail.com',
        '2026-10-15',
        '14:00',
        '15:30',
        'Manila Golf Club / Private Boardroom',
        'Annual comprehensive portfolio review for Montenegro estate holding.',
        '1440',
        'Scheduled',
      ],
      [
        'Birthday Courtesy Call & Policy Health Check',
        'juan.delacruz.tech@gmail.com',
        '2026-09-29',
        '10:30',
        '11:00',
        'Google Meet (https://meet.google.com/inlife-amorsolo)',
        'Celebrate 41st birthday and review children educational fund growth.',
        '60',
        'Confirmed',
      ],
      [
        'Critical Illness E-Proposal Presentation',
        'beatrice.villanueva@consulting.ph',
        '2026-10-02',
        '16:00',
        '17:00',
        'Starbucks Reserve 6750 Ayala Ave Makati',
        'Walk through InLife Resilience CIE and CHS plan comparison table.',
        '180',
        'Scheduled',
      ],
    ],
    dataDictionary: [
      { column: 'title', required: true, type: 'String', description: 'Meeting or consultation topic', example: 'Amorsolo Circle Annual Estate Review' },
      { column: 'client_name_or_email', required: true, type: 'String', description: 'Client identifier', example: 'f.montenegro.holdings@gmail.com' },
      { column: 'date', required: true, type: 'Date (YYYY-MM-DD)', description: 'Meeting date', example: '2026-10-15' },
      { column: 'start_time', required: true, type: 'Time (HH:mm)', description: '24-hour start time', example: '14:00' },
      { column: 'end_time', required: true, type: 'Time (HH:mm)', description: '24-hour end time', example: '15:30' },
      { column: 'location_or_meet', required: false, type: 'String', description: 'Physical venue or Google Meet link', example: 'Manila Golf Club' },
      { column: 'reminder_minutes', required: false, type: 'Number', description: 'Advance alert (1440=1d, 60=1hr)', example: '1440' },
      { column: 'status', required: true, type: 'Enum', description: 'Confirmed, Scheduled, Completed', example: 'Scheduled' },
    ],
  },
];

export const CsvTemplatesView: React.FC = () => {
  const { clients, policies, addClient, showToast, setActiveView, currentBrand } = useApp();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('clients_masterlist');
  const [showDataDictionary, setShowDataDictionary] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // CSV Importer state
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [pastedCsvText, setPastedCsvText] = useState('');
  const [parsedImportRows, setParsedImportRows] = useState<Array<Record<string, string>>>([]);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const selectedTemplate =
    CSV_TEMPLATES.find((t) => t.id === selectedTemplateId) || CSV_TEMPLATES[0];

  // Helper to convert template to raw CSV text
  const generateCsvContent = (template: CsvTemplateDefinition, includeSampleRows = true) => {
    const escapeCsv = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const headerLine = template.headers.join(',');
    if (!includeSampleRows) {
      return headerLine;
    }

    const rows = template.sampleRows.map((row) =>
      row.map((cell) => escapeCsv(cell)).join(',')
    );

    return [headerLine, ...rows].join('\n');
  };

  // Download CSV trigger
  const handleDownloadCsv = (template: CsvTemplateDefinition, includeSampleRows = true) => {
    const csvContent = generateCsvContent(template, includeSampleRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      includeSampleRows
        ? template.fileName
        : template.fileName.replace('.csv', '_blank.csv')
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(
      `Downloaded ${includeSampleRows ? 'template with sample data' : 'blank template'}: ${template.fileName}`,
      'success'
    );
  };

  // Copy raw CSV to clipboard
  const handleCopyCsv = (template: CsvTemplateDefinition) => {
    const csvContent = generateCsvContent(template, true);
    navigator.clipboard.writeText(csvContent);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2500);
    showToast(`Copied ${template.title} CSV to clipboard! Ready to paste into Excel or Google Sheets.`, 'success');
  };

  // Download All Templates as Individual Files
  const handleDownloadAllTemplates = () => {
    CSV_TEMPLATES.forEach((tmpl, index) => {
      setTimeout(() => {
        handleDownloadCsv(tmpl, true);
      }, index * 250);
    });
    showToast('Initiated download for all InLife CRM templates!', 'success');
  };

  // Export current live CRM clients to CSV
  const handleExportLiveClientsToCsv = () => {
    const headers = [
      'first_name',
      'middle_name',
      'last_name',
      'preferred_name',
      'birthday',
      'gender',
      'civil_status',
      'occupation',
      'address',
      'email',
      'mobile_number',
      'preferred_contact_method',
      'client_since',
      'client_status',
      'source',
      'tags',
      'adviser_notes',
    ];

    const escapeCsv = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    const rows = clients.map((c) => {
      // Normalize VIP to Amorsolo Circle if needed
      const statusDisplay =
        c.clientStatus === 'VIP' || c.clientStatus === 'Amorsolo Circle'
          ? 'Amorsolo Circle'
          : c.clientStatus;

      const rowValues = [
        c.firstName,
        c.middleName || '',
        c.lastName,
        c.preferredName || '',
        c.birthday,
        c.gender,
        c.civilStatus,
        c.occupation,
        c.address,
        c.email,
        c.mobileNumber,
        c.preferredContactMethod,
        c.clientSince,
        statusDisplay,
        c.source,
        c.tags.join('; '),
        c.adviserNotes || '',
      ];
      return rowValues.map((v) => escapeCsv(String(v))).join(',');
    });

    const csvData = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inlife_crm_clients_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${clients.length} client records to CSV (including Amorsolo Circle accounts)!`, 'success');
  };

  // Basic CSV Parser for in-app import
  const parseCsvText = (text: string) => {
    if (!text.trim()) return [];

    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const parseLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let insideQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (insideQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            insideQuotes = !insideQuotes;
          }
        } else if (char === ',' && !insideQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    };

    const rawHeaders = parseLine(lines[0]).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    );

    const rows: Array<Record<string, string>> = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = parseLine(lines[i]);
      const rowObj: Record<string, string> = {};
      rawHeaders.forEach((header, idx) => {
        let val = values[idx] || '';
        // Automatically normalize VIP to Amorsolo Circle
        if (
          (header === 'client_status' || header === 'status') &&
          val.trim().toUpperCase() === 'VIP'
        ) {
          val = 'Amorsolo Circle';
        }
        rowObj[header] = val;
      });
      rows.push(rowObj);
    }

    return rows;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setPastedCsvText(text);
      const parsed = parseCsvText(text);
      setParsedImportRows(parsed);
      setImportStatusMessage(`Loaded ${parsed.length} rows from ${file.name}.`);
    };
    reader.readAsText(file);
  };

  const handleApplyPastedText = () => {
    const parsed = parseCsvText(pastedCsvText);
    setParsedImportRows(parsed);
    if (parsed.length === 0) {
      setImportStatusMessage('Could not parse any valid rows. Please check headers.');
    } else {
      setImportStatusMessage(`Successfully parsed ${parsed.length} row(s) ready for validation.`);
    }
  };

  const handleExecuteImport = () => {
    if (parsedImportRows.length === 0) return;
    setIsImporting(true);

    let importedCount = 0;
    let amorsoloCount = 0;

    parsedImportRows.forEach((row, idx) => {
      const firstName = row.first_name || row.firstname || `ImportedClient_${idx + 1}`;
      const lastName = row.last_name || row.lastname || 'Record';
      const email = row.email || `imported_${Date.now()}_${idx}@example.ph`;
      const mobileNumber = row.mobile_number || row.phone || row.mobile || '+63 900 000 0000';

      // Check status and normalize VIP to Amorsolo Circle
      let status: ClientStatus = 'Active';
      const rawStatus = (row.client_status || row.status || '').trim();
      if (rawStatus.toUpperCase() === 'VIP' || rawStatus.toLowerCase().includes('amorsolo')) {
        status = 'Amorsolo Circle';
        amorsoloCount++;
      } else if (rawStatus.toLowerCase() === 'prospect') {
        status = 'Prospect';
      } else if (rawStatus.toLowerCase() === 'inactive') {
        status = 'Inactive';
      }

      const tagsArray: string[] = [];
      if (row.tags) {
        tagsArray.push(
          ...row.tags
            .split(/[,;]/)
            .map((t) => t.trim())
            .filter(Boolean)
        );
      }
      if (status === 'Amorsolo Circle' && !tagsArray.includes('Amorsolo Circle')) {
        tagsArray.unshift('Amorsolo Circle');
      }

      const newClient: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'> = {
        firstName,
        middleName: row.middle_name || row.middlename || undefined,
        lastName,
        preferredName: row.preferred_name || row.preferredname || firstName,
        birthday: row.birthday || '1990-01-01',
        gender: (row.gender as Gender) || 'Prefer not to say',
        civilStatus: (row.civil_status as CivilStatus) || 'Single',
        occupation: row.occupation || 'Professional',
        address: row.address || 'Metro Manila, Philippines',
        email,
        mobileNumber,
        preferredContactMethod: (row.preferred_contact_method as ContactMethod) || 'Email',
        clientSince: row.client_since || new Date().toISOString().slice(0, 10),
        clientStatus: status,
        source: row.source || 'CSV Import',
        adviserNotes: row.adviser_notes || 'Imported via CSV template.',
        tags: tagsArray.length > 0 ? tagsArray : ['Imported'],
        communicationPreferences: {
          birthdayGreetings: true,
          premiumReminders: true,
          newsletter: true,
          marketingCommunications: false,
          policyReviewReminders: true,
        },
      };

      addClient(newClient);
      importedCount++;
    });

    setIsImporting(false);
    setIsImporterOpen(false);
    setPastedCsvText('');
    setParsedImportRows([]);
    showToast(
      `Successfully imported ${importedCount} client(s) into CRM (${amorsoloCount} Amorsolo Circle accounts)!`,
      'success'
    );
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Template Suite Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('templates')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-slate-200"
          >
            <FileCode className="w-4 h-4 text-blue-500" />
            <span>Email Templates</span>
          </button>
          <button
            style={{ backgroundColor: currentBrand.primaryColor }}
            className="px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-default"
          >
            <FileSpreadsheet className="w-4 h-4 text-white" />
            <span>CSV Templates & Import</span>
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
          {currentBrand.name} Adviser Template Hub
        </span>
      </div>

      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-md">
              {currentBrand.shortName} Data Exchange
            </span>
            <span className="text-xs font-semibold text-slate-500">• Ready for Excel & Google Sheets</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 mt-1">
            <FileSpreadsheet className="w-7 h-7 text-emerald-600" />
            <span>CSV Templates & Data Import</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Standardized tabular templates for Insular Life financial advisers to import, migrate, and back up
            Client Masterlists (including <span className="font-bold text-amber-700">Amorsolo Circle</span> premier HNWI accounts),
            Policies, Premium Remittances, and Investment Fund Portfolios.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsImporterOpen(!isImporterOpen)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-700/20 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Import / Validate CSV</span>
          </button>

          <button
            onClick={handleExportLiveClientsToCsv}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            title="Export all current CRM clients into the standard CSV format"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Export Live CRM Data</span>
          </button>

          <button
            onClick={handleDownloadAllTemplates}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            title="Download all 6 CSV templates at once"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>Download All Templates</span>
          </button>
        </div>
      </div>

      {/* Main Template Navigation Hub (Tabs) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Top Segmented Tab Switcher */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Template Suite:
            </span>
            <span className="text-xs font-extrabold text-slate-800">
              6 Standard {currentBrand.shortName} Formats
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick toggle to Email Templates tab */}
            <button
              onClick={() => setActiveView('templates')}
              className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-blue-500" />
              <span>Switch to Email Templates</span>
            </button>
          </div>
        </div>

        {/* Template Selectors Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/40">
          {CSV_TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = tmpl.id === selectedTemplateId;
            const isAmorsolo = tmpl.id === 'amorsolo_circle_roster';

            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? isAmorsolo
                      ? 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-400 shadow-sm ring-2 ring-amber-300/60'
                      : 'bg-white border-blue-500 shadow-sm ring-2 ring-blue-100'
                    : isAmorsolo
                    ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300 hover:bg-amber-50'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isAmorsolo
                          ? 'bg-amber-200/80 text-amber-900'
                          : isSelected
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {tmpl.badge && (
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}
                      >
                        {tmpl.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-2.5 flex items-center gap-1.5">
                    {isAmorsolo && <Crown className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                    <span>{tmpl.title}</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{tmpl.headers.length} columns</span>
                  <span className="truncate max-w-[130px]">{tmpl.fileName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-App CSV Importer & Validator Drawer (Collapsible) */}
      {isImporterOpen && (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-lg p-6 space-y-5 animate-slideDown">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Interactive CSV Importer & Data Validator
                </h3>
                <p className="text-xs text-slate-500">
                  Upload a `.csv` file or paste raw comma-separated values. Automatically normalizes old
                  <span className="font-bold text-amber-700"> VIP</span> tags into <span className="font-bold text-amber-700">Amorsolo Circle</span> status.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsImporterOpen(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-2 py-1 rounded"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* File Upload Zone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-5 text-center flex flex-col items-center justify-center bg-slate-50/50">
              <FileSpreadsheet className="w-8 h-8 text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-slate-700">Choose CSV File from Device</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Accepts UTF-8 comma-delimited `.csv`</p>
              <label className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-all shadow-xs">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct Paste Zone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Or Paste Raw CSV Data:</span>
                <button
                  type="button"
                  onClick={handleApplyPastedText}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Parse & Validate Text
                </button>
              </label>
              <textarea
                value={pastedCsvText}
                onChange={(e) => setPastedCsvText(e.target.value)}
                placeholder="Paste CSV rows here (including header row)..."
                rows={4}
                className="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Validation Status */}
          {importStatusMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{importStatusMessage}</span>
              </div>
              {parsedImportRows.length > 0 && (
                <button
                  onClick={handleExecuteImport}
                  disabled={isImporting}
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-xs"
                >
                  {isImporting ? 'Importing...' : `Import ${parsedImportRows.length} Rows Into CRM`}
                </button>
              )}
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedImportRows.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              <div className="px-3 py-2 bg-slate-100 text-[11px] font-bold text-slate-600 border-b border-slate-200 flex items-center justify-between">
                <span>Parsed Rows Preview ({parsedImportRows.length} records)</span>
                <span className="text-amber-700 font-bold">
                  {parsedImportRows.filter(
                    (r) =>
                      r.client_status === 'Amorsolo Circle' ||
                      (r.client_status || '').toUpperCase() === 'VIP'
                  ).length}{' '}
                  Amorsolo Circle accounts detected
                </span>
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {parsedImportRows.slice(0, 10).map((r, i) => {
                    const isAmorsolo =
                      r.client_status === 'Amorsolo Circle' ||
                      (r.client_status || '').toUpperCase() === 'VIP';
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-1.5 text-slate-400">{i + 1}</td>
                        <td className="px-3 py-1.5 font-bold text-slate-800 font-sans">
                          {r.first_name || r.firstname} {r.last_name || r.lastname}
                        </td>
                        <td className="px-3 py-1.5 text-slate-600">{r.email}</td>
                        <td className="px-3 py-1.5 text-slate-600">
                          {r.mobile_number || r.phone || r.mobile}
                        </td>
                        <td className="px-3 py-1.5">
                          {isAmorsolo ? (
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                              Amorsolo Circle
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                              {r.client_status || 'Active'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {parsedImportRows.length > 10 && (
                <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-50 border-t border-slate-100">
                  Showing first 10 of {parsedImportRows.length} rows...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Selected Template Detail View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        {/* Template Header & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {selectedTemplate.category}
              </span>
              {selectedTemplate.id === 'amorsolo_circle_roster' && (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-200 to-amber-300 text-amber-950 border border-amber-400 flex items-center gap-1 shadow-2xs">
                  <Crown className="w-3 h-3 text-amber-700" />
                  <span>Amorsolo Circle Tier</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>{selectedTemplate.title}</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">{selectedTemplate.description}</p>
          </div>

          {/* Action Buttons for this Template */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleCopyCsv(selectedTemplate)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
            >
              {copiedId === selectedTemplate.id ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Raw CSV</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownloadCsv(selectedTemplate, false)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-all shadow-2xs"
              title="Download only the header columns with no sample rows"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Download Blank Template</span>
            </button>

            <button
              onClick={() => handleDownloadCsv(selectedTemplate, true)}
              style={{ backgroundColor: currentBrand.primaryColor }}
              className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 text-white flex items-center gap-1.5 shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV (With Samples)</span>
            </button>
          </div>
        </div>

        {/* Live Table Preview */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Interactive Preview Table
              </span>
              <span className="text-xs text-slate-400">
                ({selectedTemplate.sampleRows.length} sample records)
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              File: <span className="font-bold text-slate-700">{selectedTemplate.fileName}</span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-2.5 px-3 w-10 text-center text-slate-400 font-normal">#</th>
                    {selectedTemplate.headers.map((h) => (
                      <th key={h} className="py-2.5 px-3 whitespace-nowrap font-mono">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedTemplate.sampleRows.map((row, rowIdx) => {
                    // Check if this row is an Amorsolo Circle row
                    const isAmorsoloRow = row.some((cell) =>
                      cell.toLowerCase().includes('amorsolo')
                    );

                    return (
                      <tr
                        key={rowIdx}
                        className={`transition-colors ${
                          isAmorsoloRow
                            ? 'bg-amber-50/50 hover:bg-amber-100/50'
                            : rowIdx % 2 === 0
                            ? 'bg-white hover:bg-slate-50'
                            : 'bg-slate-50/40 hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, cellIdx) => {
                          const isAmorsoloCell = cell === 'Amorsolo Circle';
                          const isMoney = !isNaN(Number(cell)) && Number(cell) >= 1000;

                          return (
                            <td
                              key={cellIdx}
                              className="py-2.5 px-3 text-slate-700 whitespace-nowrap"
                            >
                              {isAmorsoloCell ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 border border-amber-300 shadow-2xs">
                                  <Crown className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>Amorsolo Circle</span>
                                </span>
                              ) : isMoney && selectedTemplate.headers[cellIdx]?.includes('amount') ? (
                                <span className="font-mono font-bold text-slate-800">
                                  ₱{Number(cell).toLocaleString('en-PH')}
                                </span>
                              ) : cell.includes(';') ? (
                                <div className="flex flex-wrap gap-1">
                                  {cell.split(';').map((tag, tIdx) => (
                                    <span
                                      key={tIdx}
                                      className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                                        tag.trim() === 'Amorsolo Circle'
                                          ? 'bg-amber-100 text-amber-900 font-bold'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {tag.trim()}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-700 font-normal">{cell}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Data Dictionary & Specifications (Collapsible) */}
        <div className="pt-2 border-t border-slate-200">
          <button
            onClick={() => setShowDataDictionary(!showDataDictionary)}
            className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 text-xs hover:text-blue-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>
                Column Specifications & Data Dictionary ({selectedTemplate.dataDictionary.length} Fields)
              </span>
            </div>
            {showDataDictionary ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showDataDictionary && (
            <div className="mt-3 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Column Name</th>
                    <th className="py-2.5 px-3">Requirement</th>
                    <th className="py-2.5 px-3">Data Type</th>
                    <th className="py-2.5 px-3">Description & Allowed Values</th>
                    <th className="py-2.5 px-3">Sample Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedTemplate.dataDictionary.map((col, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {col.column}
                      </td>
                      <td className="py-2.5 px-3">
                        {col.required ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {col.type}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {col.description.includes('Amorsolo Circle') ? (
                          <span>
                            {col.description.split('Amorsolo Circle')[0]}
                            <strong className="text-amber-800 font-bold">Amorsolo Circle</strong>
                            {col.description.split('Amorsolo Circle')[1]}
                          </span>
                        ) : (
                          col.description
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {col.example}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Practical Guidelines & Advisor Tips */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Best Practices for InLife Financial Advisers</span>
          </h4>
          <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
            <li>
              <strong>Amorsolo Circle Status:</strong> Setting client status to{' '}
              <code className="bg-white px-1 py-0.2 rounded border border-slate-200 font-bold text-amber-900">
                Amorsolo Circle
              </code>{' '}
              automatically tags the policyholder for elite concierge advisory, luxury anniversary greetings, and priority portfolio reviews.
            </li>
            <li>
              <strong>Dates in Excel / Google Sheets:</strong> Always use standard ISO format{' '}
              <code className="bg-white px-1 py-0.2 rounded border border-slate-200 font-mono">YYYY-MM-DD</code>{' '}
              (e.g., <code className="bg-white px-1 py-0.2 rounded border border-slate-200 font-mono">1985-09-29</code>) to prevent locale ambiguity.
            </li>
            <li>
              <strong>Mobile Numbers:</strong> Include international dialing code (e.g.,{' '}
              <code className="bg-white px-1 py-0.2 rounded border border-slate-200 font-mono">+63 917 111 2233</code>) to ensure SMS and WhatsApp links work correctly.
            </li>
            <li>
              <strong>Tags Formatting:</strong> Separate multiple tags using semicolons (e.g.{' '}
              <code className="bg-white px-1 py-0.2 rounded border border-slate-200 font-mono">Amorsolo Circle; HNWI; Estate Planning</code>).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
