import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { candidateService } from '@/api/candidateService';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { SkillTag } from '@/components/SkillTag';
import { Skeleton } from '@/components/Skeleton';
import { getErrorMessage } from '@/utils/errors';
import { ContractType, WorkMode } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';
import {
  Save,
  Plus,
  Phone,
  Globe,
  Award,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

const POPULAR_SKILLS = [
  'React',
  'Spring Boot',
  'Java',
  'TypeScript',
  'Node.js',
  'Python',
  'Docker',
  'Kubernetes',
  'AWS',
  'PostgreSQL',
  'MySQL',
  'Git',
  'Tailwind CSS',
  'Figma',
  'REST APIs',
  'CI/CD',
];

export function CandidateProfilePage() {
  const { user, candidateProfile, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'skills' | 'preferences'
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      location: 'Casablanca',
      linkedin: '',
      github: '',
      bio: '',
      experienceYears: 3,
      education: '',
      preferredWorkMode: WorkMode.HYBRID,
      preferredContractType: ContractType.CDI,
    },
  });

  const formValues = watch();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const candidate = await candidateService.getCandidate(candidateProfile?.id || 'me');
        if (candidate) {
          let parsedPreferences = {};
          try {
            if (candidate.preferencesJson) {
              parsedPreferences = JSON.parse(candidate.preferencesJson);
            }
          } catch {}

          reset({
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            phone: candidate.phone || '',
            location: candidate.location || 'Casablanca',
            linkedin: candidate.linkedin || '',
            github: candidate.github || '',
            bio: candidate.bio || '',
            experienceYears: candidate.experienceYears || 0,
            education: candidate.education || '',
            preferredWorkMode: parsedPreferences.workMode || WorkMode.HYBRID,
            preferredContractType: parsedPreferences.contractType || ContractType.CDI,
          });

          setSkills(candidate.skills || ['Java', 'Spring Boot', 'React', 'Docker']);
        }
      } catch (err) {
        toastError(getErrorMessage(err, 'Impossible de charger votre profil.'));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [candidateProfile?.id, reset, toastError]);

  // Profile completion calculation
  const completionStats = useMemo(() => {
    let completedItems = 0;
    const totalItems = 7;

    if (formValues.firstName && formValues.lastName) completedItems++;
    if (formValues.phone) completedItems++;
    if (formValues.bio) completedItems++;
    if (skills.length >= 3) completedItems++;
    if (formValues.education) completedItems++;
    if (Number(formValues.experienceYears) > 0) completedItems++;
    if (candidateProfile?.documents?.length > 0) completedItems++;

    const percentage = Math.round((completedItems / totalItems) * 100);
    return { completedItems, totalItems, percentage };
  }, [formValues, skills, candidateProfile?.documents]);

  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
    }
  };

  const handleAddSuggestedSkill = (skill) => {
    if (!skills.includes(skill)) {
      setSkills(prev => [...prev, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const onSubmit = async (values) => {
    setIsSaving(true);
    try {
      const preferencesJson = JSON.stringify({
        workMode: values.preferredWorkMode,
        contractType: values.preferredContractType,
      });

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        location: values.location,
        linkedin: values.linkedin,
        github: values.github,
        bio: values.bio,
        skills,
        experienceYears: Number(values.experienceYears) || 0,
        education: values.education,
        preferencesJson,
      };

      await candidateService.updateCandidate(candidateProfile?.id || user?.id, payload);
      await refreshProfile();
      toastSuccess('Profil mis à jour et enregistré avec succès.');
    } catch (err) {
      toastError(getErrorMessage(err, 'Impossible d\'enregistrer le profil.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-3">
        <Skeleton count={6} height={50} className="mb-3" />
      </div>
    );
  }

  const hasCv = candidateProfile?.documents && candidateProfile.documents.length > 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-5">
      {/* Top Header with Sticky Action */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4 sticky-top bg-light py-2" style={{ zIndex: 10 }}>
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">Mon Profil Candidat</h1>
          <p className="text-muted small mb-0">
            Renseignez vos informations clés pour maximiser le matching de l'IA avec les offres d'emploi.
          </p>
        </div>
        <Button type="submit" variant="primary" isLoading={isSaving} icon={<Save size={16} />}>
          Enregistrer les modifications
        </Button>
      </div>

      {/* Completion Banner */}
      <Card className="mb-4 border-0 shadow-sm bg-white" style={{ borderLeft: '4px solid #4F46E5' }}>
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold text-dark small d-flex align-items-center gap-1.5">
                <Sparkles size={15} className="text-primary" />
                Niveau de complétion de votre profil :
                <strong className="text-primary">{completionStats.percentage}%</strong>
              </span>
              <span className="text-muted small">
                {completionStats.completedItems} / {completionStats.totalItems} étapes validées
              </span>
            </div>
            <div className="progress" style={{ height: '7px' }}>
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${completionStats.percentage}%` }}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <Link to={ROUTES.CANDIDATE_CV} className="btn btn-secondary btn-sm d-inline-flex align-items-center gap-1.5">
              <FileText size={14} className={hasCv ? 'text-success' : 'text-warning'} />
              <span>{hasCv ? 'CV rattaché' : 'Ajouter mon CV'}</span>
            </Link>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="d-flex gap-2 border-bottom pb-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('personal')}
          className={clsx(
            'btn btn-sm d-inline-flex align-items-center gap-1.5 border-0',
            activeTab === 'personal'
              ? 'btn-primary'
              : 'btn-secondary text-muted'
          )}
        >
          <User size={14} />
          <span>1. Informations Personnelles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={clsx(
            'btn btn-sm d-inline-flex align-items-center gap-1.5 border-0',
            activeTab === 'skills'
              ? 'btn-primary'
              : 'btn-secondary text-muted'
          )}
        >
          <Award size={14} />
          <span>2. Compétences &amp; Formation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preferences')}
          className={clsx(
            'btn btn-sm d-inline-flex align-items-center gap-1.5 border-0',
            activeTab === 'preferences'
              ? 'btn-primary'
              : 'btn-secondary text-muted'
          )}
        >
          <Briefcase size={14} />
          <span>3. Préférences d'emploi</span>
        </button>
      </div>

      {/* Tab 1: Informations Personnelles */}
      {activeTab === 'personal' && (
        <div className="d-flex flex-column gap-4">
          <Card header={<div className="fw-semibold text-dark">Coordonnées et Identité</div>}>
            <div className="row g-3">
              <div className="col-md-6">
                <Input label="Prénom" required placeholder="Ex: Sarah" {...register('firstName')} />
              </div>
              <div className="col-md-6">
                <Input label="Nom" required placeholder="Ex: Connor" {...register('lastName')} />
              </div>
              <div className="col-md-6">
                <Input
                  label="Adresse Email"
                  value={user?.email || ''}
                  disabled
                  helperText="L'adresse email est liée à votre compte et ne peut pas être changée ici."
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Numéro de téléphone"
                  placeholder="+212 600-000000"
                  leftIcon={<Phone size={14} />}
                  {...register('phone')}
                />
              </div>
              <div className="col-md-6">
                <Select
                  label="Ville de résidence"
                  options={[
                    { label: 'Casablanca', value: 'Casablanca' },
                    { label: 'Rabat', value: 'Rabat' },
                    { label: 'Marrakech', value: 'Marrakech' },
                    { label: 'Tanger', value: 'Tangier' },
                    { label: 'Agadir', value: 'Agadir' },
                    { label: 'Fès', value: 'Fes' },
                    { label: 'Autre / Télétravail', value: 'Autre' },
                  ]}
                  {...register('location')}
                />
              </div>
            </div>
          </Card>

          <Card header={<div className="fw-semibold text-dark">Réseaux professionnels &amp; Portfolio</div>}>
            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  label="Profil LinkedIn"
                  placeholder="https://linkedin.com/in/monprofil"
                  leftIcon={<Globe size={14} />}
                  {...register('linkedin')}
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Profil GitHub"
                  placeholder="https://github.com/moncompte"
                  leftIcon={<Globe size={14} />}
                  {...register('github')}
                />
              </div>
            </div>
          </Card>

          <Card header={<div className="fw-semibold text-dark">Résumé professionnel (Bio)</div>}>
            <div>
              <label htmlFor="bio-input" className="form-label small fw-semibold text-muted">
                Présentez succinctement votre profil, vos spécialités et votre valeur ajoutée :
              </label>
              <textarea
                id="bio-input"
                rows={4}
                className="form-control"
                placeholder="Ex : Ingénieur Logiciel Full Stack spécialisé en architectures Spring Boot & React, passionné par les systèmes distribués et le Clean Code..."
                {...register('bio')}
              />
            </div>
          </Card>

          <div className="d-flex justify-content-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab('skills')}
              icon={<ArrowRight size={14} />}
            >
              Étape suivante : Compétences &amp; Formation
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Compétences & Formation */}
      {activeTab === 'skills' && (
        <div className="d-flex flex-column gap-4">
          <Card header={<div className="fw-semibold text-dark">Compétences techniques &amp; Outils</div>}>
            <p className="text-muted small mb-3">
              L'algorithme de matching utilise ces compétences pour calculer votre score d'affinité avec chaque offre.
            </p>

            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                type="text"
                className="form-control"
                style={{ maxWidth: '360px' }}
                placeholder="Ex: React, Spring Boot, Docker, Python..."
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(e);
                  }
                }}
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill} icon={<Plus size={14} />}>
                Ajouter
              </Button>
            </div>

            {/* Suggestions en un clic */}
            <div className="mb-3">
              <span className="text-muted small d-block mb-1.5 fw-semibold">
                Suggestions populaires (cliquez pour ajouter) :
              </span>
              <div className="d-flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map(s => {
                  const isSelected = skills.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isSelected}
                      onClick={() => handleAddSuggestedSkill(s)}
                      className={clsx(
                        'btn btn-sm py-0.5 px-2 text-decoration-none border',
                        isSelected
                          ? 'bg-light text-muted border-light'
                          : 'bg-white text-dark hover-shadow'
                      )}
                      style={{ fontSize: '11px', borderRadius: '4px' }}
                    >
                      {isSelected ? '✓ ' + s : '+ ' + s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Skills */}
            <div className="p-3 bg-light border rounded">
              <span className="fw-semibold small text-dark d-block mb-2">
                Compétences sélectionnées ({skills.length}) :
              </span>
              <div className="d-flex flex-wrap gap-1.5">
                {skills.length === 0 ? (
                  <span className="text-muted small">Aucune compétence ajoutée pour le moment.</span>
                ) : (
                  skills.map(s => (
                    <SkillTag key={s} name={s} onRemove={() => handleRemoveSkill(s)} />
                  ))
                )}
              </div>
            </div>
          </Card>

          <Card header={<div className="fw-semibold text-dark">Formation &amp; Expérience</div>}>
            <div className="row g-3">
              <div className="col-md-6">
                <Input
                  label="Années d'expérience professionnelle"
                  type="number"
                  min="0"
                  max="40"
                  leftIcon={<Award size={14} />}
                  {...register('experienceYears')}
                />
              </div>
              <div className="col-md-6">
                <Input
                  label="Formation principale / Dernier diplôme"
                  placeholder="Ex: Master Informatique, Diplôme d'Ingénieur..."
                  leftIcon={<GraduationCap size={14} />}
                  {...register('education')}
                />
              </div>
            </div>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab('personal')}
            >
              Retour : Informations personnelles
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab('preferences')}
              icon={<ArrowRight size={14} />}
            >
              Étape suivante : Préférences d'emploi
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Préférences d'emploi */}
      {activeTab === 'preferences' && (
        <div className="d-flex flex-column gap-4">
          <Card header={<div className="fw-semibold text-dark">Critères de recherche d'emploi</div>}>
            <div className="row g-3">
              <div className="col-md-6">
                <Select
                  label="Mode de travail souhaité"
                  options={[
                    { label: 'Télétravail complet (Remote)', value: WorkMode.REMOTE },
                    { label: 'Hybride (Télétravail & Présentiel)', value: WorkMode.HYBRID },
                    { label: 'Sur site (Présentiel)', value: WorkMode.ONSITE },
                  ]}
                  {...register('preferredWorkMode')}
                />
              </div>
              <div className="col-md-6">
                <Select
                  label="Type de contrat recherché"
                  options={[
                    { label: 'CDI (Contrat à Durée Indéterminée)', value: ContractType.CDI },
                    { label: 'CDD (Contrat à Durée Déterminée)', value: ContractType.CDD },
                    { label: 'Freelance / Indépendant', value: ContractType.FREELANCE },
                    { label: 'Stage pré-embauche / PFE', value: ContractType.STAGE },
                  ]}
                  {...register('preferredContractType')}
                />
              </div>
            </div>
          </Card>

          <Card header={<div className="fw-semibold text-dark">Curriculum Vitae (CV)</div>}>
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 bg-light rounded border">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-white text-primary rounded border"
                  style={{ width: '40px', height: '40px' }}
                >
                  <FileText size={20} />
                </div>
                <div>
                  <div className="fw-semibold text-dark">
                    {hasCv ? 'Un CV est actuellement rattaché à votre profil' : 'Aucun CV téléversé pour l\'instant'}
                  </div>
                  <div className="text-muted small">
                    {hasCv
                      ? `${candidateProfile.documents[0].fileName} - Prêt pour les candidatures`
                      : 'Téléversez votre CV pour activer l\'analyse automatique et le scoring.'}
                  </div>
                </div>
              </div>

              <Link to={ROUTES.CANDIDATE_CV} className="btn btn-primary btn-sm flex-shrink-0">
                <span>{hasCv ? 'Gérer mon CV & Voir le score' : 'Téléverser un CV'}</span>
                <ExternalLink size={13} className="ms-1" />
              </Link>
            </div>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActiveTab('skills')}
            >
              Retour : Compétences
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              icon={<Save size={16} />}
            >
              Enregistrer mon profil
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
