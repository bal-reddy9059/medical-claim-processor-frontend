const apiBase = (
  import.meta.env.VITE_API_BASE_URL ||
  'https://claim-processing-langgraph.vercel.app'
).replace(/\/$/, '');
const buildUrl = (path) => (apiBase ? `${apiBase}${path}` : path);

const parseResponse = async (res) => {
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      data?.message ||
      data?.detail ||
      (typeof data === 'string' ? data : JSON.stringify(data));
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  return data;
};

// ==================== HEALTH & INFO ====================

export async function getHealth() {
  const res = await fetch(buildUrl('/health'));
  return parseResponse(res);
}

export async function getWorkflowInfo() {
  const res = await fetch(buildUrl('/api/workflow-info'));
  return parseResponse(res);
}

// ==================== CLAIM PROCESSING ====================

export async function processClaim(claimId, file) {
  const formData = new FormData();
  formData.append('claim_id', claimId);
  if (file) {
    formData.append('file', file);
  }

  const response = await fetch(buildUrl('/api/process'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

// ==================== CLAIM MANAGEMENT ====================

export async function getClaimDetails(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}`));
  return parseResponse(res);
}

export async function getExtractionResults(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/extraction-results`));
  return parseResponse(res);
}

export async function updateExtractionResults(claimId, data) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/extraction-results`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return parseResponse(res);
}

export async function getDocumentBreakdown(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/document-breakdown`));
  return parseResponse(res);
}

export async function getClaimsSummary() {
  const res = await fetch(buildUrl('/api/claims/summary'));
  return parseResponse(res);
}

export async function getAllClaims() {
  const res = await fetch(buildUrl('/api/claims'));
  return parseResponse(res);
}

export async function getClaimHistory(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/history`));
  return parseResponse(res);
}

export async function getDashboardMetrics() {
  const res = await fetch(buildUrl('/api/dashboard/metrics'));
  return parseResponse(res);
}

// ==================== CLAIM ACTIONS ====================

export async function approveClaim(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/approve`), {
    method: 'POST',
  });
  return parseResponse(res);
}

export async function exportClaimPDF(claimId) {
  const res = await fetch(buildUrl(`/api/claims/${claimId}/export`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to export claim: ${res.status}`);
  }
  return res.blob(); // Return blob for file download
}

// ==================== PIPELINE CONTROL ====================

export async function getPipelineStatus(claimId) {
  const res = await fetch(buildUrl(`/api/pipeline/status/${claimId}`));
  return parseResponse(res);
}

export async function pausePipeline(claimId) {
  const res = await fetch(buildUrl(`/api/pipeline/pause/${claimId}`), {
    method: 'POST',
  });
  return parseResponse(res);
}

export async function restartPipeline(claimId) {
  const res = await fetch(buildUrl(`/api/pipeline/restart/${claimId}`), {
    method: 'POST',
  });
  return parseResponse(res);
}

export async function getPipelineLogs(claimId) {
  const res = await fetch(buildUrl(`/api/pipeline/logs/${claimId}`));
  return parseResponse(res);
}

// ==================== SETTINGS ====================

export async function getSettings() {
  const res = await fetch(buildUrl('/api/settings/configuration'));
  return parseResponse(res);
}

export async function updateSettings(settings) {
  const res = await fetch(buildUrl('/api/settings/configuration'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  return parseResponse(res);
}
