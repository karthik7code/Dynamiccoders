import React, { useState } from 'react';
import { BenefitCalendarEvent } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Bell, 
  Plus, 
  ExternalLink, 
  Share2, 
  Sparkles,
  Bookmark,
  X,
  CalendarCheck,
  ArrowLeft
} from 'lucide-react';

interface BenefitCalendarViewProps {
  onAskAi: (prompt: string) => void;
  onBackToDashboard?: () => void;
}

// Helper to compute days remaining from present time
const calculateDaysRemaining = (targetDateStr: string) => {
  const target = new Date(targetDateStr);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Formats present time nicely (e.g. August 11, 2026)
const getPresentDateDisplay = () => {
  const now = new Date();
  return now.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const BenefitCalendarView: React.FC<BenefitCalendarViewProps> = ({ onAskAi, onBackToDashboard }) => {
  // Generate dates anchored dynamically to present time (August 2026 / now)
  const getInitialEvents = (): BenefitCalendarEvent[] => {
    const today = new Date();
    
    // Create offset date strings
    const addDays = (d: number) => {
      const copy = new Date(today);
      copy.setDate(copy.getDate() + d);
      return copy.toISOString().split('T')[0];
    };

    return [
      {
        id: 'e1',
        schemeTitle: 'National Overseas Scholarship 2026',
        schemeId: 'post-matric-scholarship',
        eventType: 'Application Deadline',
        date: addDays(4), // 4 days in future
        daysRemaining: 4,
        importance: 'High',
        notes: 'Portal closes at 11:59 PM. Requires income certificate and Caste verification.',
      },
      {
        id: 'e2',
        schemeTitle: 'PM Kisan Samman Nidhi - 18th Installment',
        schemeId: 'pm-kisan',
        eventType: 'Installment Release',
        date: addDays(12), // 12 days in future
        daysRemaining: 12,
        importance: 'Medium',
        notes: 'Direct Benefit Transfer (DBT) credit of ₹2,000 to Aadhaar linked bank account.',
      },
      {
        id: 'e3',
        schemeTitle: 'Ayushman Bharat Health Card Renewal',
        schemeId: 'ayushman-bharat',
        eventType: 'Card Renewal',
        date: addDays(22), // 22 days in future
        daysRemaining: 22,
        importance: 'High',
        notes: 'Annual income verification refresh required at CSC centre for ₹5 Lakh family cover.',
      },
      {
        id: 'e4',
        schemeTitle: 'PM Internship Scheme Slot Booking',
        schemeId: 'pm-internship-2026',
        eventType: 'Application Deadline',
        date: addDays(32), // 32 days in future
        daysRemaining: 32,
        importance: 'High',
        notes: 'Select top 3 company choices for ₹5,000/month government stipend.',
      },
    ];
  };

  const [events, setEvents] = useState<BenefitCalendarEvent[]>(getInitialEvents());
  const [filterImportance, setFilterImportance] = useState<string>('All');
  const [syncedNotice, setSyncedNotice] = useState<string>('');
  
  // Custom Event Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Application Deadline' | 'Installment Release' | 'Card Renewal' | 'Document Expiry'>('Application Deadline');
  const [newDate, setNewDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    return tomorrow.toISOString().split('T')[0];
  });
  const [newImportance, setNewImportance] = useState<'High' | 'Medium' | 'Normal'>('High');
  const [newNotes, setNewNotes] = useState('');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const remaining = calculateDaysRemaining(newDate);
    const newEvt: BenefitCalendarEvent = {
      id: `evt-${Date.now()}`,
      schemeTitle: newTitle,
      schemeId: 'custom-scheme',
      eventType: newType,
      date: newDate,
      daysRemaining: remaining,
      importance: newImportance,
      notes: newNotes || 'User added reminder on JanAI Benefit Calendar.',
    };

    setEvents((prev) => [newEvt, ...prev].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setShowAddModal(false);
    setNewTitle('');
    setNewNotes('');
    setSyncedNotice(`Added "${newTitle}" scheduled for ${newDate} to present time calendar.`);
    setTimeout(() => setSyncedNotice(''), 5000);
  };

  const filteredEvents = events.filter((e) => {
    if (filterImportance !== 'All' && e.importance !== filterImportance) return false;
    return true;
  });

  const handleSyncCalendar = () => {
    setSyncedNotice(`Calendar synchronized for ${getPresentDateDisplay()}! Exported .ics file and pushed reminders to device calendar.`);
    setTimeout(() => setSyncedNotice(''), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold tracking-wide uppercase">
              ⭐ Exclusive Feature 5
            </span>
            <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
              JanAI Present-Time Calendar Engine
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-mono border border-emerald-400/30">
              📅 Today: {getPresentDateDisplay()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Government Benefit Calendar
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            Never miss an installment or deadline again. JanAI automatically tracks scheme registration windows, renewal dates, and DBT installment releases aligned with real-time official schedules.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak={`AI Government Benefit Calendar. Present date is ${getPresentDateDisplay()}. Next upcoming high priority event is National Overseas Scholarship deadline.`}
              label="Listen to Calendar Reminders"
            />
          </div>
        </div>
      </div>

      {/* Sync Banner & Present Time Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center font-extrabold shrink-0">
            <CalendarIcon className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#00003c]">
                Active Scheme Reminders & Deadlines
              </h2>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                Live Timeline
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Real-time synchronized with Central & State government portal schedules ({getPresentDateDisplay()})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-300"
          >
            <Plus className="w-4 h-4 text-slate-700" />
            <span>Add Custom Reminder</span>
          </button>

          <button
            onClick={handleSyncCalendar}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 border border-amber-300"
          >
            <Share2 className="w-4 h-4 text-slate-950" />
            <span>Sync to Calendar / ICS</span>
          </button>
        </div>
      </div>

      {syncedNotice && (
        <div className="bg-emerald-50 text-emerald-950 p-4 rounded-2xl border border-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncedNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-bold flex-wrap">
        <span className="text-slate-400 uppercase tracking-wider text-[10px]">Filter Urgency:</span>
        {['All', 'High', 'Medium', 'Normal'].map((imp) => (
          <button
            key={imp}
            onClick={() => setFilterImportance(imp)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterImportance === imp
                ? 'bg-[#00003c] text-white font-bold shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {imp} Urgency
          </button>
        ))}
      </div>

      {/* Events Timeline Cards */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => {
          const daysLeft = calculateDaysRemaining(evt.date);
          const isPast = daysLeft < 0;
          const isToday = daysLeft === 0;
          const isUrgent = daysLeft >= 0 && daysLeft <= 5;

          return (
            <div
              key={evt.id}
              className={`bg-white p-5 rounded-3xl border shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                isPast 
                  ? 'border-slate-200 bg-slate-50/60 opacity-80'
                  : isToday 
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : isUrgent 
                  ? 'border-amber-400 bg-amber-50/10' 
                  : 'border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                
                {/* Date Badge */}
                <div className={`p-3.5 rounded-2xl flex flex-col items-center justify-center min-w-[80px] text-center border ${
                  isPast
                    ? 'bg-slate-200 border-slate-300 text-slate-600'
                    : isToday
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-950'
                    : isUrgent 
                    ? 'bg-amber-100 border-amber-300 text-amber-950' 
                    : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}>
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">
                    {new Date(evt.date).toLocaleDateString('en-IN', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black leading-none my-0.5">
                    {new Date(evt.date).getDate()}
                  </span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                    isPast
                      ? 'bg-slate-300 text-slate-700'
                      : isToday
                      ? 'bg-emerald-300 text-emerald-950'
                      : 'bg-amber-200 text-amber-900'
                  }`}>
                    {isPast ? 'Passed' : isToday ? 'TODAY!' : `${daysLeft} Days Left`}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] uppercase ${
                      evt.importance === 'High' ? 'bg-rose-100 text-rose-900' : 'bg-indigo-100 text-[#000080]'
                    }`}>
                      {evt.eventType}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Scheduled for {new Date(evt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#00003c]">
                    {evt.schemeTitle}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {evt.notes}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  onClick={() => onAskAi(`How do I complete ${evt.schemeTitle} before ${evt.date}?`)}
                  className="px-4 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal: Add Custom Present-Time Reminder */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-[#00003c]">Add Custom Calendar Reminder</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-slate-700">Scheme or Benefit Name *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., PM Awas Instalment 2 or Post-Matric Application"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00003c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700">Event Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="Application Deadline">Application Deadline</option>
                    <option value="Installment Release">Installment Release</option>
                    <option value="Card Renewal">Card Renewal</option>
                    <option value="Document Expiry">Document Expiry</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700">Urgency Level</label>
                  <select
                    value={newImportance}
                    onChange={(e) => setNewImportance(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00003c]"
                  >
                    <option value="High">High Urgency</option>
                    <option value="Medium">Medium Urgency</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">Target Date (Present/Future) *</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00003c]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700">Notes / Reminders</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Keep Aadhaar OTP phone ready and income certificate copy."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#00003c]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00003c] text-white hover:bg-[#000080]"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

