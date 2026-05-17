import { PLANT_AVATARS } from "../constants/plantAvatars";

const AvatarSelector = ({ selected, onChange }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        maxHeight: '320px',
        overflowY: 'auto',
        paddingRight: '4px',
    }}>
        {PLANT_AVATARS.map(avatar => {
            const isSelected = selected === avatar.url;
            return (
                <div
                    key={avatar.id}
                    onClick={() => onChange(avatar.url)}
                    style={{
                        cursor: 'pointer', borderRadius: '14px', textAlign: 'center',
                        border: isSelected ? '2px solid #355E45' : '2px solid #E8E0D5',
                        background: isSelected ? '#EDF5EF' : '#FAF8F5',
                        padding: '10px 6px 6px', transition: 'all 0.18s',
                        boxShadow: isSelected ? '0 0 0 3px #355E4530' : 'none',
                        position: 'relative',
                    }}
                >
                    {isSelected && (
                        <div style={{
                            position: 'absolute', top: '6px', right: '6px',
                            width: '16px', height: '16px', background: '#355E45',
                            borderRadius: '50%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', color: '#fff', fontWeight: 700,
                        }}>✓</div>
                    )}
                    <div style={{
                        width: '52px', height: '52px', margin: '0 auto',
                        borderRadius: '10px', background: '#E8F0EA',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', overflow: 'hidden', fontSize: '28px',
                    }}>
                        <img
                            src={avatar.url} alt={avatar.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.style.display = 'none'; e.target.parentNode.innerText = '🌿'; }}
                        />
                    </div>
                    <span style={{
                        fontSize: '11px', display: 'block', marginTop: '5px',
                        fontWeight: isSelected ? 700 : 400,
                        color: isSelected ? '#355E45' : '#888',
                        fontFamily: 'inherit',
                    }}>
                        {avatar.label}
                    </span>
                </div>
            );
        })}
    </div>
);

export default AvatarSelector;
