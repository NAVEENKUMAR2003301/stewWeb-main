import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaPlus, FaTrash, FaEdit, FaCloudUploadAlt, FaImages, FaSpinner, FaCheckCircle, FaTimes, FaSearch, FaLayerGroup } from 'react-icons/fa';
import api, { uploadSingleImage, uploadMultipleImages } from '../../services/api';

/* ─── Design Tokens ──────────────────────────────────────────────────── */
const S = {
    gold: '#C9A84C',
    goldLight: '#E8C97A',
    goldDark: '#8B6914',
    goldGlow: 'rgba(201,168,76,0.15)',
    black: '#0A0A0B',
    blackSoft: '#111113',
    blackCard: '#16161A',
    blackBorder: '#2A2A30',
    blackHover: '#1E1E24',
    textPrimary: '#F5F0E8',
    textMuted: '#8A8490',
    textGold: '#C9A84C',
    danger: '#E05252',
    dangerGlow: 'rgba(224,82,82,0.12)',
    blue: '#5B8EE6',
    blueGlow: 'rgba(91,142,230,0.12)',
};

/* ─── Shared Styles ──────────────────────────────────────────────────── */
const inputBase = {
    background: '#0F0F13',
    border: `1px solid ${S.blackBorder}`,
    borderRadius: '10px',
    color: S.textPrimary,
    padding: '13px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.25s, box-shadow 0.25s',
};

const labelSt = {
    display: 'flex', alignItems: 'center', gap: '7px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '0.1em',
    textTransform: 'uppercase', color: S.textGold, marginBottom: '7px',
};

const sectionHead = {
    display: 'flex', alignItems: 'center', gap: '10px',
    fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em',
    textTransform: 'uppercase', color: S.gold,
    marginBottom: '20px', paddingBottom: '12px',
    borderBottom: `1px solid ${S.blackBorder}`,
};

/* ─── Focus-aware input/textarea/select ─────────────────────────────── */
const FI = ({ tag: Tag = 'input', style = {}, ...props }) => {
    const [f, setF] = useState(false);
    return (
        <Tag {...props}
            style={{ ...inputBase, ...style, borderColor: f ? S.gold : S.blackBorder, boxShadow: f ? `0 0 0 3px ${S.goldGlow}` : 'none' }}
            onFocus={() => setF(true)} onBlur={() => setF(false)} />
    );
};

/* ─── Gold ornament divider ──────────────────────────────────────────── */
const GoldDivider = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0 22px' }}>
        <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
        <div style={{ width: '5px', height: '5px', background: S.gold, transform: 'rotate(45deg)' }} />
        <div style={{ flex: 1, height: '1px', background: S.blackBorder }} />
    </div>
);

/* ─── Icon Picker ────────────────────────────────────────────────────── */
const ICONS = ['🎉', '💍', '🥂', '🎂', '🎊', '🌸', '🏆', '🎭', '📸', '🎵', '🎬', '✨', '🌟', '💎', '🕊️', '🌺'];
const IconPicker = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ position: 'relative' }}>
            <label style={labelSt}>Icon / Emoji</label>
            <button type="button" onClick={() => setOpen(o => !o)} style={{
                ...inputBase, cursor: 'pointer', fontSize: '22px', textAlign: 'center',
                borderColor: open ? S.gold : S.blackBorder,
                display: 'flex', alignItems: 'center', gap: '10px',
            }}>
                <span>{value}</span>
                <span style={{ fontSize: '11px', color: S.textMuted, marginLeft: 'auto' }}>tap to change</span>
            </button>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50,
                    background: S.blackCard, border: `1px solid ${S.blackBorder}`,
                    borderRadius: '12px', padding: '12px', display: 'flex', flexWrap: 'wrap',
                    gap: '6px', width: '260px', boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
                    animation: 'fadeSlideIn 0.2s ease',
                }}>
                    {ICONS.map(ic => (
                        <button key={ic} type="button" onClick={() => { onChange(ic); setOpen(false); }} style={{
                            fontSize: '22px', background: value === ic ? S.goldGlow : 'transparent',
                            border: `1px solid ${value === ic ? S.gold : 'transparent'}`,
                            borderRadius: '8px', width: '40px', height: '40px', cursor: 'pointer',
                            transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{ic}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ─── DropZone Card ──────────────────────────────────────────────────── */
const DropCard = ({ rootProps, inputProps, isDrag, children, minH = 150 }) => (
    <div {...rootProps} style={{
        border: `2px dashed ${isDrag ? S.gold : S.blackBorder}`,
        borderRadius: '12px', padding: '22px 16px', textAlign: 'center', cursor: 'pointer',
        background: isDrag ? S.goldGlow : '#0F0F13', minHeight: minH,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.25s', transform: isDrag ? 'scale(1.01)' : 'scale(1)',
    }}>
        <input {...inputProps} />
        {children}
    </div>
);

/* ─── Spinner ────────────────────────────────────────────────────────── */
const Spin = () => <FaSpinner style={{ animation: 'spin 1s linear infinite', display: 'inline-block', marginRight: '7px' }} />;

/* ─── Confirm Modal ──────────────────────────────────────────────────── */
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
        animation: 'fadeSlideIn 0.2s ease',
    }}>
        <div style={{
            background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px',
            padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center',
        }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>🗑️</div>
            <p style={{ color: S.textPrimary, fontWeight: '600', fontSize: '16px', marginBottom: '8px' }}>Delete Service?</p>
            <p style={{ color: S.textMuted, fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>{message}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button onClick={onCancel} style={{
                    flex: 1, padding: '12px', borderRadius: '10px', border: `1px solid ${S.blackBorder}`,
                    background: 'transparent', color: S.textMuted, cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: '14px', transition: 'all 0.2s',
                }}>Cancel</button>
                <button onClick={onConfirm} style={{
                    flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                    background: S.danger, color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: '14px', fontWeight: '600', transition: 'all 0.2s',
                }}>Yes, Delete</button>
            </div>
        </div>
    </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', image: '', gallery: [], icon: '🎉', price: '' });
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const [confirmDelete, setConfirmDelete] = useState(null); // service id
    const [search, setSearch] = useState('');

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchServices(); }, []);

    /* Cover dropzone */
    const onDropCover = useCallback(async (files) => {
        if (!files.length) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('image', files[0]);
            const res = await uploadSingleImage(fd);
            setForm(prev => ({ ...prev, image: res.data.url }));
        } catch { showToast('error', 'Cover image upload failed. Please try again.'); }
        finally { setUploading(false); }
    }, []);
    const { getRootProps: getCoverProps, getInputProps: getCoverInput, isDragActive: coverDrag } =
        useDropzone({ onDrop: onDropCover, accept: { 'image/*': [] }, maxFiles: 1 });

    /* Gallery dropzone */
    const onDropGallery = useCallback(async (files) => {
        if (!files.length) return;
        setUploading(true);
        try {
            const fd = new FormData();
            files.forEach(f => fd.append('images', f));
            const res = await uploadMultipleImages(fd);
            setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...res.data.urls] }));
        } catch { showToast('error', 'Gallery upload failed. Please try again.'); }
        finally { setUploading(false); }
    }, []);
    const { getRootProps: getGalleryProps, getInputProps: getGalleryInput, isDragActive: galleryDrag } =
        useDropzone({ onDrop: onDropGallery, accept: { 'image/*': [] }, multiple: true });

    const removeGalleryImage = (index) =>
        setForm(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) { showToast('error', 'Please upload a cover image first.'); return; }
        setSubmitLoading(true);
        try {
            if (editingId) {
                await api.put(`/services/${editingId}`, form);
                showToast('success', 'Service updated successfully!');
            } else {
                await api.post('/services', form);
                showToast('success', 'New service added to your portfolio!');
            }
            setForm({ title: '', description: '', image: '', gallery: [], icon: '🎉', price: '' });
            setEditingId(null);
            fetchServices();
        } catch { showToast('error', 'Something went wrong. Please try again.'); }
        finally { setSubmitLoading(false); }
    };

    const handleEdit = (service) => {
        setForm({ title: service.title, description: service.description, image: service.image, gallery: service.gallery || [], icon: service.icon, price: service.price || '' });
        setEditingId(service._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async () => {
        if (!confirmDelete) return;
        try {
            await api.delete(`/services/${confirmDelete}`);
            showToast('success', 'Service removed.');
            fetchServices();
        } catch { showToast('error', 'Delete failed.'); }
        finally { setConfirmDelete(null); }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({ title: '', description: '', image: '', gallery: [], icon: '🎉', price: '' });
    };

    const filtered = services.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        (s.price || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeSlideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
                @keyframes slideInRight { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
                @keyframes floatUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
                .admin-page * { box-sizing: border-box; }
                .admin-page select option { background:#16161A; color:#F5F0E8; }
                .admin-page input[type="date"] { color-scheme: dark; }
                .svc-row { transition: background 0.2s; }
                .svc-row:hover { background: #1A1A20 !important; }
                .icon-btn { transition: all 0.2s; border-radius: 8px; padding: 8px; border: none; cursor: pointer; display:flex; align-items:center; justify-content:center; }
                .icon-btn:hover { transform: scale(1.1); }
                .submit-btn { transition: all 0.3s; }
                .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(201,168,76,0.3); }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .gallery-img { transition: transform 0.2s, box-shadow 0.2s; }
                .gallery-img:hover { transform: scale(1.07); box-shadow: 0 4px 18px rgba(201,168,76,0.25); }
                .rm-btn { opacity:0; transition: opacity 0.2s; }
                .gal-wrap:hover .rm-btn { opacity: 1; }
                .search-input:focus { border-color: #C9A84C !important; box-shadow: 0 0 0 3px rgba(201,168,76,0.15) !important; outline: none; }
            `}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed', top: '24px', right: '24px', zIndex: 200,
                    background: toast.type === 'success' ? 'rgba(201,168,76,0.12)' : 'rgba(224,82,82,0.12)',
                    border: `1px solid ${toast.type === 'success' ? S.gold : S.danger}`,
                    borderRadius: '12px', padding: '14px 20px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    color: toast.type === 'success' ? S.goldLight : '#F08080',
                    fontSize: '14px', fontWeight: '500', fontFamily: "'DM Sans', sans-serif",
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'slideInRight 0.35s ease',
                    maxWidth: '320px',
                }}>
                    {toast.type === 'success'
                        ? <FaCheckCircle style={{ color: S.gold, flexShrink: 0 }} />
                        : <FaTimes style={{ color: S.danger, flexShrink: 0 }} />}
                    {toast.msg}
                </div>
            )}

            {/* Confirm Modal */}
            {confirmDelete && (
                <ConfirmModal
                    message="This action cannot be undone. The service will be permanently removed from your portfolio."
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}

            <div className="admin-page" style={{
                minHeight: '100vh',
                background: S.black,
                backgroundImage: `radial-gradient(ellipse at 15% 0%, rgba(201,168,76,0.05) 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, rgba(201,168,76,0.04) 0%, transparent 55%)`,
                padding: '36px 16px 80px',
                fontFamily: "'DM Sans', sans-serif",
                color: S.textPrimary,
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                    {/* ── Page Header ── */}
                    <div style={{ marginBottom: '32px', animation: 'fadeSlideIn 0.45s ease' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                            borderRadius: '30px', padding: '5px 16px', marginBottom: '14px',
                            fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: S.goldLight, fontWeight: '700',
                        }}>
                            <FaLayerGroup style={{ fontSize: '10px' }} />
                            Admin Panel
                        </div>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 'clamp(28px, 5vw, 44px)',
                            fontWeight: '700', color: S.textPrimary,
                            margin: '0 0 8px', lineHeight: 1.1, letterSpacing: '-0.01em',
                        }}>
                            Manage{' '}
                            <span style={{
                                background: `linear-gradient(135deg, ${S.goldLight}, ${S.gold})`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            }}>Services</span>
                        </h1>
                        <p style={{ color: S.textMuted, fontSize: '14px', margin: 0 }}>
                            Add, edit or remove the services you offer to clients. Changes go live instantly.
                        </p>
                    </div>

                    {/* ── Add / Edit Form ── */}
                    <div style={{
                        background: S.blackCard, border: `1px solid ${editingId ? S.goldDark : S.blackBorder}`,
                        borderRadius: '18px', padding: '28px', marginBottom: '20px',
                        boxShadow: editingId ? `0 0 0 1px ${S.goldDark}, 0 0 40px ${S.goldGlow}` : 'none',
                        animation: 'floatUp 0.4s ease',
                        transition: 'border-color 0.4s, box-shadow 0.4s',
                    }}>
                        <div style={sectionHead}>
                            {editingId ? <FaEdit style={{ color: S.gold }} /> : <FaPlus style={{ color: S.gold }} />}
                            {editingId ? 'Editing Service' : 'Add New Service'}
                            {editingId && (
                                <span style={{
                                    marginLeft: 'auto', fontSize: '10px', color: S.gold,
                                    background: S.goldGlow, border: `1px solid ${S.goldDark}`,
                                    padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.08em',
                                }}>EDIT MODE</span>
                            )}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                                <div>
                                    <label style={labelSt}>Service Title *</label>
                                    <FI placeholder="e.g. Royal Wedding Package" value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })} required />
                                </div>
                                <div>
                                    <label style={labelSt}>Price</label>
                                    <FI placeholder="e.g. ₹1,50,000" value={form.price}
                                        onChange={e => setForm({ ...form, price: e.target.value })} />
                                </div>
                                <IconPicker value={form.icon} onChange={ic => setForm({ ...form, icon: ic })} />
                            </div>

                            {/* Cover Dropzone */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelSt}><FaCloudUploadAlt />Cover Image *</label>
                                <DropCard rootProps={getCoverProps()} inputProps={getCoverInput()} isDrag={coverDrag} minH={140}>
                                    {uploading && !form.image ? (
                                        <><Spin /><span style={{ color: S.textMuted, fontSize: '13px' }}>Uploading…</span></>
                                    ) : form.image ? (
                                        <div>
                                            <img src={form.image} alt="cover" style={{ height: '100px', borderRadius: '10px', border: `2px solid ${S.gold}`, marginBottom: '8px' }} />
                                            <p style={{ color: S.goldLight, fontSize: '12px', margin: 0, display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                                                <FaCheckCircle style={{ color: S.gold }} /> Cover set — click/drop to replace
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px dashed ${S.goldDark}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                                                <FaCloudUploadAlt style={{ color: coverDrag ? S.gold : S.textMuted, fontSize: '20px' }} />
                                            </div>
                                            <p style={{ color: S.textPrimary, fontWeight: '500', fontSize: '13px', margin: '0 0 4px' }}>
                                                {coverDrag ? 'Drop it!' : 'Drag & drop cover image'}
                                            </p>
                                            <p style={{ color: S.textMuted, fontSize: '12px', margin: 0 }}>or click to browse</p>
                                        </>
                                    )}
                                </DropCard>
                            </div>

                            {/* Gallery Dropzone */}
                            <div style={{ marginBottom: '14px' }}>
                                <label style={labelSt}><FaImages />Gallery Images (optional)</label>
                                <DropCard rootProps={getGalleryProps()} inputProps={getGalleryInput()} isDrag={galleryDrag} minH={100}>
                                    {form.gallery.length > 0 ? (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
                                                {form.gallery.map((url, idx) => (
                                                    <div key={idx} className="gal-wrap" style={{ position: 'relative' }}>
                                                        <img src={url} alt="" className="gallery-img" style={{ height: '68px', width: '68px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${S.blackBorder}`, display: 'block' }} />
                                                        <button type="button" className="rm-btn" onClick={() => removeGalleryImage(idx)} style={{
                                                            position: 'absolute', top: '-5px', right: '-5px', background: S.danger, color: '#fff',
                                                            border: 'none', borderRadius: '50%', width: '19px', height: '19px', cursor: 'pointer',
                                                            fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>×</button>
                                                    </div>
                                                ))}
                                                <div style={{ height: '68px', width: '68px', borderRadius: '8px', border: `2px dashed ${S.blackBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.textMuted, fontSize: '20px' }}>+</div>
                                            </div>
                                            <p style={{ color: S.goldLight, fontSize: '12px', margin: 0 }}>{form.gallery.length} photo{form.gallery.length !== 1 ? 's' : ''} — click to add more</p>
                                        </div>
                                    ) : (
                                        <>
                                            <FaImages style={{ fontSize: '22px', color: galleryDrag ? S.gold : S.textMuted, marginBottom: '8px' }} />
                                            <p style={{ color: S.textPrimary, fontSize: '13px', margin: '0 0 3px', fontWeight: '500' }}>
                                                {galleryDrag ? 'Drop images here!' : 'Drag & drop extra gallery photos'}
                                            </p>
                                            <p style={{ color: S.textMuted, fontSize: '12px', margin: 0 }}>Multiple files supported</p>
                                        </>
                                    )}
                                </DropCard>
                            </div>

                            {/* Description */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelSt}>Description *</label>
                                <FI tag="textarea" placeholder="Describe what this service includes, what makes it special, and who it's perfect for…" value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows={3} required style={{ resize: 'vertical', minHeight: '90px', lineHeight: 1.65 }} />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <button type="submit" disabled={submitLoading || uploading} className="submit-btn" style={{
                                    padding: '13px 28px', borderRadius: '12px', border: 'none', cursor: (submitLoading || uploading) ? 'not-allowed' : 'pointer',
                                    background: (submitLoading || uploading) ? S.blackBorder : `linear-gradient(135deg, ${S.goldDark}, ${S.gold}, ${S.goldLight})`,
                                    color: (submitLoading || uploading) ? S.textMuted : S.black,
                                    fontSize: '14px', fontWeight: '700', letterSpacing: '0.05em', textTransform: 'uppercase',
                                    display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit',
                                }}>
                                    {submitLoading ? <><Spin />Saving…</> : editingId ? <><FaEdit />Update Service</> : <><FaPlus />Add Service</>}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={cancelEdit} style={{
                                        padding: '13px 22px', borderRadius: '12px', border: `1px solid ${S.blackBorder}`,
                                        background: 'transparent', color: S.textMuted, cursor: 'pointer',
                                        fontSize: '14px', fontFamily: 'inherit', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                    }}>
                                        <FaTimes />Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* ── Services Table ── */}
                    <div style={{ background: S.blackCard, border: `1px solid ${S.blackBorder}`, borderRadius: '18px', overflow: 'hidden', animation: 'floatUp 0.5s ease 0.1s both' }}>

                        {/* Table Header */}
                        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${S.blackBorder}`, display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                            <div style={{ ...sectionHead, margin: 0, border: 'none', padding: 0, flex: 1 }}>
                                <FaLayerGroup style={{ color: S.gold }} />
                                All Services
                                <span style={{ marginLeft: '10px', background: S.goldGlow, border: `1px solid ${S.goldDark}`, borderRadius: '20px', padding: '2px 10px', fontSize: '10px', color: S.gold }}>
                                    {services.length}
                                </span>
                            </div>
                            {/* Search */}
                            <div style={{ position: 'relative', minWidth: '200px' }}>
                                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: S.textMuted, fontSize: '12px', pointerEvents: 'none' }} />
                                <input
                                    className="search-input"
                                    placeholder="Search services…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ ...inputBase, padding: '9px 12px 9px 34px', fontSize: '13px', width: '100%', transition: 'border-color 0.25s, box-shadow 0.25s' }}
                                />
                            </div>
                        </div>

                        {filtered.length === 0 ? (
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '40px', marginBottom: '12px' }}>✨</div>
                                <p style={{ color: S.textMuted, margin: 0, fontSize: '14px' }}>
                                    {search ? 'No services match your search.' : 'No services yet — add your first one above.'}
                                </p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '520px' }}>
                                    <thead>
                                        <tr style={{ borderBottom: `1px solid ${S.blackBorder}` }}>
                                            {['Icon', 'Service', 'Price', 'Gallery', 'Actions'].map((h, i) => (
                                                <th key={h} style={{
                                                    padding: '12px 16px', textAlign: i === 4 ? 'right' : 'left',
                                                    fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                                                    color: S.textMuted, fontWeight: '700', whiteSpace: 'nowrap',
                                                }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((service, idx) => (
                                            <tr key={service._id} className="svc-row" style={{ borderBottom: `1px solid ${S.blackBorder}`, animation: `floatUp 0.35s ease ${idx * 0.05}s both` }}>
                                                <td style={{ padding: '14px 16px', fontSize: '26px', lineHeight: 1 }}>{service.icon}</td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    <div style={{ fontWeight: '600', color: S.textPrimary, marginBottom: '2px' }}>{service.title}</div>
                                                    {service.description && (
                                                        <div style={{ color: S.textMuted, fontSize: '12px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {service.description}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                                                    {service.price
                                                        ? <span style={{ color: S.goldLight, fontWeight: '600', fontSize: '13px' }}>{service.price}</span>
                                                        : <span style={{ color: S.textMuted }}>—</span>}
                                                </td>
                                                <td style={{ padding: '14px 16px' }}>
                                                    {service.gallery?.length > 0 ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            {service.gallery.slice(0, 3).map((url, i) => (
                                                                <img key={i} src={url} alt="" style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '5px', border: `1px solid ${S.blackBorder}` }} />
                                                            ))}
                                                            {service.gallery.length > 3 && (
                                                                <span style={{ fontSize: '11px', color: S.textMuted, marginLeft: '4px' }}>+{service.gallery.length - 3}</span>
                                                            )}
                                                        </div>
                                                    ) : <span style={{ color: S.textMuted, fontSize: '12px' }}>None</span>}
                                                </td>
                                                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                        <button className="icon-btn" onClick={() => handleEdit(service)} title="Edit"
                                                            style={{ background: S.blueGlow, border: `1px solid rgba(91,142,230,0.2)`, color: S.blue }}>
                                                            <FaEdit style={{ fontSize: '13px' }} />
                                                        </button>
                                                        <button className="icon-btn" onClick={() => setConfirmDelete(service._id)} title="Delete"
                                                            style={{ background: S.dangerGlow, border: `1px solid rgba(224,82,82,0.2)`, color: S.danger }}>
                                                            <FaTrash style={{ fontSize: '13px' }} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    );
};

export default AdminServices;