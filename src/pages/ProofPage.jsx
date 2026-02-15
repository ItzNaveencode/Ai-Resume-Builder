import { useState, useEffect } from 'react';
import PremiumLayout from '../components/PremiumLayout';
import { STEPS, isStepCompleted, getCompletedCount } from '../data/steps';
import './ProofPage.css';

export default function ProofPage() {
    const [lovableLink, setLovableLink] = useState('');
    const [githubLink, setGithubLink] = useState('');
    const [deployLink, setDeployLink] = useState('');
    const [toast, setToast] = useState(null);
    const [, forceUpdate] = useState(0);

    const completedCount = getCompletedCount();
    const allDone = completedCount === 8;

    // Load saved links
    useEffect(() => {
        const saved = localStorage.getItem('rb_proof_links');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setLovableLink(data.lovableLink || '');
                setGithubLink(data.githubLink || '');
                setDeployLink(data.deployLink || '');
            } catch (e) { /* ignore */ }
        }
    }, []);

    // Save links
    useEffect(() => {
        localStorage.setItem('rb_proof_links', JSON.stringify({
            lovableLink,
            githubLink,
            deployLink,
        }));
    }, [lovableLink, githubLink, deployLink]);

    // Poll for step changes
    useEffect(() => {
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);
        return () => clearInterval(interval);
    }, []);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleCopySubmission = async () => {
        const lines = [
            '═══════════════════════════════════════',
            '  AI Resume Builder — Final Submission',
            '═══════════════════════════════════════',
            '',
            `Steps Completed: ${completedCount}/8`,
            '',
            '── Step Status ──',
        ];

        STEPS.forEach(step => {
            const done = isStepCompleted(step.number);
            lines.push(`  ${done ? '✅' : '⬜'} Step ${step.number}: ${step.title}`);
        });

        lines.push('');
        lines.push('── Project Links ──');
        lines.push(`  Lovable:  ${lovableLink || '(not provided)'}`);
        lines.push(`  GitHub:   ${githubLink || '(not provided)'}`);
        lines.push(`  Deploy:   ${deployLink || '(not provided)'}`);
        lines.push('');
        lines.push('═══════════════════════════════════════');

        try {
            await navigator.clipboard.writeText(lines.join('\n'));
            showToast('Final submission copied!', 'success');
        } catch {
            showToast('Failed to copy', 'error');
        }
    };

    return (
        <PremiumLayout>
            <div className="proof-page animate-fade-in" id="proof-page">
                {/* Header */}
                <div className="proof-page__header">
                    <div className="proof-page__icon">✦</div>
                    <div>
                        <h1 className="proof-page__title">Proof Dashboard</h1>
                        <p className="proof-page__subtitle">
                            Review your progress, add project links, and submit your final build.
                        </p>
                    </div>
                </div>

                {/* Overall Progress */}
                <div className="proof-page__progress glass-card">
                    <div className="proof-page__progress-header">
                        <h2 className="section-title">Overall Progress</h2>
                        <span className={`badge ${allDone ? 'badge-success' : 'badge-warning'}`}>
                            {completedCount}/8 Complete
                        </span>
                    </div>
                    <div className="proof-page__progress-bar-track">
                        <div
                            className="proof-page__progress-bar-fill"
                            style={{ width: `${Math.round((completedCount / 8) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* 8 Step Status Grid */}
                <div className="proof-page__steps-grid">
                    {STEPS.map(step => {
                        const completed = isStepCompleted(step.number);
                        return (
                            <div
                                key={step.number}
                                className={`proof-page__step-card glass-card ${completed ? 'completed' : ''}`}
                                id={`proof-step-${step.number}`}
                            >
                                <div className="proof-page__step-card-header">
                                    <span className="proof-page__step-number">{step.number}</span>
                                    <span className={`status-dot ${completed ? 'status-dot-success' : 'status-dot-neutral'}`} />
                                </div>
                                <h3 className="proof-page__step-name">{step.title}</h3>
                                <p className="proof-page__step-desc">{step.description}</p>
                                <div className="proof-page__step-status">
                                    {completed ? (
                                        <span className="badge badge-success">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                            Done
                                        </span>
                                    ) : (
                                        <span className="badge badge-neutral">Pending</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Links Section */}
                <div className="proof-page__links glass-card">
                    <h2 className="section-title">Project Links</h2>
                    <p className="section-subtitle">
                        Add your project links for final submission.
                    </p>
                    <div className="proof-page__link-fields">
                        <div className="proof-page__link-field">
                            <label htmlFor="lovable-link" className="proof-page__link-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                </svg>
                                Lovable Project Link
                            </label>
                            <input
                                id="lovable-link"
                                className="input"
                                type="url"
                                value={lovableLink}
                                onChange={(e) => setLovableLink(e.target.value)}
                                placeholder="https://lovable.dev/projects/..."
                            />
                        </div>
                        <div className="proof-page__link-field">
                            <label htmlFor="github-link" className="proof-page__link-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                                </svg>
                                GitHub Repository Link
                            </label>
                            <input
                                id="github-link"
                                className="input"
                                type="url"
                                value={githubLink}
                                onChange={(e) => setGithubLink(e.target.value)}
                                placeholder="https://github.com/username/repo"
                            />
                        </div>
                        <div className="proof-page__link-field">
                            <label htmlFor="deploy-link" className="proof-page__link-label">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="2" y1="12" x2="22" y2="12" />
                                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                                </svg>
                                Deployed URL
                            </label>
                            <input
                                id="deploy-link"
                                className="input"
                                type="url"
                                value={deployLink}
                                onChange={(e) => setDeployLink(e.target.value)}
                                placeholder="https://your-app.vercel.app"
                            />
                        </div>
                    </div>
                </div>

                {/* Final Submit */}
                <div className="proof-page__submit">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleCopySubmission}
                        id="copy-final-submission"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                        </svg>
                        Copy Final Submission
                    </button>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </PremiumLayout>
    );
}
