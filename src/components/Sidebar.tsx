import { NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import Avatar from '@/components/Avatar';
import {
  LayoutDashboard,
  Building2,
  Scale,
  MessageSquare,
  Calendar,
  Sun,
  FileBarChart,
  Settings,
  LogOut,
  Leaf,
  Briefcase,
} from 'lucide-react';
import type { Person } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  show: boolean;
}

export default function Sidebar() {
  const currentUser = useStore((s) => s.currentUser);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  if (!currentUser) return null;

  const isLeadership = ['chairman', 'group_ceo', 'group_cfo'].includes(currentUser.role);
  const isBoard = currentUser.role === 'board_member';
  const isAdmin = currentUser.role === 'admin';
  const isSubsidiaryMD = currentUser.role === 'subsidiary_md';

  const navItems: NavItem[] = [
    {
      to: '/',
      label: isSubsidiaryMD ? 'My Dashboard' : 'Group Overview',
      icon: <LayoutDashboard size={19} />,
      show: !isAdmin,
    },
    {
      to: '/subsidiaries',
      label: 'Subsidiaries',
      icon: <Building2 size={19} />,
      show: isLeadership || isBoard,
    },
    {
      to: `/subsidiary/${currentUser.subsidiaryId}`,
      label: 'My Subsidiary',
      icon: <Building2 size={19} />,
      show: isSubsidiaryMD,
    },
    {
      to: '/governance',
      label: 'Governance',
      icon: <Scale size={19} />,
      show: isLeadership || isBoard,
    },
    {
      to: '/esg',
      label: 'ESG & Sustainability',
      icon: <Leaf size={19} />,
      show: isLeadership || isBoard,
    },
    {
      to: '/messages',
      label: 'Messages',
      icon: <MessageSquare size={19} />,
      show: !isAdmin,
    },
    {
      to: '/calendar',
      label: 'Calendar',
      icon: <Calendar size={19} />,
      show: !isAdmin,
    },
    {
      to: '/brief',
      label: 'Daily Brief',
      icon: <Sun size={19} />,
      show: !isAdmin,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: <FileBarChart size={19} />,
      show: isLeadership || isSubsidiaryMD,
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: <Settings size={19} />,
      show: true,
    },
  ];

  const visibleItems = navItems.filter((item) => item.show);

  return (
    <aside className="w-64 bg-sidebar text-sidebar-text flex flex-col h-screen sticky top-0 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm tracking-tight truncate">TSL OneGroup</div>
            <div className="text-[10px] text-sidebar-muted">Group Command Centre</div>
          </div>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-white/5">
          <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size={32} />
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{currentUser.name}</div>
            <div className="text-[10px] text-sidebar-muted truncate">{currentUser.title}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-white font-medium'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Demo controls */}
      <div className="px-3 py-3 border-t border-white/5 space-y-1">
        {isAdmin && (
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-sidebar-muted">
            <Briefcase size={14} />
            <span>Admin Mode</span>
          </div>
        )}
        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-muted hover:text-accent hover:bg-white/5 transition-colors"
        >
          <LogOut size={19} />
          <span>Switch demo account</span>
        </button>
      </div>
    </aside>
  );
}
