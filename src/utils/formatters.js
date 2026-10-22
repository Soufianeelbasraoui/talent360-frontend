/**
 * @file Helper formatters for dates, currencies, labels, and match scores.
 */

/**
 * Format ISO date string to readable localized date (e.g. 18 Oct 2026).
 * @param {string|Date} dateStr
 * @returns {string}
 */
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

/**
 * Format match score as whole percentage (e.g. 87%).
 * @param {number|null|undefined} score
 * @returns {string}
 */
export function formatScore(score) {
  if (score === null || score === undefined || isNaN(score)) return '0%';
  const val = score > 1 ? score : score * 100;
  return `${Math.round(val)}%`;
}

/**
 * Get CSS color class for match score.
 * Green (>85), Amber (60-85), Gray (<60).
 * @param {number|null|undefined} score
 * @returns {'high'|'mid'|'low'}
 */
export function getScoreTier(score) {
  if (score === null || score === undefined || isNaN(score)) return 'low';
  const val = score > 1 ? score : score * 100;
  if (val >= 85) return 'high';
  if (val >= 60) return 'mid';
  return 'low';
}

/**
 * Human-readable label for ContractType.
 * @param {string} contractType
 * @returns {string}
 */
export function formatContractType(contractType) {
  const map = {
    CDI: 'CDI (Permanent)',
    CDD: 'CDD (Fixed-Term)',
    FREELANCE: 'Freelance / Contractor',
    STAGE: 'Internship',
  };
  return map[contractType] || contractType || '—';
}

/**
 * Human-readable label for WorkMode.
 * @param {string} workMode
 * @returns {string}
 */
export function formatWorkMode(workMode) {
  const map = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'On-site',
  };
  return map[workMode] || workMode || '—';
}

/**
 * Human-readable label for ExperienceLevel.
 * @param {string} level
 * @returns {string}
 */
export function formatExperienceLevel(level) {
  const map = {
    JUNIOR: 'Junior (0-2 yrs)',
    MID: 'Mid-Level (3-5 yrs)',
    SENIOR: 'Senior (5+ yrs)',
  };
  return map[level] || level || '—';
}

/**
 * Capitalize first letter of string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
