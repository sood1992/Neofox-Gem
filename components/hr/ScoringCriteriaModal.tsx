import React, { useState, useEffect } from 'react';
import { X, Target, Plus, Trash2, GripVertical, Save, Info } from 'lucide-react';
import { JobPosition, ScoringCriteria } from '../../hrTypes';
import { HRStorageService } from '../../services/hrStorageService';

interface ScoringCriteriaModalProps {
  position: JobPosition;
  onClose: () => void;
  onSave: () => void;
}

export const ScoringCriteriaModal: React.FC<ScoringCriteriaModalProps> = ({
  position,
  onClose,
  onSave
}) => {
  const [criteria, setCriteria] = useState<ScoringCriteria[]>([]);
  const [newCriteria, setNewCriteria] = useState<Partial<ScoringCriteria>>({
    name: '',
    description: '',
    weight: 10,
    type: 'CUSTOM',
    autoScore: false
  });

  useEffect(() => {
    loadCriteria();
  }, [position.id]);

  const loadCriteria = () => {
    const existingCriteria = HRStorageService.getScoringCriteria(position.id);

    // If no custom criteria, add defaults
    if (existingCriteria.length === 0) {
      const defaults: Partial<ScoringCriteria>[] = [
        { name: 'Technical Skills', description: 'Match with required technical skills', weight: 30, type: 'SKILL', autoScore: true },
        { name: 'Experience', description: 'Years and relevance of experience', weight: 25, type: 'EXPERIENCE', autoScore: true },
        { name: 'Education', description: 'Educational background and qualifications', weight: 15, type: 'EDUCATION', autoScore: true },
        { name: 'Cultural Fit', description: 'Alignment with company values', weight: 20, type: 'CULTURAL', autoScore: true },
        { name: 'Communication', description: 'Written and verbal communication skills', weight: 10, type: 'CUSTOM', autoScore: false },
      ];

      defaults.forEach(d => {
        HRStorageService.saveScoringCriteria({
          ...d,
          positionId: position.id,
          createdBy: 'system'
        } as ScoringCriteria);
      });

      setCriteria(HRStorageService.getScoringCriteria(position.id));
    } else {
      setCriteria(existingCriteria);
    }
  };

  const getTotalWeight = () => {
    return criteria.reduce((sum, c) => sum + c.weight, 0);
  };

  const addCriteria = () => {
    if (!newCriteria.name?.trim()) return;

    const created = HRStorageService.saveScoringCriteria({
      ...newCriteria,
      positionId: position.id,
      createdBy: 'user'
    } as ScoringCriteria);

    setCriteria(prev => [...prev, created]);
    setNewCriteria({
      name: '',
      description: '',
      weight: 10,
      type: 'CUSTOM',
      autoScore: false
    });
  };

  const updateCriteria = (id: string, updates: Partial<ScoringCriteria>) => {
    const updated = criteria.find(c => c.id === id);
    if (updated) {
      const newCriteria = { ...updated, ...updates };
      HRStorageService.saveScoringCriteria(newCriteria);
      setCriteria(prev => prev.map(c => c.id === id ? newCriteria : c));
    }
  };

  const deleteCriteria = (id: string) => {
    HRStorageService.deleteScoringCriteria(id);
    setCriteria(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = () => {
    onSave();
  };

  const weightBalance = getTotalWeight();
  const isBalanced = weightBalance === 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Scoring Criteria
              </h2>
              <p className="text-sm text-dark-muted mt-1">
                Customize how candidates are evaluated for {position.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
            >
              <X className="w-5 h-5 text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Weight Balance Indicator */}
        <div className={`px-6 py-3 flex items-center justify-between ${isBalanced ? 'bg-green-500/10' : 'bg-yellow-500/10'}`}>
          <div className="flex items-center gap-2">
            <Info className={`w-4 h-4 ${isBalanced ? 'text-green-500' : 'text-yellow-500'}`} />
            <span className={`text-sm ${isBalanced ? 'text-green-500' : 'text-yellow-500'}`}>
              Total Weight: {weightBalance}%
            </span>
          </div>
          {!isBalanced && (
            <span className="text-xs text-yellow-500">
              {weightBalance < 100 ? `Add ${100 - weightBalance}% more` : `Remove ${weightBalance - 100}%`}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Existing Criteria */}
          <div className="space-y-3 mb-6">
            {criteria.map(c => (
              <div
                key={c.id}
                className="bg-dark-bg rounded-xl p-4 border border-dark-border group hover:border-primary/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1 text-dark-muted cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCriteria(c.id, { name: e.target.value })}
                        className="bg-transparent font-semibold text-dark-text focus:outline-none focus:border-b focus:border-primary"
                      />
                      <span className={`text-xs px-2 py-0.5 rounded ${c.type === 'SKILL' ? 'bg-blue-500/10 text-blue-500' :
                          c.type === 'EXPERIENCE' ? 'bg-green-500/10 text-green-500' :
                            c.type === 'EDUCATION' ? 'bg-purple-500/10 text-purple-500' :
                              c.type === 'CULTURAL' ? 'bg-pink-500/10 text-pink-500' :
                                'bg-gray-500/10 text-gray-500'
                        }`}>
                        {c.type}
                      </span>
                      {c.autoScore && (
                        <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                          Auto-scored
                        </span>
                      )}
                    </div>

                    <input
                      type="text"
                      value={c.description}
                      onChange={(e) => updateCriteria(c.id, { description: e.target.value })}
                      placeholder="Add description..."
                      className="w-full bg-transparent text-sm text-dark-muted focus:outline-none focus:text-dark-text"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={c.weight}
                        onChange={(e) => updateCriteria(c.id, { weight: Math.min(100, Math.max(0, Number(e.target.value))) })}
                        className="w-16 bg-dark-card border border-dark-border rounded-lg px-2 py-1 text-center text-dark-text focus:border-primary outline-none"
                      />
                      <span className="text-dark-muted text-sm">%</span>
                    </div>

                    <button
                      onClick={() => deleteCriteria(c.id)}
                      className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weight Bar */}
                <div className="mt-3 ml-7">
                  <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${c.weight}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Criteria */}
          <div className="bg-dark-bg rounded-xl p-4 border-2 border-dashed border-dark-border">
            <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Add Custom Criteria
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-dark-muted mb-1">Name</label>
                <input
                  type="text"
                  value={newCriteria.name || ''}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Leadership Potential"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-dark-muted mb-1">Weight (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newCriteria.weight || 10}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, weight: Number(e.target.value) }))}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs text-dark-muted mb-1">Description</label>
              <input
                type="text"
                value={newCriteria.description || ''}
                onChange={(e) => setNewCriteria(prev => ({ ...prev, description: e.target.value }))}
                placeholder="How this criteria should be evaluated..."
                className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-dark-text focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newCriteria.autoScore || false}
                  onChange={(e) => setNewCriteria(prev => ({ ...prev, autoScore: e.target.checked }))}
                  className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-dark-muted">Auto-score with AI</span>
              </label>
            </div>

            <button
              onClick={addCriteria}
              disabled={!newCriteria.name?.trim()}
              className="w-full py-2 bg-primary/10 hover:bg-primary/20 disabled:opacity-50 text-primary rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Criteria
            </button>
          </div>

          {/* Tips */}
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Tips
            </h4>
            <ul className="text-sm text-dark-muted space-y-1">
              <li>Weights should add up to 100% for accurate scoring</li>
              <li>Auto-scored criteria use AI to evaluate candidates based on their resume</li>
              <li>Custom criteria require manual scoring during candidate review</li>
              <li>Drag criteria to reorder priority (top = most important)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-border bg-dark-bg/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-muted hover:text-dark-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Criteria
          </button>
        </div>
      </div>
    </div>
  );
};
