import { useStore } from '@/store/useStore';
import { people } from '@/data/mockData';
import Avatar from '@/components/Avatar';
import type { Person } from '@/types';
import { Building2, Users, Shield, Settings, ChevronRight } from 'lucide-react';

export default function LoginScreen() {
  const login = useStore((s) => s.login);

  const leadership = people.filter((p) => ['chairman', 'group_ceo', 'group_cfo'].includes(p.role));
  const boardMembers = people.filter((p) => p.role === 'board_member');
  const subsidiaryMDs = people.filter((p) => p.role === 'subsidiary_md');
  const admin = people.filter((p) => p.role === 'admin');

  return (
    <div className="min-h-screen bg-bg flex flex-col lg:flex-row">
      {/* Left panel — branding */}
      <div className="lg:w-2/5 bg-sidebar text-sidebar-text p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgb(var(--color-primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgb(var(--color-accent)) 0%, transparent 50%)'
        }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">TSL OneGroup</div>
              <div className="text-xs text-sidebar-muted">Group Command Centre</div>
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Moving Value Chains<br />Since 1957
          </h1>
          <p className="text-sidebar-muted text-lg mb-8">— Now in Real Time.</p>

          <p className="text-sidebar-muted max-w-md leading-relaxed">
            A unified executive dashboard for TSL Limited's diversified portfolio —
            tobacco, logistics, agri-inputs, real estate, and services.
          </p>
        </div>

        <div className="relative z-10 mt-8 space-y-2 text-sm text-sidebar-muted">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>9 subsidiaries connected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>VFEX migration in progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-info" />
            <span>Demo environment — seeded data</span>
          </div>
        </div>
      </div>

      {/* Right panel — login selector */}
      <div className="lg:w-3/5 p-6 lg:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-1">Choose a demo account</h2>
          <p className="text-muted mb-8">One-click login — no password required. Each role shows different access and content.</p>

          {/* Group Leadership */}
          <LoginSection icon={<Shield size={18} />} title="Group Leadership" accounts={leadership} onLogin={login} />

          {/* Board Members */}
          <LoginSection icon={<Users size={18} />} title="Board Members" accounts={boardMembers} onLogin={login} />

          {/* Subsidiary MDs */}
          <LoginSection icon={<Building2 size={18} />} title="Subsidiary Managing Directors" accounts={subsidiaryMDs} onLogin={login} />

          {/* Admin */}
          <LoginSection icon={<Settings size={18} />} title="Administration" accounts={admin} onLogin={login} />
        </div>
      </div>
    </div>
  );
}

function LoginSection({ icon, title, accounts, onLogin }: {
  icon: React.ReactNode;
  title: string;
  accounts: Person[];
  onLogin: (p: Person) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3 text-muted">
        {icon}
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accounts.map((person) => (
          <button
            key={person.id}
            onClick={() => onLogin(person)}
            className="card p-4 flex items-center gap-3 text-left hover:border-primary hover:shadow-md transition-all group"
          >
            <Avatar name={person.name} avatarUrl={person.avatarUrl} size={44} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{person.name}</div>
              <div className="text-xs text-muted truncate">{person.title}</div>
            </div>
            <ChevronRight size={18} className="text-muted group-hover:text-primary transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
