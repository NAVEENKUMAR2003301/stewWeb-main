// src/components/common/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';

/* ─────────────────────────────────────────────
   BLACK & GOLD ADMIN ROUTE — Luxury Auth Guard
   ───────────────────────────────────────────── */

/* Inject global styles once */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500&display=swap');

  :root {
    --gold-primary:   #D4AF37;
    --gold-light:     #F5D76E;
    --gold-dark:      #9A7D0A;
    --gold-glow:      rgba(212, 175, 55, 0.35);
    --black-deep:     #050505;
    --black-card:     #0D0D0D;
    --black-surface:  #141414;
    --black-border:   #1E1E1E;
    --text-primary:   #F0E6C8;
    --text-muted:     rgba(240, 230, 200, 0.45);
  }

  /* ── Loader Wrapper ── */
  .ar-loader-root {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--black-deep);
    font-family: 'Raleway', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* animated subtle background grid */
  .ar-loader-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,.04) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: ar-grid-drift 20s linear infinite;
    pointer-events: none;
  }

  @keyframes ar-grid-drift {
    0%   { transform: translate(0, 0); }
    100% { transform: translate(48px, 48px); }
  }

  /* ── Loader Card ── */
  .ar-loader-card {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 3.5rem;
    background: var(--black-card);
    border: 1px solid var(--black-border);
    border-radius: 4px;
    box-shadow:
      0 0 0 1px rgba(212,175,55,.08),
      0 32px 80px rgba(0,0,0,.8),
      inset 0 1px 0 rgba(212,175,55,.12);
    animation: ar-card-in 0.6s cubic-bezier(.16,1,.3,1) both;
    z-index: 1;
  }

  @keyframes ar-card-in {
    from { opacity: 0; transform: translateY(20px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);   }
  }

  /* decorative corner accents */
  .ar-loader-card::before,
  .ar-loader-card::after {
    content: '';
    position: absolute;
    width: 18px; height: 18px;
    border-color: var(--gold-primary);
    border-style: solid;
    pointer-events: none;
  }
  .ar-loader-card::before {
    top: -1px; left: -1px;
    border-width: 2px 0 0 2px;
    border-radius: 4px 0 0 0;
  }
  .ar-loader-card::after {
    bottom: -1px; right: -1px;
    border-width: 0 2px 2px 0;
    border-radius: 0 0 4px 0;
  }

  /* ── Spinner ── */
  .ar-spinner-wrap {
    position: relative;
    width: 72px; height: 72px;
  }

  .ar-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 2px solid transparent;
  }
  .ar-ring-outer {
    border-top-color: var(--gold-primary);
    border-right-color: rgba(212,175,55,.25);
    animation: ar-spin 1.1s linear infinite;
    box-shadow: 0 0 16px var(--gold-glow);
  }
  .ar-ring-inner {
    inset: 14px;
    border-bottom-color: var(--gold-light);
    border-left-color: rgba(245,215,110,.2);
    animation: ar-spin 0.7s linear infinite reverse;
  }
  .ar-ring-dot {
    inset: 29px;
    background: var(--gold-primary);
    border: none;
    border-radius: 50%;
    animation: ar-pulse 1.4s ease-in-out infinite;
    box-shadow: 0 0 10px var(--gold-glow);
  }

  @keyframes ar-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ar-pulse {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%      { transform: scale(1.5); opacity: .5; }
  }

  /* ── Loader Text ── */
  .ar-loader-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(.95rem, 2vw, 1.1rem);
    font-weight: 600;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--gold-primary);
    margin: 0;
    text-shadow: 0 0 20px var(--gold-glow);
  }

  .ar-loader-sub {
    font-size: .78rem;
    letter-spacing: .12em;
    color: var(--text-muted);
    margin: 0;
    animation: ar-blink 2s ease-in-out infinite;
  }

  @keyframes ar-blink {
    0%,100% { opacity: .45; }
    50%      { opacity: .9;  }
  }

  /* ── Progress Bar ── */
  .ar-progress {
    width: 160px;
    height: 2px;
    background: var(--black-border);
    border-radius: 99px;
    overflow: hidden;
  }
  .ar-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-primary));
    border-radius: 99px;
    animation: ar-progress-anim 1.8s ease-in-out infinite;
    box-shadow: 0 0 8px var(--gold-glow);
  }

  @keyframes ar-progress-anim {
    0%   { width: 0%;    margin-left: 0%;    }
    50%  { width: 70%;   margin-left: 15%;   }
    100% { width: 0%;    margin-left: 100%;  }
  }

  /* ── Floating Particles ── */
  .ar-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .ar-particle {
    position: absolute;
    width: 2px; height: 2px;
    border-radius: 50%;
    background: var(--gold-primary);
    opacity: 0;
    animation: ar-float var(--dur, 4s) var(--delay, 0s) ease-in-out infinite;
  }

  @keyframes ar-float {
    0%   { opacity: 0; transform: translateY(100%) scale(0); }
    20%  { opacity: .6; }
    80%  { opacity: .3; }
    100% { opacity: 0; transform: translateY(-20px) scale(1.5); }
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .ar-loader-card { padding: 2rem 2rem; gap: 1.5rem; }
    .ar-spinner-wrap { width: 56px; height: 56px; }
    .ar-ring-inner   { inset: 11px; }
    .ar-ring-dot     { inset: 22px; }
  }
`;

/* Inject once */
if (typeof document !== 'undefined' && !document.getElementById('ar-styles')) {
    const tag = document.createElement('style');
    tag.id = 'ar-styles';
    tag.textContent = STYLES;
    document.head.appendChild(tag);
}

/* Particle data */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    dur: `${3 + Math.random() * 4}s`,
    delay: `${Math.random() * 3}s`,
}));

/* ── Loading Screen ── */
const AdminLoadingScreen = () => (
    <div
        className="ar-loader-root"
        role="status"
        aria-live="polite"
        aria-label="Verifying admin credentials, please wait"
    >
        {/* Floating particles */}
        <div className="ar-particles" aria-hidden="true">
            {PARTICLES.map(p => (
                <span
                    key={p.id}
                    className="ar-particle"
                    style={{ left: p.left, top: p.top, '--dur': p.dur, '--delay': p.delay }}
                />
            ))}
        </div>

        {/* Card */}
        <div className="ar-loader-card">
            {/* Spinner */}
            <div className="ar-spinner-wrap" aria-hidden="true">
                <span className="ar-ring ar-ring-outer" />
                <span className="ar-ring ar-ring-inner" />
                <span className="ar-ring ar-ring-dot" />
            </div>

            {/* Text */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <h1 className="ar-loader-title">Verifying Access</h1>
                <p className="ar-loader-sub">Authenticating admin credentials…</p>
            </div>

            {/* Progress */}
            <div className="ar-progress" aria-hidden="true">
                <div className="ar-progress-fill" />
            </div>

            {/* SR-only live text */}
            <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
                Loading admin panel. Please wait while we verify your credentials.
            </span>
        </div>
    </div>
);

/* ── AdminRoute (original logic preserved) ── */
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <AdminLoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
};

export default AdminRoute;