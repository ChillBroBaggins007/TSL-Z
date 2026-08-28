import { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { subsidiaries, groupRevenueUSD, groupEbitdaUSD, groupNetProfitUSD } from '@/data/mockData';
import { formatCurrency } from '@/services/api';
import { SectionHeader, RAGPill } from '@/components/ui';
import { Download, FileText, TrendingUp, BarChart3, Filter } from 'lucide-react';
import type { SubsidiaryId, Currency } from '@/types';

const SEGMENT_COLORS = ['#166534', '#0284c7', '#ca8a04', '#9333ea'];

export default function Reports() {
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const [selectedSub, setSelectedSub] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'ytd' | 'q1' | 'q2' | 'q3' | 'fy'>('ytd');
  const [toast, setToast] = useState(false);

  const filteredSubs = useMemo(() => {
    if (selectedSub === 'all') return subsidiaries;
    return subsidiaries.filter((s) => s.id === selectedSub);
  }, [selectedSub]);

  const totalRevenue = filteredSubs.reduce((s, x) => s + x.revenueUSD, 0);
  const totalEbitda = filteredSubs.reduce((s, x) => s + x.ebitdaUSD, 0);
  const totalProfit = filteredSubs.reduce((s, x) => s + x.netProfitUSD, 0);

  // Revenue by subsidiary bar chart data
  const revenueBySub = filteredSubs.map((s) => ({
    name: s.shortName,
    revenue: s.revenueUSD / 1_000_000,
    ebitda: s.ebitdaUSD / 1_000_000,
  profit: s.netProfitUSD / 1_000_000,
  rag: s.ragStatus,
  fill: s.ragStatus === 'green' ? '#16a34a' : s.ragStatus === 'amber' ? '#d97706' : '#dc2626',
  }));

  // Segment breakdown
  const segmentData = useMemo(() => {
    const segments: Record<string, number> = {};
    filteredSubs.forEach((s) => {
      segments[s.segment] = (segments[s.segment] || 0) + s.revenueUSD;
    });
    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, [filteredSubs]);

  // Margin analysis
  const marginData = filteredSubs.map((s) => ({
    name: s.shortName,
    margin: ((s.ebitdaUSD / s.revenueUSD) * 100).toFixed(1),
    revenue: s.revenueUSD / 1_000_000,
  }));

  // YoY growth
  const growthData = filteredSubs.map((s) => ({
    name: s.shortName,
    growth: s.yoyGrowth,
  }));

  // Monthly trend (group)
  const monthlyTrend = [
    { month: 'Jan', revenue: 4.2, ebitda: 1.0 },
    { month: 'Feb', revenue: 4.4, ebitda: 1.1 },
    { month: 'Mar', revenue: 4.6, ebitda: 1.2 },
    { month: 'Apr', revenue: 4.8, ebitda: 1.3 },
    { month: 'May', revenue: 5.0, ebitda: 1.4 },
    { month: 'Jun', revenue: 5.2, ebitda: 1.5 },
    { month: 'Jul', revenue: 5.5, ebitda: 1.6 },
    { month: 'Aug', revenue: 5.6, ebitda: 1.7 },
  ];

  const handleExport = (format: 'pdf' | 'excel') => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted mt-1">Financial and operational analytics across the group</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('pdf')} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Export PDF
          </button>
          <button onClick={() => handleExport('excel')} className="btn-ghost flex items-center gap-2 surface border">
            <FileText size={16} /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Subsidiary</label>
          <select
            value={selectedSub}
            onChange={(e) => setSelectedSub(e.target.value)}
            className="input text-sm"
          >
            <option value="all">All Subsidiaries</option>
            {subsidiaries.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
            className="input text-sm"
          >
            <option value="ytd">Year to Date</option>
            <option value="q1">Q1 2026</option>
            <option value="q2">Q2 2026</option>
            <option value="q3">Q3 2026</option>
            <option value="fy">Full Year</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted block mb-1">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="input text-sm"
          >
            <option value="USD">USD ($)</option>
            <option value="ZiG">ZiG</option>
          </select>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="text-xs text-muted uppercase">Total Revenue</div>
          <div className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue, currency)}</div>
          <div className="text-xs text-success mt-1">+7.8% YoY</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-muted uppercase">Total EBITDA</div>
          <div className="text-2xl font-bold mt-1">{formatCurrency(totalEbitda, currency)}</div>
          <div className="text-xs text-muted mt-1">{((totalEbitda / totalRevenue) * 100).toFixed(1)}% margin</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-muted uppercase">Net Profit</div>
          <div className="text-2xl font-bold mt-1">{formatCurrency(totalProfit, currency)}</div>
          <div className="text-xs text-muted mt-1">{((totalProfit / totalRevenue) * 100).toFixed(1)}% margin</div>
        </div>
        <div className="card p-4">
          <div className="text-xs text-muted uppercase">Subsidiaries</div>
          <div className="text-2xl font-bold mt-1">{filteredSubs.length}</div>
          <div className="text-xs text-muted mt-1">
            {filteredSubs.filter((s) => s.ragStatus === 'green').length} green,{' '}
            {filteredSubs.filter((s) => s.ragStatus === 'amber').length} amber,{' '}
            {filteredSubs.filter((s) => s.ragStatus === 'red').length} red
          </div>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue & EBITDA by subsidiary */}
        <div className="card p-5">
          <SectionHeader title="Revenue & EBITDA by Subsidiary" subtitle={`In ${currency === 'USD' ? 'USD millions' : 'ZiG millions'}`} />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueBySub} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="rgb(var(--color-text-muted))" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="rgb(var(--color-text-muted))" width={100} />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
                formatter={(v) => `${Number(v).toFixed(1)}M`}
              />
              <Bar dataKey="revenue" fill="#166534" radius={[0, 4, 4, 0]} />
              <Bar dataKey="ebitda" fill="#ca8a04" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Segment split */}
        <div className="card p-5">
          <SectionHeader title="Segment Revenue Split" subtitle="By business segment" />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={segmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${((entry.value / totalRevenue) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {segmentData.map((_, i) => (
                  <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
                formatter={(v) => formatCurrency(Number(v), currency)}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly trend */}
        <div className="card p-5">
          <SectionHeader title="Monthly Revenue & EBITDA Trend" subtitle="FY2026 YTD (USD millions)" />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#166534" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#166534" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ebitdaGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ca8a04" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ca8a04" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="rgb(var(--color-text-muted))" />
              <YAxis tick={{ fontSize: 11 }} stroke="rgb(var(--color-text-muted))" />
              <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#166534" strokeWidth={2} fill="url(#revGrad2)" />
              <Area type="monotone" dataKey="ebitda" stroke="#ca8a04" strokeWidth={2} fill="url(#ebitdaGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* YoY Growth */}
        <div className="card p-5">
          <SectionHeader title="Year-over-Year Growth" subtitle="By subsidiary (%)" />
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--color-border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="rgb(var(--color-text-muted))" angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} stroke="rgb(var(--color-text-muted))" />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
                formatter={(v) => `${Number(v) >= 0 ? '+' : ''}${Number(v)}%`}
              />
              <Bar dataKey="growth" radius={[4, 4, 0, 0]}>
                {growthData.map((entry, i) => (
                  <Cell key={i} fill={entry.growth >= 0 ? '#16a34a' : '#dc2626'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed table */}
      <div className="card overflow-hidden">
        <SectionHeader title="Subsidiary Performance Detail" subtitle="Full financial breakdown" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Subsidiary</th>
                <th className="text-left px-4 py-3 font-medium">Segment</th>
                <th className="text-right px-4 py-3 font-medium">Revenue</th>
                <th className="text-right px-4 py-3 font-medium">EBITDA</th>
                <th className="text-right px-4 py-3 font-medium">Net Profit</th>
                <th className="text-right px-4 py-3 font-medium">Margin</th>
                <th className="text-right px-4 py-3 font-medium">YoY</th>
                <th className="text-center px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubs.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3 font-medium">{s.shortName}</td>
                  <td className="px-4 py-3 text-muted">{s.segment}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(s.revenueUSD, currency)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(s.ebitdaUSD, currency)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(s.netProfitUSD, currency)}</td>
                  <td className="px-4 py-3 text-right">{((s.ebitdaUSD / s.revenueUSD) * 100).toFixed(1)}%</td>
                  <td className={`px-4 py-3 text-right font-semibold ${s.yoyGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                    {s.yoyGrowth >= 0 ? '+' : ''}{s.yoyGrowth}%
                  </td>
                  <td className="px-4 py-3 text-center"><RAGPill status={s.ragStatus} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="card shadow-xl px-4 py-3 flex items-center gap-2 border-l-4 border-l-success">
            <span className="text-sm font-medium">Report generated successfully</span>
          </div>
        </div>
      )}
    </div>
  );
}
