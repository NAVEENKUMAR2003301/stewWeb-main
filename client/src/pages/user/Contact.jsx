import { useState } from 'react';
import { submitEnquiry } from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';
import {
    FaWhatsapp, FaUser, FaPhone, FaEnvelope, FaCalendarAlt,
    FaMapMarkerAlt, FaCommentAlt, FaTag, FaCheckCircle,
    FaPaperPlane, FaCrown, FaSpinner,
} from 'react-icons/fa';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const S = {
    gold: '#C9A84C',
    goldLight: '#E8C97A',
    goldDark: '#8B6914',
    goldGlow: 'rgba(201,168,76,0.15)',
    black: '#0A0A0B',
    blackCard: '#16161A',
    blackDeep: '#0F0F13',
    blackBorder: '#2A2A30',
    textPrimary: '#F5F0E8',
    textMuted: '#8A8490',
    textGold: '#C9A84C',
    green: '#25D366',
    greenDark: '#1DAE54',
    greenGlow: 'rgba(37,211,102,0.12)',
};

/* ─── Focus-aware input/select/textarea ─────────────────────────────── */
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
    transition: 'border-color 0.25s, box-shadow 0.25s',
};

const FI = ({ tag: Tag = 'input', leftIcon, style = {}, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            {leftIcon && (
                <span style={{
                    position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
                    color: f ? S.gold : S.textMuted, transition: 'color 0.25s',
                    fontSize: '13px', pointerEvents: 'none', zIndex: 1,
                }}>
                    {leftIcon}
                </span>
            )}
            <Tag
                {...props}
                style={{
                    ...inputBase, ...style,
                    paddingLeft: leftIcon ? '40px' : '16px',
                    borderColor: f ? S.gold : S.blackBorder,
                    boxShadow: f ? `0 0 0 3px ${S.goldGlow}` : 'none',
                }}
                onFocus={() => setF(true)}
                onBlur={() => setF(false)}
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

/* ─── Step progress indicator ────────────────────────────────────────── */
const getProgress = (form) => {
    const fields = [form.name, form.phone, form.eventType, form.eventDate, form.city];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
};

/* ─── Spinner ────────────────────────────────────────────────────────── */
const Spin = () => (
    <FaSpinner style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', marginRight: '8px' }} />
);

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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const getEventTypeLabel = () =>
        form.eventType === 'Other' ? (form.customEventType.trim() || 'Other event') : form.eventType;

    const buildWhatsAppMessage = () => {
        const eventLabel = getEventTypeLabel();
        return `Hello! I'm ${form.name || 'interested'}. I want to plan a ${eventLabel} on ${form.eventDate || 'a date TBD'} in ${form.city || 'my city'}. ${form.message ? 'Additional info: ' + form.message : ''}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setSubmitting(true);

        try {
           const res=await submitEnquiry({ ...form, eventType: getEventTypeLabel() });
           if(res.data?.success){
            setForm({
                name: '', phone: '', email: '', eventType: '',
                customEventType: '', eventDate: '', city: '', message: '',
            });
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
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-14px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
                @keyframes pulseGold { 0%,100% { box-shadow:0 0 0 0 rgba(201,168,76,0.4); } 50% { box-shadow:0 0 0 10px rgba(201,168,76,0); } }
                @keyframes successBounce { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
                .contact-page * { box-sizing: border-box; }
                .contact-page ::placeholder { color: #4A4856; }
                .contact-page select option { background: #16161A; color: #F5F0E8; }
                .contact-page input[type="date"] { color-scheme: dark; }
                .contact-page input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.6) sepia(1) saturate(2) hue-rotate(0deg); cursor:pointer; }
                .wa-btn { transition: all 0.3s; }
                .wa-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 32px rgba(37,211,102,0.35) !important; }
                .wa-btn:active { transform: translateY(0); }
                .submit-btn { transition: all 0.3s; }
                .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(201,168,76,0.3); }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .event-pill { cursor:pointer; transition: all 0.2s; border:1px solid; border-radius:30px; padding: 9px 18px; font-size:13px; font-weight:500; display:inline-flex; align-items:center; gap:7px; background: transparent; font-family:inherit; }
                .event-pill:hover { transform: translateY(-1px); }
                .fallback-link { color: #C9A84C; background:none; border:none; cursor:pointer; text-decoration:underline; font-family:inherit; font-size:inherit; padding:0; }
            `}</style>

            <div className="contact-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `
                    radial-gradient(ellipse at 15% 0%, rgba(201,168,76,0.06) 0%, transparent 50%),
                    radial-gradient(ellipse at 85% 100%, rgba(201,168,76,0.04) 0%, transparent 50%)
                `,
                padding: '48px 16px 100px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
            }}>
                <div style={{ maxWidth: '560px', margin: '0 auto' }}>

                    {/* ── Page Header ── */}
                    <div style={{ textAlign: 'center', marginBottom: '36px', animation: 'fadeSlideIn 0.5s ease' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                            borderRadius: '30px', padding: '6px 18px', marginBottom: '18px',
                            fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: S.goldLight, fontWeight: '700',
                        }}>
                            <FaCrown style={{ fontSize: '9px' }} /> Premium Event Planning
                        </div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(32px, 6vw, 52px)',
                            fontWeight: '700', color: S.textPrimary,
                            margin: '0 0 12px', lineHeight: 1.1,
                        }}>
                            Let's Plan Your{' '}
                            <span style={{
                                background: `linear-gradient(135deg, ${S.goldLight}, ${S.gold}, ${S.goldDark})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Dream Event</span>
                        </h1>
                        <p style={{ color: S.textMuted, fontSize: '15px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto' }}>
                            Share your vision with us. We'll craft an unforgettable experience tailored just for you.
                        </p>
                    </div>

                    {/* ── Main Card ── */}
                    <div style={{
                        background: S.blackCard, border: `1px solid ${S.blackBorder}`,
                        borderRadius: '20px', overflow: 'hidden',
                        animation: 'floatUp 0.5s ease 0.1s both',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.4)',
                    }}>

                        {/* ── Progress Bar ── */}
                        <div style={{ height: '3px', background: S.blackBorder }}>
                            <div style={{
                                height: '100%', width: `${progress}%`,
                                background: `linear-gradient(90deg, ${S.goldDark}, ${S.gold}, ${S.goldLight})`,
                                transition: 'width 0.5s ease',
                                borderRadius: '0 2px 2px 0',
                            }} />
                        </div>

                        <div style={{ padding: '28px 28px 32px' }}>

                            {/* ── WhatsApp CTA ── */}
                            <button onClick={directWhatsApp} className="wa-btn" style={{
                                width: '100%', padding: '15px',
                                borderRadius: '12px', border: 'none',
                                background: `linear-gradient(135deg, #1DAE54, #25D366)`,
                                color: '#fff', fontSize: '15px', fontWeight: '700',
                                cursor: 'pointer', fontFamily: 'inherit',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                letterSpacing: '0.02em',
                                boxShadow: '0 4px 20px rgba(37,211,102,0.2)',
                                marginBottom: '24px',
                            }}>
                                <FaWhatsapp style={{ fontSize: '18px' }} />
                                Chat on WhatsApp — We Reply Instantly
                            </button>

                            {/* ── Divider ── */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '26px' }}>
                                <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '4px', height: '4px', background: S.goldDark, transform: 'rotate(45deg)' }} />
                                    <span style={{ fontSize: '11px', color: S.textMuted, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>or fill the form</span>
                                    <div style={{ width: '4px', height: '4px', background: S.goldDark, transform: 'rotate(45deg)' }} />
                                </div>
                                <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
                            </div>

                            {/* ── Success State ── */}
                            {success && (
                                <div style={{
                                    background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                                    borderRadius: '14px', padding: '20px', marginBottom: '24px', textAlign: 'center',
                                    animation: 'successBounce 0.5s ease',
                                }}>
                                    <FaCheckCircle style={{ color: S.gold, fontSize: '28px', marginBottom: '10px' }} />
                                    <p style={{ margin: '0 0 4px', fontWeight: '700', color: S.goldLight, fontSize: '15px' }}>
                                        Enquiry Received!
                                    </p>
                                    <p style={{ margin: 0, color: S.textMuted, fontSize: '13px', lineHeight: 1.6 }}>
                                        WhatsApp should have opened. If not,{' '}
                                        <button className="fallback-link" onClick={directWhatsApp}>click here to open it.</button>
                                    </p>
                                </div>
                            )}

                            {/* ── Form ── */}
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                                {/* Name */}
                                <div>
                                    <Label icon={<FaUser />}>Full Name</Label>
                                    <FI name="name" placeholder="Priya Sharma" value={form.name} onChange={handleChange} leftIcon={<FaUser />} />
                                </div>

                                {/* Phone + Email */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
                                    <div>
                                        <Label icon={<FaPhone />} required>Phone Number</Label>
                                        <FI type="tel" name="phone" placeholder="+91 9876543210" value={form.phone} onChange={handleChange} required leftIcon={<FaPhone />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaEnvelope />}>Email</Label>
                                        <FI type="email" name="email" placeholder="priya@email.com" value={form.email} onChange={handleChange} leftIcon={<FaEnvelope />} />
                                    </div>
                                </div>

                                {/* Event Type Pills */}
                                <div>
                                    <Label icon={<FaTag />}>Event Type</Label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {EVENT_TYPES.map(({ value, emoji }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                className="event-pill"
                                                onClick={() => setForm(f => ({ ...f, eventType: value, customEventType: '' }))}
                                                style={{
                                                    borderColor: form.eventType === value ? S.gold : S.blackBorder,
                                                    color: form.eventType === value ? S.gold : S.textMuted,
                                                    background: form.eventType === value ? S.goldGlow : 'transparent',
                                                }}
                                            >
                                                {emoji} {value}
                                            </button>
                                        ))}
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
                                        <Label icon={<FaTag />}>Specify Event Type</Label>
                                        <FI name="customEventType" placeholder="e.g. Baby Shower, Anniversary, Engagement…" value={form.customEventType} onChange={handleChange} leftIcon={<FaTag />} />
                                    </div>
                                )}

                                {/* Date + City */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px' }}>
                                    <div>
                                        <Label icon={<FaCalendarAlt />}>Event Date</Label>
                                        <FI type="date" name="eventDate" value={form.eventDate} onChange={handleChange} leftIcon={<FaCalendarAlt />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaMapMarkerAlt />}>City</Label>
                                        <FI name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} leftIcon={<FaMapMarkerAlt />} />
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <Label icon={<FaCommentAlt />}>Your Vision</Label>
                                    <FI
                                        tag="textarea"
                                        name="message"
                                        rows={4}
                                        placeholder="Tell us about your dream event — theme, guest count, special requirements…"
                                        value={form.message}
                                        onChange={handleChange}
                                        style={{ resize: 'vertical', minHeight: '100px', lineHeight: 1.65 }}
                                    />
                                </div>

                                {/* Trust Badges */}
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {['🔒 100% Private', '⚡ Instant Reply', '💎 Premium Service'].map(badge => (
                                        <span key={badge} style={{
                                            fontSize: '11px', color: S.textMuted,
                                            background: S.blackDeep, border: `1px solid ${S.blackBorder}`,
                                            borderRadius: '20px', padding: '5px 12px',
                                        }}>{badge}</span>
                                    ))}
                                </div>

                                {/* Submit */}
                                <button type="submit" disabled={submitting} className="submit-btn" style={{
                                    width: '100%', padding: '17px', borderRadius: '12px', border: 'none',
                                    background: submitting
                                        ? S.blackBorder
                                        : `linear-gradient(135deg, ${S.goldDark}, ${S.gold}, ${S.goldLight})`,
                                    color: submitting ? S.textMuted : S.black,
                                    fontSize: '15px', fontWeight: '700', letterSpacing: '0.05em',
                                    textTransform: 'uppercase', cursor: submitting ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    fontFamily: 'inherit',
                                }}>
                                    {submitting
                                        ? <><Spin />Sending Enquiry…</>
                                        : <><FaPaperPlane />Send & Open WhatsApp</>}
                                </button>

                                <p style={{ textAlign: 'center', fontSize: '12px', color: S.textMuted, margin: 0, lineHeight: 1.6 }}>
                                    By submitting, you agree to be contacted via WhatsApp or email. We never share your details.
                                </p>
                            </form>
                        </div>
                    </div>

                    {/* ── Info Cards below form ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '20px', animation: 'floatUp 0.5s ease 0.2s both' }}>
                        {[
                            { icon: '⚡', title: 'Fast Response', desc: 'We reply within 30 minutes during business hours.' },
                            { icon: '🏆', title: '500+ Events', desc: 'Trusted by families across India for 8+ years.' },
                            { icon: '💎', title: 'Tailored Plans', desc: 'Every event is uniquely crafted for your budget.' },
                        ].map(card => (
                            <div key={card.title} style={{
                                background: S.blackCard, border: `1px solid ${S.blackBorder}`,
                                borderRadius: '14px', padding: '18px 16px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{card.icon}</div>
                                <p style={{ margin: '0 0 4px', fontWeight: '600', fontSize: '13px', color: S.goldLight }}>{card.title}</p>
                                <p style={{ margin: 0, fontSize: '12px', color: S.textMuted, lineHeight: 1.55 }}>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <WhatsAppFloat />
        </>
    );
};

export default Contact;