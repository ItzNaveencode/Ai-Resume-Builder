import { useState, useEffect } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import '../app/BuilderPage.css';
import { Renderer } from '../../components/templates/ResumeTemplates';
import { calculateScore } from '../../utils/scoring';

const CircularScore = ({ score }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = '#ef4444'; // Red (0-40)
    if (score > 40) color = '#f59e0b'; // Amber (41-70)
    if (score > 70) color = '#10b981'; // Green (71-100)

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="transform -rotate-90 w-full h-full">
                <circle cx="40" cy="40" r={radius} stroke="#e5e7eb" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r={radius} stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }} />
            </svg>
            <span className="absolute text-xl font-bold" style={{ color }}>{score}</span>
        </div>
    );
};

export default function PreviewPage() {
    const [data, setData] = useState(null);
    const [atsResults, setAtsResults] = useState({ score: 0, suggestions: [] });

    useEffect(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        if (saved) {
            let parsed = JSON.parse(saved);
            // Ensure migrations
            if (!parsed.activeColor) parsed.activeColor = '#257a77';
            if (typeof parsed.skills === 'string') {
                parsed.skills = {
                    technical: parsed.skills ? parsed.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                    soft: [],
                    tools: []
                };
            }
            if (parsed.projects) {
                parsed.projects = parsed.projects.map(p => ({
                    ...p,
                    title: p.title || p.name || '',
                    techStack: p.techStack || [],
                    liveUrl: p.liveUrl || '',
                    githubUrl: p.githubUrl || ''
                }));
            }
            setData(parsed);
            setAtsResults(calculateScore(parsed));
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
                lines.push(`${proj.title} ${proj.liveUrl ? `| ${proj.liveUrl}` : ''}`);
                if (proj.techStack?.length > 0) lines.push(`Stack: ${proj.techStack.join(', ')}`);
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
            if (data.skills.technical?.length > 0) lines.push(`Technical: ${data.skills.technical.join(', ')}`);
            if (data.skills.tools?.length > 0) lines.push(`Tools: ${data.skills.tools.join(', ')}`);
            if (data.skills.soft?.length > 0) lines.push(`Soft: ${data.skills.soft.join(', ')}`);
        }

        const text = lines.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            alert("Resume copied to clipboard as plain text!");
        });
    };

    if (!data) return <div className="p-10 text-center">Loading resume...</div>;

    const scoreColor = atsResults.score > 70 ? 'text-green-600' : atsResults.score > 40 ? 'text-amber-500' : 'text-red-500';
    const scoreLabel = atsResults.score > 70 ? 'Strong Resume' : atsResults.score > 40 ? 'Getting There' : 'Needs Work';

    return (
        <div className="preview-page-container">
            <div className="no-print">
                <AppNavbar />
            </div>

            <div className="preview-toolbar no-print bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 py-4 gap-4">
                    {/* ATS Score Panel */}
                    <div className="flex items-center gap-4 bg-gray-50 p-2 rounded shadow-sm border border-gray-100 flex-1">
                        <CircularScore score={atsResults.score} />
                        <div className="flex-1">
                            <h3 className={`font-bold uppercase text-sm ${scoreColor}`}>{scoreLabel}</h3>
                            <p className="text-xs text-gray-500 mb-1">ATS Optimization Score</p>
                            {atsResults.suggestions.length > 0 ? (
                                <div className="text-xs text-gray-600">
                                    <span className="font-semibold text-gray-700">Improvement:</span> {atsResults.suggestions[0]}
                                </div>
                            ) : (
                                <div className="text-xs text-green-600 font-semibold">Great job! Your resume is optimized.</div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
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
                <div className="resume-sheet-container bg-white shadow-lg mx-auto" style={{ width: '210mm' }}>
                    <Renderer template={data.activeTemplate || 'classic'} data={data} accentColor={data.activeColor || '#257a77'} />
                </div>
            </main>
        </div>
    );
}
