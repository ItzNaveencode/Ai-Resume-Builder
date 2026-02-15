import { useState, useEffect } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import './BuilderPage.css';
import { Renderer } from '../../components/templates/ResumeTemplates';
import { calculateScore } from '../../utils/scoring';

const COLORS = [
    { name: 'Teal', value: '#257a77' }, // hsl(168, 60%, 40%) - approx
    { name: 'Navy', value: '#243c5a' },
    { name: 'Burgundy', value: '#8f2445' },
    { name: 'Forest', value: '#266946' },
    { name: 'Charcoal', value: '#404040' }
];

const TEMPLATES = [
    { id: 'classic', name: 'Classic' },
    { id: 'modern', name: 'Modern' },
    { id: 'minimal', name: 'Minimal' }
];

// --- Sub-Components ---
const TagInput = ({ tags, onAdd, onRemove, placeholder, label }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) {
                onAdd(input.trim());
                setInput('');
            }
        }
    };

    return (
        <div className="form-group mb-4">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                {label} <span className="text-gray-400 font-normal">({tags.length})</span>
            </label>
            <div className="tag-input-container flex flex-wrap gap-2 items-center p-2 border rounded bg-white">
                {tags.map((tag, i) => (
                    <span key={i} className="tag-chip bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs flex items-center gap-1">
                        {tag}
                        <button onClick={() => onRemove(tag)} className="text-gray-400 hover:text-red-500 focus:outline-none">×</button>
                    </span>
                ))}
                <input className="tag-input-field flex-1 outline-none text-sm min-w-[80px]" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Press Enter to add.</p>
        </div>
    );
};

export default function BuilderPage() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        let parsed = saved ? JSON.parse(saved) : {
            personal: { name: '', email: '', phone: '', location: '' },
            summary: '',
            education: [],
            experience: [],
            projects: [],
            skills: { technical: [], soft: [], tools: [] },
            links: { github: '', linkedin: '' },
            activeTemplate: 'classic',
            activeColor: '#257a77'
        };

        // Migrations
        if (!parsed.activeColor) parsed.activeColor = '#257a77';
        if (typeof parsed.skills === 'string') {
            parsed.skills = { technical: parsed.skills.split(',').filter(Boolean), soft: [], tools: [] };
        }
        return parsed;
    });

    const [atsScore, setAtsScore] = useState({ score: 0, suggestions: [] });
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // Persistence & Scoring
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        setAtsScore(calculateScore(data));
    }, [data]);



    const handleSuggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            setData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL"])],
                    soft: [...new Set([...prev.skills.soft, "Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggestingSkills(false);
        }, 1000);
    };

    const loadSampleData = () => {
        setData({
            personal: { name: 'Alex Thompson', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' },
            summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Passionate about AI integration and user-centric design.',
            education: [{ id: 1, school: 'University of Technology', degree: 'BS Computer Science', year: '2020-2024' }],
            experience: [{ id: 1, company: 'Tech Corp', role: 'Software Engineer', duration: '2024-Present', description: 'Built core features utilizing React and Redux, improving site performance by 20%.' }],
            projects: [
                { id: 1, title: 'AI Resume Builder', description: 'Built a premium resume builder with React and OpenAI.', techStack: ['React', 'Node.js'], liveUrl: 'resume.ai', githubUrl: '' },
                { id: 2, title: 'E-commerce Dashboard', description: 'Real-time analytics dashboard.', techStack: ['D3.js', 'Firebase'], liveUrl: '', githubUrl: '' }
            ],
            skills: {
                technical: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS'],
                soft: ['Leadership', 'Mentoring'],
                tools: ['Docker', 'Git']
            },
            links: { github: 'github.com/alex', linkedin: 'linkedin.com/in/alex' },
            activeTemplate: 'classic',
            activeColor: '#257a77'
        });
    };

    // Helper to get bullet suggestions
    const SuggestionBox = ({ text }) => {
        if (!text) return null;
        const hasQuant = /\d+|%/.test(text);
        const hasVerb = /^(Built|Led|Designed|Created|Managed|Improved)/i.test(text.trim());
        if (hasQuant && hasVerb) return null;
        return (
            <div className="mt-1 text-xs text-amber-600 bg-amber-50 p-1 border border-amber-100 rounded">
                {!hasVerb && <div>⚠️ Start with a strong action verb (Built, Led).</div>}
                {!hasQuant && <div>⚠️ Add measurable impact (numbers, %).</div>}
            </div>
        );
    };

    const getScoreColor = (s) => s >= 80 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

    return (
        <div className="builder-page">
            <AppNavbar />
            <main className="builder-layout">
                {/* --- LEFT: FORM --- */}
                <div className="builder-forms">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold font-serif">Resume Details</h2>
                        <button className="btn btn-sm btn-secondary" onClick={loadSampleData}>Sample</button>
                    </div>

                    {/* ATS Score */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">ATS Score</h3>
                            <span className="text-2xl font-bold" style={{ color: getScoreColor(atsScore.score) }}>{atsScore.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
                            <div className="h-full rounded-full transition-all" style={{ width: `${atsScore.score}%`, backgroundColor: getScoreColor(atsScore.score) }}></div>
                        </div>
                        {atsScore.suggestions.length > 0 && (
                            <div className="text-xs text-gray-600 space-y-1">
                                {atsScore.suggestions.slice(0, 3).map((s, i) => <div key={i}>• {s}</div>)}
                            </div>
                        )}
                    </div>

                    {/* Personal Info */}
                    <section className="form-section">
                        <div className="form-header">Personal Info</div>
                        <div className="form-row">
                            <input className="input" placeholder="Full Name" value={data.personal.name} onChange={e => setData({ ...data, personal: { ...data.personal, name: e.target.value } })} />
                            <input className="input" placeholder="Email" value={data.personal.email} onChange={e => setData({ ...data, personal: { ...data.personal, email: e.target.value } })} />
                        </div>
                        <div className="form-row mt-2">
                            <input className="input" placeholder="Phone" value={data.personal.phone} onChange={e => setData({ ...data, personal: { ...data.personal, phone: e.target.value } })} />
                            <input className="input" placeholder="Location" value={data.personal.location} onChange={e => setData({ ...data, personal: { ...data.personal, location: e.target.value } })} />
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="form-section">
                        <div className="form-header">Summary</div>
                        <textarea className="textarea w-full" rows={4} value={data.summary} onChange={e => setData({ ...data, summary: e.target.value })} placeholder="Professional summary..." />
                    </section>

                    {/* Skills */}
                    <section className="form-section">
                        <div className="form-header flex justify-between">
                            Skills
                            <button className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded" onClick={handleSuggestSkills} disabled={isSuggestingSkills}>
                                {isSuggestingSkills ? 'Adding...' : '✨ Suggest AI Skills'}
                            </button>
                        </div>
                        <TagInput label="Technical" tags={data.skills.technical} onAdd={t => setData({ ...data, skills: { ...data.skills, technical: [...data.skills.technical, t] } })} onRemove={t => setData({ ...data, skills: { ...data.skills, technical: data.skills.technical.filter(x => x !== t) } })} placeholder="React, Node..." />
                        <TagInput label="Tools" tags={data.skills.tools} onAdd={t => setData({ ...data, skills: { ...data.skills, tools: [...data.skills.tools, t] } })} onRemove={t => setData({ ...data, skills: { ...data.skills, tools: data.skills.tools.filter(x => x !== t) } })} placeholder="Git, Docker..." />
                        <TagInput label="Soft Skills" tags={data.skills.soft} onAdd={t => setData({ ...data, skills: { ...data.skills, soft: [...data.skills.soft, t] } })} onRemove={t => setData({ ...data, skills: { ...data.skills, soft: data.skills.soft.filter(x => x !== t) } })} placeholder="Leadership..." />
                    </section>

                    {/* Projects */}
                    <section className="form-section">
                        <div className="form-header flex justify-between">Projects <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, projects: [...prev.projects, { id: Date.now(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }] }))}>+ Add</button></div>
                        {data.projects.map((proj, idx) => (
                            <div key={proj.id} className="mb-4 border p-3 rounded bg-white">
                                <input className="input font-bold mb-2 w-full" placeholder="Project Title" value={proj.title} onChange={e => {
                                    const projects = [...data.projects]; projects[idx].title = e.target.value; setData({ ...data, projects });
                                }} />
                                <textarea className="textarea w-full text-sm mb-1" placeholder="Description" rows={3} value={proj.description} onChange={e => {
                                    const projects = [...data.projects]; projects[idx].description = e.target.value; setData({ ...data, projects });
                                }} />
                                <SuggestionBox text={proj.description} />
                                <div className="mt-2">
                                    <TagInput label="Stack" tags={proj.techStack} onAdd={t => {
                                        const projects = [...data.projects]; projects[idx].techStack = [...projects[idx].techStack, t]; setData({ ...data, projects });
                                    }} onRemove={t => {
                                        const projects = [...data.projects]; projects[idx].techStack = projects[idx].techStack.filter(x => x !== t); setData({ ...data, projects });
                                    }} placeholder="React..." />
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input className="input text-xs flex-1" placeholder="Live URL" value={proj.liveUrl} onChange={e => { const p = [...data.projects]; p[idx].liveUrl = e.target.value; setData({ ...data, projects: p }) }} />
                                    <input className="input text-xs flex-1" placeholder="GitHub" value={proj.githubUrl} onChange={e => { const p = [...data.projects]; p[idx].githubUrl = e.target.value; setData({ ...data, projects: p }) }} />
                                </div>
                                <button className="text-xs text-red-500 mt-2 hover:underline" onClick={() => setData({ ...data, projects: data.projects.filter(p => p.id !== proj.id) })}>Delete</button>
                            </div>
                        ))}
                    </section>

                    {/* Experience (Simplified for brevity as structure is same) */}
                    <section className="form-section">
                        <div className="form-header flex justify-between">Experience <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }] }))}>+ Add</button></div>
                        {data.experience.map((exp, idx) => (
                            <div key={exp.id} className="mb-4 border-b pb-4">
                                <input className="input mb-2 font-bold" placeholder="Company" value={exp.company} onChange={e => { const n = [...data.experience]; n[idx].company = e.target.value; setData({ ...data, experience: n }) }} />
                                <div className="flex gap-2 mb-2">
                                    <input className="input text-xs flex-1" placeholder="Role" value={exp.role} onChange={e => { const n = [...data.experience]; n[idx].role = e.target.value; setData({ ...data, experience: n }) }} />
                                    <input className="input text-xs flex-1" placeholder="Duration" value={exp.duration} onChange={e => { const n = [...data.experience]; n[idx].duration = e.target.value; setData({ ...data, experience: n }) }} />
                                </div>
                                <textarea className="textarea w-full text-sm" placeholder="Description" rows={3} value={exp.description} onChange={e => { const n = [...data.experience]; n[idx].description = e.target.value; setData({ ...data, experience: n }) }} />
                                <SuggestionBox text={exp.description} />
                            </div>
                        ))}
                    </section>
                    {/* Education... (omitted for brevity, matches structure) */}
                    <section className="form-section">
                        <div className="form-header">Education <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), school: '', degree: '', year: '' }] }))}>+ Add</button></div>
                        {data.education.map((edu, idx) => (
                            <div key={edu.id} className="mb-2">
                                <input className="input w-full mb-1" placeholder="School" value={edu.school} onChange={e => { const n = [...data.education]; n[idx].school = e.target.value; setData({ ...data, education: n }) }} />
                                <div className="flex gap-2">
                                    <input className="input text-xs flex-1" placeholder="Degree" value={edu.degree} onChange={e => { const n = [...data.education]; n[idx].degree = e.target.value; setData({ ...data, education: n }) }} />
                                    <input className="input text-xs w-20" placeholder="Year" value={edu.year} onChange={e => { const n = [...data.education]; n[idx].year = e.target.value; setData({ ...data, education: n }) }} />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="form-section">
                        <div className="form-header">Links</div>
                        <div className="flex gap-2">
                            <input className="input text-xs flex-1" placeholder="GitHub" value={data.links.github} onChange={e => setData({ ...data, links: { ...data.links, github: e.target.value } })} />
                            <input className="input text-xs flex-1" placeholder="LinkedIn" value={data.links.linkedin} onChange={e => setData({ ...data, links: { ...data.links, linkedin: e.target.value } })} />
                        </div>
                    </section>
                </div>

                {/* --- RIGHT: PREVIEW PANEL --- */}
                <div className="builder-preview-panel">
                    {/* Styles & Options Header */}
                    <div className="p-6 border-b bg-gray-50">
                        <div className="mb-4">
                            <h3 className="text-xs font-bold uppercase text-gray-500 mb-3">Select Template</h3>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {TEMPLATES.map(t => (
                                    <div key={t.id}
                                        onClick={() => setData(prev => ({ ...prev, activeTemplate: t.id }))}
                                        className={`relative cursor-pointer transition-all ${data.activeTemplate === t.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                                    >
                                        <div className="w-[120px] h-[160px] bg-white border border-gray-300 shadow-sm rounded flex flex-col items-center justify-center overflow-hidden">
                                            {/* Thumbnail Sketches */}
                                            {t.id === 'classic' && (
                                                <div className="w-full h-full p-2 flex flex-col gap-1 items-center opacity-40">
                                                    <div className="w-16 h-2 bg-gray-800 rounded"></div>
                                                    <div className="w-20 h-1 bg-gray-400 rounded"></div>
                                                    <div className="w-full h-px bg-gray-300 mt-2"></div>
                                                    <div className="w-full flex-1 flex flex-col gap-1 mt-1">
                                                        <div className="w-8 h-1 bg-gray-800 rounded"></div>
                                                        <div className="w-full h-1 bg-gray-300 rounded"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {t.id === 'modern' && (
                                                <div className="w-full h-full flex opacity-40">
                                                    <div className="w-1/3 bg-gray-200 h-full p-1 flex flex-col gap-1">
                                                        <div className="w-full h-8 bg-gray-400 rounded-sm"></div>
                                                        <div className="w-full h-1 bg-gray-400 mt-2"></div>
                                                        <div className="w-full h-1 bg-gray-400"></div>
                                                    </div>
                                                    <div className="w-2/3 h-full p-1 flex flex-col gap-1">
                                                        <div className="w-12 h-1 bg-gray-800 rounded"></div>
                                                        <div className="w-full h-1 bg-gray-300 rounded"></div>
                                                    </div>
                                                </div>
                                            )}
                                            {t.id === 'minimal' && (
                                                <div className="w-full h-full p-3 flex flex-col gap-1 items-start opacity-40">
                                                    <div className="w-20 h-2 bg-gray-800 rounded-none mb-2"></div>
                                                    <div className="w-full h-1 bg-gray-300 rounded-none"></div>
                                                    <div className="w-full h-1 bg-gray-300 rounded-none"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center text-xs font-semibold mt-1 text-gray-700">{t.name}</div>
                                        {data.activeTemplate === t.id && (
                                            <div className="absolute top-[-6px] right-[-6px] bg-blue-500 text-white rounded-full p-0.5">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-xs font-bold uppercase text-gray-500 mb-2">Accent Color</h3>
                                <div className="flex gap-3">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.name}
                                            onClick={() => setData(prev => ({ ...prev, activeColor: c.value }))}
                                            className={`w-6 h-6 rounded-full border border-gray-200 transition-transform ${data.activeColor === c.value ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c.value }}
                                            title={c.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <button className="btn btn-primary" onClick={() => {
                                // Just a toast as requested, simulated export
                                const toast = document.createElement('div');
                                toast.className = 'toast animate-fade-in fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50';
                                toast.innerText = 'PDF export ready! Check your downloads.';
                                document.body.appendChild(toast);
                                setTimeout(() => toast.remove(), 3000);
                            }}>
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {/* Resume Sheet */}
                    <div className="builder-layout-renderer bg-gray-200 p-8 flex justify-center items-start overflow-y-auto" style={{ minHeight: 'calc(100vh - 200px)' }}>
                        <div className="resume-sheet-container shadow-2xl origin-top transition-all" style={{ transform: 'scale(0.9)' }}>
                            <Renderer template={data.activeTemplate} data={data} accentColor={data.activeColor || '#257a77'} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
