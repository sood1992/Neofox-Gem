import React, { useState } from 'react';
import { JobPosition, Department, ExperienceLevel, EmploymentType } from '../types';
import { StorageService } from '../services/storageService';

interface PositionsManagementProps {
  positions: JobPosition[];
  onPositionUpdate: () => void;
}

export const PositionsManagement: React.FC<PositionsManagementProps> = ({ positions, onPositionUpdate }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'filled' | 'closed'>('all');

  const filteredPositions = positions.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const handleCreatePosition = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newPosition: JobPosition = {
      id: `pos-${Date.now()}`,
      title: formData.get('title') as string,
      department: formData.get('department') as Department,
      location: formData.get('location') as string,
      employmentType: formData.get('employmentType') as EmploymentType,
      experienceLevel: formData.get('experienceLevel') as ExperienceLevel,
      salaryRange: {
        min: parseInt(formData.get('salaryMin') as string),
        max: parseInt(formData.get('salaryMax') as string),
        currency: 'USD'
      },
      requiredSkills: (formData.get('requiredSkills') as string).split(',').map(s => s.trim()),
      preferredSkills: (formData.get('preferredSkills') as string).split(',').map(s => s.trim()).filter(Boolean),
      description: formData.get('description') as string,
      responsibilities: (formData.get('responsibilities') as string).split('\n').filter(Boolean),
      qualifications: (formData.get('qualifications') as string).split('\n').filter(Boolean),
      benefits: (formData.get('benefits') as string).split('\n').filter(Boolean),
      status: 'open',
      openings: parseInt(formData.get('openings') as string) || 1,
      postedDate: new Date().toISOString(),
      hiringManagerId: 'user-1', // In production, use actual user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    StorageService.createPosition(newPosition);
    setShowCreateModal(false);
    onPositionUpdate();
  };

  const handleUpdatePosition = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPosition) return;

    const formData = new FormData(e.currentTarget);

    const updatedPosition: JobPosition = {
      ...editingPosition,
      title: formData.get('title') as string,
      department: formData.get('department') as Department,
      location: formData.get('location') as string,
      employmentType: formData.get('employmentType') as EmploymentType,
      experienceLevel: formData.get('experienceLevel') as ExperienceLevel,
      salaryRange: {
        min: parseInt(formData.get('salaryMin') as string),
        max: parseInt(formData.get('salaryMax') as string),
        currency: 'USD'
      },
      requiredSkills: (formData.get('requiredSkills') as string).split(',').map(s => s.trim()),
      preferredSkills: (formData.get('preferredSkills') as string).split(',').map(s => s.trim()).filter(Boolean),
      description: formData.get('description') as string,
      responsibilities: (formData.get('responsibilities') as string).split('\n').filter(Boolean),
      qualifications: (formData.get('qualifications') as string).split('\n').filter(Boolean),
      benefits: (formData.get('benefits') as string).split('\n').filter(Boolean),
      status: formData.get('status') as any,
      openings: parseInt(formData.get('openings') as string) || 1,
      updatedAt: new Date().toISOString()
    };

    StorageService.updatePosition(updatedPosition.id, updatedPosition);
    setEditingPosition(null);
    onPositionUpdate();
  };

  const getCandidateCount = (positionTitle: string) => {
    const candidates = StorageService.getCandidates();
    return candidates.filter(c => c.appliedPosition === positionTitle).length;
  };

  const PositionForm: React.FC<{ position?: JobPosition; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void }> = ({ position, onSubmit, onCancel }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl border border-dark-border shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-6 z-10">
          <h2 className="text-2xl font-bold text-dark-text">
            {position ? 'Edit Position' : 'Create New Position'}
          </h2>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={position?.title}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Department *</label>
                <select
                  name="department"
                  defaultValue={position?.department || Department.ENGINEERING}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {Object.values(Department).map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  defaultValue={position?.location}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="e.g., San Francisco, CA (Remote)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Employment Type *</label>
                <select
                  name="employmentType"
                  defaultValue={position?.employmentType || EmploymentType.FULL_TIME}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {Object.values(EmploymentType).map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Experience Level *</label>
                <select
                  name="experienceLevel"
                  defaultValue={position?.experienceLevel || ExperienceLevel.MID_LEVEL}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                >
                  {Object.values(ExperienceLevel).map(level => (
                    <option key={level} value={level}>{level.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Number of Openings *</label>
                <input
                  type="number"
                  name="openings"
                  defaultValue={position?.openings || 1}
                  min="1"
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              {position && (
                <div>
                  <label className="block text-sm font-medium text-dark-text mb-2">Status</label>
                  <select
                    name="status"
                    defaultValue={position?.status}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="open">Open</option>
                    <option value="filled">Filled</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Compensation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Minimum Salary (USD) *</label>
                <input
                  type="number"
                  name="salaryMin"
                  defaultValue={position?.salaryRange?.min}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="80000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Maximum Salary (USD) *</label>
                <input
                  type="number"
                  name="salaryMax"
                  defaultValue={position?.salaryRange?.max}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="120000"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold text-dark-text mb-4">Skills & Requirements</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Required Skills * (comma-separated)</label>
                <input
                  type="text"
                  name="requiredSkills"
                  defaultValue={position?.requiredSkills?.join(', ')}
                  required
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="React, TypeScript, Node.js, PostgreSQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Preferred Skills (comma-separated)</label>
                <input
                  type="text"
                  name="preferredSkills"
                  defaultValue={position?.preferredSkills?.join(', ')}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="GraphQL, Docker, Kubernetes"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Job Description *</label>
            <textarea
              name="description"
              defaultValue={position?.description}
              required
              rows={4}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Provide a brief overview of the role..."
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Key Responsibilities (one per line)</label>
            <textarea
              name="responsibilities"
              defaultValue={position?.responsibilities?.join('\n')}
              rows={5}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Design and develop scalable web applications&#10;Collaborate with cross-functional teams&#10;Mentor junior developers"
            />
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Qualifications (one per line)</label>
            <textarea
              name="qualifications"
              defaultValue={position?.qualifications?.join('\n')}
              rows={5}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Bachelor's degree in Computer Science or equivalent&#10;5+ years of professional experience&#10;Strong problem-solving skills"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Benefits & Perks (one per line)</label>
            <textarea
              name="benefits"
              defaultValue={position?.benefits?.join('\n')}
              rows={4}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-2 text-dark-text focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              placeholder="Competitive salary and equity&#10;Health, dental, and vision insurance&#10;Flexible work arrangements&#10;Professional development budget"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-dark-bg hover:bg-dark-border text-dark-text rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium"
            >
              {position ? 'Update Position' : 'Create Position'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-text mb-2">Open Positions</h1>
          <p className="text-dark-muted">Manage job postings and track applications</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Position
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-dark-border">
        {(['all', 'open', 'filled', 'closed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              filter === status
                ? 'border-primary text-primary'
                : 'border-transparent text-dark-muted hover:text-dark-text'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === 'all' && ` (${positions.length})`}
            {status === 'open' && ` (${positions.filter(p => p.status === 'open').length})`}
            {status === 'filled' && ` (${positions.filter(p => p.status === 'filled').length})`}
            {status === 'closed' && ` (${positions.filter(p => p.status === 'closed').length})`}
          </button>
        ))}
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPositions.map(position => {
          const candidateCount = getCandidateCount(position.title);
          return (
            <div
              key={position.id}
              className="bg-dark-card rounded-xl border border-dark-border shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-dark-text mb-1">{position.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-dark-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {position.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {position.location}
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  position.status === 'open' ? 'bg-green-500/10 text-green-500' :
                  position.status === 'filled' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {position.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-dark-muted mb-4 line-clamp-2">{position.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {position.requiredSkills.slice(0, 4).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {position.requiredSkills.length > 4 && (
                  <span className="px-2 py-1 text-dark-muted text-xs">
                    +{position.requiredSkills.length - 4} more
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-dark-border mb-4">
                <div>
                  <div className="text-xs text-dark-muted mb-1">Applications</div>
                  <div className="text-lg font-bold text-dark-text">{candidateCount}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-muted mb-1">Openings</div>
                  <div className="text-lg font-bold text-dark-text">{position.openings}</div>
                </div>
                <div>
                  <div className="text-xs text-dark-muted mb-1">Salary</div>
                  <div className="text-sm font-bold text-dark-text">
                    ${(position.salaryRange.min / 1000).toFixed(0)}k - ${(position.salaryRange.max / 1000).toFixed(0)}k
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPosition(position)}
                  className="flex-1 bg-dark-bg hover:bg-dark-border text-dark-text px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Candidates
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPositions.length === 0 && (
        <div className="bg-dark-bg rounded-xl border-2 border-dashed border-dark-border p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-dark-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-dark-text mb-2">No Positions Found</h3>
          <p className="text-sm text-dark-muted mb-4">
            {filter === 'all' ? 'Get started by creating your first job position' : `No ${filter} positions at the moment`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Position
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <PositionForm
          onSubmit={handleCreatePosition}
          onCancel={() => setShowCreateModal(false)}
        />
      )}

      {editingPosition && (
        <PositionForm
          position={editingPosition}
          onSubmit={handleUpdatePosition}
          onCancel={() => setEditingPosition(null)}
        />
      )}
    </div>
  );
};
