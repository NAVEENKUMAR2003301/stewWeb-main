import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────────────
   BLACK & GOLD — TopProgressBar
   Original logic: fully preserved (same timers, same state flow).
   Added: gold gradient bar, animated glow tip, shimmer sweep,
          fade-in/out on visibility, leading spark dot,
          no extra deps beyond what already existed.
   ───────────────────────────────────────────────────────────────── */

/* Inject styles once */
const CSS = `
  .tpb-track {
    position: fixed;
    top: 0; left: 0;
    width: 100%;
    height: 3px;
    z-index: 9999;
    pointer-events: none;
    overflow: visible;
  }

  /* Bar fill */
  .tpb-bar {
    height: 100%;
    background: linear-gradient(
      90deg,
      #9A7D0A  0%,
      #D4AF37 45%,
      #F5D76E 75%,
      #D4AF37 100%
    );
    background-size: 200% 100%;
    border-radius: 0 2px 2px 0;
    position: relative;
    transition: width 300ms ease-out, opacity 300ms ease;
    box-shadow:
      0 0 6px  rgba(212,175,55,.7),
      0 0 14px rgba(212,175,55,.35);
  }

  /* Shimmer sweep */
  .tpb-bar::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255,255,255,.35) 50%,
      transparent 100%
    );
    background-size: 60% 100%;
    animation: tpb-shimmer 1.2s linear infinite;
  }
  @keyframes tpb-shimmer {
    0%   { background-position: -60% center; }
    100% { background-position: 160% center; }
  }

  /* Leading glow dot */
  .tpb-tip {
    position: absolute;
    top: 50%; right: -1px;
    transform: translateY(-50%);
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #F5D76E;
    box-shadow:
      0 0 6px  2px rgba(245,215,110,.9),
      0 0 16px 4px rgba(212,175,55,.55);
    animation: tpb-pulse 0.9s ease-in-out infinite;
  }
  @keyframes tpb-pulse {
    0%,100% { transform: translateY(-50%) scale(1);    opacity: 1;   }
    50%      { transform: translateY(-50%) scale(1.55); opacity: .75; }
  }

  /* Track fade */
  .tpb-track.tpb-enter { animation: tpb-fadein  .15s ease both; }
  .tpb-track.tpb-exit  { animation: tpb-fadeout .35s ease both; }
  @keyframes tpb-fadein  { from { opacity:0; } to { opacity:1; } }
  @keyframes tpb-fadeout { from { opacity:1; } to { opacity:0; } }
`;

if (typeof document !== 'undefined' && !document.getElementById('tpb-styles')) {
    const s = document.createElement('style');
    s.id = 'tpb-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
}

/* ── Component ── */
const TopProgressBar = () => {
    const location = useLocation();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);

    /* ── Original logic: start on route change ── */
    useEffect(() => {
        setExiting(false);
        setVisible(true);
        setProgress(30);
        const t1 = setTimeout(() => setProgress(70), 200);
        const t2 = setTimeout(() => setProgress(90), 500);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [location.pathname]);

    /* ── Original logic: finish & hide ── */
    useEffect(() => {
        if (progress === 90) {
            const t = setTimeout(() => {
                setProgress(100);
                setTimeout(() => {
                    setExiting(true);           // trigger fade-out class
                    setTimeout(() => {
                        setVisible(false);
                        setProgress(0);
                        setExiting(false);
                    }, 350);
                }, 300);
            }, 100);
            return () => clearTimeout(t);
        }
    }, [progress]);

    if (!visible) return null;

    return (
        <div
            className={`tpb-track${exiting ? ' tpb-exit' : ' tpb-enter'}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            aria-label="Page loading"
        >
            <div
                className="tpb-bar"
                style={{ width: `${progress}%` }}
            >
                {/* Leading spark — only show while not yet complete */}
                {progress < 100 && (
                    <span className="tpb-tip" aria-hidden="true" />
                )}
            </div>
        </div>
    );
};

export default TopProgressBar;