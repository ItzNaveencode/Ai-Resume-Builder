import { getCompletedCount } from '../data/steps';
import './ProofFooter.css';

export default function ProofFooter() {
    const completed = getCompletedCount();
    const total = 8;
    const pct = Math.round((completed / total) * 100);

    return (
        <footer className="proof-footer" id="proof-footer">
            <div className="proof-footer__progress">
                <div className="proof-footer__bar-track">
                    <div
                        className="proof-footer__bar-fill"
                        style={{ width: `${pct}%` }}
                    />
                </div>
                <span className="proof-footer__label">
                    {completed}/{total} Steps Complete — {pct}%
                </span>
            </div>
            <span className="proof-footer__brand">AI Resume Builder — Build Track</span>
        </footer>
    );
}
