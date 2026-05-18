import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from 'react-icons/fa';

/* ── Keyframe injection ─────────────────────────────────────────────── */
const injectStyles = () => {
    if (document.getElementById('login-styles')) return;
    const style = document.createElement('style');
    style.id = 'login-styles';
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    @keyframes fadeInUp    { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
    @keyframes shimmer     { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes rotateOrb   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes floatOrb    { 0%,100%{transform:translateY(0px) scale(1)} 50%{transform:translateY(-18px) scale(1.04)} }
    @keyframes pulse       { 0%,100%{opacity:0.55} 50%{opacity:1} }
    @keyframes shake       { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
    @keyframes spinDot     { to{transform:rotate(360deg)} }

    * { box-sizing: border-box; }

    .login-card  { animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
    .login-field { transition: border-color 0.25s, box-shadow 0.25s; }
    .login-field:focus-within {
      border-color: rgba(212,175,55,0.6) !important;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.1);
    }
    .login-field:focus-within .login-icon { color: #d4af37 !important; }
    .login-input:focus { outline: none; }
    .login-btn:not(:disabled):hover {
      filter: brightness(1.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(212,175,55,0.42);
    }
    .login-btn:not(:disabled):active { transform: translateY(0); }
    .login-btn   { transition: all 0.25s ease; }
    .toggle-btn:hover { color: #f5e17a !important; }
    .shake { animation: shake 0.42s ease; }

    .orb1 {
      position: absolute; width: 320px; height: 320px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%);
      top: -80px; right: -80px;
      animation: floatOrb 7s ease-in-out infinite;
      pointer-events: none;
    }
    .orb2 {
      position: absolute; width: 240px; height: 240px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
      bottom: -60px; left: -60px;
      animation: floatOrb 9s ease-in-out infinite reverse;
      pointer-events: none;
    }
    .orb3 {
      position: absolute; width: 140px; height: 140px; border-radius: 50%;
      background: radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
      top: 40%; left: -40px;
      animation: floatOrb 6s ease-in-out infinite 2s;
      pointer-events: none;
    }

    /* grid pattern overlay */
    .grid-bg::before {
      content: '';
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
    }
  `;
    document.head.appendChild(style);
};

/* ── Component ───────────────────────────────────────────────────────── */
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const cardRef = useRef(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { injectStyles(); }, []);

    const triggerShake = () => {
        setShake(true);
        setTimeout(() => setShake(false), 450);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            const msg = err.response?.data?.error || 'Invalid credentials. Please try again.';
            setError(msg);
            triggerShake();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 55%, #0d0d0a 100%)',
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background orbs & grid */}
            <div className="grid-bg" style={{ position: 'absolute', inset: 0 }} />
            <div className="orb1" />
            <div className="orb2" />
            <div className="orb3" />

            {/* Diagonal accent line */}
            <div style={{
                position: 'absolute', top: 0, left: '50%',
                width: '1px', height: '100%',
                background: 'linear-gradient(180deg, transparent, rgba(212,175,55,0.08) 30%, rgba(212,175,55,0.08) 70%, transparent)',
                pointerEvents: 'none',
            }} />

            {/* ── Card ── */}
            <div
                ref={cardRef}
                className={`login-card${shake ? ' shake' : ''}`}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'linear-gradient(160deg, #171408 0%, #0e0e06 60%, #111108 100%)',
                    border: '1px solid rgba(212,175,55,0.22)',
                    borderRadius: '18px',
                    padding: 'clamp(2rem, 5vw, 2.75rem)',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,175,55,0.06), inset 0 1px 0 rgba(212,175,55,0.08)',
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                {/* Top ornament */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    {/* Crown emblem */}
                    <div style={{
                        width: '56px', height: '56px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #1a1500, #2a2000)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.1)',
                    }}>
                        <span style={{ fontSize: '1.6rem', lineHeight: 1, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.6))' }}>♛</span>
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
                        fontWeight: '700',
                        letterSpacing: '0.04em',
                        background: 'linear-gradient(135deg, #d4af37 0%, #f5e17a 50%, #b8941f 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 0.3rem',
                        lineHeight: 1.1,
                    }}>
                        Admin Portal
                    </h1>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'rgba(212,175,55,0.45)',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}>
                        Secure access · Authorised personnel only
                    </p>
                </div>

                {/* Divider */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem',
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                    <span style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Sign In</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                </div>

                {/* Error alert */}
                {error && (
                    <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '10px',
                        padding: '0.75rem 1rem',
                        marginBottom: '1.25rem',
                        animation: 'fadeInUp 0.3s ease',
                    }} role="alert">
                        <span style={{ fontSize: '0.85rem', marginTop: '0.05rem', flexShrink: 0 }}>⚠</span>
                        <span style={{ fontSize: '0.82rem', color: '#f87171', lineHeight: 1.45 }}>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                    {/* Email */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(212,175,55,0.55)',
                            marginBottom: '0.45rem',
                        }}>
                            Email Address
                        </label>
                        <div
                            className="login-field"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                background: 'rgba(212,175,55,0.04)',
                                border: '1px solid rgba(212,175,55,0.16)',
                                borderRadius: '10px',
                                padding: '0 1rem',
                            }}
                        >
                            <FaEnvelope
                                className="login-icon"
                                style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.82rem', flexShrink: 0, transition: 'color 0.25s' }}
                            />
                            <input
                                className="login-input"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                                autoComplete="email"
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '0.85rem 0',
                                    color: '#f5f0e8',
                                    fontSize: '0.92rem',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    letterSpacing: '0.02em',
                                }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'rgba(212,175,55,0.55)',
                            marginBottom: '0.45rem',
                        }}>
                            Password
                        </label>
                        <div
                            className="login-field"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                background: 'rgba(212,175,55,0.04)',
                                border: '1px solid rgba(212,175,55,0.16)',
                                borderRadius: '10px',
                                padding: '0 1rem',
                            }}
                        >
                            <FaLock
                                className="login-icon"
                                style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.8rem', flexShrink: 0, transition: 'color 0.25s' }}
                            />
                            <input
                                className="login-input"
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '0.85rem 0',
                                    color: '#f5f0e8',
                                    fontSize: '0.92rem',
                                    fontFamily: "'Cormorant Garamond', serif",
                                    letterSpacing: '0.04em',
                                }}
                            />
                            <button
                                type="button"
                                className="toggle-btn"
                                onClick={() => setShowPw(v => !v)}
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'rgba(212,175,55,0.3)', fontSize: '0.85rem',
                                    padding: '0.2rem', flexShrink: 0, transition: 'color 0.2s',
                                    display: 'flex', alignItems: 'center',
                                }}
                            >
                                {showPw ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                        style={{
                            marginTop: '0.5rem',
                            width: '100%',
                            padding: '0.9rem',
                            background: loading
                                ? 'rgba(212,175,55,0.4)'
                                : 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #b8941f 100%)',
                            border: 'none',
                            borderRadius: '10px',
                            color: loading ? 'rgba(10,10,10,0.6)' : '#0a0a0a',
                            fontWeight: '700',
                            fontSize: '0.88rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontFamily: "'Cormorant Garamond', serif",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                        }}
                    >
                        {loading ? (
                            <>
                                <span style={{
                                    width: '14px', height: '14px', borderRadius: '50%',
                                    border: '2px solid rgba(10,10,10,0.25)',
                                    borderTopColor: 'rgba(10,10,10,0.7)',
                                    display: 'inline-block',
                                    animation: 'spinDot 0.7s linear infinite',
                                }} />
                                Authenticating…
                            </>
                        ) : (
                            <>✦ Sign In</>
                        )}
                    </button>
                </form>

                {/* Footer note */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '1.75rem',
                    marginBottom: 0,
                    fontSize: '0.68rem',
                    color: 'rgba(212,175,55,0.22)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    lineHeight: 1.6,
                }}>
                    Protected area · Unauthorised access is prohibited
                </p>
            </div>
        </div>
    );
};

export default Login;