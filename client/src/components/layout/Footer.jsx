import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaFacebook, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const currentYear = new Date().getFullYear();

const Footer = () => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const message = encodeURIComponent('Hello, I would like to plan an event!');

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@300;400;500;600&display=swap');

                .ftr-root {
                    background: #0A0A0A;
                    border-top: 1px solid #1e1e1e;
                    font-family: 'Montserrat', sans-serif;
                    color: #888070;
                    position: relative;
                    overflow: hidden;
                }

                /* Top glow */
                .ftr-root::before {
                    content: '';
                    position: absolute;
                    top: -80px; left: 50%;
                    transform: translateX(-50%);
                    width: 600px; height: 200px;
                    background: radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* Gold gradient text util */
                .ftr-gold {
                    background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* ── Top strip: "Ready to plan?" CTA ── */
                .ftr-cta-strip {
                    border-bottom: 1px solid #1e1e1e;
                    padding: 40px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .ftr-cta-strip {
                        flex-direction: row;
                        justify-content: space-between;
                        text-align: left;
                        padding: 36px 48px;
                    }
                }
                .ftr-cta-label {
                    font-size: 9px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #C9A84C;
                    margin-bottom: 6px;
                }
                .ftr-cta-heading {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(1.4rem, 3vw, 2rem);
                    font-weight: 700;
                    color: #FAF8F3;
                    line-height: 1.2;
                }
                .ftr-wa-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    background: linear-gradient(135deg, #1a2e1a, #1f3a1f);
                    border: 1px solid rgba(37,211,102,0.35);
                    color: #25d366;
                    padding: 14px 28px;
                    border-radius: 3px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    text-decoration: none;
                    white-space: nowrap;
                    transition: all 0.28s ease;
                    flex-shrink: 0;
                }
                .ftr-wa-btn:hover {
                    background: #25d366;
                    color: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(37,211,102,0.25);
                }

                /* ── Main grid ── */
                .ftr-main {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 64px 24px 48px;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 48px;
                }
                @media (min-width: 640px)  { .ftr-main { grid-template-columns: repeat(2, 1fr); } }
                @media (min-width: 1024px) { .ftr-main { grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 40px; } }

                /* ── Column headings ── */
                .ftr-col-heading {
                    font-size: 9px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #C9A84C;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ftr-col-heading::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, rgba(201,168,76,0.3), transparent);
                }

                /* Brand col */
                .ftr-brand-name {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.8rem;
                    font-weight: 700;
                    line-height: 1;
                    text-decoration: none;
                    display: block;
                    margin-bottom: 12px;
                }
                .ftr-tagline {
                    font-size: 0.78rem;
                    line-height: 1.8;
                    color: #666058;
                    margin-bottom: 24px;
                    max-width: 260px;
                }

                /* Social icons */
                .ftr-socials {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 28px;
                }
                .ftr-social-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px; height: 36px;
                    border: 1px solid #242424;
                    border-radius: 3px;
                    color: #666058;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.25s ease;
                }
                .ftr-social-icon:hover {
                    border-color: rgba(201,168,76,0.4);
                    color: #C9A84C;
                    background: rgba(201,168,76,0.06);
                    transform: translateY(-2px);
                }

                /* Contact info row */
                .ftr-contact-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.74rem;
                    color: #666058;
                    margin-bottom: 10px;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .ftr-contact-row:hover { color: #C9A84C; }
                .ftr-contact-icon {
                    width: 28px; height: 28px;
                    border: 1px solid #1e1e1e;
                    border-radius: 3px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.65rem;
                    color: #C9A84C;
                    flex-shrink: 0;
                }

                /* Nav links */
                .ftr-link-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 2px; }
                .ftr-link {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 7px 0;
                    font-size: 0.78rem;
                    color: #666058;
                    text-decoration: none;
                    border-bottom: 1px solid transparent;
                    transition: all 0.22s ease;
                    letter-spacing: 0.3px;
                }
                .ftr-link::before { content: '›'; color: #C9A84C; opacity: 0; transform: translateX(-4px); transition: all 0.22s ease; }
                .ftr-link:hover { color: #E8C97A; padding-left: 4px; }
                .ftr-link:hover::before { opacity: 1; transform: translateX(0); }

                /* Services list (non-linked) */
                .ftr-service-item {
                    padding: 7px 0;
                    font-size: 0.78rem;
                    color: #555048;
                    border-bottom: 1px solid #141414;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .ftr-service-item::before { content: '✦'; color: #C9A84C; font-size: 0.5rem; opacity: 0.6; }

                /* ── Bottom bar ── */
                .ftr-bottom {
                    border-top: 1px solid #161616;
                    padding: 20px 24px;
                }
                .ftr-bottom-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .ftr-bottom-inner { flex-direction: row; justify-content: space-between; text-align: left; }
                }
                .ftr-copy {
                    font-size: 0.68rem;
                    letter-spacing: 0.5px;
                    color: #3a3830;
                }
                .ftr-bottom-links {
                    display: flex;
                    gap: 20px;
                }
                .ftr-bottom-link {
                    font-size: 0.68rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #3a3830;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }
                .ftr-bottom-link:hover { color: #C9A84C; }

                /* Gold rule */
                .ftr-gold-rule {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent);
                    margin: 0;
                }
            `}</style>

            <footer className="ftr-root" aria-label="Site footer">

                {/* ── CTA Strip ── */}
                <div className="ftr-cta-strip" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    <div>
                        <div className="ftr-cta-label">✦ Let's Create Together</div>
                        <div className="ftr-cta-heading">
                            Ready to Plan Your <span className="ftr-gold">Perfect Event?</span>
                        </div>
                    </div>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${message}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ftr-wa-btn"
                        aria-label="Chat with us on WhatsApp to start planning your event"
                    >
                        <FaWhatsapp size={18} aria-hidden="true" />
                        Chat on WhatsApp
                    </a>
                </div>

                <div className="ftr-gold-rule" />

                {/* ── Main grid ── */}
                <div className="ftr-main">

                    {/* Brand column */}
                    <div>
                        <Link to="/" className="ftr-brand-name ftr-gold" aria-label="StephenDecoration – Go to home">
                            StephenDecoration
                        </Link>
                        <p className="ftr-tagline">
                            We turn your dream events into reality. From intimate ceremonies to grand galas — crafted with precision and elegance.
                        </p>

                        {/* Social icons */}
                        <div className="ftr-socials" aria-label="Social media links">
                            <a href="#" className="ftr-social-icon" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
                                <FaInstagram />
                            </a>
                            <a href="#" className="ftr-social-icon" aria-label="Follow us on Facebook" target="_blank" rel="noopener noreferrer">
                                <FaFacebook />
                            </a>
                            <a href="mailto:info@yourdomain.com" className="ftr-social-icon" aria-label="Send us an email">
                                <FaEnvelope />
                            </a>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${message}`}
                                className="ftr-social-icon"
                                aria-label="Chat on WhatsApp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp />
                            </a>
                        </div>

                        {/* Contact details */}
                        <a href={`https://wa.me/${whatsappNumber}`} className="ftr-contact-row" target="_blank" rel="noopener noreferrer" aria-label="Call or WhatsApp us">
                            <span className="ftr-contact-icon" aria-hidden="true"><FaPhone /></span>
                            +91 9788747902
                        </a>
                        <a href="mailto:stephensdecorators@gmail.com" className="ftr-contact-row" aria-label="Email us">
                            <span className="ftr-contact-icon" aria-hidden="true"><FaEnvelope /></span>
                            stephensdecorators@gmail.com
                        </a>
                        <div className="ftr-contact-row" aria-label="Our location">
                            <span className="ftr-contact-icon" aria-hidden="true"><FaMapMarkerAlt /></span>
                            Vilathikulam, Tamil Nadu 628907 , India
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="ftr-col-heading">Quick Links</div>
                        <ul className="ftr-link-list" aria-label="Quick navigation links">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/services', label: 'Services' },
                                { to: '/gallery', label: 'Gallery' },
                                { to: '/contact', label: 'Contact' },
                            ].map((l) => (
                                <li key={l.to}>
                                    <Link to={l.to} className="ftr-link">{l.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <div className="ftr-col-heading">Our Services</div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} aria-label="Services we offer">
                            {[
                                'Wedding Decoration',
                                'Reception Planning',
                                'Corporate Events',
                                'Birthday Parties',
                                'Photography & Video',
                                'Catering',
                                'Entertainment',
                            ].map((s) => (
                                <li key={s} className="ftr-service-item">{s}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Working hours */}
                    <div>
                        <div className="ftr-col-heading">Working Hours</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { day: 'Mon – Fri', hours: '9:00 AM – 8:00 PM' },
                                { day: 'Saturday', hours: '10:00 AM – 6:00 PM' },
                                { day: 'Sunday', hours: 'By Appointment' },
                            ].map((row) => (
                                <div key={row.day} style={{ borderBottom: '1px solid #141414', paddingBottom: '10px' }}>
                                    <div style={{ fontSize: '0.68rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '2px' }}>{row.day}</div>
                                    <div style={{ fontSize: '0.76rem', color: '#555048' }}>{row.hours}</div>
                                </div>
                            ))}
                            <div style={{ marginTop: '8px' }}>
                                <a
                                    href={`https://wa.me/${whatsappNumber}?text=${message}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase',
                                        color: '#25d366', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                    aria-label="WhatsApp us anytime"
                                >
                                    <FaWhatsapp aria-hidden="true" /> WhatsApp anytime
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ftr-gold-rule" />

                {/* ── Bottom bar ── */}
                <div className="ftr-bottom">
                    <div className="ftr-bottom-inner">
                        <p className="ftr-copy">
                            &copy; {currentYear} StephenDecoration. All rights reserved. Crafted with ✦ for your special moments.
                        </p>
                        <nav className="ftr-bottom-links" aria-label="Footer legal links">
                            <a href="#" className="ftr-bottom-link">Privacy Policy</a>
                            <a href="#" className="ftr-bottom-link">Terms of Service</a>
                        </nav>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;