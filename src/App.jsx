import { Routes, Route, Navigate } from 'react-router-dom';
import StepPage from './pages/StepPage';
import ProofPage from './pages/ProofPage';

export default function App() {
  return (
    <Routes>
      {/* Proof page (before parameterized route) */}
      <Route path="/rb/proof" element={<ProofPage />} />

      {/* Step route (parameterized) */}
      <Route path="/rb/:slug" element={<StepPage />} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/rb/01-problem" replace />} />
    </Routes>
  );
}
