import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaStar, FaTag, FaArrowRight, FaThLarge, FaList } from 'react-icons/fa';
import api from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

const fallbackServices = [
    { _id: '1', title: 'Wedding Decoration', icon: '💍', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', description: 'Stunning floral setups, mandap decoration, and theme-based weddings.', price: 'Starting ₹1,50,000', gallery: [] },
    { _id: '2', title: 'Reception Planning', icon: '🥂', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', description: 'Elegant stage decor, lighting, and seating arrangements.', price: 'Starting ₹80,000', gallery: [] },
    { _id: '3', title: 'Corporate Events', icon: '🏢', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', description: 'Professional setups for conferences, product launches, and award nights.', price: 'Starting ₹2,00,000', gallery: [] },
    { _id: '4', title: 'Birthday Parties', icon: '🎂', image: 'https://images.unsplash.com/photo-1464349153735-7d5b5a7f5a1e?w=400', description: 'Themed decorations, balloon arches, and cake setups.', price: 'Starting ₹25,000', gallery: [] },
];

/* ─────────────────────── CSS ─────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  :root {
    --black:        #0a0a0a;
    --black-mid:    #111111;
    --black-card:   #161616;
    --black-panel:  #1c1c1c;
    --gold:         #c9a84c;
    --gold-light:   #e8c96d;
    --gold-pale:    #f5e6b8;
    --gold-dim:     #8a6f2e;
    --gold-glow:    rgba(201,168,76,0.22);
    --white:        #f5f0e8;
    --white-dim:    rgba(245,240,232,0.55);
    --green-wa:     #25d366;
    --green-wa-dk:  #1da851;
    --shadow-gold:  0 0 40px rgba(201,168,76,0.18);
    --shadow-card:  0 8px 48px rgba(0,0,0,0.65);
    --radius:       18px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .sv-page {
    min-height: 100vh;
    background: var(--black);
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--white);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Ambient glow ── */
  .sv-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 75% 55% at 10% 5%,  rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 55% 65% at 90% 95%, rgba(201,168,76,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.025) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: ambientPulse 10s ease-in-out infinite alternate;
  }
  @keyframes ambientPulse {
    from { opacity: 0.5; }
    to   { opacity: 1;   }
  }

  /* ── Floating particles ── */
  .sv-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .sv-particle  {
    position: absolute; border-radius: 50%; background: var(--gold);
    opacity: 0; animation: floatUp linear infinite;
  }
  @keyframes floatUp {
    0%   { transform: translateY(100vh) scale(0); opacity: 0; }
    10%  { opacity: 0.5; }
    90%  { opacity: 0.2; }
    100% { transform: translateY(-10vh) scale(1.3); opacity: 0; }
  }

  /* ── Inner ── */
  .sv-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 20px 120px;
  }

  /* ── Header ── */
  .sv-header {
    text-align: center;
    margin-bottom: 64px;
    animation: fadeInDown 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sv-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.38em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 18px;
    animation: fadeInDown 0.9s 0.05s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sv-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(2.2rem, 5.5vw, 4rem);
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: 0.04em;
    background: linear-gradient(135deg, var(--gold-pale) 0%, var(--gold) 45%, var(--gold-dim) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: fadeInDown 0.9s 0.12s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sv-subtitle {
    margin-top: 16px;
    font-size: 1.12rem;
    font-weight: 300;
    font-style: italic;
    color: var(--white-dim);
    max-width: 560px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
    animation: fadeInDown 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── Gold divider ── */
  .gold-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: center;
    margin-top: 28px;
    animation: fadeInDown 0.9s 0.28s cubic-bezier(0.16,1,0.3,1) both;
  }
  .gold-divider span { display: block; height: 1px; width: 80px; background: linear-gradient(90deg, transparent, var(--gold), transparent); }
  .gold-divider svg  { color: var(--gold); font-size: 0.8rem; }

  /* ── Controls row ── */
  .sv-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 36px;
    animation: fadeInDown 0.8s 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* count badge */
  .sv-count {
    font-family: 'Cinzel', serif;
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--gold-dim);
  }
  .sv-count strong { color: var(--gold); }

  /* view toggle */
  .sv-toggle {
    display: flex;
    gap: 6px;
  }
  .sv-toggle-btn {
    background: transparent;
    border: 1px solid rgba(201,168,76,0.2);
    color: var(--gold-dim);
    border-radius: 8px;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.25s, border-color 0.25s, color 0.25s;
  }
  .sv-toggle-btn.active,
  .sv-toggle-btn:hover {
    background: rgba(201,168,76,0.12);
    border-color: rgba(201,168,76,0.5);
    color: var(--gold);
  }

  /* ── Skeleton ── */
  .sv-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .sv-skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .sv-skeleton-grid { grid-template-columns: repeat(3, 1fr); } }

  .sv-skeleton-card {
    border-radius: var(--radius);
    overflow: hidden;
    background: var(--black-card);
    border: 1px solid rgba(201,168,76,0.08);
  }
  .sv-sk-img {
    width: 100%; aspect-ratio: 16/9;
    background: linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .sv-sk-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
  .sv-sk-line {
    height: 11px; border-radius: 6px;
    background: linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .sv-sk-line.short { width: 50%; }
  .sv-sk-line.xshort { width: 35%; }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Grid layout ── */
  .sv-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .sv-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .sv-grid { grid-template-columns: repeat(3, 1fr); } }

  /* list layout */
  .sv-grid.list-view {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* ── Service card ── */
  .sv-card {
    background: var(--black-card);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    display: flex;
    flex-direction: column;
    position: relative;
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1),
                border-color 0.45s,
                box-shadow 0.45s;
    animation: cardReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sv-card:hover {
    transform: translateY(-8px) scale(1.012);
    border-color: rgba(201,168,76,0.48);
    box-shadow: var(--shadow-gold), var(--shadow-card);
  }

  /* staggered delays */
  .sv-card:nth-child(1) { animation-delay: 0.05s; }
  .sv-card:nth-child(2) { animation-delay: 0.10s; }
  .sv-card:nth-child(3) { animation-delay: 0.15s; }
  .sv-card:nth-child(4) { animation-delay: 0.20s; }
  .sv-card:nth-child(5) { animation-delay: 0.25s; }
  .sv-card:nth-child(6) { animation-delay: 0.30s; }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }

  /* gold shimmer overlay */
  .sv-card::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    border-radius: inherit;
  }
  .sv-card:hover::after { opacity: 1; }

  /* corner accent */
  .sv-card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 52px; height: 52px;
    background: linear-gradient(225deg, rgba(201,168,76,0.3) 0%, transparent 60%);
    border-radius: 0 0 0 52px;
    opacity: 0;
    transition: opacity 0.4s;
    z-index: 2;
  }
  .sv-card:hover::before { opacity: 1; }

  /* ── Card image ── */
  .sv-card-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/9;
    flex-shrink: 0;
  }
  .sv-card-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .sv-card:hover .sv-card-img { transform: scale(1.07); }

  /* image overlay gradient */
  .sv-card-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 55%);
    pointer-events: none;
  }

  /* icon badge on image */
  .sv-card-icon-badge {
    position: absolute;
    bottom: 12px; left: 14px;
    z-index: 3;
    font-size: 2rem;
    line-height: 1;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.8));
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .sv-card:hover .sv-card-icon-badge { transform: scale(1.18) rotate(-5deg); }

  /* ── Card body ── */
  .sv-card-body {
    padding: 20px 22px 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 10px;
  }

  .sv-card-title {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--gold-light);
    transition: color 0.3s;
  }
  .sv-card:hover .sv-card-title { color: var(--gold-pale); }

  .sv-card-desc {
    font-size: 0.93rem;
    font-weight: 300;
    line-height: 1.65;
    color: var(--white-dim);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .sv-card-price {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'Cinzel', serif;
    font-size: 0.78rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    color: var(--gold);
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 100px;
    padding: 5px 14px;
    width: fit-content;
  }
  .sv-card-price svg { font-size: 0.7rem; }

  /* ── Card actions ── */
  .sv-card-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 6px;
  }

  .sv-details-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px 16px;
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 100px;
    color: var(--gold);
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    text-decoration: none;
    background: transparent;
    transition: background 0.3s, border-color 0.3s, color 0.3s, transform 0.3s;
    position: relative;
    overflow: hidden;
  }
  .sv-details-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .sv-details-btn:hover {
    border-color: var(--gold);
    color: var(--black);
    transform: translateY(-1px);
  }
  .sv-details-btn:hover::before { opacity: 1; }
  .sv-details-btn span, .sv-details-btn svg { position: relative; z-index: 1; }

  .sv-wa-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 11px 18px;
    background: linear-gradient(135deg, var(--green-wa) 0%, var(--green-wa-dk) 100%);
    color: #fff;
    border: none;
    border-radius: 100px;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(37,211,102,0.25);
    transition: transform 0.3s, box-shadow 0.3s, filter 0.3s;
    white-space: nowrap;
  }
  .sv-wa-btn:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 26px rgba(37,211,102,0.42);
    filter: brightness(1.07);
  }

  /* ── List view card adjustments ── */
  .list-view .sv-card {
    flex-direction: row;
    align-items: stretch;
    max-height: 160px;
  }
  .list-view .sv-card-img-wrap {
    width: 200px;
    flex-shrink: 0;
    aspect-ratio: unset;
  }
  .list-view .sv-card-body { padding: 18px 22px; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 8px; }
  .list-view .sv-card-title { flex: 100%; font-size: 1rem; }
  .list-view .sv-card-desc  { flex: 1; -webkit-line-clamp: 1; }
  .list-view .sv-card-price { flex-shrink: 0; }
  .list-view .sv-card-actions { flex: 100%; padding-top: 0; }

  @media (max-width: 600px) {
    .list-view .sv-card { flex-direction: column; max-height: none; }
    .list-view .sv-card-img-wrap { width: 100%; aspect-ratio: 16/9; }
  }

  /* ── Empty state ── */
  .sv-empty {
    text-align: center;
    padding: 80px 20px;
    animation: fadeInDown 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  .sv-empty-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 20px;
    animation: emptyFloat 3s ease-in-out infinite;
    color: var(--gold-dim);
  }
  @keyframes emptyFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-14px); }
  }
  .sv-empty-title { font-family: 'Cinzel', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 10px; }
  .sv-empty-sub   { color: var(--white-dim); font-style: italic; }

  /* ── Scroll-to-top ── */
  .scroll-top {
    position: fixed;
    bottom: 90px; right: 24px; z-index: 50;
    width: 44px; height: 44px; border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black); border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; font-weight: 700;
    box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.4s, transform 0.4s, box-shadow 0.3s;
  }
  .scroll-top.visible { opacity: 1; transform: translateY(0); }
  .scroll-top:hover   { box-shadow: 0 6px 30px rgba(201,168,76,0.65); transform: translateY(-3px); }

  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    .sv-inner { padding: 36px 14px 100px; }
    .sv-controls { flex-direction: column; align-items: flex-start; }
  }
`;

/* ── Particles ── */
const Particles = () => {
    const pts = Array.from({ length: 16 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        dur: Math.random() * 12 + 10,
    }));
    return (
        <div className="sv-particles" aria-hidden="true">
            {pts.map((p) => (
                <span key={p.id} className="sv-particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
            ))}
        </div>
    );
};

/* ── Skeleton ── */
const SkeletonGrid = () => (
    <div className="sv-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
            <div className="sv-skeleton-card" key={i}>
                <div className="sv-sk-img" />
                <div className="sv-sk-body">
                    <div className="sv-sk-line" />
                    <div className="sv-sk-line short" />
                    <div className="sv-sk-line xshort" />
                </div>
            </div>
        ))}
    </div>
);

/* ══════════════════════════════════════════ */
const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('grid');   // 'grid' | 'list'
    const [showTop, setShowTop] = useState(false);

    /* ── Fetch (logic unchanged) ── */
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const res = await api.get('/services');
                setServices(res.data.data);
            } catch (err) {
                console.error('Failed to load services:', err);
                setServices(fallbackServices);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    /* ── Scroll-to-top ── */
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 350);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Fallback logic unchanged ── */
    const displayServices = services.length > 0 ? services : fallbackServices;

    return (
        <>
            <style>{css}</style>

            <div className="sv-page">
                <Particles />

                <div className="sv-inner">

                    {/* ── SEO Header ── */}
                    <header className="sv-header">
                        <p className="sv-eyebrow"><FaStar /> Premium Event Services <FaStar /></p>
                        <h1 className="sv-title">Our Services</h1>
                        <p className="sv-subtitle">
                            We handle everything from A to Z — decoration, planning, photography, and more.
                            Click any service for full details and personalised quotes.
                        </p>
                        <div className="gold-divider">
                            <span /><FaStar /><span />
                        </div>
                    </header>

                    {/* ── Controls ── */}
                    {!loading && (
                        <div className="sv-controls">
                            <p className="sv-count">
                                Showing <strong>{displayServices.length}</strong> service{displayServices.length !== 1 ? 's' : ''}
                            </p>
                            <div className="sv-toggle" role="group" aria-label="View layout">
                                <button
                                    className={`sv-toggle-btn${view === 'grid' ? ' active' : ''}`}
                                    onClick={() => setView('grid')}
                                    title="Grid view"
                                    aria-pressed={view === 'grid'}
                                >
                                    <FaThLarge />
                                </button>
                                <button
                                    className={`sv-toggle-btn${view === 'list' ? ' active' : ''}`}
                                    onClick={() => setView('list')}
                                    title="List view"
                                    aria-pressed={view === 'list'}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Content ── */}
                    <main aria-label="Services listing">
                        {loading ? (
                            <SkeletonGrid />
                        ) : displayServices.length === 0 ? (
                            <div className="sv-empty" role="status">
                                <span className="sv-empty-icon">✨</span>
                                <h2 className="sv-empty-title">Services Coming Soon</h2>
                                <p className="sv-empty-sub">We're preparing something extraordinary. Check back shortly.</p>
                            </div>
                        ) : (
                            <div className={`sv-grid${view === 'list' ? ' list-view' : ''}`}>
                                {displayServices.map((service) => (
                                    <article key={service._id} className="sv-card">

                                        {/* Image */}
                                        <Link to={`/services/${service._id}`} className="sv-card-img-wrap" tabIndex={-1} aria-hidden="true">
                                            <img
                                                src={service.image}
                                                alt={service.title}
                                                className="sv-card-img"
                                                loading="lazy"
                                            />
                                            {service.icon && (
                                                <span className="sv-card-icon-badge" aria-hidden="true">{service.icon}</span>
                                            )}
                                        </Link>

                                        {/* Body */}
                                        <div className="sv-card-body">
                                            <h2 className="sv-card-title">{service.title}</h2>
                                            <p className="sv-card-desc">{service.description}</p>

                                            {service.price && (
                                                <span className="sv-card-price">
                                                    <FaTag />{service.price}
                                                </span>
                                            )}

                                            <div className="sv-card-actions">
                                                {/* View Details — logic unchanged */}
                                                <Link to={`/services/${service._id}`} className="sv-details-btn" aria-label={`View details for ${service.title}`}>
                                                    <span>View Details</span>
                                                    <FaArrowRight style={{ fontSize: '0.65rem' }} />
                                                </Link>

                                                {/* WhatsApp — logic unchanged */}
                                                <a
                                                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi, I'm interested in ${service.title}.`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sv-wa-btn"
                                                    aria-label={`Enquire about ${service.title} on WhatsApp`}
                                                >
                                                    <FaWhatsapp style={{ fontSize: '0.9rem' }} /> Enquire
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </main>
                </div>

                {/* WhatsApp float — unchanged */}
                <WhatsAppFloat />

                {/* Scroll-to-top */}
                <button
                    className={`scroll-top${showTop ? ' visible' : ''}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Scroll to top"
                >↑</button>
            </div>
        </>
    );
};

export default Services;