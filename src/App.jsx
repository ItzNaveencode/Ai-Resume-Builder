import { Routes, Route, Navigate } from 'react-router-dom';
import StepPage from './pages/StepPage';
import ProofPage from './pages/ProofPage';
import LandingPage from './pages/app/LandingPage';
import BuilderPage from './pages/app/BuilderPage';
import PreviewPage from './pages/app/PreviewPage';
import AppProofPage from './pages/app/AppProofPage';

export default function App() {
  return (
    <Routes>
      {/* === Build Track Routes (The Guide) === */}
      {/* Proof page for the Build Track */}
      <Route path="/rb/proof" element={<ProofPage />} />
      {/* Parameterized step route */}
      <Route path="/rb/:slug" element={<StepPage />} />

      {/* === Product Routes (The App You Are Building) === */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/preview" element={<PreviewPage />} />

      {/* The prompt asked for /proof for the app. 
          To avoid conflict with /rb/proof, we will route /proof to the App's proof page.
          The Build Track's proof page remains at /rb/proof. */}
      <Route path="/proof" element={<AppProofPage />} />

      {/* Default Fallback - if no match, go to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
