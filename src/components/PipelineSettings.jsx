import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../api/claimApi';

const PipelineSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [apiUrl, setApiUrl] = useState('https://claim-processing-langgraph.vercel.app/api/process');
  const [strictValidation, setStrictValidation] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [anomalyDetection, setAnomalyDetection] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await getSettings();
      setSettings(result);
      setApiUrl(result?.api_url || 'https://claim-processing-langgraph.vercel.app/api/process');
      setStrictValidation(result?.strict_validation ?? true);
      setConfidenceThreshold(result?.confidence_threshold ?? 85);
      setAnomalyDetection(result?.anomaly_detection ?? false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      const newSettings = {
        api_url: apiUrl,
        strict_validation: strictValidation,
        confidence_threshold: confidenceThreshold,
        anomaly_detection: anomalyDetection,
      };
      await updateSettings(newSettings);
      setSettings(newSettings);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24">
      <main className="pt-24 px-6 max-w-4xl mx-auto">
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
        {/* Editorial Header */}
        <div className="mb-12">
          <p className="text-on-surface-variant font-label text-[10px] font-medium tracking-[0.05em] uppercase mb-2">Configuration Hub</p>
          <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-on-surface">System Settings</h2>
          <div className="h-1 w-12 bg-primary mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Navigation/Context */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-bold text-sm uppercase tracking-wider text-on-surface-variant mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest text-primary shadow-sm" href="#"><span className="material-symbols-outlined text-[20px]">psychology</span><span className="font-semibold text-sm">AI Configuration</span></a></li>
                <li><a className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-highest transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">api</span><span className="font-medium text-sm">API Integration</span></a></li>
                <li><a className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-highest transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">security</span><span className="font-medium text-sm">Security &amp; Privacy</span></a></li>
                <li><a className="flex items-center gap-3 p-3 rounded-xl text-on-surface-variant hover:bg-surface-container-highest transition-colors" href="#"><span className="material-symbols-outlined text-[20px]">notifications</span><span className="font-medium text-sm">Alerts</span></a></li>
              </ul>
            </div>
            <a className="block bg-secondary-container p-6 rounded-xl hover:opacity-90 transition-all border border-outline-variant/20" href="#">
              <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-on-secondary-container">menu_book</span>
                <h4 className="font-bold text-on-secondary-container text-sm">Documentation</h4>
              </div>
              <p className="text-xs text-on-secondary-container/80 leading-relaxed">Read our comprehensive guide on ClaimPrecision logic and API architecture.</p>
            </a>
          </div>
          {/* Right Column: Form Sections */}
          <div className="md:col-span-2 space-y-6">
            {/* AI Agent Sensitivity */}
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">AI Agent Sensitivity</h3>
                  <p className="text-sm text-on-surface-variant">Adjust how strictly the AI flags potential claim discrepancies.</p>
                </div>
              </div>
              <div className="space-y-8">
                {/* Sensitivity Toggle 1 */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">Strict Validation</p>
                    <p className="text-xs text-on-surface-variant">Flags claims with any missing non-critical metadata.</p>
                  </div>
                  <button 
                    onClick={() => setStrictValidation(!strictValidation)}
                    className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-all ${strictValidation ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                {/* Sensitivity Slider Concept (Tonal Bar) */}
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Confidence Threshold</span>
                    <span className="text-[10px] font-bold text-primary">{confidenceThreshold}% REQUIRED</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer"
                    style={{background: `linear-gradient(to right, var(--md-sys-color-primary, #0066cc) 0%, var(--md-sys-color-primary, #0066cc) ${confidenceThreshold}%, var(--md-sys-color-surface-container-highest, #e8eaed) ${confidenceThreshold}%, var(--md-sys-color-surface-container-highest, #e8eaed) 100%)`}}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-on-surface">Anomaly Detection</p>
                    <p className="text-xs text-on-surface-variant">Prioritize high-value discrepancies over volume.</p>
                  </div>
                  <button 
                    onClick={() => setAnomalyDetection(!anomalyDetection)}
                    className={`w-12 h-6 rounded-full relative p-1 flex items-center transition-all ${anomalyDetection ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>
              </div>
            </section>
            {/* API Configuration */}
            <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_12px_32px_-4px_rgba(25,28,30,0.06)]">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary-fixed text-on-secondary-fixed rounded-xl">
                  <span className="material-symbols-outlined">link</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight">API Integration</h3>
                  <p className="text-sm text-on-surface-variant">Configure your production endpoint for live data ingestion.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-2">Live API URL</label>
                  <div className="relative">
                    <input 
                      className="w-full bg-surface-container-highest border-0 border-b-2 border-transparent focus:border-primary focus:ring-0 rounded-t-xl px-4 py-4 text-sm font-medium transition-all" 
                      placeholder="https://claim-processing-langgraph.vercel.app/api/process" 
                      type="text" 
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-4 text-on-surface-variant text-sm">{apiUrl ? 'lock' : 'api'}</span>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low rounded-xl flex items-start gap-4">
                  <span className="material-symbols-outlined text-tertiary mt-1">info</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">Changes to the API URL require a re-authentication of your organization's security certificate. This may cause a brief interruption in service.</p>
                </div>
              </div>
            </section>
            {/* Save Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button 
                onClick={loadSettings}
                className="px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-all"
              >
                Discard Changes
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-8 py-2.5 text-sm font-bold uppercase tracking-widest text-white bg-gradient-to-br from-primary to-primary-container rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save System Configuration'}
              </button>
            </div>
          </div>
        </div>
      </main>
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface flex justify-around items-center px-4 py-3 pb-safe border-t border-outline-variant/20 shadow-[0_-4px_20px_-4px_rgba(25,28,30,0.06)]">
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-300 ease-in-out hover:bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-[0.05em] uppercase mt-1">Dashboard</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-300 ease-in-out hover:bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined">account_tree</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-[0.05em] uppercase mt-1">Workflow</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-300 ease-in-out hover:bg-surface-container-low rounded-xl">
          <span className="material-symbols-outlined">rule</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-[0.05em] uppercase mt-1">Review</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-xl px-4 py-1.5 transition-all duration-300 ease-in-out">
          <span className="material-symbols-outlined">settings</span>
          <span className="font-['Inter'] text-[10px] font-medium tracking-[0.05em] uppercase mt-1">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default PipelineSettings;