
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return String(dateStr);
  }
}

export function formatScore(score) {
  if (score === null || score === undefined || isNaN(score)) return '0%';
  const val = score > 1 ? score : score * 100;
  return `${Math.round(val)}%`;
}

export function getScoreTier(score) {
  if (score === null || score === undefined || isNaN(score)) return 'low';
  const val = score > 1 ? score : score * 100;
  if (val >= 85) return 'high';
  if (val >= 60) return 'mid';
  return 'low';
}

export function formatContractType(contractType) {
  const map = {
    CDI: 'CDI (Permanent)',
    CDD: 'CDD (Fixed-Term)',
    FREELANCE: 'Freelance / Contractor',
    STAGE: 'Internship',
  };
  return map[contractType] || contractType || '—';
}

export function formatWorkMode(workMode) {
  const map = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'On-site',
  };
  return map[workMode] || workMode || '—';
}

export function formatExperienceLevel(level) {
  const map = {
    JUNIOR: 'Junior (0-2 yrs)',
    MID: 'Mid-Level (3-5 yrs)',
    SENIOR: 'Senior (5+ yrs)',
  };
  return map[level] || level || '—';
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
