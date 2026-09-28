import React from 'react';
import { TrendingUp, PieChart, Shield, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FundValuesView: React.FC = () => {
  const { fundValues, policies, clients, openClientProfile, metrics } = useApp();

  const totalFundValue = fundValues.reduce((acc, f) => acc + (Number(f.totalValue) || 0), 0);
  const vulPoliciesCount = policies.filter(
    (p) =>
      p.planType === 'VUL' ||
      p.productName.toLowerCase().includes('wealth') ||
      p.productName.toLowerCase().includes('abundance') ||
      p.productName.toLowerCase().includes('solid')
  ).length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-red-600" />
          <span>VUL Fund Values & Portfolio Balances</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track Net Asset Value Per Unit (NAVPU), equity allocation, and investment growth for InLife VUL clients.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Portfolio Managed</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {metrics.formatPHP(totalFundValue)}
          </p>
          <span className="text-[11px] text-slate-400">
            {fundValues.length} active client fund accounts
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Top InLife Fund</span>
          <p className="text-lg font-bold text-slate-900 mt-1 truncate">InLife Select Equity Fund</p>
          <span className="text-xs text-emerald-600 font-semibold">+14.2% 1-Year Return</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">VUL In-Force Count</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{vulPoliciesCount} Policies</p>
          <span className="text-[11px] text-slate-400">
            {vulPoliciesCount > 0 ? `${((vulPoliciesCount / (policies.length || 1)) * 100).toFixed(0)}% of total policies` : 'No VUL policies yet'}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase">
          Client Fund Holdings Breakdown
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Policyholder</th>
              <th className="py-3 px-4">Fund Portfolio Name</th>
              <th className="py-3 px-4">Units Held</th>
              <th className="py-3 px-4">Current NAVPU</th>
              <th className="py-3 px-4 text-right">Total Fund Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fundValues.map((fv) => {
              const client = clients.find((c) => c.id === fv.clientId);
              return (
                <tr
                  key={fv.id}
                  onClick={() => client && openClientProfile(client.id)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {client ? `${client.firstName} ${client.lastName}` : 'Client'}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{fv.fundName}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{fv.units.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">₱{fv.navpu.toFixed(4)}</td>
                  <td className="py-3 px-4 font-black text-emerald-600 text-right">
                    ₱{fv.totalValue.toLocaleString()}
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
