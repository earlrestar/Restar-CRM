import React, { useState, useEffect } from 'react';
import { X, Shield, Edit3, Trash2, AlertTriangle, Sparkles, Check, TrendingUp, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Policy, PaymentFrequency } from '../../types';
import { INLIFE_PRODUCTS } from '../../data/products';

interface EditPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Policy | null;
}

export const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  isOpen,
  onClose,
  policy,
}) => {
  const { clients, updatePolicy, deletePolicy, currentBrand } = useApp();

  const [clientId, setClientId] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [planType, setPlanType] = useState('VUL');
  const [status, setStatus] = useState<Policy['status']>('In Force');
  const [faceAmount, setFaceAmount] = useState('');
  const [premiumAmount, setPremiumAmount] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('Annual');
  const [fundValue, setFundValue] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [ridersInput, setRidersInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (policy) {
      setClientId(policy.clientId);
      setPolicyNumber(policy.policyNumber);
      setProductName(policy.productName);
      setPlanType(policy.planType);
      setStatus(policy.status);
      setFaceAmount(String(policy.faceAmount));
      setPremiumAmount(String(policy.premiumAmount));
      setPaymentFrequency(policy.paymentFrequency);
      setFundValue(policy.fundValue > 0 ? String(policy.fundValue) : '');
      setDueDate(policy.dueDate);
      setIssueDate(policy.issueDate);
      setRidersInput(policy.riders.join(', '));
      setShowDeleteConfirm(false);
    }
  }, [policy]);

  if (!isOpen || !policy) return null;

  const handleProductChange = (name: string) => {
    setProductName(name);
    const prod = INLIFE_PRODUCTS.find((p) => p.name === name);
    if (prod) {
      setPlanType(prod.planType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !policyNumber) return;

    const riders = ridersInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const parsedFace = parseFloat(faceAmount) || 0;
    const parsedPremium = parseFloat(premiumAmount) || 0;
    const parsedFund = fundValue.trim() === '' ? 0 : parseFloat(fundValue) || 0;

    updatePolicy(policy.id, {
      clientId,
      policyNumber: policyNumber.trim(),
      productName,
      planType,
      status,
      faceAmount: parsedFace,
      premiumAmount: parsedPremium,
      paymentFrequency,
      fundValue: parsedFund,
      dueDate,
      nextBillingDate: dueDate,
      issueDate,
      riders,
    });

    onClose();
  };

  const handleDelete = () => {
    deletePolicy(policy.id);
    onClose();
  };

  const brandColor = currentBrand?.primaryColor || '#00529B';
  const assignedClient = clients.find((c) => c.id === clientId);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 lg:p-7 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: brandColor }}
            >
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Edit InLife Policy</h2>
              <p className="text-xs text-slate-500">
                Policy #{policy.policyNumber} &bull;{' '}
                {assignedClient ? `${assignedClient.firstName} ${assignedClient.lastName}` : 'Unassigned'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Client & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 uppercase">Assigned Client *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Policy Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Policy['status'])}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="In Force">In Force (Active)</option>
                <option value="Grace Period">Grace Period (Past Due)</option>
                <option value="Lapsed">Lapsed</option>
                <option value="Paid-Up">Paid-Up</option>
                <option value="Surrendered">Surrendered</option>
              </select>
            </div>
          </div>

          {/* Product & Policy Number Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 uppercase">InLife Product Plan *</label>
              <select
                value={productName}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <optgroup label="Wealth & VUL">
                  <option value="Wealth Assure Plus">Wealth Assure Plus</option>
                  <option value="Abundance 20">Abundance 20</option>
                  <option value="Abundance 65">Abundance 65</option>
                  <option value="Solid Fund Builder">Solid Fund Builder</option>
                </optgroup>
                <optgroup label="Term Life Protection">
                  <option value="iProtect 1">iProtect 1</option>
                  <option value="iProtect 5">iProtect 5</option>
                  <option value="iProtect 10">iProtect 10</option>
                </optgroup>
                <optgroup label="Health & Critical Illness">
                  <option value="Resilience CIE">Resilience CIE</option>
                  <option value="Resilience CHS">Resilience CHS</option>
                  <option value="Resilience Female Cancer">Resilience Female Cancer</option>
                </optgroup>
                <optgroup label="Retirement & Pension">
                  <option value="Retire Assure">Retire Assure</option>
                </optgroup>
                <optgroup label="Global Medical Care">
                  <option value="Inlife Global Care Worldwide">Inlife Global Care Worldwide</option>
                  <option value="Inlife Global Care Excl. USA">Inlife Global Care Excl. USA</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Policy Number *</label>
              <input
                type="text"
                required
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Plan Type */}
          <div>
            <label className="font-bold text-slate-700 uppercase">Plan Type / Category</label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="VUL">VUL (Variable Unit-Linked)</option>
              <option value="Traditional Whole Life">Traditional Whole Life</option>
              <option value="Term Life">Term Life Protection</option>
              <option value="Health">Health & Critical Illness</option>
              <option value="Global Medical">Global Medical Care</option>
            </select>
          </div>

          {/* Sum Assured & Premium Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 uppercase">Sum Assured (₱) *</label>
              <input
                type="number"
                min="0"
                step="10000"
                required
                value={faceAmount}
                onChange={(e) => setFaceAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 uppercase flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                  <span>Premium Amount (₱) *</span>
                </label>
                <span className="text-[10px] text-amber-700 font-bold">Manual Entry</span>
              </div>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-amber-300 bg-amber-50/30 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Frequency & Optional Fund Value */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 uppercase">Payment Frequency</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value as PaymentFrequency)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Annual">Annual</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 uppercase flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Current Fund Value (₱)</span>
                </label>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                  Optional
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={fundValue}
                onChange={(e) => setFundValue(e.target.value)}
                placeholder="Leave blank or 0 if none"
                className="w-full mt-1 px-3 py-2 border border-emerald-300 bg-emerald-50/30 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Due Date & Issue Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="font-bold text-slate-700 uppercase">Next Premium Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Issue Date</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Attached Riders */}
          <div>
            <label className="font-bold text-slate-700 uppercase">
              Attached Riders (comma-separated)
            </label>
            <input
              type="text"
              value={ridersInput}
              onChange={(e) => setRidersInput(e.target.value)}
              placeholder="e.g. Accidental Death & Dismemberment, Critical Illness Waiver"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Delete Danger Zone */}
          {showDeleteConfirm ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <p className="text-xs font-bold text-red-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Confirm Policy Deletion</span>
              </p>
              <p className="text-[11px] text-red-700">
                Are you sure you want to permanently delete Policy #{policy.policyNumber}? All associated fund values will be removed.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs"
                >
                  Yes, Delete Policy
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Policy</span>
              </button>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: brandColor }}
              className="px-5 py-2 hover:opacity-95 text-white rounded-xl font-bold shadow-md shadow-blue-900/20 active:scale-98 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Policy Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
