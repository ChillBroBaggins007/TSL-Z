import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, Line as RLine,
} from 'recharts';
import { useStore } from '@/store/useStore';
import { api, formatCurrency } from '@/services/api';
import { subsidiaries, people, groupRevenueUSD, groupEbitdaUSD, groupNetProfitUSD, groupYoyGrowth } from '@/data/mockData';
import { RAGPill, KpiCard, SectionHeader, Modal } from '@/components/ui';
import Avatar from '@/components/Avatar';
import { EscalationsList } from '@/components/EscalationsList';
import {
  TrendingUp, TrendingDown, Send, Sparkles, ArrowRight,
  CheckCircle2, Circle, Clock, AlertCircle, ChevronRight,
} from 'lucide-react';

const SEGMENT_COLORS = ['#166534', '#0284c7', '#ca8a04', '#9333ea'];

export default function GroupOverview() {
  const currency = useStore((s) => s.currency);
  const currentUser = useStore((s) => s.currentUser);
  const navigate = useNavigate();
  const [askInput, setAskInput] = useState('');
  const [askAnswer, setAskAnswer] = useState<string | null>(null);
  const [askLoading, setAskLoading] = useState(false);
  const [showEscalations, setShowEscalations] = useState(false);

  const isLeadership = currentUser && ['chairman', 'group_ceo', 'group_cfo'].includes(currentUser.role);

  // Segment data
  const segmentData = useMemo(() => {
    const segments: Record<string, number> = {};
    subsidiaries.forEach((s) => {
      segments[s.segment] = (segments[s.segment] || 0) + s.revenueUSD;
    });
    return Object.entries(segments).map(([name, value]) => ({ name, value }));
  }, []);

  // Sparkline data for KPI header
  const groupTrend = [
    { month: 'Jan', value: 42.1 }, { month: 'Feb', value: 43.8 }, { month: 'Mar', value: 46.2 },
    { month: 'Apr', value: 47.9 }, { month: 'May', value: 50.1 }, { month: 'Jun', value: 52.3 },
    { month: 'Jul', value: 54.8 }, { month: 'Aug', value: 56.2 },
  ];

  const dividendHistory = [
    { year: '2021', amount: 0.48 }, { year: '2022', amount: 0.55 },
    { year: '2023', amount: 0.62 }, { year: '2024', amount: 0.72 },
    { year: '2025', amount: 0.90 }, { year: '2026', amount: 0.38 },
  ];

  const vfexStages = [
    { label: 'Board Approval', status: 'done', date: 'Jun 2026' },
    { label: 'Regulatory Filing', status: 'done', date: 'Aug 2026' },
    { label: 'Shareholder Notice', status: 'active', date: 'In Progress' },
    { label: 'EGM & Shareholder Vote', status: 'pending', date: 'Sep 2026' },
    { label: 'VFEX Listing', status: 'pending', date: 'Nov 2026' },
    { label: 'Complete', status: 'pending', date: 'Q4 2026' },
  ];

  const handleAsk = async () => {
    if (!askInput.trim()) return;
    setAskLoading(true);
    setAskAnswer(null);
    const answer = await api.askGroup(askInput);
    setTimeout(() => {
      setAskAnswer(answer);
      setAskLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Group Overview</h1>
        <p className="text-muted mt-1">Consolidated performance across all 9 subsidiaries — FY2026</p>
      </div>

      {/* KPI Header Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Group Revenue"
          value={formatCurrency(groupRevenueUSD, currency)}
          sublabel="FY2026 YTD"
          trend={groupYoyGrowth}
        />
        <KpiCard
          label="EBITDA"
          value={formatCurrency(groupEbitdaUSD, currency)}
          sublabel="23.4% margin"
          trend={10.9}
        />
        <KpiCard
          label="Net Profit"
          value={formatCurrency(groupNetProfitUSD, currency)}
          sublabel="14.4% margin"
          trend={15.5}
        />
        <KpiCard
          label="YoY Growth"
          value={`${groupYoyGrowth}%`}
          sublabel="vs FY2025"
          trend={groupYoyGrowth}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="card p-5 lg:col-span-2">
          <SectionHeader title="Revenue Trend" subtitle="Monthly consolidated revenue (USD millions)" />
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={groupTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#166534" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#166534" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
              <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Segment split */}
        <div className="card p-5">
          <SectionHeader title="Segment Split" subtitle="Revenue by segment" />
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={segmentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
              >
                {segmentData.map((_, i) => (
                  <Cell key={i} fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
                formatter={(v) => formatCurrency(Number(v), currency)}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {segmentData.map((seg, i) => (
              <div key={seg.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: SEGMENT_COLORS[i] }} />
                  <span>{seg.name}</span>
                </div>
                <span className="text-muted">{((seg.value / groupRevenueUSD) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ask the Group AI */}
      <div className="card p-5 border-l-4 border-l-primary">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={20} className="text-primary" />
          <h2 className="text-lg font-bold">Ask the Group</h2>
          <span className="badge bg-primary-soft text-primary">AI Assistant</span>
        </div>
        <p className="text-sm text-muted mb-3">Ask any question about the group's performance, subsidiaries, or strategy.</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            placeholder="e.g. Which subsidiary has the best margin?"
            className="input flex-1"
          />
          <button onClick={handleAsk} disabled={askLoading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            {askLoading ? <span className="animate-pulse-soft">Thinking...</span> : <><Send size={16} /> Ask</>}
          </button>
        </div>
        {askLoading && (
          <div className="mt-4 flex items-center gap-2 text-muted text-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
            <span className="animate-pulse-soft">Analyzing group data...</span>
          </div>
        )}
        {askAnswer && (
          <div className="mt-4 p-4 rounded-lg bg-surface-2 animate-fade-in">
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="text-primary mt-0.5 shrink-0" />
              <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                {askAnswer.split('\n').map((line, i) => (
                  <p key={i} className={line.startsWith('**') ? 'font-semibold mt-2 mb-1' : 'mb-1'}>
                    {line.replace(/\*\*/g, '')}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* Quick suggestions */}
        {!askAnswer && !askLoading && (
          <div className="flex flex-wrap gap-2 mt-3">
            {['Best margin subsidiary?', 'Tobacco season tracking?', 'Forex exposure?', 'VFEX status?'].map((q) => (
              <button
                key={q}
                onClick={() => { setAskInput(q); }}
                className="text-xs px-3 py-1.5 rounded-full bg-surface-2 hover:bg-primary-soft hover:text-primary transition-colors text-muted"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Subsidiary Cards Grid */}
      <div>
        <SectionHeader
          title="Subsidiaries"
          subtitle="9 companies across 4 segments"
          action={isLeadership && (
            <button onClick={() => setShowEscalations(true)} className="btn-ghost flex items-center gap-2 text-sm">
              <AlertCircle size={16} className="text-warning" />
              View Escalations
            </button>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subsidiaries.map((sub) => {
            const md = people.find((p) => p.id === sub.mdId);
            return (
              <div
                key={sub.id}
                className="card p-5 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate(`/subsidiary/${sub.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold">{sub.shortName}</h3>
                    <p className="text-xs text-muted">{sub.segment}</p>
                  </div>
                  <RAGPill status={sub.ragStatus} size="sm" />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {md && <Avatar name={md.name} avatarUrl={md.avatarUrl} size={24} />}
                  <span className="text-xs text-muted">{md?.name}</span>
                </div>
                <div className="mb-3">
                  <div className="text-lg font-bold">{formatCurrency(sub.revenueUSD, currency)}</div>
                  <div className="text-xs text-muted">{sub.headlineKpi.label}: {sub.headlineKpi.value}</div>
                </div>
                <ResponsiveContainer width="100%" height={40}>
                  <LineChart data={sub.trend}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={sub.ragStatus === 'green' ? '#16a34a' : sub.ragStatus === 'amber' ? '#d97706' : '#dc2626'}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs font-semibold ${sub.yoyGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                    {sub.yoyGrowth >= 0 ? '+' : ''}{sub.yoyGrowth}% YoY
                  </span>
                  <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Dashboard <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VFEX Migration + Dividend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* VFEX Migration Tracker */}
        <div className="card p-5">
          <SectionHeader title="ZSE → VFEX Migration" subtitle="Listing migration tracker" />
          <div className="space-y-1">
            {vfexStages.map((stage, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  {stage.status === 'done' ? (
                    <CheckCircle2 size={20} className="text-success" />
                  ) : stage.status === 'active' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <Circle size={20} className="text-muted" />
                  )}
                  {i < vfexStages.length - 1 && (
                    <div className={`w-0.5 h-8 ${stage.status === 'done' ? 'bg-success' : 'bg-border'}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className={`font-medium text-sm ${stage.status === 'pending' ? 'text-muted' : ''}`}>
                    {stage.label}
                  </div>
                  <div className="text-xs text-muted flex items-center gap-1">
                    {stage.status === 'active' && <Clock size={12} />}
                    {stage.date}
                  </div>
                  {stage.status === 'active' && (
                    <div className="text-xs text-primary mt-1">Currently in progress — shareholder notice period started 28 Aug 2026</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dividend Tracker */}
        <div className="card p-5">
          <SectionHeader title="Dividend Tracker" subtitle="Historical dividends (US cents/share)" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-muted">Last Declared</div>
              <div className="text-xl font-bold">0.38¢ / share</div>
              <div className="text-xs text-muted">Interim — Sep 2026</div>
            </div>
            <div>
              <div className="text-xs text-muted">Payment Date</div>
              <div className="text-xl font-bold">25 Sep 2026</div>
              <div className="text-xs text-muted">Record: 15 Sep</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dividendHistory}>
              <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
              <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
              <Tooltip
                contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
              />
              <Bar dataKey="amount" fill="#ca8a04" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Escalations Modal */}
      <Modal open={showEscalations} onClose={() => setShowEscalations(false)} title="Escalations from Subsidiaries" maxWidth="max-w-2xl">
        <EscalationsList />
      </Modal>
    </div>
  );
}
