import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Calendar,
  Shield,
  DollarSign,
  Users,
  Award,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Sparkles,
  Clock,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INLIFE_PRODUCTS, InLifeProductInfo } from '../../data/products';
import { Policy, Client } from '../../types';

export type GraphType =
  | 'products-distribution'
  | 'monthly-cashflow'
  | 'sum-assured'
  | 'category-breakdown'
  | 'payment-frequency'
  | 'fund-values'
  | 'client-demographics'
  | 'mdrt-pace';

export const InteractiveGraphSection: React.FC = () => {
  const { policies, clients, premiumPayments, fundValues, currentBrand } = useApp();

  const [selectedGraph, setSelectedGraph] = useState<GraphType>('products-distribution');
  const [productMetric, setProductMetric] = useState<'count' | 'premium' | 'sumAssured'>('count');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const brandColor = currentBrand?.primaryColor || '#00529B';

  // 1. InLife 13 Products Distribution Data
  const productData = useMemo(() => {
    return INLIFE_PRODUCTS.map((prod) => {
      const matchingPolicies = policies.filter((p) => p.productName === prod.name);
      const count = matchingPolicies.length;
      const totalFace = matchingPolicies.reduce((sum, p) => sum + p.faceAmount, 0);
      const totalAnnualPrem = matchingPolicies.reduce((sum, p) => {
        let mult = 1;
        if (p.paymentFrequency === 'Monthly') mult = 12;
        else if (p.paymentFrequency === 'Quarterly') mult = 4;
        else if (p.paymentFrequency === 'Semi-Annual') mult = 2;
        return sum + p.premiumAmount * mult;
      }, 0);

      return {
        ...prod,
        count,
        totalFace,
        totalAnnualPrem,
      };
    });
  }, [policies]);

  // Total summary figures
  const totalPolicies = policies.length || 1;
  const totalFaceAmount = policies.reduce((s, p) => s + p.faceAmount, 0);
  const totalAnnualizedPremium = policies.reduce((s, p) => {
    let mult = 1;
    if (p.paymentFrequency === 'Monthly') mult = 12;
    else if (p.paymentFrequency === 'Quarterly') mult = 4;
    else if (p.paymentFrequency === 'Semi-Annual') mult = 2;
    return s + p.premiumAmount * mult;
  }, 0);

  // 2. Monthly Inflow & Quarterly Data
  const monthlyCashflow = useMemo(() => {
    const months = [
      { name: 'Jan', q: 'Q1', premium: 14500, status: 'Collected' },
      { name: 'Feb', q: 'Q1', premium: 22000, status: 'Collected' },
      { name: 'Mar', q: 'Q1', premium: 45000, status: 'Collected' },
      { name: 'Apr', q: 'Q2', premium: 250000, status: 'Collected' },
      { name: 'May', q: 'Q2', premium: 145000, status: 'Collected' },
      { name: 'Jun', q: 'Q2', premium: 6500, status: 'Collected' },
      { name: 'Jul', q: 'Q3', premium: 68000, status: 'Collected' },
      { name: 'Aug', q: 'Q3', premium: 35000, status: 'Collected' },
      { name: 'Sep', q: 'Q3', premium: 73500, status: 'Current (₱50k due in 4 days)' },
      { name: 'Oct', q: 'Q4', premium: 146500, status: 'Upcoming' },
      { name: 'Nov', q: 'Q4', premium: 170000, status: 'Upcoming' },
      { name: 'Dec', q: 'Q4', premium: 42500, status: 'Upcoming' },
    ];
    const maxVal = Math.max(...months.map((m) => m.premium));
    return { months, maxVal };
  }, []);

  // 3. Category Breakdown Data
  const categoryData = useMemo(() => {
    const categories: Record<
      string,
      { count: number; faceAmount: number; premium: number; color: string; bg: string }
    > = {
      'Health & Critical Illness': { count: 0, faceAmount: 0, premium: 0, color: 'text-rose-600', bg: 'bg-rose-500' },
      'VUL & Investment': { count: 0, faceAmount: 0, premium: 0, color: 'text-blue-600', bg: 'bg-blue-600' },
      'Term Life': { count: 0, faceAmount: 0, premium: 0, color: 'text-amber-600', bg: 'bg-amber-500' },
      'Global Medical': { count: 0, faceAmount: 0, premium: 0, color: 'text-emerald-600', bg: 'bg-emerald-600' },
      'Retirement': { count: 0, faceAmount: 0, premium: 0, color: 'text-indigo-600', bg: 'bg-indigo-600' },
    };

    policies.forEach((p) => {
      const prod = INLIFE_PRODUCTS.find((ip) => ip.name === p.productName);
      const cat = prod?.category || 'Term Life';
      if (categories[cat]) {
        categories[cat].count += 1;
        categories[cat].faceAmount += p.faceAmount;
        let mult = 1;
        if (p.paymentFrequency === 'Monthly') mult = 12;
        else if (p.paymentFrequency === 'Quarterly') mult = 4;
        else if (p.paymentFrequency === 'Semi-Annual') mult = 2;
        categories[cat].premium += p.premiumAmount * mult;
      }
    });

    return Object.entries(categories).map(([name, val]) => ({
      name,
      ...val,
      pctCount: Math.round((val.count / totalPolicies) * 100),
      pctFace: totalFaceAmount > 0 ? Math.round((val.faceAmount / totalFaceAmount) * 100) : 0,
      pctPrem: totalAnnualizedPremium > 0 ? Math.round((val.premium / totalAnnualizedPremium) * 100) : 0,
    }));
  }, [policies, totalPolicies, totalFaceAmount, totalAnnualizedPremium]);

  // 4. Payment Frequency Spread
  const frequencyData = useMemo(() => {
    const freqs: Record<string, { count: number; totalCollected: number; color: string }> = {
      Monthly: { count: 0, totalCollected: 0, color: 'bg-blue-500' },
      Quarterly: { count: 0, totalCollected: 0, color: 'bg-emerald-500' },
      'Semi-Annual': { count: 0, totalCollected: 0, color: 'bg-amber-500' },
      Annual: { count: 0, totalCollected: 0, color: 'bg-indigo-600' },
    };

    policies.forEach((p) => {
      if (freqs[p.paymentFrequency]) {
        freqs[p.paymentFrequency].count += 1;
        let mult = 1;
        if (p.paymentFrequency === 'Monthly') mult = 12;
        else if (p.paymentFrequency === 'Quarterly') mult = 4;
        else if (p.paymentFrequency === 'Semi-Annual') mult = 2;
        freqs[p.paymentFrequency].totalCollected += p.premiumAmount * mult;
      }
    });

    return Object.entries(freqs).map(([name, val]) => ({
      frequency: name,
      ...val,
      percentage: Math.round((val.count / totalPolicies) * 100),
    }));
  }, [policies, totalPolicies]);

  // 5. Fund Value Breakdown
  const fundValueData = useMemo(() => {
    const clientsWithFund = clients
      .map((c) => {
        const clientPolicies = policies.filter((p) => p.clientId === c.id);
        const totalFund = clientPolicies.reduce((sum, p) => sum + (p.fundValue || 0), 0);
        return {
          clientName: `${c.firstName} ${c.lastName}`,
          email: c.email,
          totalFund,
          policyCount: clientPolicies.length,
          policies: clientPolicies.map((p) => p.productName).join(', '),
        };
      })
      .filter((c) => c.totalFund > 0)
      .sort((a, b) => b.totalFund - a.totalFund);

    const totalPortfolioFund = fundValueDataSum(clientsWithFund);
    return { clientsWithFund, totalPortfolioFund };
  }, [clients, policies]);

  function fundValueDataSum(arr: { totalFund: number }[]) {
    return arr.reduce((acc, curr) => acc + curr.totalFund, 0);
  }

  // 6. Client Demographics Cohort
  const demographicsData = useMemo(() => {
    const cohorts = [
      {
        range: '20-29 yrs',
        label: 'Early Career Professionals',
        clients: [] as Client[],
        focusProduct: 'iProtect 1, iProtect 5 (Pure Term & Affordability)',
        color: 'bg-teal-500',
      },
      {
        range: '30-39 yrs',
        label: 'Prime Wealth & Family Protectors',
        clients: [] as Client[],
        focusProduct: 'Abundance 20, Resilience CIE, Resilience Female Cancer',
        color: 'bg-blue-600',
      },
      {
        range: '40-49 yrs',
        label: 'Executive & Global Health Seekers',
        clients: [] as Client[],
        focusProduct: 'Inlife Global Care, Wealth Assure Plus',
        color: 'bg-amber-500',
      },
      {
        range: '50+ yrs',
        label: 'Estate Preservation & High Net Worth',
        clients: [] as Client[],
        focusProduct: 'Solid Fund Builder, Retire Assure',
        color: 'bg-indigo-600',
      },
    ];

    clients.forEach((c) => {
      if (!c.birthday) return;
      const birthYear = new Date(c.birthday).getFullYear();
      const age = 2026 - birthYear;
      if (age < 30) cohorts[0].clients.push(c);
      else if (age < 40) cohorts[1].clients.push(c);
      else if (age < 50) cohorts[2].clients.push(c);
      else cohorts[3].clients.push(c);
    });

    return cohorts;
  }, [clients]);

  // Graph options metadata
  const graphOptions: { id: GraphType; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'products-distribution',
      label: '1. InLife Products Portfolio Distribution (All 13 Plans)',
      icon: <Layers className="w-4 h-4 text-blue-600" />,
      desc: 'Count, premium, and sum assured across all 13 InLife products.',
    },
    {
      id: 'monthly-cashflow',
      label: '2. Monthly & Quarterly Premium Cash Flow Trends',
      icon: <Calendar className="w-4 h-4 text-emerald-600" />,
      desc: '12-month timeline tracking collected vs upcoming renewal premiums.',
    },
    {
      id: 'sum-assured',
      label: '3. Total Sum Assured & Protection Depth by Product',
      icon: <Shield className="w-4 h-4 text-amber-500" />,
      desc: 'Compare financial protection sum assured across product suites.',
    },
    {
      id: 'category-breakdown',
      label: '4. Category Asset & Health Coverage Mix',
      icon: <PieChart className="w-4 h-4 text-rose-500" />,
      desc: 'Health, VUL, Term, Retirement, and Global Medical portfolio shares.',
    },
    {
      id: 'payment-frequency',
      label: '5. Payment Frequency Spread & Billing Spread',
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      desc: 'Monthly, Quarterly, Semi-Annual, and Annual billing distribution.',
    },
    {
      id: 'fund-values',
      label: '6. VUL Fund Value Growth & Asset Allocation',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      desc: 'Fund value accumulation across active equity and balanced portfolios.',
    },
    {
      id: 'client-demographics',
      label: '7. Client Age Demographics & Segment Analysis',
      icon: <Users className="w-4 h-4 text-teal-600" />,
      desc: 'Client age cohorts and targeted InLife product recommendation alignment.',
    },
    {
      id: 'mdrt-pace',
      label: '8. MDRT Production Pacing & Qualification Run-Rate',
      icon: <Award className="w-4 h-4 text-amber-600" />,
      desc: 'Current ₱2.84M production vs ₱3.2M MDRT annual qualification pacing.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 lg:p-7 space-y-6">
      {/* Section Header with Graph Selector Dropdown */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="p-1.5 rounded-lg text-white shadow-xs inline-flex items-center justify-center"
              style={{ backgroundColor: brandColor }}
            >
              <BarChart3 className="w-4 h-4" />
            </span>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Interactive Analytics & Performance Graphs
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Select any graph from the dropdown below to explore real-time visual insights across all 13 InLife products, production inflow, and client segments.
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-84">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Choose Graph View:
            </label>
            <div className="relative">
              <select
                value={selectedGraph}
                onChange={(e) => setSelectedGraph(e.target.value as GraphType)}
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 appearance-none focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-xs transition-colors"
              >
                {graphOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* GRAPH 1: InLife Products Distribution */}
      {selectedGraph === 'products-distribution' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Controls: Metric Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-700">Display Metric:</span>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
              <button
                onClick={() => setProductMetric('count')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  productMetric === 'count'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Policy Count
              </button>
              <button
                onClick={() => setProductMetric('premium')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  productMetric === 'premium'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Annualized Premium (₱)
              </button>
              <button
                onClick={() => setProductMetric('sumAssured')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  productMetric === 'sumAssured'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sum Assured (₱)
              </button>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="space-y-3 pt-2">
            {productData.map((prod) => {
              const maxCount = Math.max(...productData.map((p) => p.count), 1);
              const maxPrem = Math.max(...productData.map((p) => p.totalAnnualPrem), 1);
              const maxFace = Math.max(...productData.map((p) => p.totalFace), 1);

              let pctWidth = 0;
              let displayVal = '';

              if (productMetric === 'count') {
                pctWidth = Math.round((prod.count / maxCount) * 100);
                displayVal = `${prod.count} ${prod.count === 1 ? 'policy' : 'policies'}`;
              } else if (productMetric === 'premium') {
                pctWidth = Math.round((prod.totalAnnualPrem / maxPrem) * 100);
                displayVal = `₱${prod.totalAnnualPrem.toLocaleString()}/yr`;
              } else {
                pctWidth = Math.round((prod.totalFace / maxFace) * 100);
                displayVal = prod.totalFace >= 1000000 ? `₱${(prod.totalFace / 1000000).toFixed(1)}M` : `₱${prod.totalFace.toLocaleString()}`;
              }

              // Color based on category
              const catColors: Record<string, string> = {
                'Term Life': 'bg-amber-500',
                'VUL & Investment': 'bg-blue-600',
                'Health & Critical Illness': 'bg-rose-500',
                Retirement: 'bg-indigo-600',
                'Global Medical': 'bg-emerald-600',
              };
              const barColor = catColors[prod.category] || 'bg-blue-600';

              return (
                <div
                  key={prod.name}
                  className="group p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">{prod.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold hidden sm:inline">
                        {prod.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-800 text-xs">{displayVal}</span>
                      <span className="text-[11px] text-slate-400 font-semibold w-10 text-right">
                        {totalPolicies > 0 ? `${Math.round((prod.count / totalPolicies) * 100)}%` : '0%'}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden flex items-center p-0.5">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-700 group-hover:brightness-110 shadow-2xs`}
                      style={{ width: `${Math.max(pctWidth, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Insights Callout */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-950">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold block text-blue-900 mb-0.5">
                Product Line Highlights:
              </span>
              <p className="text-[11px] text-blue-800/90 leading-relaxed">
                All 13 InLife products are actively integrated into your client records. Highest premium contributions originate from <strong>Inlife Global Care Worldwide</strong> (₱145k/yr) and <strong>Solid Fund Builder</strong> (₱250k single-pay), while term protection plans (iProtect 1, 5, 10) provide cost-effective entry points for younger policyholders.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GRAPH 2: Monthly Cash Flow */}
      {selectedGraph === 'monthly-cashflow' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Q1 Collections</span>
              <p className="text-base font-black text-slate-900 mt-1">₱81,500</p>
              <span className="text-[10px] text-emerald-600 font-bold">100% Settled</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Q2 Collections</span>
              <p className="text-base font-black text-slate-900 mt-1">₱401,500</p>
              <span className="text-[10px] text-emerald-600 font-bold">100% Settled (Solid Fund)</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Q3 Inflow (Current)</span>
              <p className="text-base font-black text-blue-950 mt-1">₱176,500</p>
              <span className="text-[10px] text-amber-600 font-bold">₱50k due in 4 days</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Q4 Projected Inflow</span>
              <p className="text-base font-black text-slate-900 mt-1">₱359,000</p>
              <span className="text-[10px] text-slate-500 font-semibold">Global Care renewals</span>
            </div>
          </div>

          {/* Visual Column / Bar Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
              <span className="font-bold">2026 Premium Inflow by Month</span>
              <span className="text-[11px]">Maximum Monthly Peak: ₱250,000 (April)</span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 items-end h-56 pt-6 pb-2">
              {monthlyCashflow.months.map((m) => {
                const heightPct = Math.round((m.premium / monthlyCashflow.maxVal) * 100);
                const isCurrent = m.name === 'Sep';
                return (
                  <div key={m.name} className="flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded shadow-lg whitespace-nowrap">
                      {m.name}: ₱{m.premium.toLocaleString()}
                      <span className="block font-normal text-[9px] text-slate-300">{m.status}</span>
                    </div>

                    <div className="w-full max-w-[32px] bg-slate-100 rounded-t-lg flex flex-col justify-end h-full overflow-hidden p-0.5">
                      <div
                        className={`w-full rounded-t-md transition-all duration-700 ${
                          isCurrent
                            ? 'bg-blue-600 ring-2 ring-blue-300'
                            : m.premium > 100000
                            ? 'bg-emerald-500'
                            : 'bg-slate-400 group-hover:bg-blue-500'
                        }`}
                        style={{ height: `${Math.max(heightPct, 8)}%` }}
                      />
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 ${
                        isCurrent ? 'text-blue-700 font-extrabold' : 'text-slate-600'
                      }`}
                    >
                      {m.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">₱{(m.premium / 1000).toFixed(0)}k</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>
                <strong>Upcoming Milestone:</strong> September 28 & 30 have ₱50,000 total due across Maria Santos & Juan Dela Cruz.
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              96.8% Persistency
            </span>
          </div>
        </div>
      )}

      {/* GRAPH 3: Sum Assured Protection */}
      {selectedGraph === 'sum-assured' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Protection Portfolio (Sum Assured)
              </span>
              <p className="text-3xl font-black text-white mt-1">
                ₱{(totalFaceAmount / 1000000).toFixed(1)} Million
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Guaranteed financial security delivered across 10 client families in Metro Manila.
              </p>
            </div>
            <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
              <div className="flex justify-between gap-4 text-slate-300">
                <span>Average Face Amount:</span>
                <strong className="text-white">₱{(totalFaceAmount / totalPolicies / 1000000).toFixed(1)}M</strong>
              </div>
              <div className="flex justify-between gap-4 text-slate-300">
                <span>Highest Policy Coverage:</span>
                <strong className="text-emerald-400">₱100M (Global Care)</strong>
              </div>
            </div>
          </div>

          {/* Sum Assured per product ranking */}
          <div className="space-y-3">
            {productData
              .filter((p) => p.totalFace > 0)
              .sort((a, b) => b.totalFace - a.totalFace)
              .map((prod) => {
                const pct = Math.round((prod.totalFace / totalFaceAmount) * 100);
                return (
                  <div key={prod.name} className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-extrabold text-slate-900">{prod.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          ₱{(prod.totalFace / 1000000).toFixed(1)}M
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* GRAPH 4: Category Breakdown */}
      {selectedGraph === 'category-breakdown' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {categoryData.map((cat) => (
              <div
                key={cat.name}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-900">{cat.name}</span>
                  <span className={`w-3 h-3 rounded-full ${cat.bg}`}></span>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Policies:</span>
                    <strong className="text-slate-900">{cat.count} ({cat.pctCount}%)</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Sum Assured:</span>
                    <strong className="text-slate-900">₱{(cat.faceAmount / 1000000).toFixed(1)}M</strong>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Annual Premium:</span>
                    <strong className="text-emerald-700 font-bold">₱{cat.premium.toLocaleString()}</strong>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${cat.bg}`} style={{ width: `${cat.pctCount}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRAPH 5: Payment Frequency */}
      {selectedGraph === 'payment-frequency' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {frequencyData.map((f) => (
              <div key={f.frequency} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{f.frequency} Mode</span>
                <p className="text-xl font-black text-slate-900 mt-1">{f.count} Policies</p>
                <span className="text-[11px] text-blue-700 font-bold">{f.percentage}% of portfolio</span>
                <p className="text-[11px] text-slate-500 mt-2 font-mono">
                  ₱{f.totalCollected.toLocaleString()}/yr
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Billing Predictability Insight:</strong>
              <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                Annual and Semi-Annual modes represent over 75% of your total collected premium. Annual payment modes yield the lowest lapse frequency (under 1.5%), directly boosting your 13-month persistency score to 96.8%.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* GRAPH 6: VUL Fund Values */}
      {selectedGraph === 'fund-values' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Total Active VUL Fund Values Under Management
              </span>
              <p className="text-3xl font-black text-white mt-1">
                ₱{(fundValueData.totalPortfolioFund / 1000000).toFixed(2)} Million
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Invested across InLife Growth Fund, Select Equity, Balanced, and Global Tech funds.
              </p>
            </div>
            <div className="bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px]">Average Fund Growth:</span>
              <span className="text-emerald-400 font-black text-base">+12.4% YTD</span>
            </div>
          </div>

          <div className="space-y-3">
            {fundValueData.clientsWithFund.map((c) => {
              const pct = Math.round((c.totalFund / fundValueData.totalPortfolioFund) * 100);
              return (
                <div key={c.email} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">{c.clientName}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{c.policies}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        ₱{c.totalFund.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {pct}% of AUM
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GRAPH 7: Client Demographics */}
      {selectedGraph === 'client-demographics' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {demographicsData.map((d) => (
              <div key={d.range} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-slate-900">{d.range}</span>
                    <p className="text-[11px] text-slate-500">{d.label}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                    {d.clients.length} {d.clients.length === 1 ? 'Client' : 'Clients'}
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 text-[11px] space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[9px] block">
                    Product Recommendation Fit:
                  </span>
                  <p className="text-slate-800 font-semibold">{d.focusProduct}</p>
                </div>

                <div className="text-[11px] text-slate-600">
                  <span className="font-bold text-slate-700">Members in Cohort: </span>
                  {d.clients.map((c) => `${c.firstName} ${c.lastName}`).join(', ') || 'None'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRAPH 8: MDRT Pacing */}
      {selectedGraph === 'mdrt-pace' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-sm uppercase tracking-wider text-amber-300">
                  MDRT 2026 Aspirant Pacing
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                88.8% of Target
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Current Production</span>
                <p className="text-2xl font-black text-white mt-0.5">₱2,840,000</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">MDRT Benchmark</span>
                <p className="text-2xl font-black text-slate-300 mt-0.5">₱3,200,000</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Remaining Gap</span>
                <p className="text-2xl font-black text-amber-400 mt-0.5">₱360,000</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 w-[88.8%] transition-all duration-700" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase">MDRT Tier 1</span>
              <p className="font-extrabold text-slate-900 mt-1">MDRT Member</p>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">₱3.2M Goal (9 weeks remaining)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase">MDRT Tier 2</span>
              <p className="font-extrabold text-slate-900 mt-1">Court of the Table (COT)</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">₱9.6M (3x MDRT)</p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-[10px] font-bold text-slate-400 uppercase">MDRT Tier 3</span>
              <p className="font-extrabold text-slate-900 mt-1">Top of the Table (TOT)</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">₱19.2M (6x MDRT)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
