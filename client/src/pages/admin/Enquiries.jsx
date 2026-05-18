import { useEffect, useState, useCallback } from 'react';
import { FaWhatsapp, FaCheck, FaSearch, FaFilter, FaSort, FaDownload, FaPhone, FaCalendarAlt, FaUser, FaClock, FaChartBar, FaBell } from 'react-icons/fa';
import api from '../../services/api';

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';

/* ── Inline styles (no Tailwind conflicts) ─────────────────────────── */
const S = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #111111 50%, #0d0d0d 100%)',
        fontFamily: "'Cormorant Garamond', 'Georgia', serif",
        color: '#f5f0e8',
        padding: '0',
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
    crownIcon: {
        fontSize: '1.5rem',
        marginRight: '0.5rem',
        filter: 'drop-shadow(0 0 6px #d4af37)',
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
    exportBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.5rem 1.1rem',
        background: 'linear-gradient(135deg, #d4af37, #b8941f)',
        border: 'none',
        borderRadius: '6px',
        color: '#0a0a0a',
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
    /* ── Stats Row ── */
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
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
        transition: 'border-color 0.3s, transform 0.3s',
        cursor: 'default',
    },
    statLabel: {
        fontSize: '0.7rem',
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
        fontSize: '0.7rem',
        color: 'rgba(245,240,232,0.35)',
    },
    /* ── Toolbar ── */
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
        color: 'rgba(212,175,55,0.45)',
        pointerEvents: 'none',
        fontSize: '0.85rem',
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
    /* ── Table card ── */
    tableCard: {
        background: 'linear-gradient(180deg, #141408 0%, #0e0e06 100%)',
        border: '1px solid rgba(212,175,55,0.18)',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.06)',
    },
    tableWrap: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.88rem',
    },
    thead: {
        background: 'linear-gradient(90deg, #1a1500, #0f0f00, #1a1500)',
    },
    th: {
        padding: '1rem 1.1rem',
        textAlign: 'left',
        fontSize: '0.68rem',
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
    thRight: {
        textAlign: 'right',
    },
    td: {
        padding: '1rem 1.1rem',
        borderBottom: '1px solid rgba(212,175,55,0.06)',
        color: 'rgba(245,240,232,0.82)',
        verticalAlign: 'middle',
        transition: 'color 0.2s',
    },
    tdRight: {
        textAlign: 'right',
    },
    /* badges */
    badgeContacted: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.22rem 0.65rem',
        background: 'rgba(34,197,94,0.1)',
        border: '1px solid rgba(34,197,94,0.25)',
        borderRadius: '20px',
        color: '#4ade80',
        fontSize: '0.72rem',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
    },
    badgePending: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.22rem 0.65rem',
        background: 'rgba(212,175,55,0.1)',
        border: '1px solid rgba(212,175,55,0.25)',
        borderRadius: '20px',
        color: '#d4af37',
        fontSize: '0.72rem',
        fontWeight: '600',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
    },
    /* action btns */
    waBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'rgba(37,211,102,0.1)',
        border: '1px solid rgba(37,211,102,0.2)',
        color: '#25d366',
        transition: 'all 0.22s ease',
        textDecoration: 'none',
        fontSize: '0.9rem',
    },
    markBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.28rem 0.7rem',
        background: 'rgba(212,175,55,0.08)',
        border: '1px solid rgba(212,175,55,0.22)',
        borderRadius: '7px',
        color: '#d4af37',
        fontSize: '0.72rem',
        fontWeight: '700',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        fontFamily: "'Cormorant Garamond', serif",
    },
    emptyState: {
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'rgba(212,175,55,0.35)',
    },
    /* skeleton */
    skeletonRow: {
        borderBottom: '1px solid rgba(212,175,55,0.06)',
        padding: '1rem 1.1rem',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    skeletonBar: {
        height: '12px',
        borderRadius: '6px',
        background: 'linear-gradient(90deg, rgba(212,175,55,0.06) 0%, rgba(212,175,55,0.12) 50%, rgba(212,175,55,0.06) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    },
    /* toast */
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
    /* footer note */
    footerNote: {
        textAlign: 'center',
        marginTop: '2rem',
        fontSize: '0.72rem',
        color: 'rgba(212,175,55,0.28)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    },
};

/* ── Keyframe injection ──────────────────────────────────────────────── */
const injectStyles = () => {
    if (document.getElementById('eq-styles')) return;
    const style = document.createElement('style');
    style.id = 'eq-styles';
    style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap');
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.55} }
    .eq-row { animation: fadeIn 0.4s ease both; }
    .eq-row:hover td { color: rgba(245,240,232,1) !important; background: rgba(212,175,55,0.03); }
    .eq-statcard:hover { border-color: rgba(212,175,55,0.45) !important; transform: translateY(-2px); }
    .eq-wa:hover   { background: rgba(37,211,102,0.22) !important; border-color: rgba(37,211,102,0.5) !important; transform: scale(1.12); }
    .eq-mark:hover { background: rgba(212,175,55,0.18) !important; border-color: rgba(212,175,55,0.55) !important; color: #f5e17a !important; }
    .eq-export:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(212,175,55,0.35); }
    .eq-th:hover   { color: #d4af37 !important; }
    .eq-search:focus { border-color: rgba(212,175,55,0.5) !important; box-shadow: 0 0 0 3px rgba(212,175,55,0.07); }
    .eq-select:focus { border-color: rgba(212,175,55,0.5) !important; }
    .eq-pending-pulse { animation: pulse 2.2s ease infinite; }
    @media (max-width: 640px) {
      .eq-hide-sm { display: none !important; }
    }
  `;
    document.head.appendChild(style);
};

/* ── Helpers ─────────────────────────────────────────────────────────── */
const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const EVENT_TYPES = ['All Events', 'Wedding', 'Birthday', 'Corporate', 'Anniversary', 'Engagement', 'Other'];

/* ── Component ───────────────────────────────────────────────────────── */
const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [eventFilter, setEventFilter] = useState('All Events');
    const [sortField, setSortField] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [toast, setToast] = useState('');
    const [markingId, setMarkingId] = useState(null);

    useEffect(() => { injectStyles(); }, []);

    const fetchEnquiries = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/enquiries');
            setEnquiries(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchEnquiries(); }, [fetchEnquiries]);

    const markContacted = async (id) => {
        setMarkingId(id);
        try {
            await api.put(`/enquiries/${id}`, { contacted: true });
            setEnquiries(prev => prev.map(e => e._id === id ? { ...e, contacted: true } : e));
            showToast('✦  Marked as contacted');
        } catch {
            showToast('Failed to update — try again');
        } finally {
            setMarkingId(null);
        }
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const handleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const exportCSV = () => {
        const header = ['Name', 'Phone', 'Event Type', 'Event Date', 'Status'];
        const rows = filtered.map(e => [
            e.name, e.phone, e.eventType,
            fmt(e.eventDate),
            e.contacted ? 'Contacted' : 'Pending'
        ]);
        const csv = [header, ...rows].map(r => r.map(c => `"${c ?? ''}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `enquiries-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
        showToast('✦  CSV exported successfully');
    };

    /* ── Derived data ── */
    const total = enquiries.length;
    const contacted = enquiries.filter(e => e.contacted).length;
    const pending = total - contacted;
    const rate = total ? Math.round((contacted / total) * 100) : 0;

    const filtered = enquiries
        .filter(e => {
            const q = search.toLowerCase();
            const matchSearch = !q || e.name?.toLowerCase().includes(q) || e.phone?.includes(q) || e.eventType?.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'all' || (statusFilter === 'pending' ? !e.contacted : e.contacted);
            const matchEvent = eventFilter === 'All Events' || e.eventType === eventFilter;
            return matchSearch && matchStatus && matchEvent;
        })
        .sort((a, b) => {
            let va = a[sortField] ?? ''; let vb = b[sortField] ?? '';
            if (sortField === 'eventDate' || sortField === 'createdAt') { va = new Date(va); vb = new Date(vb); }
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const sortIcon = (field) => sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ⇅';

    return (
        <div style={S.page}>
            {/* ── Header ── */}
            <header style={S.header}>
                <div style={S.headerInner}>
                    <div>
                        <h1 style={S.pageTitle}>
                            <span style={S.crownIcon}>✦</span>
                            Enquiry Management
                        </h1>
                        <p style={S.subtitle}>Client Enquiries &amp; Lead Tracker</p>
                    </div>
                    <button className="eq-export" style={S.exportBtn} onClick={exportCSV} title="Export enquiries to CSV">
                        <FaDownload size={11} /> Export CSV
                    </button>
                </div>
            </header>

            <main style={S.body}>
                {/* ── Stats ── */}
                <div style={S.statsGrid}>
                    {[
                        { icon: <FaChartBar />, label: 'Total Enquiries', value: total, sub: 'All time leads' },
                        { icon: <FaClock />, label: 'Pending', value: pending, sub: 'Awaiting contact' },
                        { icon: <FaCheck />, label: 'Contacted', value: contacted, sub: 'Successfully reached' },
                        { icon: <FaBell />, label: 'Contact Rate', value: `${rate}%`, sub: 'Conversion progress' },
                    ].map((s, i) => (
                        <div
                            key={i}
                            className="eq-statcard"
                            style={{ ...S.statCard, animationDelay: `${i * 0.07}s`, animation: 'fadeIn 0.5s ease both' }}
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
                            className="eq-search"
                            style={S.searchInput}
                            placeholder="Search by name, phone, or event…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            aria-label="Search enquiries"
                        />
                    </div>
                    <select
                        className="eq-select"
                        style={S.select}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        aria-label="Filter by status"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                    </select>
                    <select
                        className="eq-select"
                        style={{ ...S.select }}
                        value={eventFilter}
                        onChange={e => setEventFilter(e.target.value)}
                        aria-label="Filter by event type"
                    >
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                {/* ── Table ── */}
                <div style={S.tableCard}>
                    <div style={S.tableWrap}>
                        <table style={S.table} aria-label="Enquiries list">
                            <thead style={S.thead}>
                                <tr>
                                    {[
                                        { label: 'Client', field: 'name' },
                                        { label: 'Phone', field: 'phone' },
                                        { label: 'Event', field: 'eventType' },
                                        { label: 'Event Date', field: 'eventDate' },
                                        { label: 'Status', field: 'contacted' },
                                    ].map(col => (
                                        <th
                                            key={col.field}
                                            className="eq-th"
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
                                            {Array.from({ length: 6 }).map((__, j) => (
                                                <td key={j} style={S.td}>
                                                    <div style={{ ...S.skeletonBar, width: `${55 + Math.random() * 30}%`, animationDelay: `${i * 0.1}s` }} />
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={S.td}>
                                            <div style={S.emptyState}>
                                                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>✦</div>
                                                <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.08em' }}>
                                                    {search || statusFilter !== 'all' || eventFilter !== 'All Events'
                                                        ? 'No enquiries match your filters'
                                                        : 'No enquiries received yet'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((enq, idx) => (
                                        <tr
                                            key={enq._id}
                                            className="eq-row"
                                            style={{ animationDelay: `${idx * 0.04}s` }}
                                        >
                                            {/* Name */}
                                            <td style={S.td}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                                    <div style={{
                                                        width: '30px', height: '30px', borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, #1a1500, #2a2000)',
                                                        border: '1px solid rgba(212,175,55,0.25)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.65rem', fontWeight: '700', color: '#d4af37',
                                                        flexShrink: 0,
                                                    }}>
                                                        {enq.name?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <span style={{ fontWeight: '600' }}>{enq.name}</span>
                                                </div>
                                            </td>
                                            {/* Phone */}
                                            <td style={{ ...S.td }} className="eq-hide-sm">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaPhone style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.4)' }} />
                                                    {enq.phone}
                                                </div>
                                            </td>
                                            {/* Event */}
                                            <td style={S.td}>
                                                <span style={{
                                                    padding: '0.18rem 0.55rem',
                                                    background: 'rgba(212,175,55,0.07)',
                                                    border: '1px solid rgba(212,175,55,0.15)',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem',
                                                    color: 'rgba(212,175,55,0.8)',
                                                    letterSpacing: '0.04em',
                                                }}>
                                                    {enq.eventType}
                                                </span>
                                            </td>
                                            {/* Date */}
                                            <td style={{ ...S.td }} className="eq-hide-sm">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaCalendarAlt style={{ fontSize: '0.65rem', color: 'rgba(212,175,55,0.4)' }} />
                                                    {fmt(enq.eventDate)}
                                                </div>
                                            </td>
                                            {/* Status */}
                                            <td style={S.td}>
                                                {enq.contacted ? (
                                                    <span style={S.badgeContacted}><FaCheck style={{ fontSize: '0.6rem' }} /> Contacted</span>
                                                ) : (
                                                    <span style={S.badgePending} className="eq-pending-pulse">
                                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#d4af37', display: 'inline-block' }} />
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            {/* Actions */}
                                            <td style={{ ...S.td, ...S.tdRight }}>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                    <a
                                                        className="eq-wa"
                                                        style={S.waBtn}
                                                        href={`https://wa.me/${enq.phone.replace(/^\+/, '')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title={`WhatsApp ${enq.name}`}
                                                        aria-label={`Chat with ${enq.name} on WhatsApp`}
                                                    >
                                                        <FaWhatsapp />
                                                    </a>
                                                    {!enq.contacted && (
                                                        <button
                                                            className="eq-mark"
                                                            style={{ ...S.markBtn, opacity: markingId === enq._id ? 0.6 : 1 }}
                                                            onClick={() => markContacted(enq._id)}
                                                            disabled={markingId === enq._id}
                                                            title="Mark this enquiry as contacted"
                                                        >
                                                            {markingId === enq._id ? '…' : '✦ Mark Done'}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Table footer count ── */}
                    {!loading && filtered.length > 0 && (
                        <div style={{
                            padding: '0.75rem 1.25rem',
                            borderTop: '1px solid rgba(212,175,55,0.08)',
                            fontSize: '0.72rem',
                            color: 'rgba(212,175,55,0.38)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span>Showing {filtered.length} of {total} enquiries</span>
                            <span>{pending} pending · {contacted} contacted</span>
                        </div>
                    )}
                </div>

                <p style={S.footerNote}>All enquiry data is confidential · Handle with discretion</p>
            </main>

            {/* ── Toast ── */}
            {toast && (
                <div style={S.toast} role="status" aria-live="polite">
                    <span>{toast}</span>
                </div>
            )}
        </div>
    );
};

export default Enquiries;