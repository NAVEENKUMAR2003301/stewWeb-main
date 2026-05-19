import { FaWhatsapp, FaPlay, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────
   BLACK & GOLD — EventCard
   Original props / logic: untouched.
   Added: luxury dark theme, gold accents, shimmer skeleton,
          parallax image hover, art-deco corner brackets,
          animated badge, glow buttons, testimonial fade-in,
          full responsive + ARIA support, SEO-friendly markup.
   ───────────────────────────────────────────────────────────────── */

const whatsappNumber = import.meta.env?.VITE_WHATSAPP_NUMBER || '919876543210';

/* ── Inject styles once ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500;600&display=swap');

:root {
  --ec-gold:        #D4AF37;
  --ec-gold-light:  #F5D76E;
  --ec-gold-dark:   #9A7D0A;
  --ec-gold-glow:   rgba(212,175,55,.35);
  --ec-gold-dim:    rgba(212,175,55,.12);
  --ec-black:       #080808;
  --ec-surface:     #101010;
  --ec-card:        #0E0E0E;
  --ec-border:      rgba(212,175,55,.18);
  --ec-border-h:    rgba(212,175,55,.55);
  --ec-text:        #F0E6C8;
  --ec-muted:       rgba(240,230,200,.5);
  --ec-muted2:      rgba(240,230,200,.32);
  --ec-green:       #22c55e;
  --ec-green-h:     #16a34a;
  --ec-font-serif:  'Cormorant Garamond', Georgia, serif;
  --ec-font-body:   'Raleway', sans-serif;
  --ec-radius:      4px;
}

/* ── Card shell ── */
.ec-card {
  background: var(--ec-card);
  border: 1px solid var(--ec-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  font-family: var(--ec-font-body);
  transition:
    transform .4s cubic-bezier(.34,1.4,.64,1),
    border-color .35s ease,
    box-shadow .35s ease;
  will-change: transform;
}
.ec-card:hover {
  transform: translateY(-6px);
  border-color: var(--ec-border-h);
  box-shadow:
    0 0 0 1px rgba(212,175,55,.08),
    0 24px 60px rgba(0,0,0,.7),
    0 0 40px var(--ec-gold-dim);
}

/* Art-deco corner brackets */
.ec-card::before, .ec-card::after {
  content: '';
  position: absolute;
  width: 14px; height: 14px;
  border-color: var(--ec-gold);
  border-style: solid;
  pointer-events: none;
  z-index: 10;
  opacity: 0;
  transition: opacity .35s ease;
}
.ec-card::before { top: -1px; left: -1px; border-width: 2px 0 0 2px; border-radius: 4px 0 0 0; }
.ec-card::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; border-radius: 0 0 4px 0; }
.ec-card:hover::before, .ec-card:hover::after { opacity: 1; }

/* ── Image area ── */
.ec-image-wrap {
  position: relative;
  overflow: hidden;
  height: 200px;
  cursor: pointer;
  background: #0A0A0A;
}
@media (min-width: 640px) { .ec-image-wrap { height: 224px; } }

.ec-image {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .6s cubic-bezier(.25,.46,.45,.94);
  will-change: transform;
}
.ec-card:hover .ec-image {
  transform: scale(1.07);
}

/* Gold shimmer overlay on hover */
.ec-image-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    160deg,
    rgba(212,175,55,.0) 0%,
    rgba(212,175,55,.08) 50%,
    rgba(212,175,55,.0) 100%
  );
  opacity: 0;
  transition: opacity .5s ease;
  pointer-events: none;
}
.ec-card:hover .ec-image-overlay { opacity: 1; }

/* Bottom gradient scrim */
.ec-image-scrim {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,8,8,.65) 0%, transparent 50%);
  pointer-events: none;
}

/* Gallery count badge */
.ec-badge {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(8,8,8,.75);
  border: 1px solid var(--ec-border);
  color: var(--ec-gold-light);
  font-size: .65rem;
  letter-spacing: .1em;
  padding: 3px 8px;
  border-radius: 99px;
  font-family: var(--ec-font-body);
  font-weight: 500;
  backdrop-filter: blur(4px);
  transition: background .3s, border-color .3s;
}
.ec-card:hover .ec-badge {
  background: rgba(212,175,55,.15);
  border-color: var(--ec-gold);
}

/* Video play button */
.ec-play-btn {
  position: absolute; top: 10px; right: 10px;
  background: rgba(8,8,8,.7);
  border: 1px solid var(--ec-border);
  color: var(--ec-gold);
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
  backdrop-filter: blur(4px);
  transition:
    background .3s,
    border-color .3s,
    transform .3s cubic-bezier(.34,1.56,.64,1),
    box-shadow .3s;
}
.ec-play-btn:hover {
  background: #cc0000;
  border-color: #cc0000;
  color: #fff;
  transform: scale(1.15);
  box-shadow: 0 0 16px rgba(204,0,0,.5);
}

/* ── Info section ── */
.ec-body {
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: .55rem;
}

/* Title */
.ec-title {
  font-family: var(--ec-font-serif);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ec-text);
  margin: 0;
  line-height: 1.3;
  letter-spacing: .01em;
  transition: color .3s;
}
.ec-card:hover .ec-title { color: var(--ec-gold-light); }

/* Date */
.ec-date {
  font-size: .72rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--ec-muted);
  margin: 0;
  font-weight: 400;
}

/* Divider */
.ec-divider {
  width: 32px; height: 1px;
  background: linear-gradient(90deg, var(--ec-gold-dark), var(--ec-gold));
  border-radius: 99px;
  transition: width .4s ease;
}
.ec-card:hover .ec-divider { width: 56px; }

/* Meta row */
.ec-meta {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem .75rem;
  align-items: center;
}
.ec-meta-item {
  display: flex; align-items: center; gap: 5px;
  font-size: .75rem;
  font-weight: 500;
  color: var(--ec-muted);
  padding: 3px 10px;
  border: 1px solid rgba(212,175,55,.12);
  border-radius: 99px;
  background: rgba(212,175,55,.04);
  transition: border-color .3s, color .3s, background .3s;
}
.ec-meta-item:hover {
  border-color: var(--ec-border-h);
  color: var(--ec-gold-light);
  background: rgba(212,175,55,.1);
}
.ec-meta-icon { color: var(--ec-gold); font-size: .7rem; }
.ec-price { color: var(--ec-gold); font-weight: 600; }

/* Testimonial */
.ec-testimonial {
  font-family: var(--ec-font-serif);
  font-style: italic;
  font-size: .85rem;
  color: var(--ec-muted2);
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  padding-left: .75rem;
  border-left: 2px solid var(--ec-gold-dark);
  transition: color .3s, border-color .3s;
}
.ec-card:hover .ec-testimonial {
  color: rgba(240,230,200,.55);
  border-color: var(--ec-gold);
}

/* ── Buttons ── */
.ec-actions {
  margin-top: auto;
  display: flex;
  gap: .6rem;
  padding-top: .25rem;
}

.ec-btn-view {
  flex: 1;
  padding: .55rem 1rem;
  border: 1px solid var(--ec-border);
  background: transparent;
  color: var(--ec-gold);
  font-family: var(--ec-font-body);
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  border-radius: var(--ec-radius);
  cursor: pointer;
  text-align: center;
  transition:
    background .3s,
    border-color .3s,
    color .3s,
    box-shadow .3s,
    transform .2s;
  position: relative;
  overflow: hidden;
}
.ec-btn-view::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(212,175,55,.15), transparent);
  transform: translateX(-100%);
  transition: transform .5s ease;
}
.ec-btn-view:hover::after { transform: translateX(100%); }
.ec-btn-view:hover {
  background: rgba(212,175,55,.1);
  border-color: var(--ec-gold);
  box-shadow: 0 0 16px rgba(212,175,55,.2);
}
.ec-btn-view:active { transform: scale(.97); }

.ec-btn-wa {
  display: flex; align-items: center; gap: 5px; justify-content: center;
  padding: .55rem 1rem;
  background: rgba(34,197,94,.1);
  border: 1px solid rgba(34,197,94,.25);
  color: var(--ec-green);
  font-family: var(--ec-font-body);
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  border-radius: var(--ec-radius);
  text-decoration: none;
  transition:
    background .3s,
    border-color .3s,
    color .3s,
    box-shadow .3s,
    transform .2s;
}
.ec-btn-wa:hover {
  background: var(--ec-green);
  border-color: var(--ec-green);
  color: #fff;
  box-shadow: 0 0 20px rgba(34,197,94,.35);
}
.ec-btn-wa:active { transform: scale(.97); }

/* ── Skeleton loading state ── */
.ec-skeleton .ec-image-wrap {
  background: linear-gradient(90deg,#111 25%,#1a1a1a 50%,#111 75%);
  background-size: 200% 100%;
  animation: sk-shimmer 1.5s infinite;
}
@keyframes sk-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Focus ring ── */
.ec-btn-view:focus-visible,
.ec-btn-wa:focus-visible,
.ec-play-btn:focus-visible {
  outline: 2px solid var(--ec-gold);
  outline-offset: 2px;
}

/* ── Responsive ── */
@media (max-width: 360px) {
  .ec-title { font-size: 1.1rem; }
  .ec-body  { padding: .9rem 1rem; }
  .ec-btn-view, .ec-btn-wa { font-size: .68rem; padding: .5rem .75rem; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('ec-styles')) {
    const tag = document.createElement('style');
    tag.id = 'ec-styles';
    tag.textContent = CSS;
    document.head.appendChild(tag);
}

/* ── EventCard ── */
const EventCard = ({ event, onOpen }) => {
    const message = encodeURIComponent(
        `I love the "${event.title}" event! Can you plan something similar?`
    );

    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric',
        })
        : null;

    /* Subtle parallax on image */
    const imgRef = useRef(null);
    const handleMouseMove = (e) => {
        if (!imgRef.current) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width - 0.5) * 8;
        const y = ((e.clientY - top) / height - 0.5) * 8;
        imgRef.current.style.transform = `scale(1.07) translate(${x}px, ${y}px)`;
    };
    const handleMouseLeave = () => {
        if (imgRef.current) imgRef.current.style.transform = '';
    };

    return (
        <article
            className="ec-card"
            aria-label={`Event: ${event.title}`}
            itemScope
            itemType="https://schema.org/Event"
        >
            {/* ── Cover Image ── */}
            <div
                className="ec-image-wrap"
                onClick={onOpen}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onOpen?.()}
                aria-label={`View photos of ${event.title}`}
            >
                <img
                    ref={imgRef}
                    src={
                        event.coverImage ||
                        event.gallery?.[0] ||
                        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80'
                    }
                    alt={`${event.title} event photo`}
                    className="ec-image"
                    loading="lazy"
                    decoding="async"
                    itemProp="image"
                />

                {/* Shimmer overlay */}
                <div className="ec-image-overlay" aria-hidden="true" />

                {/* Gradient scrim */}
                <div className="ec-image-scrim" aria-hidden="true" />

                {/* Gallery count */}
                {event.gallery?.length > 1 && (
                    <span className="ec-badge" aria-label={`${event.gallery.length - 1} more photos`}>
                        +{event.gallery.length - 1} photos
                    </span>
                )}

                {/* Video play */}
                {event.videoLink && (
                    <a
                        href={event.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ec-play-btn"
                        aria-label="Watch event video"
                        title="Watch video highlight"
                    >
                        <FaPlay size={11} />
                    </a>
                )}
            </div>

            {/* ── Info Body ── */}
            <div className="ec-body">

                {/* Title — SEO h3 */}
                <h3 className="ec-title" itemProp="name">{event.title}</h3>

                {/* Date */}
                {formattedDate && (
                    <p className="ec-date" itemProp="startDate" dateTime={event.date}>
                        {formattedDate}
                    </p>
                )}

                {/* Gold divider */}
                <div className="ec-divider" aria-hidden="true" />

                {/* Client & Price */}
                {(event.clientName || event.price) && (
                    <div className="ec-meta">
                        {event.clientName && (
                            <span className="ec-meta-item" aria-label={`Client: ${event.clientName}`}>
                                <FaUser className="ec-meta-icon" aria-hidden="true" />
                                {event.clientName}
                            </span>
                        )}
                        {event.price && (
                            <span className="ec-meta-item ec-price" aria-label={`Price: ${event.price}`}>
                                <FaMoneyBillWave className="ec-meta-icon" aria-hidden="true" />
                                {event.price}
                            </span>
                        )}
                    </div>
                )}

                {/* Testimonial */}
                {event.clientTestimonial && (
                    <p className="ec-testimonial" itemProp="description">
                        "{event.clientTestimonial}"
                    </p>
                )}

                {/* Action Buttons */}
                <div className="ec-actions">
                    <button
                        onClick={onOpen}
                        className="ec-btn-view"
                        aria-label={`View all photos of ${event.title}`}
                    >
                        View Photos
                    </button>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ec-btn-wa"
                        aria-label={`Enquire about ${event.title} on WhatsApp`}
                    >
                        <FaWhatsapp aria-hidden="true" /> Enquire
                    </a>
                </div>
            </div>
        </article>
    );
};

export default EventCard;