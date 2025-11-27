import React, { useState } from 'react';
import {
  X, Briefcase, Plus, Trash2, DollarSign, MapPin, Users,
  Target, Heart, CheckCircle
} from 'lucide-react';
import { JobPosition, ExperienceLevel, SkillRequirement } from '../../hrTypes';

interface CreatePositionModalProps {
  onClose: () => void;
  onSave: (position: JobPosition) => void;
  editingPosition?: JobPosition;
}

export const CreatePositionModal: React.FC<CreatePositionModalProps> = ({
  onClose,
  onSave,
  editingPosition
}) => {
  const [formData, setFormData] = useState<Partial<JobPosition>>(editingPosition || {
    title: '',
    department: '',
    description: '',
    location: '',
    remotePolicy: 'HYBRID',
    salaryMin: 0,
    salaryMax: 0,
    currency: 'USD',
    experienceLevel: ExperienceLevel.MID,
    requiredSkills: [],
    preferredSkills: [],
    responsibilities: [''],
    qualifications: [''],
    benefits: [''],
    culturalValues: [''],
    status: 'OPEN',
    hiringManagerId: 'user-1'
  });

  const [newSkill, setNewSkill] = useState({ skill: '', level: 'INTERMEDIATE', isRequired: true });
  const [activeTab, setActiveTab] = useState<'basic' | 'skills' | 'details' | 'culture'>('basic');

  const updateField = <K extends keyof JobPosition>(field: K, value: JobPosition[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (isRequired: boolean) => {
    if (!newSkill.skill.trim()) return;

    const skill: SkillRequirement = {
      skill: newSkill.skill,
      level: newSkill.level as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
      isRequired,
      weight: isRequired ? 15 : 10
    };

    if (isRequired) {
      updateField('requiredSkills', [...(formData.requiredSkills || []), skill]);
    } else {
      updateField('preferredSkills', [...(formData.preferredSkills || []), skill]);
    }

    setNewSkill({ skill: '', level: 'INTERMEDIATE', isRequired: true });
  };

  const removeSkill = (skill: string, isRequired: boolean) => {
    if (isRequired) {
      updateField('requiredSkills', (formData.requiredSkills || []).filter(s => s.skill !== skill));
    } else {
      updateField('preferredSkills', (formData.preferredSkills || []).filter(s => s.skill !== skill));
    }
  };

  const updateListField = (field: 'responsibilities' | 'qualifications' | 'benefits' | 'culturalValues', index: number, value: string) => {
    const list = [...(formData[field] || [])];
    list[index] = value;
    updateField(field, list);
  };

  const addListItem = (field: 'responsibilities' | 'qualifications' | 'benefits' | 'culturalValues') => {
    updateField(field, [...(formData[field] || []), '']);
  };

  const removeListItem = (field: 'responsibilities' | 'qualifications' | 'benefits' | 'culturalValues', index: number) => {
    const list = [...(formData[field] || [])];
    list.splice(index, 1);
    updateField(field, list);
  };

  const handleSubmit = () => {
    // Clean up empty items from lists
    const cleanedData = {
      ...formData,
      responsibilities: (formData.responsibilities || []).filter(r => r.trim()),
      qualifications: (formData.qualifications || []).filter(q => q.trim()),
      benefits: (formData.benefits || []).filter(b => b.trim()),
      culturalValues: (formData.culturalValues || []).filter(c => c.trim()),
    };

    onSave(cleanedData as JobPosition);
  };

  const isValid = formData.title?.trim() && formData.department?.trim() && formData.description?.trim();

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Target className="w-4 h-4" /> },
    { id: 'details', label: 'Details', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'culture', label: 'Culture', icon: <Heart className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-3xl rounded-2xl border border-dark-border shadow-2xl animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {editingPosition ? 'Edit Position' : 'Create Position'}
              </h2>
              <p className="text-sm text-dark-muted mt-1">
                Define the job requirements and criteria
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
            >
              <X className="w-5 h-5 text-dark-muted" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Department *</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => updateField('department', e.target.value)}
                    placeholder="e.g., Engineering"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Description *</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Describe the role and what the candidate will be doing..."
                  rows={4}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => updateField('location', e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-dark-text focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Remote Policy</label>
                  <select
                    value={formData.remotePolicy || 'HYBRID'}
                    onChange={(e) => updateField('remotePolicy', e.target.value as 'ONSITE' | 'HYBRID' | 'REMOTE')}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none"
                  >
                    <option value="ONSITE">On-site</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Min Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="number"
                      value={formData.salaryMin || ''}
                      onChange={(e) => updateField('salaryMin', Number(e.target.value))}
                      placeholder="100000"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-dark-text focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Max Salary</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-muted" />
                    <input
                      type="number"
                      value={formData.salaryMax || ''}
                      onChange={(e) => updateField('salaryMax', Number(e.target.value))}
                      placeholder="150000"
                      className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2.5 text-dark-text focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Experience Level</label>
                  <select
                    value={formData.experienceLevel || ExperienceLevel.MID}
                    onChange={(e) => updateField('experienceLevel', e.target.value as ExperienceLevel)}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none"
                  >
                    {Object.values(ExperienceLevel).map(level => (
                      <option key={level} value={level}>
                        {level.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Add Skill */}
              <div className="bg-dark-bg rounded-xl p-4 border border-dark-border">
                <h3 className="font-semibold text-dark-text mb-3">Add Skill</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSkill.skill}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, skill: e.target.value }))}
                    placeholder="e.g., React, Python, AWS..."
                    className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                  />
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                    className="bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                  >
                    <option value="BASIC">Basic</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                  <button
                    onClick={() => addSkill(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
                  >
                    + Required
                  </button>
                  <button
                    onClick={() => addSkill(false)}
                    className="px-4 py-2 bg-dark-card border border-dark-border text-dark-text rounded-lg hover:border-primary/50 transition-all"
                  >
                    + Preferred
                  </button>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  Required Skills ({formData.requiredSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills?.map(skill => (
                    <div
                      key={skill.skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg"
                    >
                      <span>{skill.skill}</span>
                      <span className="text-xs opacity-70">({skill.level})</span>
                      <button
                        onClick={() => removeSkill(skill.skill, true)}
                        className="hover:bg-red-500/20 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(!formData.requiredSkills || formData.requiredSkills.length === 0) && (
                    <p className="text-dark-muted text-sm">No required skills added yet</p>
                  )}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <h3 className="font-semibold text-dark-text mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Preferred Skills ({formData.preferredSkills?.length || 0})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formData.preferredSkills?.map(skill => (
                    <div
                      key={skill.skill}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-500 rounded-lg"
                    >
                      <span>{skill.skill}</span>
                      <span className="text-xs opacity-70">({skill.level})</span>
                      <button
                        onClick={() => removeSkill(skill.skill, false)}
                        className="hover:bg-blue-500/20 rounded p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(!formData.preferredSkills || formData.preferredSkills.length === 0) && (
                    <p className="text-dark-muted text-sm">No preferred skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Responsibilities */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-text">Responsibilities</h3>
                  <button
                    onClick={() => addListItem('responsibilities')}
                    className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.responsibilities?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListField('responsibilities', index, e.target.value)}
                        placeholder="Enter responsibility..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                      />
                      <button
                        onClick={() => removeListItem('responsibilities', index)}
                        className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-text">Qualifications</h3>
                  <button
                    onClick={() => addListItem('qualifications')}
                    className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.qualifications?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListField('qualifications', index, e.target.value)}
                        placeholder="Enter qualification..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                      />
                      <button
                        onClick={() => removeListItem('qualifications', index)}
                        className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-text">Benefits</h3>
                  <button
                    onClick={() => addListItem('benefits')}
                    className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.benefits?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListField('benefits', index, e.target.value)}
                        placeholder="Enter benefit..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                      />
                      <button
                        onClick={() => removeListItem('benefits', index)}
                        className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'culture' && (
            <div className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Company Values
                </h3>
                <p className="text-sm text-dark-muted">
                  Define the cultural values that will be used to assess candidate fit.
                  These values help the AI evaluate how well candidates align with your team.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-dark-text">Cultural Values</h3>
                  <button
                    onClick={() => addListItem('culturalValues')}
                    className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Value
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.culturalValues?.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateListField('culturalValues', index, e.target.value)}
                        placeholder="e.g., Innovation, Collaboration, Transparency..."
                        className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:border-primary outline-none"
                      />
                      <button
                        onClick={() => removeListItem('culturalValues', index)}
                        className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Innovation', 'Collaboration', 'Integrity', 'Excellence', 'Diversity', 'Work-Life Balance', 'Growth', 'Transparency', 'Customer Focus', 'Agility'].map(value => (
                  <button
                    key={value}
                    onClick={() => {
                      if (!formData.culturalValues?.includes(value)) {
                        updateField('culturalValues', [...(formData.culturalValues || []), value]);
                      }
                    }}
                    disabled={formData.culturalValues?.includes(value)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${formData.culturalValues?.includes(value)
                        ? 'bg-primary/20 text-primary cursor-not-allowed'
                        : 'bg-dark-bg border border-dark-border text-dark-muted hover:border-primary/50 hover:text-dark-text'
                      }`}
                  >
                    + {value}
                  </button>
                ))}
              </div>
            </div>
          )}
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
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-primary/30 transition-all"
          >
            {editingPosition ? 'Update Position' : 'Create Position'}
          </button>
        </div>
      </div>
    </div>
  );
};
