import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { people, auditLog } from '@/data/mockData';
import Avatar from '@/components/Avatar';
import { SectionHeader, Toast } from '@/components/ui';
import { RoleGuard } from '@/components/Guards';
import {
  User, Bell, Palette, DollarSign, Shield, Save,
  ToggleLeft, ToggleRight, Moon, Sun, Info, AlertCircle,
} from 'lucide-react';
import type { Currency } from '@/types';

export default function Settings() {
  const currentUser = useStore((s) => s.currentUser);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const notificationPrefs = useStore((s) => s.notificationPrefs);
  const setNotificationPref = useStore((s) => s.setNotificationPref);
  const profileOverrides = useStore((s) => s.profileOverrides);
  const updateProfile = useStore((s) => s.updateProfile);
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const overrides = profileOverrides[currentUser.id] || {};
  const displayName = overrides.name ?? currentUser.name;
  const displayEmail = overrides.email ?? currentUser.email;
  const displayPhone = overrides.phone ?? currentUser.phone ?? '';
  const displayBio = overrides.bio ?? currentUser.bio ?? '';

  const handleSave = () => {
    updateProfile(currentUser.id, {
      name: displayName,
      email: displayEmail,
      phone: displayPhone,
      bio: displayBio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-1">Manage your profile, preferences, and system settings</p>
      </div>

      {/* Profile */}
      <div className="card p-5">
        <SectionHeader title="Profile Information" subtitle="Update your personal details" />
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size={80} />
          <div>
            <div className="font-bold text-lg">{currentUser.name}</div>
            <div className="text-sm text-muted">{currentUser.title}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => updateProfile(currentUser.id, { name: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input
              type="email"
              value={displayEmail}
              onChange={(e) => updateProfile(currentUser.id, { email: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Phone</label>
            <input
              type="text"
              value={displayPhone}
              onChange={(e) => updateProfile(currentUser.id, { phone: e.target.value })}
              className="input w-full"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Role</label>
            <input type="text" value={currentUser.title} disabled className="input w-full opacity-60" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium block mb-1.5">Bio</label>
          <textarea
            value={displayBio}
            onChange={(e) => updateProfile(currentUser.id, { bio: e.target.value })}
            rows={3}
            className="input w-full resize-none"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="card p-5">
        <SectionHeader title="Notification Preferences" subtitle="Choose how you receive alerts" />
        <div className="space-y-3">
          {([
            { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'push', label: 'Push Notifications', desc: 'In-app push notifications' },
            { key: 'sms', label: 'SMS Alerts', desc: 'Critical alerts via SMS' },
            { key: 'escalations', label: 'Escalation Alerts', desc: 'Notifications when subsidiaries escalate issues' },
          ] as const).map((pref) => (
            <div key={pref.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium">{pref.label}</div>
                <div className="text-xs text-muted">{pref.desc}</div>
              </div>
              <button onClick={() => setNotificationPref(pref.key, !notificationPrefs[pref.key])}>
                {notificationPrefs[pref.key] ? (
                  <ToggleRight size={36} className="text-primary" />
                ) : (
                  <ToggleLeft size={36} className="text-muted" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance & Currency */}
      <div className="card p-5">
        <SectionHeader title="Appearance & Currency" subtitle="Theme and display preferences" />
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-xs text-muted">Switch between light and dark mode</div>
            </div>
            <button onClick={toggleTheme} className="flex items-center gap-2 btn-ghost">
              {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
              <span className="text-sm capitalize">{theme}</span>
            </button>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-border">
            <div>
              <div className="text-sm font-medium">Default Currency</div>
              <div className="text-xs text-muted">All monetary figures will display in this currency</div>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="input text-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="ZiG">ZiG (Zimbabwe Gold)</option>
            </select>
          </div>
        </div>
      </div>

      {/* QA Note for demoing access control */}
      <div className="card p-5 border-l-4 border-l-info">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-info shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-sm">Demo: Testing Access Control</h3>
            <p className="text-sm text-muted mt-1">
              This app enforces real role-based access control. To see it in action:
            </p>
            <ol className="text-sm text-muted mt-2 space-y-1 list-decimal list-inside">
              <li>Log in as a Subsidiary MD (e.g., Garikai Chitsa — TSF)</li>
              <li>Note the sidebar only shows your own dashboard, not Group Overview or Governance</li>
              <li>Try navigating to another subsidiary's URL directly (e.g., <code className="text-xs bg-surface-2 px-1 rounded">/subsidiary/bak-logistics</code>)</li>
              <li>You'll see a clean "You don't have access to this workspace" screen</li>
              <li>Log in as Chairman or Group CEO to see full access restored</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Admin: User Management */}
      <RoleGuard allowedRoles={['admin']}>
        <UserManagement />
      </RoleGuard>

      {/* Admin: Audit Log */}
      <RoleGuard allowedRoles={['admin']}>
        <AuditLogSection />
      </RoleGuard>

      <Toast message="Profile saved successfully" show={saved} />
    </div>
  );
}

function UserManagement() {
  const [userStatuses, setUserStatuses] = useState<Record<string, boolean>>(
    Object.fromEntries(people.map((p) => [p.id, true]))
  );

  const toggleStatus = (id: string) => {
    setUserStatuses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card p-5">
      <SectionHeader title="User Management" subtitle="All seeded accounts — roles, access, and status" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Role</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Last Login</th>
              <th className="text-center px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {people.map((p) => {
              const lastLogin = p.id === 'p-chairman' ? '2026-08-28 08:05' :
                p.id === 'p-gceo' ? '2026-08-28 08:12' :
                p.id === 'p-gcfo' ? '2026-08-28 08:15' :
                p.id === 'p-admin' ? '2026-08-28 09:30' :
                p.id === 'p-bm1' ? '2026-08-28 09:00' :
                p.id === 'p-bm2' ? '2026-08-28 11:00' :
                p.id === 'p-md-tsf' ? '2026-08-28 07:45' :
                p.id === 'p-md-bak' ? '2026-08-28 09:30' :
                p.id === 'p-md-sas' ? '2026-08-28 10:00' : '2026-08-27 14:20';
              return (
                <tr key={p.id} className="border-t border-border hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={p.name} avatarUrl={p.avatarUrl} size={32} />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{p.title}</td>
                  <td className="px-4 py-3 text-muted text-xs">{p.email}</td>
                  <td className="px-4 py-3 text-muted text-xs">{lastLogin}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleStatus(p.id)}>
                      {userStatuses[p.id] ? (
                        <span className="badge bg-success/10 text-success">Active</span>
                      ) : (
                        <span className="badge bg-error/10 text-error">Inactive</span>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditLogSection() {
  return (
    <div className="card p-5">
      <SectionHeader title="Audit Log" subtitle="Seeded record of logins and views — proves segregation of access" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Action</th>
              <th className="text-left px-4 py-3 font-medium">Detail</th>
              <th className="text-left px-4 py-3 font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {auditLog.map((entry) => {
              const person = people.find((p) => p.id === entry.personId);
              return (
                <tr key={entry.id} className="border-t border-border hover:bg-surface-2 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {person && <Avatar name={person.name} avatarUrl={person.avatarUrl} size={28} />}
                      <span className="font-medium text-xs">{person?.name || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      entry.action === 'Login' ? 'bg-info/10 text-info' :
                      entry.action === 'Escalation' ? 'bg-warning/10 text-warning' :
                      'bg-surface-2 text-muted'
                    }`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted text-xs">{entry.detail}</td>
                  <td className="px-4 py-3 text-muted text-xs">{entry.timestamp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
