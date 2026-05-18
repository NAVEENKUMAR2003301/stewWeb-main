import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt, FaMapMarkerAlt, FaQuoteLeft, FaStar, FaTag, FaMoneyBillWave, FaVideo, FaExpand, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';

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
};

/* ─── Skeleton loader ────────────────────────────────────────────────── */
const Skeleton = ({ w = '100%', h = '20px', r = '8px', style = {} }) => (
    <div style={{ width: w, height: h, borderRadius: r, background: `linear-gradient(90deg, #1A1A20 25%, #222228 50%, #1A1A20 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', ...style }} />
);

const LoadingSkeleton = () => (
    <div style={{ minHeight: '100vh', background: S.black, padding: '0 0 80px', fontFamily: "'DM Sans', sans-serif" }}>
        <Skeleton h="420px" r="0" />
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton h="48px" w="70%" />
            <Skeleton h="20px" w="40%" />
            <Skeleton h="100px" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[1, 2, 3].map(i => <Skeleton key={i} h="180px" r="12px" />)}
            </div>
        </div>
    </div>
);

/* ─── Lightbox ───────────────────────────────────────────────────────── */
const Lightbox = ({ images, startIndex, onClose }) => {
    const [current, setCurrent] = useState(startIndex);
    const prev = () => setCurrent(c => (c - 1 + images.length) % images.length);
    const next = () => setCurrent(c => (c + 1) % images.length);
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.94)', zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeSlideIn 0.2s ease',
        }}>
            <button onClick={onClose} style={{
                position: 'absolute', top: '20px', right: '24px', background: 'rgba(255,255,255,0.08)',
                border: 'none', color: S.textPrimary, fontSize: '20px', cursor: 'pointer',
                width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><FaTimes /></button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} style={{
                position: 'absolute', left: '16px', background: 'rgba(255,255,255,0.08)',
                border: 'none', color: S.textPrimary, fontSize: '18px', cursor: 'pointer',
                width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
            }}><FaChevronLeft /></button>
            <div onClick={e => e.stopPropagation()} style={{ maxWidth: '88vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <img src={images[current]} alt="" style={{ maxWidth: '100%', maxHeight: '78vh', objectFit: 'contain', borderRadius: '12px', boxShadow: `0 0 60px rgba(201,168,76,0.15)` }} />
                <p style={{ color: S.textMuted, fontSize: '13px' }}>{current + 1} / {images.length}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); next(); }} style={{
                position: 'absolute', right: '16px', background: 'rgba(255,255,255,0.08)',
                border: 'none', color: S.textPrimary, fontSize: '18px', cursor: 'pointer',
                width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
            }}><FaChevronRight /></button>
        </div>
    );
};

/* ─── Meta badge ─────────────────────────────────────────────────────── */
const MetaBadge = ({ icon, children }) => (
    <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: S.blackDeep, border: `1px solid ${S.blackBorder}`,
        borderRadius: '20px', padding: '7px 14px', fontSize: '13px', color: S.textMuted,
    }}>
        <span style={{ color: S.gold, fontSize: '12px' }}>{icon}</span>
        {children}
    </span>
);

/* ─── Star rating display ────────────────────────────────────────────── */
const Stars = ({ count = 5 }) => (
    <div style={{ display: 'flex', gap: '3px' }}>
        {Array.from({ length: count }).map((_, i) => (
            <FaStar key={i} style={{ color: S.gold, fontSize: '13px' }} />
        ))}
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [lightbox, setLightbox] = useState(null); // index | null
    const [coverLoaded, setCoverLoaded] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.get(`/events/${id}`);
                setEvent(res.data.data);
            } catch (err) {
                console.error('Failed to load event:', err);
            }
        };
        fetchEvent();
    }, [id]);

    if (!event) return <LoadingSkeleton />;

    const coverSrc = event.coverImage || event.gallery?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200';
    const allImages = [coverSrc, ...(event.gallery || []).filter(u => u !== coverSrc)];
    const enquiryMessage = encodeURIComponent(`Hi! I saw the "${event.title}" event and I'm interested in a similar setup.`);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes fadeSlideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
                @keyframes floatUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
                @keyframes coverReveal { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
                .detail-page * { box-sizing: border-box; }
                .gallery-img { transition: transform 0.3s, box-shadow 0.3s; cursor: zoom-in; }
                .gallery-img:hover { transform: scale(1.03); box-shadow: 0 8px 30px rgba(201,168,76,0.25); }
                .gallery-wrap { position: relative; overflow: hidden; border-radius: 12px; }
                .gallery-expand { position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.6); color:#C9A84C; border:none; border-radius:8px; width:30px; height:30px; display:flex; align-items:center; justify-content:center; cursor:pointer; opacity:0; transition:opacity 0.2s; font-size:12px; }
                .gallery-wrap:hover .gallery-expand { opacity:1; }
                .wa-cta { transition: all 0.3s; }
                .wa-cta:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(37,211,102,0.35) !important; }
                .wa-cta:active { transform: translateY(0); }
            `}</style>

            {/* Lightbox */}
            {lightbox !== null && <Lightbox images={allImages} startIndex={lightbox} onClose={() => setLightbox(null)} />}

            <div className="detail-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `radial-gradient(ellipse at 20% 0%, rgba(201,168,76,0.05) 0%, transparent 50%)`,
                paddingBottom: '100px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
            }}>

                {/* ── Hero Cover ── */}
                <div style={{ position: 'relative', height: 'clamp(280px, 50vw, 480px)', overflow: 'hidden' }}>
                    {!coverLoaded && <Skeleton h="100%" r="0" style={{ position: 'absolute', inset: 0 }} />}
                    <img
                        src={coverSrc}
                        alt={event.title}
                        onLoad={() => setCoverLoaded(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            opacity: coverLoaded ? 1 : 0, transition: 'opacity 0.6s ease',
                            animation: coverLoaded ? 'coverReveal 0.8s ease' : 'none',
                        }}
                    />
                    {/* Gradient overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,11,0.1) 0%, rgba(10,10,11,0.0) 40%, rgba(10,10,11,0.85) 100%)' }} />

                    {/* Featured badge */}
                    {event.featured && (
                        <div style={{
                            position: 'absolute', top: '20px', left: '20px',
                            background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                            backdropFilter: 'blur(8px)',
                            borderRadius: '30px', padding: '6px 16px',
                            fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: S.goldLight, fontWeight: '700',
                            display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                            <FaStar style={{ fontSize: '9px' }} /> Featured Event
                        </div>
                    )}

                    {/* Expand cover */}
                    <button onClick={() => setLightbox(0)} style={{
                        position: 'absolute', bottom: '20px', right: '20px',
                        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
                        border: `1px solid ${S.blackBorder}`, borderRadius: '10px',
                        color: S.textMuted, padding: '8px 14px', cursor: 'pointer',
                        fontSize: '12px', display: 'flex', alignItems: 'center', gap: '7px',
                        transition: 'color 0.2s, border-color 0.2s',
                    }}>
                        <FaExpand style={{ fontSize: '11px' }} /> View Full
                    </button>

                    {/* Title overlay on hero */}
                    <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '100px', animation: 'floatUp 0.5s ease 0.2s both' }}>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(24px, 4vw, 42px)',
                            fontWeight: '700', color: '#fff',
                            margin: 0, lineHeight: 1.15,
                            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                        }}>{event.title}</h1>
                    </div>
                </div>

                {/* ── Content ── */}
                <div style={{ maxWidth: '880px', margin: '0 auto', padding: '36px 20px 0' }}>

                    {/* ── Meta badges ── */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px', animation: 'floatUp 0.4s ease 0.15s both' }}>
                        {event.date && <MetaBadge icon={<FaCalendarAlt />}>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</MetaBadge>}
                        {event.venue && <MetaBadge icon={<FaMapMarkerAlt />}>{event.venue}</MetaBadge>}
                        {event.category && <MetaBadge icon={<FaTag />}>{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</MetaBadge>}
                        {event.price && <MetaBadge icon={<FaMoneyBillWave />}>{event.price}</MetaBadge>}
                    </div>

                    {/* ── Description ── */}
                    {event.description && (
                        <div style={{ marginBottom: '36px', animation: 'floatUp 0.4s ease 0.2s both' }}>
                            <p style={{ color: S.textMuted, fontSize: '15px', lineHeight: 1.8, margin: 0 }}>{event.description}</p>
                        </div>
                    )}

                    {/* ── Highlight Video ── */}
                    {event.videoLink && (
                        <div style={{ marginBottom: '36px', animation: 'floatUp 0.4s ease 0.22s both' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: S.gold, marginBottom: '14px', paddingBottom: '10px', borderBottom: `1px solid ${S.blackBorder}` }}>
                                <FaVideo /> Highlight Video
                            </div>
                            <div style={{ borderRadius: '14px', overflow: 'hidden', aspectRatio: '16/9', background: S.blackCard }}>
                                <iframe
                                    src={event.videoLink.replace('watch?v=', 'embed/')}
                                    title="Event highlight video"
                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                    allowFullScreen
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Gallery ── */}
                    {event.gallery?.length > 0 && (
                        <div style={{ marginBottom: '36px', animation: 'floatUp 0.4s ease 0.25s both' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', color: S.gold, marginBottom: '16px', paddingBottom: '10px', borderBottom: `1px solid ${S.blackBorder}` }}>
                                Gallery
                                <span style={{ background: S.goldGlow, border: `1px solid ${S.goldDark}`, borderRadius: '20px', padding: '2px 10px', fontSize: '10px', color: S.gold, marginLeft: '4px' }}>
                                    {event.gallery.length}
                                </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                                {event.gallery.map((url, index) => (
                                    <div key={index} className="gallery-wrap">
                                        <img
                                            src={url}
                                            alt={`${event.title} ${index + 1}`}
                                            className="gallery-img"
                                            loading="lazy"
                                            onClick={() => setLightbox(allImages.indexOf(url) !== -1 ? allImages.indexOf(url) : index + 1)}
                                            style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                                        />
                                        <button className="gallery-expand" onClick={() => setLightbox(index + 1)}>
                                            <FaExpand />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Testimonial ── */}
                    {event.clientName && (
                        <div style={{ marginBottom: '36px', animation: 'floatUp 0.4s ease 0.3s both' }}>
                            <div style={{
                                background: S.blackCard, border: `1px solid ${S.blackBorder}`,
                                borderLeft: `3px solid ${S.gold}`,
                                borderRadius: '16px', padding: '28px 28px 24px',
                                position: 'relative',
                            }}>
                                <FaQuoteLeft style={{ color: S.goldDark, fontSize: '28px', marginBottom: '14px', opacity: 0.7 }} />
                                {event.clientTestimonial && (
                                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontStyle: 'italic', color: S.textPrimary, lineHeight: 1.7, margin: '0 0 18px' }}>
                                        "{event.clientTestimonial}"
                                    </p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: S.goldGlow, border: `2px solid ${S.goldDark}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: "'Cormorant Garamond', serif", fontWeight: '700',
                                            color: S.gold, fontSize: '16px',
                                        }}>
                                            {event.clientName.charAt(0)}
                                        </div>
                                        <p style={{ margin: 0, fontWeight: '600', color: S.goldLight, fontSize: '14px' }}>— {event.clientName}</p>
                                    </div>
                                    <Stars count={5} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── WhatsApp CTA ── */}
                    <div style={{ textAlign: 'center', padding: '36px 20px', background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px', animation: 'floatUp 0.4s ease 0.35s both' }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: '600', color: S.textPrimary, margin: '0 0 8px' }}>
                            Love What You See?
                        </p>
                        <p style={{ color: S.textMuted, fontSize: '14px', margin: '0 0 24px', lineHeight: 1.6 }}>
                            Let us create a similar magical experience for your special day. We'd love to hear your vision.
                        </p>
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${enquiryMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="wa-cta"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                                background: `linear-gradient(135deg, #1DAE54, #25D366)`,
                                color: '#fff', padding: '16px 36px', borderRadius: '50px',
                                fontSize: '15px', fontWeight: '700', textDecoration: 'none',
                                letterSpacing: '0.03em', boxShadow: '0 6px 24px rgba(37,211,102,0.2)',
                            }}
                        >
                            <FaWhatsapp style={{ fontSize: '18px' }} /> Plan a Similar Event
                        </a>
                        <p style={{ color: S.textMuted, fontSize: '12px', marginTop: '14px' }}>
                            ⚡ We typically reply within 30 minutes
                        </p>
                    </div>

                </div>
            </div>

            <WhatsAppFloat />
        </>
    );
};

export default EventDetail;