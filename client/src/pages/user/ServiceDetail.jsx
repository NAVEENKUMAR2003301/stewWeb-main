import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaWhatsapp, FaArrowLeft, FaStar, FaTag, FaTimes, FaChevronLeft, FaChevronRight, FaShareAlt } from 'react-icons/fa';
import api from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ─────────────────────────────── CSS ─────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

  :root {
    --black:       #0a0a0a;
    --black-mid:   #111111;
    --black-card:  #161616;
    --black-panel: #1c1c1c;
    --gold:        #c9a84c;
    --gold-light:  #e8c96d;
    --gold-pale:   #f5e6b8;
    --gold-dim:    #8a6f2e;
    --gold-glow:   rgba(201,168,76,0.22);
    --white:       #f5f0e8;
    --white-dim:   rgba(245,240,232,0.55);
    --green-wa:    #25d366;
    --green-wa-dk: #1da851;
    --shadow-gold: 0 0 40px rgba(201,168,76,0.2);
    --shadow-card: 0 12px 60px rgba(0,0,0,0.7);
    --radius:      20px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .sd-page {
    min-height: 100vh;
    background: var(--black);
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--white);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Ambient glow ── */
  .sd-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 50% at 15% 5%,  rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 70% at 85% 95%, rgba(201,168,76,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
    animation: ambientPulse 9s ease-in-out infinite alternate;
  }
  @keyframes ambientPulse {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }

  /* ── Inner ── */
  .sd-inner {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 20px 120px;
  }

  /* ── Back link ── */
  .sd-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    text-decoration: none;
    margin-bottom: 36px;
    padding: 10px 20px;
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 100px;
    background: rgba(201,168,76,0.06);
    transition: background 0.3s, border-color 0.3s, transform 0.3s, color 0.3s;
    animation: fadeInDown 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sd-back:hover {
    background: rgba(201,168,76,0.15);
    border-color: rgba(201,168,76,0.55);
    transform: translateX(-4px);
    color: var(--gold-light);
  }

  /* ── Card ── */
  .sd-card {
    background: var(--black-card);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    animation: cardReveal 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(36px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* ── Cover image ── */
  .sd-cover-wrap {
    position: relative;
    overflow: hidden;
    max-height: 480px;
  }
  .sd-cover {
    width: 100%;
    height: 320px;
    object-fit: cover;
    display: block;
    transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
  }
  @media (min-width: 640px) { .sd-cover { height: 420px; } }
  .sd-cover-wrap:hover .sd-cover { transform: scale(1.04); }

  /* Gold gradient overlay on image */
  .sd-cover-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba(10,10,10,0.55) 75%,
      rgba(10,10,10,0.92) 100%
    );
    pointer-events: none;
  }

  /* Title overlay on image */
  .sd-cover-title {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    padding: 28px 36px;
    display: flex;
    align-items: flex-end;
    gap: 16px;
  }
  .sd-icon {
    font-size: 2.8rem;
    line-height: 1;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.7));
  }
  .sd-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.6rem, 4vw, 2.6rem);
    font-weight: 900;
    line-height: 1.1;
    background: linear-gradient(135deg, var(--gold-pale) 0%, var(--gold) 50%, var(--gold-dim) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.03em;
    text-shadow: none;
  }

  /* ── Body ── */
  .sd-body {
    padding: 36px 28px 44px;
  }
  @media (min-width: 640px) { .sd-body { padding: 44px 52px 56px; } }

  /* ── Gold divider ── */
  .gold-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
  }
  .gold-divider span {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .gold-divider svg { color: var(--gold); font-size: 0.8rem; }

  /* ── Price badge ── */
  .sd-price-wrap {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, rgba(201,168,76,0.18) 0%, rgba(201,168,76,0.06) 100%);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 100px;
    padding: 10px 24px;
    margin-bottom: 28px;
    animation: fadeInDown 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sd-price {
    font-family: 'Cinzel', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--gold-light);
    letter-spacing: 0.06em;
  }
  .sd-price-wrap svg { color: var(--gold); }

  /* ── Description ── */
  .sd-desc {
    font-size: 1.13rem;
    font-weight: 300;
    line-height: 1.85;
    color: rgba(245,240,232,0.8);
    margin-bottom: 44px;
    letter-spacing: 0.01em;
    animation: fadeInDown 0.7s 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── Gallery section ── */
  .sd-gallery-title {
    font-family: 'Cinzel', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--gold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadeInDown 0.7s 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sd-gallery-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(201,168,76,0.5), transparent);
  }

  .sd-gallery-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 48px;
    animation: fadeInDown 0.7s 0.45s cubic-bezier(0.16,1,0.3,1) both;
  }
  @media (min-width: 640px) { .sd-gallery-grid { grid-template-columns: repeat(3, 1fr); } }

  .sd-gallery-item {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(201,168,76,0.1);
    cursor: pointer;
    aspect-ratio: 4 / 3;
  }
  .sd-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s cubic-bezier(0.16,1,0.3,1);
  }
  .sd-gallery-item:hover img { transform: scale(1.08); }
  .sd-gallery-item::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(201,168,76,0.0);
    transition: background 0.35s;
    pointer-events: none;
  }
  .sd-gallery-item:hover::after { background: rgba(201,168,76,0.12); }

  /* gallery zoom icon */
  .sd-gallery-item .zoom-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: var(--gold-light);
    opacity: 0;
    transition: opacity 0.35s;
    z-index: 2;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
  }
  .sd-gallery-item:hover .zoom-icon { opacity: 1; }

  /* ── CTA row ── */
  .sd-cta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    align-items: center;
    animation: fadeInDown 0.7s 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  .sd-wa-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, var(--green-wa) 0%, var(--green-wa-dk) 100%);
    color: #fff;
    text-decoration: none;
    padding: 16px 36px;
    border-radius: 100px;
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 6px 28px rgba(37,211,102,0.3);
    transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
    position: relative;
    overflow: hidden;
  }
  .sd-wa-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .sd-wa-btn:hover {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 10px 36px rgba(37,211,102,0.45);
    filter: brightness(1.05);
  }
  .sd-wa-btn:hover::before { opacity: 1; }

  .sd-share-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    color: var(--gold);
    border: 1px solid rgba(201,168,76,0.35);
    padding: 14px 24px;
    border-radius: 100px;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
  }
  .sd-share-btn:hover {
    background: rgba(201,168,76,0.1);
    border-color: rgba(201,168,76,0.6);
    transform: translateY(-2px);
  }

  /* ── Gallery Lightbox ── */
  .lb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.93);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: lbFadeIn 0.3s ease both;
    backdrop-filter: blur(6px);
  }
  @keyframes lbFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .lb-img {
    max-width: 90vw;
    max-height: 82vh;
    object-fit: contain;
    border-radius: 12px;
    border: 1px solid rgba(201,168,76,0.25);
    box-shadow: 0 0 60px rgba(201,168,76,0.15);
    animation: lbImgIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes lbImgIn {
    from { transform: scale(0.88); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }
  .lb-close {
    position: absolute;
    top: 20px; right: 24px;
    background: rgba(201,168,76,0.12);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold);
    border-radius: 50%;
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background 0.25s, transform 0.25s;
  }
  .lb-close:hover { background: rgba(201,168,76,0.25); transform: rotate(90deg); }
  .lb-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(201,168,76,0.1);
    border: 1px solid rgba(201,168,76,0.25);
    color: var(--gold);
    border-radius: 50%;
    width: 48px; height: 48px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 1.1rem;
    transition: background 0.25s, transform 0.25s;
  }
  .lb-nav:hover { background: rgba(201,168,76,0.25); }
  .lb-prev { left: 16px; }
  .lb-next { right: 16px; }
  .lb-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.2em;
    color: var(--gold);
    background: rgba(0,0,0,0.5);
    padding: 6px 18px;
    border-radius: 100px;
    border: 1px solid rgba(201,168,76,0.2);
  }

  /* ── Loading skeleton ── */
  .sd-skeleton {
    min-height: 100vh;
    background: var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
  }
  .sd-skeleton-spinner {
    width: 56px; height: 56px;
    border-radius: 50%;
    border: 3px solid rgba(201,168,76,0.15);
    border-top-color: var(--gold);
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .sd-skeleton-label {
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--gold-dim);
    animation: skPulse 1.4s ease-in-out infinite;
  }
  @keyframes skPulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1;   }
  }

  /* ── Share toast ── */
  .share-toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--black-panel);
    border: 1px solid rgba(201,168,76,0.3);
    color: var(--gold-light);
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    padding: 12px 28px;
    border-radius: 100px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.35s, transform 0.35s;
    z-index: 200;
  }
  .share-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* ── Scroll-to-top ── */
  .scroll-top {
    position: fixed;
    bottom: 90px; right: 24px;
    z-index: 50;
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 700;
    box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s, transform 0.4s, box-shadow 0.3s;
  }
  .scroll-top.visible { opacity: 1; transform: translateY(0); }
  .scroll-top:hover   { box-shadow: 0 6px 30px rgba(201,168,76,0.65); transform: translateY(-3px); }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .sd-inner { padding: 32px 14px 100px; }
    .sd-body  { padding: 24px 18px 36px; }
    .sd-cover-title { padding: 18px 20px; }
    .sd-wa-btn { padding: 14px 24px; font-size: 0.82rem; }
    .lb-nav { width: 38px; height: 38px; }
  }
`;

/* ─── Gallery Lightbox ─── */
const GalleryLightbox = ({ images, startIndex, onClose }) => {
    const [idx, setIdx] = useState(startIndex);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
            if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [images.length, onClose]);

    return (
        <div className="lb-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image viewer">
            <button className="lb-close" onClick={onClose} aria-label="Close"><FaTimes /></button>
            {images.length > 1 && (
                <>
                    <button className="lb-nav lb-prev" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length); }} aria-label="Previous">
                        <FaChevronLeft />
                    </button>
                    <button className="lb-nav lb-next" onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % images.length); }} aria-label="Next">
                        <FaChevronRight />
                    </button>
                </>
            )}
            <img
                key={idx}
                src={images[idx]}
                alt={`Gallery image ${idx + 1}`}
                className="lb-img"
                onClick={(e) => e.stopPropagation()}
            />
            <div className="lb-counter">{idx + 1} / {images.length}</div>
        </div>
    );
};

/* ══════════════════════════════════════════ */
const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [lbIndex, setLbIndex] = useState(null);   // gallery lightbox
    const [showTop, setShowTop] = useState(false);
    const [toastVisible, setToast] = useState(false);

    /* ── Fetch (logic unchanged) ── */
    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await api.get(`/services/${id}`);
                setService(res.data.data);
            } catch (err) {
                console.error('Failed to load service:', err);
            }
        };
        fetchService();
    }, [id]);

    /* ── Scroll-to-top ── */
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 300);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Share ── */
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: service?.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setToast(true);
            setTimeout(() => setToast(false), 2500);
        }
    };

    /* ── Loading ── */
    if (!service) {
        return (
            <>
                <style>{css}</style>
                <div className="sd-skeleton" role="status" aria-label="Loading service details">
                    <div className="sd-skeleton-spinner" />
                    <p className="sd-skeleton-label">Loading Service</p>
                </div>
            </>
        );
    }

    const message = encodeURIComponent(`Hi, I'm interested in the ${service.title} service.`);
    const galleryImages = service.gallery || [];

    return (
        <>
            <style>{css}</style>

            <div className="sd-page">
                <div className="sd-inner">

                    {/* ── Back link (logic unchanged) ── */}
                    <Link to="/services" className="sd-back" aria-label="Back to all services">
                        <FaArrowLeft /> Back to Services
                    </Link>

                    {/* ── Main card ── */}
                    <article className="sd-card">

                        {/* Cover image with title overlay */}
                        <div className="sd-cover-wrap">
                            <img
                                src={service.image}
                                alt={service.title}
                                className="sd-cover"
                            />
                            <div className="sd-cover-title">
                                {service.icon && <span className="sd-icon" aria-hidden="true">{service.icon}</span>}
                                <h1 className="sd-title">{service.title}</h1>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="sd-body">
                            <div className="gold-divider">
                                <span /><FaStar /><span />
                            </div>

                            {/* Price badge (logic unchanged) */}
                            {service.price && (
                                <div className="sd-price-wrap" aria-label={`Price: ${service.price}`}>
                                    <FaTag />
                                    <span className="sd-price">{service.price}</span>
                                </div>
                            )}

                            {/* Description (logic unchanged) */}
                            <p className="sd-desc">{service.description}</p>

                            {/* Gallery (logic unchanged — now with lightbox) */}
                            {galleryImages.length > 0 && (
                                <section aria-label={`${service.title} gallery`}>
                                    <h2 className="sd-gallery-title">
                                        <FaImages style={{ color: 'var(--gold)', fontSize: '0.9rem' }} />
                                        Gallery
                                    </h2>
                                    <div className="sd-gallery-grid">
                                        {galleryImages.map((url, index) => (
                                            <div
                                                key={index}
                                                className="sd-gallery-item"
                                                onClick={() => setLbIndex(index)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && setLbIndex(index)}
                                                aria-label={`View ${service.title} image ${index + 1}`}
                                            >
                                                <img
                                                    src={url}
                                                    alt={`${service.title} ${index + 1}`}
                                                    loading="lazy"
                                                />
                                                <span className="zoom-icon" aria-hidden="true">⊕</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* CTA row */}
                            <div className="sd-cta-row">
                                {/* WhatsApp CTA (logic unchanged) */}
                                <a
                                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="sd-wa-btn"
                                    aria-label={`Enquire about ${service.title} on WhatsApp`}
                                >
                                    <FaWhatsapp style={{ fontSize: '1.2rem' }} />
                                    Enquire About This Service
                                </a>

                                {/* Share button (new feature) */}
                                <button className="sd-share-btn" onClick={handleShare} aria-label="Share this service">
                                    <FaShareAlt />
                                    Share
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Gallery lightbox (new feature) */}
                {lbIndex !== null && (
                    <GalleryLightbox
                        images={galleryImages}
                        startIndex={lbIndex}
                        onClose={() => setLbIndex(null)}
                    />
                )}

                {/* WhatsApp float (unchanged) */}
                <WhatsAppFloat />

                {/* Share toast */}
                <div className={`share-toast${toastVisible ? ' show' : ''}`} role="status" aria-live="polite">
                    Link copied to clipboard
                </div>

                {/* Scroll-to-top */}
                <button
                    className={`scroll-top${showTop ? ' visible' : ''}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            </div>
        </>
    );
};

export default ServiceDetail;