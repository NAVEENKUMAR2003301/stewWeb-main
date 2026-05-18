import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    FaTachometerAlt, FaCalendarAlt, FaFolderOpen, FaConciergeBell,
    FaEnvelope, FaFileAlt, FaCog, FaSignOutAlt, FaBars, FaTimes
} from 'react-icons/fa';

const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/admin/events', label: 'Events', icon: <FaCalendarAlt /> },
    { to: '/admin/past-events', label: 'Past Events Upload', icon: <FaFolderOpen /> },
    { to: '/admin/services', label: 'Services', icon: <FaConciergeBell /> },
    { to: '/admin/enquiries', label: 'Enquiries', icon: <FaEnvelope /> },
    { to: '/admin/report', label: 'Report', icon: <FaFileAlt /> },
    { to: '/admin/settings', label: 'Settings', icon: <FaCog /> },
];

const AdminLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutHover, setLogoutHover] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Derive current page label for the topbar breadcrumb
    const currentLink = adminLinks.find((l) => location.pathname.startsWith(l.to));
    const pageLabel = currentLink?.label ?? 'Admin';

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

                :root {
                    --gold: #C9A84C;
                    --gold-light: #E8C97A;
                    --gold-dark: #A0792A;
                    --black: #0A0A0A;
                    --black-soft: #111111;
                    --black-card: #161616;
                    --black-border: #242424;
                    --sidebar-w: 260px;
                    --topbar-h: 60px;
                    --white: #FAF8F3;
                    --white-muted: #888070;
                    --gradient-gold: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    --red-soft: #c0392b;
                }

                /* ── Layout shell ── */
                .adm-shell {
                    min-height: 100vh;
                    display: flex;
                    background: var(--black);
                    font-family: 'Montserrat', sans-serif;
                    color: var(--white);
                }

                /* ── Sidebar ── */
                .adm-sidebar {
                    position: fixed;
                    top: 0; left: 0; bottom: 0;
                    width: var(--sidebar-w);
                    background: var(--black-soft);
                    border-right: 1px solid var(--black-border);
                    display: flex;
                    flex-direction: column;
                    z-index: 40;
                    transform: translateX(-100%);
                    transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }
                .adm-sidebar.open { transform: translateX(0); }
                @media (min-width: 1024px) {
                    .adm-sidebar { position: static; transform: none !important; flex-shrink: 0; }
                }

                /* Sidebar top glow */
                .adm-sidebar::before {
                    content: '';
                    position: absolute;
                    top: -60px; left: 50%;
                    transform: translateX(-50%);
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
                    pointer-events: none;
                }

                /* Brand / logo area */
                .adm-brand {
                    padding: 28px 24px 24px;
                    border-bottom: 1px solid var(--black-border);
                    position: relative;
                }
                .adm-brand-tag {
                    font-size: 9px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: var(--gold);
                    margin-bottom: 6px;
                    opacity: 0.8;
                }
                .adm-brand-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.6rem;
                    font-weight: 700;
                    background: var(--gradient-gold);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    line-height: 1;
                }

                /* Nav */
                .adm-nav {
                    flex: 1;
                    padding: 20px 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    overflow-y: auto;
                    scrollbar-width: none;
                }
                .adm-nav::-webkit-scrollbar { display: none; }

                .adm-nav-label {
                    font-size: 9px;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: var(--white-muted);
                    padding: 0 12px;
                    margin-bottom: 8px;
                    margin-top: 4px;
                }

                /* Nav link */
                .adm-link {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 11px 14px;
                    border-radius: 3px;
                    font-size: 0.78rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    text-decoration: none;
                    color: var(--white-muted);
                    transition: all 0.22s ease;
                    position: relative;
                    border: 1px solid transparent;
                }
                .adm-link .adm-link-icon {
                    font-size: 0.85rem;
                    width: 18px;
                    text-align: center;
                    flex-shrink: 0;
                    transition: color 0.22s ease;
                }
                .adm-link:hover {
                    background: rgba(201,168,76,0.06);
                    color: var(--gold-light);
                    border-color: rgba(201,168,76,0.15);
                }
                .adm-link:hover .adm-link-icon { color: var(--gold); }

                /* Active state */
                .adm-link.active {
                    background: rgba(201,168,76,0.1);
                    color: var(--gold-light);
                    border-color: rgba(201,168,76,0.25);
                }
                .adm-link.active .adm-link-icon { color: var(--gold); }
                .adm-link.active::before {
                    content: '';
                    position: absolute;
                    left: 0; top: 20%; bottom: 20%;
                    width: 2px;
                    background: var(--gradient-gold);
                    border-radius: 0 2px 2px 0;
                }

                /* Logout button */
                .adm-logout {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 11px 14px;
                    border-radius: 3px;
                    font-size: 0.78rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    background: transparent;
                    color: var(--white-muted);
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.22s ease;
                    margin-top: 8px;
                }
                .adm-logout:hover {
                    background: rgba(192,57,43,0.12);
                    color: #e74c3c;
                    border-color: rgba(192,57,43,0.25);
                }
                .adm-logout .adm-link-icon { font-size: 0.85rem; width: 18px; text-align: center; flex-shrink: 0; }

                /* Sidebar footer */
                .adm-sidebar-footer {
                    padding: 16px 24px;
                    border-top: 1px solid var(--black-border);
                    font-size: 0.65rem;
                    letter-spacing: 1px;
                    color: var(--white-muted);
                    text-align: center;
                    opacity: 0.6;
                }

                /* ── Mobile Toggle Button ── */
                .adm-toggle {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 14px; left: 14px;
                    z-index: 50;
                    width: 36px; height: 36px;
                    background: var(--black-card);
                    border: 1px solid var(--black-border);
                    border-radius: 3px;
                    color: var(--gold);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }
                .adm-toggle:hover { border-color: rgba(201,168,76,0.4); background: rgba(201,168,76,0.08); }
                @media (min-width: 1024px) { .adm-toggle { display: none; } }

                /* ── Overlay ── */
                .adm-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,0.7);
                    z-index: 30;
                    backdrop-filter: blur(2px);
                    animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                /* ── Main content area ── */
                .adm-main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                    min-height: 100vh;
                }

                /* ── Top bar ── */
                .adm-topbar {
                    height: var(--topbar-h);
                    background: var(--black-soft);
                    border-bottom: 1px solid var(--black-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px 0 60px;
                    flex-shrink: 0;
                    position: sticky;
                    top: 0;
                    z-index: 20;
                }
                @media (min-width: 1024px) { .adm-topbar { padding-left: 32px; } }

                .adm-breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .adm-breadcrumb-sep {
                    color: var(--black-border);
                    font-size: 0.7rem;
                }
                .adm-breadcrumb-root {
                    font-size: 0.7rem;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: var(--white-muted);
                }
                .adm-breadcrumb-page {
                    font-size: 0.7rem;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: var(--gold);
                    font-weight: 600;
                }

                .adm-topbar-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .adm-topbar-dot {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.68rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: var(--white-muted);
                }
                .adm-status-dot {
                    width: 6px; height: 6px;
                    border-radius: 50%;
                    background: #27ae60;
                    animation: pulse-dot 2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(39,174,96,0.4); }
                    50% { box-shadow: 0 0 0 5px rgba(39,174,96,0); }
                }

                /* ── Content area ── */
                .adm-content {
                    flex: 1;
                    padding: 32px 24px;
                    overflow-y: auto;
                }
                @media (min-width: 1024px) { .adm-content { padding: 36px 40px; } }
            `}</style>

            <div className="adm-shell">

                {/* ── Mobile toggle ── */}
                <button
                    className="adm-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                >
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* ── Overlay ── */}
                {sidebarOpen && (
                    <div
                        className="adm-overlay lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* ── Sidebar ── */}
                <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Admin navigation">
                    {/* Brand */}
                    <div className="adm-brand">
                        <div className="adm-brand-tag">Control Centre</div>
                        <div className="adm-brand-title">Admin Panel</div>
                    </div>

                    {/* Nav */}
                    <nav className="adm-nav">
                        <div className="adm-nav-label">Navigation</div>
                        {adminLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) => `adm-link${isActive ? ' active' : ''}`}
                                aria-label={link.label}
                            >
                                <span className="adm-link-icon" aria-hidden="true">{link.icon}</span>
                                {link.label}
                            </NavLink>
                        ))}

                        <button
                            onClick={handleLogout}
                            className="adm-logout"
                            aria-label="Logout of admin panel"
                        >
                            <span className="adm-link-icon" aria-hidden="true"><FaSignOutAlt /></span>
                            Logout
                        </button>
                    </nav>

                    {/* Footer */}
                    <div className="adm-sidebar-footer">
                        ✦ &nbsp;Event Manager &nbsp;✦
                    </div>
                </aside>

                {/* ── Main ── */}
                <div className="adm-main">
                    {/* Top bar */}
                    <header className="adm-topbar">
                        <div className="adm-breadcrumb">
                            <span className="adm-breadcrumb-root">Admin</span>
                            <span className="adm-breadcrumb-sep" aria-hidden="true">›</span>
                            <span className="adm-breadcrumb-page">{pageLabel}</span>
                        </div>
                        <div className="adm-topbar-right">
                            <div className="adm-topbar-dot">
                                <div className="adm-status-dot" />
                                <span className="hidden sm:inline">Live</span>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="adm-content">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;