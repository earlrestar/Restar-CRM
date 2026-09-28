import React, { useState } from 'react';
import { Shield, Plus, Search, Filter, ExternalLink, User, Layers, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Policy, Client } from '../../types';
import { INLIFE_PRODUCTS } from '../../data/products';
import { EditPolicyModal } from './EditPolicyModal';

interface PoliciesViewProps {
  onOpenAddPolicy: () => void;
  onSelectClient: (client: Client) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ onOpenAddPolicy, onSelectClient }) => {
  const { policies, clients, openClientProfile, currentBrand } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const filteredPolicies = policies.filter((pol) => {
    // Product exact filter
    if (productFilter !== 'All' && pol.productName !== productFilter) return false;

    // Category group filter
    if (categoryFilter !== 'All') {
      const prodInfo = INLIFE_PRODUCTS.find((p) => p.name === pol.productName);
      if (prodInfo && prodInfo.category !== categoryFilter) return false;
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const client = clients.find((c) => c.id === pol.clientId);
      const clientName = client ? `${client.firstName} ${client.lastName}`.toLowerCase() : '';
      return (
        pol.policyNumber.toLowerCase().includes(term) ||
        pol.productName.toLowerCase().includes(term) ||
        pol.planType.toLowerCase().includes(term) ||
        clientName.includes(term)
      );
    }
    return true;
  });

  const totalSumAssured = policies.reduce((acc, p) => acc + p.faceAmount, 0);
  const totalFundValue = policies.reduce((acc, p) => acc + p.fundValue, 0);
  const brandColor = currentBrand?.primaryColor || '#00529B';

  const categories = ['All', 'Term Life', 'VUL & Investment', 'Health & Critical Illness', 'Retirement', 'Global Medical'];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: brandColor }}
            >
              <Shield className="w-5 h-5" />
            </div>
            <span>Policy Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            InLife insurance policies, 13 official product lines, coverage sums, premium frequencies, and attached riders.
          </p>
        </div>

        <button
          onClick={onOpenAddPolicy}
          style={{ backgroundColor: brandColor }}
          className="px-4 py-2 hover:opacity-90 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-900/20 active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add InLife Policy</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Policies</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{policies.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sum Assured</span>
          <p className="text-2xl font-black text-slate-900 mt-1">₱{totalSumAssured.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fund Value</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₱{totalFundValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  setProductFilter('All');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search policy #, client or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Specific Product Quick Select */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Product:
          </span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="px-2.5 py-1 border border-slate-200 rounded-lg text-xs font-semibold bg-white text-slate-700 focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="All">All InLife Products (13 Plans)</option>
            {INLIFE_PRODUCTS.map((prod) => (
              <option key={prod.name} value={prod.name}>
                {prod.name} ({prod.category})
              </option>
            ))}
          </select>

          {/* Quick buttons for most popular */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {INLIFE_PRODUCTS.slice(0, 6).map((p) => {
              const isSelected = productFilter === p.name;
              return (
                <button
                  key={p.name}
                  onClick={() => setProductFilter(isSelected ? 'All' : p.name)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-400 border-b border-slate-200 uppercase font-bold tracking-wider text-[10px]">
                <th className="py-3 px-4">Policy #</th>
                <th className="py-3 px-4">Policyholder</th>
                <th className="py-3 px-4">InLife Product Plan</th>
                <th className="py-3 px-4">Sum Assured</th>
                <th className="py-3 px-4">Premium</th>
                <th className="py-3 px-4">Fund Value</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No policies found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((pol) => {
                  const client = clients.find((c) => c.id === pol.clientId);
                  const prodInfo = INLIFE_PRODUCTS.find((p) => p.name === pol.productName);

                  return (
                    <tr
                      key={pol.id}
                      className="hover:bg-slate-50/80 group transition-colors"
                    >
                      <td
                        onClick={() => client && openClientProfile(client.id)}
                        className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-blue-600 cursor-pointer"
                      >
                        {pol.policyNumber}
                      </td>

                      <td
                        onClick={() => client && openClientProfile(client.id)}
                        className="py-3.5 px-4 cursor-pointer"
                      >
                        {client ? (
                          <div>
                            <p className="font-bold text-slate-800">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-[11px] text-slate-400">{client.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>

                      <td
                        onClick={() => client && openClientProfile(client.id)}
                        className="py-3.5 px-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{pol.productName}</span>
                          {prodInfo && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-slate-100 text-slate-600">
                              {prodInfo.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{pol.planType}</p>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        ₱{pol.faceAmount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900">
                          ₱{pol.premiumAmount.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-400">{pol.paymentFrequency}</p>
                      </td>

                      <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                        ₱{pol.fundValue.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{pol.dueDate}</td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          pol.status === 'In Force'
                            ? 'bg-emerald-50 text-emerald-700'
                            : pol.status === 'Grace Period'
                            ? 'bg-amber-50 text-amber-700'
                            : pol.status === 'Lapsed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {pol.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setEditingPolicy(pol)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-[11px] transition-colors border border-slate-200 hover:border-blue-300 shadow-2xs cursor-pointer active:scale-95"
                          title="Edit InLife Policy"
                        >
                          <Edit3 className="w-3 h-3 text-blue-600" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Policy Modal */}
      <EditPolicyModal
        isOpen={!!editingPolicy}
        onClose={() => setEditingPolicy(null)}
        policy={editingPolicy}
      />
    </div>
  );
};
