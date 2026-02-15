import AppNavbar from '../../components/app/AppNavbar';

export default function PreviewPage() {
    const resumeData = {
        name: 'ALEX THOMPSON',
        contact: 'alex@example.com | (555) 123-4567 | San Francisco, CA',
        summary: 'Senior Software Engineer with 6+ years of experience building scalable web applications. Proven track record of leading teams, optimizing performance, and delivering high-impact features.',
        experience: [
            {
                role: 'Senior Software Engineer',
                company: 'TechFlow Inc.',
                location: 'San Francisco, CA',
                dates: '2021 — Present',
                bullets: [
                    'Led the migration of a legacy monolith to a microservices architecture, reducing deployment times by 40%.',
                    'Mentored 3 junior developers and established code review best practices.',
                    'Designed and implemented a real-time analytics dashboard used by 50+ enterprise clients.'
                ]
            },
            {
                role: 'Software Engineer',
                company: 'Creative Solutions',
                location: 'Austin, TX',
                dates: '2018 — 2021',
                bullets: [
                    'Developed responsive frontend components using React and TypeScript.',
                    'Optimized database queries in PostgreSQL, improving API response times by 25%.',
                    'Collaborated with designers to implement pixel-perfect UI/UX.'
                ]
            }
        ],
        education: [
            {
                degree: 'B.S. Computer Science',
                school: 'University of Texas at Austin',
                year: '2018'
            }
        ],
        skills: 'JavaScript, TypeScript, React, Node.js, PostgreSQL, AWS, Docker, Git'
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#e0e0e0' }}>
            <AppNavbar />
            <main style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    width: '210mm',
                    minHeight: '297mm',
                    background: 'white',
                    padding: '25mm',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    fontFamily: "'Times New Roman', serif",
                    color: 'black',
                    lineHeight: '1.4'
                }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid black', paddingBottom: '16px' }}>
                        <h1 style={{ fontSize: '28pt', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '8px' }}>{resumeData.name}</h1>
                        <div style={{ fontSize: '11pt' }}>{resumeData.contact}</div>
                    </div>

                    {/* Summary */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '12pt', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Professional Summary</h2>
                        <p style={{ fontSize: '11pt' }}>{resumeData.summary}</p>
                    </div>

                    {/* Experience */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '12pt', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Experience</h2>
                        {resumeData.experience.map((job, i) => (
                            <div key={i} style={{ marginBottom: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{job.company}</div>
                                    <div style={{ fontSize: '11pt' }}>{job.dates}</div>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '6px', fontSize: '11pt' }}>{job.role}</div>
                                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                    {job.bullets.map((bullet, j) => (
                                        <li key={j} style={{ marginBottom: '4px', fontSize: '11pt' }}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Education */}
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '12pt', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Education</h2>
                        {resumeData.education.map((edu, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '11pt' }}>{edu.school}</div>
                                    <div style={{ fontSize: '11pt' }}>{edu.degree}</div>
                                </div>
                                <div style={{ fontSize: '11pt' }}>{edu.year}</div>
                            </div>
                        ))}
                    </div>

                    {/* Skills */}
                    <div>
                        <h2 style={{ fontSize: '12pt', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Skills</h2>
                        <p style={{ fontSize: '11pt' }}>{resumeData.skills}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
