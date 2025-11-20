
import React, { useState } from 'react';
import { User, Project, ShootEvent, Department } from '../types';
import { StorageService } from '../services/storageService';

interface ShootCalendarProps {
  user: User;
  users: User[];
  projects: Project[];
}

export const ShootCalendar: React.FC<ShootCalendarProps> = ({ user, users, projects }) => {
  const [events, setEvents] = useState<ShootEvent[]>(StorageService.getShootEvents());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [location, setLocation] = useState('');
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
    const endDateTime = new Date(`${startDate}T${endTime}`).toISOString();

    const newEvent: ShootEvent = {
        id: Date.now().toString(),
        projectId,
        title,
        start: startDateTime,
        end: endDateTime,
        location,
        crewIds: selectedCrew,
        type: 'SHOOT',
        description
    };

    StorageService.saveShootEvent(newEvent);
    setEvents(StorageService.getShootEvents());
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
      setTitle('');
      setProjectId('');
      setStartDate('');
      setLocation('');
      setSelectedCrew([]);
      setDescription('');
  };

  const toggleCrew = (userId: string) => {
      if (selectedCrew.includes(userId)) {
          setSelectedCrew(selectedCrew.filter(id => id !== userId));
      } else {
          setSelectedCrew([...selectedCrew, userId]);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-dark-text">Production Calendar</h2>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-primary/20 transition-all"
            >
                + Schedule Shoot
            </button>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-border shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="p-6 border-b border-dark-border flex justify-between items-center bg-dark-bg/50">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-dark-card rounded-full text-dark-muted hover:text-primary transition-colors">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h3 className="text-lg font-bold text-dark-text">{monthName} {currentDate.getFullYear()}</h3>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-dark-card rounded-full text-dark-muted hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 bg-dark-border gap-px">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="bg-dark-card p-3 text-center text-xs font-bold uppercase text-dark-muted tracking-wider">
                        {d}
                    </div>
                ))}
                
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
                    const dayEvents = events.filter(e => e.start.startsWith(dateStr));

                    return (
                        <div key={day} className="bg-dark-card min-h-[120px] p-2 hover:bg-dark-bg/30 transition-colors">
                            <div className="text-right text-sm font-medium text-dark-muted mb-2">{day}</div>
                            <div className="space-y-1">
                                {dayEvents.map(e => (
                                    <div key={e.id} className="text-[10px] bg-danger/10 text-danger border-l-2 border-danger px-1.5 py-1 rounded truncate cursor-pointer hover:opacity-80" title={e.title}>
                                        {e.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Schedule Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-dark-card w-full max-w-2xl rounded-xl shadow-2xl border border-dark-border animate-scale-up max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-dark-border flex justify-between items-center">
                        <h3 className="text-lg font-bold text-dark-text">Schedule New Shoot</h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-dark-muted hover:text-danger">✕</button>
                    </div>
                    <form onSubmit={handleSave} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-dark-muted mb-1">Shoot Title</label>
                                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" placeholder="e.g. Outdoor Scene - Day 1" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-dark-muted mb-1">Project</label>
                                <select required value={projectId} onChange={e => setProjectId(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none">
                                    <option value="">Select Project</option>
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.title} ({p.jobCode || 'No Code'})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-dark-muted mb-1">Date</label>
                                <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-dark-muted mb-1">Location</label>
                                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" placeholder="e.g. Studio A" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-dark-muted mb-1">Call Time</label>
                                <input type="time" required value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-dark-muted mb-1">Wrap Time (Est)</label>
                                <input type="time" required value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-dark-muted mb-2">Assign Crew</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-dark-bg p-3 rounded border border-dark-border max-h-40 overflow-y-auto custom-scrollbar">
                                {users.map(u => (
                                    <label key={u.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedCrew.includes(u.id) ? 'bg-primary/20 border border-primary/30' : 'hover:bg-dark-card'}`}>
                                        <input type="checkbox" checked={selectedCrew.includes(u.id)} onChange={() => toggleCrew(u.id)} className="rounded text-primary focus:ring-0 bg-dark-card border-dark-border" />
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <img src={u.avatar} className="w-5 h-5 rounded-full" alt=""/>
                                            <span className="text-xs text-dark-text truncate">{u.name}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-dark-muted mb-1">Description / Notes</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-dark-text focus:border-primary outline-none h-20 resize-none" placeholder="Equipment list, special instructions..." />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-dark-muted hover:bg-dark-bg rounded transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded shadow-lg shadow-primary/20">Schedule</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};
