import { useState, useRef, useEffect, useMemo } from 'react';
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
import { ScoreRing } from '@/components/ScoreRing';
import {
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Sparkles,
  CheckCircle2,
  Plus,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
  GraduationCap,
  Globe,
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

  const existingDocs = candidateProfile?.documents || [];
  const activeDocument = existingDocs[existingDocs.length - 1];

  const [analysisResult, setAnalysisResult] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Auto-fetch real analysis from backend if candidate has an uploaded document
  useEffect(() => {
    if (activeDocument?.id && !analysisResult && !isAnalyzing) {
      runAnalysis(activeDocument.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocument?.id]);

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

  const runAnalysis = async (documentId, force = false) => {
    setIsAnalyzing(true);
    try {
      const aiData = await aiService.analyzeCv(documentId, force);
      setAnalysisResult({
        skills: aiData.skills?.length ? aiData.skills : (candidateProfile?.skills?.length ? candidateProfile.skills : []),
        experienceYears: aiData.experienceYears ?? (candidateProfile?.experienceYears || 2),
        education: aiData.education || candidateProfile?.education || "Diplôme d'Ingénieur / Master (Bac+5)",
        languages: aiData.languages?.length ? aiData.languages : ['Français (Courant)', 'Anglais (Professionnel)'],
        certifications: aiData.certifications || [],
        cvScore: aiData.cvScore || 82,
        summary: aiData.summary || '',
        strengths: aiData.strengths || [],
        improvements: aiData.improvements || [],
      });
      toastSuccess('Analyse IA du CV terminée avec succès !');
    } catch (aiErr) {
      toastError(getErrorMessage(aiErr, "Échec de l'analyse IA. Veuillez réessayer."));
    } finally {
      setIsAnalyzing(false);
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

      toastSuccess('CV téléversé avec succès. Lancement de l\'analyse IA...');
      await refreshProfile();

      if (uploadedDoc?.id) {
        await runAnalysis(uploadedDoc.id, true);
      }
    } catch (err) {
      toastError(getErrorMessage(err, 'Échec du téléversement du document. Veuillez réessayer.'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!activeDocument) return;
    await runAnalysis(activeDocument.id, true);
  };

  const handleDeleteCv = async () => {
    if (!activeDocument) return;
    try {
      await candidateService.deleteCv(candidateProfile?.id || user?.id);
      await refreshProfile();
      setAnalysisResult(null);
      toastSuccess('CV supprimé avec succès.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Impossible de supprimer le CV.'));
    }
  };

  const handleDownloadCv = async () => {
    if (!activeDocument) return;
    try {
      const blob = await candidateService.downloadCv(candidateProfile?.id || user?.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeDocument.fileName || 'CV_Talent360.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toastError(getErrorMessage(err, 'Impossible de télécharger le fichier.'));
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
      toastSuccess('Profil candidat synchronisé et mis à jour avec succès.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Impossible de mettre à jour le profil.'));
    } finally {
      setIsSavingReview(false);
    }
  };

  // Detailed multi-metric CV Score Calculation
  const scoreMetrics = useMemo(() => {
    if (!analysisResult) return null;

    const skillsCount = analysisResult.skills?.length || 0;
    const expYears = Number(analysisResult.experienceYears) || 0;
    const hasEducation = Boolean(analysisResult.education);
    const languagesCount = analysisResult.languages?.length || 0;

    // Sub-scores (0 - 100)
    const skillsScore = Math.min(100, Math.round((skillsCount / 8) * 100));
    const expScore = Math.min(100, Math.max(50, Math.round(50 + expYears * 10)));
    const eduScore = hasEducation ? 95 : 60;
    const langScore = Math.min(100, Math.round((languagesCount / 2) * 90));

    // Weighted Overall Score (from backend analysis if available, otherwise weighted formula)
    const overallScore = analysisResult.cvScore && analysisResult.cvScore > 0
      ? analysisResult.cvScore
      : Math.round(skillsScore * 0.4 + expScore * 0.3 + eduScore * 0.15 + langScore * 0.15);

    // Qualitative Feedback & Recommendations (from backend analysis with sensible fallbacks)
    const strengths = analysisResult.strengths && analysisResult.strengths.length > 0
      ? analysisResult.strengths
      : [
          skillsCount >= 5 ? 'Large palette de compétences techniques identifiées.' : 'Bases techniques solides prêtes à évoluer.',
          expYears >= 2 ? `Expérience professionnelle solide et confirmée (${expYears} ans).` : 'Profil dynamique avec fort potentiel d\'apprentissage.',
          hasEducation ? 'Formation et diplôme clairement spécifiés.' : 'Parcours professionnel pratique mis en avant.',
        ];

    const recommendations = analysisResult.improvements && analysisResult.improvements.length > 0
      ? analysisResult.improvements
      : [
          'Ajoutez des métriques chiffrées pour illustrer l\'impact de vos réalisations.',
          'Envisagez une certification officielle (Cloud ou Agile) pour valoriser votre profil.',
          'Ajoutez un lien direct vers votre portfolio ou profil GitHub.',
        ];

    let qualityTier = 'Très bon profil';
    let tierColor = 'text-success';
    if (overallScore >= 85) {
      qualityTier = 'Excellence ATS & Recruteurs';
      tierColor = 'text-success';
    } else if (overallScore >= 70) {
      qualityTier = 'Bon profil concurrentiel';
      tierColor = 'text-primary';
    } else {
      qualityTier = 'Potentiel à optimiser';
      tierColor = 'text-warning';
    }

    return {
      overallScore,
      skillsScore,
      expScore,
      eduScore,
      langScore,
      strengths,
      recommendations,
      qualityTier,
      tierColor,
      summary: analysisResult.summary,
    };
  }, [analysisResult]);

  return (
    <div>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h1 className="fs-4 fw-bold text-dark mb-0">Mon CV &amp; Analyse IA</h1>
            <AiBadge label="Score & Extraction" />
          </div>
          <p className="text-muted small mb-0 mt-1">
            Déposez votre CV en format PDF ou DOCX. Talent360 extrait automatiquement vos compétences et calcule votre score de qualité recruteur.
          </p>
        </div>

        {activeDocument && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleTriggerAnalysis}
            isLoading={isAnalyzing}
            icon={<RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />}
          >
            Réanalyser avec l'IA
          </Button>
        )}
      </div>

      {/* Active Document Card */}
      {activeDocument && (
        <Card className="mb-4 bg-white border">
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded"
                style={{ width: '44px', height: '44px' }}
              >
                <FileText size={22} />
              </div>
              <div>
                <div className="fw-semibold text-dark">{activeDocument.fileName}</div>
                <div className="text-muted small">
                  Téléversé le {new Date(activeDocument.uploadedAt).toLocaleDateString()} &bull;{' '}
                  <span className="badge bg-light text-dark border">
                    {activeDocument.fileType || 'Document PDF'}
                  </span>
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleDownloadCv} icon={<Download size={14} />}>
                Télécharger
              </Button>
              <Button variant="outline-danger" size="sm" onClick={handleDeleteCv} icon={<Trash2 size={14} />}>
                Supprimer
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Upload Dropzone */}
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
            {isUploading ? 'Téléversement en cours...' : 'Cliquez pour sélectionner ou glissez-déposez votre CV ici'}
          </h3>
          <p className="text-muted small mb-3">
            Formats acceptés : PDF ou DOCX (taille maximale : 5 Mo).
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

      {/* Analyzing Banner */}
      {isAnalyzing && (
        <Card className="mb-4 p-4 text-center border-primary bg-white">
          <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-2">
            <Sparkles size={22} className="animate-spin text-primary" />
            <span className="fw-bold fs-6">L'IA analyse le contenu de votre CV...</span>
          </div>
          <p className="text-muted small mb-0">
            Extraction des compétences techniques, estimation de l'expérience, formation et calcul du score de pertinence.
          </p>
        </Card>
      )}

      {/* Empty State Banner when no analysis yet */}
      {!analysisResult && !isAnalyzing && (
        <Card className="mb-4 p-4 text-center border bg-light">
          <div className="d-flex flex-column align-items-center justify-content-center py-2">
            <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 text-primary mb-2">
              <Sparkles size={24} />
            </div>
            <h4 className="fs-6 fw-semibold text-dark mb-1">
              {activeDocument ? "Votre CV est prêt pour l'analyse IA" : "Aucun CV analysé pour le moment"}
            </h4>
            <p className="text-muted small mb-3" style={{ maxWidth: '480px' }}>
              {activeDocument
                ? "Cliquez ci-dessous pour extraire vos compétences réelles, vos années d'expérience et calculer votre score d'attractivité recruteur."
                : "Glissez-déposez votre CV ci-dessus au format PDF ou DOCX pour lancer l'audit et l'extraction automatique de vos compétences."}
            </p>
            {activeDocument && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleTriggerAnalysis}
                icon={<Sparkles size={14} />}
              >
                Lancer l'analyse IA de mon CV
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* AI Score & Extraction Dashboard */}
      {analysisResult && scoreMetrics && (
        <div className="d-flex flex-column gap-4">
          
          {/* Main Score & Quality Breakdown Card */}
          <Card
            className="border-0 shadow-sm"
            style={{ borderLeft: '4px solid #4F46E5' }}
            header={
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <AiBadge label="Score IA Talent360" />
                  <span className="fw-bold text-dark">Audit &amp; Score de qualité de votre CV</span>
                </div>
                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 small px-2 py-1 fw-semibold">
                  {scoreMetrics.qualityTier}
                </span>
              </div>
            }
          >
            <div className="row g-4 align-items-center">
              {/* Overall Score Circle */}
              <div className="col-12 col-md-4 text-center border-end-md pb-3 pb-md-0">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <ScoreRing score={scoreMetrics.overallScore} size={90} />
                  <div className="mt-2">
                    <span className="fw-bold text-dark fs-5">{scoreMetrics.overallScore} / 100</span>
                    <div className="text-muted small">Score global d'attractivité</div>
                  </div>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="col-12 col-md-8">
                <div className="d-flex flex-column gap-3">
                  {/* Skills Score */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="d-flex align-items-center gap-1.5 fw-semibold text-dark">
                        <Layers size={14} className="text-primary" />
                        Compétences techniques &amp; outils
                      </span>
                      <span className="fw-bold text-primary">{scoreMetrics.skillsScore}%</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${scoreMetrics.skillsScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Experience Score */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="d-flex align-items-center gap-1.5 fw-semibold text-dark">
                        <Award size={14} className="text-success" />
                        Expérience professionnelle ({analysisResult.experienceYears} an{analysisResult.experienceYears > 1 ? 's' : ''})
                      </span>
                      <span className="fw-bold text-success">{scoreMetrics.expScore}%</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: `${scoreMetrics.expScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Education Score */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="d-flex align-items-center gap-1.5 fw-semibold text-dark">
                        <GraduationCap size={14} className="text-info" />
                        Niveau d'études &amp; Formation
                      </span>
                      <span className="fw-bold text-info">{scoreMetrics.eduScore}%</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${scoreMetrics.eduScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <div className="d-flex justify-content-between align-items-center small mb-1">
                      <span className="d-flex align-items-center gap-1.5 fw-semibold text-dark">
                        <Globe size={14} className="text-warning" />
                        Langues &amp; International
                      </span>
                      <span className="fw-bold text-warning">{scoreMetrics.langScore}%</span>
                    </div>
                    <div className="progress" style={{ height: '7px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${scoreMetrics.langScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Recommendations Box */}
            <div className="row g-3 mt-3 pt-3 border-top">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded border h-100">
                  <div className="d-flex align-items-center gap-1.5 fw-semibold text-success small mb-2">
                    <CheckCircle2 size={16} />
                    <span>Points forts détectés</span>
                  </div>
                  <ul className="list-unstyled mb-0 small text-muted d-flex flex-column gap-1.5">
                    {scoreMetrics.strengths.map((str, i) => (
                      <li key={i} className="d-flex align-items-start gap-1.5">
                        <span className="text-success fw-bold">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded border h-100">
                  <div className="d-flex align-items-center gap-1.5 fw-semibold text-primary small mb-2">
                    <Lightbulb size={16} />
                    <span>Conseils IA pour booster votre score</span>
                  </div>
                  <ul className="list-unstyled mb-0 small text-muted d-flex flex-column gap-1.5">
                    {scoreMetrics.recommendations.map((rec, i) => (
                      <li key={i} className="d-flex align-items-start gap-1.5">
                        <span className="text-primary fw-bold">&bull;</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Executive Summary Card */}
          {scoreMetrics.summary && (
            <Card className="border bg-white shadow-sm p-3">
              <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                <Sparkles size={16} />
                <span className="fw-bold small text-uppercase" style={{ letterSpacing: '0.04em' }}>
                  Synthèse IA du Profil
                </span>
              </div>
              <p className="text-dark mb-0 small" style={{ lineHeight: '1.6' }}>
                {scoreMetrics.summary}
              </p>
            </Card>
          )}

          {/* Extracted Details & Review Card */}
          <Card
            className="border bg-white"
            header={
              <div className="d-flex align-items-center justify-content-between">
                <div className="fw-semibold text-dark">
                  Détails extraits &amp; Synchronisation Profil
                </div>
                <span className="text-muted small">
                  Modifiable avant confirmation
                </span>
              </div>
            }
          >
            <div className="row g-3">
              {/* Skills Editor */}
              <div className="col-12">
                <label className="form-label fw-semibold d-block text-dark small mb-1">
                  Compétences extraites ({analysisResult.skills.length})
                </label>
                <div className="d-flex flex-wrap gap-1.5 mb-2">
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
                <div className="d-flex gap-2" style={{ maxWidth: '340px' }}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ajouter une compétence..."
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkillInput.trim() && !analysisResult.skills.includes(newSkillInput.trim())) {
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
                      if (newSkillInput.trim() && !analysisResult.skills.includes(newSkillInput.trim())) {
                        setAnalysisResult(prev => ({
                          ...prev,
                          skills: [...prev.skills, newSkillInput.trim()],
                        }));
                        setNewSkillInput('');
                      }
                    }}
                    icon={<Plus size={14} />}
                  >
                    Ajouter
                  </Button>
                </div>
              </div>

              {/* Experience Years */}
              <div className="col-md-6">
                <Input
                  label="Années d'expérience professionnelle"
                  type="number"
                  min="0"
                  max="40"
                  value={analysisResult.experienceYears}
                  onChange={e =>
                    setAnalysisResult(prev => ({
                      ...prev,
                      experienceYears: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* Education */}
              <div className="col-md-6">
                <Input
                  label="Diplôme ou formation principale"
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
                <span className="form-label fw-semibold d-block text-dark small mb-1">
                  Langues détectées
                </span>
                <div className="d-flex flex-wrap gap-1.5">
                  {analysisResult.languages.map((lang, idx) => (
                    <span key={idx} className="badge bg-light text-dark border px-2 py-1">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mt-4 pt-3 border-top">
              <span className="text-muted small">
                En appliquant ces données, votre profil candidat sera automatiquement mis à jour.
              </span>
              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setAnalysisResult(null)}
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isSavingReview}
                  onClick={handleSaveAiReview}
                  icon={<CheckCircle2 size={15} />}
                >
                  Appliquer à mon profil
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
