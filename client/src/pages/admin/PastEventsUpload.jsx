import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
    FaCloudUploadAlt, FaTrash, FaCheckCircle,
    FaVideo, FaStar, FaMoneyBillWave, FaCamera,
    FaImages, FaCalendarAlt, FaMapMarkerAlt, FaUser,
    FaQuoteLeft, FaTag, FaSpinner, FaRegStar,
    FaAward, FaPalette,
} from 'react-icons/fa';
import { uploadSingleImage, uploadMultipleImages, createEvent } from '../../services/api';

/* ─── Gold + Black Design Tokens ────────────────────────────────────── */
const S = {
    gold: '#C9A84C',
    goldLight: '#E8C97A',
    goldDark: '#8B6914',
    goldGlow: 'rgba(201,168,76,0.18)',
    black: '#0A0A0B',
    blackSoft: '#111113',
    blackCard: '#16161A',
    blackBorder: '#2A2A30',
    textPrimary: '#F5F0E8',
    textMuted: '#8A8490',
    textGold: '#C9A84C',
};

/* ─── Tiny styled-string helpers (inline styles object) ─────────────── */
const inputStyle = {
    background: S.blackCard,
    border: `1px solid ${S.blackBorder}`,
    borderRadius: '10px',
    color: S.textPrimary,
    padding: '14px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: S.textGold,
    marginBottom: '8px',
};

const sectionHeadStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: S.gold,
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `1px solid ${S.blackBorder}`,
};

/* ─── FocusInput wrapper to manage focus border ─────────────────────── */
const FocusInput = ({ tag: Tag = 'input', style = {}, ...props }) => {
    const [focused, setFocused] = useState(false);
    return (
        <Tag
            {...props}
            style={{
                ...inputStyle,
                ...style,
                borderColor: focused ? S.gold : S.blackBorder,
                boxShadow: focused ? `0 0 0 3px ${S.goldGlow}` : 'none',
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
        />
    );
};

/* ─── Divider with ornament ──────────────────────────────────────────── */
const GoldDivider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 24px' }}>
        <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
        <div style={{ width: '6px', height: '6px', background: S.gold, transform: 'rotate(45deg)', borderRadius: '1px' }} />
        <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
    </div>
);

/* ─── Animated char counter ──────────────────────────────────────────── */
const CharCount = ({ value, max }) => {
    const pct = value.length / max;
    const color = pct > 0.9 ? '#E05252' : pct > 0.7 ? S.gold : S.textMuted;
    return (
        <div style={{ textAlign: 'right', fontSize: '11px', color, marginTop: '4px', transition: 'color 0.3s' }}>
            {value.length}/{max}
        </div>
    );
};

/* ─── Dropzone card ──────────────────────────────────────────────────── */
const DropCard = ({ rootProps, inputProps, isDrag, children, minH = 160 }) => (
    <div
        {...rootProps}
        style={{
            border: `2px dashed ${isDrag ? S.gold : S.blackBorder}`,
            borderRadius: '14px',
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDrag ? S.goldGlow : S.blackCard,
            minHeight: minH,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.3s, background 0.3s, transform 0.2s',
            transform: isDrag ? 'scale(1.01)' : 'scale(1)',
        }}
    >
        <input {...inputProps} />
        {children}
    </div>
);

/* ─── Spinner ────────────────────────────────────────────────────────── */
const Spinner = () => (
    <FaSpinner
        style={{
            animation: 'spin 1s linear infinite',
            display: 'inline-block',
            marginRight: '8px',
        }}
    />
);

/* ─── Category badge preview ─────────────────────────────────────────── */
const CATEGORIES = [
    { value: 'wedding', label: '💍 Wedding', emoji: '💍' },
    { value: 'reception', label: '🥂 Reception', emoji: '🥂' },
    { value: 'corporate', label: '💼 Corporate', emoji: '💼' },
    { value: 'birthday', label: '🎂 Birthday', emoji: '🎂' },
    { value: 'other', label: '✨ Other', emoji: '✨' },
];

/* ─── Step tracker ───────────────────────────────────────────────────── */
const steps = ['Event Details', 'Client Proof', 'Media'];
const StepBar = ({ current }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '32px' }}>
        {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        border: `2px solid ${i <= current ? S.gold : S.blackBorder}`,
                        background: i < current ? S.gold : i === current ? S.goldGlow : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '13px', fontWeight: '700',
                        color: i < current ? S.black : i === current ? S.gold : S.textMuted,
                        transition: 'all 0.4s',
                    }}>
                        {i < current ? '✓' : i + 1}
                    </div>
                    <span style={{
                        fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase',
                        color: i === current ? S.gold : S.textMuted, fontWeight: i === current ? '700' : '400',
                        whiteSpace: 'nowrap',
                    }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                    <div style={{
                        height: '2px', flex: 1, marginBottom: '22px',
                        background: i < current ? S.gold : S.blackBorder,
                        transition: 'background 0.4s',
                    }} />
                )}
            </div>
        ))}
    </div>
);

/* ─── Tip tooltip ────────────────────────────────────────────────────── */
const Tip = ({ text }) => (
    <div style={{
        background: S.goldGlow,
        border: `1px solid ${S.goldDark}`,
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '12px',
        color: S.goldLight,
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
        marginBottom: '16px',
    }}>
        <FaAward style={{ marginTop: '1px', flexShrink: 0, color: S.gold }} />
        <span>{text}</span>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const PastEventsUpload = () => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        venue: '',
        category: 'wedding',
        clientName: '',
        clientTestimonial: '',
        videoLink: '',
        featured: false,
        price: '',
    });
    const [coverImage, setCoverImage] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    /* Cover dropzone */
    const onDropCover = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setCoverImage({ file, preview: URL.createObjectURL(file) });
        }
    }, []);
    const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: coverDrag } =
        useDropzone({ onDrop: onDropCover, accept: { 'image/*': [] }, maxFiles: 1 });

    /* Gallery dropzone */
    const onDropGallery = useCallback((acceptedFiles) => {
        const newFiles = acceptedFiles.map((f) => ({ file: f, preview: URL.createObjectURL(f) }));
        setGalleryFiles((prev) => [...prev, ...newFiles]);
    }, []);
    const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: galleryDrag } =
        useDropzone({ onDrop: onDropGallery, accept: { 'image/*': [] }, multiple: true });

    const removeCover = (e) => { e.stopPropagation(); setCoverImage(null); };
    const removeGalleryImage = (index) => setGalleryFiles((prev) => prev.filter((_, i) => i !== index));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) { alert('Event title is required.'); return; }
        if (!coverImage) { alert('Please upload a cover image.'); return; }
        setUploading(true);
        setUploadProgress(10);
        try {
            const coverFormData = new FormData();
            coverFormData.append('image', coverImage.file);
            setUploadProgress(30);
            const coverRes = await uploadSingleImage(coverFormData);
            const coverUrl = coverRes.data.url;

            let galleryUrls = [];
            if (galleryFiles.length > 0) {
                const galleryFormData = new FormData();
                galleryFiles.forEach((f) => galleryFormData.append('images', f.file));
                setUploadProgress(60);
                const galleryRes = await uploadMultipleImages(galleryFormData);
                galleryUrls = galleryRes.data.urls;
            }
            setUploadProgress(85);

            await createEvent({ ...form, isPast: true, coverImage: coverUrl, gallery: galleryUrls });
            setUploadProgress(100);

            setSuccess(true);
            setForm({ title: '', description: '', date: '', venue: '', category: 'wedding', clientName: '', clientTestimonial: '', videoLink: '', featured: false, price: '' });
            setCoverImage(null);
            setGalleryFiles([]);
            setActiveStep(0);
            setTimeout(() => { setSuccess(false); setUploadProgress(0); }, 5000);
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Something went wrong. Please try again.');
            setUploadProgress(0);
        } finally {
            setUploading(false);
        }
    };

    const selectedCategory = CATEGORIES.find((c) => c.value === form.category);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
                @keyframes successPulse { 0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.4); } 50% { box-shadow: 0 0 0 12px rgba(201,168,76,0); } }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes progressFill { from{width:0%} to{width:var(--target)} }
                @keyframes floatUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .upload-page * { box-sizing: border-box; }
                .upload-page input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(3) hue-rotate(0deg); cursor:pointer; }
                .upload-page input[type="date"] { color-scheme: dark; }
                .upload-page select option { background: #16161A; color: #F5F0E8; }
                .upload-page .gallery-thumb { transition: transform 0.2s, box-shadow 0.2s; }
                .upload-page .gallery-thumb:hover { transform: scale(1.06); box-shadow: 0 4px 20px rgba(201,168,76,0.3); }
                .upload-page .remove-btn { opacity:0; transition: opacity 0.2s; }
                .upload-page .gallery-wrap:hover .remove-btn { opacity:1; }
                .upload-page .cat-pill { cursor:pointer; padding:8px 16px; border-radius:30px; border:1px solid; font-size:13px; transition: all 0.25s; display:inline-flex; align-items:center; gap:6px; }
                .upload-page .cat-pill:hover { transform: translateY(-1px); }
                .upload-page .submit-btn { transition: all 0.3s; }
                .upload-page .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(201,168,76,0.35); }
                .upload-page .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .upload-page .section-card { animation: floatUp 0.4s ease both; }
                .upload-page .section-card:nth-child(2) { animation-delay: 0.08s; }
                .upload-page .section-card:nth-child(3) { animation-delay: 0.16s; }
                .upload-page .section-card:nth-child(4) { animation-delay: 0.24s; }
            `}</style>

            <div className="upload-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `radial-gradient(ellipse at 20% 10%, rgba(201,168,76,0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(201,168,76,0.04) 0%, transparent 50%)`,
                padding: '40px 16px 80px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
            }}>
                <div style={{ maxWidth: '740px', margin: '0 auto' }}>

                    {/* ── Header ── */}
                    <div style={{ textAlign: 'center', marginBottom: '40px', animation: 'fadeSlideIn 0.5s ease' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                            borderRadius: '30px', padding: '6px 18px', marginBottom: '20px',
                            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: S.goldLight, fontWeight: '600',
                        }}>
                            <FaPalette style={{ fontSize: '10px' }} />
                            Portfolio Management
                        </div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(32px, 5vw, 52px)',
                            fontWeight: '600',
                            color: S.textPrimary,
                            margin: '0 0 12px',
                            lineHeight: 1.15,
                            letterSpacing: '-0.01em',
                        }}>
                            Showcase Your{' '}
                            <span style={{
                                background: `linear-gradient(135deg, ${S.goldLight}, ${S.gold}, ${S.goldDark})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>Finest Work</span>
                        </h1>
                        <p style={{ color: S.textMuted, fontSize: '15px', maxWidth: '460px', margin: '0 auto', lineHeight: 1.7 }}>
                            Every event you add strengthens your portfolio. Rich details and stunning visuals convert
                            visitors into premium clients.
                        </p>
                    </div>

                    {/* ── Step Bar ── */}
                    <StepBar current={activeStep} />

                    {/* ── Success Banner ── */}
                    {success && (
                        <div style={{
                            marginBottom: '24px',
                            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                            border: `1px solid ${S.gold}`,
                            borderRadius: '14px',
                            padding: '18px 24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            animation: 'fadeSlideIn 0.4s ease, successPulse 2s ease 0.4s',
                        }}>
                            <FaCheckCircle style={{ color: S.gold, fontSize: '22px', flexShrink: 0 }} />
                            <div>
                                <p style={{ margin: 0, fontWeight: '600', color: S.goldLight, fontSize: '15px' }}>
                                    Event Published Successfully!
                                </p>
                                <p style={{ margin: '2px 0 0', color: S.textMuted, fontSize: '13px' }}>
                                    Your past event is now live in your portfolio.
                                </p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* ── Section 1: Event Details ── */}
                        <div className="section-card" style={{ background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px', padding: '28px', marginBottom: '16px' }}
                            onClick={() => setActiveStep(0)}>
                            <div style={sectionHeadStyle}>
                                <FaCalendarAlt style={{ color: S.gold }} />
                                Event Details
                                <span style={{ marginLeft: 'auto', fontSize: '10px', color: S.textMuted, letterSpacing: '0.05em', textTransform: 'none', fontWeight: '400' }}>
                                    * Required fields
                                </span>
                            </div>

                            <Tip text="A compelling title with venue name improves SEO and helps couples find you on search engines." />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                                <div>
                                    <label style={labelStyle}><FaTag />Event Title *</label>
                                    <FocusInput name="title" placeholder="e.g. Riya & Arjun's Garden Wedding" value={form.title}
                                        onChange={handleChange} required maxLength={80} />
                                    <CharCount value={form.title} max={80} />
                                </div>
                                <div>
                                    <label style={labelStyle}><FaMapMarkerAlt />Venue</label>
                                    <FocusInput name="venue" placeholder="e.g. The Leela Palace, Bengaluru" value={form.venue}
                                        onChange={handleChange} maxLength={80} />
                                </div>
                                <div>
                                    <label style={labelStyle}><FaCalendarAlt />Event Date</label>
                                    <FocusInput tag="input" type="date" name="date" value={form.date} onChange={handleChange} />
                                </div>
                                <div>
                                    <label style={labelStyle}><FaTag />Category</label>
                                    <FocusInput tag="select" name="category" value={form.category} onChange={handleChange}
                                        style={{ cursor: 'pointer' }}>
                                        {CATEGORIES.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </FocusInput>
                                </div>
                            </div>

                            {/* Category Pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                                {CATEGORIES.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        className="cat-pill"
                                        onClick={() => setForm((p) => ({ ...p, category: c.value }))}
                                        style={{
                                            borderColor: form.category === c.value ? S.gold : S.blackBorder,
                                            color: form.category === c.value ? S.gold : S.textMuted,
                                            background: form.category === c.value ? S.goldGlow : 'transparent',
                                        }}
                                    >
                                        {c.label}
                                    </button>
                                ))}
                            </div>

                            <div>
                                <label style={labelStyle}><FaQuoteLeft />What Made It Special</label>
                                <FocusInput
                                    tag="textarea"
                                    name="description"
                                    placeholder="Describe the unique moments, décor, and what made this event unforgettable for your clients…"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    maxLength={600}
                                    style={{ resize: 'vertical', minHeight: '110px', lineHeight: 1.6 }}
                                />
                                <CharCount value={form.description} max={600} />
                            </div>
                        </div>

                        {/* ── Section 2: Client & Social Proof ── */}
                        <div className="section-card" style={{ background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px', padding: '28px', marginBottom: '16px' }}
                            onClick={() => setActiveStep(1)}>
                            <div style={sectionHeadStyle}>
                                <FaUser style={{ color: S.gold }} />
                                Client &amp; Social Proof
                            </div>

                            <Tip text="Testimonials and pricing signals boost trust. Events with client reviews get 3× more inquiries." />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                                <div>
                                    <label style={labelStyle}><FaUser />Client Name</label>
                                    <FocusInput name="clientName" placeholder="e.g. Riya & Arjun Sharma" value={form.clientName}
                                        onChange={handleChange} maxLength={60} />
                                </div>
                                <div>
                                    <label style={labelStyle}><FaMoneyBillWave />Package Price</label>
                                    <FocusInput name="price" placeholder="e.g. ₹1,50,000" value={form.price}
                                        onChange={handleChange} maxLength={30} />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}><FaQuoteLeft />Client Testimonial</label>
                                <FocusInput
                                    tag="textarea"
                                    name="clientTestimonial"
                                    placeholder='"Working with this team was the best decision we made for our wedding. Every detail was perfect…"'
                                    value={form.clientTestimonial}
                                    onChange={handleChange}
                                    rows={3}
                                    maxLength={400}
                                    style={{ resize: 'vertical', minHeight: '90px', lineHeight: 1.6 }}
                                />
                                <CharCount value={form.clientTestimonial} max={400} />
                            </div>

                            {/* Video Link */}
                            <div style={{ marginTop: '14px' }}>
                                <label style={labelStyle}><FaVideo />Highlight Video</label>
                                <FocusInput type="url" name="videoLink" placeholder="https://youtube.com/watch?v=…" value={form.videoLink}
                                    onChange={handleChange} />
                                <p style={{ fontSize: '11px', color: S.textMuted, marginTop: '6px' }}>
                                    YouTube or Vimeo link — video reels dramatically increase booking conversions.
                                </p>
                            </div>

                            {/* Featured Toggle */}
                            <label style={{
                                display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer',
                                background: form.featured ? S.goldGlow : 'transparent',
                                border: `1px solid ${form.featured ? S.goldDark : S.blackBorder}`,
                                borderRadius: '12px', padding: '14px 18px', marginTop: '16px',
                                transition: 'all 0.3s',
                            }}>
                                <div style={{
                                    width: '44px', height: '24px', borderRadius: '12px',
                                    background: form.featured ? S.gold : S.blackBorder,
                                    position: 'relative', transition: 'background 0.3s', flexShrink: 0,
                                }}>
                                    <div style={{
                                        position: 'absolute', top: '3px',
                                        left: form.featured ? '23px' : '3px',
                                        width: '18px', height: '18px', borderRadius: '50%',
                                        background: form.featured ? S.black : S.textMuted,
                                        transition: 'left 0.3s, background 0.3s',
                                    }} />
                                    <input type="checkbox" name="featured" checked={form.featured}
                                        onChange={handleChange} style={{ display: 'none' }} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500', fontSize: '14px', color: form.featured ? S.goldLight : S.textPrimary }}>
                                        <FaStar style={{ color: S.gold }} />
                                        Feature on Homepage
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: S.textMuted }}>
                                        Pinned events appear in the hero section and attract 2× more views
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* ── Section 3: Media Upload ── */}
                        <div className="section-card" style={{ background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px', padding: '28px', marginBottom: '24px' }}
                            onClick={() => setActiveStep(2)}>
                            <div style={sectionHeadStyle}>
                                <FaCamera style={{ color: S.gold }} />
                                Media Upload
                            </div>

                            {/* Cover Image */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={labelStyle}><FaCamera />Cover Image *</label>
                                <p style={{ fontSize: '12px', color: S.textMuted, marginBottom: '10px' }}>
                                    The hero image — choose your absolute best shot. Min 1200×800px recommended.
                                </p>
                                <DropCard rootProps={getCoverRootProps()} inputProps={getCoverInputProps()} isDrag={coverDrag} minH={180}>
                                    {coverImage ? (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                                <img src={coverImage.preview} alt="Cover preview" style={{
                                                    height: '160px', maxWidth: '100%', objectFit: 'cover',
                                                    borderRadius: '10px', border: `2px solid ${S.gold}`,
                                                }} />
                                                <div style={{
                                                    position: 'absolute', top: '6px', right: '6px',
                                                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
                                                    borderRadius: '6px', padding: '4px 10px', fontSize: '11px',
                                                    color: S.gold, display: 'flex', alignItems: 'center', gap: '4px',
                                                }}>
                                                    <FaCheckCircle style={{ fontSize: '10px' }} /> Cover Set
                                                </div>
                                            </div>
                                            <br />
                                            <button type="button" onClick={removeCover} style={{
                                                marginTop: '12px', background: 'transparent',
                                                border: `1px solid rgba(224,82,82,0.4)`, borderRadius: '8px',
                                                color: '#E05252', padding: '6px 14px', cursor: 'pointer',
                                                fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                transition: 'all 0.2s',
                                            }}>
                                                <FaTrash style={{ fontSize: '10px' }} /> Remove &amp; Re-upload
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{
                                                width: '56px', height: '56px', borderRadius: '50%',
                                                border: `2px dashed ${S.goldDark}`, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                                                transition: 'border-color 0.3s',
                                                borderColor: coverDrag ? S.gold : S.goldDark,
                                            }}>
                                                <FaCloudUploadAlt style={{ fontSize: '24px', color: coverDrag ? S.gold : S.textMuted }} />
                                            </div>
                                            <p style={{ color: S.textPrimary, fontWeight: '500', margin: '0 0 4px', fontSize: '14px' }}>
                                                {coverDrag ? 'Drop it here!' : 'Drag & drop your cover image'}
                                            </p>
                                            <p style={{ color: S.textMuted, fontSize: '12px', margin: 0 }}>
                                                or click to browse — JPG, PNG, WEBP
                                            </p>
                                        </>
                                    )}
                                </DropCard>
                            </div>

                            {/* Gallery */}
                            <div>
                                <label style={labelStyle}><FaImages />Gallery Images</label>
                                <p style={{ fontSize: '12px', color: S.textMuted, marginBottom: '10px' }}>
                                    Add 8–20 photos for a rich portfolio feel. Multiple images per upload supported.
                                </p>
                                <DropCard rootProps={getGalleryRootProps()} inputProps={getGalleryInputProps()} isDrag={galleryDrag} minH={120}>
                                    {galleryFiles.length > 0 ? (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '12px' }}>
                                                {galleryFiles.map((file, idx) => (
                                                    <div key={idx} className="gallery-wrap" style={{ position: 'relative' }}>
                                                        <img src={file.preview} alt="" className="gallery-thumb" style={{
                                                            height: '72px', width: '72px', objectFit: 'cover',
                                                            borderRadius: '8px', border: `1px solid ${S.blackBorder}`,
                                                            display: 'block',
                                                        }} />
                                                        <button type="button" className="remove-btn" onClick={() => removeGalleryImage(idx)} style={{
                                                            position: 'absolute', top: '-5px', right: '-5px',
                                                            background: '#E05252', color: '#fff', border: 'none',
                                                            borderRadius: '50%', width: '20px', height: '20px',
                                                            cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            lineHeight: 1,
                                                        }}>×</button>
                                                    </div>
                                                ))}
                                                {/* Add more tile */}
                                                <div style={{
                                                    height: '72px', width: '72px', borderRadius: '8px',
                                                    border: `2px dashed ${S.blackBorder}`, display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    color: S.textMuted, fontSize: '22px', cursor: 'pointer',
                                                }}>+</div>
                                            </div>
                                            <p style={{ color: S.goldLight, fontSize: '12px', margin: 0, fontWeight: '500' }}>
                                                {galleryFiles.length} photo{galleryFiles.length !== 1 ? 's' : ''} selected — click to add more
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <FaImages style={{ fontSize: '28px', color: galleryDrag ? S.gold : S.textMuted, marginBottom: '10px' }} />
                                            <p style={{ color: S.textPrimary, fontWeight: '500', margin: '0 0 4px', fontSize: '14px' }}>
                                                {galleryDrag ? 'Drop all images here!' : 'Drag & drop gallery photos'}
                                            </p>
                                            <p style={{ color: S.textMuted, fontSize: '12px', margin: 0 }}>
                                                Optional — add as many as you like
                                            </p>
                                        </>
                                    )}
                                </DropCard>
                            </div>
                        </div>

                        {/* ── Upload Progress ── */}
                        {uploading && (
                            <div style={{ marginBottom: '20px', animation: 'fadeSlideIn 0.3s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: S.textMuted }}>
                                    <span>Uploading your event…</span>
                                    <span style={{ color: S.gold }}>{uploadProgress}%</span>
                                </div>
                                <div style={{ height: '4px', background: S.blackBorder, borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${uploadProgress}%`,
                                        background: `linear-gradient(90deg, ${S.goldDark}, ${S.gold}, ${S.goldLight})`,
                                        borderRadius: '4px',
                                        transition: 'width 0.6s ease',
                                        backgroundSize: '200% 100%',
                                        animation: uploadProgress < 100 ? 'shimmer 2s linear infinite' : 'none',
                                    }} />
                                </div>
                            </div>
                        )}

                        {/* ── Submit Button ── */}
                        <button
                            type="submit"
                            disabled={uploading}
                            className="submit-btn"
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: '14px',
                                border: 'none',
                                background: uploading
                                    ? S.blackBorder
                                    : `linear-gradient(135deg, ${S.goldDark} 0%, ${S.gold} 50%, ${S.goldLight} 100%)`,
                                color: uploading ? S.textMuted : S.black,
                                fontSize: '15px',
                                fontWeight: '700',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                fontFamily: 'inherit',
                            }}
                        >
                            {uploading ? (
                                <><Spinner />Publishing Your Event…</>
                            ) : (
                                <><FaAward />Publish to Portfolio</>
                            )}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '12px', color: S.textMuted, marginTop: '16px', lineHeight: 1.6 }}>
                            By publishing, this event will appear in your public portfolio and may be featured in search results.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PastEventsUpload;