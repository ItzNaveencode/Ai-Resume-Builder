import { useState, useEffect } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import './BuilderPage.css';

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
                        <button
                            onClick={() => onRemove(tag)}
                            className="text-gray-400 hover:text-red-500 focus:outline-none"
                            aria-label="Remove tag"
                        >×</button>
                    </span>
                ))}
                <input
                    className="tag-input-field flex-1 outline-none text-sm min-w-[80px]"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                />
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
            projects: [], // Array of { id, title, description, techStack, liveUrl, githubUrl }
            skills: { technical: [], soft: [], tools: [] },
            links: { github: '', linkedin: '' },
            activeTemplate: 'classic'
        };

        // Migration: Skills string -> object
        if (typeof parsed.skills === 'string') {
            parsed.skills = {
                technical: parsed.skills ? parsed.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
                soft: [],
                tools: []
            };
        }
        // Ensure skills structure
        if (!parsed.skills.technical) parsed.skills.technical = [];
        if (!parsed.skills.soft) parsed.skills.soft = [];
        if (!parsed.skills.tools) parsed.skills.tools = [];

        // Migration: Projects name -> title & new fields
        if (parsed.projects) {
            parsed.projects = parsed.projects.map(p => ({
                ...p,
                title: p.title || p.name || '',
                techStack: p.techStack || [],
                liveUrl: p.liveUrl || '',
                githubUrl: p.githubUrl || ''
            }));
        }

        if (!parsed.activeTemplate) parsed.activeTemplate = 'classic';

        return parsed;
    });

    const [atsScore, setAtsScore] = useState({ score: 0, suggestions: [] });
    const [isSuggestingSkills, setIsSuggestingSkills] = useState(false);

    // Save & Score
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        setAtsScore(calculateScore(data));
    }, [data]);

    const calculateScore = (data) => {
        let score = 0;
        const suggestions = [];

        // Base Score
        score += 20;

        // Summary
        const summaryWords = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) score += 15;
        else suggestions.push(`Write a stronger summary (currently ${summaryWords} words, target 40–120).`);

        // Projects
        if (data.projects.length >= 2) score += 10;
        else suggestions.push("Add at least 2 projects.");

        // Experience
        if (data.experience.length >= 1) score += 10;
        else suggestions.push("Add at least 1 work experience.");

        // Skills (Total count across categories)
        const totalSkills = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
        if (totalSkills >= 8) score += 10;
        else suggestions.push("Add more skills (target 8+ total).");

        // Links
        if ((data.links.github && data.links.github.length > 0) || (data.links.linkedin && data.links.linkedin.length > 0)) score += 10;
        else suggestions.push("Add GitHub or LinkedIn link.");

        // Impact
        const allDescriptions = [
            ...data.experience.map(e => e.description || ''),
            ...data.projects.map(p => p.description || '')
        ];
        if (allDescriptions.some(desc => /\d+|%|\bk\b|\bX\b/i.test(desc))) score += 15;
        else suggestions.push("Add measurable impact (numbers) in descriptions.");

        // Education
        const eduComplete = data.education.length > 0 && data.education.every(e => e.school && e.degree && e.year);
        if (eduComplete) score += 10;
        else if (data.education.length === 0) suggestions.push("Add education details.");
        else suggestions.push("Complete all education fields.");

        return { score: Math.min(100, score), suggestions: suggestions };
    };

    const handleSuggestSkills = () => {
        setIsSuggestingSkills(true);
        setTimeout(() => {
            setData(prev => ({
                ...prev,
                skills: {
                    technical: [...new Set([...prev.skills.technical, "TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"])],
                    soft: [...new Set([...prev.skills.soft, "Team Leadership", "Problem Solving"])],
                    tools: [...new Set([...prev.skills.tools, "Git", "Docker", "AWS"])]
                }
            }));
            setIsSuggestingSkills(false);
        }, 1000);
    };

    const handleAddSkill = (category, skill) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...prev.skills[category], skill]
            }
        }));
    };

    const handleRemoveSkill = (category, skillToRemove) => {
        setData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: prev.skills[category].filter(s => s !== skillToRemove)
            }
        }));
    };

    // --- Suggestion Helpers ---
    const getBulletSuggestions = (text) => {
        if (!text) return [];
        const lines = text.split('\n').filter(line => line.trim().length > 5);
        const issues = [];
        const actionVerbs = /^(Built|Developed|Designed|Implemented|Led|Improved|Created|Optimized|Automated|Reduced|Increased|Managed|Orchestrated|Architected|Engineered|Deployed|Launched|Collaborated)/i;
        const numberPattern = /\d+|%|\bk\b|\bX\b/i;

        let missingVerb = false;
        let missingQuant = false;

        lines.forEach(line => {
            const cleanLine = line.replace(/^[-•*]\s*/, '').trim();
            if (!actionVerbs.test(cleanLine)) missingVerb = true;
            if (!numberPattern.test(cleanLine)) missingQuant = true;
        });

        if (missingVerb) issues.push("Start bullets with strong action verbs (Built, Led).");
        if (missingQuant) issues.push("Add measurable impact (numbers, %, scale).");

        return issues;
    };

    const SuggestionBox = ({ text }) => {
        const issues = getBulletSuggestions(text);
        if (issues.length === 0) return null;
        return (
            <div className="mt-2 space-y-1">
                {issues.map((msg, idx) => (
                    <div key={idx} className="field-suggestion flex items-center gap-1 text-xs text-amber-600 bg-amber-50 p-1 rounded border border-amber-100">
                        <span>⚠️ {msg}</span>
                    </div>
                ))}
            </div>
        );
    };

    const getScoreColor = (s) => s >= 80 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning)' : 'var(--color-error)';

    const loadSampleData = () => {
        setData({
            personal: { name: 'Alex Thompson', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' },
            summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Proven track record of leading teams, optimizing performance, and delivering high-impact features. Passionate about AI integration and user-centric design. Experienced in Agile environments and mentoring junior developers.',
            education: [{ id: 1, school: 'University of Technology', degree: 'BS Computer Science', year: '2020-2024' }],
            experience: [{ id: 1, company: 'Tech Corp', role: 'Software Engineer', duration: '2024-Present', description: 'Built core features for the main platform, reducing load times by 40% using React optimizations.' }],
            projects: [
                { id: 1, title: 'AI Resume Builder', description: 'Built a premium resume builder with React and OpenAI that serves 500+ users.', techStack: ['React', 'OpenAI', 'Node.js'], liveUrl: 'https://resume.ai', githubUrl: 'github.com/alex/resume' },
                { id: 2, title: 'E-commerce Dashboard', description: 'Designed a real-time analytics dashboard processing 10k events/sec.', techStack: ['d3.js', 'Firebase', 'TypeScript'], liveUrl: '', githubUrl: '' }
            ],
            skills: {
                technical: ['React', 'Node.js', 'Python', 'TypeScript', 'AWS'],
                soft: ['Leadership', 'Mentoring', 'Agile'],
                tools: ['Docker', 'Git', 'Jira']
            },
            links: { github: 'github.com/alex', linkedin: 'linkedin.com/in/alex' },
            activeTemplate: 'classic'
        });
    };


    return (
        <div className="builder-page">
            <AppNavbar />
            <main className="builder-layout">
                {/* Left: Form Sections */}
                <div className="builder-forms">

                    {/* Header & Template Selector */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold font-serif">Resume Details</h2>
                            <button className="btn btn-sm btn-secondary" onClick={loadSampleData}>Sample</button>
                        </div>

                        <div className="template-selector">
                            {['classic', 'modern', 'minimal'].map(t => (
                                <button key={t} className={`template-btn ${data.activeTemplate === t ? 'active' : ''}`}
                                    onClick={() => setData(prev => ({ ...prev, activeTemplate: t }))}>
                                    {t.charAt(0).toUpperCase() + t.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ATS Score */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-sm font-bold text-gray-500 uppercase">ATS Readiness Score</h3>
                            <span className="text-2xl font-serif font-bold" style={{ color: getScoreColor(atsScore.score) }}>
                                {atsScore.score}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                            <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${atsScore.score}%`, backgroundColor: getScoreColor(atsScore.score) }}></div>
                        </div>
                        {atsScore.suggestions.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600 space-y-1">
                                <strong className="block text-xs uppercase text-gray-400">Top Improvements:</strong>
                                {atsScore.suggestions.slice(0, 3).map((s, i) => (
                                    <div key={i} className="flex gap-2"><span>•</span><span>{s}</span></div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Personal Info */}
                    <section className="form-section">
                        <div className="form-header">Personal Info</div>
                        <div className="form-row">
                            <div className="form-group"><label>Full Name</label><input className="input" value={data.personal.name} onChange={e => setData({ ...data, personal: { ...data.personal, name: e.target.value } })} placeholder="John Doe" /></div>
                            <div className="form-group"><label>Email</label><input className="input" value={data.personal.email} onChange={e => setData({ ...data, personal: { ...data.personal, email: e.target.value } })} placeholder="john@example.com" /></div>
                        </div>
                        <div className="form-row">
                            <div className="form-group"><label>Phone</label><input className="input" value={data.personal.phone} onChange={e => setData({ ...data, personal: { ...data.personal, phone: e.target.value } })} placeholder="(555) 123-4567" /></div>
                            <div className="form-group"><label>Location</label><input className="input" value={data.personal.location} onChange={e => setData({ ...data, personal: { ...data.personal, location: e.target.value } })} placeholder="City, State" /></div>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="form-section">
                        <div className="form-header">Summary</div>
                        <textarea className="textarea w-full" rows={4} value={data.summary} onChange={e => setData({ ...data, summary: e.target.value })} placeholder="Professional summary..." />
                    </section>

                    {/* Skills Section */}
                    <section className="form-section">
                        <div className="form-header flex justify-between items-center">
                            Skills
                            <button
                                onClick={handleSuggestSkills}
                                disabled={isSuggestingSkills}
                                className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors"
                            >
                                {isSuggestingSkills ? 'Adding...' : '✨ Suggest AI Skills'}
                            </button>
                        </div>
                        <TagInput
                            label="Technical Skills"
                            tags={data.skills.technical}
                            onAdd={(tag) => handleAddSkill('technical', tag)}
                            onRemove={(tag) => handleRemoveSkill('technical', tag)}
                            placeholder="Type & Enter (e.g. React)..."
                        />
                        <TagInput
                            label="Soft Skills"
                            tags={data.skills.soft}
                            onAdd={(tag) => handleAddSkill('soft', tag)}
                            onRemove={(tag) => handleRemoveSkill('soft', tag)}
                            placeholder="Type & Enter (e.g. Leadership)..."
                        />
                        <TagInput
                            label="Tools & Technologies"
                            tags={data.skills.tools}
                            onAdd={(tag) => handleAddSkill('tools', tag)}
                            onRemove={(tag) => handleRemoveSkill('tools', tag)}
                            placeholder="Type & Enter (e.g. Docker)..."
                        />
                    </section>

                    {/* Projects Section */}
                    <section className="form-section">
                        <div className="form-header">
                            Projects
                            <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, projects: [...prev.projects, { id: Date.now(), title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' }] }))}>+ Add</button>
                        </div>
                        {data.projects.map((proj, index) => (
                            <div key={proj.id} className="project-card mb-4 border rounded p-4">
                                <div className="mb-2">
                                    <input className="input w-full font-bold" placeholder="Project Title" value={proj.title} onChange={e => {
                                        const newP = [...data.projects]; newP[index].title = e.target.value; setData({ ...data, projects: newP });
                                    }} />
                                </div>
                                <div className="mb-2">
                                    <textarea
                                        className="textarea w-full text-sm"
                                        rows={3}
                                        maxLength={200}
                                        placeholder="Description (max 200 chars)..."
                                        value={proj.description}
                                        onChange={e => {
                                            const newP = [...data.projects]; newP[index].description = e.target.value; setData({ ...data, projects: newP });
                                        }}
                                    />
                                    <div className="text-right text-xs text-gray-400">{proj.description.length}/200</div>
                                    <SuggestionBox text={proj.description} />
                                </div>
                                <div className="mb-2">
                                    <TagInput
                                        label="Tech Stack"
                                        tags={proj.techStack}
                                        onAdd={(tag) => {
                                            const newP = [...data.projects]; newP[index].techStack = [...newP[index].techStack, tag]; setData({ ...data, projects: newP });
                                        }}
                                        onRemove={(tag) => {
                                            const newP = [...data.projects]; newP[index].techStack = newP[index].techStack.filter(t => t !== tag); setData({ ...data, projects: newP });
                                        }}
                                        placeholder="Add Tech (e.g. React)..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input className="input text-xs" placeholder="Live URL" value={proj.liveUrl} onChange={e => {
                                        const newP = [...data.projects]; newP[index].liveUrl = e.target.value; setData({ ...data, projects: newP });
                                    }} />
                                    <input className="input text-xs" placeholder="GitHub URL" value={proj.githubUrl} onChange={e => {
                                        const newP = [...data.projects]; newP[index].githubUrl = e.target.value; setData({ ...data, projects: newP });
                                    }} />
                                </div>
                                <button className="text-red-500 text-xs hover:underline" onClick={() => setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== proj.id) }))}>Delete Project</button>
                            </div>
                        ))}
                    </section>

                    {/* Experience Section */}
                    <section className="form-section">
                        <div className="form-header">
                            Experience
                            <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }] }))}>+ Add</button>
                        </div>
                        {data.experience.map((exp, index) => (
                            <div key={exp.id} className="mb-4 border-b pb-4 last:border-0">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input className="input" placeholder="Company" value={exp.company} onChange={e => { const newE = [...data.experience]; newE[index].company = e.target.value; setData({ ...data, experience: newE }); }} />
                                    <input className="input" placeholder="Duration" value={exp.duration} onChange={e => { const newE = [...data.experience]; newE[index].duration = e.target.value; setData({ ...data, experience: newE }); }} />
                                </div>
                                <input className="input w-full mb-2" placeholder="Role" value={exp.role} onChange={e => { const newE = [...data.experience]; newE[index].role = e.target.value; setData({ ...data, experience: newE }); }} />
                                <textarea className="textarea w-full" placeholder="Description..." value={exp.description} onChange={e => { const newE = [...data.experience]; newE[index].description = e.target.value; setData({ ...data, experience: newE }); }} />
                                <SuggestionBox text={exp.description} />
                            </div>
                        ))}
                    </section>

                    {/* Education Section */}
                    <section className="form-section">
                        <div className="form-header">
                            Education
                            <button className="btn btn-sm btn-secondary" onClick={() => setData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), school: '', degree: '', year: '' }] }))}>+ Add</button>
                        </div>
                        {data.education.map((edu, index) => (
                            <div key={edu.id} className="mb-2 border-b pb-2 last:border-0">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input className="input" placeholder="School" value={edu.school} onChange={e => { const newE = [...data.education]; newE[index].school = e.target.value; setData({ ...data, education: newE }); }} />
                                    <input className="input" placeholder="Year" value={edu.year} onChange={e => { const newE = [...data.education]; newE[index].year = e.target.value; setData({ ...data, education: newE }); }} />
                                </div>
                                <input className="input w-full" placeholder="Degree" value={edu.degree} onChange={e => { const newE = [...data.education]; newE[index].degree = e.target.value; setData({ ...data, education: newE }); }} />
                            </div>
                        ))}
                    </section>

                    {/* Links Section */}
                    <section className="form-section">
                        <div className="form-header">Links</div>
                        <div className="form-row">
                            <div className="form-group"><label>GitHub</label><input className="input" value={data.links.github} onChange={e => setData({ ...data, links: { ...data.links, github: e.target.value } })} /></div>
                            <div className="form-group"><label>LinkedIn</label><input className="input" value={data.links.linkedin} onChange={e => setData({ ...data, links: { ...data.links, linkedin: e.target.value } })} /></div>
                        </div>
                    </section>

                </div>

                {/* Right: Live Preview */}
                <div className="builder-preview-panel">
                    <div className={`resume-preview-sheet resume-${data.activeTemplate}`}>

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

                        {/* Skills Display */}
                        {(data.skills.technical?.length > 0 || data.skills.soft?.length > 0 || data.skills.tools?.length > 0) && (
                            <div className="resume-section">
                                <h2>Skills</h2>
                                <div className="skills-container" style={{ fontSize: '10pt', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    {data.skills.technical?.length > 0 && (
                                        <div><strong>Technical:</strong> {data.skills.technical.join(', ')}</div>
                                    )}
                                    {data.skills.tools?.length > 0 && (
                                        <div><strong>Tools:</strong> {data.skills.tools.join(', ')}</div>
                                    )}
                                    {data.skills.soft?.length > 0 && (
                                        <div><strong>Soft Skills:</strong> {data.skills.soft.join(', ')}</div>
                                    )}
                                </div>
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
                                        <div className="item-desc">• {exp.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.projects.length > 0 && (
                            <div className="resume-section">
                                <h2>Projects</h2>
                                {data.projects.map(proj => (
                                    <div key={proj.id} className="item-row" style={{ marginBottom: '12px' }}>
                                        <div className="item-header">
                                            <span className="item-title">{proj.title}</span>
                                            {/* Links if available */}
                                            <span className="item-date" style={{ fontWeight: 'normal', fontSize: '9pt' }}>
                                                {[
                                                    proj.liveUrl ? `Live: ${proj.liveUrl}` : null,
                                                    proj.githubUrl ? `GitHub: ${proj.githubUrl}` : null
                                                ].filter(Boolean).join(' | ')}
                                            </span>
                                        </div>
                                        {/* Tech Stack Pills */}
                                        {proj.techStack?.length > 0 && (
                                            <div style={{ fontSize: '9pt', fontStyle: 'italic', marginBottom: '2px', color: '#555' }}>
                                                Stack: {proj.techStack.join(' • ')}
                                            </div>
                                        )}
                                        <div className="item-desc">• {proj.description}</div>
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
                    </div>
                </div>
            </main>
        </div>
    );
}
