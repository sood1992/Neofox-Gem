import React from 'react';
import { X, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import {
  CandidateFilters, CandidateSortOptions, CandidateStatus,
  SourceType, ExperienceLevel, RedFlagType
} from '../../hrTypes';
import { HRStorageService } from '../../services/hrStorageService';

interface FilterSortPanelProps {
  filters: CandidateFilters;
  sortOptions: CandidateSortOptions;
  onFiltersChange: (filters: CandidateFilters) => void;
  onSortChange: (sort: CandidateSortOptions) => void;
  positionId: string;
}

export const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  filters,
  sortOptions,
  onFiltersChange,
  onSortChange,
  positionId
}) => {
  const allTags = HRStorageService.getAllTags(positionId);
  const allSkills = HRStorageService.getAllSkills(positionId);

  const updateFilter = <K extends keyof CandidateFilters>(key: K, value: CandidateFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <K extends keyof CandidateFilters>(key: K, value: string) => {
    const currentArray = (filters[key] as string[] | undefined) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    updateFilter(key, newArray.length > 0 ? newArray as CandidateFilters[K] : undefined);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(k => filters[k as keyof CandidateFilters] !== undefined);

  return (
    <div className="mt-4 pt-4 border-t border-dark-border animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-dark-muted">
          <Filter className="w-4 h-4" />
          <span>Filters & Sorting</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:text-primary-hover flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Status Filter */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Status</label>
          <select
            multiple
            value={filters.status || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value as CandidateStatus);
              updateFilter('status', values.length > 0 ? values : undefined);
            }}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none h-24"
          >
            {Object.values(CandidateStatus).map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Source</label>
          <select
            multiple
            value={filters.source || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value as SourceType);
              updateFilter('source', values.length > 0 ? values : undefined);
            }}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none h-24"
          >
            {Object.values(SourceType).map(source => (
              <option key={source} value={source}>
                {source.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Experience Level</label>
          <select
            multiple
            value={filters.experienceLevel || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value as ExperienceLevel);
              updateFilter('experienceLevel', values.length > 0 ? values : undefined);
            }}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none h-24"
          >
            {Object.values(ExperienceLevel).map(level => (
              <option key={level} value={level}>
                {level.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Score Range */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Score Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Min"
              value={filters.minScore || ''}
              onChange={(e) => updateFilter('minScore', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            />
            <span className="text-dark-muted">-</span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="Max"
              value={filters.maxScore || ''}
              onChange={(e) => updateFilter('maxScore', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Salary Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.salaryMin || ''}
              onChange={(e) => updateFilter('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            />
            <span className="text-dark-muted">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.salaryMax || ''}
              onChange={(e) => updateFilter('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Red Flags Toggle */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Red Flags</label>
          <select
            value={filters.hasRedFlags === undefined ? '' : filters.hasRedFlags.toString()}
            onChange={(e) => {
              if (e.target.value === '') updateFilter('hasRedFlags', undefined);
              else updateFilter('hasRedFlags', e.target.value === 'true');
            }}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
          >
            <option value="">Any</option>
            <option value="true">Has Red Flags</option>
            <option value="false">No Red Flags</option>
          </select>
        </div>

        {/* AI Recommendation */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">AI Recommendation</label>
          <select
            multiple
            value={filters.aiRecommendation || []}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              updateFilter('aiRecommendation', values.length > 0 ? values : undefined);
            }}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none h-24"
          >
            <option value="STRONGLY_RECOMMEND">Strongly Recommend</option>
            <option value="RECOMMEND">Recommend</option>
            <option value="NEUTRAL">Neutral</option>
            <option value="NOT_RECOMMEND">Not Recommend</option>
            <option value="STRONGLY_NOT_RECOMMEND">Strongly Not Recommend</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Location</label>
          <input
            type="text"
            placeholder="Search location..."
            value={filters.location || ''}
            onChange={(e) => updateFilter('location', e.target.value || undefined)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
          />
        </div>

        {/* Date Range */}
        <div>
          <label className="text-xs text-dark-muted mb-1 block">Applied After</label>
          <input
            type="date"
            value={filters.appliedAfter?.split('T')[0] || ''}
            onChange={(e) => updateFilter('appliedAfter', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
            className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
          />
        </div>

        {/* Sort Options */}
        <div className="col-span-2">
          <label className="text-xs text-dark-muted mb-1 block flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" />
            Sort By
          </label>
          <div className="flex gap-2">
            <select
              value={sortOptions.field}
              onChange={(e) => onSortChange({ ...sortOptions, field: e.target.value as CandidateSortOptions['field'] })}
              className="flex-1 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            >
              <option value="score">Score</option>
              <option value="appliedAt">Applied Date</option>
              <option value="name">Name</option>
              <option value="experience">Experience</option>
              <option value="salary">Salary</option>
              <option value="lastUpdated">Last Updated</option>
            </select>
            <select
              value={sortOptions.direction}
              onChange={(e) => onSortChange({ ...sortOptions, direction: e.target.value as 'asc' | 'desc' })}
              className="w-24 bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-sm text-dark-text focus:border-primary outline-none"
            >
              <option value="desc">High-Low</option>
              <option value="asc">Low-High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="mt-4">
          <label className="text-xs text-dark-muted mb-2 block">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
              const isSelected = filters.tags?.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleArrayFilter('tags', tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isSelected
                      ? 'bg-primary text-white'
                      : 'bg-dark-bg text-dark-muted hover:text-dark-text border border-dark-border'
                    }`}
                >
                  {tag}
                  {isSelected && (
                    <X className="w-3 h-3 inline-block ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">
              Active Filters: {Object.keys(filters).filter(k => filters[k as keyof CandidateFilters] !== undefined).length}
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:text-primary-hover"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
