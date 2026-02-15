import { useNavigate, useLocation } from 'react-router-dom';
import { STEPS, isStepCompleted, isStepUnlocked } from '../data/steps';
import './ContextHeader.css';

export default function ContextHeader() {
    const navigate = useNavigate();
    const location = useLocation();

    const currentStep = STEPS.find(s => location.pathname.includes(s.slug));

    return (
        <nav className="context-header" id="context-header">
            <div className="context-header__steps">
                {STEPS.map(step => {
                    const completed = isStepCompleted(step.number);
                    const unlocked = isStepUnlocked(step.number);
                    const active = currentStep?.number === step.number;

                    return (
                        <button
                            key={step.number}
                            className={`context-header__step ${active ? 'active' : ''} ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                            onClick={() => unlocked && navigate(`/rb/${step.slug}`)}
                            disabled={!unlocked}
                            title={!unlocked ? 'Complete previous step first' : step.title}
                            id={`nav-step-${step.number}`}
                        >
                            <span className="context-header__step-num">
                                {completed ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </span>
                            <span className="context-header__step-title">{step.title}</span>
                            {!unlocked && (
                                <svg className="context-header__lock" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            )}
                        </button>
                    );
                })}
                <button
                    className={`context-header__step ${location.pathname === '/rb/proof' ? 'active' : ''}`}
                    onClick={() => navigate('/rb/proof')}
                    id="nav-proof"
                >
                    <span className="context-header__step-num">✦</span>
                    <span className="context-header__step-title">Proof</span>
                </button>
            </div>
        </nav>
    );
}
