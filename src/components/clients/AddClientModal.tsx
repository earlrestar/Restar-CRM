import React, { useState } from 'react';
import { X, User, Phone, Briefcase, BellRing, Shield, CreditCard, TrendingUp, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  Gender,
  CivilStatus,
  ClientStatus,
  ContactMethod,
  CommunicationPreferences,
  PaymentFrequency,
} from '../../types';
import { INLIFE_PRODUCTS } from '../../data/products';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose }) => {
  const {
    addClient,
    addPolicy,
    addFundValue,
    addPremiumPayment,
    openClientProfile,
    currentBrand,
    showToast,
  } = useApp();

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

  // Initial Policy & Manual Financial Inputs
  const [includePolicy, setIncludePolicy] = useState(true);
  const [productName, setProductName] = useState('Wealth Assure Plus');
  const [planType, setPlanType] = useState('VUL');
  const [policyNumber, setPolicyNumber] = useState(
    () => `IL-${Math.floor(1000000 + Math.random() * 9000000)}`
  );
  const [faceAmount, setFaceAmount] = useState('1000000');
  const [premiumAmount, setPremiumAmount] = useState('36000');
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('Annual');
  const [fundValue, setFundValue] = useState(''); // Optional: empty by default
  const [fundName, setFundName] = useState('InLife Growth Fund');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });

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

  const handleProductChange = (prodName: string) => {
    setProductName(prodName);
    const found = INLIFE_PRODUCTS.find((p) => p.name === prodName);
    if (found) {
      setPlanType(found.planType);
    }
  };

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

    const parsedPremium = parseFloat(premiumAmount) || 0;
    const parsedFund = parseFloat(fundValue) || 0;
    const parsedFace = parseFloat(faceAmount) || (parsedPremium > 0 ? parsedPremium * 10 : 1000000);

    if (includePolicy && (parsedPremium > 0 || parsedFund > 0 || productName)) {
      const polNum = policyNumber.trim() || `IL-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const issueDate = new Date().toISOString().split('T')[0];
      const anniversaryDate = issueDate.substring(5);

      const createdPolicy = addPolicy({
        clientId: newClient.id,
        policyNumber: polNum,
        productName: productName.trim() || 'Wealth Assure Plus',
        planType: planType || 'VUL',
        faceAmount: parsedFace,
        premiumAmount: parsedPremium,
        paymentFrequency,
        status: 'In Force',
        issueDate,
        dueDate,
        nextBillingDate: dueDate,
        anniversaryDate,
        fundValue: parsedFund,
        riders: ['Accidental Death & Dismemberment', 'Critical Illness Waiver'],
      });

      // If fund value is manually typed > 0, create fund value record
      if (parsedFund > 0) {
        addFundValue({
          clientId: newClient.id,
          policyId: createdPolicy.id,
          date: issueDate,
          fundName: fundName.trim() || 'InLife Growth Fund',
          units: Math.round(parsedFund / 2.05),
          navpu: 2.05,
          totalValue: parsedFund,
        });
      }

      // If premium is manually typed > 0, create premium payment ledger entry
      if (parsedPremium > 0) {
        addPremiumPayment({
          clientId: newClient.id,
          policyId: createdPolicy.id,
          policyNumber: polNum,
          amount: parsedPremium,
          paymentDate: '',
          dueDate,
          referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'Pending',
          paymentMethod: 'Online Banking / Auto-Debit',
        });
      }

      if (parsedFund > 0) {
        showToast(
          `Client ${newClient.firstName} ${newClient.lastName} created with ₱${parsedPremium.toLocaleString()} premium & ₱${parsedFund.toLocaleString()} fund value!`,
          'success'
        );
      } else {
        showToast(
          `Client ${newClient.firstName} ${newClient.lastName} created with ₱${parsedPremium.toLocaleString()} premium!`,
          'success'
        );
      }
    }

    onClose();
    // Open new client profile directly
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

          {/* Section 4: Initial Policy, Premium & Fund Value Manual Entry */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-red-600" />
                <span>4. Policy, Premium Amount & Fund Value (Manual Entry)</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={includePolicy}
                  onChange={(e) => setIncludePolicy(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 accent-red-600 focus:ring-red-500"
                />
                <span>Attach Initial Policy</span>
              </label>
            </div>

            {includePolicy && (
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Product Name *
                    </label>
                    <select
                      value={productName}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none bg-white font-medium"
                    >
                      {INLIFE_PRODUCTS.map((prod) => (
                        <option key={prod.name} value={prod.name}>
                          {prod.name} ({prod.planType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Plan Type
                    </label>
                    <select
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none bg-white font-medium"
                    >
                      <option value="VUL">VUL (Variable Unit-Linked)</option>
                      <option value="Traditional Whole Life">Traditional Whole Life</option>
                      <option value="Term Life">Term Life Protection</option>
                      <option value="Health">Health & Critical Illness</option>
                      <option value="Global Medical">Global Medical Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">
                      Policy Number
                    </label>
                    <input
                      type="text"
                      value={policyNumber}
                      onChange={(e) => setPolicyNumber(e.target.value)}
                      placeholder="e.g. IL-9988221"
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Core Manual Financial Inputs: Premium Amount & Fund Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                  {/* Manual Premium Amount Input */}
                  <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                        <span>Premium Amount (₱) *</span>
                      </label>
                      <span className="text-[10px] text-amber-700 font-bold">Manual Entry</span>
                    </div>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-amber-800 text-sm">
                        ₱
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        required={includePolicy}
                        value={premiumAmount}
                        onChange={(e) => setPremiumAmount(e.target.value)}
                        placeholder="e.g. 36000"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-amber-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-amber-700">Payment Frequency:</span>
                      <select
                        value={paymentFrequency}
                        onChange={(e) => setPaymentFrequency(e.target.value as PaymentFrequency)}
                        className="text-xs font-semibold px-2 py-0.5 border border-amber-300 rounded bg-white"
                      >
                        <option value="Annual">Annual</option>
                        <option value="Semi-Annual">Semi-Annual</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  {/* Manual Fund Value Input (Optional) */}
                  <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Current Fund Value (₱)</span>
                        <span className="text-[10px] text-emerald-600 font-normal lowercase">(optional)</span>
                      </label>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full font-bold">
                        Optional
                      </span>
                    </div>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-emerald-800 text-sm">
                        ₱
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={fundValue}
                        onChange={(e) => setFundValue(e.target.value)}
                        placeholder="Optional (leave blank or 0 if none)"
                        className="w-full pl-8 pr-3 py-2 bg-white border border-emerald-300 rounded-lg text-sm font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-500">
                        For VUL/savings. Leave blank for term/health.
                      </span>
                      <input
                        type="text"
                        value={fundName}
                        onChange={(e) => setFundName(e.target.value)}
                        placeholder="e.g. InLife Growth Fund"
                        className="text-xs font-medium px-2 py-0.5 border border-emerald-300 rounded bg-white w-36 text-right truncate"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Policy Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Sum Assured / Face Amount (₱)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="50000"
                      value={faceAmount}
                      onChange={(e) => setFaceAmount(e.target.value)}
                      placeholder="e.g. 1000000"
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">
                      Next Premium Due Date
                    </label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Live Real-Time Dashboard Impact Notice */}
                <div className="p-2.5 rounded-lg bg-blue-50/80 border border-blue-200 text-[11px] text-blue-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    <strong>Real-Time Metric Sync:</strong> Adding this client will immediately update your Dashboard total clients (+1), active policies (+1), premiums due (+₱{Number(premiumAmount || 0).toLocaleString()}), and total fund values (+₱{Number(fundValue || 0).toLocaleString()}).
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Communication Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
              <BellRing className="w-4 h-4 text-blue-600" />
              <span>5. Communication Preferences (Automated Toggles)</span>
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
