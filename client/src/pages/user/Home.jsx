
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import WhatsAppFloat from '../../components/common/WhatsAppFloat';

/* ─── Fallback dummy data ─── */
const fallbackEvents = [
    { _id: '1', title: 'Royal Wedding', coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', date: '2025-02-14' },
    { _id: '2', title: 'Beach Reception', coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', date: '2025-01-20' },
    { _id: '3', title: 'Corporate Gala', coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400', date: '2024-12-05' },
    { _id: '4', title: 'Birthday Bash', coverImage: 'https://images.unsplash.com/photo-1464349153735-7d5b5a7f5a1e?w=400', date: '2024-11-18' },
];

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ─── Reusable animated counter hook ─── */
function useCounter(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

/* ─── Stats Section Component ─── */
const StatsSection = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const events = useCounter(500, 2000, visible);
    const clients = useCounter(350, 2000, visible);
    const years = useCounter(12, 1500, visible);
    const cities = useCounter(25, 1800, visible);

    return (
        <section ref={ref} className="lux-stats py-16 px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                    { value: events, suffix: '+', label: 'Events Executed' },
                    { value: clients, suffix: '+', label: 'Happy Clients' },
                    { value: years, suffix: ' Yrs', label: 'Of Excellence' },
                    { value: cities, suffix: '+', label: 'Cities Served' },
                ].map((stat, i) => (
                    <div key={i} className="stat-card">
                        <div className="stat-number">{stat.value}{stat.suffix}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

/* ─── Skeleton loader for event cards ─── */
const EventSkeleton = () => (
    <div className="snap-center shrink-0 w-72 sm:w-80 event-card skeleton-card">
        <div className="skeleton-img" />
        <div className="p-5">
            <div className="skeleton-line w-3/4 mb-2" />
            <div className="skeleton-line w-1/2 mb-4" />
            <div className="skeleton-line w-2/3" />
        </div>
    </div>
);

/* ─── Main Page ─── */
const Home = () => {
    const { user } = useAuth();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroVisible, setHeroVisible] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    /* Hero entrance animation */
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    /* Fetch featured events */
    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/events/featured');
                if (res.data.success && res.data.data.length > 0) {
                    setFeaturedEvents(res.data.data);
                } else {
                    setFeaturedEvents(fallbackEvents);
                }
            } catch {
                setFeaturedEvents(fallbackEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    /* Auto-rotate testimonials */
    const testimonials = [
        { name: 'Priya & Rahul', role: 'Wedding Clients', text: 'They transformed our wedding into an absolute fairytale. Every single detail — from the floral arches to the ambient lighting — was crafted with love and precision.', stars: 5 },
        { name: 'Arjun Mehta', role: 'Corporate Client', text: 'Our annual gala was a massive hit! From venue décor to seamless coordination, their team delivered beyond our expectations. Truly world-class service.', stars: 5 },
        { name: 'Sneha & Vikram', role: 'Reception Clients', text: 'The reception was breathtaking — our guests couldn\'t stop complimenting the décor. The team\'s professionalism and creativity are unmatched in the industry.', stars: 5 },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4500);
        return () => clearInterval(interval);
    }, []);

    const services = [
        { name: 'Wedding Decoration', icon: '💍', desc: 'Luxurious floral & décor setups', msg: 'Wedding decoration enquiry' },
        { name: 'Reception Planning', icon: '🥂', desc: 'Elegant reception experiences', msg: 'Reception planning enquiry' },
        { name: 'Corporate Events', icon: '🏢', desc: 'Professional corporate galas', msg: 'Corporate event enquiry' },
        { name: 'Birthday Parties', icon: '🎂', desc: 'Personalised birthday setups', msg: 'Birthday party enquiry' },
        { name: 'Photography', icon: '📸', desc: 'Capturing timeless memories', msg: 'Photography enquiry' },
        { name: 'Catering', icon: '🍽️', desc: 'Gourmet culinary experiences', msg: 'Catering enquiry' },
        { name: 'Entertainment', icon: '🎤', desc: 'Live acts & DJ performances', msg: 'Entertainment enquiry' },
        { name: 'Full Planning', icon: '📋', desc: 'End-to-end event management', msg: 'Full event planning enquiry' },
    ];

    return (
        <>
            {/* ── Global Styles ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

                :root {
                    --gold: #C9A84C;
                    --gold-light: #E8C97A;
                    --gold-dark: #A0792A;
                    --black: #0A0A0A;
                    --black-soft: #111111;
                    --black-card: #161616;
                    --black-border: #2a2a2a;
                    --white: #FAF8F3;
                    --white-muted: #B8B0A0;
                    --gradient-gold: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    --gradient-dark: linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%);
                }

                * { box-sizing: border-box; }

                body, .lux-page { background: var(--black); color: var(--white); font-family: 'Montserrat', sans-serif; }

                /* Gold Text */
                .gold-text { background: var(--gradient-gold); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

                /* Gold Divider */
                .gold-divider {
                    display: flex; align-items: center; justify-content: center; gap: 12px; margin: 0 auto 48px;
                }
                .gold-divider::before, .gold-divider::after {
                    content: ''; flex: 1; max-width: 80px; height: 1px; background: var(--gradient-gold);
                }
                .gold-divider span { color: var(--gold); font-size: 20px; }

                /* Section Heading */
                .section-heading { font-family: 'Cormorant Garamond', serif; font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; text-align: center; margin-bottom: 12px; }

                /* Hero */
                .lux-hero {
                    position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: var(--black); overflow: hidden;
                }
                .hero-bg-pattern {
                    position: absolute; inset: 0; z-index: 0;
                    background-image:
                        radial-gradient(ellipse 80% 50% at 50% -10%, rgba(201,168,76,0.15) 0%, transparent 60%),
                        radial-gradient(ellipse 40% 40% at 80% 80%, rgba(201,168,76,0.07) 0%, transparent 60%);
                }
                .hero-grid-lines {
                    position: absolute; inset: 0; z-index: 0; opacity: 0.04;
                    background-image: linear-gradient(rgba(201,168,76,1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
                .hero-orb-1 {
                    position: absolute; width: 500px; height: 500px; border-radius: 50%; z-index: 0;
                    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
                    top: -100px; right: -100px; animation: float 8s ease-in-out infinite;
                }
                .hero-orb-2 {
                    position: absolute; width: 300px; height: 300px; border-radius: 50%; z-index: 0;
                    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
                    bottom: -50px; left: -50px; animation: float 10s ease-in-out infinite reverse;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-30px) scale(1.05); }
                }

                .hero-content { position: relative; z-index: 1; text-align: center; padding: 24px; max-width: 900px; }

                .hero-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    border: 1px solid rgba(201,168,76,0.4); padding: 6px 18px; border-radius: 100px;
                    font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold);
                    margin-bottom: 28px; background: rgba(201,168,76,0.05);
                    opacity: 0; transform: translateY(20px);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }
                .hero-badge.visible { opacity: 1; transform: translateY(0); }

                .hero-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(2.8rem, 8vw, 6rem);
                    font-weight: 700; line-height: 1.05; margin-bottom: 24px;
                    opacity: 0; transform: translateY(40px);
                    transition: opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s;
                }
                .hero-title.visible { opacity: 1; transform: translateY(0); }

                .hero-sub {
                    font-size: clamp(0.95rem, 2vw, 1.15rem); color: var(--white-muted); font-weight: 300;
                    letter-spacing: 0.5px; max-width: 520px; margin: 0 auto 40px; line-height: 1.7;
                    opacity: 0; transform: translateY(30px);
                    transition: opacity 0.9s ease 0.4s, transform 0.9s ease 0.4s;
                }
                .hero-sub.visible { opacity: 1; transform: translateY(0); }

                .hero-actions {
                    display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 16px;
                    opacity: 0; transform: translateY(30px);
                    transition: opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s;
                }
                .hero-actions.visible { opacity: 1; transform: translateY(0); }

                .btn-primary {
                    display: inline-flex; align-items: center; gap: 10px;
                    background: var(--gradient-gold); color: var(--black); padding: 16px 32px;
                    border-radius: 4px; font-weight: 700; font-size: 0.9rem; letter-spacing: 1px;
                    text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
                    box-shadow: 0 0 30px rgba(201,168,76,0.3), 0 4px 20px rgba(0,0,0,0.4);
                    position: relative; overflow: hidden;
                }
                .btn-primary::before {
                    content: ''; position: absolute; inset: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
                    opacity: 0; transition: opacity 0.3s;
                }
                .btn-primary:hover::before { opacity: 1; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 50px rgba(201,168,76,0.5), 0 8px 30px rgba(0,0,0,0.5); }

                .btn-secondary {
                    display: inline-flex; align-items: center; gap: 10px;
                    border: 1px solid var(--gold); color: var(--gold); padding: 15px 32px;
                    border-radius: 4px; font-weight: 600; font-size: 0.9rem; letter-spacing: 1px;
                    text-transform: uppercase; text-decoration: none; transition: all 0.3s ease;
                    background: transparent;
                }
                .btn-secondary:hover { background: rgba(201,168,76,0.1); transform: translateY(-2px); }

                /* Scroll indicator */
                .scroll-indicator {
                    position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
                    display: flex; flex-direction: column; align-items: center; gap: 8px;
                    color: var(--white-muted); font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
                    z-index: 1; animation: bounce 2s ease-in-out infinite;
                }
                @keyframes bounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(8px); }
                }
                .scroll-indicator svg { color: var(--gold); }

                /* Stats */
                .lux-stats { background: var(--black-soft); border-top: 1px solid var(--black-border); border-bottom: 1px solid var(--black-border); }
                .stat-card { padding: 8px; }
                .stat-number {
                    font-family: 'Cormorant Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: 700; background: var(--gradient-gold); -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent; background-clip: text; line-height: 1;
                }
                .stat-label { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: var(--white-muted); margin-top: 8px; }

                /* Services */
                .lux-services { background: var(--black); }
                .service-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: var(--black-border); }
                @media (min-width: 640px) { .service-grid { grid-template-columns: repeat(3, 1fr); } }
                @media (min-width: 1024px) { .service-grid { grid-template-columns: repeat(4, 1fr); } }

                .service-card {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 40px 20px; background: var(--black-card); text-decoration: none;
                    transition: all 0.35s ease; position: relative; overflow: hidden; min-height: 160px;
                }
                .service-card::before {
                    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
                    background: var(--gradient-gold); transform: scaleX(0); transition: transform 0.35s ease;
                    transform-origin: left;
                }
                .service-card::after {
                    content: ''; position: absolute; inset: 0;
                    background: radial-gradient(circle at center, rgba(201,168,76,0.05) 0%, transparent 70%);
                    opacity: 0; transition: opacity 0.35s ease;
                }
                .service-card:hover::before { transform: scaleX(1); }
                .service-card:hover::after { opacity: 1; }
                .service-card:hover { background: #1a1a1a; }
                .service-card:hover .service-icon { transform: scale(1.15) rotate(-5deg); }
                .service-card:hover .service-name { color: var(--gold-light); }

                .service-icon { font-size: 2.2rem; margin-bottom: 12px; transition: transform 0.3s ease; display: block; }
                .service-name { font-size: 0.8rem; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--white); text-align: center; transition: color 0.3s; margin-bottom: 6px; }
                .service-desc { font-size: 0.7rem; color: var(--white-muted); text-align: center; line-height: 1.5; }

                /* Events Carousel */
                .lux-events { background: var(--black-soft); }
                .events-scroll { display: flex; overflow-x: auto; gap: 24px; padding-bottom: 16px; scroll-snap-type: x mandatory; scroll-behavior: smooth; -ms-overflow-style: none; scrollbar-width: none; }
                .events-scroll::-webkit-scrollbar { display: none; }

                .event-card {
                    snap-align: center; flex-shrink: 0; width: 288px; border-radius: 2px;
                    background: var(--black-card); border: 1px solid var(--black-border);
                    overflow: hidden; text-decoration: none; transition: all 0.35s ease;
                    display: block;
                }
                @media (min-width: 640px) { .event-card { width: 320px; } }
                .event-card:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(201,168,76,0.1); }
                .event-card:hover .event-img { transform: scale(1.05); }

                .event-img-wrap { overflow: hidden; height: 200px; }
                .event-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }

                .event-body { padding: 20px; }
                .event-title { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; font-weight: 700; color: var(--white); margin-bottom: 4px; }
                .event-date { font-size: 0.72rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--white-muted); margin-bottom: 14px; }
                .event-enquire {
                    display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem;
                    font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: var(--gold);
                    text-decoration: none; transition: gap 0.2s ease;
                }
                .event-enquire:hover { gap: 10px; }

                /* Skeleton */
                .skeleton-card { animation: pulse 1.5s ease-in-out infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .skeleton-img { height: 200px; background: var(--black-border); }
                .skeleton-line { height: 12px; background: var(--black-border); border-radius: 4px; margin-bottom: 8px; }
                .w-3\/4 { width: 75%; } .w-1\/2 { width: 50%; } .w-2\/3 { width: 66%; }

                /* Testimonials */
                .lux-testimonials { background: var(--black); }
                .testimonial-track { position: relative; min-height: 220px; }
                .testimonial-slide {
                    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
                    text-align: center; padding: 40px 24px; opacity: 0; transform: translateY(20px);
                    transition: opacity 0.6s ease, transform 0.6s ease; pointer-events: none;
                }
                .testimonial-slide.active { opacity: 1; transform: translateY(0); pointer-events: auto; position: relative; }
                .stars { color: var(--gold); font-size: 1rem; letter-spacing: 4px; margin-bottom: 20px; }
                .testimonial-text {
                    font-family: 'Cormorant Garamond', serif; font-size: clamp(1.1rem, 2.5vw, 1.4rem);
                    font-style: italic; line-height: 1.7; color: var(--white); max-width: 680px; margin-bottom: 24px;
                }
                .testimonial-name { font-size: 0.75rem; letter-spacing: 2.5px; text-transform: uppercase; color: var(--gold); font-weight: 600; }
                .testimonial-role { font-size: 0.7rem; color: var(--white-muted); margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }

                .testimonial-dots { display: flex; justify-content: center; gap: 8px; margin-top: 32px; }
                .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--black-border); transition: all 0.3s ease; cursor: pointer; border: none; padding: 0; }
                .dot.active { background: var(--gold); width: 24px; border-radius: 3px; }

                /* Process Steps */
                .lux-process { background: var(--black-soft); }
                .process-steps { display: grid; grid-template-columns: 1fr; gap: 0; }
                @media (min-width: 768px) { .process-steps { grid-template-columns: repeat(4, 1fr); } }
                .process-step { padding: 40px 24px; text-align: center; position: relative; }
                .process-step:not(:last-child)::after {
                    content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
                    width: 1px; height: 40px; background: var(--black-border);
                }
                @media (min-width: 768px) {
                    .process-step:not(:last-child)::after {
                        top: 50%; left: auto; right: 0; bottom: auto; transform: translateY(-50%);
                        width: 40px; height: 1px;
                    }
                }
                .process-num {
                    display: inline-flex; align-items: center; justify-content: center;
                    width: 52px; height: 52px; border: 1px solid rgba(201,168,76,0.4); border-radius: 50%;
                    font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 700;
                    color: var(--gold); margin: 0 auto 16px;
                }
                .process-title { font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; color: var(--white); font-weight: 600; margin-bottom: 10px; }
                .process-desc { font-size: 0.78rem; color: var(--white-muted); line-height: 1.7; }

                /* CTA */
                .lux-cta {
                    background: var(--black-card); border-top: 1px solid var(--black-border);
                    border-bottom: 1px solid var(--black-border); position: relative; overflow: hidden;
                }
                .cta-glow {
                    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    width: 600px; height: 300px;
                    background: radial-gradient(ellipse, rgba(201,168,76,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* Section wrappers */
                .section-inner { max-width: 1200px; margin: 0 auto; padding: 80px 24px; }
                .section-inner-sm { max-width: 800px; margin: 0 auto; padding: 80px 24px; }

                /* Fade-in on scroll */
                .fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
                .fade-in.in-view { opacity: 1; transform: translateY(0); }

                /* WhatsApp chip */
                .wa-chip {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: #1a2e1a; border: 1px solid #25d366; color: #25d366;
                    padding: 10px 24px; border-radius: 4px; font-size: 0.85rem; font-weight: 600;
                    text-decoration: none; transition: all 0.3s ease; letter-spacing: 0.5px;
                }
                .wa-chip:hover { background: #25d366; color: #000; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,211,102,0.3); }

                /* Horizontal rule */
                .gold-rule { height: 1px; background: var(--gradient-gold); opacity: 0.3; margin: 0; }
            `}</style>

            <div className="lux-page">

                {/* ════════ HERO ════════ */}
                <section className="lux-hero" aria-label="Hero - Premium Event Management Services">
                    <div className="hero-bg-pattern" />
                    <div className="hero-grid-lines" />
                    <div className="hero-orb-1" />
                    <div className="hero-orb-2" />

                    <div className="hero-content">
                        <div className={`hero-badge ${heroVisible ? 'visible' : ''}`}>
                            <span>✦</span> Premium Event Management <span>✦</span>
                        </div>

                        <h1 className={`hero-title ${heroVisible ? 'visible' : ''}`}>
                            We Make Your <br />
                            <span className="gold-text">Dream Events</span> <br />
                            Come Alive
                        </h1>

                        <p className={`hero-sub ${heroVisible ? 'visible' : ''}`}>
                            Exquisite wedding decoration & complete event management — from intimate ceremonies to grand galas, crafted with unmatched elegance.
                        </p>

                        <div className={`hero-actions ${heroVisible ? 'visible' : ''}`}>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi! I want to plan my event.')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                aria-label="Chat with us on WhatsApp to plan your event"
                            >
                                💬 Plan Your Event
                            </a>

                            {!user && (
                                <Link
                                    to="/admin/login"
                                    className="btn-secondary"
                                    aria-label="Admin login portal"
                                >
                                    🔐 Admin Login
                                </Link>
                            )}

                            {user && (
                                <Link
                                    to="/admin/dashboard"
                                    className="btn-secondary"
                                    aria-label="Go to Admin Panel"
                                >
                                    ⚙️ Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="scroll-indicator" aria-hidden="true">
                        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="1" y="1" width="14" height="22" rx="7" />
                            <circle cx="8" cy="7" r="2" fill="currentColor" className="scroll-dot" />
                        </svg>
                        <span>Scroll</span>
                    </div>
                </section>

                {/* ════════ STATS ════════ */}
                <StatsSection />

                <div className="gold-rule" />

                {/* ════════ SERVICES ════════ */}
                <section className="lux-services" aria-label="Our Event Management Services">
                    <div className="section-inner">
                        <h2 className="section-heading">
                            Our <span className="gold-text">Services</span>
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--white-muted)', fontSize: '0.88rem', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            Comprehensive event solutions tailored to your vision
                        </p>
                        <div className="gold-divider"><span>✦</span></div>
                        <div className="service-grid">
                            {services.map((service) => (
                                <a
                                    key={service.name}
                                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(service.msg)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="service-card"
                                    aria-label={`Enquire about ${service.name} on WhatsApp`}
                                >
                                    <span className="service-icon" aria-hidden="true">{service.icon}</span>
                                    <span className="service-name">{service.name}</span>
                                    <span className="service-desc">{service.desc}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="gold-rule" />

                {/* ════════ HOW WE WORK ════════ */}
                <section className="lux-process" aria-label="Our Event Planning Process">
                    <div className="section-inner">
                        <h2 className="section-heading">
                            How We <span className="gold-text">Work</span>
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--white-muted)', fontSize: '0.88rem', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            A seamless four-step journey from vision to reality
                        </p>
                        <div className="gold-divider"><span>✦</span></div>
                        <div className="process-steps">
                            {[
                                { num: '01', title: 'Consultation', desc: 'Share your vision with us — we listen, understand, and propose ideas that reflect your personality.' },
                                { num: '02', title: 'Planning', desc: 'We craft a detailed roadmap: venue, décor, vendors, timelines — every element meticulously planned.' },
                                { num: '03', title: 'Execution', desc: 'Our expert team brings every detail to life with precision, care, and impeccable standards.' },
                                { num: '04', title: 'Celebration', desc: 'You enjoy your event stress-free while we handle everything from setup to teardown.' },
                            ].map((step) => (
                                <div key={step.num} className="process-step">
                                    <div className="process-num">{step.num}</div>
                                    <div className="process-title">{step.title}</div>
                                    <p className="process-desc">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="gold-rule" />

                {/* ════════ FEATURED EVENTS ════════ */}
                <section className="lux-events" aria-label="Recent Event Showcases">
                    <div className="section-inner">
                        <h2 className="section-heading">
                            Recent <span className="gold-text">Events</span>
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--white-muted)', fontSize: '0.88rem', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            A glimpse of the moments we've crafted for our clients
                        </p>
                        <div className="gold-divider"><span>✦</span></div>
                        <div className="events-scroll" role="list">
                            {loading
                                ? [1, 2, 3, 4].map((i) => <EventSkeleton key={i} />)
                                : featuredEvents.map((event) => (
                                    <Link
                                        key={event._id}
                                        to="/gallery"
                                        className="event-card"
                                        role="listitem"
                                        aria-label={`View gallery for ${event.title}`}
                                    >
                                        <div className="event-img-wrap">
                                            <img
                                                src={event.coverImage || event.gallery?.[0] || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400'}
                                                alt={`${event.title} event decoration by our team`}
                                                className="event-img"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="event-body">
                                            <h3 className="event-title">{event.title}</h3>
                                            {event.date && (
                                                <p className="event-date">{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            )}
                                            <a
                                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`I love the ${event.title} setup! Can I get something similar?`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="event-enquire"
                                                aria-label={`Enquire about a setup similar to ${event.title}`}
                                            >
                                                Enquire for Similar <span aria-hidden="true">→</span>
                                            </a>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '40px' }}>
                            <Link to="/gallery" className="btn-secondary" style={{ display: 'inline-flex' }} aria-label="View our full event gallery">
                                View Full Gallery →
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="gold-rule" />

                {/* ════════ TESTIMONIALS ════════ */}
                <section className="lux-testimonials" aria-label="Client Testimonials">
                    <div className="section-inner-sm">
                        <h2 className="section-heading">
                            Client <span className="gold-text">Stories</span>
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--white-muted)', fontSize: '0.88rem', letterSpacing: '0.5px', marginBottom: '12px' }}>
                            Words from the people who trusted us with their most special days
                        </p>
                        <div className="gold-divider"><span>✦</span></div>

                        <div className="testimonial-track" role="region" aria-label="Testimonials carousel">
                            {testimonials.map((t, i) => (
                                <div key={i} className={`testimonial-slide ${i === activeTestimonial ? 'active' : ''}`} aria-hidden={i !== activeTestimonial}>
                                    <div className="stars" aria-label={`${t.stars} out of 5 stars`}>{'★'.repeat(t.stars)}</div>
                                    <p className="testimonial-text">"{t.text}"</p>
                                    <div className="testimonial-name">{t.name}</div>
                                    <div className="testimonial-role">{t.role}</div>
                                </div>
                            ))}
                        </div>

                        <div className="testimonial-dots" role="tablist" aria-label="Testimonial navigation">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === activeTestimonial ? 'active' : ''}`}
                                    onClick={() => setActiveTestimonial(i)}
                                    aria-label={`Go to testimonial ${i + 1}`}
                                    role="tab"
                                    aria-selected={i === activeTestimonial}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <div className="gold-rule" />

                {/* ════════ FINAL CTA ════════ */}
                <section className="lux-cta" aria-label="Contact us to plan your event">
                    <div className="cta-glow" aria-hidden="true" />
                    <div className="section-inner-sm" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '0.72rem', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>✦ Let's Begin ✦</p>
                        <h2 className="section-heading" style={{ marginBottom: '16px' }}>
                            Ready to Plan Your <br /><span className="gold-text">Perfect Event?</span>
                        </h2>
                        <p style={{ color: 'var(--white-muted)', fontSize: '0.9rem', lineHeight: '1.8', maxWidth: '480px', margin: '0 auto 40px', letterSpacing: '0.3px' }}>
                            Reach out on WhatsApp for an instant consultation. We respond within minutes and will help bring your dream event to life — beautifully and stress-free.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi, I want to start planning my event!')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                aria-label="Start planning your event on WhatsApp"
                            >
                                💬 Start WhatsApp Chat
                            </a>
                            <Link
                                to="/gallery"
                                className="btn-secondary"
                                aria-label="Browse our event portfolio"
                            >
                                View Portfolio
                            </Link>
                        </div>

                        {/* Trust signals */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
                            {['⚡ Instant Reply', '🏆 500+ Events', '💯 100% Satisfaction', '📍 Pan India'].map((item) => (
                                <div key={item} style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--white-muted)' }}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <WhatsAppFloat />
            </div>
        </>
    );
};

export default Home;