import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Avatar from '@/components/Avatar';
import { Bell, Search, Sun, Moon, DollarSign, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@/data/mockData';
import type { Currency } from '@/types';

export default function TopBar() {
  const currentUser = useStore((s) => s.currentUser);
  const theme = useStore((s) => s.theme);
  const toggleTheme = useStore((s) => s.toggleTheme);
  const currency = useStore((s) => s.currency);
  const setCurrency = useStore((s) => s.setCurrency);
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!currentUser) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 surface border-b flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search subsidiaries, people, documents..."
            className="input w-full pl-9 text-sm"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Currency toggle */}
        <div className="relative" ref={currencyRef}>
          <button
            onClick={() => setCurrencyOpen(!currencyOpen)}
            className="btn-ghost flex items-center gap-1.5 text-sm font-medium"
          >
            <DollarSign size={16} />
            <span>{currency}</span>
            <ChevronDown size={14} className="text-muted" />
          </button>
          {currencyOpen && (
            <div className="absolute right-0 mt-2 w-36 card shadow-lg py-1 z-50 animate-fade-in">
              {(['USD', 'ZiG'] as Currency[]).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCurrency(c); setCurrencyOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-surface-2 transition-colors ${
                    currency === c ? 'text-primary font-medium' : ''
                  }`}
                >
                  {c === 'USD' ? 'USD ($)' : 'ZiG (Zimbabwe Gold)'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} className="btn-ghost">
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)} className="btn-ghost relative">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 card shadow-lg z-50 animate-fade-in max-h-96 overflow-y-auto">
              <div className="px-4 py-3 border-b border-border font-semibold text-sm">
                Notifications
              </div>
              {notifications.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 hover:bg-surface-2 transition-colors ${!n.read ? 'bg-primary-soft/30' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      n.type === 'success' ? 'bg-success' :
                      n.type === 'warning' ? 'bg-warning' :
                      n.type === 'error' ? 'bg-error' : 'bg-info'
                    }`} />
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="text-xs text-muted mt-0.5">{n.body}</div>
                      <div className="text-[10px] text-muted mt-1">{n.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 btn-ghost"
          >
            <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size={32} />
            <ChevronDown size={14} className="text-muted" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 card shadow-lg py-1 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-border">
                <div className="font-medium text-sm">{currentUser.name}</div>
                <div className="text-xs text-muted">{currentUser.title}</div>
                <div className="text-xs text-muted mt-1">{currentUser.email}</div>
              </div>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-2 transition-colors text-left"
              >
                <User size={15} /> Profile
              </button>
              <button
                onClick={() => { setProfileOpen(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-2 transition-colors text-left"
              >
                <Settings size={15} /> Settings
              </button>
              <div className="border-t border-border my-1" />
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-surface-2 transition-colors text-left text-error"
              >
                <LogOut size={15} /> Switch demo account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
