import { useState } from 'react';
import api from '../../services/api';
import {
    FaWhatsapp, FaEnvelope, FaSave, FaCheckCircle, FaCog,
    FaBell, FaShieldAlt, FaPalette, FaGlobe, FaEye, FaEyeSlash,
    FaInstagram, FaFacebook, FaYoutube, FaLink,
} from 'react-icons/fa';

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
    blackHover: '#1E1E24',
    textPrimary: '#F5F0E8',
    textMuted: '#8A8490',
    textGold: '#C9A84C',
    success: '#4CAF87',
    successGlow: 'rgba(76,175,135,0.12)',
    danger: '#E05252',
};

/* ─── Focus-aware input ──────────────────────────────────────────────── */
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

const FI = ({ tag: Tag = 'input', style = {}, leftIcon, rightSlot, ...props }) => {
    const [f, setF] = useState(false);
    if (leftIcon || rightSlot) {
        return (
            <div style={{ position: 'relative' }}>
                {leftIcon && (
                    <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: f ? S.gold : S.textMuted, transition: 'color 0.25s', fontSize: '14px', pointerEvents: 'none' }}>
                        {leftIcon}
                    </span>
                )}
                <Tag {...props}
                    style={{ ...inputBase, ...style, paddingLeft: leftIcon ? '40px' : style.paddingLeft, paddingRight: rightSlot ? '44px' : undefined, borderColor: f ? S.gold : S.blackBorder, boxShadow: f ? `0 0 0 3px ${S.goldGlow}` : 'none' }}
                    onFocus={() => setF(true)} onBlur={() => setF(false)} />
                {rightSlot && (
                    <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                        {rightSlot}
                    </span>
                )}
            </div>
        );
    }
    return (
        <Tag {...props}
            style={{ ...inputBase, ...style, borderColor: f ? S.gold : S.blackBorder, boxShadow: f ? `0 0 0 3px ${S.goldGlow}` : 'none' }}
            onFocus={() => setF(true)} onBlur={() => setF(false)} />
    );
};

/* ─── Label ──────────────────────────────────────────────────────────── */
const Label = ({ icon, children, hint }) => (
    <div style={{ marginBottom: '7px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', color: S.textGold }}>
            {icon} {children}
        </label>
        {hint && <p style={{ fontSize: '11px', color: S.textMuted, margin: '3px 0 0' }}>{hint}</p>}
    </div>
);

/* ─── Section Card ───────────────────────────────────────────────────── */
const SectionCard = ({ icon, title, children, delay = '0s' }) => (
    <div style={{ background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '16px', padding: '24px', animation: `floatUp 0.4s ease ${delay} both` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: S.gold, marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${S.blackBorder}` }}>
            {icon} {title}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>{children}</div>
    </div>
);

/* ─── Toggle Switch ──────────────────────────────────────────────────── */
const Toggle = ({ checked, onChange, label, sub }) => (
    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '12px 14px', borderRadius: '10px', background: checked ? S.goldGlow : 'transparent', border: `1px solid ${checked ? S.goldDark : S.blackBorder}`, transition: 'all 0.3s', gap: '12px' }}>
        <div>
            <p style={{ margin: 0, fontWeight: '500', fontSize: '14px', color: checked ? S.goldLight : S.textPrimary }}>{label}</p>
            {sub && <p style={{ margin: '2px 0 0', fontSize: '12px', color: S.textMuted }}>{sub}</p>}
        </div>
        <div style={{ width: '42px', height: '23px', borderRadius: '12px', background: checked ? S.gold : S.blackBorder, position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '3px', left: checked ? '21px' : '3px', width: '17px', height: '17px', borderRadius: '50%', background: checked ? S.black : S.textMuted, transition: 'left 0.3s, background 0.3s' }} />
            <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
        </div>
    </label>
);

/* ─── Spinner ────────────────────────────────────────────────────────── */
const Spin = () => <span style={{ display: 'inline-block', width: '14px', height: '14px', border: `2px solid rgba(0,0,0,0.2)`, borderTopColor: S.black, borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '8px', verticalAlign: 'middle' }} />;

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const Settings = () => {
    /* Contact */
    const [whatsapp, setWhatsapp] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210');
    const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
    const [businessName, setBusinessName] = useState('');
    const [website, setWebsite] = useState('');

    /* Social */
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [youtube, setYoutube] = useState('');

    /* Notifications */
    const [notifyNewEnquiry, setNotifyNewEnquiry] = useState(true);
    const [notifyBooking, setNotifyBooking] = useState(true);
    const [whatsappAlerts, setWhatsappAlerts] = useState(false);
    const [weeklyReport, setWeeklyReport] = useState(false);

    /* Security */
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPass, setShowPass] = useState(false);

    /* UI State */
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [passError, setPassError] = useState('');
    const [activeTab, setActiveTab] = useState('general');

    const handleSave = async (e) => {
        e.preventDefault();
        if (newPass && newPass !== confirmPass) {
            setPassError('New passwords do not match.');
            return;
        }
        setPassError('');
        setSaving(true);
        try {
            // Save to backend — extend this with your real API calls
            await new Promise(r => setTimeout(r, 900)); // simulated delay
            setSaved(true);
            setTimeout(() => setSaved(false), 3500);
        } catch (err) {
            console.error('Settings save failed:', err);
        } finally {
            setSaving(false);
        }
    };

    const TABS = [
        { id: 'general', label: 'General', icon: <FaCog /> },
        { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes floatUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
                .settings-page * { box-sizing: border-box; }
                .settings-page ::placeholder { color: #555360; }
                .tab-btn { transition: all 0.25s; border: none; cursor: pointer; font-family: inherit; }
                .tab-btn:hover { background: rgba(201,168,76,0.08) !important; }
                .save-btn { transition: all 0.3s; }
                .save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.28); }
                .save-btn:active:not(:disabled) { transform: translateY(0); }
                .eye-btn { background: none; border: none; cursor: pointer; color: #8A8490; padding: 0; transition: color 0.2s; display:flex; align-items:center; }
                .eye-btn:hover { color: #C9A84C; }
            `}</style>

            <div className="settings-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
                padding: '36px 16px 80px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
            }}>
                <div style={{ maxWidth: '640px', margin: '0 auto' }}>

                    {/* ── Header ── */}
                    <div style={{ marginBottom: '28px', animation: 'fadeSlideIn 0.4s ease' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '7px',
                            background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                            borderRadius: '30px', padding: '5px 14px', marginBottom: '12px',
                            fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: S.goldLight, fontWeight: '700',
                        }}>
                            <FaCog style={{ fontSize: '9px' }} /> Admin Panel
                        </div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(26px, 5vw, 40px)',
                            fontWeight: '700', color: S.textPrimary,
                            margin: '0 0 6px', lineHeight: 1.15,
                        }}>
                            Account{' '}
                            <span style={{ background: `linear-gradient(135deg, ${S.goldLight}, ${S.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Settings
                            </span>
                        </h1>
                        <p style={{ color: S.textMuted, fontSize: '14px', margin: 0 }}>
                            Manage your contact details, notifications, and account security.
                        </p>
                    </div>

                    {/* ── Tabs ── */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '12px', padding: '5px', animation: 'fadeSlideIn 0.4s ease 0.05s both' }}>
                        {TABS.map(tab => (
                            <button key={tab.id} className="tab-btn" onClick={() => setActiveTab(tab.id)} style={{
                                flex: 1, padding: '9px 12px', borderRadius: '9px', fontSize: '12px', fontWeight: '600',
                                letterSpacing: '0.06em', textTransform: 'uppercase',
                                background: activeTab === tab.id ? S.goldGlow : 'transparent',
                                color: activeTab === tab.id ? S.gold : S.textMuted,
                                border: activeTab === tab.id ? `1px solid ${S.goldDark}` : '1px solid transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── Success Toast ── */}
                    {saved && (
                        <div style={{
                            marginBottom: '20px', background: S.successGlow,
                            border: `1px solid ${S.success}`, borderRadius: '12px',
                            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px',
                            animation: 'slideInRight 0.35s ease',
                        }}>
                            <FaCheckCircle style={{ color: S.success, flexShrink: 0 }} />
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: '#7EDBB5', fontSize: '14px' }}>Settings Saved!</p>
                                <p style={{ margin: '2px 0 0', color: S.textMuted, fontSize: '12px' }}>
                                    Changes are live. Restart server to apply environment variables permanently.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        {/* ══ GENERAL TAB ══ */}
                        {activeTab === 'general' && (
                            <>
                                <SectionCard icon={<FaGlobe />} title="Business Info" delay="0s">
                                    <div>
                                        <Label icon={<FaPalette />} hint="Displayed in the site header and email footers.">Business Name</Label>
                                        <FI placeholder="e.g. Golden Moments Events" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                                    </div>
                                    <div>
                                        <Label icon={<FaLink />} hint="Your public-facing website URL.">Website</Label>
                                        <FI type="url" placeholder="https://yoursite.com" value={website} onChange={e => setWebsite(e.target.value)} leftIcon={<FaGlobe />} />
                                    </div>
                                </SectionCard>

                                <SectionCard icon={<FaWhatsapp />} title="Contact Details" delay="0.06s">
                                    <div>
                                        <Label icon={<FaWhatsapp />} hint="Include country code, no spaces or dashes. e.g. 919876543210">WhatsApp Business Number</Label>
                                        <FI type="tel" placeholder="919876543210" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} leftIcon={<FaWhatsapp />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaEnvelope />} hint="Enquiry notifications and reports are sent here.">Admin Email</Label>
                                        <FI type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} leftIcon={<FaEnvelope />} />
                                    </div>
                                </SectionCard>

                                <SectionCard icon={<FaInstagram />} title="Social Media Links" delay="0.12s">
                                    <div>
                                        <Label icon={<FaInstagram />}>Instagram</Label>
                                        <FI placeholder="https://instagram.com/yourpage" value={instagram} onChange={e => setInstagram(e.target.value)} leftIcon={<FaInstagram />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaFacebook />}>Facebook</Label>
                                        <FI placeholder="https://facebook.com/yourpage" value={facebook} onChange={e => setFacebook(e.target.value)} leftIcon={<FaFacebook />} />
                                    </div>
                                    <div>
                                        <Label icon={<FaYoutube />}>YouTube</Label>
                                        <FI placeholder="https://youtube.com/@yourchannel" value={youtube} onChange={e => setYoutube(e.target.value)} leftIcon={<FaYoutube />} />
                                    </div>
                                </SectionCard>
                            </>
                        )}

                        {/* ══ NOTIFICATIONS TAB ══ */}
                        {activeTab === 'notifications' && (
                            <SectionCard icon={<FaBell />} title="Notification Preferences" delay="0s">
                                <Toggle
                                    checked={notifyNewEnquiry}
                                    onChange={e => setNotifyNewEnquiry(e.target.checked)}
                                    label="New Enquiry Alerts"
                                    sub="Get an email whenever a potential client submits the enquiry form."
                                />
                                <Toggle
                                    checked={notifyBooking}
                                    onChange={e => setNotifyBooking(e.target.checked)}
                                    label="Booking Confirmations"
                                    sub="Email alert when a booking is confirmed or payment received."
                                />
                                <Toggle
                                    checked={whatsappAlerts}
                                    onChange={e => setWhatsappAlerts(e.target.checked)}
                                    label="WhatsApp Alerts"
                                    sub="Receive key notifications directly on WhatsApp (requires API setup)."
                                />
                                <Toggle
                                    checked={weeklyReport}
                                    onChange={e => setWeeklyReport(e.target.checked)}
                                    label="Weekly Summary Report"
                                    sub="A digest of enquiries, bookings, and portfolio views every Monday."
                                />
                                {!notifyNewEnquiry && !notifyBooking && !whatsappAlerts && !weeklyReport && (
                                    <div style={{ textAlign: 'center', padding: '12px 0', fontSize: '13px', color: S.textMuted }}>
                                        ⚠️ All notifications are off — you may miss new client enquiries.
                                    </div>
                                )}
                            </SectionCard>
                        )}

                        {/* ══ SECURITY TAB ══ */}
                        {activeTab === 'security' && (
                            <SectionCard icon={<FaShieldAlt />} title="Change Password" delay="0s">
                                <div>
                                    <Label icon={<FaShieldAlt />}>Current Password</Label>
                                    <FI
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter current password"
                                        value={currentPass}
                                        onChange={e => setCurrentPass(e.target.value)}
                                        leftIcon={<FaShieldAlt />}
                                        rightSlot={
                                            <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                                                {showPass ? <FaEyeSlash style={{ fontSize: '14px' }} /> : <FaEye style={{ fontSize: '14px' }} />}
                                            </button>
                                        }
                                    />
                                </div>
                                <div>
                                    <Label icon={<FaShieldAlt />} hint="Minimum 8 characters. Use a mix of letters, numbers & symbols.">New Password</Label>
                                    <FI
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter new password"
                                        value={newPass}
                                        onChange={e => setNewPass(e.target.value)}
                                        leftIcon={<FaShieldAlt />}
                                    />
                                    {/* Strength bar */}
                                    {newPass.length > 0 && (
                                        <div style={{ marginTop: '8px' }}>
                                            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                                                {[1, 2, 3, 4].map(i => {
                                                    const strength = Math.min(4, Math.floor(newPass.length / 3));
                                                    const colors = ['#E05252', '#E89050', S.gold, S.success];
                                                    return (
                                                        <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? colors[strength - 1] : S.blackBorder, transition: 'background 0.3s' }} />
                                                    );
                                                })}
                                            </div>
                                            <p style={{ fontSize: '11px', color: S.textMuted, margin: 0 }}>
                                                {newPass.length < 4 ? 'Too short' : newPass.length < 7 ? 'Weak' : newPass.length < 10 ? 'Good' : 'Strong'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <Label icon={<FaShieldAlt />}>Confirm New Password</Label>
                                    <FI
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Re-enter new password"
                                        value={confirmPass}
                                        onChange={e => { setConfirmPass(e.target.value); setPassError(''); }}
                                        leftIcon={<FaShieldAlt />}
                                        style={{ borderColor: passError ? S.danger : undefined }}
                                    />
                                    {passError && (
                                        <p style={{ fontSize: '12px', color: S.danger, margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            ⚠ {passError}
                                        </p>
                                    )}
                                </div>
                                <div style={{ background: S.goldGlow, border: `1px solid ${S.goldDark}`, borderRadius: '10px', padding: '12px 14px', fontSize: '12px', color: S.goldLight, lineHeight: 1.6 }}>
                                    💡 Leave the password fields blank if you only want to save other settings without changing your password.
                                </div>
                            </SectionCard>
                        )}

                        {/* ── Save Button ── */}
                        <button type="submit" disabled={saving} className="save-btn" style={{
                            width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                            background: saving ? S.blackBorder : `linear-gradient(135deg, ${S.goldDark}, ${S.gold}, ${S.goldLight})`,
                            color: saving ? S.textMuted : S.black,
                            fontSize: '14px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontFamily: 'inherit',
                        }}>
                            {saving ? <><Spin />Saving Changes…</> : <><FaSave />Save Settings</>}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '11px', color: S.textMuted, margin: 0, lineHeight: 1.7 }}>
                            Environment variable changes (WhatsApp, email) require a server restart to apply permanently.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Settings;