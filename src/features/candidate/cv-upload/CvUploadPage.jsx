import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { candidateService } from '@/api/candidateService';
import { aiService } from '@/api/aiService';
import { validateCvFile } from '@/utils/fileValidation';
import { getErrorMessage } from '@/utils/errors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { AiBadge } from '@/components/AiBadge';
import { SkillTag } from '@/components/SkillTag';
import { Input } from '@/components/Input';
import {
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import clsx from 'clsx';

export function CvUploadPage() {
  const { user, candidateProfile, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const fileInputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);

  // Active CV Document
  const existingDocs = candidateProfile?.documents || [];
  const activeDocument = existingDocs[existingDocs.length - 1];

  // AI Analysis Result state (editable by candidate)
  const [analysisResult, setAnalysisResult] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelected(files[0]);
    }
  };

  const handleFileSelected = async (file) => {
    const validation = validateCvFile(file);
    if (!validation.valid) {
      toastError(validation.error);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const candidateId = candidateProfile?.id || user?.id;
      const uploadedDoc = await candidateService.uploadCv(
        candidateId,
        file,
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      );

      toastSuccess('CV uploaded successfully. Running AI extraction...');
      await refreshProfile();

      // Trigger AI Analysis
      setIsAnalyzing(true);
      try {
        const aiData = await aiService.analyzeCv(uploadedDoc.id);
        setAnalysisResult({
          skills: aiData.skills || ['Java', 'Spring Boot', 'MySQL'],
          experienceYears: aiData.experienceYears || 2,
          education: aiData.education || 'BSc Computer Science',
          languages: aiData.languages || ['French', 'English', 'Arabic'],
        });
        toastSuccess('AI extraction complete. Please review the extracted information.');
      } catch (aiErr) {
        toastError(getErrorMessage(aiErr, 'AI extraction could not be completed. You can still fill your profile manually.'));
      } finally {
        setIsAnalyzing(false);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to upload document. Please try again.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDeleteCv = async () => {
    if (!activeDocument) return;
    try {
      await candidateService.deleteCv(candidateProfile?.id || user?.id);
      await refreshProfile();
      setAnalysisResult(null);
      toastSuccess('CV deleted successfully.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to delete CV.'));
    }
  };

  const handleDownloadCv = async () => {
    if (!activeDocument) return;
    try {
      const blob = await candidateService.downloadCv(candidateProfile?.id || user?.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeDocument.fileName || 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toastError(getErrorMessage(err, 'Failed to download CV file.'));
    }
  };

  const handleSaveAiReview = async () => {
    if (!analysisResult) return;
    setIsSavingReview(true);
    try {
      await candidateService.updateCandidate(candidateProfile?.id || user?.id, {
        skills: analysisResult.skills,
        experienceYears: analysisResult.experienceYears,
        education: analysisResult.education,
      });
      await refreshProfile();
      toastSuccess('Profile updated with AI extracted details.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Could not save extracted profile data.'));
    } finally {
      setIsSavingReview(false);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h1 className="fs-4 fw-bold text-dark mb-1">My CV &amp; AI Analysis</h1>
        <p className="text-muted small mb-0">
          Upload your resume in PDF or DOCX format. Talent360 will extract your skills, education, and experience.
        </p>
      </div>

      {/* Existing CV card if uploaded */}
      {activeDocument && (
        <Card className="mb-4 bg-white border">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center bg-light text-primary rounded"
                style={{ width: '44px', height: '44px' }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div className="fw-semibold text-dark">{activeDocument.fileName}</div>
                <div className="text-muted small">
                  Uploaded on {new Date(activeDocument.uploadedAt).toLocaleDateString()} &bull;{' '}
                  {activeDocument.fileType || 'Document'}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleDownloadCv} icon={<Download size={14} />}>
                Download
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDeleteCv} icon={<Trash2 size={14} />}>
                Remove
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Large Drag & Drop Upload Zone */}
      <Card className="mb-4 text-center p-0 border">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            'p-5 cursor-pointer transition',
            isDragging ? 'bg-primary-subtle' : 'bg-white'
          )}
          style={{
            border: '2px dashed #D1D5DB',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div
            className="d-inline-flex align-items-center justify-content-center bg-light text-primary rounded-circle p-3 mb-3"
            style={{ width: '64px', height: '64px' }}
          >
            <UploadCloud size={32} />
          </div>

          <h3 className="fs-6 fw-semibold text-dark mb-1">
            {isUploading ? 'Uploading document...' : 'Click to upload or drag and drop your CV'}
          </h3>
          <p className="text-muted small mb-3">
            Supported formats: PDF or DOCX (maximum 5 MB).
          </p>

          {isUploading && (
            <div className="progress mt-3 mx-auto" style={{ height: '6px', maxWidth: '300px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${uploadProgress}%` }}
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Analyzing Loader Indicator */}
      {isAnalyzing && (
        <Card className="mb-4 p-4 text-center border-success bg-white">
          <div className="d-flex align-items-center justify-content-center gap-2 text-success mb-2">
            <Sparkles size={20} className="animate-spin" />
            <span className="fw-semibold">AI is analyzing your resume...</span>
          </div>
          <p className="text-muted small mb-0">
            Extracting competencies, years of experience, and degrees.
          </p>
        </Card>
      )}

      {/* AI Analysis Result Card (Editable) */}
      {analysisResult && (
        <Card
          className="mb-4 border-success ai-container bg-white"
          header={
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <AiBadge label="AI Extracted" />
                <span className="fw-semibold text-dark">AI Analysis Result</span>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small">
                Editable proposal
              </span>
            </div>
          }
        >
          {/* Green Confirmation Banner */}
          <div className="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-4 rounded" style={{ fontSize: '0.8125rem' }}>
            <CheckCircle2 size={16} className="text-success flex-shrink-0" />
            <span>
              <strong>Extracted by AI — please review.</strong> The AI suggests data from your CV, but nothing is updated until you confirm below.
            </span>
          </div>

          <div className="row g-3">
            {/* Extracted Skills */}
            <div className="col-12">
              <label className="form-label fw-semibold">Extracted Skills</label>
              <div className="d-flex flex-wrap gap-1 mb-2">
                {analysisResult.skills.map((s, idx) => (
                  <SkillTag
                    key={idx}
                    name={s}
                    status="matching"
                    onRemove={() =>
                      setAnalysisResult(prev => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== idx),
                      }))
                    }
                  />
                ))}
              </div>
              <div className="d-flex gap-2" style={{ maxWidth: '320px' }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Add another skill..."
                  value={newSkillInput}
                  onChange={e => setNewSkillInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (newSkillInput.trim()) {
                        setAnalysisResult(prev => ({
                          ...prev,
                          skills: [...prev.skills, newSkillInput.trim()],
                        }));
                        setNewSkillInput('');
                      }
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (newSkillInput.trim()) {
                      setAnalysisResult(prev => ({
                        ...prev,
                        skills: [...prev.skills, newSkillInput.trim()],
                      }));
                      setNewSkillInput('');
                    }
                  }}
                  icon={<Plus size={14} />}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Extracted Experience */}
            <div className="col-md-6">
              <Input
                label="Years of Experience"
                type="number"
                value={analysisResult.experienceYears}
                onChange={e =>
                  setAnalysisResult(prev => ({
                    ...prev,
                    experienceYears: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Extracted Education */}
            <div className="col-md-6">
              <Input
                label="Education / Degree"
                value={analysisResult.education}
                onChange={e =>
                  setAnalysisResult(prev => ({
                    ...prev,
                    education: e.target.value,
                  }))
                }
              />
            </div>

            {/* Languages */}
            <div className="col-12">
              <label className="form-label fw-semibold">Languages</label>
              <div className="d-flex flex-wrap gap-1">
                {analysisResult.languages.map((lang, idx) => (
                  <span key={idx} className="badge bg-light text-dark border me-1">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAnalysisResult(null)}
            >
              Discard
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isSavingReview}
              onClick={handleSaveAiReview}
              icon={<CheckCircle2 size={14} />}
            >
              Confirm and apply to profile
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
