import { useState } from 'react';
import AppNavbar from '../../components/app/AppNavbar';
import './BuilderPage.css';

export default function BuilderPage() {
    const [data, setData] = useState({
        personal: { name: '', email: '', phone: '', location: '' },
        summary: '',
        education: [],
        experience: [],
        projects: [],
        skills: '',
        links: { github: '', linkedin: '' }
    });

    const loadSampleData = () => {
        setData({
            personal: { name: 'Alex Thompson', email: 'alex@example.com', phone: '(555) 123-4567', location: 'San Francisco, CA' },
            summary: 'Experienced Full Stack Engineer with a focus on scalable web applications and AI integration.',
            education: [{ id: 1, school: 'University of Technology', degree: 'BS Computer Science', year: '2020-2024' }],
            experience: [{ id: 1, company: 'Tech Corp', role: 'Software Engineer', duration: '2024-Present', description: 'Built core features for the main platform.' }],
            projects: [{ id: 1, name: 'AI Resume Builder', description: 'Built a premium resume builder with React and OpenAI.' }],
            skills: 'React, Node.js, Python, TypeScript, AWS, Docker',
            links: { github: 'github.com/alex', linkedin: 'linkedin.com/in/alex' }
        });
    };

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
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
                            placeholder="Professional summary..."
                            rows={4}
                        />
                    </section>

                    {/* Education */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Education</span>
                            <button className="btn btn-sm btn-secondary">+ Add</button>
                        </div>
                        {data.education.map(edu => (
                            <div key={edu.id} className="p-2 border-b border-gray-100 last:border-0 mb-2">
                                <div className="font-bold">{edu.school}</div>
                                <div className="text-sm text-gray-600">{edu.degree} • {edu.year}</div>
                            </div>
                        ))}
                        {data.education.length === 0 && <p className="text-sm text-gray-400 italic">No education added yet.</p>}
                    </section>

                    {/* Experience */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Experience</span>
                            <button className="btn btn-sm btn-secondary">+ Add</button>
                        </div>
                        {data.experience.map(exp => (
                            <div key={exp.id} className="p-2 border-b border-gray-100 last:border-0 mb-2">
                                <div className="font-bold">{exp.role} at {exp.company}</div>
                                <div className="text-sm text-gray-500 mb-1">{exp.duration}</div>
                                <p className="text-sm">{exp.description}</p>
                            </div>
                        ))}
                        {data.experience.length === 0 && <p className="text-sm text-gray-400 italic">No experience added yet.</p>}
                    </section>

                    {/* Projects */}
                    <section className="form-section">
                        <div className="form-header">
                            <span>Projects</span>
                            <button className="btn btn-sm btn-secondary">+ Add</button>
                        </div>
                        {data.projects.map(proj => (
                            <div key={proj.id} className="p-2 border-b border-gray-100 last:border-0 mb-2">
                                <div className="font-bold">{proj.name}</div>
                                <p className="text-sm">{proj.description}</p>
                            </div>
                        ))}
                        {data.projects.length === 0 && <p className="text-sm text-gray-400 italic">No projects added yet.</p>}
                    </section>

                    {/* Skills */}
                    <section className="form-section">
                        <div className="form-header">Skills</div>
                        <div className="form-group">
                            <label>Comma-separated list</label>
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
                                {data.personal.email} | {data.personal.phone} | {data.personal.location}
                            </div>
                            <div style={{ fontSize: '10pt', marginTop: '4px' }}>
                                {data.links.github} | {data.links.linkedin}
                            </div>
                        </div>

                        {data.summary && (
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Summary</h2>
                                <p style={{ fontSize: '10pt', lineHeight: '1.4' }}>{data.summary}</p>
                            </div>
                        )}

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Experience</h2>
                            {data.experience.length > 0 ? (
                                data.experience.map(exp => (
                                    <div key={exp.id} style={{ marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                            <span>{exp.company}</span>
                                            <span>{exp.duration}</span>
                                        </div>
                                        <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>{exp.role}</div>
                                        <div style={{ fontSize: '10pt' }}>• {exp.description}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#ccc', fontStyle: 'italic' }}>Experience will appear here...</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Projects</h2>
                            {data.projects.length > 0 ? (
                                data.projects.map(proj => (
                                    <div key={proj.id} style={{ marginBottom: '8px' }}>
                                        <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
                                        <div style={{ fontSize: '10pt' }}>• {proj.description}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#ccc', fontStyle: 'italic' }}>Projects will appear here...</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Education</h2>
                            {data.education.length > 0 ? (
                                data.education.map(edu => (
                                    <div key={edu.id} style={{ marginBottom: '4px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                            <span>{edu.school}</span>
                                            <span>{edu.year}</span>
                                        </div>
                                        <div>{edu.degree}</div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ color: '#ccc', fontStyle: 'italic' }}>Education will appear here...</div>
                            )}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '12pt', borderBottom: '1px solid black', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>Skills</h2>
                            <div style={{ fontSize: '10pt' }}>{data.skills || 'Skills will appear here...'}</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
