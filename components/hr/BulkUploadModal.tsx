import React, { useState, useCallback } from 'react';
import {
  X, Upload, FileText, Link2, Check, AlertCircle, Loader2,
  File, Trash2, RefreshCw, Sparkles
} from 'lucide-react';
import {
  JobPosition, Candidate, CandidateStatus, SourceType, ExperienceLevel,
  BatchUpload, BatchFile
} from '../../hrTypes';
import { HRStorageService } from '../../services/hrStorageService';
import { CandidateAnalysisService } from '../../services/candidateAnalysisService';

interface BulkUploadModalProps {
  position: JobPosition;
  onClose: () => void;
  onUploadComplete: () => void;
}

type UploadTab = 'files' | 'linkedin' | 'paste';

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
  candidateId?: string;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  position,
  onClose,
  onUploadComplete
}) => {
  const [activeTab, setActiveTab] = useState<UploadTab>('files');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [linkedinUrls, setLinkedinUrls] = useState<string>('');
  const [pastedResume, setPastedResume] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'application/pdf' ||
      file.type === 'application/msword' ||
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'text/plain'
    );

    addFiles(files);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'pending',
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFiles = async () => {
    setIsProcessing(true);
    setProcessingMessage('Starting batch processing...');

    const filesToProcess = uploadedFiles.filter(f => f.status === 'pending');

    for (let i = 0; i < filesToProcess.length; i++) {
      const uploadedFile = filesToProcess[i];
      setProcessingMessage(`Processing ${i + 1} of ${filesToProcess.length}: ${uploadedFile.file.name}`);

      // Update status to processing
      setUploadedFiles(prev => prev.map(f =>
        f.id === uploadedFile.id ? { ...f, status: 'processing', progress: 10 } : f
      ));

      try {
        // Read file content
        const text = await readFileAsText(uploadedFile.file);

        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? { ...f, progress: 30 } : f
        ));

        // Parse resume with AI
        const parsedData = await CandidateAnalysisService.parseResume(text);

        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? { ...f, progress: 60 } : f
        ));

        // Create candidate
        const candidate = createCandidateFromParsed(parsedData, uploadedFile.file.name);

        // Analyze candidate
        const analysis = await CandidateAnalysisService.analyzeCandidate(candidate, position);

        if (analysis) {
          candidate.analysis = analysis;
          candidate.overallScore = analysis.overallFitScore;
          candidate.skillMatchScore = analysis.skillsAnalysis?.skillStrengthScore || 50;
          candidate.experienceScore = analysis.fitBreakdown?.experienceFit || 50;
          candidate.culturalFitScore = analysis.fitBreakdown?.culturalFit || 50;
          candidate.aiRecommendation = getRecommendation(analysis.overallFitScore);
          candidate.aiSummary = analysis.narrativeSummary;
        }

        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? { ...f, progress: 90 } : f
        ));

        // Save candidate
        HRStorageService.saveCandidate(candidate);

        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? { ...f, status: 'success', progress: 100, candidateId: candidate.id } : f
        ));

      } catch (error) {
        console.error('Error processing file:', error);
        setUploadedFiles(prev => prev.map(f =>
          f.id === uploadedFile.id ? {
            ...f,
            status: 'error',
            progress: 0,
            error: error instanceof Error ? error.message : 'Processing failed'
          } : f
        ));
      }

      // Small delay between files
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setProcessingMessage('Processing complete!');
    setIsProcessing(false);
  };

  const processLinkedIn = async () => {
    const urls = linkedinUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.includes('linkedin.com'));

    if (urls.length === 0) return;

    setIsProcessing(true);
    setProcessingMessage('Processing LinkedIn profiles...');

    for (let i = 0; i < urls.length; i++) {
      setProcessingMessage(`Processing ${i + 1} of ${urls.length} profiles...`);

      try {
        // Create basic candidate from LinkedIn URL
        const candidate = createCandidateFromLinkedIn(urls[i]);
        HRStorageService.saveCandidate(candidate);
      } catch (error) {
        console.error('Error processing LinkedIn:', error);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsProcessing(false);
    onUploadComplete();
  };

  const processPastedResume = async () => {
    if (!pastedResume.trim()) return;

    setIsProcessing(true);
    setProcessingMessage('Analyzing pasted resume...');

    try {
      const parsedData = await CandidateAnalysisService.parseResume(pastedResume);
      const candidate = createCandidateFromParsed(parsedData, 'Pasted Resume');

      const analysis = await CandidateAnalysisService.analyzeCandidate(candidate, position);
      if (analysis) {
        candidate.analysis = analysis;
        candidate.overallScore = analysis.overallFitScore;
        candidate.aiRecommendation = getRecommendation(analysis.overallFitScore);
        candidate.aiSummary = analysis.narrativeSummary;
      }

      HRStorageService.saveCandidate(candidate);
      onUploadComplete();
    } catch (error) {
      console.error('Error processing pasted resume:', error);
    }

    setIsProcessing(false);
  };

  const createCandidateFromParsed = (parsedData: any, fileName: string): Candidate => {
    const nameParts = (parsedData?.name || fileName.replace(/\.[^/.]+$/, '')).split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || 'Candidate';

    // Calculate experience from work history
    let totalYears = 0;
    if (parsedData?.workExperience?.length > 0) {
      const earliest = parsedData.workExperience.reduce((min: any, exp: any) => {
        const startDate = new Date(exp.startDate);
        return startDate < new Date(min.startDate) ? exp : min;
      });
      const earliestDate = new Date(earliest.startDate);
      totalYears = Math.round((Date.now() - earliestDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    }

    const experienceLevel = totalYears >= 10 ? ExperienceLevel.LEAD :
      totalYears >= 7 ? ExperienceLevel.SENIOR :
        totalYears >= 4 ? ExperienceLevel.MID :
          totalYears >= 2 ? ExperienceLevel.JUNIOR : ExperienceLevel.ENTRY;

    return {
      id: '',
      positionId: position.id,
      firstName,
      lastName,
      email: parsedData?.email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: parsedData?.phone,
      location: parsedData?.location || 'Unknown',
      linkedinUrl: parsedData?.linkedin,
      githubUrl: parsedData?.github,
      portfolioUrl: parsedData?.portfolio,
      source: SourceType.RESUME_UPLOAD,
      currentTitle: parsedData?.workExperience?.[0]?.title || 'Professional',
      currentCompany: parsedData?.workExperience?.[0]?.company,
      experienceLevel,
      totalYearsExperience: totalYears || 3,
      parsedData,
      overallScore: 50,
      skillMatchScore: 50,
      experienceScore: 50,
      culturalFitScore: 50,
      customScores: [],
      status: CandidateStatus.NEW,
      stage: 1,
      redFlags: [],
      strengths: [],
      notes: [],
      ratings: [],
      tags: [],
      appliedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  };

  const createCandidateFromLinkedIn = (url: string): Candidate => {
    // Extract username from LinkedIn URL
    const match = url.match(/linkedin\.com\/in\/([^\/\?]+)/);
    const username = match ? match[1] : 'linkedin-user';
    const nameParts = username.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1));

    return {
      id: '',
      positionId: position.id,
      firstName: nameParts[0] || 'LinkedIn',
      lastName: nameParts.slice(1, 3).join(' ') || 'User',
      email: `${username}@linkedin.com`,
      location: 'Unknown',
      linkedinUrl: url,
      source: SourceType.LINKEDIN,
      currentTitle: 'Professional',
      experienceLevel: ExperienceLevel.MID,
      totalYearsExperience: 3,
      overallScore: 50,
      skillMatchScore: 50,
      experienceScore: 50,
      culturalFitScore: 50,
      customScores: [],
      status: CandidateStatus.NEW,
      stage: 1,
      redFlags: [],
      strengths: [],
      notes: [],
      ratings: [],
      tags: ['needs-review'],
      appliedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
  };

  const getRecommendation = (score: number): 'STRONGLY_RECOMMEND' | 'RECOMMEND' | 'NEUTRAL' | 'NOT_RECOMMEND' | 'STRONGLY_NOT_RECOMMEND' => {
    if (score >= 85) return 'STRONGLY_RECOMMEND';
    if (score >= 70) return 'RECOMMEND';
    if (score >= 50) return 'NEUTRAL';
    if (score >= 30) return 'NOT_RECOMMEND';
    return 'STRONGLY_NOT_RECOMMEND';
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const successCount = uploadedFiles.filter(f => f.status === 'success').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-dark-card w-full max-w-2xl rounded-2xl border border-dark-border shadow-2xl animate-scale-up max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-dark-text flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Candidates
              </h2>
              <p className="text-sm text-dark-muted mt-1">
                For: {position.title}
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
            {(['files', 'linkedin', 'paste'] as UploadTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-dark-bg text-dark-muted hover:text-dark-text'
                  }`}
              >
                {tab === 'files' ? 'Upload Files' :
                  tab === 'linkedin' ? 'LinkedIn URLs' : 'Paste Resume'}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'files' && (
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-dark-border hover:border-primary/50'
                  }`}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-dark-muted'}`} />
                <p className="text-dark-text font-medium mb-1">
                  Drop resume files here
                </p>
                <p className="text-dark-muted text-sm mb-4">
                  or click to browse (PDF, DOC, DOCX, TXT)
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg cursor-pointer transition-all"
                >
                  Browse Files
                </label>
              </div>

              {/* File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-dark-muted">
                      {uploadedFiles.length} file(s) selected
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      {successCount > 0 && (
                        <span className="text-green-500 flex items-center gap-1">
                          <Check className="w-3 h-3" /> {successCount} processed
                        </span>
                      )}
                      {errorCount > 0 && (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errorCount} failed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
                    {uploadedFiles.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 bg-dark-bg rounded-lg p-3 border border-dark-border"
                      >
                        <File className="w-5 h-5 text-dark-muted flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-dark-text truncate">
                            {file.file.name}
                          </p>
                          {file.status === 'processing' && (
                            <div className="w-full h-1 bg-dark-border rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                          {file.error && (
                            <p className="text-xs text-red-500 mt-1">{file.error}</p>
                          )}
                        </div>
                        {file.status === 'pending' && (
                          <button
                            onClick={() => removeFile(file.id)}
                            className="p-1 hover:bg-dark-border rounded"
                          >
                            <Trash2 className="w-4 h-4 text-dark-muted" />
                          </button>
                        )}
                        {file.status === 'processing' && (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        )}
                        {file.status === 'success' && (
                          <Check className="w-4 h-4 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Link2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-500 font-medium">LinkedIn Profile Import</p>
                  <p className="text-xs text-dark-muted mt-1">
                    Paste LinkedIn profile URLs (one per line) to create candidate entries.
                    Full profile data requires additional integration.
                  </p>
                </div>
              </div>

              <textarea
                value={linkedinUrls}
                onChange={(e) => setLinkedinUrls(e.target.value)}
                placeholder="https://linkedin.com/in/johndoe&#10;https://linkedin.com/in/janesmith&#10;..."
                rows={8}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary outline-none resize-none font-mono text-sm"
              />

              <p className="text-xs text-dark-muted">
                {linkedinUrls.split('\n').filter(url => url.includes('linkedin.com')).length} valid LinkedIn URLs detected
              </p>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-500 font-medium">AI Resume Parsing</p>
                  <p className="text-xs text-dark-muted mt-1">
                    Paste resume text directly. Our AI will extract all relevant information
                    and create a fully analyzed candidate profile.
                  </p>
                </div>
              </div>

              <textarea
                value={pastedResume}
                onChange={(e) => setPastedResume(e.target.value)}
                placeholder="Paste resume text here...&#10;&#10;John Doe&#10;Senior Software Engineer&#10;john.doe@email.com&#10;..."
                rows={12}
                className="w-full bg-dark-bg border border-dark-border rounded-lg px-4 py-3 text-dark-text focus:border-primary outline-none resize-none text-sm"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-border bg-dark-bg/50">
          {isProcessing && (
            <div className="flex items-center gap-3 mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-primary">{processingMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 text-dark-muted hover:text-dark-text transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab === 'files' && successCount > 0 && !isProcessing && (
                <button
                  onClick={onUploadComplete}
                  className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
                >
                  View Candidates
                </button>
              )}

              <button
                onClick={() => {
                  if (activeTab === 'files') processFiles();
                  else if (activeTab === 'linkedin') processLinkedIn();
                  else processPastedResume();
                }}
                disabled={isProcessing || (activeTab === 'files' && pendingCount === 0) ||
                  (activeTab === 'linkedin' && !linkedinUrls.includes('linkedin.com')) ||
                  (activeTab === 'paste' && !pastedResume.trim())}
                className="px-6 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {activeTab === 'files' ? `Process ${pendingCount} Files` :
                      activeTab === 'linkedin' ? 'Import Profiles' : 'Analyze Resume'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
