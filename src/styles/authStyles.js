export const BASE = 'http://localhost:9000/api/auth';

export const shared = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #1E3D2B 0%, #355E45 50%, #4A7C5E 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Nunito', sans-serif", padding: '20px',
    },
    card: {
        background: '#fff', borderRadius: '24px',
        padding: '40px 36px', width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
    },
    logo: {
        textAlign: 'center', marginBottom: '32px',
    },
    logoEmoji: { fontSize: '48px', display: 'block', marginBottom: '8px' },
    logoTitle: { margin: 0, fontSize: '26px', fontWeight: 900, color: '#2D2D2D' },
    logoSub: { margin: '4px 0 0', fontSize: '14px', color: '#AAA' },
    label: {
        display: 'block', fontSize: '12px', fontWeight: 700,
        color: '#5C5047', marginBottom: '6px', letterSpacing: '0.05em',
    },
    input: {
        width: '100%', padding: '12px 14px',
        border: '1.5px solid #DDD5C8', borderRadius: '12px',
        fontSize: '15px', fontFamily: "'Nunito', sans-serif",
        outline: 'none', boxSizing: 'border-box',
        background: '#FDFBF8', color: '#2D2D2D',
        transition: 'border-color 0.2s',
    },
    btnPrimary: {
        width: '100%', padding: '14px',
        background: '#355E45', color: '#fff',
        border: 'none', borderRadius: '14px',
        fontSize: '15px', fontWeight: 700,
        cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
        transition: 'background 0.2s', marginTop: '8px',
    },
    error: {
        background: '#FEF2F2', border: '1px solid #FECACA',
        borderRadius: '10px', padding: '10px 14px',
        color: '#DC2626', fontSize: '13px', fontWeight: 600,
        marginBottom: '8px',
    },
    success: {
        background: '#E8F5E9', border: '1px solid #A5D6A7',
        borderRadius: '10px', padding: '10px 14px',
        color: '#2E7D32', fontSize: '13px', fontWeight: 600,
        marginBottom: '8px',
    },
    link: {
        color: '#355E45', fontWeight: 700, cursor: 'pointer',
        textDecoration: 'none', fontSize: '14px',
    },
    divider: {
        textAlign: 'center', color: '#CCC',
        fontSize: '13px', margin: '20px 0',
        display: 'flex', alignItems: 'center', gap: '10px',
    },
};