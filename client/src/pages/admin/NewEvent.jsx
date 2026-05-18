import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {
    FaCloudUploadAlt, FaArrowLeft, FaStar, FaCalendarAlt,
    FaMapMarkerAlt, FaTag, FaAlignLeft, FaHeading, FaImages,
    FaCheckCircle, FaTimesCircle, FaTrash,
} from 'react-icons/fa';
import { createEvent, uploadSingleImage } from '../../services/api';

/* ── Keyframe injection ─────────────────────────────────────────────── */
const injectStyles = () => {
    if (document.getElementById('ne-styles')) return;
    const style = document.createElement('style');
    style.id = 'ne-styles';
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&display=swap');

    @keyframes fadeInUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes floatOrb  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
    @keyframes shimmer   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes spinDot   { to{transform:rotate(360deg)} }
    @keyframes slideIn   { from{opacity:0;transform:translateY(-8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes popIn     { 0%{transform:scale(0.8);opacity:0} 70%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }

    * { box-sizing: border-box; }

    .ne-field { transition: border-color 0.25s, box-shadow 0.25s; }
    .ne-field:focus-within {
      border-color: rgba(212,175,55,0.55) !important;
      box-shadow: 0 0 0 3px rgba(212,175,55,0.09);
    }
    .ne-field:focus-within .ne-icon { color: #d4af37 !important; }
    .ne-input  { transition: none; }
    .ne-input:focus, .ne-textarea:focus, .ne-select:focus { outline: none; }

    .ne-drop:hover   { border-color: rgba(212,175,55,0.45) !important; background: rgba(212,175,55,0.06) !important; }
    .ne-drop { transition: all 0.25s ease; }

    .ne-backbtn:hover { background: rgba(212,175,55,0.12) !important; border-color: rgba(212,175,55,0.4) !important; color: #d4af37 !important; }
    .ne-backbtn { transition: all 0.22s ease; }

    .ne-submit:not(:disabled):hover {
      filter: brightness(1.14);
      transform: translateY(-2px);
      box-shadow: 0 10px 32px rgba(212,175,55,0.42) !important;
    }
    .ne-submit:not(:disabled):active { transform: translateY(0) scale(0.98); }
    .ne-submit { transition: all 0.25s ease; }

    .ne-toggle { transition: all 0.22s ease; }
    .ne-toggle:hover { border-color: rgba(212,175,55,0.4) !important; }

    .ne-thumb:hover .ne-thumb-del { opacity: 1 !important; }

    .ne-section { animation: fadeInUp 0.5s ease both; }

    .orb-a {
      position:absolute; width:260px; height:260px; border-radius:50%;
      background:radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%);
      top:-60px; right:-60px; animation:floatOrb 8s ease-in-out infinite;
      pointer-events:none;
    }
    .orb-b {
      position:absolute; width:180px; height:180px; border-radius:50%;
      background:radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
      bottom:-40px; left:-40px; animation:floatOrb 10s ease-in-out infinite reverse;
      pointer-events:none;
    }

    .ne-toast {
      position:fixed; bottom:2rem; right:2rem; z-index:9999;
      background:linear-gradient(135deg,#1a1500,#0d0a00);
      border:1px solid rgba(212,175,55,0.4);
      border-radius:10px; padding:0.85rem 1.25rem;
      color:#d4af37; font-size:0.82rem; font-weight:600;
      letter-spacing:0.05em;
      box-shadow:0 8px 24px rgba(0,0,0,0.6);
      display:flex; align-items:center; gap:0.5rem;
      animation:slideIn 0.3s ease;
    }
    .ne-toast-err { border-color:rgba(239,68,68,0.4) !important; color:#f87171 !important; }

    @media(max-width:540px){
      .ne-grid2 { grid-template-columns:1fr !important; }
      .ne-grid3 { grid-template-columns:1fr 1fr !important; }
    }
  `;
    document.head.appendChild(style);
};

/* ── Field wrapper ──────────────────────────────────────────────────── */
const Field = ({ label, icon, required, children, delay = 0 }) => (
    <div className="ne-section" style={{ animationDelay: `${delay}s` }}>
        <label style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.68rem', fontWeight: '700',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(212,175,55,0.55)', marginBottom: '0.45rem',
        }}>
            {icon && <span style={{ opacity: 0.7, fontSize: '0.72rem' }}>{icon}</span>}
            {label}{required && <span style={{ color: '#d4af37', marginLeft: '2px' }}>*</span>}
        </label>
        {children}
    </div>
);

/* ── Input row wrapper ──────────────────────────────────────────────── */
const InputRow = ({ icon, children }) => (
    <div className="ne-field" style={{
        display: 'flex', alignItems: 'center', gap: '0.65rem',
        background: 'rgba(212,175,55,0.04)',
        border: '1px solid rgba(212,175,55,0.15)',
        borderRadius: '10px', padding: '0 1rem',
    }}>
        {icon && <span className="ne-icon" style={{ color: 'rgba(212,175,55,0.28)', fontSize: '0.8rem', flexShrink: 0, transition: 'color 0.25s' }}>{icon}</span>}
        {children}
    </div>
);

const inputStyle = {
    flex: 1, background: 'transparent', border: 'none',
    padding: '0.82rem 0', color: '#f5f0e8', fontSize: '0.9rem',
    fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.02em',
    width: '100%',
};

const CATEGORIES = ['wedding', 'reception', 'corporate', 'birthday', 'other'];

/* ── Component ───────────────────────────────────────────────────────── */
const NewEvent = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '', description: '', date: '', venue: '',
        category: 'wedding', isPast: false, featured: false,
    });
    const [coverImage, setCoverImage] = useState('');
    const [gallery, setGallery] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // {msg, type}
    const [coverDragOver, setCoverDrag] = useState(false);
    const [gallDragOver, setGallDrag] = useState(false);

    useState(() => { injectStyles(); }, []);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    /* ── Cover drop ── */
    const onDropCover = useCallback(async (files) => {
        if (!files.length) return;
        setUploading(true);
        setCoverDrag(false);
        try {
            const fd = new FormData();
            fd.append('image', files[0]);
            const res = await uploadSingleImage(fd);
            setCoverImage(res.data.url);
            showToast('✦  Cover image uploaded');
        } catch {
            showToast('Failed to upload cover image', 'error');
        } finally { setUploading(false); }
    }, []);

    const { getRootProps: getCoverRoot, getInputProps: getCoverInput, isDragActive: isCoverDrag } = useDropzone({
        onDrop: onDropCover, accept: { 'image/*': [] }, maxFiles: 1,
        onDragEnter: () => setCoverDrag(true), onDragLeave: () => setCoverDrag(false),
    });

    /* ── Gallery drop ── */
    const onDropGallery = useCallback(async (files) => {
        if (!files.length) return;
        setUploading(true);
        setGallDrag(false);
        try {
            const fd = new FormData();
            files.forEach(f => fd.append('images', f));
            const { uploadMultipleImages } = await import('../../services/api');
            const res = await uploadMultipleImages(fd);
            setGallery(prev => [...prev, ...res.data.urls]);
            showToast(`✦  ${files.length} image${files.length > 1 ? 's' : ''} added to gallery`);
        } catch {
            showToast('Failed to upload gallery images', 'error');
        } finally { setUploading(false); }
    }, []);

    const { getRootProps: getGallRoot, getInputProps: getGallInput } = useDropzone({
        onDrop: onDropGallery, accept: { 'image/*': [] }, multiple: true,
        onDragEnter: () => setGallDrag(true), onDragLeave: () => setGallDrag(false),
    });

    const removeGallery = (idx) => setGallery(prev => prev.filter((_, i) => i !== idx));

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!coverImage) { showToast('Please upload a cover image', 'error'); return; }
        setSubmitting(true);
        try {
            await createEvent({ ...form, coverImage, gallery });
            showToast('✦  Event created successfully!');
            setTimeout(() => navigate('/admin/events'), 1200);
        } catch {
            showToast('Failed to create event — try again', 'error');
        } finally { setSubmitting(false); }
    };

    const isDisabled = uploading || submitting;

    /* ── Drop zone shared style ── */
    const dropStyle = (active) => ({
        border: `2px dashed ${active ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.18)'}`,
        borderRadius: '12px',
        padding: '1.75rem 1rem',
        textAlign: 'center',
        cursor: 'pointer',
        background: active ? 'rgba(212,175,55,0.07)' : 'rgba(212,175,55,0.02)',
        transition: 'all 0.25s ease',
        position: 'relative',
    });

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 55%, #0d0d0a 100%)',
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            color: '#f5f0e8',
            padding: 'clamp(1.25rem, 4vw, 2.5rem) 1.25rem 4rem',
        }}>
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>

                {/* ── Page header ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', animation: 'fadeInUp 0.4s ease both' }}>
                    <button
                        className="ne-backbtn"
                        onClick={() => navigate(-1)}
                        style={{
                            width: '38px', height: '38px', borderRadius: '10px',
                            background: 'rgba(212,175,55,0.06)',
                            border: '1px solid rgba(212,175,55,0.18)',
                            color: 'rgba(212,175,55,0.5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0,
                        }}
                        aria-label="Go back"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 style={{
                            fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #d4af37 0%, #f5e17a 50%, #b8941f 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: 0, lineHeight: 1.1, letterSpacing: '0.04em',
                        }}>
                            ✦ Add New Event
                        </h1>
                        <p style={{ fontSize: '0.72rem', color: 'rgba(212,175,55,0.4)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0.25rem 0 0' }}>
                            Create &amp; publish a new event entry
                        </p>
                    </div>
                </div>

                {/* ── Form card ── */}
                <form onSubmit={handleSubmit} noValidate>
                    <div style={{
                        background: 'linear-gradient(160deg, #171408 0%, #0e0e06 60%, #111108 100%)',
                        border: '1px solid rgba(212,175,55,0.2)',
                        borderRadius: '18px',
                        padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.05)',
                        position: 'relative', overflow: 'hidden',
                        display: 'flex', flexDirection: 'column', gap: '1.4rem',
                    }}>
                        <div className="orb-a" /><div className="orb-b" />

                        {/* Section label */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                            <span style={{ fontSize: '0.6rem', color: 'rgba(212,175,55,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Event Details</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                        </div>

                        {/* Title */}
                        <Field label="Event Title" icon={<FaHeading />} required delay={0.05}>
                            <InputRow icon={<FaHeading />}>
                                <input
                                    className="ne-input"
                                    style={inputStyle}
                                    type="text" name="title" value={form.title}
                                    onChange={handleChange} required
                                    placeholder="e.g. Royal Wedding Ceremony"
                                />
                            </InputRow>
                        </Field>

                        {/* Description */}
                        <Field label="Description" icon={<FaAlignLeft />} delay={0.1}>
                            <div className="ne-field" style={{
                                background: 'rgba(212,175,55,0.04)',
                                border: '1px solid rgba(212,175,55,0.15)',
                                borderRadius: '10px', padding: '0.2rem 1rem',
                            }}>
                                <textarea
                                    className="ne-textarea"
                                    style={{ ...inputStyle, padding: '0.75rem 0', resize: 'vertical', minHeight: '100px', lineHeight: 1.6 }}
                                    name="description" rows={4}
                                    value={form.description} onChange={handleChange}
                                    placeholder="Describe the event — venue atmosphere, highlights, special moments…"
                                />
                            </div>
                        </Field>

                        {/* Date & Venue */}
                        <div className="ne-grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Field label="Event Date" icon={<FaCalendarAlt />} delay={0.13}>
                                <InputRow icon={<FaCalendarAlt />}>
                                    <input
                                        className="ne-input"
                                        style={{ ...inputStyle, colorScheme: 'dark' }}
                                        type="date" name="date"
                                        value={form.date} onChange={handleChange}
                                    />
                                </InputRow>
                            </Field>
                            <Field label="Venue" icon={<FaMapMarkerAlt />} delay={0.16}>
                                <InputRow icon={<FaMapMarkerAlt />}>
                                    <input
                                        className="ne-input"
                                        style={inputStyle}
                                        type="text" name="venue"
                                        value={form.venue} onChange={handleChange}
                                        placeholder="e.g. The Grand Ballroom"
                                    />
                                </InputRow>
                            </Field>
                        </div>

                        {/* Category */}
                        <Field label="Category" icon={<FaTag />} delay={0.19}>
                            <div className="ne-field" style={{
                                background: 'rgba(212,175,55,0.04)',
                                border: '1px solid rgba(212,175,55,0.15)',
                                borderRadius: '10px', padding: '0 1rem',
                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                            }}>
                                <FaTag className="ne-icon" style={{ color: 'rgba(212,175,55,0.28)', fontSize: '0.78rem', flexShrink: 0, transition: 'color 0.25s' }} />
                                <select
                                    className="ne-select"
                                    style={{ ...inputStyle, cursor: 'pointer' }}
                                    name="category" value={form.category} onChange={handleChange}
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c} value={c} style={{ background: '#111108', color: '#f5f0e8' }}>
                                            {c.charAt(0).toUpperCase() + c.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </Field>

                        {/* Toggles */}
                        <div className="ne-section" style={{ animationDelay: '0.22s' }}>
                            <div style={{
                                display: 'flex', gap: '0.65rem', flexWrap: 'wrap',
                            }}>
                                {[
                                    { name: 'featured', label: 'Featured Event', icon: <FaStar style={{ fontSize: '0.75rem' }} /> },
                                    { name: 'isPast', label: 'Past Event', icon: <FaCalendarAlt style={{ fontSize: '0.72rem' }} /> },
                                ].map(toggle => (
                                    <label
                                        key={toggle.name}
                                        className="ne-toggle"
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                                            padding: '0.65rem 1.1rem',
                                            background: form[toggle.name] ? 'rgba(212,175,55,0.1)' : 'rgba(212,175,55,0.03)',
                                            border: `1px solid ${form[toggle.name] ? 'rgba(212,175,55,0.35)' : 'rgba(212,175,55,0.13)'}`,
                                            borderRadius: '10px', cursor: 'pointer',
                                            userSelect: 'none', flex: '1', minWidth: '160px',
                                        }}
                                    >
                                        {/* Custom checkbox */}
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                                            background: form[toggle.name] ? 'linear-gradient(135deg,#d4af37,#b8941f)' : 'rgba(212,175,55,0.07)',
                                            border: `1px solid ${form[toggle.name] ? '#d4af37' : 'rgba(212,175,55,0.22)'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.22s ease',
                                        }}>
                                            {form[toggle.name] && (
                                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                    <path d="M1 3.5L3.8 6.5L9 1" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                            <input
                                                type="checkbox" name={toggle.name}
                                                checked={form[toggle.name]} onChange={handleChange}
                                                style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                            />
                                        </span>
                                        <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: '0.75rem', marginRight: '0.3rem' }}>{toggle.icon}</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: form[toggle.name] ? '600' : '400', color: form[toggle.name] ? '#f5f0e8' : 'rgba(245,240,232,0.55)', transition: 'all 0.22s' }}>
                                            {toggle.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* ── Media section divider ── */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                            <span style={{ fontSize: '0.6rem', color: 'rgba(212,175,55,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Media Upload</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(212,175,55,0.1)' }} />
                        </div>

                        {/* Cover image drop */}
                        <Field label="Cover Image" icon={<FaCloudUploadAlt />} required delay={0.25}>
                            <div className="ne-drop" style={dropStyle(isCoverDrag)} {...getCoverRoot()}>
                                <input {...getCoverInput()} />
                                {coverImage ? (
                                    <div style={{ animation: 'popIn 0.35s ease' }}>
                                        <img
                                            src={coverImage} alt="Cover preview"
                                            style={{ height: '140px', maxWidth: '100%', objectFit: 'cover', borderRadius: '10px', margin: '0 auto 0.75rem', display: 'block', border: '1px solid rgba(212,175,55,0.2)' }}
                                        />
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                                            <FaCheckCircle style={{ color: '#4ade80', fontSize: '0.82rem' }} />
                                            <span style={{ fontSize: '0.78rem', color: '#4ade80', fontWeight: '600', letterSpacing: '0.05em' }}>Cover uploaded — click to replace</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <FaCloudUploadAlt style={{ fontSize: '1.8rem', color: 'rgba(212,175,55,0.35)', marginBottom: '0.6rem', display: 'block', margin: '0 auto 0.6rem' }} />
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.35)', margin: '0 0 0.25rem' }}>
                                            {isCoverDrag ? 'Release to upload…' : 'Drag & drop cover image, or click to browse'}
                                        </p>
                                        <p style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.25)', margin: 0, letterSpacing: '0.08em' }}>JPG, PNG, WEBP · Max 1 file</p>
                                    </>
                                )}
                                {uploading && (
                                    <div style={{
                                        position: 'absolute', inset: 0, background: 'rgba(14,14,6,0.75)',
                                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                                    }}>
                                        <span style={{
                                            width: '18px', height: '18px', borderRadius: '50%',
                                            border: '2px solid rgba(212,175,55,0.25)',
                                            borderTopColor: '#d4af37',
                                            animation: 'spinDot 0.7s linear infinite',
                                            display: 'inline-block',
                                        }} />
                                        <span style={{ fontSize: '0.78rem', color: '#d4af37', letterSpacing: '0.06em' }}>Uploading…</span>
                                    </div>
                                )}
                            </div>
                        </Field>

                        {/* Gallery drop */}
                        <Field label="Gallery Images" icon={<FaImages />} delay={0.3}>
                            <div className="ne-drop" style={dropStyle(gallDragOver)} {...getGallRoot()}>
                                <input {...getGallInput()} />
                                {gallery.length > 0 ? (
                                    <>
                                        <div className="ne-grid3" style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                                            gap: '0.5rem', marginBottom: '0.85rem',
                                        }}>
                                            {gallery.map((url, idx) => (
                                                <div key={idx} className="ne-thumb" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1' }}>
                                                    <img src={url} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <div
                                                        className="ne-thumb-del"
                                                        onClick={(e) => { e.stopPropagation(); removeGallery(idx); }}
                                                        style={{
                                                            position: 'absolute', inset: 0,
                                                            background: 'rgba(0,0,0,0.55)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            opacity: 0, transition: 'opacity 0.2s', cursor: 'pointer',
                                                        }}
                                                    >
                                                        <FaTrash style={{ color: '#f87171', fontSize: '0.85rem' }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#4ade80', margin: 0, fontWeight: '600', letterSpacing: '0.04em' }}>
                                            <FaCheckCircle style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
                                            {gallery.length} image{gallery.length > 1 ? 's' : ''} · hover to remove · click to add more
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <FaImages style={{ fontSize: '1.8rem', color: 'rgba(212,175,55,0.3)', display: 'block', margin: '0 auto 0.6rem' }} />
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(245,240,232,0.35)', margin: '0 0 0.25rem' }}>
                                            {gallDragOver ? 'Release to upload…' : 'Drag & drop gallery images, or click to browse'}
                                        </p>
                                        <p style={{ fontSize: '0.68rem', color: 'rgba(212,175,55,0.25)', margin: 0, letterSpacing: '0.08em' }}>Multiple files allowed · JPG, PNG, WEBP</p>
                                    </>
                                )}
                            </div>
                        </Field>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="ne-submit"
                            disabled={isDisabled}
                            style={{
                                marginTop: '0.5rem',
                                width: '100%',
                                padding: '1rem',
                                background: isDisabled
                                    ? 'rgba(212,175,55,0.3)'
                                    : 'linear-gradient(135deg, #d4af37 0%, #c9a227 50%, #b8941f 100%)',
                                border: 'none',
                                borderRadius: '12px',
                                color: isDisabled ? 'rgba(10,10,10,0.4)' : '#0a0a0a',
                                fontWeight: '700',
                                fontSize: '0.88rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                fontFamily: "'Cormorant Garamond', serif",
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                                boxShadow: isDisabled ? 'none' : '0 4px 18px rgba(212,175,55,0.25)',
                                position: 'relative', zIndex: 1,
                            }}
                            aria-label="Create event"
                        >
                            {submitting ? (
                                <>
                                    <span style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        border: '2px solid rgba(10,10,10,0.2)',
                                        borderTopColor: 'rgba(10,10,10,0.65)',
                                        animation: 'spinDot 0.7s linear infinite', display: 'inline-block',
                                    }} />
                                    Creating Event…
                                </>
                            ) : uploading ? (
                                <>
                                    <span style={{
                                        width: '14px', height: '14px', borderRadius: '50%',
                                        border: '2px solid rgba(10,10,10,0.2)',
                                        borderTopColor: 'rgba(10,10,10,0.65)',
                                        animation: 'spinDot 0.7s linear infinite', display: 'inline-block',
                                    }} />
                                    Uploading Media…
                                </>
                            ) : '✦ Create Event'}
                        </button>
                    </div>
                </form>

                <p style={{
                    textAlign: 'center', marginTop: '1.5rem',
                    fontSize: '0.65rem', color: 'rgba(212,175,55,0.22)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                    All fields marked * are required · Changes publish immediately
                </p>
            </div>

            {/* ── Toast ── */}
            {toast && (
                <div className={`ne-toast${toast.type === 'error' ? ' ne-toast-err' : ''}`} role="status" aria-live="polite">
                    {toast.type === 'error' ? <FaTimesCircle /> : <FaCheckCircle />}
                    {toast.msg}
                </div>
            )}
        </div>
    );
};

export default NewEvent;