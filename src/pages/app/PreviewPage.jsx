import { useState, useEffect } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import '../app/BuilderPage.css'; // Reuse shared styles

export default function PreviewPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            setData(JSON.parse(saved));
        }
    }, []);

    const checkCompleteness = () => {
        if (!data) return false;
        if (!data.personal.name) return false;
        if (data.experience.length === 0 && data.projects.length === 0) return false;
        return true;
    };

    const handlePrint = () => {
        if (!checkCompleteness()) {
            if (!confirm("Your resume may look incomplete (missing Name or Experience). Do you want to print anyway?")) {
                return;
            }
        }
        window.print();
    };

    const handleCopyText = () => {
        if (!data) return;

        const lines = [];
        lines.push(data.personal.name.toUpperCase());
        lines.push(`${data.personal.email} | ${data.personal.phone} | ${data.personal.location}`);
        lines.push(`${data.links.github} | ${data.links.linkedin}`);
        lines.push('\nSUMMARY');
        lines.push(data.summary);

        if (data.experience.length > 0) {
            lines.push('\nEXPERIENCE');
            data.experience.forEach(exp => {
                lines.push(`${exp.company} | ${exp.role} | ${exp.duration}`);
                lines.push(exp.description);
            });
        }

        if (data.projects.length > 0) {
            lines.push('\nPROJECTS');
            data.projects.forEach(proj => {
                lines.push(`${proj.name}`);
                lines.push(proj.description);
            });
        }

        if (data.education.length > 0) {
            lines.push('\nEDUCATION');
            data.education.forEach(edu => {
                lines.push(`${edu.school} | ${edu.degree} | ${edu.year}`);
            });
        }

        if (data.skills) {
            lines.push('\nSKILLS');
            lines.push(data.skills);
        }

        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            alert("Resume copied to clipboard as plain text!");
        });
    };

    if (!data) return <div className="p-10 text-center">Loading resume...</div>;

    const activeTemplate = data.activeTemplate || 'classic';

    return (
        <div className="preview-page-container">
            <div className="no-print">
                <AppNavbar />
            </div>

            <div className="preview-toolbar no-print">
                <div className="max-w-4xl mx-auto flex justify-between items-center px-6 py-4">
                    <h1 className="text-xl font-bold">Final Preview</h1>
                    <div className="flex gap-4">
                        <button onClick={handleCopyText} className="btn btn-secondary flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.402.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.21.029-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                            </svg>
                            Copy Text
                        </button>
                        <button onClick={handlePrint} className="btn btn-primary flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 001.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                            Print / Save PDF
                        </button>
                    </div>
                </div>
                {!checkCompleteness() && (
                    <div className="bg-yellow-50 text-yellow-800 text-sm text-center py-2 border-b border-yellow-100">
                        Warning: Your resume seems missing key details (Name or Experience).
                    </div>
                )}
            </div>

            <main className="preview-layout flex justify-center p-8 bg-gray-200 min-h-screen">
                <div className={`resume-preview-sheet resume-${activeTemplate}`}>
                    {/* Header */}
                    <div className="resume-header">
                        <h1>{data.personal.name || 'YOUR NAME'}</h1>
                        <div className="resume-contact">
                            <span>{data.personal.email}</span>
                            {data.personal.phone && <span>| {data.personal.phone}</span>}
                            {data.personal.location && <span>| {data.personal.location}</span>}
                        </div>
                        <div className="resume-contact">
                            <span>{data.links.github}</span>
                            {(data.links.github && data.links.linkedin) && <span>|</span>}
                            <span>{data.links.linkedin}</span>
                        </div>
                    </div>

                    {data.summary && (
                        <div className="resume-section">
                            <h2>Summary</h2>
                            <p>{data.summary}</p>
                        </div>
                    )}

                    {data.experience.length > 0 && (
                        <div className="resume-section">
                            <h2>Experience</h2>
                            {data.experience.map(exp => (
                                <div key={exp.id} className="item-row">
                                    <div className="item-header">
                                        <span className="item-title">{exp.company}</span>
                                        <span className="item-date">{exp.duration}</span>
                                    </div>
                                    <div className="item-subtitle">{exp.role}</div>
                                    <div className="item-desc">
                                        • {exp.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.projects.length > 0 && (
                        <div className="resume-section">
                            <h2>Projects</h2>
                            {data.projects.map(proj => (
                                <div key={proj.id} className="item-row">
                                    <div className="item-header">
                                        <span className="item-title">{proj.name}</span>
                                    </div>
                                    <div className="item-desc">
                                        • {proj.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.education.length > 0 && (
                        <div className="resume-section">
                            <h2>Education</h2>
                            {data.education.map(edu => (
                                <div key={edu.id} className="item-row">
                                    <div className="item-header">
                                        <span className="item-title">{edu.school}</span>
                                        <span className="item-date">{edu.year}</span>
                                    </div>
                                    <div className="item-subtitle">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {data.skills && (
                        <div className="resume-section">
                            <h2>Skills</h2>
                            <p>{data.skills}</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
