import type {
  Person,
  Subsidiary,
  Notification,
  Channel,
  CalendarEvent,
  BoardDocument,
  Resolution,
  ConservationProject,
  Escalation,
  AuditLogEntry,
  AskTheGroupQA,
  Currency,
  SubsidiaryId,
} from '@/types';
import {
  people,
  subsidiaries,
  notifications,
  channels,
  calendarEvents,
  boardDocuments,
  resolutions,
  conservationProjects,
  escalations,
  auditLog,
  askTheGroupQA,
  groupRevenueUSD,
  groupEbitdaUSD,
  groupNetProfitUSD,
  groupYoyGrowth,
  FX_RATE,
} from '@/data/mockData';

// ── Service layer ────────────────────────────────────────────────────────────
// This is the single abstraction layer between the app and its data source.
// Today it reads from seeded mock data. Later, swap these function bodies
// for real API calls (fetch/Supabase) without touching any component code.

export const api = {
  // People / Auth
  async getPeople(): Promise<Person[]> {
    return people;
  },
  async getPerson(id: string): Promise<Person | undefined> {
    return people.find((p) => p.id === id);
  },
  async getPeopleByRole(role: Person['role']): Promise<Person[]> {
    return people.filter((p) => p.role === role);
  },

  // Subsidiaries
  async getSubsidiaries(): Promise<Subsidiary[]> {
    return subsidiaries;
  },
  async getSubsidiary(id: SubsidiaryId): Promise<Subsidiary | undefined> {
    return subsidiaries.find((s) => s.id === id);
  },

  // Group aggregates
  async getGroupFinancials() {
    return {
      revenueUSD: groupRevenueUSD,
      ebitdaUSD: groupEbitdaUSD,
      netProfitUSD: groupNetProfitUSD,
      yoyGrowth: groupYoyGrowth,
      fxRate: FX_RATE,
    };
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    return notifications;
  },

  // Messages
  async getChannels(): Promise<Channel[]> {
    return channels;
  },

  // Calendar
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    return calendarEvents;
  },

  // Governance
  async getBoardDocuments(): Promise<BoardDocument[]> {
    return boardDocuments;
  },
  async getResolutions(): Promise<Resolution[]> {
    return resolutions;
  },

  // ESG
  async getConservationProjects(): Promise<ConservationProject[]> {
    return conservationProjects;
  },

  // Escalations
  async getEscalations(): Promise<Escalation[]> {
    return escalations;
  },

  // Admin
  async getAuditLog(): Promise<AuditLogEntry[]> {
    return auditLog;
  },

  // Ask the Group AI
  async askGroup(question: string): Promise<string> {
    const lower = question.toLowerCase();
    for (const qa of askTheGroupQA) {
      if (qa.keywords.some((kw) => lower.includes(kw)) || lower.includes(qa.question.toLowerCase().slice(0, 15))) {
        return qa.answer;
      }
    }
    // Generic graceful fallback
    return `Based on the current group data, TSL Limited is performing **on plan** for FY2026. Consolidated revenue is **$${(groupRevenueUSD / 1_000_000).toFixed(1)}M** (up ${groupYoyGrowth}% YoY), with EBITDA at **$${(groupEbitdaUSD / 1_000_000).toFixed(1)}M** and net profit of **$${(groupNetProfitUSD / 1_000_000).toFixed(1)}M**.\n\nThe Tobacco & Agri-inputs segment leads at 50% of revenue, followed by Logistics at 31%. Seven of nine subsidiaries are tracking green or amber, with **Sasana Tours** the key area of focus (red status, turnaround in progress).\n\nFor more specific information, try asking about a particular subsidiary, the VFEX migration, dividends, or ESG performance.`;
  },
};

// ── Currency helpers ─────────────────────────────────────────────────────────
export function formatCurrency(usd: number, currency: Currency): string {
  if (currency === 'ZiG') {
    const zig = usd * FX_RATE;
    if (Math.abs(zig) >= 1_000_000) return `ZiG ${(zig / 1_000_000).toFixed(1)}M`;
    if (Math.abs(zig) >= 1_000) return `ZiG ${(zig / 1_000).toFixed(1)}K`;
    return `ZiG ${zig.toFixed(0)}`;
  }
  if (Math.abs(usd) >= 1_000_000) return `$${(usd / 1_000_000).toFixed(1)}M`;
  if (Math.abs(usd) >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`;
  return `$${usd.toFixed(0)}`;
}

export function formatCurrencyFull(usd: number, currency: Currency): string {
  if (currency === 'ZiG') {
    return `ZiG ${(usd * FX_RATE).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  }
  return `$${usd.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}
