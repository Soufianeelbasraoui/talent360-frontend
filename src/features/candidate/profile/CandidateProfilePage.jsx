import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Save, Plus, Phone, Globe, Award } from 'lucide-react';

export function CandidateProfilePage() {
  const { user, candidateProfile, refreshProfile } = useAuth();
  const { success: toastSuccess, error: toastError } = useToast();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm({
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
          } catch {
            // Ignore parse error
          }

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
        toastError(getErrorMessage(err, 'Could not load your profile.'));
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [candidateProfile?.id, reset, toastError]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setSkillInput('');
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
      toastSuccess('Profile updated successfully.');
    } catch (err) {
      toastError(getErrorMessage(err, "We couldn't save your profile. Check your connection and try again."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-3">
        <Skeleton count={6} height={45} className="mb-3" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-5">
      {/* Header with sticky save bar */}
      <div className="d-flex align-items-center justify-content-between mb-4 sticky-top bg-light py-2" style={{ zIndex: 10 }}>
        <div>
          <h1 className="fs-4 fw-bold text-dark mb-1">Edit Profile</h1>
          <p className="text-muted small mb-0">Update your background, skills, and employment preferences.</p>
        </div>
        <Button type="submit" variant="primary" isLoading={isSaving} icon={<Save size={16} />}>
          Save profile
        </Button>
      </div>

      {/* Section 1: Personal Info */}
      <Card header={<div className="fw-semibold">Personal Information</div>} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <Input label="First name" required {...register('firstName')} />
          </div>
          <div className="col-md-6">
            <Input label="Last name" required {...register('lastName')} />
          </div>
          <div className="col-md-6">
            <Input label="Email address" value={user?.email || ''} disabled helperText="Email address cannot be modified here." />
          </div>
          <div className="col-md-6">
            <Input label="Phone number" placeholder="+212 600-000000" leftIcon={<Phone size={14} />} {...register('phone')} />
          </div>
          <div className="col-md-6">
            <Select
              label="Location"
              options={[
                { label: 'Casablanca', value: 'Casablanca' },
                { label: 'Rabat', value: 'Rabat' },
                { label: 'Marrakech', value: 'Marrakech' },
                { label: 'Tangier', value: 'Tangier' },
                { label: 'Agadir', value: 'Agadir' },
                { label: 'Fes', value: 'Fes' },
              ]}
              {...register('location')}
            />
          </div>
          <div className="col-md-6">
            <Input label="LinkedIn Profile" placeholder="https://linkedin.com/in/username" leftIcon={<Globe size={14} />} {...register('linkedin')} />
          </div>
          <div className="col-12">
            <Input label="GitHub Profile" placeholder="https://github.com/username" leftIcon={<Globe size={14} />} {...register('github')} />
          </div>
        </div>
      </Card>

      {/* Section 2: Bio */}
      <Card header={<div className="fw-semibold">Bio &amp; Professional Summary</div>} className="mb-4">
        <div className="mb-3">
          <label htmlFor="bio-input" className="form-label">
            Summary
          </label>
          <textarea
            id="bio-input"
            rows={4}
            className="form-control"
            placeholder="Write a concise overview of your technical background, primary tools, and career focus..."
            {...register('bio')}
          />
        </div>
      </Card>

      {/* Section 3: Skills Tag Input */}
      <Card header={<div className="fw-semibold">Skills &amp; Competencies</div>} className="mb-4">
        <p className="text-muted small mb-3">Add key technologies and tools that the AI matcher will use to evaluate your fit.</p>
        <div className="d-flex align-items-center gap-2 mb-3">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: '320px' }}
            placeholder="e.g. Java, Docker, React, Spring Boot"
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
            Add skill
          </Button>
        </div>

        <div className="d-flex flex-wrap gap-1 p-2 bg-light border rounded">
          {skills.length === 0 ? (
            <span className="text-muted small">No skills added yet. Type a skill and click Add.</span>
          ) : (
            skills.map(s => <SkillTag key={s} name={s} onRemove={() => handleRemoveSkill(s)} />)
          )}
        </div>
      </Card>

      {/* Section 4: Experience & Education */}
      <Card header={<div className="fw-semibold">Experience &amp; Education</div>} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <Input
              label="Years of Experience"
              type="number"
              min="0"
              max="50"
              leftIcon={<Award size={14} />}
              {...register('experienceYears')}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="Education / Degree"
              placeholder="e.g. Master in Software Engineering, ENSIAS Rabat"
              {...register('education')}
            />
          </div>
        </div>
      </Card>

      {/* Section 5: Preferences */}
      <Card header={<div className="fw-semibold">Job Preferences</div>} className="mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <Select
              label="Preferred Work Mode"
              options={[
                { label: 'Remote', value: WorkMode.REMOTE },
                { label: 'Hybrid', value: WorkMode.HYBRID },
                { label: 'On-site', value: WorkMode.ONSITE },
              ]}
              {...register('preferredWorkMode')}
            />
          </div>
          <div className="col-md-6">
            <Select
              label="Preferred Contract Type"
              options={[
                { label: 'CDI (Permanent)', value: ContractType.CDI },
                { label: 'CDD (Fixed-Term)', value: ContractType.CDD },
                { label: 'Freelance / Contractor', value: ContractType.FREELANCE },
                { label: 'Internship (Stage)', value: ContractType.STAGE },
              ]}
              {...register('preferredContractType')}
            />
          </div>
        </div>
      </Card>
    </form>
  );
}
