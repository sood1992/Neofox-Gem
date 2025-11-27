import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Briefcase, TrendingUp, Clock, AlertTriangle, CheckCircle, XCircle,
  Upload, Filter, BarChart3, UserCheck, ArrowUpRight, ArrowDownRight,
  Star, Eye, GitCompare, Download, Settings, Plus, Search, RefreshCw
} from 'lucide-react';
import { HRStorageService } from '../../services/hrStorageService';
import {
  JobPosition, Candidate, CandidateStatus, HRDashboardStats,
  CandidateFilters, CandidateSortOptions
} from '../../hrTypes';
import { BulkUploadModal } from './BulkUploadModal';
import { CandidateCard } from './CandidateCard';
import { CandidateDetailPane } from './CandidateDetailPane';
import { CandidateComparison } from './CandidateComparison';
import { FilterSortPanel } from './FilterSortPanel';
import { CreatePositionModal } from './CreatePositionModal';
import { ScoringCriteriaModal } from './ScoringCriteriaModal';
import { ReportExportModal } from './ReportExportModal';

interface HRDashboardProps {
  currentUser: { id: string; name: string; avatar: string };
}

type ViewMode = 'grid' | 'list' | 'pipeline';
type ActiveModal = null | 'upload' | 'position' | 'criteria' | 'export' | 'compare';

export const HRDashboard: React.FC<HRDashboardProps> = ({ currentUser }) => {
  // State
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [stats, setStats] = useState<HRDashboardStats | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState<CandidateFilters>({});
  const [sortOptions, setSortOptions] = useState<CandidateSortOptions>({
    field: 'score',
    direction: 'desc'
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize demo data and load positions
  useEffect(() => {
    HRStorageService.initDemoData();
    refreshData();
  }, []);

  // Load candidates when position changes
  useEffect(() => {
    if (selectedPositionId) {
      loadCandidates();
    }
  }, [selectedPositionId, filters, sortOptions]);

  // Filter candidates by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCandidates(candidates);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = candidates.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.currentTitle.toLowerCase().includes(query) ||
        c.currentCompany?.toLowerCase().includes(query)
      );
      setFilteredCandidates(filtered);
    }
  }, [searchQuery, candidates]);

  const refreshData = () => {
    setIsLoading(true);
    const loadedPositions = HRStorageService.getPositions();
    setPositions(loadedPositions);

    if (loadedPositions.length > 0 && !selectedPositionId) {
      setSelectedPositionId(loadedPositions[0].id);
    }

    const dashboardStats = HRStorageService.getDashboardStats(selectedPositionId || undefined);
    setStats(dashboardStats);
    setIsLoading(false);
  };

  const loadCandidates = () => {
    if (!selectedPositionId) return;

    const filtersWithSearch = { ...filters, searchQuery: searchQuery || undefined };
    const loadedCandidates = HRStorageService.filterCandidates(
      selectedPositionId,
      filtersWithSearch,
      sortOptions
    );
    setCandidates(loadedCandidates);
    setFilteredCandidates(loadedCandidates);

    const dashboardStats = HRStorageService.getDashboardStats(selectedPositionId);
    setStats(dashboardStats);
  };

  const handleCandidateUpdate = (updated: Candidate) => {
    HRStorageService.saveCandidate(updated);
    loadCandidates();
    if (selectedCandidate?.id === updated.id) {
      setSelectedCandidate(updated);
    }
  };

  const handleStatusChange = (candidateId: string, newStatus: CandidateStatus) => {
    HRStorageService.updateCandidateStatus(candidateId, newStatus);
    loadCandidates();
  };

  const toggleComparisonSelection = (candidateId: string) => {
    setSelectedForComparison(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId].slice(-5) // Max 5 candidates for comparison
    );
  };

  const selectedPosition = useMemo(() =>
    positions.find(p => p.id === selectedPositionId),
    [positions, selectedPositionId]
  );

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.NEW: return 'bg-blue-500/10 text-blue-500';
      case CandidateStatus.SCREENING: return 'bg-yellow-500/10 text-yellow-500';
      case CandidateStatus.SHORTLISTED: return 'bg-purple-500/10 text-purple-500';
      case CandidateStatus.INTERVIEW: return 'bg-cyan-500/10 text-cyan-500';
      case CandidateStatus.OFFER: return 'bg-green-500/10 text-green-500';
      case CandidateStatus.HIRED: return 'bg-emerald-500/10 text-emerald-500';
      case CandidateStatus.REJECTED: return 'bg-red-500/10 text-red-500';
      case CandidateStatus.WITHDRAWN: return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              Candidate Vetting
            </h1>
            <p className="text-dark-muted text-sm mt-1">
              AI-powered candidate screening and analysis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal('position')}
              className="px-4 py-2 bg-dark-bg border border-dark-border text-dark-text rounded-lg hover:border-primary/50 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              New Position
            </button>
            <button
              onClick={() => setActiveModal('upload')}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Resumes
            </button>
          </div>
        </div>

        {/* Position Selector */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={selectedPositionId || ''}
            onChange={(e) => setSelectedPositionId(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-4 py-2.5 text-dark-text focus:border-primary outline-none min-w-[300px]"
          >
            <option value="">Select a position...</option>
            {positions.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.candidateCount || 0} candidates)
              </option>
            ))}
          </select>

          <button
            onClick={refreshData}
            className="p-2.5 bg-dark-bg border border-dark-border rounded-lg hover:border-primary/50 transition-all"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4 text-dark-muted" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            icon={<Users className="w-5 h-5" />}
            label="Total Candidates"
            value={stats.totalCandidates}
            color="primary"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            label="In Review"
            value={stats.inReview}
            color="yellow"
          />
          <StatCard
            icon={<Star className="w-5 h-5" />}
            label="Shortlisted"
            value={stats.shortlisted}
            color="purple"
          />
          <StatCard
            icon={<UserCheck className="w-5 h-5" />}
            label="Interviewed"
            value={stats.interviewed}
            color="cyan"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            label="Offers / Hired"
            value={`${stats.offers} / ${stats.hired}`}
            color="green"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5" />}
            label="Avg Score"
            value={`${stats.avgScore}%`}
            color="blue"
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-dark-card rounded-xl border border-dark-border p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-muted" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-dark-text focus:border-primary outline-none"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-dark-bg rounded-lg p-1 border border-dark-border">
            {(['grid', 'list', 'pipeline'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${viewMode === mode
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-dark-muted hover:text-dark-text'
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${isFilterOpen
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-dark-bg border-dark-border text-dark-muted hover:text-dark-text'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {Object.keys(filters).filter(k => filters[k as keyof CandidateFilters]).length > 0 && (
                <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                  {Object.keys(filters).filter(k => filters[k as keyof CandidateFilters]).length}
                </span>
              )}
            </button>

            {selectedForComparison.length >= 2 && (
              <button
                onClick={() => setActiveModal('compare')}
                className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-500 flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                Compare ({selectedForComparison.length})
              </button>
            )}

            <button
              onClick={() => setActiveModal('criteria')}
              className="p-2 rounded-lg border border-dark-border bg-dark-bg hover:border-primary/50 transition-all"
              title="Scoring Criteria"
            >
              <Settings className="w-4 h-4 text-dark-muted" />
            </button>

            <button
              onClick={() => setActiveModal('export')}
              className="p-2 rounded-lg border border-dark-border bg-dark-bg hover:border-primary/50 transition-all"
              title="Export Report"
            >
              <Download className="w-4 h-4 text-dark-muted" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <FilterSortPanel
            filters={filters}
            sortOptions={sortOptions}
            onFiltersChange={setFilters}
            onSortChange={setSortOptions}
            positionId={selectedPositionId || ''}
          />
        )}
      </div>

      {/* Candidates View */}
      {!selectedPositionId ? (
        <div className="bg-dark-card rounded-xl border border-dark-border border-dashed p-12 text-center">
          <Briefcase className="w-12 h-12 text-dark-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text mb-2">No Position Selected</h3>
          <p className="text-dark-muted mb-4">
            Select a position above or create a new one to start reviewing candidates.
          </p>
          <button
            onClick={() => setActiveModal('position')}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
          >
            Create Position
          </button>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="bg-dark-card rounded-xl border border-dark-border border-dashed p-12 text-center">
          <Users className="w-12 h-12 text-dark-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark-text mb-2">No Candidates Found</h3>
          <p className="text-dark-muted mb-4">
            {searchQuery || Object.keys(filters).length > 0
              ? 'Try adjusting your search or filters.'
              : 'Upload resumes to start screening candidates.'}
          </p>
          <button
            onClick={() => setActiveModal('upload')}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition-all"
          >
            Upload Resumes
          </button>
        </div>
      ) : viewMode === 'pipeline' ? (
        <PipelineView
          candidates={filteredCandidates}
          onCandidateClick={setSelectedCandidate}
          onStatusChange={handleStatusChange}
          getStatusColor={getStatusColor}
        />
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
        }>
          {filteredCandidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              viewMode={viewMode}
              isSelected={selectedForComparison.includes(candidate.id)}
              onSelect={() => setSelectedCandidate(candidate)}
              onToggleComparison={() => toggleComparisonSelection(candidate.id)}
              onStatusChange={(status) => handleStatusChange(candidate.id, status)}
            />
          ))}
        </div>
      )}

      {/* Candidate Detail Pane */}
      {selectedCandidate && selectedPosition && (
        <CandidateDetailPane
          candidate={selectedCandidate}
          position={selectedPosition}
          currentUser={currentUser}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={handleCandidateUpdate}
        />
      )}

      {/* Modals */}
      {activeModal === 'upload' && selectedPosition && (
        <BulkUploadModal
          position={selectedPosition}
          onClose={() => setActiveModal(null)}
          onUploadComplete={() => {
            setActiveModal(null);
            loadCandidates();
          }}
        />
      )}

      {activeModal === 'position' && (
        <CreatePositionModal
          onClose={() => setActiveModal(null)}
          onSave={(position) => {
            HRStorageService.savePosition(position);
            refreshData();
            setSelectedPositionId(position.id);
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'criteria' && selectedPosition && (
        <ScoringCriteriaModal
          position={selectedPosition}
          onClose={() => setActiveModal(null)}
          onSave={() => {
            setActiveModal(null);
            loadCandidates();
          }}
        />
      )}

      {activeModal === 'export' && selectedPosition && (
        <ReportExportModal
          position={selectedPosition}
          candidates={filteredCandidates}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'compare' && selectedPosition && (
        <CandidateComparison
          candidates={candidates.filter(c => selectedForComparison.includes(c.id))}
          position={selectedPosition}
          onClose={() => {
            setActiveModal(null);
            setSelectedForComparison([]);
          }}
        />
      )}
    </div>
  );
};

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'primary' | 'green' | 'yellow' | 'red' | 'blue' | 'purple' | 'cyan';
  trend?: { value: number; isUp: boolean };
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color, trend }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 text-primary border-primary/20',
    green: 'from-green-500/20 to-green-500/5 text-green-500 border-green-500/20',
    yellow: 'from-yellow-500/20 to-yellow-500/5 text-yellow-500 border-yellow-500/20',
    red: 'from-red-500/20 to-red-500/5 text-red-500 border-red-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 text-purple-500 border-purple-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 text-cyan-500 border-cyan-500/20',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl border p-4`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        {trend && (
          <span className={`text-xs flex items-center gap-1 ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
            {trend.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-dark-text">{value}</div>
      <div className="text-xs text-dark-muted mt-1">{label}</div>
    </div>
  );
};

// Pipeline View Component
interface PipelineViewProps {
  candidates: Candidate[];
  onCandidateClick: (candidate: Candidate) => void;
  onStatusChange: (candidateId: string, status: CandidateStatus) => void;
  getStatusColor: (status: CandidateStatus) => string;
}

const PipelineView: React.FC<PipelineViewProps> = ({
  candidates,
  onCandidateClick,
  onStatusChange,
  getStatusColor
}) => {
  const stages = [
    { status: CandidateStatus.NEW, label: 'New', icon: <Users className="w-4 h-4" /> },
    { status: CandidateStatus.SCREENING, label: 'Screening', icon: <Eye className="w-4 h-4" /> },
    { status: CandidateStatus.SHORTLISTED, label: 'Shortlisted', icon: <Star className="w-4 h-4" /> },
    { status: CandidateStatus.INTERVIEW, label: 'Interview', icon: <UserCheck className="w-4 h-4" /> },
    { status: CandidateStatus.OFFER, label: 'Offer', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map(stage => {
        const stageCandidates = candidates.filter(c => c.status === stage.status);

        return (
          <div
            key={stage.status}
            className="flex-shrink-0 w-72 bg-dark-card rounded-xl border border-dark-border"
          >
            {/* Stage Header */}
            <div className={`p-4 border-b border-dark-border ${getStatusColor(stage.status)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {stage.icon}
                  <span className="font-semibold">{stage.label}</span>
                </div>
                <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full">
                  {stageCandidates.length}
                </span>
              </div>
            </div>

            {/* Candidates */}
            <div className="p-3 space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {stageCandidates.length === 0 ? (
                <div className="text-center py-8 text-dark-muted text-sm">
                  No candidates
                </div>
              ) : (
                stageCandidates.map(candidate => (
                  <div
                    key={candidate.id}
                    onClick={() => onCandidateClick(candidate)}
                    className="bg-dark-bg rounded-lg p-3 border border-dark-border hover:border-primary/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-[#a096f5] flex items-center justify-center text-white font-semibold text-sm">
                        {candidate.firstName[0]}{candidate.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-dark-text text-sm truncate group-hover:text-primary transition-colors">
                          {candidate.firstName} {candidate.lastName}
                        </h4>
                        <p className="text-xs text-dark-muted truncate">
                          {candidate.currentTitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="text-xs font-medium text-primary">
                          {candidate.overallScore}%
                        </div>
                        <div className="w-16 h-1.5 bg-dark-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${candidate.overallScore}%` }}
                          />
                        </div>
                      </div>

                      {candidate.redFlags && candidate.redFlags.length > 0 && (
                        <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}

      {/* Hired/Rejected Column */}
      <div className="flex-shrink-0 w-72 bg-dark-card rounded-xl border border-dark-border">
        <div className="p-4 border-b border-dark-border bg-green-500/10 text-green-500 rounded-t-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold">Hired</span>
            <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full ml-auto">
              {candidates.filter(c => c.status === CandidateStatus.HIRED).length}
            </span>
          </div>
        </div>
        <div className="p-3 max-h-[30vh] overflow-y-auto custom-scrollbar">
          {candidates.filter(c => c.status === CandidateStatus.HIRED).map(candidate => (
            <div
              key={candidate.id}
              onClick={() => onCandidateClick(candidate)}
              className="bg-dark-bg rounded-lg p-2 border border-dark-border mb-2 cursor-pointer hover:border-green-500/50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-dark-text truncate">
                  {candidate.firstName} {candidate.lastName}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-dark-border bg-red-500/10 text-red-500">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span className="font-semibold">Rejected</span>
            <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full ml-auto">
              {candidates.filter(c => c.status === CandidateStatus.REJECTED).length}
            </span>
          </div>
        </div>
        <div className="p-3 max-h-[20vh] overflow-y-auto custom-scrollbar">
          {candidates.filter(c => c.status === CandidateStatus.REJECTED).map(candidate => (
            <div
              key={candidate.id}
              onClick={() => onCandidateClick(candidate)}
              className="bg-dark-bg rounded-lg p-2 border border-dark-border mb-2 cursor-pointer hover:border-red-500/50 opacity-60"
            >
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-dark-text truncate">
                  {candidate.firstName} {candidate.lastName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
