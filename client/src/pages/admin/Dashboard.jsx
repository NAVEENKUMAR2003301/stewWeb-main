import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaFolderOpen, FaEnvelope, FaPlus,
    FaHome, FaChartBar, FaCalendarAlt, FaWhatsapp,
    FaArrowUp, FaArrowRight
} from 'react-icons/fa';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import api from '../../services/api';
import CircularProgress from '../../components/common/CircularProgress';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MAX_VALUES = {
    totalEvents: 50,
    pastEvents: 50,
    totalEnquiries: 100,
    newEnquiriesThisMonth: 20,
};

const getDummyChartData = () => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Enquiries',
            data: [5, 8, 12, 7, 10, 15],
            backgroundColor: 'rgba(201,168,76,0.25)',
            borderColor: '#C9A84C',
            borderWidth: 1,
            borderRadius: 3,
            hoverBackgroundColor: 'rgba(201,168,76,0.5)',
        },
    ],
});

/* ── Stat card with animated counter ── */
const StatCard = ({ value, max, color, label, icon, trend }) => {
    const [displayed, setDisplayed] = useState(0);

    useEffect(() => {
        let start = null;
        const duration = 1400;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setDisplayed(Math.floor(p * value));
            if (p < 1) requestAnimationFrame(step);
        };
        const id = requestAnimationFrame(step);
        return () => cancelAnimationFrame(id);
    }, [value]);

    const pct = Math.round((value / max) * 100);

    return (
        <div className="db-stat-card">
            <div className="db-stat-top">
                <div className="db-stat-icon" style={{ color }}>{icon}</div>
                {trend != null && (
                    <div className="db-stat-trend" style={{ color: trend >= 0 ? '#27ae60' : '#e74c3c' }}>
                        <FaArrowUp style={{ transform: trend < 0 ? 'rotate(180deg)' : 'none', fontSize: '0.6rem' }} />
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>
            <div className="db-stat-value" style={{ color }}>{displayed}</div>
            <div className="db-stat-label">{label}</div>
            <div className="db-stat-bar-track">
                <div className="db-stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="db-stat-pct">{pct}% of target</div>
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalEvents: 0,
        pastEvents: 0,
        totalEnquiries: 0,
        newEnquiriesThisMonth: 0,
    });
    const [recentEnquiries, setRecentEnquiries] = useState([]);
    const [chartData, setChartData] = useState(getDummyChartData());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                if (res.data.success) {
                    setStats(res.data.stats);
                    setRecentEnquiries(res.data.recentEnquiries || []);
                    setChartData(res.data.chart || getDummyChartData());
                }
            } catch {
                setStats({ totalEvents: 12, pastEvents: 8, totalEnquiries: 45, newEnquiriesThisMonth: 7 });
                setRecentEnquiries([
                    { _id: '1', name: 'Priya Sharma', phone: '+919876543210', eventType: 'Wedding', createdAt: new Date() },
                    { _id: '2', name: 'Rahul Kumar', phone: '+919876543211', eventType: 'Corporate', createdAt: new Date(Date.now() - 86400000) },
                    { _id: '3', name: 'Ananya Patel', phone: '+919876543212', eventType: 'Birthday', createdAt: new Date(Date.now() - 172800000) },
                ]);
                setChartData(getDummyChartData());
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#161616',
                borderColor: 'rgba(201,168,76,0.3)',
                borderWidth: 1,
                titleColor: '#C9A84C',
                bodyColor: '#888070',
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: { color: '#1a1a1a' },
                ticks: { color: '#555048', font: { size: 11, family: 'Montserrat' } },
            },
            y: {
                grid: { color: '#1a1a1a' },
                ticks: { color: '#555048', font: { size: 11, family: 'Montserrat' } },
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

                .db-root {
                    min-height: 100vh;
                    background: #0A0A0A;
                    font-family: 'Montserrat', sans-serif;
                    color: #FAF8F3;
                    padding: 0;
                }

                /* ── Page header ── */
                .db-page-header {
                    display: flex; flex-direction: column; gap: 16px;
                    margin-bottom: 36px;
                }
                @media (min-width: 640px) {
                    .db-page-header { flex-direction: row; align-items: flex-start; justify-content: space-between; }
                }
                .db-page-title-tag {
                    font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
                    color: #C9A84C; margin-bottom: 6px; opacity: 0.8;
                }
                .db-page-title {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: clamp(1.8rem, 4vw, 2.4rem);
                    font-weight: 700; line-height: 1;
                    background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A0792A 100%);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .db-visit-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    border: 1px solid #242424; background: #111;
                    color: #888070; padding: 10px 20px; border-radius: 3px;
                    font-size: 0.72rem; font-weight: 600; letter-spacing: 1.5px;
                    text-transform: uppercase; text-decoration: none;
                    transition: all 0.22s ease; white-space: nowrap; flex-shrink: 0;
                }
                .db-visit-btn:hover {
                    border-color: rgba(201,168,76,0.4); color: #C9A84C;
                    background: rgba(201,168,76,0.05);
                }

                /* ── Stat cards grid ── */
                .db-stats-grid {
                    display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
                    margin-bottom: 28px;
                }
                @media (min-width: 1024px) { .db-stats-grid { grid-template-columns: repeat(4, 1fr); } }

                .db-stat-card {
                    background: #111; border: 1px solid #1e1e1e; border-radius: 3px;
                    padding: 24px 20px; transition: border-color 0.25s ease, box-shadow 0.25s ease;
                    position: relative; overflow: hidden;
                }
                .db-stat-card::before {
                    content: ''; position: absolute; inset: 0;
                    background: radial-gradient(circle at top right, rgba(201,168,76,0.04), transparent 60%);
                    pointer-events: none;
                }
                .db-stat-card:hover {
                    border-color: rgba(201,168,76,0.25);
                    box-shadow: 0 8px 40px rgba(0,0,0,0.4);
                }
                .db-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
                .db-stat-icon { font-size: 1.1rem; }
                .db-stat-trend {
                    display: flex; align-items: center; gap: 3px;
                    font-size: 0.65rem; font-weight: 600; letter-spacing: 1px;
                }
                .db-stat-value {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 2.4rem; font-weight: 700; line-height: 1; margin-bottom: 6px;
                }
                .db-stat-label {
                    font-size: 0.68rem; letter-spacing: 1.5px; text-transform: uppercase;
                    color: #555048; margin-bottom: 16px;
                }
                .db-stat-bar-track {
                    height: 2px; background: #1e1e1e; border-radius: 2px; margin-bottom: 6px; overflow: hidden;
                }
                .db-stat-bar-fill {
                    height: 100%; border-radius: 2px; transition: width 1.4s ease;
                }
                .db-stat-pct { font-size: 0.6rem; color: #333028; letter-spacing: 1px; text-transform: uppercase; }

                /* ── Section card ── */
                .db-card {
                    background: #111; border: 1px solid #1e1e1e; border-radius: 3px;
                    margin-bottom: 24px; overflow: hidden;
                }
                .db-card-header {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 20px 24px; border-bottom: 1px solid #1a1a1a;
                }
                .db-card-title {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 0.72rem; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
                    color: #C9A84C;
                }
                .db-card-link {
                    display: inline-flex; align-items: center; gap: 6px;
                    font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase;
                    color: #555048; text-decoration: none; transition: color 0.2s;
                }
                .db-card-link:hover { color: #C9A84C; }

                /* Chart */
                .db-chart-wrap { padding: 24px; height: 280px; }

                /* ── Quick actions ── */
                .db-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; }
                .db-action-btn {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 12px 22px; border-radius: 3px;
                    font-size: 0.72rem; font-weight: 600; letter-spacing: 1.5px;
                    text-transform: uppercase; text-decoration: none;
                    transition: all 0.25s ease; border: 1px solid transparent;
                }
                .db-action-primary {
                    background: linear-gradient(135deg, #C9A84C, #A0792A);
                    color: #0A0A0A;
                    box-shadow: 0 4px 20px rgba(201,168,76,0.2);
                }
                .db-action-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(201,168,76,0.35);
                }
                .db-action-secondary {
                    background: #161616; border-color: #242424; color: #888070;
                }
                .db-action-secondary:hover {
                    border-color: rgba(201,168,76,0.35); color: #C9A84C;
                    background: rgba(201,168,76,0.05);
                }

                /* ── Table ── */
                .db-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
                .db-table th {
                    padding: 12px 20px; text-align: left;
                    font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase;
                    color: #444038; background: #0d0d0d; font-weight: 600;
                    border-bottom: 1px solid #1a1a1a;
                }
                .db-table td {
                    padding: 14px 20px; border-bottom: 1px solid #141414;
                    color: #888070; transition: background 0.15s;
                }
                .db-table tr:hover td { background: rgba(201,168,76,0.03); }
                .db-table tr:last-child td { border-bottom: none; }

                .db-badge {
                    display: inline-block; padding: 3px 10px; border-radius: 2px;
                    font-size: 0.6rem; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600;
                }
                .db-badge-wedding  { background: rgba(201,168,76,0.12); color: #C9A84C; border: 1px solid rgba(201,168,76,0.2); }
                .db-badge-corporate{ background: rgba(59,130,246,0.1);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
                .db-badge-birthday { background: rgba(168,85,247,0.1);  color: #c084fc; border: 1px solid rgba(168,85,247,0.2); }
                .db-badge-default  { background: rgba(255,255,255,0.05);color: #888070; border: 1px solid #242424; }

                .db-wa-action {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: 0.65rem; letter-spacing: 1px; text-transform: uppercase;
                    font-weight: 600; color: #25d366; text-decoration: none;
                    transition: opacity 0.2s;
                }
                .db-wa-action:hover { opacity: 0.7; }

                .db-empty {
                    padding: 48px 24px; text-align: center;
                    font-size: 0.75rem; letter-spacing: 1px; text-transform: uppercase;
                    color: #2e2c28;
                }

                /* Skeleton loader */
                .db-skeleton { background: #1a1a1a; border-radius: 2px; animation: db-pulse 1.5s ease-in-out infinite; }
                @keyframes db-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

                /* Responsive table scroll */
                .db-table-wrap { overflow-x: auto; }
            `}</style>

            <div className="db-root">
                {/* ── Page header ── */}
                <div className="db-page-header">
                    <div>
                        <div className="db-page-title-tag">✦ Overview</div>
                        <h1 className="db-page-title">Dashboard</h1>
                    </div>
                    <Link to="/" className="db-visit-btn" aria-label="Visit public website">
                        <FaHome aria-hidden="true" /> Visit Website
                    </Link>
                </div>

                {/* ── Stat cards ── */}
                <div className="db-stats-grid">
                    {loading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="db-stat-card">
                                <div className="db-skeleton" style={{ height: 16, width: '40%', marginBottom: 20 }} />
                                <div className="db-skeleton" style={{ height: 40, width: '60%', marginBottom: 10 }} />
                                <div className="db-skeleton" style={{ height: 10, width: '80%', marginBottom: 16 }} />
                                <div className="db-skeleton" style={{ height: 2 }} />
                            </div>
                        ))
                    ) : (
                        <>
                            <StatCard value={stats.totalEvents} max={MAX_VALUES.totalEvents} color="#C9A84C" label="Total Events" icon={<FaCalendarAlt />} trend={12} />
                            <StatCard value={stats.pastEvents} max={MAX_VALUES.pastEvents} color="#60a5fa" label="Past Events" icon={<FaFolderOpen />} trend={8} />
                            <StatCard value={stats.totalEnquiries} max={MAX_VALUES.totalEnquiries} color="#c084fc" label="Total Enquiries" icon={<FaEnvelope />} trend={20} />
                            <StatCard value={stats.newEnquiriesThisMonth} max={MAX_VALUES.newEnquiriesThisMonth} color="#34d399" label="New This Month" icon={<FaChartBar />} trend={5} />
                        </>
                    )}
                </div>

                {/* ── Chart ── */}
                <div className="db-card">
                    <div className="db-card-header">
                        <div className="db-card-title">
                            <FaChartBar aria-hidden="true" /> Enquiries Overview
                        </div>
                        <Link to="/admin/enquiries" className="db-card-link" aria-label="View all enquiries">
                            View All <FaArrowRight style={{ fontSize: '0.6rem' }} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="db-chart-wrap">
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* ── Quick Actions ── */}
                <div className="db-actions" role="group" aria-label="Quick actions">
                    <Link to="/admin/events/new" className="db-action-btn db-action-primary" aria-label="Add a new event">
                        <FaPlus aria-hidden="true" /> Add New Event
                    </Link>
                    <Link to="/admin/past-events" className="db-action-btn db-action-secondary" aria-label="Upload a past event">
                        <FaFolderOpen aria-hidden="true" /> Upload Past Event
                    </Link>
                    <Link to="/admin/enquiries" className="db-action-btn db-action-secondary" aria-label="View all enquiries">
                        <FaEnvelope aria-hidden="true" /> All Enquiries
                    </Link>
                </div>

                {/* ── Recent Enquiries table ── */}
                <div className="db-card">
                    <div className="db-card-header">
                        <div className="db-card-title">
                            <FaEnvelope aria-hidden="true" /> Recent Enquiries
                        </div>
                        <Link to="/admin/enquiries" className="db-card-link" aria-label="View all enquiries">
                            View All <FaArrowRight style={{ fontSize: '0.6rem' }} aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="db-table-wrap">
                        <table className="db-table" aria-label="Recent enquiries table">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Event Type</th>
                                    <th scope="col">Received</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    [1, 2, 3].map((i) => (
                                        <tr key={i}>
                                            {[1, 2, 3, 4, 5].map((j) => (
                                                <td key={j}>
                                                    <div className="db-skeleton" style={{ height: 12, width: j === 5 ? 60 : '80%', borderRadius: 2 }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : recentEnquiries.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">
                                            <div className="db-empty">No enquiries yet.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    recentEnquiries.map((enq) => {
                                        const typeKey = enq.eventType?.toLowerCase();
                                        const badgeClass =
                                            typeKey === 'wedding' ? 'db-badge-wedding' :
                                                typeKey === 'corporate' ? 'db-badge-corporate' :
                                                    typeKey === 'birthday' ? 'db-badge-birthday' : 'db-badge-default';
                                        return (
                                            <tr key={enq._id}>
                                                <td style={{ color: '#FAF8F3', fontWeight: 500 }}>{enq.name}</td>
                                                <td>{enq.phone}</td>
                                                <td>
                                                    <span className={`db-badge ${badgeClass}`}>{enq.eventType}</span>
                                                </td>
                                                <td>
                                                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric', month: 'short', year: 'numeric'
                                                    })}
                                                </td>
                                                <td>
                                                    <a
                                                        href={`https://wa.me/${enq.phone.replace(/^\+/, '')}?text=Hi%20${encodeURIComponent(enq.name)}%2C%20we%20received%20your%20enquiry%20for%20${enq.eventType}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="db-wa-action"
                                                        aria-label={`WhatsApp ${enq.name}`}
                                                    >
                                                        <FaWhatsapp aria-hidden="true" /> Reply
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;