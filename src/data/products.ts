export interface InLifeProductInfo {
  id: string;
  name: string;
  category: 'Term Life' | 'VUL & Investment' | 'Health & Critical Illness' | 'Retirement' | 'Global Medical';
  planType: string;
  description: string;
  defaultSumAssured: number;
  defaultPremium: number;
  defaultFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual';
  suggestedRiders: string[];
}

export const INLIFE_PRODUCTS: InLifeProductInfo[] = [
  {
    id: 'iprotect-1',
    name: 'iProtect 1',
    category: 'Term Life',
    planType: '1-Year Renewable Term Life Protection',
    description: 'Cost-effective, highly flexible pure term protection with yearly renewable coverage.',
    defaultSumAssured: 2000000,
    defaultPremium: 6500,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Accidental Death & Dismemberment', 'Total and Permanent Disability'],
  },
  {
    id: 'iprotect-5',
    name: 'iProtect 5',
    category: 'Term Life',
    planType: '5-Year Renewable & Convertible Term Life',
    description: '5-year level guaranteed term protection with conversion privilege to permanent plans.',
    defaultSumAssured: 3000000,
    defaultPremium: 14500,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Accidental Death Benefit', 'Waiver of Premium upon Disability'],
  },
  {
    id: 'iprotect-10',
    name: 'iProtect 10',
    category: 'Term Life',
    planType: '10-Year Renewable & Convertible Term Life',
    description: 'Decade-long guaranteed life protection for growing families and financial liability coverage.',
    defaultSumAssured: 5000000,
    defaultPremium: 22000,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Accidental Death Benefit', 'Critical Illness Booster', 'Payor Waiver'],
  },
  {
    id: 'abundance-20',
    name: 'Abundance 20',
    category: 'VUL & Investment',
    planType: 'Variable Universal Life (20-Pay Wealth Accumulation)',
    description: 'Disciplined 20-year wealth building program coupled with long-term life coverage.',
    defaultSumAssured: 2000000,
    defaultPremium: 25000,
    defaultFrequency: 'Quarterly',
    suggestedRiders: ['Waiver of Premium on Disability', 'Term Booster Rider'],
  },
  {
    id: 'abundance-65',
    name: 'Abundance 65',
    category: 'VUL & Investment',
    planType: 'Variable Universal Life (Pay to Age 65)',
    description: 'Structured retirement and legacy growth engine designed to build capital until age 65.',
    defaultSumAssured: 3500000,
    defaultPremium: 45000,
    defaultFrequency: 'Semi-Annual',
    suggestedRiders: ['Accidental Death & Dismemberment', 'Payor Waiver of Premium'],
  },
  {
    id: 'resilience-cie',
    name: 'Resilience CIE',
    category: 'Health & Critical Illness',
    planType: 'Comprehensive Critical Illness Endowment',
    description: 'Endowment plan providing coverage against major critical illnesses with guaranteed cash payouts.',
    defaultSumAssured: 2500000,
    defaultPremium: 18500,
    defaultFrequency: 'Semi-Annual',
    suggestedRiders: ['Critical Illness Plus (100 conditions)', 'Hospital Cash Benefit'],
  },
  {
    id: 'resilience-chs',
    name: 'Resilience CHS',
    category: 'Health & Critical Illness',
    planType: 'Comprehensive Health Solution',
    description: 'Complete health security covering medical hospitalization, surgery, and intensive recuperation.',
    defaultSumAssured: 3000000,
    defaultPremium: 24000,
    defaultFrequency: 'Semi-Annual',
    suggestedRiders: ['Daily Hospital Confinement', 'Surgical Expense Reimbursement'],
  },
  {
    id: 'resilience-female-cancer',
    name: 'Resilience Female Cancer',
    category: 'Health & Critical Illness',
    planType: 'Specialized Female Health & Cancer Care',
    description: 'Specialized coverage addressing female-specific critical conditions, breast and cervical cancers.',
    defaultSumAssured: 3000000,
    defaultPremium: 28000,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Special Early Stage Female Cancer Rider', 'Well-Woman Screening Benefit'],
  },
  {
    id: 'retire-assure',
    name: 'Retire Assure',
    category: 'Retirement',
    planType: 'Guaranteed Pension & Retirement Income Solution',
    description: 'Guaranteed retirement cash stream providing peace of mind and financial independence in retirement.',
    defaultSumAssured: 4000000,
    defaultPremium: 35000,
    defaultFrequency: 'Quarterly',
    suggestedRiders: ['Retirement Annuity Booster', 'Waiver of Premium on Total Disability'],
  },
  {
    id: 'wealth-assure-plus',
    name: 'Wealth Assure Plus',
    category: 'VUL & Investment',
    planType: 'Customizable Variable Universal Life (VUL)',
    description: 'Customizable investment-linked plan with high insurance coverage multipliers and flexible fund options.',
    defaultSumAssured: 5000000,
    defaultPremium: 30000,
    defaultFrequency: 'Quarterly',
    suggestedRiders: ['Comprehensive Critical Illness Rider', 'Accidental Death & Dismemberment'],
  },
  {
    id: 'solid-fund-builder',
    name: 'Solid Fund Builder',
    category: 'VUL & Investment',
    planType: 'Single-Pay / High Equity Wealth Accumulation VUL',
    description: 'High net-worth capital growth solution with direct access to local and international equity funds.',
    defaultSumAssured: 10000000,
    defaultPremium: 100000,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Global Equity Allocation Rider', 'Estate Transfer Acceleration Rider'],
  },
  {
    id: 'inlife-global-care-worldwide',
    name: 'Inlife Global Care Worldwide',
    category: 'Global Medical',
    planType: 'Worldwide International Medical Insurance (Including USA)',
    description: 'Premier international healthcare offering up to $2,000,000 global medical coverage including USA access.',
    defaultSumAssured: 100000000, // ~₱100M ($2M)
    defaultPremium: 150000,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Global Medical Evacuation & Repatriation', 'Prescription Drug Rider'],
  },
  {
    id: 'inlife-global-care-excl-usa',
    name: 'Inlife Global Care Excl. USA',
    category: 'Global Medical',
    planType: 'Worldwide International Medical Insurance (Excluding USA)',
    description: 'Comprehensive global health and hospital treatment worldwide, excluding USA healthcare systems.',
    defaultSumAssured: 75000000, // ~₱75M ($1.5M)
    defaultPremium: 110000,
    defaultFrequency: 'Annual',
    suggestedRiders: ['Emergency International Medical Assistance', 'Second Medical Opinion Rider'],
  },
];

export const INLIFE_PRODUCT_NAMES = INLIFE_PRODUCTS.map((p) => p.name);
