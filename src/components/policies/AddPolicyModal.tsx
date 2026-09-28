import React, { useState } from 'react';
import { X, Shield, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Client, PaymentFrequency } from '../../types';
import { INLIFE_PRODUCTS } from '../../data/products';

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedClient?: Client;
}

export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({
  isOpen,
  onClose,
  preselectedClient,
}) => {
  const { clients, addPolicy, addFundValue, addPremiumPayment, currentBrand, showToast } = useApp();

  const defaultProd = INLIFE_PRODUCTS[0]; // iProtect 1
  const [clientId, setClientId] = useState(preselectedClient?.id || clients[0]?.id || '');
  const [productName, setProductName] = useState(defaultProd.name);
  const [planType, setPlanType] = useState(defaultProd.planType);
  const [faceAmount, setFaceAmount] = useState(String(defaultProd.defaultSumAssured));
  const [premiumAmount, setPremiumAmount] = useState(String(defaultProd.defaultPremium));
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>(defaultProd.defaultFrequency);
  const [policyNumber, setPolicyNumber] = useState(
    `IL-${Math.floor(1000000 + Math.random() * 9000000)}`
  );
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [fundValue, setFundValue] = useState('');
  const [ridersInput, setRidersInput] = useState(defaultProd.suggestedRiders.join(', '));

  if (!isOpen) return null;

  const handleProductChange = (name: string) => {
    setProductName(name);
    const prod = INLIFE_PRODUCTS.find((p) => p.name === name);
    if (prod) {
      setPlanType(prod.planType);
      setFaceAmount(String(prod.defaultSumAssured));
      setPremiumAmount(String(prod.defaultPremium));
      setPaymentFrequency(prod.defaultFrequency);
      setRidersInput(prod.suggestedRiders.join(', '));
    }
  };

  const selectedProduct = INLIFE_PRODUCTS.find((p) => p.name === productName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !productName) return;

    const riders = ridersInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const parsedPrem = Number(premiumAmount) || 0;
    const parsedFund = Number(fundValue) || 0;
    const issueDate = new Date().toISOString().split('T')[0];

    const createdPol = addPolicy({
      clientId,
      policyNumber: policyNumber.trim(),
      productName,
      planType,
      faceAmount: Number(faceAmount) || 1000000,
      premiumAmount: parsedPrem,
      paymentFrequency,
      status: 'In Force',
      issueDate,
      dueDate,
      nextBillingDate: dueDate,
      anniversaryDate: dueDate.substring(5) || '10-15',
      fundValue: parsedFund,
      riders,
    });

    if (parsedFund > 0) {
      addFundValue({
        clientId,
        policyId: createdPol.id,
        date: issueDate,
        fundName: 'InLife Growth Fund',
        units: Math.round(parsedFund / 2.05),
        navpu: 2.05,
        totalValue: parsedFund,
      });
    }

    if (parsedPrem > 0) {
      addPremiumPayment({
        clientId,
        policyId: createdPol.id,
        policyNumber: policyNumber.trim(),
        amount: parsedPrem,
        paymentDate: '',
        dueDate,
        referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Pending',
        paymentMethod: 'Online Banking / ADA',
      });
    }

    showToast(`Policy #${policyNumber} issued with ₱${parsedPrem.toLocaleString()} premium & ₱${parsedFund.toLocaleString()} fund value!`, 'success');
    onClose();
  };

  const brandColor = currentBrand?.primaryColor || '#00529B';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 lg:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: brandColor }}
            >
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Add InLife Policy</h2>
              <p className="text-[11px] text-slate-500">Issue official coverage across 13 InLife products</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 uppercase">Policyholder (Client) *</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              {clients
                .filter((c) => !c.isArchived)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.email})
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Product Plan *</label>
              <select
                value={productName}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold"
              >
                <optgroup label="Term Life Protection">
                  <option value="iProtect 1">iProtect 1</option>
                  <option value="iProtect 5">iProtect 5</option>
                  <option value="iProtect 10">iProtect 10</option>
                </optgroup>
                <optgroup label="Wealth & VUL">
                  <option value="Abundance 20">Abundance 20</option>
                  <option value="Abundance 65">Abundance 65</option>
                  <option value="Wealth Assure Plus">Wealth Assure Plus</option>
                  <option value="Solid Fund Builder">Solid Fund Builder</option>
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
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Product description & category indicator */}
          {selectedProduct && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{selectedProduct.planType}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  {selectedProduct.category}
                </span>
              </div>
              <p className="text-slate-500 text-[10px] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 uppercase">Plan Type / Category</label>
            <input
              type="text"
              required
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Sum Assured (₱) *</label>
              <input
                type="number"
                required
                value={faceAmount}
                onChange={(e) => setFaceAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Premium Amount (₱) *</label>
              <input
                type="number"
                required
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 uppercase">Payment Frequency</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value as PaymentFrequency)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none font-semibold"
              >
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Semi-Annual">Semi-Annual</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 uppercase">Next Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase">
                Current Fund Value (₱){' '}
                <span className="text-[10px] text-emerald-600 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                Optional (VUL/Savings)
              </span>
            </div>
            <input
              type="number"
              min="0"
              value={fundValue}
              onChange={(e) => setFundValue(e.target.value)}
              placeholder="Optional (leave blank or 0 if none)"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase">Riders (comma-separated)</label>
            <input
              type="text"
              value={ridersInput}
              onChange={(e) => setRidersInput(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: brandColor }}
              className="px-5 py-2 hover:opacity-90 text-white rounded-lg text-xs font-bold shadow-xs transition-opacity"
            >
              Issue Policy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
