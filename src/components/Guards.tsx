import { useStore } from '@/store/useStore';
import type { Role, SubsidiaryId } from '@/types';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback }: RoleGuardProps) {
  const currentUser = useStore((s) => s.currentUser);
  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return <>{fallback || <AccessDenied />}</>;
  }
  return <>{children}</>;
}

export function SubsidiaryGuard({ subsidiaryId, children }: { subsidiaryId: SubsidiaryId; children: React.ReactNode }) {
  const currentUser = useStore((s) => s.currentUser);
  if (!currentUser) return <AccessDenied />;

  const isLeadership = ['chairman', 'group_ceo', 'group_cfo'].includes(currentUser.role);
  const isBoard = currentUser.role === 'board_member';
  const isAdmin = currentUser.role === 'admin';

  if (isLeadership || isBoard || isAdmin) return <>{children}</>;

  if (currentUser.role === 'subsidiary_md' && currentUser.subsidiaryId === subsidiaryId) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}

export function AccessDenied({ message }: { message?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4">
        <ShieldAlert size={32} className="text-error" />
      </div>
      <h2 className="text-xl font-bold mb-2">You don't have access to this workspace</h2>
      <p className="text-muted max-w-md mb-6">
        {message || 'Your current role does not grant access to this page. This access control is enforced live — try switching to a different demo account to see how navigation and content change.'}
      </p>
      <button onClick={() => navigate('/')} className="btn-primary">
        Return to your dashboard
      </button>
    </div>
  );
}
