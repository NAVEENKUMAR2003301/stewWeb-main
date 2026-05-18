import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight, FaStar, FaClock, FaTicketAlt } from 'react-icons/fa';
import api from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ─────────────────────── CSS ─────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&display=swap');

  :root {
    --black:       #0a0a0a;
    --black-card:  #161616;
    --black-panel: #1c1c1c;
    --gold:        #c9a84c;
    --gold-light:  #e8c96d;
    --gold-pale:   #f5e6b8;
    --gold-dim:    #8a6f2e;
    --white:       #f5f0e8;
    --white-dim:   rgba(245,240,232,0.55);
    --green-wa:    #25d366;
    --green-wa-dk: #1da851;
    --shadow-gold: 0 0 40px rgba(201,168,76,0.18);
    --shadow-card: 0 8px 48px rgba(0,0,0,0.65);
    --radius:      18px;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Page ── */
  .ue-page {
    min-height: 100vh;
    background: var(--black);
    font-family: 'Cormorant Garamond', Georgia, serif;
    color: var(--white);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Ambient glow ── */
  .ue-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 75% 55% at 10% 5%,  rgba(201,168,76,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 55% 65% at 90% 95%, rgba(201,168,76,0.05) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
    animation: ambientPulse 10s ease-in-out infinite alternate;
  }
  @keyframes ambientPulse {
    from { opacity: 0.5; }
    to   { opacity: 1; }
  }

  /* ── Particles ── */
  .ue-particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
  .ue-particle  {
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
  .ue-inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 56px 20px 120px;
  }

  /* ── Header ── */
  .ue-header {
    text-align: center;
    margin-bottom: 64px;
  }
  .ue-eyebrow {
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
  .ue-title {
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
  .ue-subtitle {
    margin-top: 16px;
    font-size: 1.12rem;
    font-weight: 300;
    font-style: italic;
    color: var(--white-dim);
    max-width: 520px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
    animation: fadeInDown 0.9s 0.2s cubic-bezier(0.16,1,0.3,1) both;
  }
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

  /* ── Live countdown ticker ── */
  .ue-ticker {
    display: flex;
    justify-content: center;
    margin-top: 32px;
    animation: fadeInDown 0.9s 0.35s cubic-bezier(0.16,1,0.3,1) both;
  }
  .ue-ticker-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(201,168,76,0.08);
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 100px;
    padding: 9px 22px;
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold-light);
  }
  .ue-ticker-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold);
    animation: dotPulse 1.4s ease-in-out infinite;
  }
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }

  /* ── Skeleton ── */
  .ue-skeleton-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .ue-skeleton-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .ue-skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
  .ue-sk-card { border-radius: var(--radius); overflow: hidden; background: var(--black-card); border: 1px solid rgba(201,168,76,0.08); }
  .ue-sk-img  {
    width: 100%; aspect-ratio: 16/9;
    background: linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .ue-sk-body { padding: 20px; display: flex; flex-direction: column; gap: 10px; }
  .ue-sk-line {
    height: 11px; border-radius: 6px;
    background: linear-gradient(90deg, #181818 25%, #222 50%, #181818 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .ue-sk-line.short  { width: 55%; }
  .ue-sk-line.xshort { width: 38%; }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* ── Events grid ── */
  .ue-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 28px;
  }
  @media (min-width: 640px)  { .ue-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .ue-grid { grid-template-columns: repeat(3, 1fr); } }

  /* ── Event card ── */
  .ue-card {
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
  .ue-card:hover {
    transform: translateY(-8px) scale(1.012);
    border-color: rgba(201,168,76,0.48);
    box-shadow: var(--shadow-gold), var(--shadow-card);
  }
  .ue-card:nth-child(1) { animation-delay: 0.05s; }
  .ue-card:nth-child(2) { animation-delay: 0.10s; }
  .ue-card:nth-child(3) { animation-delay: 0.15s; }
  .ue-card:nth-child(4) { animation-delay: 0.20s; }
  .ue-card:nth-child(5) { animation-delay: 0.25s; }
  .ue-card:nth-child(6) { animation-delay: 0.30s; }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(32px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  .ue-card::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 55%);
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
    border-radius: inherit;
  }
  .ue-card:hover::after { opacity: 1; }
  .ue-card::before {
    content: '';
    position: absolute; top: 0; right: 0;
    width: 52px; height: 52px;
    background: linear-gradient(225deg, rgba(201,168,76,0.28) 0%, transparent 60%);
    border-radius: 0 0 0 52px;
    opacity: 0; transition: opacity 0.4s; z-index: 2;
  }
  .ue-card:hover::before { opacity: 1; }

  /* ── Card image ── */
  .ue-card-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16/9;
    flex-shrink: 0;
  }
  .ue-card-img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.16,1,0.3,1);
  }
  .ue-card:hover .ue-card-img { transform: scale(1.07); }
  .ue-card-img-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(10,10,10,0.72) 0%, transparent 52%);
    pointer-events: none;
  }

  /* "Upcoming" badge on image */
  .ue-badge {
    position: absolute;
    top: 12px; left: 12px; z-index: 3;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    color: var(--black);
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 100px;
    box-shadow: 0 2px 12px rgba(201,168,76,0.4);
  }

  /* Days-away chip on image */
  .ue-days-chip {
    position: absolute;
    bottom: 12px; right: 12px; z-index: 3;
    background: rgba(10,10,10,0.75);
    border: 1px solid rgba(201,168,76,0.35);
    color: var(--gold-light);
    font-family: 'Cinzel', serif;
    font-size: 0.62rem;
    letter-spacing: 0.14em;
    padding: 4px 12px;
    border-radius: 100px;
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    gap: 5px;
  }

  /* ── Card body ── */
  .ue-card-body {
    padding: 20px 22px 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 10px;
  }

  .ue-card-title {
    font-family: 'Cinzel', serif;
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--gold-light);
    transition: color 0.3s;
    line-height: 1.3;
  }
  .ue-card:hover .ue-card-title { color: var(--gold-pale); }

  .ue-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ue-meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: var(--white-dim);
    font-weight: 300;
  }
  .ue-meta-item svg { color: var(--gold); font-size: 0.75rem; flex-shrink: 0; }

  .ue-card-desc {
    font-size: 0.93rem;
    font-weight: 300;
    line-height: 1.65;
    color: var(--white-dim);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* ── Card actions ── */
  .ue-card-actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 6px;
  }

  .ue-details-btn {
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
    transition: color 0.3s, border-color 0.3s, transform 0.3s;
    position: relative;
    overflow: hidden;
  }
  .ue-details-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dim) 100%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .ue-details-btn:hover { border-color: var(--gold); color: var(--black); transform: translateY(-1px); }
  .ue-details-btn:hover::before { opacity: 1; }
  .ue-details-btn span, .ue-details-btn svg { position: relative; z-index: 1; }

  .ue-wa-btn {
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
  .ue-wa-btn:hover {
    transform: translateY(-2px) scale(1.04);
    box-shadow: 0 8px 26px rgba(37,211,102,0.42);
    filter: brightness(1.07);
  }

  /* ── Empty state ── */
  .ue-empty {
    text-align: center;
    padding: 90px 20px;
    animation: fadeInDown 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  .ue-empty-icon {
    font-size: 4rem;
    display: block;
    color: var(--gold-dim);
    margin-bottom: 22px;
    animation: emptyFloat 3s ease-in-out infinite;
  }
  @keyframes emptyFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-14px); }
  }
  .ue-empty-title { font-family: 'Cinzel', serif; font-size: 1.5rem; color: var(--gold); margin-bottom: 10px; }
  .ue-empty-sub   { color: var(--white-dim); font-style: italic; font-size: 1rem; }

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
    .ue-inner { padding: 36px 14px 100px; }
  }
`;

/* ── Days away helper ── */
const daysAway = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return null;
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
};

/* ── Particles ── */
const Particles = () => {
    const pts = Array.from({ length: 16 }, (_, i) => ({
        id: i, size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        delay: Math.random() * 14,
        dur: Math.random() * 12 + 10,
    }));
    return (
        <div className="ue-particles" aria-hidden="true">
            {pts.map((p) => (
                <span key={p.id} className="ue-particle" style={{ width: p.size, height: p.size, left: `${p.left}%`, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
            ))}
        </div>
    );
};

/* ── Skeleton ── */
const SkeletonGrid = () => (
    <div className="ue-skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
            <div className="ue-sk-card" key={i}>
                <div className="ue-sk-img" />
                <div className="ue-sk-body">
                    <div className="ue-sk-line" />
                    <div className="ue-sk-line short" />
                    <div className="ue-sk-line xshort" />
                </div>
            </div>
        ))}
    </div>
);

/* ══════════════════════════════════════════ */
const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTop, setShowTop] = useState(false);

    /* ── Fetch (logic unchanged) ── */
    useEffect(() => {
        const fetchUpcoming = async () => {
            setLoading(true);
            try {
                const res = await api.get('/events/upcoming');
                setEvents(res.data.data);
            } catch (err) {
                console.error('Failed to load upcoming events:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUpcoming();
    }, []);

    /* ── Scroll-to-top ── */
    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 350);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* ── Enquiry message (logic unchanged) ── */
    const enquiryMessage = (title) =>
        encodeURIComponent(`Hi! I'm interested in the upcoming "${title}" event. Please share details.`);

    return (
        <>
            <style>{css}</style>

            <div className="ue-page">
                <Particles />

                <div className="ue-inner">

                    {/* ── SEO Header ── */}
                    <header className="ue-header">
                        <p className="ue-eyebrow"><FaStar /> Don't Miss Out <FaStar /></p>
                        <h1 className="ue-title">Upcoming Events</h1>
                        <p className="ue-subtitle">
                            Be part of our next celebrations — book your spot and experience the magic first-hand.
                        </p>
                        <div className="gold-divider">
                            <span /><FaStar /><span />
                        </div>

                        {/* Live ticker pill */}
                        {!loading && events.length > 0 && (
                            <div className="ue-ticker">
                                <div className="ue-ticker-pill">
                                    <span className="ue-ticker-dot" />
                                    {events.length} Event{events.length !== 1 ? 's' : ''} Coming Up
                                </div>
                            </div>
                        )}
                    </header>

                    {/* ── Main content ── */}
                    <main aria-label="Upcoming events listing">
                        {loading ? (
                            <SkeletonGrid />
                        ) : events.length === 0 ? (
                            <div className="ue-empty" role="status">
                                <span className="ue-empty-icon"><FaCalendarAlt /></span>
                                <h2 className="ue-empty-title">No Upcoming Events</h2>
                                <p className="ue-empty-sub">Nothing scheduled right now — check back soon for the next big celebration!</p>
                            </div>
                        ) : (
                            <div className="ue-grid">
                                {events.map((event) => {
                                    const chip = daysAway(event.date);
                                    return (
                                        <article key={event._id} className="ue-card">

                                            {/* Image */}
                                            <div className="ue-card-img-wrap">
                                                <img
                                                    src={event.coverImage || event.gallery?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600'}
                                                    alt={event.title}
                                                    className="ue-card-img"
                                                    loading="lazy"
                                                />
                                                {/* Upcoming badge */}
                                                <span className="ue-badge">
                                                    <FaTicketAlt style={{ fontSize: '0.6rem' }} /> Upcoming
                                                </span>
                                                {/* Days-away chip */}
                                                {chip && (
                                                    <span className="ue-days-chip">
                                                        <FaClock style={{ fontSize: '0.6rem' }} />{chip}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Body */}
                                            <div className="ue-card-body">
                                                <h2 className="ue-card-title">{event.title}</h2>

                                                {/* Date + Venue meta (logic unchanged) */}
                                                <div className="ue-card-meta">
                                                    {event.date && (
                                                        <span className="ue-meta-item">
                                                            <FaCalendarAlt />
                                                            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    )}
                                                    {event.venue && (
                                                        <span className="ue-meta-item">
                                                            <FaMapMarkerAlt />{event.venue}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="ue-card-desc">{event.description}</p>

                                                {/* Actions (logic unchanged) */}
                                                <div className="ue-card-actions">
                                                    <Link
                                                        to={`/events/${event._id}`}
                                                        className="ue-details-btn"
                                                        aria-label={`View details for ${event.title}`}
                                                    >
                                                        <span>View Details</span>
                                                        <FaArrowRight style={{ fontSize: '0.65rem' }} />
                                                    </Link>
                                                    <a
                                                        href={`https://wa.me/${whatsappNumber}?text=${enquiryMessage(event.title)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ue-wa-btn"
                                                        aria-label={`Enquire about ${event.title} on WhatsApp`}
                                                    >
                                                        <FaWhatsapp style={{ fontSize: '0.9rem' }} /> Enquire
                                                    </a>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
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

export default UpcomingEvents;