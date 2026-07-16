import { useCallback } from 'react';
import { Upload, X, Image } from 'lucide-react';

const MAX_IMAGES = 5;

export default function ImageUpload({ images, onChange }) {
  const handleFiles = useCallback((files) => {
    const valid = Array.from(files)
      .filter(f => ['image/jpeg', 'image/png'].includes(f.type))
      .slice(0, MAX_IMAGES - images.length);
    if (valid.length) onChange(prev => [...prev, ...valid].slice(0, MAX_IMAGES));
  }, [images.length, onChange]);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const remove = (idx) => onChange(prev => prev.filter((_, i) => i !== idx));

  return (
    <div className="form-group">
      <label className="form-label">Photos ({images.length}/{MAX_IMAGES})</label>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => document.getElementById('file-input').click()}
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color var(--transition), background var(--transition)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.background = 'rgba(59,130,246,0.04)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.background = ''; }}
      >
        <Upload size={28} color="var(--color-text-faint)" style={{ margin: '0 auto 10px' }} />
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 4 }}>
          Drag &amp; drop photos here, or <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>browse</span>
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>JPEG / PNG · Max 10MB each · Up to {MAX_IMAGES} photos</p>
        <input
          id="file-input"
          type="file"
          accept="image/jpeg,image/png"
          multiple
          style={{ display: 'none' }}
          onChange={e => handleFiles(e.target.files)}
        />
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 10, marginTop: 12 }}>
          {images.map((img, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <img
                src={URL.createObjectURL(img)}
                alt={`Upload ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={12} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
