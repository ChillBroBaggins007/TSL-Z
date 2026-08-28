import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { boardDocuments, resolutions, people } from '@/data/mockData';
import { RoleGuard } from '@/components/Guards';
import { SectionHeader, Modal, RAGPill } from '@/components/ui';
import Avatar from '@/components/Avatar';
import {
  FileText, Scale, Check, X, Minus, ThumbsUp, ThumbsDown, MinusCircle,
  Users, Building2, Shield, Leaf, AlertTriangle, Award, Calendar,
} from 'lucide-react';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip,
} from 'recharts';
import type { Committee } from '@/types';

export default function Governance() {
  const [activeTab, setActiveTab] = useState<'packs' | 'resolutions' | 'committees' | 'register'>('packs');

  return (
    <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'board_member']}>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Governance Suite</h1>
          <p className="text-muted mt-1">Board packs, resolutions, committee workspaces, and director register</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {[
            { id: 'packs', label: 'Board Pack Library', icon: <FileText size={16} /> },
            { id: 'resolutions', label: 'Active Resolutions', icon: <Scale size={16} /> },
            { id: 'committees', label: 'Committee Workspaces', icon: <Users size={16} /> },
            { id: 'register', label: 'Director Register', icon: <Building2 size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'packs' && <BoardPacks />}
        {activeTab === 'resolutions' && <Resolutions />}
        {activeTab === 'committees' && <Committees />}
        {activeTab === 'register' && <DirectorRegister />}
      </div>
    </RoleGuard>
  );
}

function BoardPacks() {
  const [selectedDoc, setSelectedDoc] = useState<typeof boardDocuments[0] | null>(null);

  return (
    <div>
      <SectionHeader title="Board Pack Library" subtitle="Seeded governance documents" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boardDocuments.map((doc) => (
          <button
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="card p-4 text-left hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                <FileText size={20} className="text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{doc.title}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                  <span className="badge bg-surface-2 text-muted">{doc.type}</span>
                  <span>{doc.pages} pages</span>
                </div>
                <div className="text-xs text-muted mt-1">{doc.date}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={selectedDoc?.title || ''} maxWidth="max-w-3xl">
        {selectedDoc && (
          <div>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <span className="badge bg-primary-soft text-primary">{selectedDoc.type}</span>
              <span className="text-sm text-muted">{selectedDoc.date}</span>
              <span className="text-sm text-muted">{selectedDoc.pages} pages</span>
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed">
              {selectedDoc.body.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-3 mb-1.5">{line.slice(3)}</h2>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm">{line.slice(2)}</li>;
                if (line.startsWith('|')) return <div key={i} className="font-mono text-xs my-0.5">{line}</div>;
                if (line.trim() === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm mb-2">{line}</p>;
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Resolutions() {
  const resolutionVotes = useStore((s) => s.resolutionVotes);
  const castVote = useStore((s) => s.castVote);

  return (
    <div>
      <SectionHeader title="Active Resolutions" subtitle="Cast your vote — tallies update live" />
      <div className="space-y-4">
        {resolutions.map((res) => {
          const userVote = resolutionVotes[res.id];
          const totalVotes = res.votes.approve + res.votes.reject + res.votes.abstain + (userVote ? 1 : 0);
          const adjustedVotes = {
            approve: res.votes.approve + (userVote === 'approve' ? 1 : 0),
            reject: res.votes.reject + (userVote === 'reject' ? 1 : 0),
            abstain: res.votes.abstain + (userVote === 'abstain' ? 1 : 0),
          };
          const chartData = [
            { name: 'Approve', votes: adjustedVotes.approve, fill: '#16a34a' },
            { name: 'Reject', votes: adjustedVotes.reject, fill: '#dc2626' },
            { name: 'Abstain', votes: adjustedVotes.abstain, fill: '#ca8a04' },
          ];

          return (
            <div key={res.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold">{res.title}</h3>
                  <span className="text-xs text-muted">{res.date}</span>
                </div>
                <span className={`badge ${
                  res.status === 'open' ? 'bg-warning/10 text-warning' :
                  res.status === 'passed' ? 'bg-success/10 text-success' :
                  'bg-error/10 text-error'
                }`}>
                  {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-muted mb-4">{res.description}</p>

              {userVote ? (
                <div className="flex items-center gap-2 mb-4 text-sm">
                  <Check size={16} className="text-success" />
                  <span>You voted: <strong className="capitalize">{userVote}</strong></span>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => castVote(res.id, 'approve')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors text-sm font-medium"
                  >
                    <ThumbsUp size={14} /> Approve
                  </button>
                  <button
                    onClick={() => castVote(res.id, 'reject')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors text-sm font-medium"
                  >
                    <ThumbsDown size={14} /> Reject
                  </button>
                  <button
                    onClick={() => castVote(res.id, 'abstain')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors text-sm font-medium"
                  >
                    <MinusCircle size={14} /> Abstain
                  </button>
                </div>
              )}

              <div>
                <div className="text-xs text-muted mb-2">Live Tally ({totalVotes} votes)</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="rgb(var(--color-text-muted))" width={60} />
                    <Tooltip contentStyle={{ background: 'rgb(var(--color-surface))', border: '1px solid rgb(var(--color-border))', borderRadius: '8px' }} />
                    <Bar dataKey="votes" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Committees() {
  const committees: { name: Committee; icon: React.ReactNode; color: string; kpis: { label: string; value: string; sublabel?: string }[]; notes: string }[] = [
    {
      name: 'Audit',
      icon: <Shield size={18} />,
      color: 'bg-blue-100 text-blue-700',
      kpis: [
        { label: 'Audit Findings (Open)', value: '3', sublabel: '2 low, 1 medium' },
        { label: 'FY2025 Opinion', value: 'Unqualified', sublabel: 'Kudzai & Partners' },
        { label: 'Management Accounts', value: 'Q2 2026', sublabel: 'Reviewed & current' },
      ],
      notes: 'Q2 management accounts reviewed. One query on Bak Logistics revenue recognition timing — documentation requested from Group CFO.',
    },
    {
      name: 'Risk',
      icon: <AlertTriangle size={18} />,
      color: 'bg-amber-100 text-amber-700',
      kpis: [
        { label: 'Top Risk', value: 'Forex Exposure', sublabel: '#1 on risk register' },
        { label: 'Risks (High)', value: '4', sublabel: '2 mitigated' },
        { label: 'Policy Compliance', value: '96%', sublabel: 'Group-wide' },
      ],
      notes: 'Q3 risk register updated. Forex exposure remains top risk. Premier Forklift parts supply chain risk elevated — new supplier agreement signed.',
    },
    {
      name: 'Remuneration/HR',
      icon: <Award size={18} />,
      color: 'bg-purple-100 text-purple-700',
      kpis: [
        { label: 'Staff Turnover', value: '8.2%', sublabel: 'Industry: 12%' },
        { label: 'Training Hours', value: '4,200', sublabel: 'FY2025' },
        { label: 'Exec Review', value: 'In Draft', sublabel: 'For committee discussion' },
      ],
      notes: 'Executive remuneration review draft prepared. Subsidiary MD performance metrics input requested from Group CEO.',
    },
    {
      name: 'ESG',
      icon: <Leaf size={18} />,
      color: 'bg-emerald-100 text-emerald-700',
      kpis: [
        { label: 'Carbon Emissions', value: '4,200 tCO2e', sublabel: 'Down 8% YoY' },
        { label: 'Safety Incidents', value: '3', sublabel: 'Down from 7' },
        { label: 'Active Projects', value: '6', sublabel: '4 on track' },
      ],
      notes: 'Conservation and community initiatives tracker live. Reforestation project at 68%. Site visit to Dalston Farm scheduled for 22 September.',
    },
  ];

  return (
    <div>
      <SectionHeader title="Committee Workspaces" subtitle="Audit, Risk, Remuneration/HR, ESG" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {committees.map((c) => {
          const members = people.filter((p) => p.committee === c.name || (c.name === 'Audit' && p.id === 'p-gcfo'));
          return (
            <div key={c.name} className="card p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.color}`}>
                  {c.icon}
                </div>
                <div>
                  <h3 className="font-bold">{c.name} Committee</h3>
                  <span className="text-xs text-muted">{members.length} members</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {c.kpis.map((kpi, i) => (
                  <div key={i} className="text-center p-2 rounded-lg bg-surface-2">
                    <div className="text-xs text-muted">{kpi.label}</div>
                    <div className="font-bold text-sm mt-0.5">{kpi.value}</div>
                    {kpi.sublabel && <div className="text-[10px] text-muted">{kpi.sublabel}</div>}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted mb-3">{c.notes}</p>
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <Avatar name={m.name} avatarUrl={m.avatarUrl} size={28} />
                    <div>
                      <div className="text-sm font-medium">{m.name}</div>
                      <div className="text-xs text-muted">{m.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DirectorRegister() {
  const directors = people.filter((p) => ['chairman', 'board_member'].includes(p.role));

  return (
    <div>
      <SectionHeader title="Director Register" subtitle="Board composition, tenure, and rotation status" />
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Director</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Committee</th>
                <th className="text-left px-4 py-3 font-medium">Tenure</th>
                <th className="text-left px-4 py-3 font-medium">Rotation</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((d) => {
                const tenureYears = d.id === 'p-chairman' ? 7 : d.id === 'p-bm2' ? 7 : d.id === 'p-bm1' || d.id === 'p-bm5' ? 5 : d.id === 'p-bm3' || d.id === 'p-md-dal' ? 6 : d.id === 'p-bm4' ? 4 : d.id === 'p-bm6' ? 3 : 5;
                const rotationStatus = tenureYears >= 6 ? 'Due 2027' : tenureYears >= 4 ? 'Due 2028' : 'Due 2029+';
                return (
                  <tr key={d.id} className="border-t border-border hover:bg-surface-2 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={d.name} avatarUrl={d.avatarUrl} size={32} />
                        <div>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted">{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{d.role === 'chairman' ? 'Chairman' : 'Non-Exec Director'}</td>
                    <td className="px-4 py-3 text-muted">{d.committee || '—'}</td>
                    <td className="px-4 py-3 text-muted">{tenureYears} years</td>
                    <td className="px-4 py-3 text-muted">{rotationStatus}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-success/10 text-success">Active</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
