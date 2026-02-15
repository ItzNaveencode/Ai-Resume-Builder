import React from 'react';
import './ResumeTemplates.css';

const SectionItem = ({ title, subtitle, date, description, techStack, links }) => (
    <div className="item-row mb-3">
        <div className="item-header flex justify-between items-baseline mb-1">
            <span className="item-title font-bold text-gray-800">{title}</span>
            <span className="item-date text-sm text-gray-500">{date}</span>
        </div>
        {subtitle && <div className="item-subtitle text-sm font-semibold text-gray-600 mb-1">{subtitle}</div>}
        {links && <div className="item-links text-xs text-blue-600 mb-1">{links}</div>}
        {techStack && (
            <div className="item-stack text-xs text-gray-500 italic mb-1">
                Stack: {techStack}
            </div>
        )}
        {description && <div className="item-desc text-sm text-gray-700 leading-snug whitespace-pre-wrap">• {description}</div>}
    </div>
);

const SkillsSection = ({ skills }) => {
    if (!skills) return null;
    const hasSkills = skills.technical?.length > 0 || skills.tools?.length > 0 || skills.soft?.length > 0;
    if (!hasSkills) return null;

    return (
        <div className="resume-section mb-4">
            <h3 className="section-title text-sm font-bold uppercase tracking-wider mb-2 border-b-2 border-gray-200 pb-1" style={{ borderColor: 'var(--color-accent)' }}>Skills</h3>
            <div className="skills-content text-sm space-y-1">
                {skills.technical?.length > 0 && <div><span className="font-semibold text-gray-700">Technical:</span> {skills.technical.join(', ')}</div>}
                {skills.tools?.length > 0 && <div><span className="font-semibold text-gray-700">Tools:</span> {skills.tools.join(', ')}</div>}
                {skills.soft?.length > 0 && <div><span className="font-semibold text-gray-700">Soft Skills:</span> {skills.soft.join(', ')}</div>}
            </div>
        </div>
    );
};

export const ClassicTemplate = ({ data, accentColor }) => (
    <div className="resume-classic p-8 bg-white text-gray-900" style={{ '--color-accent': accentColor }}>
        {/* Header */}
        <header className="text-center mb-6 border-b-2 border-gray-800 pb-4">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{data.personal.name || 'YOUR NAME'}</h1>
            <div className="text-sm text-gray-600 flex justify-center gap-2 flex-wrap">
                <span>{data.personal.email}</span>
                {data.personal.phone && <span>| {data.personal.phone}</span>}
                {data.personal.location && <span>| {data.personal.location}</span>}
            </div>
            <div className="text-sm text-blue-600 flex justify-center gap-2 mt-1">
                {data.links.github && <a href={`https://${data.links.github}`} target="_blank" rel="noreferrer">GitHub</a>}
                {data.links.linkedin && <a href={`https://${data.links.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>}
            </div>
        </header>

        {/* Main Content */}
        {data.summary && (
            <section className="resume-section mb-5">
                <h3 className="section-title font-serif font-bold text-lg uppercase border-b border-gray-300 mb-2 pb-1">Professional Summary</h3>
                <p className="text-sm leading-relaxed text-gray-800">{data.summary}</p>
            </section>
        )}

        {data.experience.length > 0 && (
            <section className="resume-section mb-5">
                <h3 className="section-title font-serif font-bold text-lg uppercase border-b border-gray-300 mb-3 pb-1">Experience</h3>
                {data.experience.map(exp => (
                    <SectionItem
                        key={exp.id}
                        title={exp.company}
                        date={exp.duration}
                        subtitle={exp.role}
                        description={exp.description}
                    />
                ))}
            </section>
        )}

        {data.projects.length > 0 && (
            <section className="resume-section mb-5">
                <h3 className="section-title font-serif font-bold text-lg uppercase border-b border-gray-300 mb-3 pb-1">Projects</h3>
                {data.projects.map(proj => (
                    <SectionItem
                        key={proj.id}
                        title={proj.title}
                        description={proj.description}
                        techStack={proj.techStack?.join(' • ')}
                        links={[proj.liveUrl, proj.githubUrl].filter(Boolean).join(' | ')}
                    />
                ))}
            </section>
        )}

        {data.education.length > 0 && (
            <section className="resume-section mb-5">
                <h3 className="section-title font-serif font-bold text-lg uppercase border-b border-gray-300 mb-3 pb-1">Education</h3>
                {data.education.map(edu => (
                    <SectionItem key={edu.id} title={edu.school} date={edu.year} subtitle={edu.degree} />
                ))}
            </section>
        )}

        <SkillsSection skills={data.skills} />
    </div>
);

export const ModernTemplate = ({ data, accentColor }) => (
    <div className="resume-modern grid grid-cols-[3fr_7fr] min-h-[297mm] bg-white text-gray-800 font-sans" style={{ '--color-accent': accentColor }}>
        {/* Sidebar */}
        <aside className="bg-gray-100 p-6 text-sm border-r border-gray-200">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">{data.personal.name || 'YOUR NAME'}</h1>
                <div className="space-y-2 text-gray-600">
                    <div className="flex items-center gap-2">📧 {data.personal.email}</div>
                    {data.personal.phone && <div className="flex items-center gap-2">📱 {data.personal.phone}</div>}
                    {data.personal.location && <div className="flex items-center gap-2">📍 {data.personal.location}</div>}
                </div>
                <div className="mt-4 space-y-1 text-blue-600">
                    {data.links.github && <div>🔗 {data.links.github}</div>}
                    {data.links.linkedin && <div>🔗 {data.links.linkedin}</div>}
                </div>
            </div>

            <SkillsSection skills={data.skills} />

            {data.education.length > 0 && (
                <section className="resume-section mt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 border-b border-gray-300 pb-1">Education</h3>
                    {data.education.map(edu => (
                        <div key={edu.id} className="mb-3">
                            <div className="font-bold text-gray-800">{edu.school}</div>
                            <div className="text-gray-600">{edu.degree}</div>
                            <div className="text-xs text-gray-500">{edu.year}</div>
                        </div>
                    ))}
                </section>
            )}
        </aside>

        {/* Main Content */}
        <main className="p-8">
            {data.summary && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-2" style={{ color: 'var(--color-accent)' }}>Profile</h3>
                    <p className="text-gray-700 leading-relaxed">{data.summary}</p>
                </section>
            )}

            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4 flex items-center gap-2" style={{ color: 'var(--color-accent)' }}>
                        Experience
                    </h3>
                    <div className="space-y-4">
                        {data.experience.map(exp => (
                            <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900">{exp.role}</h4>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{exp.duration}</span>
                                </div>
                                <div className="text-sm text-gray-600 font-medium mb-1">{exp.company}</div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-4" style={{ color: 'var(--color-accent)' }}>Projects</h3>
                    <div className="grid gap-4">
                        {data.projects.map(proj => (
                            <div key={proj.id} className="bg-gray-50 p-3 rounded border border-gray-100">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900 text-sm">{proj.title}</h4>
                                    <div className="flex gap-2 text-xs text-blue-600">
                                        {[proj.liveUrl, proj.githubUrl].map((l, i) => l && <span key={i}>🔗 Link</span>)}
                                    </div>
                                </div>
                                {proj.techStack?.length > 0 && <div className="text-xs text-gray-500 italic mb-2">{proj.techStack.join(' • ')}</div>}
                                <p className="text-xs text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
    </div>
);

export const MinimalTemplate = ({ data, accentColor }) => (
    <div className="resume-minimal p-10 bg-white text-gray-800 font-sans max-w-[210mm] mx-auto" style={{ '--color-accent': accentColor }}>
        <header className="mb-8">
            <h1 className="text-3xl font-light tracking-wide text-gray-900 mb-1">{data.personal.name || 'YOUR NAME'}</h1>
            <div className="text-sm text-gray-500 font-light flex gap-4 uppercase tracking-wider">
                {[data.personal.email, data.personal.phone, data.personal.location].filter(Boolean).join(' • ')}
            </div>
            <div className="text-sm text-gray-400 mt-2 flex gap-4">
                {[data.links.github, data.links.linkedin].filter(Boolean).map((l, i) => <span key={i} className="hover:text-gray-600 cursor-pointer">{l}</span>)}
            </div>
        </header>

        {data.summary && (
            <div className="mb-8">
                <p className="text-lg font-light leading-relaxed text-gray-600">{data.summary}</p>
            </div>
        )}

        <div className="grid grid-cols-1 gap-8">
            {data.experience.length > 0 && (
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Experience</h3>
                    {data.experience.map(exp => (
                        <div key={exp.id} className="mb-6 last:mb-0">
                            <div className="flex justify-between mb-1">
                                <span className="font-medium text-gray-900">{exp.company}</span>
                                <span className="text-sm text-gray-400 font-light">{exp.duration}</span>
                            </div>
                            <div className="text-sm text-gray-500 italic mb-2">{exp.role}</div>
                            <p className="text-sm text-gray-600 font-light leading-relaxed">{exp.description}</p>
                        </div>
                    ))}
                </section>
            )}

            {data.projects.length > 0 && (
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Selected Work</h3>
                    {data.projects.map(proj => (
                        <div key={proj.id} className="mb-5">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="font-medium text-gray-900">{proj.title}</span>
                                {proj.techStack?.length > 0 && <span className="text-xs text-gray-400 font-mono">{proj.techStack.slice(0, 3).join('/')}</span>}
                            </div>
                            <p className="text-sm text-gray-600 font-light">{proj.description}</p>
                        </div>
                    ))}
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {data.education.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Education</h3>
                        {data.education.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <div className="text-sm font-medium text-gray-900">{edu.school}</div>
                                <div className="text-xs text-gray-500">{edu.degree}, {edu.year}</div>
                            </div>
                        ))}
                    </section>
                )}

                <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Skills</h3>
                    <div className="text-sm text-gray-600 font-light leading-relaxed">
                        {[
                            ...(data.skills.technical || []),
                            ...(data.skills.tools || []),
                            ...(data.skills.soft || [])
                        ].join(' • ')}
                    </div>
                </section>
            </div>
        </div>
    </div>
);

export const Renderer = ({ template, data, accentColor }) => {
    switch (template) {
        case 'modern': return <ModernTemplate data={data} accentColor={accentColor} />;
        case 'minimal': return <MinimalTemplate data={data} accentColor={accentColor} />;
        default: return <ClassicTemplate data={data} accentColor={accentColor} />;
    }
};
