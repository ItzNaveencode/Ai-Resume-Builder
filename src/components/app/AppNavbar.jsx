import { Link, useLocation } from 'react-router-dom';
import './AppNavbar.css';

export default function AppNavbar() {
    const location = useLocation();
    const path = location.pathname;

    return (
        <nav className="app-navbar">
            <div className="app-navbar__brand">
                <Link to="/">AI Resume Builder</Link>
            </div>
            <div className="app-navbar__links">
                <Link to="/builder" className={path === '/builder' ? 'active' : ''}>Builder</Link>
                <Link to="/preview" className={path === '/preview' ? 'active' : ''}>Preview</Link>
                {/* Only show Proof if it's the App's Proof page */}
                <Link to="/proof" className={path === '/proof' ? 'active' : ''}>Proof</Link>
            </div>
        </nav>
    );
}
