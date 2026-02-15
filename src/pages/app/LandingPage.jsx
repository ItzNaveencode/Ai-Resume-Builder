import { Link } from 'react-router-dom';
import AppNavbar from '../../components/app/AppNavbar';
import '../../components/app/AppNavbar.css'; // Ensure proper path if needed, or import in parent

export default function LandingPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)', textAlign: 'center' }}>
                <div style={{ maxWidth: 800 }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '4rem', marginBottom: 'var(--space-3)', lineHeight: 1.1 }}>
                        Build a Resume That Gets Read.
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--color-ink-subtle)', marginBottom: 'var(--space-5)', maxWidth: 600, marginInline: 'auto' }}>
                        Transform your experience into a structured, ATS-friendly resume that recruiters actually read.
                    </p>
                    <Link to="/builder" className="btn btn-primary btn-lg" style={{ fontSize: '1.125rem', padding: '16px 48px' }}>
                        Start Building
                    </Link>
                </div>
            </main>
        </div>
    );
}
