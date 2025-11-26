import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Candidate, CandidateStatus, ExperienceLevel, JobPosition, User } from '../types';
import { StorageService } from '../services/storageService';

interface BulkUploadProps {
  currentUser: User;
  positions: JobPosition[];
  onUploadComplete: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ currentUser, positions, onUploadComplete }) => {
  const [uploadMethod, setUploadMethod] = useState<'drag-drop' | 'linkedin' | 'manual'>('drag-drop');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  // Manual Entry State
  const [manualData, setManualData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    currentJobTitle: '',
    totalYearsExperience: 0,
    experienceLevel: ExperienceLevel.MID,
    expectedSalary: '',
    skills: '',
    linkedinUrl: '',
    positionId: positions[0]?.id || ''
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsProcessing(true);
    setUploadResults({ success: 0, failed: 0, errors: [] });

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const file of acceptedFiles) {
      try {
        // Simulate resume parsing - in production, use actual parsing service
        const mockCandidate: Candidate = {
          id: StorageService.generateId('cand'),
          firstName: file.name.split('.')[0].split(' ')[0] || 'Unknown',
          lastName: file.name.split('.')[0].split(' ')[1] || 'Candidate',
          email: `${file.name.split('.')[0].toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+1-555-' + Math.floor(1000 + Math.random() * 9000),
          location: 'Remote',
          totalYearsExperience: Math.floor(Math.random() * 10) + 1,
          experienceLevel: ExperienceLevel.MID,
          willingToRelocate: true,
          appliedPositions: positions.length > 0 ? [positions[0].id] : [],
          source: 'DIRECT',
          summary: 'Experienced professional with strong technical background.',
          skills: ['React', 'TypeScript', 'Node.js'],
          education: [],
          workExperience: [],
          certifications: [],
          languages: [{ name: 'English', proficiency: 'NATIVE' }],
          status: CandidateStatus.NEW,
          addedBy: currentUser.id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['bulk-upload'],
          notes: [],
          attachments: [{
            id: StorageService.generateId('att'),
            name: file.name,
            url: URL.createObjectURL(file),
            type: 'RESUME',
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser.id
          }]
        };

        StorageService.saveCandidate(mockCandidate);
        successCount++;
      } catch (error) {
        failedCount++;
        errors.push(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setUploadResults({ success: successCount, failed: failedCount, errors });
    setIsProcessing(false);

    if (successCount > 0) {
      setTimeout(() => {
        onUploadComplete();
      }, 2000);
    }
  }, [currentUser, positions, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const handleLinkedinImport = async () => {
    if (!linkedinUrl.trim()) return;

    setIsProcessing(true);
    setUploadResults({ success: 0, failed: 0, errors: [] });

    try {
      // Simulate LinkedIn profile import - in production, use LinkedIn API
      const mockCandidate: Candidate = {
        id: StorageService.generateId('cand'),
        firstName: 'LinkedIn',
        lastName: 'Import',
        email: 'linkedin.import@example.com',
        phone: '+1-555-' + Math.floor(1000 + Math.random() * 9000),
        location: 'Remote',
        linkedinUrl: linkedinUrl,
        totalYearsExperience: 5,
        experienceLevel: ExperienceLevel.SENIOR,
        willingToRelocate: true,
        appliedPositions: positions.length > 0 ? [positions[0].id] : [],
        source: 'LINKEDIN',
        summary: 'Professional imported from LinkedIn.',
        skills: ['Leadership', 'Management', 'Strategy'],
        education: [],
        workExperience: [],
        certifications: [],
        languages: [{ name: 'English', proficiency: 'PROFESSIONAL' }],
        status: CandidateStatus.NEW,
        addedBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['linkedin-import'],
        notes: [],
        attachments: []
      };

      StorageService.saveCandidate(mockCandidate);
      setUploadResults({ success: 1, failed: 0, errors: [] });
      setLinkedinUrl('');
      setTimeout(() => onUploadComplete(), 2000);
    } catch (error) {
      setUploadResults({
        success: 0,
        failed: 1,
        errors: [`Failed to import LinkedIn profile: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const candidate: Candidate = {
        id: StorageService.generateId('cand'),
        firstName: manualData.firstName,
        lastName: manualData.lastName,
        email: manualData.email,
        phone: manualData.phone,
        location: manualData.location,
        currentJobTitle: manualData.currentJobTitle,
        totalYearsExperience: manualData.totalYearsExperience,
        experienceLevel: manualData.experienceLevel,
        expectedSalary: manualData.expectedSalary ? parseInt(manualData.expectedSalary) : undefined,
        willingToRelocate: false,
        appliedPositions: [manualData.positionId],
        source: 'DIRECT',
        linkedinUrl: manualData.linkedinUrl,
        skills: manualData.skills.split(',').map(s => s.trim()).filter(Boolean),
        education: [],
        workExperience: [],
        certifications: [],
        languages: [],
        status: CandidateStatus.NEW,
        addedBy: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['manual-entry'],
        notes: [],
        attachments: []
      };

      StorageService.saveCandidate(candidate);
      setUploadResults({ success: 1, failed: 0, errors: [] });

      // Reset form
      setManualData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        currentJobTitle: '',
        totalYearsExperience: 0,
        experienceLevel: ExperienceLevel.MID,
        expectedSalary: '',
        skills: '',
        linkedinUrl: '',
        positionId: positions[0]?.id || ''
      });

      setTimeout(() => onUploadComplete(), 2000);
    } catch (error) {
      setUploadResults({
        success: 0,
        failed: 1,
        errors: [`Failed to add candidate: ${error instanceof Error ? error.message : 'Unknown error'}`]
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Method Selector */}
      <div className="bg-dark-card rounded-xl p-4 border border-dark-border">
        <h3 className="font-semibold text-dark-text mb-4">Choose Upload Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'drag-drop', label: 'File Upload', icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', desc: 'Upload PDF, DOCX, or TXT resumes' },
            { id: 'linkedin', label: 'LinkedIn URL', icon: 'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z', desc: 'Import from LinkedIn profile' },
            { id: 'manual', label: 'Manual Entry', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', desc: 'Enter candidate details manually' },
          ].map((method) => (
            <button
              key={method.id}
              onClick={() => setUploadMethod(method.id as any)}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                uploadMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-dark-border hover:border-primary/50'
              }`}
            >
              <svg className={`w-8 h-8 mb-3 ${uploadMethod === method.id ? 'text-primary' : 'text-dark-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={method.icon} />
              </svg>
              <h4 className="font-semibold text-dark-text mb-1">{method.label}</h4>
              <p className="text-sm text-dark-muted">{method.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      {uploadMethod === 'drag-drop' && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-dark-border hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <svg className="w-16 h-16 mx-auto mb-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {isDragActive ? (
              <p className="text-primary font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-dark-text font-medium mb-2">Drag & drop resume files here</p>
                <p className="text-sm text-dark-muted mb-4">or click to browse</p>
                <p className="text-xs text-dark-muted">Supports: PDF, DOC, DOCX, TXT (max 10MB per file)</p>
              </>
            )}
          </div>

          {acceptedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-dark-text mb-2">Selected Files:</h4>
              <ul className="space-y-2">
                {acceptedFiles.map((file) => (
                  <li key={file.name} className="flex items-center gap-2 text-sm text-dark-muted">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {uploadMethod === 'linkedin' && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="font-semibold text-dark-text mb-4">Import from LinkedIn</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">LinkedIn Profile URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
              />
              <p className="text-xs text-dark-muted mt-2">
                💡 Tip: You can also paste multiple URLs separated by commas for batch import
              </p>
            </div>
            <button
              onClick={handleLinkedinImport}
              disabled={!linkedinUrl.trim() || isProcessing}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? 'Importing...' : 'Import from LinkedIn'}
            </button>
          </div>
        </div>
      )}

      {uploadMethod === 'manual' && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="font-semibold text-dark-text mb-4">Manual Entry</h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">First Name *</label>
                <input
                  type="text"
                  required
                  value={manualData.firstName}
                  onChange={(e) => setManualData({ ...manualData, firstName: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Last Name *</label>
                <input
                  type="text"
                  required
                  value={manualData.lastName}
                  onChange={(e) => setManualData({ ...manualData, lastName: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={manualData.email}
                  onChange={(e) => setManualData({ ...manualData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={manualData.phone}
                  onChange={(e) => setManualData({ ...manualData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Location *</label>
                <input
                  type="text"
                  required
                  value={manualData.location}
                  onChange={(e) => setManualData({ ...manualData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Current Job Title</label>
                <input
                  type="text"
                  value={manualData.currentJobTitle}
                  onChange={(e) => setManualData({ ...manualData, currentJobTitle: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Years of Experience *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="50"
                  value={manualData.totalYearsExperience}
                  onChange={(e) => setManualData({ ...manualData, totalYearsExperience: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Experience Level *</label>
                <select
                  required
                  value={manualData.experienceLevel}
                  onChange={(e) => setManualData({ ...manualData, experienceLevel: e.target.value as ExperienceLevel })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                >
                  {Object.values(ExperienceLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Expected Salary</label>
                <input
                  type="number"
                  value={manualData.expectedSalary}
                  onChange={(e) => setManualData({ ...manualData, expectedSalary: e.target.value })}
                  placeholder="e.g., 120000"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={manualData.linkedinUrl}
                  onChange={(e) => setManualData({ ...manualData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-text mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={manualData.skills}
                  onChange={(e) => setManualData({ ...manualData, skills: e.target.value })}
                  placeholder="React, TypeScript, Node.js, AWS"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-text mb-2">Applying for Position *</label>
                <select
                  required
                  value={manualData.positionId}
                  onChange={(e) => setManualData({ ...manualData, positionId: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:border-primary outline-none"
                >
                  {positions.map(pos => (
                    <option key={pos.id} value={pos.id}>{pos.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isProcessing ? 'Adding Candidate...' : 'Add Candidate'}
            </button>
          </form>
        </div>
      )}

      {/* Upload Results */}
      {(uploadResults.success > 0 || uploadResults.failed > 0) && (
        <div className="bg-dark-card rounded-xl p-6 border border-dark-border">
          <h3 className="font-semibold text-dark-text mb-4">Upload Results</h3>
          <div className="space-y-2">
            {uploadResults.success > 0 && (
              <div className="flex items-center gap-2 text-success">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{uploadResults.success} candidate(s) added successfully</span>
              </div>
            )}
            {uploadResults.failed > 0 && (
              <div className="flex items-center gap-2 text-danger">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{uploadResults.failed} candidate(s) failed to process</span>
              </div>
            )}
            {uploadResults.errors.length > 0 && (
              <div className="mt-4 p-3 bg-danger/10 rounded-lg border border-danger/20">
                <h4 className="text-sm font-medium text-danger mb-2">Errors:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {uploadResults.errors.map((error, i) => (
                    <li key={i} className="text-xs text-danger">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-500/5 rounded-xl p-6 border border-blue-500/20">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-medium text-blue-500 mb-2">Pro Tips</h4>
            <ul className="text-sm text-dark-text space-y-1">
              <li>• Use consistent file naming: FirstName_LastName_Resume.pdf</li>
              <li>• Ensure resumes are text-searchable (not scanned images)</li>
              <li>• For LinkedIn import, make sure the profile is public</li>
              <li>• Bulk upload supports up to 50 files at once</li>
              <li>• After upload, candidates will be automatically analyzed for the first open position</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
