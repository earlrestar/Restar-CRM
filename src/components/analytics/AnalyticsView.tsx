import React from 'react';
import { BarChart3, TrendingUp, Users, Shield, Award, CheckCircle, PieChart, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INLIFE_PRODUCTS } from '../../data/products';
import { InteractiveGraphSection } from './InteractiveGraphSection';

export const AnalyticsView: React.FC = () => {
  const { clients, policies, currentBrand } = useApp();

  const brandColor = currentBrand?.primaryColor || '#00529B';

  // Compute product breakdown dynamically
  const totalPolicies = policies.length || 1;
  const productCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {
    'Health & Critical Illness': 0,
    'VUL & Investment': 0,
    'Term Life': 0,
    'Global Medical': 0,
    'Retirement': 0,
  };

  policies.forEach((p) => {
    productCounts[p.productName] = (productCounts[p.productName] || 0) + 1;
    const info = INLIFE_PRODUCTS.find((ip) => ip.name === p.productName);
    if (info && categoryCounts[info.category] !== undefined) {
      categoryCounts[info.category] += 1;
    }
  });

  const categories = [
    {
      name: 'Health & Critical Illness (Resilience CIE, CHS, Female Cancer)',
      category: 'Health & Critical Illness',
      count: categoryCounts['Health & Critical Illness'],
      color: 'bg-rose-600',
      textColor: 'text-rose-600',
    },
    {
      name: 'VUL & Wealth Accumulation (Abundance, Wealth Assure Plus, Solid Fund Builder)',
      category: 'VUL & Investment',
      count: categoryCounts['VUL & Investment'],
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
    },
    {
      name: 'Term Life Protection (iProtect 1, 5, 10)',
      category: 'Term Life',
      count: categoryCounts['Term Life'],
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
    },
    {
      name: 'Global Medical Care (Inlife Global Care Worldwide & Excl. USA)',
      category: 'Global Medical',
      count: categoryCounts['Global Medical'],
      color: 'bg-emerald-600',
      textColor: 'text-emerald-600',
    },
    {
      name: 'Retirement & Pension (Retire Assure)',
      category: 'Retirement',
      count: categoryCounts['Retirement'],
      color: 'bg-indigo-600',
      textColor: 'text-indigo-600',
    },
  ];

  const totalSum = policies.reduce((acc, p) => acc + p.faceAmount, 0);
  const totalPrem = policies.reduce((acc, p) => acc + p.premiumAmount, 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: brandColor }}
          >
            <BarChart3 className="w-5 h-5" />
          </div>
          <span>Adviser Production & Performance Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          MDRT benchmark tracking, persistency ratios, 13 InLife products mix, and production milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">MDRT Production Goal</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">₱2.84M</span>
            <span className="text-xs font-bold text-emerald-600">88.5% achieved</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className="h-2 rounded-full w-[88.5%]"
              style={{ backgroundColor: brandColor }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">13-Month Persistency</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">96.8%</span>
            <span className="text-xs font-bold text-emerald-600">Top 5% Branch</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Excellent client retention across all plans</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Sum Assured</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              ₱{(totalSum / 1000000).toFixed(1)}M
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Total active protection portfolio</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Average Case Size</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-slate-900">
              ₱{Math.round(totalPrem / totalPolicies).toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across {policies.length} issued policies</p>
        </div>
      </div>

      {/* Interactive Graph Section with Dropdown */}
      <InteractiveGraphSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Product Mix Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-600" />
              <span>InLife Product Line Mix</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">{policies.length} In-Force Policies</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {categories.map((c) => {
              const pct = Math.round((c.count / totalPolicies) * 100);
              return (
                <div key={c.category}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-semibold text-slate-700">{c.name}</span>
                    <span className="font-bold text-slate-900">
                      {pct}% <span className="text-[11px] text-slate-400">({c.count})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${c.color} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Product Counts Grid */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Distribution Across 13 InLife Products:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INLIFE_PRODUCTS.map((p) => {
                const count = productCounts[p.name] || 0;
                return (
                  <div
                    key={p.name}
                    className={`p-2 rounded-lg border text-left ${
                      count > 0 ? 'bg-blue-50/50 border-blue-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <p className="text-[11px] font-bold text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                      <span>{count} {count === 1 ? 'policy' : 'policies'}</span>
                      {count > 0 && (
                        <span className="font-bold text-blue-700">
                          {Math.round((count / totalPolicies) * 100)}%
                        </span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Advisory Milestones */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Quarterly Advisory Milestones</span>
          </h3>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block font-bold">
                  Q3 Persistency Award Certified
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Achieved 96.8% persistency, ranking in the 99th percentile across InLife Makati Financial Center.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-100">
              <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-900 block font-bold">
                  13 InLife Product Coverage Available
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Full advisory portfolio enabled: iProtect, Abundance, Resilience, Assure, and Global Care suites.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block font-bold">MDRT Aspirant Tracking</strong>
                <span className="text-slate-500 text-[11px]">
                  On track to qualify for Million Dollar Round Table with ₱2.84M in submitted production credit.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
