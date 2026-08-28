import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person, Currency, Resolution, CalendarEvent, Channel, Escalation } from '@/types';

interface AppState {
  // Auth
  currentUser: Person | null;
  login: (person: Person) => void;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;

  // Profile (editable, session-persisted)
  profileOverrides: Record<string, Partial<Person>>;
  updateProfile: (personId: string, updates: Partial<Person>) => void;

  // Notifications
  notificationPrefs: { email: boolean; push: boolean; sms: boolean; escalations: boolean };
  setNotificationPref: (key: keyof AppState['notificationPrefs'], value: boolean) => void;

  // Resolutions (session votes)
  resolutionVotes: Record<string, 'approve' | 'reject' | 'abstain' | undefined>;
  castVote: (resolutionId: string, vote: 'approve' | 'reject' | 'abstain') => void;

  // Calendar (session additions)
  customEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;

  // Messages (session additions)
  customMessages: Record<string, Channel['messages']>;
  addMessage: (channelId: string, message: Channel['messages'][0]) => void;

  // Escalations (session additions)
  customEscalations: Escalation[];
  addEscalation: (escalation: Escalation) => void;

  // Daily brief dismissed
  briefDismissed: boolean;
  dismissBrief: () => void;
  resetBrief: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (person) => set({ currentUser: person, briefDismissed: false }),
      logout: () => set({ currentUser: null, briefDismissed: false }),

      theme: 'light',
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),

      currency: 'USD',
      setCurrency: (c) => set({ currency: c }),

      profileOverrides: {},
      updateProfile: (personId, updates) =>
        set((s) => ({
          profileOverrides: {
            ...s.profileOverrides,
            [personId]: { ...s.profileOverrides[personId], ...updates },
          },
        })),

      notificationPrefs: { email: true, push: true, sms: false, escalations: true },
      setNotificationPref: (key, value) =>
        set((s) => ({ notificationPrefs: { ...s.notificationPrefs, [key]: value } })),

      resolutionVotes: {},
      castVote: (resolutionId, vote) =>
        set((s) => ({ resolutionVotes: { ...s.resolutionVotes, [resolutionId]: vote } })),

      customEvents: [],
      addCalendarEvent: (event) =>
        set((s) => ({ customEvents: [...s.customEvents, event] })),

      customMessages: {},
      addMessage: (channelId, message) =>
        set((s) => ({
          customMessages: {
            ...s.customMessages,
            [channelId]: [...(s.customMessages[channelId] || []), message],
          },
        })),

      customEscalations: [],
      addEscalation: (escalation) =>
        set((s) => ({ customEscalations: [escalation, ...s.customEscalations] })),

      briefDismissed: false,
      dismissBrief: () => set({ briefDismissed: true }),
      resetBrief: () => set({ briefDismissed: false }),
    }),
    {
      name: 'tsl-onegroup-store',
      partialize: (s) => ({
        theme: s.theme,
        currency: s.currency,
        profileOverrides: s.profileOverrides,
        notificationPrefs: s.notificationPrefs,
      }),
    }
  )
);
