import React, { useRef, useState, useEffect } from 'react';
import { processClaim, getClaimsSummary } from '../api/claimApi';

const ClaimDashboard = () => {
  const [claimId, setClaimId] = useState(() => localStorage.getItem('lastClaimId') || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadClaimsSummary();
  }, []);

  const loadClaimsSummary = async () => {
    try {
      const summary = await getClaimsSummary();
      setSummaryData(summary);
    } catch (error) {
      console.error('Failed to load claims summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setResponseData(null);
    setUploadError(null);
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !claimId) {
      setUploadError('Please select a claim file and enter a claim ID.');
      return;
    }

    setSubmitting(true);
    setUploadError(null);
    setResponseData(null);
    setSuccessMessage(null);

    try {
      const result = await processClaim(claimId, selectedFile);
      const resultClaimId = result.claim_id || result.claimId || claimId;
      if (resultClaimId) {
        localStorage.setItem('lastClaimId', resultClaimId);
        setClaimId(resultClaimId);
      }
      setResponseData(result);
      setSuccessMessage('Claim submitted successfully! Processing started...');
      setTimeout(() => setSuccessMessage(null), 3000);
      // Refresh the summary after successful submission
      loadClaimsSummary();
    } catch (error) {
      setUploadError(error.message || 'Failed to submit claim.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <main className="max-w-7xl mx-auto px-6 pt-24 py-10 space-y-10">
        {/* Dashboard Summary Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-2">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">Pipeline Overview</h2>
            <p className="text-on-surface-variant">Manage and monitor the clinical precision of your medical claim flows.</p>
            <button
              onClick={loadClaimsSummary}
              disabled={summaryLoading}
              className="mt-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {summaryLoading ? 'Refreshing...' : 'Refresh Summary'}
            </button>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Active Pipelines</p>
              <p className="text-3xl font-black text-primary">{summaryLoading ? '...' : (summaryData?.active_pipelines ?? 0)}</p>
            </div>
            <div className="h-12 w-1.5 bg-primary rounded-full"></div>
          </div>
        </section>
        {/* Additional Metrics Row */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Total Claims</p>
            <p className="text-2xl font-black text-on-surface">{summaryLoading ? '...' : (summaryData?.total_claims ?? 0)}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Completed</p>
            <p className="text-2xl font-black text-green-600">{summaryLoading ? '...' : (summaryData?.completed_claims ?? 0)}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Approved</p>
            <p className="text-2xl font-black text-blue-600">{summaryLoading ? '...' : (summaryData?.approved_claims ?? 0)}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Failed</p>
            <p className="text-2xl font-black text-red-600">{summaryLoading ? '...' : (summaryData?.failed_claims ?? 0)}</p>
          </div>
        </section>
        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Area (Action Layer) */}
          <section className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 shadow-lg space-y-8">
            <div className="space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Upload New Claim</h3>
              <p className="text-sm text-on-surface-variant">Initiate a new precision processing sequence.</p>
            </div>
            <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 bg-surface-container-low rounded-full p-12 transition-all hover:bg-gradient-to-br hover:from-primary-fixed hover:to-surface-container cursor-pointer" onClick={handleUploadClick}>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="material-symbols-outlined text-surface-tint text-5xl mb-4">picture_as_pdf</span>
              <p className="font-bold text-primary uppercase tracking-wider">{selectedFile ? selectedFile.name : 'Select PDF Claim'}</p>
              <p className="text-xs text-on-surface-variant mt-1">
                {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB ready` : 'Click to browse for a PDF file'}
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-xs font-medium tracking-wide uppercase text-on-surface-variant mb-1" htmlFor="claim_id">Claim ID</label>
                <input
                  className="w-full bg-surface-container-highest border-none rounded-t-lg py-3 px-4 focus:ring-0 text-on-surface placeholder:text-outline"
                  id="claim_id"
                  placeholder="e.g. CLM-99203-PX"
                  type="text"
                  value={claimId}
                  onChange={(event) => setClaimId(event.target.value)}
                />
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-300 focus-within:w-full focus-within:translate-x-[-50%]"></div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || !claimId || submitting}
                className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Processing...' : 'Initialize Pipeline'}
              </button>
              {uploadError && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  {uploadError}
                </div>
              )}
              {successMessage && (
                <div className="rounded-2xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-900">
                  {successMessage}
                </div>
              )}
              {responseData && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-primary-container bg-primary/5 px-4 py-3 text-sm text-primary">
                    <p className="font-semibold text-on-surface mb-2">Claim submitted successfully</p>
                    <p className="text-sm">Claim ID: <span className="font-bold">{responseData.claim_id || responseData.claimId}</span></p>
                    <p className="text-sm">Status: <span className="font-bold text-on-surface">{responseData.status || 'unknown'}</span></p>
                  </div>
                  <div className="rounded-2xl bg-surface-container-lowest p-4 text-sm">
                    <p className="font-semibold text-on-surface mb-3">Processing Metadata</p>
                    {responseData.processing_metadata ? (
                      <div className="space-y-2 text-on-surface-variant">
                        <p>Total pages: {responseData.processing_metadata.total_pages ?? 'N/A'}</p>
                        <p>Processing time: {responseData.processing_metadata.processing_time_seconds ? `${responseData.processing_metadata.processing_time_seconds}s` : 'N/A'}</p>
                        {responseData.processing_metadata.pages_by_type && (
                          <div>
                            <p className="font-semibold text-on-surface mb-1">Pages by type</p>
                            <ul className="space-y-1 text-xs text-on-surface-variant">
                              {Object.entries(responseData.processing_metadata.pages_by_type).map(([type, count]) => (
                                <li key={type}>{type}: {count}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-on-surface-variant">No processing metadata available.</p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-surface-container-lowest p-4 text-sm">
                    <p className="font-semibold text-on-surface mb-3">Page Classification Summary</p>
                    {responseData.page_classification ? (
                      <div className="text-xs text-on-surface-variant">
                        <p className="mb-2">Total classified pages: {Object.keys(responseData.page_classification).length}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(responseData.page_classification).slice(0, 10).map(([page, type]) => (
                            <div key={page} className="rounded-lg bg-surface-container-high px-2 py-1">
                              <span className="font-semibold">Page {page}:</span> {type}
                            </div>
                          ))}
                          {Object.keys(responseData.page_classification).length > 10 && (
                            <div className="col-span-2 text-xs text-on-surface-variant">Showing first 10 pages of classification.</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-on-surface-variant">No page classification data available.</p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-surface-container-lowest p-4 text-sm">
                    <p className="font-semibold text-on-surface mb-3">Extracted Data</p>
                    {responseData.extracted_data ? (
                      <div className="space-y-3 text-on-surface-variant">
                        {Object.entries(responseData.extracted_data).map(([section, value]) => (
                          <div key={section}>
                            <p className="font-semibold text-on-surface">{section.replace('_', ' ')}</p>
                            <pre className="whitespace-pre-wrap break-words rounded-xl bg-surface-container-highest p-3 text-xs">{JSON.stringify(value || {}, null, 2)}</pre>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-on-surface-variant">No extracted data available.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
          {/* Recent Pipelines (Data Tables) */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold tracking-tight">Recent Pipelines</h3>
              <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-hidden bg-surface-container-lowest rounded-xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high">
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Claim ID</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Status</th>
                    <th className="py-4 px-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr className="hover:bg-secondary-container/30 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="font-mono font-bold text-on-surface">CLM-88210-TQ</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-fixed-dim animate-pulse"></div>
                        <span className="text-sm font-medium text-primary">Processing</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-on-surface-variant">Oct 24, 2023</td>
                    <td className="py-5 px-6 text-right">
                      <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">more_vert</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary-container/30 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="font-mono font-bold text-on-surface">CLM-77104-AB</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-on-surface">Completed</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-on-surface-variant">Oct 23, 2023</td>
                    <td className="py-5 px-6 text-right">
                      <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">more_vert</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary-container/30 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="font-mono font-bold text-on-surface">CLM-99002-XC</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                        <span className="text-sm font-medium text-tertiary">Flagged</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-on-surface-variant">Oct 23, 2023</td>
                    <td className="py-5 px-6 text-right">
                      <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">more_vert</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-secondary-container/30 transition-colors group">
                    <td className="py-5 px-6">
                      <span className="font-mono font-bold text-on-surface">CLM-88122-LL</span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-on-surface">Completed</span>
                      </div>
                    </td>
                    <td className="py-5 px-6 text-sm text-on-surface-variant">Oct 22, 2023</td>
                    <td className="py-5 px-6 text-right">
                      <span className="material-symbols-outlined text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">more_vert</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Tonal Bar Progress (System Component) */}
            <div className="bg-surface-container-low rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Batch Processing Efficiency</p>
              <div className="flex items-center h-2 w-full rounded-full overflow-hidden bg-surface-container-highest">
                <div className="h-full bg-primary" style={{width: '45%'}}></div>
                <div className="h-full bg-primary-fixed-dim" style={{width: '30%'}}></div>
                <div className="h-full bg-surface-container-highest" style={{width: '25%'}}></div>
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs font-bold text-primary uppercase">Validated (45%)</span>
                <span className="text-xs font-bold text-on-primary-fixed-variant uppercase">Analyzing (30%)</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase">Pending (25%)</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface border-t border-outline-variant/20 shadow-lg">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-xl px-4 py-1.5 transition-all duration-300 ease-in-out">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Dashboard</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all duration-300 ease-in-out">
          <span className="material-symbols-outlined">account_tree</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Workflow</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all duration-300 ease-in-out">
          <span className="material-symbols-outlined">rule</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Review</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all duration-300 ease-in-out">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Settings</span>
        </div>
      </nav>
      {/* FAB (Dashboard Contextual Only) */}
      <div className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-50">
        <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default ClaimDashboard;