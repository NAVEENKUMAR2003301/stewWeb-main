import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/upcoming', label: 'Upcoming' },
    { to: '/contact', label: 'Contact' },
];

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
const whatsappMessage = encodeURIComponent('Hi! I would like to know more about your event services.');

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const location = useLocation();
    const menuRef = useRef(null);

    /* Scrolled shadow */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    /* Close mobile menu on route change */
    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    /* Body scroll lock */
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    /* Close on outside click */
    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600&display=swap');

                /* ── Header ── */
                .nb-header {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(10, 10, 10, 0.92);
                    border-bottom: 1px solid #1a1a1a;
                    backdrop-filter: saturate(1.4) blur(16px);
                    -webkit-backdrop-filter: saturate(1.4) blur(16px);
                    transition: box-shadow 0.3s ease, border-color 0.3s ease;
                    font-family: 'Montserrat', sans-serif;
                }
                .nb-header.scrolled {
                    box-shadow: 0 4px 40px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(201,168,76,0.15);
                    border-color: rgba(201,168,76,0.12);
                }

                /* ── Inner bar ── */
                .nb-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 24px;
                    height: 64px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                }

                /* ── Brand ── */
                .nb-brand {
                    display: flex; flex-direction: column; gap: 1px;
                    text-decoration: none; flex-shrink: 0;
                }
                .nb-brand-tag {
                    font-size: 7px; letter-spacing: 2.5px; text-transform: uppercase;
                    color: rgba(201,168,76,0.7); line-height: 1;
                }
                .nb-brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.35rem; font-weight: 700; line-height: 1;
                    background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* ── Desktop nav ── */
                .nb-desktop-nav {
                    display: none;
                    align-items: center;
                    gap: 2px;
                }
                @media (min-width: 1024px) { .nb-desktop-nav { display: flex; } }

                .nb-link {
                    position: relative;
                    padding: 8px 14px;
                    font-size: 0.72rem; font-weight: 500;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    color: #888070; text-decoration: none;
                    transition: color 0.22s ease;
                    border-radius: 2px;
                }
                .nb-link::after {
                    content: '';
                    position: absolute; bottom: 4px; left: 14px; right: 14px; height: 1px;
                    background: linear-gradient(90deg, #C9A84C, #E8C97A);
                    transform: scaleX(0); transform-origin: left;
                    transition: transform 0.25s ease;
                }
                .nb-link:hover { color: #E8C97A; }
                .nb-link:hover::after { transform: scaleX(1); }
                .nb-link.active { color: #C9A84C; }
                .nb-link.active::after { transform: scaleX(1); }

                /* Admin pill */
                .nb-admin-link {
                    padding: 6px 14px;
                    border: 1px solid rgba(201,168,76,0.25);
                    border-radius: 3px;
                    font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 2px; text-transform: uppercase;
                    color: #C9A84C; text-decoration: none;
                    transition: all 0.22s ease;
                    margin-left: 4px;
                }
                .nb-admin-link:hover, .nb-admin-link.active {
                    background: rgba(201,168,76,0.08);
                    border-color: rgba(201,168,76,0.5);
                    color: #E8C97A;
                }

                /* WhatsApp button */
                .nb-wa-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: linear-gradient(135deg, #1a2e1a, #1f3a1f);
                    border: 1px solid rgba(37,211,102,0.3);
                    color: #25d366; padding: 8px 18px;
                    border-radius: 3px;
                    font-size: 0.68rem; font-weight: 600;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    text-decoration: none; margin-left: 8px;
                    transition: all 0.25s ease; white-space: nowrap;
                }
                .nb-wa-btn:hover {
                    background: #25d366; color: #000;
                    box-shadow: 0 4px 20px rgba(37,211,102,0.25);
                    transform: translateY(-1px);
                }

                /* ── Hamburger ── */
                .nb-toggle {
                    display: flex; align-items: center; justify-content: center;
                    width: 38px; height: 38px;
                    border: 1px solid #242424; border-radius: 3px;
                    background: transparent; color: #888070;
                    cursor: pointer; transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                .nb-toggle:hover {
                    border-color: rgba(201,168,76,0.4);
                    color: #C9A84C; background: rgba(201,168,76,0.06);
                }
                @media (min-width: 1024px) { .nb-toggle { display: none; } }

                /* ── Gold progress bar (scroll indicator) ── */
                .nb-progress {
                    position: absolute; bottom: -1px; left: 0;
                    height: 1px;
                    background: linear-gradient(90deg, #C9A84C, #E8C97A, #A0792A);
                    transition: width 0.1s linear;
                    pointer-events: none;
                }

                /* ── Mobile dropdown (inline, not drawer) ── */
                .nb-mobile-menu {
                    background: #0f0f0f;
                    border-top: 1px solid #1a1a1a;
                    overflow: hidden;
                    max-height: 0;
                    transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
                    opacity: 0;
                    pointer-events: none;
                }
                .nb-mobile-menu.open {
                    max-height: 600px; opacity: 1; pointer-events: auto;
                }
                @media (min-width: 1024px) { .nb-mobile-menu { display: none; } }

                .nb-mobile-inner { padding: 16px 20px 24px; }

                .nb-mobile-link {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 13px 0;
                    border-bottom: 1px solid #161616;
                    font-size: 0.75rem; font-weight: 500;
                    letter-spacing: 2px; text-transform: uppercase;
                    color: #666058; text-decoration: none;
                    transition: all 0.2s ease;
                }
                .nb-mobile-link:hover { color: #E8C97A; padding-left: 6px; }
                .nb-mobile-link.active { color: #C9A84C; }
                .nb-mobile-link-arrow { font-size: 0.65rem; color: #C9A84C; opacity: 0; transition: opacity 0.2s; }
                .nb-mobile-link:hover .nb-mobile-link-arrow,
                .nb-mobile-link.active .nb-mobile-link-arrow { opacity: 1; }

                .nb-mobile-wa {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    width: 100%; margin-top: 20px; padding: 14px;
                    background: linear-gradient(135deg, #1a2e1a, #1f3a1f);
                    border: 1px solid rgba(37,211,102,0.3); border-radius: 3px;
                    color: #25d366;
                    font-size: 0.73rem; font-weight: 600;
                    letter-spacing: 1.5px; text-transform: uppercase;
                    text-decoration: none; transition: all 0.25s ease;
                }
                .nb-mobile-wa:hover { background: #25d366; color: #000; }
            `}</style>

            <header ref={menuRef} className={`nb-header${scrolled ? ' scrolled' : ''}`} role="banner">
                {/* Scroll progress bar */}
                <ScrollProgressBar />

                <div className="nb-inner">
                    {/* Brand */}
                    <Link to="/" className="nb-brand" aria-label="EventPlanner – Go to homepage">
                        <span className="nb-brand-tag">✦ Event Management</span>
                        <span className="nb-brand-name">EventPlanner</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="nb-desktop-nav" aria-label="Main navigation">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                className={({ isActive }) => `nb-link${isActive ? ' active' : ''}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        {user && (
                            <NavLink
                                to="/admin/dashboard"
                                className={({ isActive }) => `nb-admin-link${isActive ? ' active' : ''}`}
                                aria-label="Go to Admin Dashboard"
                            >
                                ⚙ Admin
                            </NavLink>
                        )}
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nb-wa-btn"
                            aria-label="Chat with us on WhatsApp"
                        >
                            <FaWhatsapp size={14} aria-hidden="true" />
                            Chat
                        </a>
                    </nav>

                    {/* Hamburger */}
                    <button
                        className="nb-toggle"
                        onClick={() => setMenuOpen((o) => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        aria-controls="nb-mobile-menu"
                    >
                        {menuOpen ? <HiX size={18} /> : <HiMenuAlt3 size={18} />}
                    </button>
                </div>

                {/* Mobile dropdown */}
                <div
                    id="nb-mobile-menu"
                    className={`nb-mobile-menu${menuOpen ? ' open' : ''}`}
                    aria-hidden={!menuOpen}
                >
                    <div className="nb-mobile-inner">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/'}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `nb-mobile-link${isActive ? ' active' : ''}`}
                                aria-current={location.pathname === link.to ? 'page' : undefined}
                            >
                                {link.label}
                                <span className="nb-mobile-link-arrow" aria-hidden="true">›</span>
                            </NavLink>
                        ))}
                        {user && (
                            <NavLink
                                to="/admin/dashboard"
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) => `nb-mobile-link${isActive ? ' active' : ''}`}
                            >
                                ⚙ Admin
                                <span className="nb-mobile-link-arrow" aria-hidden="true">›</span>
                            </NavLink>
                        )}
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                            className="nb-mobile-wa"
                            aria-label="Chat with us on WhatsApp"
                        >
                            <FaWhatsapp size={16} aria-hidden="true" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </header>
        </>
    );
};

/* ── Scroll progress bar ── */
const ScrollProgressBar = () => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop || document.body.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setWidth(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div
            className="nb-progress"
            style={{ width: `${width}%` }}
            role="progressbar"
            aria-valuenow={Math.round(width)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Page scroll progress"
        />
    );
};

export default Navbar;