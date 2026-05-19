import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' },
];

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

const MobileMenu = ({ isOpen, onClose }) => {
    const location = useLocation();

    // Lock body scroll while menu is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Close on route change
    useEffect(() => { onClose(); }, [location.pathname]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@400;500;600&display=swap');

                /* ── Overlay ── */
                .mm-overlay {
                    position: fixed; inset: 0; z-index: 40;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(4px);
                    -webkit-backdrop-filter: blur(4px);
                    animation: mm-fade-in 0.25s ease forwards;
                }
                @keyframes mm-fade-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                /* ── Drawer ── */
                .mm-drawer {
                    position: fixed;
                    top: 0; right: 0; bottom: 0;
                    width: min(320px, 85vw);
                    z-index: 50;
                    background: #0f0f0f;
                    border-left: 1px solid #1e1e1e;
                    display: flex;
                    flex-direction: column;
                    transform: translateX(100%);
                    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    font-family: 'Montserrat', sans-serif;
                    overflow: hidden;
                }
                .mm-drawer.open { transform: translateX(0); }

                /* Top glow */
                .mm-drawer::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -40px;
                    width: 220px; height: 220px;
                    background: radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* ── Header ── */
                .mm-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 24px 24px 20px;
                    border-bottom: 1px solid #1a1a1a;
                    flex-shrink: 0;
                }
                .mm-brand {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    text-decoration: none;
                }
                .mm-brand-tag {
                    font-size: 8px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #C9A84C;
                    opacity: 0.8;
                }
                .mm-brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.35rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }
                .mm-close {
                    display: flex; align-items: center; justify-content: center;
                    width: 36px; height: 36px;
                    border: 1px solid #242424;
                    border-radius: 3px;
                    background: transparent;
                    color: #888070;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }
                .mm-close:hover {
                    border-color: rgba(201,168,76,0.4);
                    color: #C9A84C;
                    background: rgba(201,168,76,0.06);
                }

                /* ── Nav ── */
                .mm-nav {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    padding: 32px 24px 24px;
                    gap: 2px;
                    overflow-y: auto;
                }
                .mm-nav-label {
                    font-size: 8px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #C9A84C;
                    margin-bottom: 16px;
                    opacity: 0.7;
                }
                .mm-link {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 14px 0;
                    border-bottom: 1px solid #161616;
                    text-decoration: none;
                    color: #888070;
                    font-size: 0.82rem;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    transition: all 0.22s ease;
                    position: relative;
                }
                .mm-link::before {
                    content: '';
                    position: absolute;
                    left: -24px;
                    top: 50%; transform: translateY(-50%);
                    width: 2px; height: 0;
                    background: linear-gradient(135deg, #C9A84C, #E8C97A);
                    border-radius: 0 2px 2px 0;
                    transition: height 0.22s ease;
                }
                .mm-link:hover, .mm-link.active {
                    color: #E8C97A;
                    padding-left: 8px;
                }
                .mm-link:hover::before, .mm-link.active::before { height: 60%; }
                .mm-link.active { color: #C9A84C; font-weight: 600; }
                .mm-link-arrow {
                    font-size: 0.7rem;
                    color: #C9A84C;
                    opacity: 0;
                    transform: translateX(-4px);
                    transition: all 0.22s ease;
                }
                .mm-link:hover .mm-link-arrow,
                .mm-link.active .mm-link-arrow {
                    opacity: 1; transform: translateX(0);
                }

                /* ── WhatsApp CTA ── */
                .mm-wa-section {
                    padding: 20px 24px;
                    border-top: 1px solid #1a1a1a;
                    flex-shrink: 0;
                }
                .mm-wa-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #1a2e1a, #1f3a1f);
                    border: 1px solid rgba(37,211,102,0.3);
                    border-radius: 3px;
                    color: #25d366;
                    font-size: 0.75rem;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    text-decoration: none;
                    transition: all 0.25s ease;
                    margin-bottom: 16px;
                }
                .mm-wa-btn:hover {
                    background: #25d366;
                    color: #000;
                    box-shadow: 0 6px 24px rgba(37,211,102,0.2);
                }

                /* ── Footer socials ── */
                .mm-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .mm-socials { display: flex; gap: 8px; }
                .mm-social {
                    display: flex; align-items: center; justify-content: center;
                    width: 32px; height: 32px;
                    border: 1px solid #1e1e1e;
                    border-radius: 3px;
                    color: #555048;
                    font-size: 0.8rem;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }
                .mm-social:hover {
                    border-color: rgba(201,168,76,0.35);
                    color: #C9A84C;
                    background: rgba(201,168,76,0.05);
                }
                .mm-footer-copy {
                    font-size: 0.6rem;
                    letter-spacing: 1px;
                    color: #2e2c28;
                    text-transform: uppercase;
                }

                /* ── Staggered link entrance ── */
                .mm-drawer.open .mm-link {
                    animation: mm-slide-in 0.4s ease both;
                }
                .mm-drawer.open .mm-link:nth-child(2) { animation-delay: 0.05s; }
                .mm-drawer.open .mm-link:nth-child(3) { animation-delay: 0.10s; }
                .mm-drawer.open .mm-link:nth-child(4) { animation-delay: 0.15s; }
                .mm-drawer.open .mm-link:nth-child(5) { animation-delay: 0.20s; }
                @keyframes mm-slide-in {
                    from { opacity: 0; transform: translateX(16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="mm-overlay"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <div
                className={`mm-drawer${isOpen ? ' open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
            >
                {/* Header */}
                <div className="mm-header">
                    <Link to="/" className="mm-brand" aria-label="StephenDecoration – Go to home">
                        <span className="mm-brand-tag">✦ Event Management</span>
                        <span className="mm-brand-name">StephenDecoration</span>
                    </Link>
                    <button
                        className="mm-close"
                        onClick={onClose}
                        aria-label="Close navigation menu"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="mm-nav" aria-label="Main navigation">
                    <div className="mm-nav-label">Navigation</div>
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`mm-link${isActive ? ' active' : ''}`}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                {link.label}
                                <span className="mm-link-arrow" aria-hidden="true">›</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* WhatsApp CTA + socials */}
                <div className="mm-wa-section">
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I would like to plan an event!')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mm-wa-btn"
                        aria-label="Chat with us on WhatsApp"
                    >
                        <FaWhatsapp size={15} aria-hidden="true" />
                        Chat on WhatsApp
                    </a>

                    <div className="mm-footer">
                        <div className="mm-socials" aria-label="Social media links">
                            <a href="#" className="mm-social" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                            <a href="#" className="mm-social" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                            <a href="mailto:info@yourdomain.com" className="mm-social" aria-label="Email us"><FaEnvelope aria-hidden="true" /></a>
                        </div>
                        <span className="mm-footer-copy">✦ Pan India</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileMenu;