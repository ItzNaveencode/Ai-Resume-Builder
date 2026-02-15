import AppNavbar from '../../components/app/AppNavbar';

export default function AppProofPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <AppNavbar />
            <main style={{ flex: 1, padding: 'var(--space-5)', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>Product Proof</h1>
                <p className="section-subtitle" style={{ marginBottom: 'var(--space-5)' }}>
                    This page serves as a placeholder for future artifact uploads and final product verification.
                </p>

                <div style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-8)',
                    textAlign: 'center',
                    background: 'var(--color-surface)'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📦</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>Artifact Upload Zone</h3>
                    <p style={{ color: 'var(--color-ink-subtle)' }}>Future functionality for shipping artifacts.</p>
                </div>
            </main>
        </div>
    );
}
