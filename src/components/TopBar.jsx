import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { STEPS, isStepCompleted, isStepUnlocked, getCompletedCount } from '../data/steps';
import './TopBar.css';

export default function TopBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const completedCount = getCompletedCount();

    // Determine which step we're currently on
    const currentStep = STEPS.find(s => location.pathname.includes(s.slug));
    const currentStepNum = currentStep ? currentStep.number : null;

    // Status
    const allDone = completedCount === 8;
    const statusLabel = allDone ? 'Complete' : 'In Progress';
    const statusClass = allDone ? 'badge-success' : 'badge-warning';

    return (
        <header className="top-bar" id="top-bar">
            {/* Left — Brand */}
            <div className="top-bar__brand" onClick={() => navigate('/rb/01-problem')} role="button" tabIndex={0} id="brand-link">
                <div className="top-bar__logo-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                </div>
                <span className="top-bar__brand-text">AI Resume Builder</span>
            </div>

            {/* Center — Step Progress */}
            <div className="top-bar__center" id="step-progress">
                <span className="top-bar__project-label">Project 3</span>
                <span className="top-bar__separator">—</span>
                <span className="top-bar__step-label">
                    {currentStepNum ? `Step ${currentStepNum} of 8` : 'Proof Dashboard'}
                </span>
                <div className="step-indicator top-bar__dots">
                    {STEPS.map((step, i) => {
                        const completed = isStepCompleted(step.number);
                        const active = step.number === currentStepNum;
                        const locked = !isStepUnlocked(step.number);
                        return (
                            <React.Fragment key={step.number}>
                                {i > 0 && <span className={`step-connector ${completed ? 'completed' : ''}`} />}
                                <span
                                    className={`step-dot ${completed ? 'completed' : ''} ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
                                    title={`Step ${step.number}: ${step.title}`}
                                />
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Right — Status Badge */}
            <div className="top-bar__right" id="status-area">
                <span className={`badge ${statusClass}`} id="status-badge">
                    <span className={`status-dot ${allDone ? 'status-dot-success' : 'status-dot-warning'}`} />
                    {statusLabel}
                </span>
            </div>
        </header>
    );
}
