import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { calendarEvents } from '@/data/mockData';
import { SectionHeader, Modal } from '@/components/ui';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, X } from 'lucide-react';
import type { CalendarEvent } from '@/types';

const CATEGORY_COLORS: Record<CalendarEvent['category'], string> = {
  'Board Meeting': 'bg-blue-500',
  'AGM': 'bg-purple-500',
  'Tobacco Season Milestone': 'bg-green-600',
  'Subsidiary Review': 'bg-amber-500',
  'Dividend Date': 'bg-rose-500',
  'Personal': 'bg-teal-500',
};

const CATEGORY_BG: Record<CalendarEvent['category'], string> = {
  'Board Meeting': 'bg-blue-100 text-blue-700 border-blue-200',
  'AGM': 'bg-purple-100 text-purple-700 border-purple-200',
  'Tobacco Season Milestone': 'bg-green-100 text-green-700 border-green-200',
  'Subsidiary Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'Dividend Date': 'bg-rose-100 text-rose-700 border-rose-200',
  'Personal': 'bg-teal-100 text-teal-700 border-teal-200',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const customEvents = useStore((s) => s.customEvents);
  const addCalendarEvent = useStore((s) => s.addCalendarEvent);
  const allEvents = [...calendarEvents, ...customEvents];

  const [currentDate, setCurrentDate] = useState(new Date('2026-09-01'));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '2026-09-15',
    time: '09:00',
    category: 'Personal' as CalendarEvent['category'],
    description: '',
    location: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    allEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [allEvents]);

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    const event: CalendarEvent = {
      id: `e-custom-${Date.now()}`,
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      category: newEvent.category,
      description: newEvent.description,
      location: newEvent.location,
    };
    addCalendarEvent(event);
    setNewEvent({ title: '', date: '2026-09-15', time: '09:00', category: 'Personal', description: '', location: '' });
    setShowAddForm(false);
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Calendar</h1>
          <p className="text-muted mt-1">Board meetings, AGMs, subsidiary reviews, and key dates</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Event
        </button>
      </div>

      {/* Category legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-muted">
            <span className={`w-3 h-3 rounded-full ${color}`} />
            {cat}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="card p-4">
        {/* Month header */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="btn-ghost"><ChevronLeft size={20} /></button>
          <h2 className="text-lg font-bold">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="btn-ghost"><ChevronRight size={20} /></button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted py-2">{day}</div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = eventsByDate[dateStr] || [];
            const isToday = dateStr === '2026-08-28';
            return (
              <div
                key={day}
                className={`aspect-square border border-border rounded-lg p-1 overflow-hidden hover:bg-surface-2 transition-colors cursor-pointer ${
                  isToday ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className={`text-xs font-medium mb-0.5 ${isToday ? 'text-primary' : ''}`}>{day}</div>
                <div className="space-y-0.5 overflow-hidden">
                  {dayEvents.slice(0, 2).map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className={`w-full text-left text-[10px] px-1 py-0.5 rounded truncate border ${CATEGORY_BG[e.category]}`}
                    >
                      {e.title}
                    </button>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted px-1">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title || ''}>
        {selectedEvent && (
          <div className="space-y-3">
            <div className={`badge border ${CATEGORY_BG[selectedEvent.category]}`}>
              {selectedEvent.category}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={16} className="text-muted" />
              <span>{selectedEvent.date}{selectedEvent.time ? ` at ${selectedEvent.time}` : ''}</span>
            </div>
            {selectedEvent.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-muted" />
                <span>{selectedEvent.location}</span>
              </div>
            )}
            {selectedEvent.description && (
              <p className="text-sm text-muted pt-2 border-t border-border">{selectedEvent.description}</p>
            )}
          </div>
        )}
      </Modal>

      {/* Add Event Modal */}
      <Modal open={showAddForm} onClose={() => setShowAddForm(false)} title="Add New Event">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1">Title</label>
            <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="input w-full" placeholder="Event title" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1">Date</label>
              <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="input w-full" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Time</label>
              <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="input w-full" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Category</label>
            <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as CalendarEvent['category'] })} className="input w-full">
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Location</label>
            <input type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="input w-full" placeholder="Optional" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} rows={3} className="input w-full resize-none" placeholder="Optional" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setShowAddForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAddEvent} disabled={!newEvent.title.trim()} className="btn-primary disabled:opacity-50">Add Event</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
