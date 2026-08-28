import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useTheme } from '@/hooks/useTheme';
import LoginScreen from '@/pages/LoginScreen';
import AppShell from '@/components/AppShell';
import GroupOverview from '@/pages/GroupOverview';
import SubsidiaryDashboard from '@/pages/SubsidiaryDashboard';
import Governance from '@/pages/Governance';
import ESG from '@/pages/ESG';
import Messages from '@/pages/Messages';
import Calendar from '@/pages/Calendar';
import DailyBrief from '@/pages/DailyBrief';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import { RoleGuard } from '@/components/Guards';
import Avatar from '@/components/Avatar';
import { RAGPill } from '@/components/ui';
import { formatCurrency } from '@/services/api';
import { subsidiaries, people } from '@/data/mockData';
import { ArrowRight } from 'lucide-react';

function SubsidiariesList() {
  const navigate = useNavigate();
  const currency = useStore((s) => s.currency);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">All Subsidiaries</h1>
        <p className="text-muted mt-1">9 companies across 4 business segments</p>
      </div>
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
              <p className="text-sm text-muted mb-3 line-clamp-2">{sub.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold">{formatCurrency(sub.revenueUSD, currency)}</div>
                  <div className="text-xs text-muted">{sub.headlineKpi.value}</div>
                </div>
                <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  View <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AppRoutes() {
  const currentUser = useStore((s) => s.currentUser);
  useTheme();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    );
  }

  const isSubsidiaryMD = currentUser.role === 'subsidiary_md';
  const isAdmin = currentUser.role === 'admin';

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route
          path="/"
          element={
            isSubsidiaryMD ? (
              <Navigate to={`/subsidiary/${currentUser.subsidiaryId}`} replace />
            ) : isAdmin ? (
              <Navigate to="/settings" replace />
            ) : (
              <GroupOverview />
            )
          }
        />

        <Route
          path="/subsidiaries"
          element={
            <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'board_member']}>
              <SubsidiariesList />
            </RoleGuard>
          }
        />

        <Route path="/subsidiary/:id" element={<SubsidiaryDashboard />} />

        <Route
          path="/governance"
          element={
            <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'board_member']}>
              <Governance />
            </RoleGuard>
          }
        />

        <Route
          path="/esg"
          element={
            <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'board_member']}>
              <ESG />
            </RoleGuard>
          }
        />

        <Route path="/messages" element={<Messages />} />

        <Route path="/calendar" element={<Calendar />} />

        <Route path="/brief" element={<DailyBrief />} />

        <Route
          path="/reports"
          element={
            <RoleGuard allowedRoles={['chairman', 'group_ceo', 'group_cfo', 'subsidiary_md']}>
              <Reports />
            </RoleGuard>
          }
        />

        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
