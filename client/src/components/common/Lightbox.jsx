import { useState, useEffect, useRef, useCallback } from 'react';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { FaWhatsapp } from 'react-icons/fa';

/* ─────────────────────────────────────────────────────────────────
   BLACK & GOLD — Lightbox
   Original props / logic: untouched.
   Added: luxury dark overlay, gold accent bar, animated image
          transitions (slide), thumbnail strip, swipe gesture,
          keyboard nav, zoom on click, art-deco header details,
          animated counter pill, loading shimmer, ARIA/SEO support.
   ───────────────────────────────────────────────────────────────── */

const whatsappNumber = import.meta.env?.VITE_WHATSAPP_NUMBER || '919876543210';

/* ── Inject styles once ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Raleway:wght@300;400;500;600&display=swap');

:root {
  --lb-gold:       #D4AF37;
  --lb-gold-light: #F5D76E;
  --lb-gold-dark:  #9A7D0A;
  --lb-gold-glow:  rgba(212,175,55,.35);
  --lb-gold-dim:   rgba(212,175,55,.12);
  --lb-surface:    rgba(8,8,8,.96);
  --lb-bar:        rgba(14,14,14,.98);
  --lb-border:     rgba(212,175,55,.18);
  --lb-border-h:   rgba(212,175,55,.5);
  --lb-text:       #F0E6C8;
  --lb-muted:      rgba(240,230,200,.45);
  --lb-green:      #22c55e;
  --lb-font-serif: 'Cinzel', serif;
  --lb-font-body:  'Raleway', sans-serif;
}

/* ── Backdrop ── */
.lb-root {
  position: fixed; inset: 0; z-index: 100;
  background: var(--lb-surface);
  display: flex; flex-direction: column;
  font-family: var(--lb-font-body);
  animation: lb-fade-in .25s ease both;
  overflow: hidden;
}
@keyframes lb-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Subtle grid texture on backdrop */
.lb-root::before {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(212,175,55,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212,175,55,.025) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
}

/* ── Top Bar ── */
.lb-topbar {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: .85rem 1.25rem;
  background: var(--lb-bar);
  border-bottom: 1px solid var(--lb-border);
  gap: .75rem;
  flex-shrink: 0;
}

/* Gold accent line under topbar */
.lb-topbar::after {
  content: '';
  position: absolute; bottom: -2px; left: 50%; transform: translateX(-50%);
  width: 80px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--lb-gold), transparent);
  border-radius: 99px;
}

/* Close button */
.lb-close {
  width: 38px; height: 38px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--lb-border);
  border-radius: 50%;
  background: transparent;
  color: var(--lb-muted);
  font-size: 1.2rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: color .25s, border-color .25s, background .25s, transform .25s;
}
.lb-close:hover {
  color: var(--lb-gold);
  border-color: var(--lb-gold);
  background: var(--lb-gold-dim);
  transform: rotate(90deg);
}
.lb-close:focus-visible { outline: 2px solid var(--lb-gold); outline-offset: 3px; }

/* Title */
.lb-title {
  font-family: var(--lb-font-serif);
  font-size: clamp(.8rem, 2.5vw, 1rem);
  font-weight: 600;
  color: var(--lb-text);
  letter-spacing: .06em;
  text-align: center;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0;
}

/* WhatsApp enquire button */
.lb-wa {
  display: flex; align-items: center; gap: 6px;
  padding: .48rem 1rem;
  background: rgba(34,197,94,.1);
  border: 1px solid rgba(34,197,94,.25);
  color: var(--lb-green);
  font-family: var(--lb-font-body);
  font-size: .72rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  border-radius: 4px;
  text-decoration: none;
  flex-shrink: 0;
  transition: background .3s, border-color .3s, color .3s, box-shadow .3s;
}
.lb-wa:hover {
  background: var(--lb-green);
  border-color: var(--lb-green);
  color: #fff;
  box-shadow: 0 0 20px rgba(34,197,94,.3);
}
.lb-wa:focus-visible { outline: 2px solid var(--lb-green); outline-offset: 3px; }

/* ── Image Stage ── */
.lb-stage {
  flex: 1;
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 1;
  overflow: hidden;
  padding: 1rem 3.5rem;
}

/* Image wrapper — clips slide animation */
.lb-img-wrap {
  position: relative;
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}

/* The image */
.lb-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 3px;
  border: 1px solid var(--lb-border);
  box-shadow: 0 0 60px rgba(0,0,0,.8), 0 0 0 1px rgba(212,175,55,.06);
  cursor: zoom-in;
  transition:
    transform .35s cubic-bezier(.25,.46,.45,.94),
    opacity .35s ease;
  will-change: transform, opacity;
  user-select: none;
  -webkit-user-drag: none;
}
.lb-img.zoomed {
  cursor: zoom-out;
  transform: scale(1.9);
}
.lb-img.sliding-out-left  { transform: translateX(-6%) scale(.97); opacity: 0; }
.lb-img.sliding-out-right { transform: translateX(6%)  scale(.97); opacity: 0; }
.lb-img.sliding-in-left   { transform: translateX(4%)  scale(.97); opacity: 0; }
.lb-img.sliding-in-right  { transform: translateX(-4%) scale(.97); opacity: 0; }

/* Loading shimmer overlay */
.lb-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, #0A0A0A 25%, #141414 50%, #0A0A0A 75%);
  background-size: 200% 100%;
  animation: lb-sk 1.4s ease infinite;
  border-radius: 3px;
  display: none;
}
.lb-img-wrap.loading .lb-shimmer { display: block; }
.lb-img-wrap.loading .lb-img     { opacity: 0; }
@keyframes lb-sk {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Nav Buttons ── */
.lb-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 42px; height: 42px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(8,8,8,.7);
  border: 1px solid var(--lb-border);
  border-radius: 50%;
  color: var(--lb-muted);
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 5;
  transition:
    color .25s, border-color .25s, background .25s,
    transform .3s cubic-bezier(.34,1.56,.64,1),
    box-shadow .25s;
  backdrop-filter: blur(6px);
}
.lb-nav.prev { left: .75rem; }
.lb-nav.next { right: .75rem; }
.lb-nav:hover {
  color: var(--lb-gold);
  border-color: var(--lb-gold);
  background: var(--lb-gold-dim);
  box-shadow: 0 0 16px var(--lb-gold-glow);
  transform: translateY(-50%) scale(1.1);
}
.lb-nav:active { transform: translateY(-50%) scale(.95); }
.lb-nav:focus-visible { outline: 2px solid var(--lb-gold); outline-offset: 3px; }

/* ── Counter Pill ── */
.lb-counter {
  position: absolute; bottom: .75rem; left: 50%; transform: translateX(-50%);
  font-family: var(--lb-font-body);
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .16em;
  color: var(--lb-gold);
  background: rgba(8,8,8,.8);
  border: 1px solid var(--lb-border);
  border-radius: 99px;
  padding: 4px 14px;
  backdrop-filter: blur(6px);
  white-space: nowrap;
  z-index: 5;
}

/* ── Dot Indicators ── */
.lb-dots {
  position: absolute; bottom: .75rem; left: 50%; transform: translateX(-50%);
  display: flex; gap: 6px; align-items: center;
  z-index: 5;
}
.lb-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(212,175,55,.25);
  border: 1px solid rgba(212,175,55,.3);
  cursor: pointer;
  transition: background .3s, transform .3s, border-color .3s;
  padding: 0;
}
.lb-dot.active {
  background: var(--lb-gold);
  border-color: var(--lb-gold);
  transform: scale(1.4);
  box-shadow: 0 0 8px var(--lb-gold-glow);
}
.lb-dot:hover:not(.active) { background: rgba(212,175,55,.5); }

/* ── Thumbnail Strip ── */
.lb-thumbs {
  position: relative; z-index: 2;
  display: flex; gap: 6px;
  padding: .75rem 1rem;
  background: var(--lb-bar);
  border-top: 1px solid var(--lb-border);
  overflow-x: auto;
  scroll-behavior: smooth;
  flex-shrink: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(212,175,55,.3) transparent;
}
.lb-thumbs::-webkit-scrollbar { height: 3px; }
.lb-thumbs::-webkit-scrollbar-track { background: transparent; }
.lb-thumbs::-webkit-scrollbar-thumb { background: rgba(212,175,55,.3); border-radius: 99px; }

.lb-thumb {
  flex-shrink: 0;
  width: 56px; height: 42px;
  border-radius: 3px;
  object-fit: cover;
  cursor: pointer;
  border: 1.5px solid transparent;
  opacity: .45;
  transition: opacity .3s, border-color .3s, transform .3s, box-shadow .3s;
}
.lb-thumb.active {
  border-color: var(--lb-gold);
  opacity: 1;
  box-shadow: 0 0 10px var(--lb-gold-glow);
  transform: scaleY(1.06);
}
.lb-thumb:hover:not(.active) { opacity: .75; border-color: var(--lb-border-h); }

/* ── Bottom Info Bar ── */
.lb-infobar {
  position: relative; z-index: 2;
  display: flex; align-items: center; justify-content: space-between;
  padding: .5rem 1.25rem;
  background: var(--lb-bar);
  border-top: 1px solid var(--lb-border);
  flex-shrink: 0;
  gap: 1rem;
}
.lb-info-left {
  display: flex; align-items: center; gap: .75rem;
  font-size: .7rem;
  color: var(--lb-muted);
  letter-spacing: .1em;
  text-transform: uppercase;
}
.lb-info-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--lb-gold); flex-shrink: 0;
}
.lb-hint {
  font-size: .65rem; letter-spacing: .08em;
  color: rgba(240,230,200,.22);
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .lb-stage { padding: .5rem 2.8rem; }
  .lb-nav   { width: 34px; height: 34px; font-size: 1rem; }
  .lb-nav.prev { left: .3rem; }
  .lb-nav.next { right: .3rem; }
  .lb-thumb { width: 44px; height: 34px; }
  .lb-wa span { display: none; }
}
`;

if (typeof document !== 'undefined' && !document.getElementById('lb-styles')) {
    const s = document.createElement('style');
    s.id = 'lb-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
}

/* ── Lightbox ── */
const Lightbox = ({ event, onClose }) => {
    const images = event?.gallery?.length > 0
        ? event.gallery
        : [event?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [imgLoading, setImgLoading] = useState(true);
    const [slideClass, setSlideClass] = useState('');

    const thumbsRef = useRef(null);
    const touchStartX = useRef(null);
    const isAnimating = useRef(false);

    const message = encodeURIComponent(
        `Hi! I saw the "${event?.title}" event and I'm interested in a similar setup.`
    );

    /* ── Navigate with slide animation ── */
    const goTo = useCallback((direction) => {
        if (isAnimating.current || zoomed) return;
        isAnimating.current = true;

        const outClass = direction === 'next' ? 'sliding-out-left' : 'sliding-out-right';
        const inClass = direction === 'next' ? 'sliding-in-left' : 'sliding-in-right';

        setSlideClass(outClass);
        setImgLoading(true);

        setTimeout(() => {
            setCurrentIndex((prev) => {
                const next = direction === 'next'
                    ? (prev + 1) % images.length
                    : (prev - 1 + images.length) % images.length;
                return next;
            });
            setSlideClass(inClass);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setSlideClass('');
                    isAnimating.current = false;
                });
            });
        }, 220);
    }, [images.length, zoomed]);

    /* ── Keyboard navigation ── */
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') onClose?.();
            if (e.key === 'ArrowRight') goTo('next');
            if (e.key === 'ArrowLeft') goTo('prev');
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [goTo, onClose]);

    /* Lock body scroll */
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    /* Scroll active thumbnail into view */
    useEffect(() => {
        const strip = thumbsRef.current;
        if (!strip) return;
        const active = strip.children[currentIndex];
        if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }, [currentIndex]);

    /* ── Touch / swipe ── */
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? 'next' : 'prev');
        touchStartX.current = null;
    };

    const showThumbs = images.length > 1;
    const showDots = images.length > 1 && images.length <= 8;
    const showCount = images.length > 8;

    return (
        <div
            className="lb-root"
            role="dialog"
            aria-modal="true"
            aria-label={`Photo gallery: ${event?.title}`}
        >
            {/* ── Top Bar ── */}
            <header className="lb-topbar">
                <button
                    className="lb-close"
                    onClick={onClose}
                    aria-label="Close gallery"
                >
                    <IoClose />
                </button>

                <h2 className="lb-title">{event?.title}</h2>

                <a
                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lb-wa"
                    aria-label={`Enquire about ${event?.title} on WhatsApp`}
                >
                    <FaWhatsapp aria-hidden="true" />
                    <span>Enquire</span>
                </a>
            </header>

            {/* ── Image Stage ── */}
            <main
                className="lb-stage"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                aria-live="polite"
                aria-label="Event photo viewer"
            >
                {/* Prev */}
                {images.length > 1 && (
                    <button
                        className="lb-nav prev"
                        onClick={() => goTo('prev')}
                        aria-label="Previous photo"
                    >
                        <IoChevronBack />
                    </button>
                )}

                {/* Image */}
                <div className={`lb-img-wrap${imgLoading ? ' loading' : ''}`}>
                    <div className="lb-shimmer" aria-hidden="true" />
                    <img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${event?.title} — photo ${currentIndex + 1} of ${images.length}`}
                        className={`lb-img${zoomed ? ' zoomed' : ''}${slideClass ? ` ${slideClass}` : ''}`}
                        onClick={() => setZoomed((z) => !z)}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        draggable={false}
                    />
                </div>

                {/* Next */}
                {images.length > 1 && (
                    <button
                        className="lb-nav next"
                        onClick={() => goTo('next')}
                        aria-label="Next photo"
                    >
                        <IoChevronForward />
                    </button>
                )}

                {/* Dots (≤8 images) */}
                {showDots && (
                    <nav className="lb-dots" aria-label="Photo navigation dots">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                className={`lb-dot${i === currentIndex ? ' active' : ''}`}
                                onClick={() => {
                                    if (i === currentIndex) return;
                                    const dir = i > currentIndex ? 'next' : 'prev';
                                    setCurrentIndex(i);
                                    setSlideClass('');
                                }}
                                aria-label={`Go to photo ${i + 1}`}
                                aria-current={i === currentIndex ? 'true' : undefined}
                            />
                        ))}
                    </nav>
                )}

                {/* Counter pill (>8 images) */}
                {showCount && (
                    <div className="lb-counter" aria-live="polite" aria-atomic="true">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </main>

            {/* ── Thumbnail Strip ── */}
            {showThumbs && (
                <div className="lb-thumbs" ref={thumbsRef} role="tablist" aria-label="Photo thumbnails">
                    {images.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            alt={`Thumbnail ${i + 1}`}
                            className={`lb-thumb${i === currentIndex ? ' active' : ''}`}
                            onClick={() => {
                                if (i === currentIndex) return;
                                setCurrentIndex(i);
                                setImgLoading(true);
                                setZoomed(false);
                                setSlideClass('');
                            }}
                            loading="lazy"
                            decoding="async"
                            role="tab"
                            aria-selected={i === currentIndex}
                            tabIndex={i === currentIndex ? 0 : -1}
                        />
                    ))}
                </div>
            )}

            {/* ── Info Bar ── */}
            <footer className="lb-infobar">
                <div className="lb-info-left">
                    {event?.date && (
                        <>
                            <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            <span className="lb-info-dot" aria-hidden="true" />
                        </>
                    )}
                    {event?.clientName && <span>{event.clientName}</span>}
                </div>
                <span className="lb-hint">
                    {zoomed ? 'Click to zoom out' : images.length > 1 ? '← → keys or swipe' : 'Click to zoom'}
                </span>
            </footer>
        </div>
    );
};

export default Lightbox;