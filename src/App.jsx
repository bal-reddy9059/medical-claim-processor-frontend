import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AIPipelineStatus from './components/AIPipelineStatus';
import ClaimDashboard from './components/ClaimDashboard';
import ClaimPrecisionMedicalBillingPipeline from './components/ClaimPrecisionMedicalBillingPipeline';
import PipelineSettings from './components/PipelineSettings';
import ReviewExtractionResults from './components/ReviewExtractionResults';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<AIPipelineStatus />} />
          <Route path="/ai-pipeline-status" element={<AIPipelineStatus />} />
          <Route path="/claim-dashboard" element={<ClaimDashboard />} />
          <Route path="/claimprecision-medical-billing-pipeline" element={<ClaimPrecisionMedicalBillingPipeline />} />
          <Route path="/pipeline-settings" element={<PipelineSettings />} />
          <Route path="/review-extraction-results" element={<ReviewExtractionResults />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;