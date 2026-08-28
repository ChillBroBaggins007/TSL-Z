export type Role =
  | 'chairman'
  | 'group_ceo'
  | 'group_cfo'
  | 'board_member'
  | 'subsidiary_md'
  | 'admin';

export type Committee = 'Audit' | 'Risk' | 'Remuneration/HR' | 'ESG';

export type RAGStatus = 'green' | 'amber' | 'red';

export type Currency = 'USD' | 'ZiG';

export type SubsidiaryId =
  | 'tsf'
  | 'bak-logistics'
  | 'key-logistics'
  | 'agricura'
  | 'tsl-trading'
  | 'tsl-properties'
  | 'premier-forklift'
  | 'dalston-farm'
  | 'sasana-tours';

export interface Person {
  id: string;
  name: string;
  role: Role;
  title: string;
  email: string;
  phone?: string;
  avatarUrl: string;
  subsidiaryId?: SubsidiaryId;
  committee?: Committee;
  bio?: string;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface Subsidiary {
  id: SubsidiaryId;
  name: string;
  shortName: string;
  segment: 'Tobacco & Agri-inputs' | 'Logistics' | 'Real Estate' | 'Services';
  mdId: string;
  ragStatus: RAGStatus;
  description: string;
  revenueUSD: number;
  revenueZiG: number;
  ebitdaUSD: number;
  netProfitUSD: number;
  yoyGrowth: number;
  headlineKpi: { label: string; value: string };
  trend: MonthlyPoint[];
  kpis: { label: string; value: string; sublabel?: string; trend?: number }[];
  team: { personId: string; role: string }[];
  activityFeed: { date: string; text: string; type: 'info' | 'success' | 'warning' }[];
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'dm';
  memberIds: string[];
  messages: Message[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  category: 'Board Meeting' | 'AGM' | 'Tobacco Season Milestone' | 'Subsidiary Review' | 'Dividend Date' | 'Personal';
  location?: string;
  description?: string;
  subsidiaryId?: SubsidiaryId;
}

export interface BoardDocument {
  id: string;
  title: string;
  type: 'Minutes' | 'Financial Statements' | 'Resolution' | 'Policy' | 'Report';
  date: string;
  pages: number;
  body: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'passed' | 'rejected';
  votes: { approve: number; reject: number; abstain: number };
  userVote?: 'approve' | 'reject' | 'abstain';
}

export interface ConservationProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  category: 'Conservation' | 'Community' | 'Education' | 'Environment';
  location: string;
}

export interface Escalation {
  id: string;
  fromSubsidiaryId: SubsidiaryId;
  fromPersonId: string;
  title: string;
  description: string;
  date: string;
  status: 'open' | 'acknowledged' | 'resolved';
  priority: 'high' | 'medium' | 'low';
}

export interface AuditLogEntry {
  id: string;
  personId: string;
  action: string;
  detail: string;
  timestamp: string;
}

export interface AskTheGroupQA {
  id: string;
  keywords: string[];
  question: string;
  answer: string;
}
