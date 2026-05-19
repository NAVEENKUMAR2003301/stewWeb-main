import { useState, useEffect, useRef } from 'react';
import { submitEnquiry } from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';
import {
    FaWhatsapp, FaUser, FaPhone, FaEnvelope, FaCalendarAlt,
    FaMapMarkerAlt, FaCommentAlt, FaTag, FaCheckCircle,
    FaPaperPlane, FaCrown, FaSpinner, FaStar, FaShieldAlt,
    FaBolt, FaGem,
} from 'react-icons/fa';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const S = {
    gold: '#C9A84C',
    goldLight: '#E8C97A',
    goldDark: '#8B6914',
    goldPale: '#F5D87A',
    goldGlow: 'rgba(201,168,76,0.15)',
    goldGlowStrong: 'rgba(201,168,76,0.28)',
    black: '#0A0A0B',
    blackCard: '#16161A',
    blackDeep: '#0F0F13',
    blackBorder: '#2A2A30',
    blackBorderHover: '#3A3A44',
    textPrimary: '#F5F0E8',
    textMuted: '#8A8490',
    textGold: '#C9A84C',
    green: '#25D366',
    greenDark: '#1DAE54',
    greenGlow: 'rgba(37,211,102,0.18)',
};

/* ─── Focus-aware input/textarea ─────────────────────────────────────── */
const inputBase = {
    background: S.blackDeep,
    border: `1px solid ${S.blackBorder}`,
    borderRadius: '10px',
    color: S.textPrimary,
    padding: '13px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s, box-shadow 0.3s, background 0.3s',
};

const FI = ({ tag: Tag = 'input', leftIcon, style = {}, ...props }) => {
    const [f, setF] = useState(false);
    const [hovered, setHovered] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            {leftIcon && (
                <span style={{
                    position: 'absolute', left: '13px', top: Tag === 'textarea' ? '14px' : '50%',
                    transform: Tag === 'textarea' ? 'none' : 'translateY(-50%)',
                    color: f ? S.gold : hovered ? S.goldDark : S.textMuted,
                    transition: 'color 0.3s', fontSize: '13px', pointerEvents: 'none', zIndex: 1,
                }}>
                    {leftIcon}
                </span>
            )}
            <Tag
                {...props}
                style={{
                    ...inputBase, ...style,
                    paddingLeft: leftIcon ? '40px' : '16px',
                    borderColor: f ? S.gold : hovered ? S.blackBorderHover : S.blackBorder,
                    boxShadow: f
                        ? `0 0 0 3px ${S.goldGlow}, 0 0 20px rgba(201,168,76,0.08)`
                        : hovered ? `0 0 0 1px ${S.blackBorderHover}` : 'none',
                    background: f ? 'rgba(15,15,19,0.98)' : S.blackDeep,
                }}
                onFocus={() => setF(true)}
                onBlur={() => setF(false)}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            />
        </div>
    );
};

/* ─── Field label ────────────────────────────────────────────────────── */
const Label = ({ icon, children, required }) => (
    <label style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: S.textGold, marginBottom: '7px',
    }}>
        {icon} {children}
        {required && <span style={{ color: S.gold, marginLeft: '2px' }}>*</span>}
    </label>
);

/* ─── Event type pill selector ───────────────────────────────────────── */
const EVENT_TYPES = [
    { value: 'Wedding', emoji: '💍' },
    { value: 'Reception', emoji: '🥂' },
    { value: 'Corporate', emoji: '💼' },
    { value: 'Birthday', emoji: '🎂' },
    { value: 'Other', emoji: '✨' },
];

/* ─── Progress calc ──────────────────────────────────────────────────── */
const getProgress = (form) => {
    const fields = [form.name, form.phone, form.eventType, form.eventDate, form.city];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
};

/* ─── Spinner ────────────────────────────────────────────────────────── */
const Spin = () => (
    <FaSpinner style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: '8px' }} />
);

/* ─── Floating orb background decoration ────────────────────────────── */
const GoldOrb = ({ style }) => (
    <div style={{
        position: 'absolute', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
        pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite',
        ...style,
    }} />
);

/* ─── Decorative diamond divider ─────────────────────────────────────── */
const DiamondDivider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${S.blackBorder})` }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '4px', height: '4px', background: S.goldDark, transform: 'rotate(45deg)' }} />
            <span style={{ fontSize: '11px', color: S.textMuted, letterSpacing: '0.1em', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>or fill the form</span>
            <div style={{ width: '4px', height: '4px', background: S.goldDark, transform: 'rotate(45deg)' }} />
        </div>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${S.blackBorder}, transparent)` }} />
    </div>
);

/* ─── Stat counter ───────────────────────────────────────────────────── */
const StatCounter = ({ end, suffix, label }) => {
    const [count, setCount] = useState(0);
    const ref = useRef();
    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                let start = 0;
                const step = Math.ceil(end / 40);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= end) { setCount(end); clearInterval(timer); }
                    else setCount(start);
                }, 35);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end]);
    return (
        <div ref={ref} style={{ textAlign: 'center' }}>
            <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px', fontWeight: '700',
                background: `linear-gradient(135deg, ${S.goldLight}, ${S.gold})`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1,
            }}>{count}{suffix}</div>
            <div style={{ fontSize: '11px', color: S.textMuted, marginTop: '4px', letterSpacing: '0.06em' }}>{label}</div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const Contact = () => {
    const [form, setForm] = useState({
        name: '', phone: '', email: '', eventType: '',
        customEventType: '', eventDate: '', city: '', message: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardHovered, setCardHovered] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const getEventTypeLabel = () =>
        form.eventType === 'Other' ? (form.customEventType.trim() || 'Other event') : form.eventType;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await submitEnquiry({ ...form, eventType: getEventTypeLabel() });
            if (res.data?.success) {
                setForm({ name: '', phone: '', email: '', eventType: '', customEventType: '', eventDate: '', city: '', message: '' });
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const directWhatsApp = () => {
        const message = encodeURIComponent("Hi! I'm interested in your event services. Please share details.");
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    const progress = getProgress(form);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

                @keyframes spin { to { transform: rotate(360deg); } }

                @keyframes fadeSlideIn {
                    from { opacity:0; transform:translateY(-18px); }
                    to { opacity:1; transform:translateY(0); }
                }
                @keyframes floatUp {
                    from { opacity:0; transform:translateY(28px); }
                    to { opacity:1; transform:translateY(0); }
                }
                @keyframes scaleIn {
                    from { opacity:0; transform:scale(0.94); }
                    to { opacity:1; transform:scale(1); }
                }
                @keyframes successBounce {
                    0%  { transform:scale(0.8);opacity:0; }
                    60% { transform:scale(1.05); }
                    100%{ transform:scale(1);opacity:1; }
                }
                @keyframes shimmerBar {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes orbFloat {
                    0%,100% { transform: translateY(0) scale(1); }
                    50%     { transform: translateY(-24px) scale(1.08); }
                }
                @keyframes orbFloat2 {
                    0%,100% { transform: translateY(0) scale(1) rotate(0deg); }
                    33%     { transform: translateY(-18px) scale(1.05) rotate(5deg); }
                    66%     { transform: translateY(12px) scale(0.97) rotate(-3deg); }
                }
                @keyframes crownSway {
                    0%,100% { transform:rotate(-4deg); }
                    50%     { transform:rotate(4deg); }
                }
                @keyframes goldPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.35); }
                    50%     { box-shadow: 0 0 0 8px rgba(201,168,76,0); }
                }
                @keyframes borderRotate {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes countUp {
                    from { opacity:0; transform:translateY(10px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes pillGlow {
                    0%,100% { box-shadow: 0 0 8px rgba(201,168,76,0.2); }
                    50%     { box-shadow: 0 0 18px rgba(201,168,76,0.45); }
                }
                @keyframes checkmarkDraw {
                    from { stroke-dashoffset: 100; }
                    to   { stroke-dashoffset: 0; }
                }

                .contact-page * { box-sizing: border-box; }
                .contact-page ::placeholder { color: #4A4856; }
                .contact-page select option { background: #16161A; color: #F5F0E8; }
                .contact-page input[type="date"] { color-scheme: dark; }
                .contact-page input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.6) sepia(1) saturate(2) hue-rotate(0deg); cursor: pointer;
                }

                /* WhatsApp button */
                .wa-cta-btn {
                    width: 100%;
                    padding: 16px;
                    border-radius: 12px;
                    border: none;
                    background: linear-gradient(135deg, #1DAE54, #25D366, #2ecc71);
                    background-size: 200% auto;
                    color: #fff;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    letter-spacing: 0.03em;
                    box-shadow: 0 4px 24px rgba(37,211,102,0.22), 0 1px 0 rgba(255,255,255,0.1) inset;
                    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
                    margin-bottom: 24px;
                    position: relative;
                    overflow: hidden;
                }
                .wa-cta-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%);
                    background-size: 200% auto;
                    opacity: 0;
                    transition: opacity 0.3s;
                    animation: shimmerBar 2s linear infinite;
                }
                .wa-cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(37,211,102,0.38), 0 1px 0 rgba(255,255,255,0.15) inset; }
                .wa-cta-btn:hover::before { opacity: 1; }
                .wa-cta-btn:active { transform: translateY(0) scale(0.98); }

                /* Submit button */
                .submit-btn {
                    width: 100%;
                    padding: 18px;
                    border-radius: 12px;
                    border: none;
                    font-size: 15px;
                    font-weight: 700;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-family: inherit;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
                }
                .submit-btn:not(:disabled) {
                    background: linear-gradient(135deg, #8B6914, #C9A84C, #E8C97A, #C9A84C, #8B6914);
                    background-size: 250% auto;
                    color: #0A0A0B;
                    cursor: pointer;
                    box-shadow: 0 6px 28px rgba(201,168,76,0.28), 0 1px 0 rgba(255,255,255,0.1) inset;
                    animation: goldPulse 2.5s ease-in-out infinite;
                }
                .submit-btn:not(:disabled)::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
                    background-size: 200% auto;
                    opacity: 0;
                    animation: shimmerBar 1.8s linear infinite;
                    transition: opacity 0.3s;
                }
                .submit-btn:not(:disabled):hover {
                    transform: translateY(-3px);
                    box-shadow: 0 14px 40px rgba(201,168,76,0.42), 0 1px 0 rgba(255,255,255,0.18) inset;
                    background-position: right center;
                    animation: none;
                }
                .submit-btn:not(:disabled):hover::before { opacity: 1; }
                .submit-btn:not(:disabled):active { transform: translateY(0) scale(0.98); }
                .submit-btn:disabled {
                    background: #2A2A30;
                    color: #8A8490;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                /* Event pills */
                .event-pill {
                    cursor: pointer;
                    border: 1px solid;
                    border-radius: 30px;
                    padding: 9px 18px;
                    font-size: 13px;
                    font-weight: 500;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: transparent;
                    font-family: inherit;
                    transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
                }
                .event-pill:hover { transform: translateY(-2px) scale(1.04); }
                .event-pill.active { animation: pillGlow 2s ease-in-out infinite; }

                /* Info cards */
                .info-card {
                    background: #16161A;
                    border: 1px solid #2A2A30;
                    border-radius: 16px;
                    padding: 22px 16px;
                    text-align: center;
                    transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
                    position: relative;
                    overflow: hidden;
                }
                .info-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
                    opacity: 0;
                    transition: opacity 0.35s;
                }
                .info-card:hover { transform: translateY(-5px); border-color: #8B6914; box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.15); }
                .info-card:hover::before { opacity: 1; }

                /* Trust badges */
                .trust-badge {
                    font-size: 11px;
                    color: #8A8490;
                    background: #0F0F13;
                    border: 1px solid #2A2A30;
                    border-radius: 20px;
                    padding: 6px 14px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.25s;
                }
                .trust-badge:hover { border-color: #8B6914; color: #C9A84C; transform: translateY(-1px); }

                /* Stat cards */
                .stat-card {
                    text-align: center;
                    padding: 18px 12px;
                    background: #16161A;
                    border: 1px solid #2A2A30;
                    border-radius: 14px;
                    transition: all 0.3s;
                }
                .stat-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.4); }

                /* Progress bar shimmer */
                .progress-bar {
                    background: linear-gradient(90deg, #8B6914, #C9A84C, #E8C97A, #C9A84C, #8B6914);
                    background-size: 200% auto;
                    animation: shimmerBar 2s linear infinite;
                }

                /* Main card glow border */
                .main-card {
                    position: relative;
                }
                .main-card::before {
                    content: '';
                    position: absolute;
                    inset: -1px;
                    border-radius: 21px;
                    background: linear-gradient(135deg, rgba(201,168,76,0.3) 0%, transparent 40%, transparent 60%, rgba(201,168,76,0.15) 100%);
                    pointer-events: none;
                    z-index: 0;
                    opacity: 0;
                    transition: opacity 0.4s;
                }
                .main-card:hover::before { opacity: 1; }

                /* Header badge */
                .header-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(201,168,76,0.1);
                    border: 1px solid rgba(139,105,20,0.6);
                    border-radius: 30px;
                    padding: 7px 20px;
                    margin-bottom: 20px;
                    font-size: 10px;
                    letter-spacing: 0.16em;
                    text-transform: uppercase;
                    color: #E8C97A;
                    font-weight: 700;
                    transition: all 0.3s;
                    animation: floatUp 0.5s ease both;
                }
                .header-badge:hover { background: rgba(201,168,76,0.18); border-color: #C9A84C; box-shadow: 0 0 16px rgba(201,168,76,0.2); }

                /* Crown icon */
                .crown-icon { animation: crownSway 3s ease-in-out infinite; display: inline-block; }

                /* Fallback link */
                .fallback-link { color: #C9A84C; background:none; border:none; cursor:pointer; text-decoration:underline; font-family:inherit; font-size:inherit; padding:0; transition: color 0.2s; }
                .fallback-link:hover { color: #E8C97A; }

                /* Responsive */
                @media (max-width: 640px) {
                    .contact-grid { grid-template-columns: 1fr !important; }
                    .stats-row { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
                }
                @media (max-width: 400px) {
                    .stats-row { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>

            <div className="contact-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `
                    radial-gradient(ellipse 80% 50% at 10% -5%, rgba(201,168,76,0.07) 0%, transparent 55%),
                    radial-gradient(ellipse 60% 40% at 90% 105%, rgba(201,168,76,0.05) 0%, transparent 55%),
                    radial-gradient(ellipse 40% 30% at 50% 50%, rgba(201,168,76,0.02) 0%, transparent 70%)
                `,
                padding: '52px 16px 120px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background decorative orbs */}
                <GoldOrb style={{ width: '400px', height: '400px', top: '-100px', left: '-120px', animationDuration: '10s' }} />
                <GoldOrb style={{ width: '300px', height: '300px', bottom: '80px', right: '-80px', animationDuration: '13s', animationDelay: '-4s' }} />
                <GoldOrb style={{ width: '200px', height: '200px', top: '40%', left: '60%', animationDuration: '9s', animationDelay: '-2s', animation: 'orbFloat2 9s ease-in-out infinite' }} />

                {/* Decorative corner lines */}
                <div style={{
                    position: 'absolute', top: '24px', left: '24px',
                    width: '60px', height: '60px',
                    borderTop: `1.5px solid rgba(201,168,76,0.25)`,
                    borderLeft: `1.5px solid rgba(201,168,76,0.25)`,
                    borderRadius: '4px 0 0 0', pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', top: '24px', right: '24px',
                    width: '60px', height: '60px',
                    borderTop: `1.5px solid rgba(201,168,76,0.25)`,
                    borderRight: `1.5px solid rgba(201,168,76,0.25)`,
                    borderRadius: '0 4px 0 0', pointerEvents: 'none',
                }} />

                <div style={{ maxWidth: '580px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div className="header-badge">
                            <FaCrown className="crown-icon" style={{ fontSize: '10px' }} />
                            Premium Event Planning
                            <FaCrown className="crown-icon" style={{ fontSize: '10px', animationDelay: '-1.5s' }} />
                        </div>

                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(34px, 7vw, 56px)',
                            fontWeight: '700',
                            color: S.textPrimary,
                            margin: '0 0 14px',
                            lineHeight: 1.08,
                            letterSpacing: '-0.01em',
                            animation: 'fadeSlideIn 0.55s ease 0.1s both',
                        }}>
                            Let's Plan Your{' '}
                            <em style={{
                                background: `linear-gradient(135deg, ${S.goldPale} 0%, ${S.gold} 50%, ${S.goldDark} 100%)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                fontStyle: 'italic',
                            }}>Dream Event</em>
                        </h1>

                        <p style={{
                            color: S.textMuted, fontSize: '15px', lineHeight: 1.75,
                            maxWidth: '420px', margin: '0 auto',
                            animation: 'fadeSlideIn 0.55s ease 0.2s both',
                        }}>
                            Share your vision with us. We craft unforgettable experiences — from intimate gatherings to grand celebrations — tailored just for you.
                        </p>

                        {/* Stats row */}
                        <div className="stats-row" style={{
                            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px', marginTop: '28px',
                            animation: 'floatUp 0.55s ease 0.3s both',
                        }}>
                            {[
                                { end: 500, suffix: '+', label: 'Events Done' },
                                { end: 8, suffix: ' Yrs', label: 'Experience' },
                                { end: 98, suffix: '%', label: 'Happy Clients' },
                            ].map((s) => (
                                <div key={s.label} className="stat-card">
                                    <StatCounter {...s} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Main Card ── */}
                    <div className="main-card" style={{
                        background: S.blackCard,
                        border: `1px solid ${S.blackBorder}`,
                        borderRadius: '20px',
                        overflow: 'hidden',
                        animation: 'floatUp 0.55s ease 0.15s both',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,76,0.04)',
                        position: 'relative',
                        zIndex: 1,
                    }}>
                        {/* Progress Bar */}
                        <div style={{ height: '3px', background: S.blackBorder, position: 'relative', overflow: 'hidden' }}>
                            <div className={progress > 0 ? 'progress-bar' : ''} style={{
                                height: '100%',
                                width: `${progress}%`,
                                background: progress === 0 ? 'transparent' : undefined,
                                transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                                borderRadius: '0 2px 2px 0',
                            }} />
                        </div>

                        {/* Progress label */}
                        {progress > 0 && (
                            <div style={{
                                padding: '10px 28px 0',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <span style={{ fontSize: '10px', color: S.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                    Form completion
                                </span>
                                <span style={{ fontSize: '11px', color: S.gold, fontWeight: '700' }}>{progress}%</span>
                            </div>
                        )}

                        <div style={{ padding: '28px 28px 32px' }}>

                            {/* ── WhatsApp CTA ── */}
                            <button onClick={directWhatsApp} className="wa-cta-btn"
                                aria-label="Chat on WhatsApp for instant event planning response">
                                <FaWhatsapp style={{ fontSize: '20px' }} />
                                Chat on WhatsApp — We Reply Instantly
                            </button>

                            {/* ── Divider ── */}
                            <DiamondDivider />

                            {/* ── Success State ── */}
                            {success && (
                                <div style={{
                                    background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05))',
                                    border: `1px solid ${S.goldDark}`,
                                    borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center',
                                    animation: 'successBounce 0.5s ease',
                                    boxShadow: '0 8px 32px rgba(201,168,76,0.1)',
                                }}>
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '50%',
                                        background: S.goldGlow, border: `2px solid ${S.gold}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 14px',
                                    }}>
                                        <FaCheckCircle style={{ color: S.gold, fontSize: '22px' }} />
                                    </div>
                                    <p style={{ margin: '0 0 6px', fontWeight: '700', color: S.goldLight, fontSize: '16px', fontFamily: "'Cormorant Garamond', serif" }}>
                                        Enquiry Received!
                                    </p>
                                    <p style={{ margin: '0 0 12px', color: S.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
                                        Our team will reach out within 30 minutes. If WhatsApp didn't open automatically,{' '}
                                        <button className="fallback-link" onClick={directWhatsApp}>click here.</button>
                                    </p>
                                    <div style={{
                                        display: 'flex', justifyContent: 'center', gap: '6px',
                                    }}>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} style={{ color: S.gold, fontSize: '12px', animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Form ── */}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                                {/* Name */}
                                <div style={{ animation: 'floatUp 0.4s ease 0.25s both' }}>
                                    <Label icon={<FaUser style={{ fontSize: '10px' }} />}>Full Name</Label>
                                    <FI name="name" placeholder="Priya Sharma" value={form.name} onChange={handleChange} leftIcon={<FaUser />}
                                        autoComplete="name" />
                                </div>

                                {/* Phone + Email */}
                                <div className="contact-grid" style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                                    gap: '14px', animation: 'floatUp 0.4s ease 0.3s both',
                                }}>
                                    <div>
                                        <Label icon={<FaPhone style={{ fontSize: '10px' }} />} required>Phone Number</Label>
                                        <FI type="tel" name="phone" placeholder="+91 9876543210" value={form.phone}
                                            onChange={handleChange} required leftIcon={<FaPhone />} autoComplete="tel" />
                                    </div>
                                    <div>
                                        <Label icon={<FaEnvelope style={{ fontSize: '10px' }} />}>Email Address</Label>
                                        <FI type="email" name="email" placeholder="priya@email.com" value={form.email}
                                            onChange={handleChange} leftIcon={<FaEnvelope />} autoComplete="email" />
                                    </div>
                                </div>

                                {/* Event Type Pills */}
                                <div style={{ animation: 'floatUp 0.4s ease 0.35s both' }}>
                                    <Label icon={<FaTag style={{ fontSize: '10px' }} />}>Event Type</Label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {EVENT_TYPES.map(({ value, emoji }) => {
                                            const isActive = form.eventType === value;
                                            return (
                                                <button
                                                    key={value}
                                                    type="button"
                                                    className={`event-pill ${isActive ? 'active' : ''}`}
                                                    onClick={() => setForm(f => ({ ...f, eventType: value, customEventType: '' }))}
                                                    style={{
                                                        borderColor: isActive ? S.gold : S.blackBorder,
                                                        color: isActive ? S.gold : S.textMuted,
                                                        background: isActive
                                                            ? `linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))`
                                                            : 'transparent',
                                                        boxShadow: isActive ? `0 0 12px rgba(201,168,76,0.18)` : 'none',
                                                    }}
                                                    aria-pressed={isActive}
                                                >
                                                    {emoji} {value}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {/* Hidden select for form compatibility */}
                                    <select name="eventType" value={form.eventType} onChange={handleChange} style={{ display: 'none' }}>
                                        <option value="">Select</option>
                                        {EVENT_TYPES.map(({ value }) => <option key={value} value={value}>{value}</option>)}
                                    </select>
                                </div>

                                {/* Custom Event Type */}
                                {form.eventType === 'Other' && (
                                    <div style={{ animation: 'fadeSlideIn 0.3s ease' }}>
                                        <Label icon={<FaTag style={{ fontSize: '10px' }} />}>Specify Event Type</Label>
                                        <FI name="customEventType" placeholder="e.g. Baby Shower, Anniversary, Engagement…"
                                            value={form.customEventType} onChange={handleChange} leftIcon={<FaTag />} />
                                    </div>
                                )}

                                {/* Date + City */}
                                <div className="contact-grid" style={{
                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                                    gap: '14px', animation: 'floatUp 0.4s ease 0.4s both',
                                }}>
                                    <div>
                                        <Label icon={<FaCalendarAlt style={{ fontSize: '10px' }} />}>Event Date</Label>
                                        <FI type="date" name="eventDate" value={form.eventDate} onChange={handleChange} leftIcon={<FaCalendarAlt />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaMapMarkerAlt style={{ fontSize: '10px' }} />}>City / Venue</Label>
                                        <FI name="city" placeholder="Mumbai" value={form.city} onChange={handleChange}
                                            leftIcon={<FaMapMarkerAlt />} autoComplete="address-level2" />
                                    </div>
                                </div>

                                {/* Message */}
                                <div style={{ animation: 'floatUp 0.4s ease 0.45s both' }}>
                                    <Label icon={<FaCommentAlt style={{ fontSize: '10px' }} />}>Your Vision</Label>
                                    <FI
                                        tag="textarea"
                                        name="message"
                                        rows={4}
                                        placeholder="Tell us about your dream event — theme, guest count, special requirements, budget range…"
                                        value={form.message}
                                        onChange={handleChange}
                                        style={{ resize: 'vertical', minHeight: '108px', lineHeight: 1.7 }}
                                    />
                                </div>

                                {/* Trust Badges */}
                                <div style={{
                                    display: 'flex', gap: '8px', flexWrap: 'wrap',
                                    animation: 'floatUp 0.4s ease 0.5s both',
                                }}>
                                    {[
                                        { icon: <FaShieldAlt style={{ color: S.gold, fontSize: '10px' }} />, text: '100% Private' },
                                        { icon: <FaBolt style={{ color: S.gold, fontSize: '10px' }} />, text: 'Instant Reply' },
                                        { icon: <FaGem style={{ color: S.gold, fontSize: '10px' }} />, text: 'Premium Service' },
                                    ].map(badge => (
                                        <span key={badge.text} className="trust-badge">
                                            {badge.icon} {badge.text}
                                        </span>
                                    ))}
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="submit-btn"
                                    aria-label="Submit event enquiry and open WhatsApp"
                                    style={{ animation: 'floatUp 0.4s ease 0.55s both' }}
                                >
                                    {submitting
                                        ? <><Spin />Sending Enquiry…</>
                                        : <><FaPaperPlane style={{ fontSize: '14px' }} />Send Enquiry & Open WhatsApp</>}
                                </button>

                                <p style={{
                                    textAlign: 'center', fontSize: '11.5px', color: S.textMuted,
                                    margin: 0, lineHeight: 1.65,
                                    animation: 'floatUp 0.4s ease 0.6s both',
                                }}>
                                    By submitting, you agree to be contacted via WhatsApp or email.
                                    We never share your personal details with third parties.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* ── Info Cards below form ── */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '12px', marginTop: '20px',
                        animation: 'floatUp 0.55s ease 0.3s both',
                    }}>
                        {[
                            {
                                icon: '⚡',
                                title: 'Fast Response',
                                desc: 'We reply within 30 minutes during business hours, seven days a week.',
                            },
                            {
                                icon: '🏆',
                                title: '500+ Events',
                                desc: 'Trusted by families and corporates across India for over 8 years.',
                            },
                            {
                                icon: '💎',
                                title: 'Tailored Plans',
                                desc: 'Every event uniquely crafted for your vision, guests, and budget.',
                            },
                        ].map((card, i) => (
                            <div
                                key={card.title}
                                className="info-card"
                                onMouseEnter={() => setCardHovered(i)}
                                onMouseLeave={() => setCardHovered(null)}
                                role="article"
                                aria-label={card.title}
                            >
                                <div style={{
                                    fontSize: '26px', marginBottom: '10px',
                                    transform: cardHovered === i ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                                    transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                                    display: 'inline-block',
                                }}>
                                    {card.icon}
                                </div>
                                <p style={{
                                    margin: '0 0 6px', fontWeight: '600', fontSize: '13px',
                                    color: cardHovered === i ? S.goldLight : S.goldLight,
                                    fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
                                    transition: 'color 0.3s',
                                }}>
                                    {card.title}
                                </p>
                                <p style={{ margin: 0, fontSize: '12px', color: S.textMuted, lineHeight: 1.6 }}>
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* ── Bottom tagline ── */}
                    <div style={{
                        textAlign: 'center', marginTop: '32px',
                        animation: 'floatUp 0.55s ease 0.4s both',
                    }}>
                        <p style={{
                            fontSize: '12px', color: S.textMuted,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                        }}>
                            <span style={{ color: S.goldDark, marginRight: '10px' }}>✦</span>
                            Crafting memories since 2016
                            <span style={{ color: S.goldDark, marginLeft: '10px' }}>✦</span>
                        </p>
                    </div>
                </div>
            </div>

            <WhatsAppFloat />
        </>
    );
};

export default Contact;