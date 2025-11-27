import React, { useState } from 'react';
import {
  X, Download, FileText, Table, FileCode, File,
  CheckSquare, Square, Users, Filter, Loader2
} from 'lucide-react';
import { JobPosition, Candidate, ExportOptions } from '../../hrTypes';

interface ReportExportModalProps {
  position: JobPosition;
  candidates: Candidate[];
  onClose: () => void;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  position,
  candidates,
  onClose
}) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'CSV',
    candidates: [],
    includeAnalysis: true,
    includeNotes: false,
    includeScores: true,
    includeRedFlags: true,
    includeComparison: false,
    template: 'SUMMARY'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());

  const formats = [
    { id: 'CSV', label: 'CSV', icon: <Table className="w-5 h-5" />, description: 'Spreadsheet format' },
    { id: 'XLSX', label: 'Excel', icon: <FileText className="w-5 h-5" />, description: 'Microsoft Excel' },
    { id: 'PDF', label: 'PDF', icon: <File className="w-5 h-5" />, description: 'Print-ready document' },
    { id: 'JSON', label: 'JSON', icon: <FileCode className="w-5 h-5" />, description: 'Developer format' },
  ];

  const templates = [
    { id: 'SUMMARY', label: 'Summary Report', description: 'Key metrics and overview' },
    { id: 'DETAILED', label: 'Detailed Report', description: 'Full candidate analysis' },
    { id: 'COMPARISON', label: 'Comparison Report', description: 'Side-by-side comparison' },
    { id: 'CUSTOM', label: 'Custom', description: 'Select specific fields' },
  ];

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    if (selectedCandidates.size === candidates.length) {
      setSelectedCandidates(new Set());
    } else {
      setSelectedCandidates(new Set(candidates.map(c => c.id)));
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    const candidatesToExport = selectedCandidates.size > 0
      ? candidates.filter(c => selectedCandidates.has(c.id))
      : candidates;

    try {
      // Generate export data
      const exportData = generateExportData(candidatesToExport, exportOptions);

      // Create and download file
      downloadFile(exportData, exportOptions.format);
    } catch (error) {
      console.error('Export failed:', error);
    }

    setIsExporting(false);
    onClose();
  };

  const generateExportData = (candidatesToExport: Candidate[], options: ExportOptions): string => {
    switch (options.format) {
      case 'CSV':
        return generateCSV(candidatesToExport, options);
      case 'JSON':
        return generateJSON(candidatesToExport, options);
      case 'XLSX':
      case 'PDF':
        // For these formats, we'd need additional libraries
        // For now, fallback to CSV
        return generateCSV(candidatesToExport, options);
      default:
        return generateCSV(candidatesToExport, options);
    }
  };

  const generateCSV = (candidatesToExport: Candidate[], options: ExportOptions): string => {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Location',
      'Current Title',
      'Current Company',
      'Experience (Years)',
      'Status',
      'Overall Score',
      'Skills Match',
      'Experience Score',
      'Cultural Fit',
      'AI Recommendation',
      'Salary Expectation',
      'Source',
      'Applied Date'
    ];

    if (options.includeRedFlags) {
      headers.push('Red Flags', 'Red Flag Count');
    }

    if (options.includeAnalysis) {
      headers.push('AI Summary', 'Why Good Fit', 'Concerns');
    }

    if (options.includeNotes) {
      headers.push('Notes Count', 'Latest Note');
    }

    const rows = candidatesToExport.map(c => {
      const row = [
        `${c.firstName} ${c.lastName}`,
        c.email,
        c.phone || '',
        c.location,
        c.currentTitle,
        c.currentCompany || '',
        c.totalYearsExperience.toString(),
        c.status,
        c.overallScore.toString(),
        c.skillMatchScore.toString(),
        c.experienceScore.toString(),
        c.culturalFitScore.toString(),
        c.aiRecommendation || 'N/A',
        c.salaryExpectation?.toString() || '',
        c.source,
        new Date(c.appliedAt).toLocaleDateString()
      ];

      if (options.includeRedFlags) {
        row.push(
          c.redFlags?.map(rf => rf.title).join('; ') || '',
          (c.redFlags?.length || 0).toString()
        );
      }

      if (options.includeAnalysis) {
        row.push(
          c.aiSummary || '',
          c.analysis?.whyGoodFit?.join('; ') || '',
          c.analysis?.whyNotGoodFit?.join('; ') || ''
        );
      }

      if (options.includeNotes) {
        row.push(
          (c.notes?.length || 0).toString(),
          c.notes?.[c.notes.length - 1]?.content || ''
        );
      }

      return row;
    });

    // Escape and format CSV
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    };

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ].join('\n');

    return csvContent;
  };

  const generateJSON = (candidatesToExport: Candidate[], options: ExportOptions): string => {
    const data = candidatesToExport.map(c => {
      const base = {
        name: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        location: c.location,
        currentTitle: c.currentTitle,
        currentCompany: c.currentCompany,
        yearsExperience: c.totalYearsExperience,
        status: c.status,
        scores: {
          overall: c.overallScore,
          skills: c.skillMatchScore,
          experience: c.experienceScore,
          culturalFit: c.culturalFitScore
        },
        aiRecommendation: c.aiRecommendation,
        salaryExpectation: c.salaryExpectation,
        source: c.source,
        appliedAt: c.appliedAt
      };

      if (options.includeRedFlags) {
        (base as any).redFlags = c.redFlags;
        (base as any).strengths = c.strengths;
      }

      if (options.includeAnalysis) {
        (base as any).analysis = {
          summary: c.aiSummary,
          whyGoodFit: c.analysis?.whyGoodFit,
          concerns: c.analysis?.whyNotGoodFit,
          fitBreakdown: c.analysis?.fitBreakdown
        };
      }

      if (options.includeNotes) {
        (base as any).notes = c.notes;
        (base as any).ratings = c.ratings;
      }

      return base;
    });

    return JSON.stringify({
      position: {
        title: position.title,
        department: position.department,
        exportedAt: new Date().toISOString()
      },
      candidates: data,
      summary: {
        total: data.length,
        avgScore: Math.round(data.reduce((sum, c) => sum + c.scores.overall, 0) / data.length)
      }
    }, null, 2);
  };

  const downloadFile = (content: string, format: string) => {
    const mimeTypes: Record<string, string> = {
      CSV: 'text/csv',
      XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      PDF: 'application/pdf',
      JSON: 'application/json'
    };

    const extensions: Record<string, string> = {
      CSV: 'csv',
      XLSX: 'xlsx',
      PDF: 'pdf',
      JSON: 'json'
    };

    const blob = new Blob([content], { type: mimeTypes[format] });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${position.title.replace(/\s+/g, '_')}_candidates_${new Date().toISOString().split('T')[0]}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Export Report
              </h2>
              <p className="text-sm text-dark-muted mt-1">
                Export candidate data for {position.title}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-dark-text mb-3">Export Format</h3>
            <div className="grid grid-cols-4 gap-3">
              {formats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setExportOptions(prev => ({ ...prev, format: format.id as ExportOptions['format'] }))}
                  className={`p-4 rounded-xl border text-center transition-all ${exportOptions.format === format.id
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-dark-bg border-dark-border text-dark-muted hover:border-primary/50'
                    }`}
                >
                  <div className="flex justify-center mb-2">{format.icon}</div>
                  <div className="font-medium text-sm">{format.label}</div>
                  <div className="text-xs opacity-70">{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <h3 className="font-semibold text-dark-text mb-3">Report Template</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setExportOptions(prev => ({ ...prev, template: template.id as ExportOptions['template'] }))}
                  className={`p-4 rounded-xl border text-left transition-all ${exportOptions.template === template.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-dark-bg border-dark-border hover:border-primary/50'
                    }`}
                >
                  <div className={`font-medium ${exportOptions.template === template.id ? 'text-primary' : 'text-dark-text'}`}>
                    {template.label}
                  </div>
                  <div className="text-xs text-dark-muted">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Include Options */}
          <div className="mb-6">
            <h3 className="font-semibold text-dark-text mb-3">Include in Export</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'includeScores', label: 'Scores & Ratings' },
                { key: 'includeAnalysis', label: 'AI Analysis' },
                { key: 'includeRedFlags', label: 'Red Flags & Strengths' },
                { key: 'includeNotes', label: 'Team Notes' },
                { key: 'includeComparison', label: 'Comparison Data' },
              ].map(option => (
                <label
                  key={option.key}
                  className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg border border-dark-border cursor-pointer hover:border-primary/50"
                >
                  <input
                    type="checkbox"
                    checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-dark-text">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Candidate Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-dark-text flex items-center gap-2">
                <Users className="w-4 h-4" />
                Select Candidates
              </h3>
              <button
                onClick={selectAll}
                className="text-sm text-primary hover:text-primary-hover flex items-center gap-1"
              >
                {selectedCandidates.size === candidates.length ? (
                  <>
                    <CheckSquare className="w-4 h-4" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4" />
                    Select All ({candidates.length})
                  </>
                )}
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto custom-scrollbar bg-dark-bg rounded-lg border border-dark-border">
              {candidates.map(c => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 p-3 hover:bg-dark-card cursor-pointer border-b border-dark-border last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedCandidates.has(c.id)}
                    onChange={() => toggleCandidate(c.id)}
                    className="w-4 h-4 rounded border-dark-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-dark-text">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-xs text-dark-muted ml-2">
                      Score: {c.overallScore}%
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${c.status === 'SHORTLISTED' ? 'bg-purple-500/10 text-purple-500' :
                      c.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                        'bg-gray-500/10 text-gray-500'
                    }`}>
                    {c.status}
                  </span>
                </label>
              ))}
            </div>

            <p className="text-xs text-dark-muted mt-2">
              {selectedCandidates.size > 0
                ? `${selectedCandidates.size} candidate(s) selected`
                : `All ${candidates.length} candidates will be exported`}
            </p>
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
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {exportOptions.format}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
