import { useState, useEffect } from 'react';
import PremiumLayout from '../components/PremiumLayout';
import { STEPS, isStepCompleted, getCompletedCount } from '../data/steps';
import './ProofPage.css';

const CHECKLIST_ITEMS = [
    "All form sections save to localStorage",
    "Live preview updates in real-time",
    "Template switching preserves data",
    "Color theme persists after refresh",
    "ATS score calculates correctly",
    "Score updates live on edit",
    "Export buttons work (copy/download)",
    "Empty states handled gracefully",
    "Mobile responsive layout works",
    "No console errors on any page"
];

export default function ProofPage() {
    const [lovableLink, setLovableLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [checklist, setChecklist] = useState({});
    const [toast, setToast] = useState(null);
    const [, forceUpdate] = useState(0);

    const completedStepCount = getCompletedCount();
    const stepsDone = completedStepCount === 8;

    const checklistComplete = CHECKLIST_ITEMS.every(item => checklist[item] === true);

    const validUrl = (url) => {
        try { new URL(url); return true; } catch { return false; }
    };
    const linksComplete = validUrl(lovableLink) && validUrl(githubLink) && validUrl(deployLink);

    const isShipped = stepsDone && checklistComplete && linksComplete;

    useEffect(() => {
        const saved = localStorage.getItem('rb_final_submission');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setLovableLink(data.lovableLink || '');
                setGithubLink(data.githubLink || '');
                setDeployLink(data.deployLink || '');
                setChecklist(data.checklist || {});
            } catch (e) { /* ignore */ }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rb_final_submission', JSON.stringify({
            lovableLink,
            githubLink,
            deployLink,
            checklist,
            shipped: isShipped
        }));
    }, [lovableLink, githubLink, deployLink, checklist, isShipped]);

    useEffect(() => {
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleCopySubmission = async () => {
        const text = `------------------------------------------
AI Resume Builder — Final Submission

Lovable Project: ${lovableLink}
GitHub Repository: ${githubLink}
Live Deployment: ${deployLink}

Core Capabilities:
- Structured resume builder
- Deterministic ATS scoring
- Template switching
- PDF export with clean formatting
- Persistence + validation checklist
------------------------------------------`;

        try {
            await navigator.clipboard.writeText(text);
            showToast('Final submission copied!', 'success');
        } catch {
            showToast('Failed to copy', 'error');
        }
    };

    const toggleCheck = (item) => {
        setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
    };

    return (
        <PremiumLayout>
            <div className="proof-page animate-fade-in pb-20">
                {/* Header */}
                <div className="proof-page__header">
                    <div className="proof-header-content">
                        <div>
                            <div className="proof-title-row">
                                <div className="proof-icon">✦</div>
                                <h1 className="proof-title">Proof Dashboard</h1>
                            </div>
                            <p className="proof-subtitle">
                                Verify your build, validate functionality, and generate your final submission proof.
                            </p>
                        </div>
                        <div className={`status-badge ${isShipped ? 'status-shipped' : 'status-progress'}`}>
                            {isShipped ? 'SHIPPED' : 'IN PROGRESS'}
                        </div>
                    </div>
                </div>

                {isShipped && (
                    <div className="success-banner animate-fade-in">
                        <h2 className="success-title">Project 3 Shipped Successfully.</h2>
                        <p className="success-text">Premium execution. Ready for submission.</p>
                    </div>
                )}

                <div className="proof-grid">
                    {/* Left Column */}
                    <div className="proof-main-col">
                        {/* Steps */}
                        <section className="proof-card">
                            <div className="card-header">
                                <h2 className="section-title">Development Steps</h2>
                                <span className="step-counter">
                                    {completedStepCount}/8 COMPLETED
                                </span>
                            </div>
                            <div className="step-list">
                                {STEPS.map(step => {
                                    const completed = isStepCompleted(step.number);
                                    return (
                                        <div key={step.number} className={`step-item ${completed ? 'step-done' : 'step-pending'}`}>
                                            <div className="step-check">
                                                {completed ? '✓' : step.number}
                                            </div>
                                            <div className="step-info">
                                                <h3 className="step-title">{step.title}</h3>
                                            </div>
                                            {completed && <span className="step-status-text">Done</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Artifacts */}
                        <section className="proof-card">
                            <h2 className="section-title">Artifact Collection</h2>
                            <p className="section-desc">All links are required for shipment.</p>

                            <div className="inputs-stack">
                                <div className="input-group">
                                    <label>Lovable Project Link</label>
                                    <input
                                        className={`input ${lovableLink && !validUrl(lovableLink) ? 'input-error' : ''}`}
                                        value={lovableLink}
                                        onChange={e => setLovableLink(e.target.value)}
                                        placeholder="https://lovable.dev/..."
                                    />
                                </div>
                                <div className="input-group">
                                    <label>GitHub Repository</label>
                                    <input
                                        className={`input ${githubLink && !validUrl(githubLink) ? 'input-error' : ''}`}
                                        value={githubLink}
                                        onChange={e => setGithubLink(e.target.value)}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Deployed URL</label>
                                    <input
                                        className={`input ${deployLink && !validUrl(deployLink) ? 'input-error' : ''}`}
                                        value={deployLink}
                                        onChange={e => setDeployLink(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="proof-side-col">
                        {/* Checklist */}
                        <section className="proof-card">
                            <h2 className="section-title">Validation Checklist</h2>
                            <div className="checklist">
                                {CHECKLIST_ITEMS.map((item, i) => (
                                    <label key={i} className="checklist-item">
                                        <input
                                            type="checkbox"
                                            checked={checklist[item] || false}
                                            onChange={() => toggleCheck(item)}
                                        />
                                        <span>{item}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Export */}
                        <section className="export-card">
                            <div className="export-status">
                                <span className={`status-dot-lg ${isShipped ? 'dot-green' : 'dot-gray'}`}></span>
                                <h3>{isShipped ? 'Ready to Ship' : 'Not Ready'}</h3>
                            </div>
                            {!isShipped && <p className="not-ready-text">Complete all steps, checklist items, and links.</p>}

                            <button
                                onClick={handleCopySubmission}
                                className={`btn-block ${isShipped ? 'btn-primary' : 'btn-disabled'}`}
                                disabled={!isShipped}
                            >
                                Copy Final Submission
                            </button>
                        </section>
                    </div>
                </div>

                {toast && (
                    <div className={`toast-notification type-${toast.type}`}>
                        {toast.type === 'success' && <span>✓</span>} {toast.message}
                    </div>
                )}
            </div>
        </PremiumLayout>
    );
}
