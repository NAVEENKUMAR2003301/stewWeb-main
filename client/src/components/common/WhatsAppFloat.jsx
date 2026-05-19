import { FaWhatsapp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const WhatsAppFloat = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
    const message = encodeURIComponent("Hi! I'm interested in your event planning services.");
    const url = `https://wa.me/${phone}?text=${message}`;

    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [pulseCount, setPulseCount] = useState(0);
    const [ripples, setRipples] = useState([]);

    // Entrance animation on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setIsVisible(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Auto-show tooltip every 8 seconds to attract attention
    useEffect(() => {
        if (!isVisible) return;
        const interval = setInterval(() => {
            setPulseCount(prev => prev + 1);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }, 8000);
        // Show first tooltip after 3s
        const initial = setTimeout(() => {
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), 3000);
        }, 3000);
        return () => { clearInterval(interval); clearTimeout(initial); };
    }, [isVisible]);

    // Ripple effect on click
    const handleClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();
        setRipples(prev => [...prev, { id, x, y }]);
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    };

    return (
        <>
            {/* Inject keyframe animations */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Lato:wght@300;400&display=swap');

                :root {
                    --gold-light: #f5d87a;
                    --gold-main: #c9a84c;
                    --gold-dark: #9a7a2e;
                    --black-main: #0a0a0a;
                    --black-soft: #1a1a1a;
                    --black-card: #141414;
                }

                @keyframes wa-float-in {
                    0% { opacity: 0; transform: scale(0.3) translateY(40px) rotate(-15deg); }
                    60% { transform: scale(1.12) translateY(-6px) rotate(3deg); }
                    80% { transform: scale(0.96) translateY(2px) rotate(-1deg); }
                    100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
                }

                @keyframes wa-glow-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(201,168,76,0.55), 0 8px 32px rgba(0,0,0,0.6); }
                    50% { box-shadow: 0 0 0 14px rgba(201,168,76,0), 0 8px 32px rgba(0,0,0,0.6); }
                }

                @keyframes wa-ring {
                    0% { transform: scale(1); opacity: 0.7; }
                    100% { transform: scale(2.4); opacity: 0; }
                }

                @keyframes wa-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                @keyframes wa-tooltip-in {
                    0% { opacity: 0; transform: translateX(10px) scale(0.92); }
                    100% { opacity: 1; transform: translateX(0) scale(1); }
                }

                @keyframes wa-loading-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes wa-ripple {
                    0% { transform: scale(0); opacity: 0.5; }
                    100% { transform: scale(4); opacity: 0; }
                }

                @keyframes wa-dot-bounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-5px); opacity: 1; }
                }

                .wa-btn {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    z-index: 9999;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    text-decoration: none;
                    overflow: hidden;
                    border: 2px solid var(--gold-main);
                    background: radial-gradient(circle at 35% 35%, #1e1a0e, var(--black-main));
                    transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                                border-color 0.3s ease,
                                box-shadow 0.3s ease;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.65), 0 2px 8px rgba(201,168,76,0.25);
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                }

                .wa-btn.visible {
                    animation: wa-float-in 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards,
                               wa-glow-pulse 2.8s ease-in-out 1.2s infinite;
                }

                .wa-btn:hover {
                    transform: scale(1.13) translateY(-3px);
                    border-color: var(--gold-light);
                    box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(201,168,76,0.5);
                }

                .wa-btn:active {
                    transform: scale(0.95);
                }

                /* Gold shimmer overlay on hover */
                .wa-btn::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: linear-gradient(
                        105deg,
                        transparent 20%,
                        rgba(245,216,122,0.18) 50%,
                        transparent 80%
                    );
                    background-size: 200% auto;
                    opacity: 0;
                    transition: opacity 0.3s;
                    animation: wa-shimmer 1.8s linear infinite;
                }

                .wa-btn:hover::before {
                    opacity: 1;
                }

                /* Decorative gold arc border */
                .wa-btn::after {
                    content: '';
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 1.5px solid transparent;
                    background: conic-gradient(
                        from 0deg,
                        var(--gold-light) 0deg,
                        var(--gold-dark) 120deg,
                        transparent 180deg,
                        var(--gold-main) 300deg,
                        var(--gold-light) 360deg
                    ) border-box;
                    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: destination-out;
                    mask-composite: exclude;
                    opacity: 0;
                    transition: opacity 0.35s ease;
                }

                .wa-btn:hover::after {
                    opacity: 1;
                }

                /* Pulse rings */
                .wa-ring {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 2px solid rgba(201,168,76,0.6);
                    animation: wa-ring 2s ease-out infinite;
                }
                .wa-ring:nth-child(2) { animation-delay: 0.7s; }
                .wa-ring:nth-child(3) { animation-delay: 1.4s; }

                /* WhatsApp icon */
                .wa-icon {
                    color: var(--gold-main);
                    transition: color 0.25s ease, transform 0.25s ease, filter 0.25s ease;
                    filter: drop-shadow(0 0 6px rgba(201,168,76,0.4));
                    position: relative;
                    z-index: 2;
                }

                .wa-btn:hover .wa-icon {
                    color: var(--gold-light);
                    transform: rotate(-8deg) scale(1.15);
                    filter: drop-shadow(0 0 12px rgba(245,216,122,0.8));
                }

                /* Ripple */
                .wa-ripple-el {
                    position: absolute;
                    border-radius: 50%;
                    width: 14px;
                    height: 14px;
                    background: rgba(245,216,122,0.45);
                    pointer-events: none;
                    animation: wa-ripple 0.7s ease-out forwards;
                    transform-origin: center;
                    z-index: 1;
                }

                /* Tooltip */
                .wa-tooltip {
                    position: fixed;
                    bottom: 38px;
                    right: 100px;
                    background: linear-gradient(135deg, var(--black-card), var(--black-soft));
                    border: 1px solid var(--gold-dark);
                    border-radius: 12px;
                    padding: 10px 16px;
                    min-width: 210px;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,168,76,0.12);
                    pointer-events: none;
                    z-index: 9998;
                    opacity: 0;
                    transform: translateX(10px);
                    transition: opacity 0.35s ease, transform 0.35s ease;
                }

                .wa-tooltip.active {
                    opacity: 1;
                    transform: translateX(0);
                    animation: wa-tooltip-in 0.35s ease forwards;
                }

                /* Tooltip arrow */
                .wa-tooltip::after {
                    content: '';
                    position: absolute;
                    right: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 8px solid transparent;
                    border-left-color: var(--gold-dark);
                    border-right: 0;
                }

                .wa-tooltip-title {
                    font-family: 'Playfair Display', Georgia, serif;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--gold-light);
                    letter-spacing: 0.04em;
                    margin-bottom: 4px;
                    line-height: 1.3;
                }

                .wa-tooltip-sub {
                    font-family: 'Lato', sans-serif;
                    font-size: 11px;
                    font-weight: 300;
                    color: rgba(245,216,122,0.6);
                    letter-spacing: 0.06em;
                    line-height: 1.4;
                }

                .wa-tooltip-dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #4ade80;
                    margin-right: 5px;
                    animation: wa-dot-bounce 1.4s ease infinite;
                    vertical-align: middle;
                }

                /* Loading state */
                .wa-loader {
                    position: fixed;
                    bottom: 28px;
                    right: 28px;
                    z-index: 9999;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 2px solid rgba(201,168,76,0.2);
                    border-top-color: var(--gold-main);
                    animation: wa-loading-spin 0.9s linear infinite;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
                }

                /* Badge */
                .wa-badge {
                    position: absolute;
                    top: -3px;
                    right: -3px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--gold-light), var(--gold-main));
                    border: 2px solid var(--black-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Lato', sans-serif;
                    font-size: 8px;
                    font-weight: 700;
                    color: var(--black-main);
                    z-index: 3;
                    letter-spacing: 0;
                    box-shadow: 0 2px 6px rgba(201,168,76,0.5);
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .wa-btn { width: 52px; height: 52px; bottom: 20px; right: 20px; }
                    .wa-loader { width: 52px; height: 52px; bottom: 20px; right: 20px; }
                    .wa-tooltip { right: 84px; min-width: 180px; bottom: 26px; }
                    .wa-tooltip-title { font-size: 12px; }
                    .wa-tooltip-sub { font-size: 10px; }
                }

                @media (max-width: 360px) {
                    .wa-tooltip { display: none; }
                }
            `}</style>

            {/* Loading spinner */}
            {isLoading && <div className="wa-loader" aria-hidden="true" />}

            {/* Tooltip */}
            {isVisible && (
                <div
                    className={`wa-tooltip ${showTooltip ? 'active' : ''}`}
                    role="tooltip"
                    aria-label="Chat with us on WhatsApp"
                >
                    <div className="wa-tooltip-title">
                        ✦ Let's Plan Your Event
                    </div>
                    <div className="wa-tooltip-sub">
                        <span className="wa-tooltip-dot" />
                        Available · Reply in minutes
                    </div>
                </div>
            )}

            {/* Main button */}
            {isVisible && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`wa-btn ${isVisible ? 'visible' : ''}`}
                    onClick={handleClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    aria-label="Chat with us on WhatsApp for event planning services"
                    title="Chat on WhatsApp — Event Planning Services"
                >
                    {/* Pulse rings */}
                    <span className="wa-ring" aria-hidden="true" />
                    <span className="wa-ring" aria-hidden="true" />
                    <span className="wa-ring" aria-hidden="true" />

                    {/* Notification badge */}
                    <span className="wa-badge" aria-hidden="true">1</span>

                    {/* Icon */}
                    <FaWhatsapp size={26} className="wa-icon" aria-hidden="true" />

                    {/* Click ripples */}
                    {ripples.map(r => (
                        <span
                            key={r.id}
                            className="wa-ripple-el"
                            style={{ left: r.x - 7, top: r.y - 7 }}
                            aria-hidden="true"
                        />
                    ))}
                </a>
            )}
        </>
    );
};

export default WhatsAppFloat;