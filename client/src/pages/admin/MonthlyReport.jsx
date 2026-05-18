import { useState, useEffect } from 'react';
import { FaEnvelope, FaPaperPlane, FaCalendarAlt, FaChartBar, FaStar, FaHistory, FaClock } from 'react-icons/fa';
import api from '../../services/api';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'livnaveen@gmail.com';

/* ── Keyframe injection ─────────────────────────────────────────────── */
const injectStyles = () => {
    if (document.getElementById('mr-styles')) return;
    const style = document.createElement('style');
    style.id = 'mr-styles';
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    @keyframes fadeInUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes floatOrb  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-14px)} }
    @keyframes spinDot   { to{transform:rotate(360deg)} }
    @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes slideIn   { from{opacity:0;transform:translateY(-10px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes sendPulse { 0%{box-shadow:0 0 0 0 rgba(212,175,55,0.5)} 70%{box-shadow:0 0 0 14px rgba(212,175,55,0)} 100%{box-shadow:0 0 0 0 rgba(212,175,55,0)} }
    @keyframes checkPop  { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
    @keyframes progressFill { from{width:0%} to{width:100%} }

    * { box-sizing: border-box; }

    .mr-card    { animation: fadeInUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
    .mr-infobox:hover { border-color: rgba(212,175,55,0.35) !important; transform: translateY(-2px); }
    .mr-infobox { transition: all 0.28s ease; }
    .mr-sendbtn:not(:disabled):hover {
      filter: brightness(1.15);
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(212,175,55,0.45) !important;
    }
    .mr-sendbtn:not(:disabled):active { transform: translateY(0) scale(0.98); }
    .mr-sendbtn { transition: all 0.25s ease; }
    .mr-histrow:hover { background: rgba(212,175,55,0.04) !important; }
    .mr-histrow { transition: background 0.2s; }

    .orb-a {
      position:absolute; width:280px; height:280px; border-radius:50%;
      background:radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
      top:-70px; right:-70px; animation:floatOrb 8s ease-in-out infinite;
      pointer-events:none;
    }
    .orb-b {
      position:absolute; width:200px; height:200px; border-radius:50%;
      background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
      bottom:-50px; left:-50px; animation:floatOrb 10s ease-in-out infinite reverse;
      pointer-events:none;
    }

    .grid-bg::before {
      content:''; position:absolute; inset:0;
      background-image:
        linear-gradient(rgba(212,175,55,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(212,175,55,0.035) 1px, transparent 1px);
      background-size:48px 48px; pointer-events:none; border-radius:18px;
    }

    .sending-shimmer {
      background: linear-gradient(90deg,
        rgba(212,175,55,0.7) 0%, rgba(245,225,120,0.95) 40%,
        rgba(212,175,55,0.7) 80%);
      background-size: 200% 100%;
      animation: shimmer 1.2s infinite;
    }

    @media(max-width:520px){
      .mr-inforow { flex-direction:column !important; }
    }
  `;
    document.head.appendChild(style);
};

/* ── Helpers ──────────────────────────────────────────────────────── */
const now = new Date();
const thisMonth = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    .toLocaleString('en-IN', { month: 'long', year: 'numeric' });
const nextSend = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const MOCK_HISTORY = [
    { month: lastMonth, status: 'sent', time: '1st, 08:00 AM' },
    { month: new Date(now.getFullYear(), now.getMonth() - 2, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }), status: 'sent', time: '1st, 08:00 AM' },
    { month: new Date(now.getFullYear(), now.getMonth() - 3, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }), status: 'sent', time: '1st, 08:00 AM' },
];

/* ── Component ──────────────────────────────────────────────────────── */
const MonthlyReport = () => {
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => { injectStyles(); }, []);

    /* simulate a progress bar while sending */
    useEffect(() => {
        if (!sending) { setProgress(0); return; }
        let val = 0;
        const id = setInterval(() => {
            val += Math.random() * 18;
            if (val >= 90) { clearInterval(id); val = 90; }
            setProgress(val);
        }, 220);
        return () => clearInterval(id);
    }, [sending]);

    const sendReport = async () => {
        setSending(true);
        setStatus(null);
        setMessage('');
        try {
            const res = await api.post('/report/send');
            setProgress(100);
            setTimeout(() => {
                setStatus('success');
                setMessage(res.data.message || 'Monthly report sent successfully.');
                setSending(false);
            }, 400);
        } catch (err) {
            setProgress(100);
            setTimeout(() => {
                setStatus('error');
                setMessage(err.response?.data?.error || 'Failed to send report. Please try again.');
                setSending(false);
            }, 400);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 55%, #0d0d0a 100%)',
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            color: '#f5f0e8',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: 'clamp(1.5rem, 4vw, 3rem) 1.25rem',
        }}>
            <div style={{ width: '100%', maxWidth: '560px' }}>

                {/* ── Page header ── */}
                <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeInUp 0.4s ease both' }}>
                    <div style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, #1a1500, #2a2000)',
                        border: '1px solid rgba(212,175,55,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}>
                        <FaEnvelope style={{ color: '#d4af37', fontSize: '1.2rem', filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.5))' }} />
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                        fontWeight: '700',
                        letterSpacing: '0.04em',
                        background: 'linear-gradient(135deg, #d4af37 0%, #f5e17a 50%, #b8941f 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        margin: '0 0 0.4rem',
                        lineHeight: 1.1,
                    }}>
                        Monthly Report
                    </h1>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'rgba(212,175,55,0.45)',
                        letterSpacing: '0.13em',
                        textTransform: 'uppercase',
                        margin: 0,
                    }}>
                        Executive summary · Email dispatch
                    </p>
                </div>

                {/* ── Main card ── */}
                <div
                    className="mr-card grid-bg"
                    style={{
                        background: 'linear-gradient(160deg, #171408 0%, #0e0e06 60%, #111108 100%)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: '18px',
                        padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(212,175,55,0.06)',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <div className="orb-a" />
                    <div className="orb-b" />

                    {/* Report info boxes */}
                    <div className="mr-inforow" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        {[
                            { icon: <FaCalendarAlt />, label: 'Report Period', value: lastMonth },
                            { icon: <FaChartBar />, label: 'Covers', value: 'Enquiries & Events' },
                        ].map((box, i) => (
                            <div
                                key={i}
                                className="mr-infobox"
                                style={{
                                    flex: 1,
                                    background: 'rgba(212,175,55,0.04)',
                                    border: '1px solid rgba(212,175,55,0.14)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                    position: 'relative',
                                    zIndex: 1,
                                }}
                            >
                                <div style={{ color: 'rgba(212,175,55,0.45)', fontSize: '0.82rem' }}>{box.icon}</div>
                                <div style={{ fontSize: '0.63rem', color: 'rgba(212,175,55,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{box.label}</div>
                                <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#f5f0e8' }}>{box.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Recipient row */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        background: 'rgba(212,175,55,0.04)',
                        border: '1px solid rgba(212,175,55,0.12)',
                        borderRadius: '10px',
                        padding: '0.85rem 1rem',
                        marginBottom: '1.5rem',
                        position: 'relative', zIndex: 1,
                    }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #1a1500, #2a2000)',
                            border: '1px solid rgba(212,175,55,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <FaStar style={{ color: '#d4af37', fontSize: '0.75rem' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.62rem', color: 'rgba(212,175,55,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
                                Sending to
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#d4af37', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ADMIN_EMAIL}
                            </div>
                        </div>
                        <div style={{
                            padding: '0.2rem 0.6rem',
                            background: 'rgba(34,197,94,0.1)',
                            border: '1px solid rgba(34,197,94,0.2)',
                            borderRadius: '20px',
                            fontSize: '0.63rem',
                            color: '#4ade80',
                            letterSpacing: '0.07em',
                            textTransform: 'uppercase',
                            fontWeight: '700',
                            flexShrink: 0,
                        }}>
                            Admin
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                        <span style={{ fontSize: '0.6rem', color: 'rgba(212,175,55,0.28)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Manual Dispatch</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                    </div>

                    {/* ── Progress bar (visible only while sending) ── */}
                    {sending && (
                        <div style={{ marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                height: '3px', borderRadius: '3px',
                                background: 'rgba(212,175,55,0.1)',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${progress}%`,
                                    borderRadius: '3px',
                                    background: 'linear-gradient(90deg, #d4af37, #f5e17a)',
                                    transition: 'width 0.3s ease',
                                }} />
                            </div>
                            <p style={{
                                fontSize: '0.7rem', color: 'rgba(212,175,55,0.45)',
                                letterSpacing: '0.08em', textTransform: 'uppercase',
                                marginTop: '0.5rem', textAlign: 'center',
                            }}>
                                Composing &amp; dispatching report…
                            </p>
                        </div>
                    )}

                    {/* ── Status message ── */}
                    {status && !sending && (
                        <div style={{
                            display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
                            background: status === 'success' ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                            border: `1px solid ${status === 'success' ? 'rgba(34,197,94,0.22)' : 'rgba(239,68,68,0.22)'}`,
                            borderRadius: '12px',
                            padding: '0.9rem 1.1rem',
                            marginBottom: '1.25rem',
                            animation: 'slideIn 0.3s ease',
                            position: 'relative', zIndex: 1,
                        }} role="status" aria-live="polite">
                            <span style={{
                                fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem',
                                display: 'inline-block',
                                animation: status === 'success' ? 'checkPop 0.4s ease' : 'none',
                            }}>
                                {status === 'success' ? '✦' : '⚠'}
                            </span>
                            <div>
                                <p style={{
                                    margin: '0 0 0.15rem',
                                    fontSize: '0.82rem',
                                    fontWeight: '600',
                                    color: status === 'success' ? '#4ade80' : '#f87171',
                                    letterSpacing: '0.03em',
                                }}>
                                    {status === 'success' ? 'Report Dispatched Successfully' : 'Dispatch Failed'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(245,240,232,0.45)', lineHeight: 1.5 }}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Send button ── */}
                    <button
                        className="mr-sendbtn"
                        onClick={sendReport}
                        disabled={sending}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: sending
                                ? 'rgba(212,175,55,0.35)'
                                : 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #b8941f 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            color: sending ? 'rgba(10,10,10,0.5)' : '#0a0a0a',
                            fontWeight: '700',
                            fontSize: '0.88rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            cursor: sending ? 'not-allowed' : 'pointer',
                            fontFamily: "'Cormorant Garamond', serif",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.6rem',
                            boxShadow: sending ? 'none' : '0 4px 18px rgba(212,175,55,0.28)',
                            position: 'relative', zIndex: 1,
                            animation: !sending && !status ? 'sendPulse 2.5s ease-in-out infinite' : 'none',
                        }}
                        aria-label="Send monthly report now"
                    >
                        {sending ? (
                            <>
                                <span style={{
                                    width: '14px', height: '14px', borderRadius: '50%',
                                    border: '2px solid rgba(10,10,10,0.2)',
                                    borderTopColor: 'rgba(10,10,10,0.6)',
                                    display: 'inline-block',
                                    animation: 'spinDot 0.7s linear infinite',
                                }} />
                                Dispatching Report…
                            </>
                        ) : (
                            <>
                                <FaPaperPlane style={{ fontSize: '0.82rem' }} />
                                Send Report Now
                            </>
                        )}
                    </button>

                    {/* Auto-schedule note */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.55rem',
                        marginTop: '1.1rem',
                        padding: '0.7rem 0.9rem',
                        background: 'rgba(212,175,55,0.03)',
                        border: '1px solid rgba(212,175,55,0.09)',
                        borderRadius: '8px',
                        position: 'relative', zIndex: 1,
                    }}>
                        <FaClock style={{ color: 'rgba(212,175,55,0.35)', fontSize: '0.78rem', flexShrink: 0 }} />
                        <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(212,175,55,0.35)', lineHeight: 1.55, letterSpacing: '0.02em' }}>
                            Auto-scheduled every <strong style={{ color: 'rgba(212,175,55,0.55)' }}>1st of the month</strong> at 08:00 AM.
                            Next automatic dispatch: <strong style={{ color: 'rgba(212,175,55,0.55)' }}>{nextSend}</strong>.
                        </p>
                    </div>
                </div>

                {/* ── Send History card ── */}
                <div style={{
                    marginTop: '1.25rem',
                    background: 'linear-gradient(160deg, #171408 0%, #0e0e06 100%)',
                    border: '1px solid rgba(212,175,55,0.14)',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    animation: 'fadeInUp 0.6s ease both 0.15s',
                }}>
                    <div style={{
                        padding: '1rem 1.25rem',
                        borderBottom: '1px solid rgba(212,175,55,0.1)',
                        display: 'flex', alignItems: 'center', gap: '0.55rem',
                    }}>
                        <FaHistory style={{ color: 'rgba(212,175,55,0.4)', fontSize: '0.8rem' }} />
                        <span style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: '700' }}>
                            Recent Dispatch History
                        </span>
                    </div>
                    {MOCK_HISTORY.map((h, i) => (
                        <div
                            key={i}
                            className="mr-histrow"
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.85rem 1.25rem',
                                borderBottom: i < MOCK_HISTORY.length - 1 ? '1px solid rgba(212,175,55,0.07)' : 'none',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{
                                    width: '7px', height: '7px', borderRadius: '50%',
                                    background: '#4ade80',
                                    boxShadow: '0 0 6px rgba(74,222,128,0.4)',
                                    flexShrink: 0,
                                }} />
                                <span style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.7)', fontWeight: '600' }}>{h.month}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(212,175,55,0.35)', letterSpacing: '0.05em' }}>{h.time}</span>
                                <span style={{
                                    padding: '0.18rem 0.55rem',
                                    background: 'rgba(34,197,94,0.08)',
                                    border: '1px solid rgba(34,197,94,0.18)',
                                    borderRadius: '20px',
                                    fontSize: '0.62rem',
                                    color: '#4ade80',
                                    letterSpacing: '0.07em',
                                    textTransform: 'uppercase',
                                    fontWeight: '700',
                                }}>
                                    Sent
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    fontSize: '0.65rem',
                    color: 'rgba(212,175,55,0.22)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                }}>
                    Reports are confidential · For authorised personnel only
                </p>
            </div>
        </div>
    );
};

export default MonthlyReport;