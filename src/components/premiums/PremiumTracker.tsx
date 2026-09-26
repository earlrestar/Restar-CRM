import React, { useState } from 'react';
import { CreditCard, Calendar, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PremiumTracker: React.FC = () => {
  const { premiumPayments, policies, clients, openClientProfile } = useApp();
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-red-600" />
            <span>Premium Tracker & Collections</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client billing cycles, grace periods, payment settlements, and remittance receipts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Collected (Sep)</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">₱124,500</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Upcoming Due (7 Days)</span>
          <p className="text-2xl font-black text-amber-600 mt-1">₱55,000</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Lapse Prevention Rate</span>
          <p className="text-2xl font-black text-blue-600 mt-1">98.2%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase">Premium Ledger</span>
          <div className="flex gap-1">
            {['all', 'paid', 'pending'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st as any)}
                className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                  filter === st ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Policy #</th>
              <th className="py-3 px-4">Policyholder</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4">Payment Method</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {premiumPayments.map((pay) => {
              const client = clients.find((c) => c.id === pay.clientId);
              return (
                <tr
                  key={pay.id}
                  onClick={() => client && openClientProfile(client.id)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{pay.policyNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">₱{pay.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600">{pay.dueDate}</td>
                  <td className="py-3 px-4 text-slate-500">{pay.paymentMethod}</td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        pay.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {pay.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
