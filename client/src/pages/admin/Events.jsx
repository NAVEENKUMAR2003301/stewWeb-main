import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaCalendarAlt, FaLayerGroup, FaChartBar, FaClock, FaDownload, FaFilter } from 'react-icons/fa';
import api from '../../services/api';

/* ── Keyframe injection ─────────────────────────────────────────────── */
const injectStyles = () => {
    if (document.getElementById('ae-styles')) return;
    const style = document.createElement('style');
    style.id = 'ae-styles';
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
    @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes fadeIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
    @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
    .ae-row { animation: fadeIn 0.4s ease both; }
    .ae-row:hover td   { background: rgba(212,175,55,0.03); color: rgba(245,240,232,1) !important; }
    .ae-statcard:hover { border-color: rgba(212,175,55,0.45) !important; transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.5); }
    .ae-addbtn:hover   { filter: brightness(1.18); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.38); }
    .ae-editbtn:hover  { background: rgba(212,175,55,0.2) !important; border-color: rgba(212,175,55,0.55) !important; color: #f5e17a !important; transform: scale(1.1); }
    .ae-delbtn:hover   { background: rgba(239,68,68,0.2) !important; border-color: rgba(239,68,68,0.5) !important; color: #f87171 !important; transform: scale(1.1); }
    .ae-exportbtn:hover{ filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(212,175,55,0.25); }
    .ae-th:hover       { color: #d4af37 !important; }
    .ae-search:focus   { border-color: rgba(212,175,55,0.5) !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.07); }
    .ae-select:focus   { border-color: rgba(212,175,55,0.5) !important; }
    .ae-modal-overlay  { animation: fadeIn 0.2s ease; }
    .ae-modal-box      { animation: scaleIn 0.25s ease; }
    .ae-past-pulse     { animation: pulse 2.5s ease infinite; }
    @media (max-width: 640px) {
      .ae-hide-sm { display: none !important; }
    }
  `;
    document.head.appendChild(style);
};

/* ── Helpers ────────────────────────────────────────────────────────── */
const fmt = (iso) => iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

const CATEGORIES = ['All Categories', 'Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Other'];

/* ── Styles object ──────────────────────────────────────────────────── */
const S = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)',
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        color: '#f5f0e8',
    },
    header: {
        background: 'linear-gradient(180deg, #1a1500 0%, #0d0a00 100%)',
        borderBottom: '1px solid rgba(212,175,55,0.25)',
        padding: '2rem 2.5rem 1.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
    },
    headerInner: {
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    pageTitle: {
        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
        fontWeight: '700',
        letterSpacing: '0.04em',
        background: 'linear-gradient(135deg, #d4af37 0%, #f5e17a 50%, #b8941f 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: 0,
        lineHeight: 1.1,
    },
    subtitle: {
        fontSize: '0.78rem',
        color: 'rgba(212,175,55,0.6)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginTop: '0.2rem',
    },
    headerActions: {
        display: 'flex',
        gap: '0.65rem',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    addBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.55rem 1.2rem',
        background: 'linear-gradient(135deg, #d4af37, #b8941f)',
        border: 'none',
        borderRadius: '8px',
        color: '#0a0a0a',
        fontWeight: '700',
        fontSize: '0.8rem',
        letterSpacing: '0.08em',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.25s ease',
        fontFamily: "'Cormorant Garamond', serif",
        textDecoration: 'none',
    },
    exportBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.52rem 1rem',
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: '8px',
        color: '#d4af37',
        fontWeight: '700',
        fontSize: '0.78rem',
        letterSpacing: '0.08em',
        cursor: 'pointer',
        textTransform: 'uppercase',
        transition: 'all 0.25s ease',
        fontFamily: "'Cormorant Garamond', serif",
    },
    body: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 2rem 4rem',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
    },
    statCard: {
        background: 'linear-gradient(145deg, #1a1a0d, #111108)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '10px',
        padding: '1.1rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
        transition: 'all 0.3s ease',
        cursor: 'default',
    },
    statLabel: {
        fontSize: '0.68rem',
        color: 'rgba(212,175,55,0.55)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
    },
    statValue: {
        fontSize: '1.8rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #d4af37, #f5e17a)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: 1,
    },
    statSub: {
        fontSize: '0.68rem',
        color: 'rgba(245,240,232,0.3)',
    },
    toolbar: {
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    searchWrap: {
        position: 'relative',
        flex: '1',
        minWidth: '200px',
    },
    searchIcon: {
        position: 'absolute',
        left: '0.85rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(212,175,55,0.4)',
        pointerEvents: 'none',
        fontSize: '0.8rem',
    },
    searchInput: {
        width: '100%',
        paddingLeft: '2.3rem',
        paddingRight: '1rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem',
        background: 'rgba(212,175,55,0.04)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '8px',
        color: '#f5f0e8',
        fontSize: '0.85rem',
        outline: 'none',
        fontFamily: "'Cormorant Garamond', serif",
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
    },
    select: {
        padding: '0.6rem 0.9rem',
        background: 'rgba(212,175,55,0.04)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '8px',
        color: '#f5f0e8',
        fontSize: '0.82rem',
        outline: 'none',
        fontFamily: "'Cormorant Garamond', serif",
        cursor: 'pointer',
        transition: 'border-color 0.3s',
    },
    tableCard: {
        background: 'linear-gradient(180deg, #141408 0%, #0e0e06 100%)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)',
    },
    tableWrap: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' },
    thead: { background: 'linear-gradient(90deg, #1a1500, #0f0f00, #1a1500)' },
    th: {
        padding: '1rem 1.1rem',
        textAlign: 'left',
        fontSize: '0.67rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(212,175,55,0.65)',
        fontWeight: '700',
        whiteSpace: 'nowrap',
        borderBottom: '1px solid rgba(212,175,55,0.12)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color 0.2s',
    },
    thRight: { textAlign: 'right' },
    td: {
        padding: '1rem 1.1rem',
        borderBottom: '1px solid rgba(212,175,55,0.06)',
        color: 'rgba(245,240,232,0.82)',
        verticalAlign: 'middle',
        transition: 'all 0.2s',
    },
    tdRight: { textAlign: 'right' },
    skeletonBar: {
        height: '12px',
        borderRadius: '6px',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.12) 50%, rgba(212,175,55,0.06) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    },
    editBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.2)',
        color: '#d4af37',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        textDecoration: 'none',
        fontSize: '0.82rem',
    },
    delBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.2)',
        color: '#f87171',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        fontSize: '0.8rem',
    },
    badgePast: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.6rem',
        background: 'rgba(148,163,184,0.1)',
        border: '1px solid rgba(148,163,184,0.22)',
        borderRadius: '20px',
        color: '#94a3b8',
        fontSize: '0.7rem',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
    },
    badgeUpcoming: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.6rem',
        background: 'rgba(212,175,55,0.1)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: '20px',
        color: '#d4af37',
        fontSize: '0.7rem',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
    },
    emptyState: {
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'rgba(212,175,55,0.35)',
    },
    tableFooter: {
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid rgba(212,175,55,0.08)',
        fontSize: '0.72rem',
        color: 'rgba(212,175,55,0.38)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    /* Confirm Modal */
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
    },
    modalBox: {
        background: 'linear-gradient(145deg, #1a1a0d, #111108)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '14px',
        padding: '2rem',
        maxWidth: '380px',
        width: '90%',
        boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
        textAlign: 'center',
    },
    modalIcon: {
        fontSize: '2.2rem',
        marginBottom: '1rem',
        display: 'block',
    },
    modalTitle: {
        fontSize: '1.15rem',
        fontWeight: '700',
        color: '#f5f0e8',
        marginBottom: '0.4rem',
        letterSpacing: '0.03em',
    },
    modalSub: {
        fontSize: '0.82rem',
        color: 'rgba(245,240,232,0.45)',
        marginBottom: '1.5rem',
        lineHeight: 1.5,
    },
    modalActions: {
        display: 'flex',
        gap: '0.75rem',
        justifyContent: 'center',
    },
    cancelBtn: {
        padding: '0.55rem 1.4rem',
        background: 'rgba(212,175,55,0.07)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '8px',
        color: '#d4af37',
        fontWeight: '600',
        fontSize: '0.82rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: '0.05em',
    },
    confirmDelBtn: {
        padding: '0.55rem 1.4rem',
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        border: 'none',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: '700',
        fontSize: '0.82rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: '0.05em',
    },
    toast: {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: 'linear-gradient(135deg, #1a1500, #0d0a00)',
        border: '1px solid rgba(212,175,55,0.4)',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        color: '#d4af37',
        fontSize: '0.82rem',
        fontWeight: '600',
        letterSpacing: '0.05em',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 999,
        animation: 'slideUp 0.35s ease',
    },
    footerNote: {
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.72rem',
        color: 'rgba(212,175,55,0.28)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
};

/* ── Component ───────────────────────────────────────────────────────── */
const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategory] = useState('All Categories');
    const [timeFilter, setTimeFilter] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortDir, setSortDir] = useState('desc');
    const [confirmId, setConfirmId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState('');

    useEffect(() => { injectStyles(); }, []);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/events');
            setEvents(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleDelete = async () => {
        if (!confirmId) return;
        setDeletingId(confirmId);
        setConfirmId(null);
        try {
            await api.delete(`/events/${confirmId}`);
            setEvents(prev => prev.filter(e => e._id !== confirmId));
            showToast('✦  Event deleted successfully');
        } catch {
            showToast('Failed to delete — try again');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const exportCSV = () => {
        const header = ['Title', 'Date', 'Category', 'Status'];
        const rows = filtered.map(e => [
            e.title,
            fmt(e.date),
            e.category,
            e.isPast ? 'Past' : 'Upcoming',
        ]);
        const csv = [header, ...rows].map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `events-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
        showToast('✦  CSV exported successfully');
    };

    /* ── Derived ── */
    const total = events.length;
    const upcoming = events.filter(e => !e.isPast).length;
    const past = events.filter(e => e.isPast).length;
    const cats = [...new Set(events.map(e => e.category).filter(Boolean))].length;

    const filtered = events
        .filter(e => {
            const q = search.toLowerCase();
            const matchSearch = !q || e.title?.toLowerCase().includes(q) || e.category?.toLowerCase().includes(q);
            const matchCat = categoryFilter === 'All Categories' || e.category === categoryFilter;
            const matchTime = timeFilter === 'all' || (timeFilter === 'upcoming' ? !e.isPast : e.isPast);
            return matchSearch && matchCat && matchTime;
        })
        .sort((a, b) => {
            let va = a[sortField] ?? ''; let vb = b[sortField] ?? '';
            if (sortField === 'date') { va = new Date(va); vb = new Date(vb); }
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const sortIcon = (f) => sortField === f ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ⇅';
    const confirmEvent = events.find(e => e._id === confirmId);

    return (
        <div style={S.page}>
            {/* ── Header ── */}
            <header style={S.header}>
                <div style={S.headerInner}>
                    <div>
                        <h1 style={S.pageTitle}>✦ Event Management</h1>
                        <p style={S.subtitle}>Curate &amp; manage your event portfolio</p>
                    </div>
                    <div style={S.headerActions}>
                        <button className="ae-exportbtn" style={S.exportBtn} onClick={exportCSV} title="Export to CSV">
                            <FaDownload size={11} /> Export
                        </button>
                        <Link className="ae-addbtn" style={S.addBtn} to="/admin/events/new" title="Create a new event">
                            <FaPlus size={11} /> Add Event
                        </Link>
                    </div>
                </div>
            </header>

            <main style={S.body}>
                {/* ── Stats ── */}
                <div style={S.statsGrid}>
                    {[
                        { icon: <FaChartBar />, label: 'Total Events', value: total, sub: 'All time' },
                        { icon: <FaClock />, label: 'Upcoming', value: upcoming, sub: 'Scheduled ahead' },
                        { icon: <FaCalendarAlt />, label: 'Past Events', value: past, sub: 'Completed' },
                        { icon: <FaLayerGroup />, label: 'Categories', value: cats, sub: 'Distinct types' },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="ae-statcard"
                            style={{ ...S.statCard, animation: 'fadeIn 0.5s ease both', animationDelay: `${i * 0.07}s` }}
                        >
                            <div style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.85rem', marginBottom: '0.1rem' }}>{s.icon}</div>
                            <div style={S.statLabel}>{s.label}</div>
                            <div style={S.statValue}>{loading ? '—' : s.value}</div>
                            <div style={S.statSub}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Toolbar ── */}
                <div style={S.toolbar}>
                    <div style={S.searchWrap}>
                        <FaSearch style={S.searchIcon} />
                        <input
                            className="ae-search"
                            style={S.searchInput}
                            placeholder="Search by title or category…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            aria-label="Search events"
                        />
                    </div>
                    <select
                        className="ae-select"
                        style={S.select}
                        value={timeFilter}
                        onChange={e => setTimeFilter(e.target.value)}
                        aria-label="Filter by time"
                    >
                        <option value="all">All Time</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                    </select>
                    <select
                        className="ae-select"
                        style={S.select}
                        value={categoryFilter}
                        onChange={e => setCategory(e.target.value)}
                        aria-label="Filter by category"
                    >
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                </div>

                {/* ── Table ── */}
                <div style={S.tableCard}>
                    <div style={S.tableWrap}>
                        <table style={S.table} aria-label="Events list">
                            <thead style={S.thead}>
                                <tr>
                                    {[
                                        { label: 'Event Title', field: 'title' },
                                        { label: 'Date', field: 'date' },
                                        { label: 'Category', field: 'category' },
                                        { label: 'Status', field: 'isPast' },
                                    ].map(col => (
                                        <th
                                            key={col.field}
                                            className="ae-th"
                                            style={S.th}
                                            onClick={() => handleSort(col.field)}
                                            aria-sort={sortField === col.field ? sortDir : 'none'}
                                        >
                                            {col.label}{sortIcon(col.field)}
                                        </th>
                                    ))}
                                    <th style={{ ...S.th, ...S.thRight, cursor: 'default' }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i}>
                                            {Array.from({ length: 5 }).map((__, j) => (
                                                <td key={j} style={S.td}>
                                                    <div style={{ ...S.skeletonBar, width: `${50 + Math.random() * 35}%`, animationDelay: `${i * 0.1}s` }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={S.td}>
                                            <div style={S.emptyState}>
                                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>✦</div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                                                    {search || timeFilter !== 'all' || categoryFilter !== 'All Categories'
                                                        ? 'No events match your filters'
                                                        : 'No events added yet — create your first event'}
                                                </p>
                                                {!search && timeFilter === 'all' && categoryFilter === 'All Categories' && (
                                                    <Link style={{ ...S.addBtn, display: 'inline-flex', marginTop: '1.25rem', textDecoration: 'none' }} to="/admin/events/new">
                                                        <FaPlus size={11} /> Add First Event
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((event, idx) => (
                                        <tr
                                            key={event._id}
                                            className="ae-row"
                                            style={{ animationDelay: `${idx * 0.04}s`, opacity: deletingId === event._id ? 0.4 : 1, transition: 'opacity 0.3s' }}
                                        >
                                            {/* Title */}
                                            <td style={S.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                                                        background: 'linear-gradient(135deg, #1a1500, #2a2000)',
                                                        border: '1px solid rgba(212,175,55,0.22)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.7rem', fontWeight: '700', color: '#d4af37',
                                                    }}>
                                                        {event.title?.charAt(0).toUpperCase() || '✦'}
                                                    </div>
                                                    <span style={{ fontWeight: '600' }}>{event.title}</span>
                                                </div>
                                            </td>
                                            {/* Date */}
                                            <td style={{ ...S.td }} className="ae-hide-sm">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaCalendarAlt style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.4)' }} />
                                                    {fmt(event.date)}
                                                </div>
                                            </td>
                                            {/* Category */}
                                            <td style={S.td}>
                                                <span style={{
                                                    padding: '0.18rem 0.55rem',
                                                    background: 'rgba(212,175,55,0.07)',
                                                    border: '1px solid rgba(212,175,55,0.15)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    color: 'rgba(212,175,55,0.8)',
                                                    letterSpacing: '0.04em',
                                                    textTransform: 'capitalize',
                                                }}>
                                                    {event.category}
                                                </span>
                                            </td>
                                            {/* Status */}
                                            <td style={S.td}>
                                                {event.isPast ? (
                                                    <span style={S.badgePast}>✓ Past</span>
                                                ) : (
                                                    <span style={S.badgeUpcoming} className="ae-past-pulse">
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', display: 'inline-block' }} />
                                                        Upcoming
                                                    </span>
                                                )}
                                            </td>
                                            {/* Actions */}
                                            <td style={{ ...S.td, ...S.tdRight }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <Link
                                                        className="ae-editbtn"
                                                        style={S.editBtn}
                                                        to={`/admin/events/${event._id}/edit`}
                                                        title={`Edit "${event.title}"`}
                                                        aria-label={`Edit ${event.title}`}
                                                    >
                                                        <FaEdit />
                                                    </Link>
                                                    <button
                                                        className="ae-delbtn"
                                                        style={{ ...S.delBtn, opacity: deletingId === event._id ? 0.5 : 1 }}
                                                        onClick={() => setConfirmId(event._id)}
                                                        disabled={!!deletingId}
                                                        title={`Delete "${event.title}"`}
                                                        aria-label={`Delete ${event.title}`}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table footer */}
                    {!loading && filtered.length > 0 && (
                        <div style={S.tableFooter}>
                            <span>Showing {filtered.length} of {total} events</span>
                            <span>{upcoming} upcoming · {past} past</span>
                        </div>
                    )}
                </div>

                <p style={S.footerNote}>Manage your events with care · Changes take effect immediately</p>
            </main>

            {/* ── Delete Confirm Modal ── */}
            {confirmId && (
                <div className="ae-modal-overlay" style={S.overlay} role="dialog" aria-modal="true" aria-label="Confirm delete">
                    <div className="ae-modal-box" style={S.modalBox}>
                        <span style={S.modalIcon}>🗑</span>
                        <h2 style={S.modalTitle}>Delete Event?</h2>
                        <p style={S.modalSub}>
                            You are about to permanently delete<br />
                            <strong style={{ color: '#d4af37' }}>"{confirmEvent?.title}"</strong>.<br />
                            This action cannot be undone.
                        </p>
                        <div style={S.modalActions}>
                            <button style={S.cancelBtn} onClick={() => setConfirmId(null)}>Cancel</button>
                            <button style={S.confirmDelBtn} onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Toast ── */}
            {toast && (
                <div style={S.toast} role="status" aria-live="polite">{toast}</div>
            )}
        </div>
    );
};

export default AdminEvents;