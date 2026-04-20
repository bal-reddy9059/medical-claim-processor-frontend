import { useEffect, useState } from 'react';
import { getHealth, getWorkflowInfo } from '../api/claimApi';

const AIPipelineStatus = () => {
  const [health, setHealth] = useState(null);
  const [workflow, setWorkflow] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadApiData = async () => {
      setApiError(null);
      setIsLoading(true);
      try {
        const [healthData, workflowData] = await Promise.all([getHealth(), getWorkflowInfo()]);
        setHealth(healthData);
        setWorkflow(workflowData);
      } catch (error) {
        setApiError(error.message || 'Unable to load API data');
      } finally {
        setIsLoading(false);
      }
    };

    loadApiData();
  }, []);

  const workflowName = workflow?.title || workflow?.name || workflow?.workflow || 'Claim workflow';
  const workflowNodes = workflow?.count ?? workflow?.steps?.length ?? (workflow?.nodes ? Object.keys(workflow.nodes).length : null) ?? 'N/A';
  const documentTypes = workflow?.document_types || [];
  const parallelism = workflow?.parallelism;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid gap-4 lg:grid-cols-4 mb-8">
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container-highest/50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">API Health</p>
            <p className="text-3xl font-bold text-on-surface">{isLoading ? 'Loading…' : health?.status ?? 'Unavailable'}</p>
            <p className="mt-3 text-sm text-on-surface-variant">
              {health?.uptime ? `Uptime: ${health.uptime}` : 'Checks backend health status.'}
            </p>
            {health?.message && <p className="mt-2 text-sm text-primary">{health.message}</p>}
          </div>
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container-highest/50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Workflow Info</p>
            <p className="text-3xl font-bold text-on-surface">{workflowName}</p>
            <p className="mt-3 text-sm text-on-surface-variant">Nodes: {isLoading ? '…' : workflowNodes}</p>
            <p className="mt-2 text-sm text-on-surface-variant">{workflow?.description ?? 'Loaded from backend workflow API.'}</p>
          </div>
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container-highest/50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Status Summary</p>
            <p className="text-3xl font-bold text-on-surface">{isLoading ? 'Refreshing…' : apiError ? 'Warning' : 'Connected'}</p>
            <p className="mt-3 text-sm text-on-surface-variant">{apiError || 'Backend endpoints are integrated and available.'}</p>
          </div>
          <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm border border-surface-container-highest/50">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant mb-3">Document Types</p>
            {documentTypes.length ? (
              <div className="flex flex-wrap gap-2">
                {documentTypes.map((type) => (
                  <span key={type} className="rounded-full bg-surface-container-high px-3 py-1 text-xs text-on-surface-variant">
                    {type}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No document types available</p>
            )}
            {parallelism && <p className="mt-4 text-sm text-on-surface-variant">Parallelism: {parallelism}</p>}
          </div>
        </div>
        {apiError && (
          <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 mb-8">
            {apiError}
          </div>
        )}
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-on-surface-variant text-sm font-medium uppercase tracking-wide">Current Execution</span>
            <h2 className="text-3xl font-bold tracking-tight text-on-surface mt-1">Claim Analysis: #CLM-99284</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-surface-container-low text-on-surface-variant font-semibold rounded-xl text-sm transition-all hover:bg-surface-container-high">Pause Stream</button>
            <button className="px-5 py-2.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl text-sm shadow-sm transition-all hover:opacity-90">Restart Graph</button>
          </div>
        </div>
        {/* LangGraph Visualization Canvas */}
        <div className="relative bg-surface-container-low rounded-3xl p-8 md:p-12 overflow-hidden min-h-[600px] flex items-center justify-center">
          {/* Background Decorative Grid */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(#191c1e 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
          {/* Graph Layout */}
          <div className="relative w-full max-w-5xl z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            {/* Input Column: Segregator Agent */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[280px] bg-surface-container-lowest p-6 rounded-2xl shadow-lg node-active relative">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-2xl">account_tree</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface">Segregator Agent</h3>
                    <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">Classification Stage</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border-l-4 border-primary">
                    <span className="text-xs font-medium">Page 1: ID Card</span>
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-high border-l-4 border-primary">
                    <span className="text-xs font-medium">Page 2: Bill</span>
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low opacity-60">
                    <span className="text-xs font-medium">Page 3: Discharge...</span>
                    <span className="material-symbols-outlined text-outline text-sm">pending</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Branching Lines (Desktop Only) */}
            <div className="hidden md:block absolute left-[28%] top-1/2 -translate-y-1/2 w-[15%] h-[80%] pointer-events-none">
              <svg fill="none" height="100%" viewBox="0 0 100 200" width="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 100 C 40 100, 60 20, 100 20" stroke="#00488d" strokeDasharray="4 4" strokeWidth="2"></path>
                <path d="M0 100 L 100 100" stroke="#00488d" strokeDasharray="4 4" strokeWidth="2"></path>
                <path d="M0 100 C 40 100, 60 180, 100 180" stroke="#00488d" strokeDasharray="4 4" strokeWidth="2"></path>
              </svg>
            </div>
            {/* Middle Column: Extraction Agents */}
            <div className="flex flex-col gap-8 md:col-start-3">
              {/* Agent 1 */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-lg border-l-4 border-primary">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">badge</span>
                    <span className="font-bold text-sm">ID Agent</span>
                  </div>
                  <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">EXTRACTED</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-full bg-primary"></div>
                </div>
              </div>
              {/* Agent 2 */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-lg border-l-4 border-primary-fixed-dim">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed-dim">description</span>
                    <span className="font-bold text-sm">Discharge Summary Agent</span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-bold">82%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-5/6 bg-primary-fixed-dim"></div>
                </div>
              </div>
              {/* Agent 3 */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-lg opacity-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-outline">receipt_long</span>
                    <span className="font-bold text-sm">Itemized Bill Agent</span>
                  </div>
                  <span className="text-xs text-on-surface-variant font-bold">QUEUED</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
          {/* Aggregator Status Overlay */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6">
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-outline-variant/20 flex items-center gap-4">
              <div className="flex-shrink-0 relative">
                <span className="material-symbols-outlined text-tertiary animate-pulse" style={{fontVariationSettings: "'FILL' 1"}}>join_inner</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-bold text-on-surface tracking-tight">Aggregator combining results...</p>
                  <span className="text-xs font-mono text-tertiary">3/4 NODES SYNCED</span>
                </div>
                <div className="flex gap-1 h-1">
                  <div className="flex-1 bg-primary rounded-full"></div>
                  <div className="flex-1 bg-primary rounded-full"></div>
                  <div className="flex-1 bg-primary rounded-full"></div>
                  <div className="flex-1 bg-surface-container-highest rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Bento Stats Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Confidence</p>
            <p className="text-3xl font-black text-on-surface tracking-tighter">98.4%</p>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+2.1% from baseline</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Tokens</p>
            <p className="text-3xl font-black text-on-surface tracking-tighter">4,129</p>
            <p className="mt-4 text-xs font-medium text-on-surface-variant">Estimated cost: $0.12 USD</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm md:col-span-2 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Live Logs</p>
              <div className="space-y-1 font-mono text-xs text-on-surface-variant">
                <div className="flex gap-2"><span className="text-primary font-bold">[14:02:11]</span> <span>Classification complete: 4 types found.</span></div>
                <div className="flex gap-2"><span className="text-primary font-bold">[14:02:12]</span> <span>Invoking &apos;ID Agent&apos; via Llama-3-70B.</span></div>
                <div className="flex gap-2"><span className="text-tertiary font-bold">[14:02:15]</span> <span>Parallelizing extraction branches&hellip;</span></div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <span className="material-symbols-outlined text-8xl">terminal</span>
            </div>
          </div>
        </div>
      </main>
      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface flex justify-around items-center px-4 py-3 pb-safe border-t border-outline-variant/20 shadow-lg">
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Dashboard</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-container text-white rounded-xl px-4 py-1.5 transition-all" href="#">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>account_tree</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Workflow</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">rule</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Review</span>
        </a>
        <a className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 hover:bg-surface-container-low rounded-xl transition-all" href="#">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-xs font-medium tracking-wide uppercase mt-1">Settings</span>
        </a>
      </nav>
    </div>
  );
};

export default AIPipelineStatus;