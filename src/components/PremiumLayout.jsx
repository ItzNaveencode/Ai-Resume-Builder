import TopBar from './TopBar';
import ContextHeader from './ContextHeader';
import ProofFooter from './ProofFooter';
import './PremiumLayout.css';

export default function PremiumLayout({ children, sidePanel }) {
    return (
        <div className="premium-layout" id="premium-layout">
            <TopBar />
            <ContextHeader />
            <div className="premium-layout__body">
                <main className="premium-layout__workspace" id="main-workspace">
                    {children}
                </main>
                {sidePanel && (
                    <div className="premium-layout__panel" id="side-panel">
                        {sidePanel}
                    </div>
                )}
            </div>
            <ProofFooter />
        </div>
    );
}
