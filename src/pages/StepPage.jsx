import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PremiumLayout from '../components/PremiumLayout';
import BuildPanel from '../components/BuildPanel';
import { STEPS, isStepUnlocked, isStepCompleted } from '../data/steps';
import './StepPage.css';

export default function StepPage() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const step = STEPS.find(s => s.slug === slug);
    const [, forceUpdate] = useState(0);

    // If step not found, redirect
    useEffect(() => {
        if (!step) {
            navigate('/rb/01-problem', { replace: true });
        }
    }, [step, navigate]);

    // Gate check — if this step is locked, redirect to the highest unlocked step
    useEffect(() => {
        if (step && !isStepUnlocked(step.number)) {
            // Find the highest unlocked step
            let target = STEPS[0];
            for (const s of STEPS) {
                if (isStepUnlocked(s.number)) target = s;
                else break;
            }
            navigate(`/rb/${target.slug}`, { replace: true });
        }
    }, [step, navigate]);

    if (!step) return null;

    const completed = isStepCompleted(step.number);
    const nextStep = STEPS.find(s => s.number === step.number + 1);
    const prevStep = STEPS.find(s => s.number === step.number - 1);

    const handleNext = () => {
        if (nextStep && completed) {
            navigate(`/rb/${nextStep.slug}`);
        }
    };

    const handlePrev = () => {
        if (prevStep) {
            navigate(`/rb/${prevStep.slug}`);
        }
    };

    // Re-render when storage changes (artifact uploaded)
    useEffect(() => {
        const handleStorage = () => forceUpdate(n => n + 1);
        window.addEventListener('storage', handleStorage);

        // Also poll for changes from same-window localStorage updates
        const interval = setInterval(() => forceUpdate(n => n + 1), 1000);

        return () => {
            window.removeEventListener('storage', handleStorage);
            clearInterval(interval);
        };
    }, []);

    const stepTypeIcons = {
        '01-problem': '🎯',
        '02-market': '📊',
        '03-architecture': '🏗️',
        '04-hld': '📐',
        '05-lld': '🔍',
        '06-build': '⚡',
        '07-test': '🧪',
        '08-ship': '🚀',
    };

    return (
        <PremiumLayout
            sidePanel={<BuildPanel stepNumber={step.number} artifactKey={step.artifactKey} />}
        >
            <div className="step-page animate-fade-in" id={`step-page-${step.number}`}>
                {/* Step Header */}
                <div className="step-page__header">
                    <div className="step-page__icon">
                        {stepTypeIcons[step.slug] || '📋'}
                    </div>
                    <div className="step-page__header-text">
                        <div className="step-page__step-badge">
                            <span className="badge badge-accent">Step {step.number} of 8</span>
                            {completed && (
                                <span className="badge badge-success">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Complete
                                </span>
                            )}
                        </div>
                        <h1 className="step-page__title">{step.title}</h1>
                        <p className="step-page__description">{step.description}</p>
                    </div>
                </div>

                {/* Main Workspace Area */}
                <div className="step-page__workspace glass-card">
                    <div className="step-page__workspace-header">
                        <h2 className="section-title">Workspace</h2>
                        <p className="section-subtitle">
                            Use the Build Panel on the right to craft your prompt, build in Lovable, and upload your artifact screenshot to unlock the next step.
                        </p>
                    </div>

                    <div className="step-page__instructions">
                        <div className="step-page__instruction-card">
                            <div className="step-page__instruction-num">1</div>
                            <div>
                                <strong>Write your prompt</strong>
                                <p>Describe what you want to build for this step in the Build Panel textarea.</p>
                            </div>
                        </div>
                        <div className="step-page__instruction-card">
                            <div className="step-page__instruction-num">2</div>
                            <div>
                                <strong>Copy & Build</strong>
                                <p>Copy your prompt and open Lovable to build it.</p>
                            </div>
                        </div>
                        <div className="step-page__instruction-card">
                            <div className="step-page__instruction-num">3</div>
                            <div>
                                <strong>Upload artifact</strong>
                                <p>Take a screenshot of your result and upload it in the Build Panel.</p>
                            </div>
                        </div>
                    </div>

                    {!completed && (
                        <div className="step-page__gate-message">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Upload an artifact screenshot to unlock the next step.
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="step-page__nav">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePrev}
                        disabled={!prevStep}
                        id={`prev-btn-${step.number}`}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Previous
                    </button>
                    <button
                        className={`btn ${completed ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={handleNext}
                        disabled={!completed || !nextStep}
                        title={!completed ? 'Upload artifact to proceed' : !nextStep ? 'This is the last step' : `Go to Step ${step.number + 1}`}
                        id={`next-btn-${step.number}`}
                    >
                        {nextStep ? 'Next Step' : 'Final Step'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </PremiumLayout>
    );
}
