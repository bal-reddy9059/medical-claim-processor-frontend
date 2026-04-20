import { useEffect, useRef, useState } from 'react';
import {
  getClaimDetails,
  getExtractionResults,
  getDocumentBreakdown,
  updateExtractionResults,
  approveClaim,
  exportClaimPDF,
  getClaimHistory,
} from '../api/claimApi';

const ReviewExtractionResults = () => {
  const [claimId, setClaimId] = useState('');
  const [lookupId, setLookupId] = useState(() => localStorage.getItem('lastClaimId') || '');
  const [claimDetails, setClaimDetails] = useState(null);
  const [extractionData, setExtractionData] = useState(null);
  const [documentBreakdown, setDocumentBreakdown] = useState(null);
  const [claimHistory, setClaimHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approving, setApproving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [claimNotFound, setClaimNotFound] = useState(false);
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    if (lookupId) {
      loadClaimData(lookupId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unwrapResult = (data) => {
    if (data && typeof data === 'object' && 'result' in data && data.result !== undefined) {
      return data.result ?? data;
    }
    return data;
  };

  const getExtractionField = (field) => {
    if (!extractionData) return undefined;
    if (Object.prototype.hasOwnProperty.call(extractionData, field)) {
      return extractionData[field];
    }
    for (const sectionKey of Object.keys(extractionData)) {
      const section = extractionData[sectionKey];
      if (section && typeof section === 'object' && Object.prototype.hasOwnProperty.call(section, field)) {
        return section[field];
      }
    }
    return undefined;
  };

  const getExtractionFieldCount = () => {
    if (!extractionData || typeof extractionData !== 'object') return 0;
    return Object.values(extractionData).reduce((count, value) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return count + Object.keys(value).length;
      }
      return count + 1;
    }, 0);
  };

  const loadClaimData = async (id) => {
    if (fetchInProgressRef.current) {
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);
    setError(null);
    setClaimNotFound(false);

    try {
      // First, load claim details
      let claimDetails = null;
      try {
        const detailsRes = await getClaimDetails(id);
        if (detailsRes) {
          claimDetails = unwrapResult(detailsRes);
        }
      } catch (err) {
        throw err; // Claim details must exist
      }

      // If claim exists, load optional data (extraction, breakdown, history)
      setClaimId(id);
      localStorage.setItem('lastClaimId', id);
      setClaimDetails(claimDetails);

      // Load optional endpoints in parallel
      const [extractionRes, breakdownRes, historyRes] = await Promise.allSettled([
        getExtractionResults(id).catch(() => null),
        getDocumentBreakdown(id).catch(() => null),
        getClaimHistory(id).catch(() => null),
      ]);

      const extraction = extractionRes.status === 'fulfilled' ? unwrapResult(extractionRes.value) : null;
      const breakdown = breakdownRes.status === 'fulfilled' ? unwrapResult(breakdownRes.value) : null;
      const history = historyRes.status === 'fulfilled' ? unwrapResult(historyRes.value) : null;

      setExtractionData(extraction?.extracted_data ?? extraction);
      setDocumentBreakdown(breakdown);
      setClaimHistory(history || []);
    } catch (err) {
      console.error('Failed to load claim:', err);
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setClaimNotFound(true);
        setError('Claim not found. Please initialize a claim first.');
      } else {
        setError(err.message || 'Unable to load claim data');
      }
      setClaimDetails(null);
      setExtractionData(null);
      setDocumentBreakdown(null);
      setClaimHistory([]);
      setClaimId('');
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  };

  const handleClaimLookup = async () => {
    const id = lookupId.trim();
    if (!id) {
      setError('Please enter a claim ID.');
      return;
    }

    await loadClaimData(id);
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      setError(null);
      await approveClaim(claimId);
      setSuccessMessage('Claim approved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Unable to approve claim');
    } finally {
      setApproving(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      setError(null);
      const blob = await exportClaimPDF(claimId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${claimId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Unable to export claim');
    } finally {
      setExporting(false);
    }
  };

  const handleFieldEdit = (fieldName, currentValue) => {
    setEditingField(fieldName);
    setFieldValue(currentValue ?? '');
  };

  const handleSaveField = async () => {
    if (!editingField) {
      return;
    }
    try {
      setError(null);
      const payload = { [editingField]: fieldValue };
      await updateExtractionResults(claimId, payload);
      setExtractionData({ ...extractionData, [editingField]: fieldValue });
      setClaimDetails({ ...claimDetails, [editingField]: fieldValue });
      setSuccessMessage('Field updated successfully!');
      setEditingField(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Unable to update field');
    }
  };

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading claim data...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no claim is loaded
  if (!claimId) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">search</span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Review Extraction Results</h2>
          <p className="text-on-surface-variant mb-6">Enter a Claim ID and click Load to view results.</p>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                placeholder="Enter Claim ID (e.g., CLM-123456-X)"
                className="flex-1 px-4 py-3 bg-surface-container-low border border-outline rounded-xl text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                onKeyPress={(e) => e.key === 'Enter' && handleClaimLookup()}
              />
              <button
                onClick={handleClaimLookup}
                disabled={loading || !lookupId.trim()}
                className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const status = claimDetails?.status || 'Processed & Validated';
  const updatedAt = claimDetails?.updated_at || 'Just now';
  const documentTypes = documentBreakdown?.document_types || [];
  const pageTypes = documentBreakdown?.pages_by_type || {};
  const extractionFieldCount = getExtractionFieldCount();
  const getSummaryValue = (field) => getExtractionField(field) ?? claimDetails?.[field] ?? 'N/A';

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="max-w-7xl mx-auto px-6 pt-24 py-8 pb-32">
        {error && (
          <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
            {successMessage}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-on-surface-variant text-xs tracking-widest uppercase font-semibold">
              <span>Claims</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Review</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Claim Review: {claimId}</h1>
            <p className="text-sm text-on-surface-variant">Status: {status} · Last updated {updatedAt}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-4 py-3">
              <input
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-on-surface"
                placeholder="Enter claim ID"
              />
              <button
                onClick={handleClaimLookup}
                className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:opacity-90"
              >
                Load
              </button>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting || claimNotFound || !claimId}
              className="rounded-full bg-surface-container-low px-5 py-3 text-sm font-bold uppercase tracking-widest text-on-surface hover:bg-surface-container-high disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              onClick={handleApprove}
              disabled={approving || claimNotFound || !claimId}
              className="rounded-full bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {approving ? 'Approving...' : 'Approve Claim'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Claim Details</h2>
            <div className="space-y-4 text-sm text-on-surface-variant">
              <div>
                <p className="font-semibold text-on-surface">Claim ID</p>
                <p>{claimDetails?.claim_id || claimId}</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">Status</p>
                <p>{status}</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">Created</p>
                <p>{claimDetails?.created_at || 'N/A'}</p>
              </div>
              <div>
                <p className="font-semibold text-on-surface">Document Types</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {documentTypes.length ? documentTypes.map((type) => (
                    <span key={type} className="rounded-full bg-surface-container-high px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">{type}</span>
                  )) : <span className="text-xs text-on-surface-variant">No document types</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Extraction Snapshot</h2>
              <span className="text-xs uppercase tracking-[0.15em] text-on-surface-variant">{extractionFieldCount} fields</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {['patient_name','date_of_birth','policy_number','diagnosis','admission_date','discharge_date'].map((field) => {
                const value = getSummaryValue(field);
                return (
                  <div key={field} className="rounded-2xl bg-surface-container-high px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">{field.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-on-surface">{typeof value === 'object' ? JSON.stringify(value) : value}</p>
                      </div>
                      <button
                        onClick={() => handleFieldEdit(field, typeof value === 'object' ? JSON.stringify(value) : value || '')}
                        className="text-primary text-sm font-semibold"
                      >Edit</button>
                    </div>
                  </div>
                );
              })}
            </div>
            {editingField && (
              <div className="mt-6 rounded-2xl bg-surface-container-lowest p-5 border border-primary/20">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Update {editingField.replace(/_/g, ' ')}</p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-highest px-4 py-3 text-sm text-on-surface"
                  />
                  <button
                    onClick={handleSaveField}
                    className="rounded-xl bg-primary px-5 py-3 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90"
                  >Save</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Page Breakdown</h2>
            {Object.keys(pageTypes).length ? (
              <ul className="space-y-3 text-sm text-on-surface-variant">
                {Object.entries(pageTypes).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between rounded-2xl bg-surface-container-high px-4 py-3">
                    <span>{key}</span>
                    <span className="font-bold text-on-surface">{value}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-on-surface-variant">No breakdown data available.</p>
            )}
          </div>

          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Extracted Claim Data</h2>
              <span className="text-xs uppercase tracking-[0.15em] text-on-surface-variant">JSON preview</span>
            </div>
            <pre className="rounded-2xl bg-surface-container-high p-4 text-xs leading-relaxed text-on-surface overflow-x-auto">{JSON.stringify(extractionData || {}, null, 2)}</pre>
          </div>
        </div>

        {claimHistory.length > 0 && (
          <div className="mt-8">
            <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Claim History</h2>
              <div className="space-y-3">
                {claimHistory.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-4 rounded-2xl bg-surface-container-high p-4">
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-on-surface">{entry.action || entry.event}</p>
                        <span className="text-xs text-on-surface-variant">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'N/A'}
                        </span>
                      </div>
                      {entry.details && (
                        <p className="text-sm text-on-surface-variant">{entry.details}</p>
                      )}
                      {entry.user && (
                        <p className="text-xs text-on-surface-variant mt-1">By: {entry.user}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReviewExtractionResults;
