import { useState, useEffect } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import './BuilderPage.css';

export default function BuilderPage() {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('resumeBuilderData');
        return saved ? JSON.parse(saved) : {
            personal: { name: '', email: '', phone: '', location: '' },
            summary: '',
            education: [],
            experience: [],
            projects: [],
            skills: '',
            links: { github: '', linkedin: '' }
        };
    });

    const [atsScore, setAtsScore] = useState({ score: 0, suggestions: [] });

    // Save to localStorage and update score whenever data changes
    useEffect(() => {
        localStorage.setItem('resumeBuilderData', JSON.stringify(data));
        setAtsScore(calculateScore(data));
    }, [data]);

    const calculateScore = (data) => {
        let score = 0;
        const suggestions = [];

        // Base Score for Structure
        score += 20;

        // Summary length 40-120 words (+15)
        const summaryWords = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (summaryWords >= 40 && summaryWords <= 120) {
            score += 15;
        } else {
            suggestions.push(`Write a stronger summary (currently ${summaryWords} words, target 40–120).`);
        }

        // At least 2 projects (+10)
        if (data.projects.length >= 2) {
            score += 10;
        } else {
            suggestions.push("Add at least 2 projects.");
        }

        // At least 1 experience (+10)
        if (data.experience.length >= 1) {
            score += 10;
        } else {
            suggestions.push("Add at least 1 work experience.");
        }

        // Skills >= 8 items (+10)
        const skillList = data.skills.split(',').filter(s => s.trim().length > 0);
        if (skillList.length >= 8) {
            score += 10;
        } else {
            suggestions.push("Add more skills (target 8+).");
        }

        // GitHub or LinkedIn (+10)
        if ((data.links.github && data.links.github.length > 0) || (data.links.linkedin && data.links.linkedin.length > 0)) {
            score += 10;
        } else {
            suggestions.push("Add GitHub or LinkedIn link.");
        }

        // Measurable impact (numbers) (+15)
        const allDescriptions = [
            ...data.experience.map(e => e.description || ''),
            ...data.projects.map(p => p.description || '')
        ];
        const hasNumbers = allDescriptions.some(desc => /\d+|%|\bk\b|\bX\b/i.test(desc));

        if (hasNumbers) {
            score += 15;
        } else {
            suggestions.push("Add measurable impact (numbers) in descriptions.");
        }

        // Education complete (+10)
        const eduComplete = data.education.length > 0 && data.education.every(e => e.school && e.degree && e.year);
        if (eduComplete) {
            score += 10;
        } else if (data.education.length === 0) {
            suggestions.push("Add education details.");
        } else {
            suggestions.push("Complete all education fields.");
        }

        return { score: Math.min(100, score), suggestions: suggestions.slice(0, 3) };
    };

    const loadSampleData = () => {
        setData({
            personal: { name: 'Alex Thompson', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' },
            summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Proven track record of leading teams, optimizing performance, and delivering high-impact features. Passionate about AI integration and user-centric design. Experienced in Agile environments and mentoring junior developers.',
            education: [{ id: 1, school: 'University of Technology', degree: 'BS Computer Science', year: '2020-2024' }],
            experience: [{ id: 1, company: 'Tech Corp', role: 'Software Engineer', duration: '2024-Present', description: 'Built core features for the main platform, reducing load times by 40% using React optimizations.' }],
            projects: [
                { id: 1, name: 'AI Resume Builder', description: 'Built a premium resume builder with React and OpenAI that serves 500+ users.' },
                { id: 2, name: 'E-commerce Dashboard', description: 'Designed a real-time analytics dashboard processing 10k events/sec.' }
            ],
            skills: 'React, Node.js, Python, TypeScript, AWS, Docker, GraphQL, PostgreSQL',
            links: { github: 'github.com/alex', linkedin: 'linkedin.com/in/alex' }
        });
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
    };

    // Helper to get color based on score
    const getScoreColor = (s) => {
        if (s >= 80) return 'var(--color-success)';
        if (s >= 50) return 'var(--color-warning)';
        return 'var(--color-error)';
    };

    return (
        <div className="builder-page">
            <AppNavbar />
            <main className="builder-layout">
                {/* Left: Form Sections */}
                <div className="builder-forms">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold font-serif">Resume Details</h2>
                        <button onClick={loadSampleData} className="btn btn-sm btn-secondary">
                            Load Sample Data
                        </button>
                    </div>

                    {/* ATS Score Panel */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">ATS Readiness Score</h3>
                            <span className="text-3xl font-serif font-bold" style={{ color: getScoreColor(atsScore.score) }}>
                                {atsScore.score}/100
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                            <div
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ width: `${atsScore.score}%`, backgroundColor: getScoreColor(atsScore.score) }}
                            ></div>
                        </div>
                        {atsScore.suggestions.length > 0 && (
                            <div className="space-y-2">
                                {atsScore.suggestions.map((sugg, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                                        <span>•</span>
                                        <span>{sugg}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {atsScore.score === 100 && (
                            <div className="text-sm text-green-700 bg-green-50 p-2 rounded flex items-center gap-2">
                                <span>✓</span>
                                <span>Excellent! Your resume is ATS-ready.</span>
                            </div>
                        )}
                    </div>

                    {/* Personal Info */}
                    <section className="form-section">
                        <div className="form-header">Personal Info</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" className="input" value={data.personal.name} onChange={handlePersonalChange} placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="input" value={data.personal.email} onChange={handlePersonalChange} placeholder="john@example.com" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" className="input" value={data.personal.phone} onChange={handlePersonalChange} placeholder="(555) 123-4567" />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input type="text" name="location" className="input" value={data.personal.location} onChange={handlePersonalChange} placeholder="City, State" />
                            </div>
                        </div>
                    </section>

                    {/* Summary */}
                    <section className="form-section">
                        <div className="form-header">Summary</div>
                        <textarea
                            className="textarea w-full"
                            value={data.summary}
                            onChange={e => setData(prev => ({ ...prev, summary: e.target.value }))}
                            placeholder="Professional summary (40-120 words)..."
                            rows={4}
                        />
                        <div className="text-xs text-gray-400 mt-1 text-right">
                            {data.summary.trim().split(/\s+/).filter(w => w.length > 0).length} words
                        </div>
                    </section>

                    {/* Education */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Education</span>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    education: [...prev.education, { id: Date.now(), school: '', degree: '', year: '' }]
                                }))}
                            >+ Add</button>
                        </div>
                        {data.education.map((edu, index) => (
                            <div key={edu.id} className="p-2 border-b border-gray-100 last:border-0 mb-2">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        className="input"
                                        placeholder="School"
                                        value={edu.school}
                                        onChange={e => {
                                            const newEdu = [...data.education];
                                            newEdu[index].school = e.target.value;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }}
                                    />
                                    <input
                                        className="input"
                                        placeholder="Year"
                                        value={edu.year}
                                        onChange={e => {
                                            const newEdu = [...data.education];
                                            newEdu[index].year = e.target.value;
                                            setData(prev => ({ ...prev, education: newEdu }));
                                        }}
                                    />
                                </div>
                                <input
                                    className="input w-full"
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={e => {
                                        const newEdu = [...data.education];
                                        newEdu[index].degree = e.target.value;
                                        setData(prev => ({ ...prev, education: newEdu }));
                                    }}
                                />
                            </div>
                        ))}
                        {data.education.length === 0 && <p className="text-sm text-gray-400 italic">No education added yet.</p>}
                    </section>

                    {/* Experience */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Experience</span>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    experience: [...prev.experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }]
                                }))}
                            >+ Add</button>
                        </div>
                        {data.experience.map((exp, index) => (
                            <div key={exp.id} className="p-4 border border-gray-100 rounded mb-4">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    <input
                                        className="input"
                                        placeholder="Company"
                                        value={exp.company}
                                        onChange={e => {
                                            const newExp = [...data.experience];
                                            newExp[index].company = e.target.value;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                    />
                                    <input
                                        className="input"
                                        placeholder="Duration"
                                        value={exp.duration}
                                        onChange={e => {
                                            const newExp = [...data.experience];
                                            newExp[index].duration = e.target.value;
                                            setData(prev => ({ ...prev, experience: newExp }));
                                        }}
                                    />
                                </div>
                                <input
                                    className="input w-full mb-2"
                                    placeholder="Role"
                                    value={exp.role}
                                    onChange={e => {
                                        const newExp = [...data.experience];
                                        newExp[index].role = e.target.value;
                                        setData(prev => ({ ...prev, experience: newExp }));
                                    }}
                                />
                                <textarea
                                    className="textarea w-full"
                                    placeholder="Description (include numbers!)"
                                    value={exp.description}
                                    onChange={e => {
                                        const newExp = [...data.experience];
                                        newExp[index].description = e.target.value;
                                        setData(prev => ({ ...prev, experience: newExp }));
                                    }}
                                />
                            </div>
                        ))}
                    </section>

                    {/* Projects */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Projects</span>
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => setData(prev => ({
                                    ...prev,
                                    projects: [...prev.projects, { id: Date.now(), name: '', description: '' }]
                                }))}
                            >+ Add</button>
                        </div>
                        {data.projects.map((proj, index) => (
                            <div key={proj.id} className="p-4 border border-gray-100 rounded mb-4">
                                <input
                                    className="input w-full mb-2"
                                    placeholder="Project Name"
                                    value={proj.name}
                                    onChange={e => {
                                        const newProj = [...data.projects];
                                        newProj[index].name = e.target.value;
                                        setData(prev => ({ ...prev, projects: newProj }));
                                    }}
                                />
                                <textarea
                                    className="textarea w-full"
                                    placeholder="Description (include impact!)"
                                    value={proj.description}
                                    onChange={e => {
                                        const newProj = [...data.projects];
                                        newProj[index].description = e.target.value;
                                        setData(prev => ({ ...prev, projects: newProj }));
                                    }}
                                />
                            </div>
                        ))}
                    </section>

                    {/* Skills */}
                    <section className="form-section">
                        <div className="form-header">Skills</div>
                        <div className="form-group">
                            <label>Comma-separated list (Target 8+)</label>
                            <input
                                type="text"
                                className="input"
                                value={data.skills}
                                onChange={e => setData(prev => ({ ...prev, skills: e.target.value }))}
                                placeholder="React, Node.js, Python..."
                            />
                        </div>
                    </section>

                    {/* Links */}
                    <section className="form-section">
                        <div className="form-header">Links</div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>GitHub</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={data.links.github}
                                    onChange={e => setData(prev => ({ ...prev, links: { ...prev.links, github: e.target.value } }))}
                                    placeholder="github.com/username"
                                />
                            </div>
                            <div className="form-group">
                                <label>LinkedIn</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={data.links.linkedin}
                                    onChange={e => setData(prev => ({ ...prev, links: { ...prev.links, linkedin: e.target.value } }))}
                                    placeholder="linkedin.com/in/username"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right: Live Preview */}
                <div className="builder-preview-panel">
                    <div className="resume-preview-sheet">
                        {/* Minimal Resume Layout */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <h1 style={{ fontSize: '24pt', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                                {data.personal.name || 'YOUR NAME'}
                            </h1>
                            <div style={{ fontSize: '10pt' }}>
                                {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' | ')}
                            </div>
                            <div style={{ fontSize: '10pt', marginTop: '4px' }}>
                                {[data.links.github, data.links.linkedin].filter(Boolean).join(' | ')}
                            </div>
                        </div>

                        {data.summary && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Summary</h2>
                                <p style={{ fontSize: '10pt', lineHeight: '1.4' }}>{data.summary}</p>
                            </div>
                        )}

                        {data.experience.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Experience</h2>
                                {data.experience.map(exp => (
                                    <div key={exp.id} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                            <span>{exp.company}</span>
                                            <span>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{exp.role}</div>
                                        <div style={{ fontSize: '10pt' }}>• {exp.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.projects.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Projects</h2>
                                {data.projects.map(proj => (
                                    <div key={proj.id} style={{ marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
                                        <div style={{ fontSize: '10pt' }}>• {proj.description}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.education.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Education</h2>
                                {data.education.map(edu => (
                                    <div key={edu.id} style={{ marginBottom: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                            <span>{edu.school}</span>
                                            <span>{edu.year}</span>
                                        </div>
                                        <div>{edu.degree}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.skills && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Skills</h2>
                                <div style={{ fontSize: '10pt' }}>{data.skills}</div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
