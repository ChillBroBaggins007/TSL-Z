import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  BarChart, Bar,
} from 'recharts';
import { subsidiaries, people } from '@/data/mockData';
import { useStore } from '@/store/useStore';
import { api, formatCurrency } from '@/services/api';
import { SubsidiaryGuard } from '@/components/Guards';
import { RAGPill, KpiCard, SectionHeader, Modal } from '@/components/ui';
import Avatar from '@/components/Avatar';
import {
  ArrowLeft, AlertCircle, TrendingUp, TrendingDown, Activity, Send,
} from 'lucide-react';
import type { Escalation } from '@/types';

export default function SubsidiaryDashboard() {
  const { id } = useParams<{ id: string }>();
  const currency = useStore((s) => s.currency);
  const currentUser = useStore((s) => s.currentUser);
  const addEscalation = useStore((s) => s.addEscalation);
  const navigate = useNavigate();
  const [showEscalate, setShowEscalate] = useState(false);
  const [escalateTitle, setEscalateTitle] = useState('');
  const [escalateDesc, setEscalateDesc] = useState('');
  const [toast, setToast] = useState(false);

  const subsidiary = subsidiaries.find((s) => s.id === id);

  if (!subsidiary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold">Subsidiary not found</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">Return to dashboard</button>
      </div>
    );
  }

  const md = people.find((p) => p.id === subsidiary.mdId);

  const handleEscalate = () => {
    if (!escalateTitle.trim() || !currentUser) return;
    const escalation: Escalation = {
      id: `es-custom-${Date.now()}`,
      fromSubsidiaryId: subsidiary.id,
      fromPersonId: currentUser.id,
      title: escalateTitle,
      description: escalateDesc || escalateTitle,
      date: new Date().toISOString().slice(0, 10),
      status: 'open',
      priority: 'medium',
    };
    addEscalation(escalation);
    setEscalateTitle('');
    setEscalateDesc('');
    setShowEscalate(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <SubsidiaryGuard subsidiaryId={subsidiary.id}>
      <div className="space-y-6 animate-fade-in">
        {/* Back button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
              <span className="text-primary font-bold text-xl">{subsidiary.shortName.slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl lg:text-3xl font-bold">{subsidiary.name}</h1>
                <RAGPill status={subsidiary.ragStatus} />
              </div>
              <p className="text-muted mt-1">{subsidiary.description}</p>
              <div className="flex items-center gap-2 mt-2">
                {md && <Avatar name={md.name} avatarUrl={md.avatarUrl} size={24} />}
                <span className="text-sm text-muted">{md?.name} — {md?.title}</span>
              </div>
            </div>
          </div>
          {currentUser?.role === 'subsidiary_md' && currentUser.subsidiaryId === subsidiary.id && (
            <button onClick={() => setShowEscalate(true)} className="btn-primary flex items-center gap-2">
              <AlertCircle size={16} /> Escalate to Group
            </button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {subsidiary.kpis.map((kpi, i) => (
            <KpiCard
              key={i}
              label={kpi.label}
              value={kpi.value}
              sublabel={kpi.sublabel}
              trend={kpi.trend}
            />
          ))}
        </div>

        {/* Revenue + Financials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2">
            <SectionHeader
              title="Revenue / Volume Trend"
              subtitle="12-month performance"
            />
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={subsidiary.trend}>
                <defs>
                  <linearGradient id={`grad-${subsidiary.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#166534" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <YAxis tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                <Tooltip
                  contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="value" stroke="#166534" strokeWidth={2} fill={`url(#grad-${subsidiary.id})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <SectionHeader title="Financial Summary" />
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">Revenue</span>
                <span className="font-bold">{formatCurrency(subsidiary.revenueUSD, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">EBITDA</span>
                <span className="font-bold">{formatCurrency(subsidiary.ebitdaUSD, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">Net Profit</span>
                <span className="font-bold">{formatCurrency(subsidiary.netProfitUSD, currency)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-sm text-muted">YoY Growth</span>
                <span className={`font-bold flex items-center gap-1 ${subsidiary.yoyGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                  {subsidiary.yoyGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {subsidiary.yoyGrowth >= 0 ? '+' : ''}{subsidiary.yoyGrowth}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted">EBITDA Margin</span>
                <span className="font-bold">{((subsidiary.ebitdaUSD / subsidiary.revenueUSD) * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <SectionHeader title="Team & Roster" />
            <div className="space-y-3">
              {subsidiary.team.map((member, i) => {
                const person = people.find((p) => p.id === member.personId);
                if (!person) return null;
                return (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                    <Avatar name={person.name} avatarUrl={person.avatarUrl} size={40} />
                    <div>
                      <div className="font-medium text-sm">{person.name}</div>
                      <div className="text-xs text-muted">{member.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card p-5">
            <SectionHeader title="Recent Activity" />
            <div className="space-y-3">
              {subsidiary.activityFeed.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'success' ? 'bg-success/10 text-success' :
                    activity.type === 'warning' ? 'bg-warning/10 text-warning' :
                    'bg-info/10 text-info'
                  }`}>
                    <Activity size={14} />
                  </div>
                  <div>
                    <div className="text-sm">{activity.text}</div>
                    <div className="text-xs text-muted mt-0.5">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Escalate Modal */}
        <Modal open={showEscalate} onClose={() => setShowEscalate(false)} title={`Escalate to Group — ${subsidiary.shortName}`}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Title</label>
              <input
                type="text"
                value={escalateTitle}
                onChange={(e) => setEscalateTitle(e.target.value)}
                placeholder="Brief title for the escalation"
                className="input w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Description</label>
              <textarea
                value={escalateDesc}
                onChange={(e) => setEscalateDesc(e.target.value)}
                placeholder="Describe the issue or request..."
                rows={4}
                className="input w-full resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEscalate(false)} className="btn-ghost">Cancel</button>
              <button onClick={handleEscalate} disabled={!escalateTitle.trim()} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Send size={16} /> Submit Escalation
              </button>
            </div>
          </div>
        </Modal>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
            <div className="card shadow-xl px-4 py-3 flex items-center gap-2 border-l-4 border-l-success">
              <span className="text-sm font-medium">Escalation submitted to Group leadership</span>
            </div>
          </div>
        )}
      </div>
    </SubsidiaryGuard>
  );
}
