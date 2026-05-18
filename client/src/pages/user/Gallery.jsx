import { useState, useEffect, useRef } from 'react';
import { getPastEvents } from '../../services/api';
import api from '../../services/api';
import EventCard from '../../components/common/EventCard';
import Lightbox from '../../components/common/Lightbox';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaCalendarAlt, FaImages, FaStar } from 'react-icons/fa';

/* ─── Inline styles (no Tailwind changes to logic, all new CSS-in-JS / <style>) ─── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  :root {
    --black:       #0a0a0a;
    --black-mid:   #111111;
    --black-card:  #161616;
    --gold:        #c9a84c;
    --gold-light:  #e8c96d;
    --gold-pale:   #f5e6b8;
    --gold-dim:    #8a6f2e;
    --white:       #f5f0e8;
    --white-dim:   rgba(245,240,232,0.6);
    --red-del:     #c0392b;
    --shadow-gold: 0 0 30px rgba(201,168,76,0.18);
    --shadow-card: 0 8px 40px rgba(0,0,0,0.6);
  }

  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page shell ── */
  .gallery-page {
    min-height: 100vh;
    background: var(--black);
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--white);
    overflow-x: hidden;
    position: relative;
  }

  /* ── Animated golden noise background ── */
  .gallery-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%, rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at 80% 90%, rgba(201,168,76,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(201,168,76,0.03) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    animation: bgPulse 8s ease-in-out infinite alternate;
  }

  @keyframes bgPulse {
    from { opacity: 0.6; }
    to   { opacity: 1;   }
  }

  /* ── Gold particle dots ── */
  .particles {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  .particle {
    position: absolute;
    border-radius: 50%;
    background: var(--gold);
    opacity: 0;
    animation: floatUp linear infinite;
  }
  @keyframes floatUp {
    0%   { transform: translateY(100vh) scale(0); opacity: 0; }
    10%  { opacity: 0.6; }
    90%  { opacity: 0.3; }
    100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
  }

  /* ── Inner content wrapper ── */
  .gallery-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 60px 20px 100px;
  }

  /* ── Hero header ── */
  .gallery-header {
    text-align: center;
    margin-bottom: 72px;
    animation: fadeInDown 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-32px); }
    to   { opacity: 1; transform: translateY(0);     }
  }

  .gallery-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Cinzel', serif;
    font-size: 0.7rem;
    letter-spacing: 0.35em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 18px;
    animation: fadeInDown 0.9s 0.1s cubic-bezier(0.16,1,0.3,1) both;
  }
  .gallery-eyebrow svg { font-size: 0.9rem; }

  .gallery-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(2.4rem, 6vw, 4.2rem);
    font-weight: 900;
    line-height: 1.1;
    background: linear-gradient(135deg, var(--gold-pale) 0%, var(--gold) 45%, var(--gold-dim) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 0.04em;
    animation: fadeInDown 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }

  .gallery-subtitle {
    margin-top: 16px;
    font-size: 1.15rem;
    font-weight: 300;
    font-style: italic;
    color: var(--white-dim);
    letter-spacing: 0.02em;
    animation: fadeInDown 0.9s 0.3s cubic-bezier(0.16,1,0.3,1) both;
  }

  /* ── Gold divider ── */
  .gold-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    justify-content: center;
    margin-top: 28px;
    animation: fadeInDown 0.9s 0.4s cubic-bezier(0.16,1,0.3,1) both;
  }
  .gold-divider span {
    display: block;
    height: 1px;
    width: 80px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }
  .gold-divider svg { color: var(--gold); font-size: 0.85rem; }

  /* ── Stats row ── */
  .stats-row {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 40px;
    flex-wrap: wrap;
    animation: fadeInDown 0.9s 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }
  .stat-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.22);
    border-radius: 100px;
    padding: 8px 20px;
    font-size: 0.82rem;
    font-family: 'Cinzel', serif;
    letter-spacing: 0.12em;
    color: var(--gold-light);
    text-transform: uppercase;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
  }
  .stat-pill:hover {
    background: rgba(201,168,76,0.16);
    border-color: rgba(201,168,76,0.5);
    transform: translateY(-2px);
  }
  .stat-pill svg { font-size: 0.9rem; }

  /* ── Loading skeleton ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .skeleton-grid { grid-template-columns: repeat(3, 1fr); } }

  .skeleton-card {
    border-radius: 16px;
    overflow: hidden;
    background: var(--black-card);
    border: 1px solid rgba(201,168,76,0.1);
  }
  .skeleton-img {
    width: 100%;
    aspect-ratio: 4/3;
    background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .skeleton-body { padding: 20px; }
  .skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-bottom: 10px;
  }
  .skeleton-line.short { width: 55%; }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Events grid ── */
  .events-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .events-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .events-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Event card wrapper ── */
  .event-card-wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: var(--black-card);
    border: 1px solid rgba(201,168,76,0.12);
    box-shadow: var(--shadow-card);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1),
                border-color 0.45s,
                box-shadow 0.45s;
    cursor: pointer;
    animation: cardReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  .event-card-wrap:hover {
    transform: translateY(-8px) scale(1.012);
    border-color: rgba(201,168,76,0.5);
    box-shadow: var(--shadow-gold), var(--shadow-card);
  }

  /* staggered entrance */
  .event-card-wrap:nth-child(1)  { animation-delay: 0.05s; }
  .event-card-wrap:nth-child(2)  { animation-delay: 0.10s; }
  .event-card-wrap:nth-child(3)  { animation-delay: 0.15s; }
  .event-card-wrap:nth-child(4)  { animation-delay: 0.20s; }
  .event-card-wrap:nth-child(5)  { animation-delay: 0.25s; }
  .event-card-wrap:nth-child(6)  { animation-delay: 0.30s; }
  .event-card-wrap:nth-child(7)  { animation-delay: 0.35s; }
  .event-card-wrap:nth-child(8)  { animation-delay: 0.40s; }
  .event-card-wrap:nth-child(9)  { animation-delay: 0.45s; }

  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1);    }
  }

  /* ── Gold shimmer overlay on hover ── */
  .event-card-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
  }
  .event-card-wrap:hover::after { opacity: 1; }

  /* ── Corner accent ── */
  .event-card-wrap::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 48px; height: 48px;
    background: linear-gradient(135deg, rgba(201,168,76,0.35) 0%, transparent 60%);
    border-radius: 0 0 48px 0;
    opacity: 0;
    transition: opacity 0.4s;
    z-index: 2;
  }
  .event-card-wrap:hover::before { opacity: 1; }

  /* ── Delete button ── */
  .delete-btn {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 10;
    background: var(--red-del);
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    cursor: pointer;
    opacity: 0;
    transform: scale(0.7) rotate(-15deg);
    transition: opacity 0.3s, transform 0.3s, background 0.2s;
    box-shadow: 0 4px 14px rgba(192,57,43,0.5);
  }
  .event-card-wrap:hover .delete-btn {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  .delete-btn:hover {
    background: #e74c3c;
    transform: scale(1.15) rotate(0deg) !important;
  }

  /* ── Empty state ── */
  .empty-state {
    text-align: center;
    padding: 100px 20px;
    animation: fadeInDown 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  .empty-icon {
    font-size: 4rem;
    color: var(--gold-dim);
    margin-bottom: 24px;
    display: block;
    animation: emptyFloat 3s ease-in-out infinite;
  }
  @keyframes emptyFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-12px); }
  }
  .empty-title {
    font-family: 'Cinzel', serif;
    font-size: 1.6rem;
    color: var(--gold);
    margin-bottom: 12px;
  }
  .empty-sub {
    font-size: 1rem;
    color: var(--white-dim);
    font-style: italic;
  }

  /* ── Scroll-to-top button ── */
  .scroll-top {
    position: fixed;
    bottom: 90px;
    right: 24px;
    z-index: 50;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 700;
    box-shadow: 0 4px 20px rgba(201,168,76,0.4);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.4s, transform 0.4s;
  }
  .scroll-top.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .scroll-top:hover {
    box-shadow: 0 6px 28px rgba(201,168,76,0.65);
    transform: translateY(-3px);
  }

  /* ── Responsive tweaks ── */
  @media (max-width: 480px) {
    .gallery-inner { padding: 40px 14px 80px; }
    .stats-row { gap: 12px; }
    .stat-pill { font-size: 0.72rem; padding: 6px 14px; }
  }
`;

/* ── Floating particles helper ── */
const Particles = () => {
    const particles = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: Math.random() * 14 + 10,
    }));
    return (
        <div className="particles" aria-hidden="true">
            {particles.map((p) => (
                <span
                    key={p.id}
                    className="particle"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
};

/* ── Skeleton loader ── */
const SkeletonGrid = () => (
    <div className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
            <div className="skeleton-card" key={i}>
                <div className="skeleton-img" />
                <div className="skeleton-body">
                    <div className="skeleton-line" />
                    <div className="skeleton-line short" />
                </div>
            </div>
        ))}
    </div>
);

/* ══════════════════════════════════════════ */
const Gallery = () => {
    const [events, setEvents] = useState([]);
    const [lightboxEvent, setLightboxEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTop, setShowTop] = useState(false);
    const { user } = useAuth();

    /* ── Fetch events ── */
    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await getPastEvents();
            setEvents(res.data.data);
        } catch (err) {
            console.error('Failed to load past events:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    /* ── Scroll-to-top visibility ── */
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Delete handler (unchanged logic) ── */
    const handleDelete = async (id) => {
        if (window.confirm('Delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <>
            {/* Inject CSS */}
            <style>{css}</style>

            <div className="gallery-page">
                <Particles />

                <div className="gallery-inner">

                    {/* ── SEO-friendly header ── */}
                    <header className="gallery-header">
                        <p className="gallery-eyebrow">
                            <FaStar /> Memorable Moments <FaStar />
                        </p>
                        <h1 className="gallery-title">Our Past Events</h1>
                        <p className="gallery-subtitle">
                            Relive the magic — curated highlights from every celebration we've crafted
                        </p>
                        <div className="gold-divider">
                            <span />
                            <FaStar />
                            <span />
                        </div>

                        {/* Stats pills */}
                        {!loading && events.length > 0 && (
                            <div className="stats-row">
                                <div className="stat-pill">
                                    <FaImages />
                                    {events.length} Events
                                </div>
                                <div className="stat-pill">
                                    <FaCalendarAlt />
                                    Curated Gallery
                                </div>
                                <div className="stat-pill">
                                    <FaStar />
                                    Premium Memories
                                </div>
                            </div>
                        )}
                    </header>

                    {/* ── Main content ── */}
                    <main aria-label="Past events gallery">
                        {loading ? (
                            <SkeletonGrid />
                        ) : events.length === 0 ? (
                            <div className="empty-state" role="status">
                                <span className="empty-icon"><FaImages /></span>
                                <h2 className="empty-title">No Events Yet</h2>
                                <p className="empty-sub">
                                    Our upcoming events will be showcased here. Stay tuned for unforgettable moments.
                                </p>
                            </div>
                        ) : (
                            <div className="events-grid">
                                {events.map((event) => (
                                    <div
                                        key={event._id}
                                        className="event-card-wrap"
                                        role="article"
                                        aria-label={event.title || 'Past event'}
                                    >
                                        <EventCard
                                            event={event}
                                            onOpen={() => setLightboxEvent(event)}
                                        />

                                        {/* Admin delete — logic unchanged */}
                                        {user && (
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(event._id); }}
                                                title="Delete event"
                                                aria-label="Delete this event"
                                            >
                                                <FaTrash />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>

                {/* ── Lightbox — unchanged ── */}
                {lightboxEvent && (
                    <Lightbox event={lightboxEvent} onClose={() => setLightboxEvent(null)} />
                )}

                <WhatsAppFloat />

                {/* ── Scroll-to-top button ── */}
                <button
                    className={`scroll-top${showTop ? ' visible' : ''}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Scroll to top"
                    title="Back to top"
                >
                    ↑
                </button>
            </div>
        </>
    );
};

export default Gallery;