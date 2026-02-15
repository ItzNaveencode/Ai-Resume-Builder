import { useState, useEffect } from 'react';
import './BuildPanel.css';

export default function BuildPanel({ stepNumber, artifactKey }) {
    const [lovableText, setLovableText] = useState('');
    const [artifact, setArtifact] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'worked' | 'error' | null
    const [screenshotName, setScreenshotName] = useState('');
    const [toast, setToast] = useState(null);
    const [copied, setCopied] = useState(false);

    // Load persisted data on mount
    useEffect(() => {
        const saved = localStorage.getItem(`rb_build_panel_${stepNumber}`);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setLovableText(data.lovableText || '');
                setFeedback(data.feedback || null);
                setScreenshotName(data.screenshotName || '');
            } catch (e) {
                // ignore
            }
        }
        const existing = localStorage.getItem(artifactKey);
        if (existing) setArtifact(existing);
    }, [stepNumber, artifactKey]);

    // Auto-save build panel state
    useEffect(() => {
        localStorage.setItem(`rb_build_panel_${stepNumber}`, JSON.stringify({
            lovableText,
            feedback,
            screenshotName,
        }));
    }, [lovableText, feedback, screenshotName, stepNumber]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 2500);
    };

    const handleCopy = async () => {
        if (!lovableText.trim()) return;
        try {
            await navigator.clipboard.writeText(lovableText);
            setCopied(true);
            showToast('Copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast('Failed to copy', 'error');
        }
    };

    const handleBuildInLovable = () => {
        window.open('https://lovable.dev', '_blank');
    };

    const handleFeedback = (type) => {
        setFeedback(type);
        if (type === 'worked') {
            showToast('Marked as working!', 'success');
        }
    };

    const handleScreenshot = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const data = reader.result;
            localStorage.setItem(artifactKey, data);
            setArtifact(data);
            setScreenshotName(file.name);
            showToast('Artifact uploaded! ✓', 'success');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveArtifact = () => {
        localStorage.removeItem(artifactKey);
        setArtifact(null);
        setScreenshotName('');
        showToast('Artifact removed', 'error');
    };

    return (
        <aside className="build-panel glass-card animate-slide-right" id={`build-panel-step-${stepNumber}`}>
            <div className="build-panel__header">
                <h3 className="build-panel__title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Build Panel
                </h3>
                <span className="badge badge-accent">Step {stepNumber}</span>
            </div>

            {/* Lovable Textarea */}
            <div className="build-panel__section">
                <label className="build-panel__label" htmlFor={`lovable-text-${stepNumber}`}>
                    Copy This Into Lovable
                </label>
                <textarea
                    id={`lovable-text-${stepNumber}`}
                    className="textarea"
                    value={lovableText}
                    onChange={(e) => setLovableText(e.target.value)}
                    placeholder="Paste your prompt or spec for Lovable here..."
                    rows={6}
                />
            </div>

            {/* Action Buttons */}
            <div className="build-panel__actions">
                <button
                    className={`btn ${copied ? 'btn-success' : 'btn-secondary'} btn-sm`}
                    onClick={handleCopy}
                    disabled={!lovableText.trim()}
                    id={`copy-btn-${stepNumber}`}
                >
                    {copied ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                            </svg>
                            Copy
                        </>
                    )}
                </button>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleBuildInLovable}
                    id={`build-lovable-btn-${stepNumber}`}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Build in Lovable
                </button>
            </div>

            {/* Feedback Section */}
            <div className="build-panel__section">
                <label className="build-panel__label">Result</label>
                <div className="build-panel__feedback">
                    <button
                        className={`btn btn-sm ${feedback === 'worked' ? 'btn-success' : 'btn-outline'}`}
                        onClick={() => handleFeedback('worked')}
                        id={`feedback-worked-${stepNumber}`}
                    >
                        ✓ It Worked
                    </button>
                    <button
                        className={`btn btn-sm ${feedback === 'error' ? 'btn-danger' : 'btn-outline'}`}
                        onClick={() => handleFeedback('error')}
                        id={`feedback-error-${stepNumber}`}
                    >
                        ✕ Error
                    </button>
                </div>
            </div>

            {/* Upload Artifact */}
            <div className="build-panel__section">
                <label className="build-panel__label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Add Screenshot / Artifact
                </label>
                {artifact ? (
                    <div className="build-panel__artifact-preview">
                        <div className="build-panel__artifact-image-wrap">
                            <img src={artifact} alt="Uploaded artifact" className="build-panel__artifact-img" />
                        </div>
                        <div className="build-panel__artifact-info">
                            <span className="build-panel__artifact-name">{screenshotName || 'artifact'}</span>
                            <button className="btn btn-sm btn-danger" onClick={handleRemoveArtifact} id={`remove-artifact-${stepNumber}`}>
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <label className="build-panel__upload-zone" htmlFor={`artifact-upload-${stepNumber}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Click to upload screenshot</span>
                        <span className="build-panel__upload-hint">PNG, JPG, or WebP</span>
                        <input
                            id={`artifact-upload-${stepNumber}`}
                            type="file"
                            accept="image/*"
                            onChange={handleScreenshot}
                            style={{ display: 'none' }}
                        />
                    </label>
                )}
            </div>

            {/* Status */}
            <div className="build-panel__status">
                {artifact ? (
                    <span className="badge badge-success">
                        <span className="status-dot status-dot-success" />
                        Artifact Saved
                    </span>
                ) : (
                    <span className="badge badge-neutral">
                        <span className="status-dot status-dot-neutral" />
                        Upload to proceed
                    </span>
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </aside>
    );
}
