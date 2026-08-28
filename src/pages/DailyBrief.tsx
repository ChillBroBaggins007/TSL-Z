import { useStore } from '@/store/useStore';
import { subsidiaries, people } from '@/data/mockData';
import { formatCurrency } from '@/services/api';
import { Sun, Target, TrendingUp, AlertCircle, CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BriefData {
  greeting: string;
  priorities: { title: string; detail: string; priority: 'high' | 'medium' | 'low' }[];
  weekGoals: { title: string; progress: number }[];
  monthTargets: { metric: string; target: string; actual: string; onTrack: boolean }[];
  yearGoals: { title: string; progress: number }[];
  aiFlags: { title: string; detail: string; severity: 'info' | 'warning' | 'success' }[];
}

export default function DailyBrief() {
  const currentUser = useStore((s) => s.currentUser);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const firstName = currentUser.name.split(' ')[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const brief: BriefData = getBriefForRole(currentUser.role, currentUser.id, firstName);

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center">
          <Sun size={24} className="text-accent" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">{greeting}, {firstName}</h1>
          <p className="text-muted">Thursday, 28 August 2026 — here's your daily brief</p>
        </div>
      </div>

      {/* Today's Priorities */}
      <div className="card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target size={20} className="text-primary" />
          Today's Priorities
        </h2>
        <div className="space-y-2">
          {brief.priorities.map((p, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                p.priority === 'high' ? 'bg-error' : p.priority === 'medium' ? 'bg-warning' : 'bg-info'
              }`} />
              <div>
                <div className="font-medium text-sm">{p.title}</div>
                <div className="text-xs text-muted">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Week's Goals */}
      <div className="card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary" />
          This Week's Goals
        </h2>
        <div className="space-y-4">
          {brief.weekGoals.map((g, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>{g.title}</span>
                <span className="font-semibold text-muted">{g.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${g.progress >= 75 ? 'bg-success' : g.progress >= 50 ? 'bg-primary' : 'bg-warning'}`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* This Month's Targets vs Actual */}
      <div className="card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          This Month's Targets vs Actual
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted">
              <tr>
                <th className="text-left py-2 font-medium">Metric</th>
                <th className="text-right py-2 font-medium">Target</th>
                <th className="text-right py-2 font-medium">Actual</th>
                <th className="text-right py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {brief.monthTargets.map((t, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-2.5">{t.metric}</td>
                  <td className="py-2.5 text-right text-muted">{t.target}</td>
                  <td className="py-2.5 text-right font-medium">{t.actual}</td>
                  <td className="py-2.5 text-right">
                    {t.onTrack ? (
                      <span className="badge bg-success/10 text-success"><CheckCircle2 size={12} /> On Track</span>
                    ) : (
                      <span className="badge bg-warning/10 text-warning"><AlertCircle size={12} /> Behind</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* This Year's Strategic Goals */}
      <div className="card p-5">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Target size={20} className="text-primary" />
          This Year's Strategic Goals
        </h2>
        <div className="space-y-4">
          {brief.yearGoals.map((g, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span>{g.title}</span>
                <span className="font-semibold text-muted">{g.progress}% complete</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${g.progress >= 75 ? 'bg-success' : g.progress >= 50 ? 'bg-primary' : 'bg-warning'}`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Flagged Items */}
      <div className="card p-5 border-l-4 border-l-accent">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <AlertCircle size={20} className="text-accent" />
          Top 3 AI-Flagged Items
        </h2>
        <div className="space-y-3">
          {brief.aiFlags.map((flag, i) => (
            <div key={i} className={`p-3 rounded-lg ${
              flag.severity === 'warning' ? 'bg-warning/10' :
              flag.severity === 'success' ? 'bg-success/10' : 'bg-info/10'
            }`}>
              <div className="flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  flag.severity === 'warning' ? 'bg-warning' :
                  flag.severity === 'success' ? 'bg-success' : 'bg-info'
                }`} />
                <div>
                  <div className="font-medium text-sm">{flag.title}</div>
                  <div className="text-xs text-muted mt-0.5">{flag.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getBriefForRole(role: string, personId: string, firstName: string): BriefData {
  if (role === 'chairman') {
    return {
      greeting: firstName,
      priorities: [
        { title: 'Review VFEX migration status', detail: 'Shareholder notice period begins today — ensure investor briefing is circulated', priority: 'high' },
        { title: 'Prepare for September Board Meeting', detail: '18 September — review agenda and board pack', priority: 'high' },
        { title: 'Sasana Tours turnaround discussion', detail: 'Strategy session scheduled for 10 September', priority: 'medium' },
        { title: 'Sign off on interim dividend resolution', detail: 'R-2026-04 awaiting board vote', priority: 'high' },
      ],
      weekGoals: [
        { title: 'Circulate VFEX investor briefing to shareholders', progress: 80 },
        { title: 'Finalize September board meeting agenda', progress: 60 },
        { title: 'Review Sasana turnaround proposal', progress: 40 },
      ],
      monthTargets: [
        { metric: 'Board resolutions processed', target: '4', actual: '3', onTrack: true },
        { metric: 'Governance documents reviewed', target: '6', actual: '5', onTrack: true },
        { metric: 'Committee meetings attended', target: '2', actual: '1', onTrack: true },
      ],
      yearGoals: [
        { title: 'Complete VFEX migration', progress: 50 },
        { title: 'Board diversity target (50% female)', progress: 86 },
        { title: 'Group revenue growth target (+8%)', progress: 75 },
        { title: 'ESG scorecard improvement', progress: 80 },
      ],
      aiFlags: [
        { title: 'Sasana Tours at risk', detail: 'Q3 occupancy at 61%, net profit negative. Turnaround budget resolution is split 2-2-1 — your vote may be decisive.', severity: 'warning' },
        { title: 'VFEX migration on schedule', detail: 'Regulatory filing complete. Shareholder notice starts today. Listing targeted for November 2026.', severity: 'success' },
        { title: 'Dividend resolution ready', detail: 'R-2026-04 (interim dividend 0.38¢/share) has 4 approvals. Consider encouraging remaining directors to vote.', severity: 'info' },
      ],
    };
  }

  if (role === 'group_ceo') {
    return {
      greeting: firstName,
      priorities: [
        { title: 'VFEX shareholder notice circulation', detail: 'Coordinate with CFO on investor briefing pack distribution', priority: 'high' },
        { title: 'Sasana Tours strategy session prep', detail: '10 September — prepare turnaround framework', priority: 'high' },
        { title: 'Bak Logistics fleet review', detail: 'Follow up on maintenance bottleneck — 6 trucks off road', priority: 'medium' },
        { title: 'Subsidiary MD performance reviews', detail: 'Quarterly reviews due this month', priority: 'medium' },
      ],
      weekGoals: [
        { title: 'Distribute VFEX investor briefing', progress: 90 },
        { title: 'Prepare Sasana turnaround strategy document', progress: 55 },
        { title: 'Complete 3 subsidiary MD check-ins', progress: 67 },
      ],
      monthTargets: [
        { metric: 'Subsidiary reviews completed', target: '9', actual: '6', onTrack: true },
        { metric: 'Escalations resolved', target: '3', actual: '2', onTrack: true },
        { metric: 'Group revenue vs target', target: '$5.0M', actual: '$4.8M', onTrack: true },
      ],
      yearGoals: [
        { title: 'Group revenue $60M target', progress: 93 },
        { title: 'VFEX listing completion', progress: 50 },
        { title: 'Sasana turnaround', progress: 30 },
        { title: 'Operational efficiency +10%', progress: 70 },
      ],
      aiFlags: [
        { title: 'Bak Logistics utilisation dropping', detail: 'Fleet utilisation at 78% vs 85% target. 6 trucks in maintenance — 4 expected back next week.', severity: 'warning' },
        { title: 'TSF season tracking well', detail: '58.2M kg sold (97% of target) at $2.89/kg. Should hit 60M kg target by next week.', severity: 'success' },
        { title: 'Sasana Tours needs attention', detail: 'Negative net profit for Q3. Two corporate cancellations. Turnaround session scheduled.', severity: 'warning' },
      ],
    };
  }

  if (role === 'group_cfo') {
    return {
      greeting: firstName,
      priorities: [
        { title: 'Finalize VFEX investor briefing pack', detail: 'Financial data and listing timeline for shareholder notice', priority: 'high' },
        { title: 'Q2 management accounts for Audit Committee', detail: 'Bak Logistics revenue recognition documentation requested', priority: 'high' },
        { title: 'Interim dividend processing', detail: 'Coordinate payment logistics for 25 September', priority: 'medium' },
        { title: 'Group cash flow review', detail: 'Monthly treasury review', priority: 'medium' },
      ],
      weekGoals: [
        { title: 'Complete VFEX investor briefing financials', progress: 85 },
        { title: 'Prepare Bak Logistics revenue documentation', progress: 70 },
        { title: 'Group cash position review', progress: 100 },
      ],
      monthTargets: [
        { metric: 'Group EBITDA margin', target: '23%', actual: '23.4%', onTrack: true },
        { metric: 'Net cash position', target: '$4.0M', actual: '$4.2M', onTrack: true },
        { metric: 'Audit queries resolved', target: '5', actual: '4', onTrack: true },
      ],
      yearGoals: [
        { title: 'VFEX listing financial preparation', progress: 65 },
        { title: 'Group EBITDA margin 24%', progress: 97 },
        { title: 'Net profit $9M target', progress: 96 },
        { title: 'Forex hedging policy review', progress: 80 },
      ],
      aiFlags: [
        { title: 'Forex exposure at policy threshold', detail: '35% of revenue USD-denominated, policy limit is 40%. VFEX listing will reduce translation risk.', severity: 'warning' },
        { title: 'Audit documentation due', detail: 'Bak Logistics revenue recognition timing query from Audit Committee chair — documentation requested.', severity: 'info' },
        { title: 'Dividend cover healthy', detail: 'Interim dividend of 0.38¢/share well covered by H1 earnings. Net cash position $4.2M.', severity: 'success' },
      ],
    };
  }

  if (role === 'board_member') {
    const person = people.find((p) => p.id === personId);
    const committee = person?.committee || 'Audit';
    return {
      greeting: firstName,
      priorities: [
        { title: `Review ${committee} Committee materials`, detail: 'Committee meeting upcoming — review findings and notes', priority: 'high' },
        { title: 'Vote on open resolutions', detail: '3 resolutions awaiting your vote in the Governance Suite', priority: 'high' },
        { title: 'Review September board pack', detail: 'Board meeting on 18 September — pack available in Governance Suite', priority: 'medium' },
      ],
      weekGoals: [
        { title: 'Complete resolution reviews', progress: 33 },
        { title: 'Review board pack documents', progress: 50 },
        { title: 'Committee-specific review', progress: 60 },
      ],
      monthTargets: [
        { metric: 'Resolutions voted on', target: '3', actual: '0', onTrack: false },
        { metric: 'Board pack documents reviewed', target: '6', actual: '3', onTrack: true },
        { metric: 'Committee meetings attended', target: '1', actual: '0', onTrack: true },
      ],
      yearGoals: [
        { title: 'Board meeting attendance', progress: 100 },
        { title: 'Committee participation', progress: 85 },
        { title: 'Governance policy review', progress: 70 },
      ],
      aiFlags: [
        { title: 'Resolutions need your vote', detail: '3 open resolutions in the Governance Suite. The Sasana turnaround budget vote is split 2-2-1 — your vote matters.', severity: 'warning' },
        { title: 'Board pack available', detail: 'September board meeting pack has been uploaded. Review ahead of 18 September meeting.', severity: 'info' },
        { title: `${committee} committee active`, detail: `Your ${committee} Committee has recent activity and notes to review.`, severity: 'info' },
      ],
    };
  }

  if (role === 'subsidiary_md') {
    const person = people.find((p) => p.id === personId);
    const sub = subsidiaries.find((s) => s.id === person?.subsidiaryId);
    return {
      greeting: firstName,
      priorities: [
        { title: `${sub?.shortName} weekly performance review`, detail: 'Check KPIs against targets and address any amber/red items', priority: 'high' },
        { title: 'Submit weekly report to Group CEO', detail: 'Due Friday — include key metrics and any escalations', priority: 'high' },
        { title: 'Team check-in', detail: 'Review team activity and address any operational issues', priority: 'medium' },
      ],
      weekGoals: [
        { title: 'Meet weekly operational targets', progress: 75 },
        { title: 'Complete team check-ins', progress: 60 },
        { title: 'Submit weekly report', progress: 40 },
      ],
      monthTargets: [
        { metric: 'Revenue vs target', target: formatCurrency((sub?.revenueUSD || 0) / 12, 'USD'), actual: formatCurrency((sub?.revenueUSD || 0) / 11, 'USD'), onTrack: true },
        { metric: 'Operational KPIs', target: '85%', actual: sub?.ragStatus === 'green' ? '92%' : sub?.ragStatus === 'amber' ? '78%' : '61%', onTrack: sub?.ragStatus === 'green' },
        { metric: 'Team productivity', target: '90%', actual: '88%', onTrack: true },
      ],
      yearGoals: [
        { title: `${sub?.shortName} annual revenue target`, progress: sub ? Math.round((sub.revenueUSD / (sub.revenueUSD * 1.1)) * 100) : 70 },
        { title: 'Operational efficiency improvement', progress: 65 },
        { title: 'Team development goals', progress: 70 },
      ],
      aiFlags: [
        { title: sub?.ragStatus === 'red' ? 'Performance below target' : sub?.ragStatus === 'amber' ? 'Watch items flagged' : 'Performance on track', detail: sub?.ragStatus === 'red' ? 'Your subsidiary is flagged red. Consider escalating specific challenges to Group leadership.' : sub?.ragStatus === 'amber' ? 'Some KPIs are below target. Monitor closely this week.' : 'Your subsidiary is tracking green. Keep up the momentum.', severity: sub?.ragStatus === 'red' ? 'warning' : sub?.ragStatus === 'amber' ? 'warning' : 'success' },
        { title: 'Weekly report due Friday', detail: 'Your weekly performance report to the Group CEO is due this Friday.', severity: 'info' },
        { title: 'Group review scheduled', detail: 'A subsidiary review meeting is on the calendar. Prepare your performance summary.', severity: 'info' },
      ],
    };
  }

  // Admin
  return {
    greeting: firstName,
    priorities: [
      { title: 'Review user access requests', detail: 'Check for any pending access changes', priority: 'medium' },
      { title: 'Audit log review', detail: 'Review recent login and view activity', priority: 'medium' },
      { title: 'Board pack distribution', detail: 'Ensure September board pack is circulated', priority: 'high' },
    ],
    weekGoals: [
      { title: 'Complete user access audit', progress: 80 },
      { title: 'Distribute board pack', progress: 100 },
      { title: 'Update compliance register', progress: 50 },
    ],
    monthTargets: [
      { metric: 'User accounts managed', target: '16', actual: '16', onTrack: true },
      { metric: 'Audit entries logged', target: '50', actual: '12', onTrack: true },
      { metric: 'Board packs distributed', target: '2', actual: '1', onTrack: true },
    ],
    yearGoals: [
      { title: 'Governance compliance 100%', progress: 95 },
      { title: 'User management system updates', progress: 80 },
      { title: 'Audit trail completeness', progress: 90 },
    ],
    aiFlags: [
      { title: 'Board pack distributed', detail: 'September board meeting pack has been uploaded and is ready for director access.', severity: 'success' },
      { title: 'User access review due', detail: 'Quarterly user access review is due next week. All 16 accounts need status verification.', severity: 'info' },
      { title: 'Audit log active', detail: '12 audit entries logged this month. All access is within policy.', severity: 'success' },
    ],
  };
}
