import { useState } from 'react';
import { Send, Globe } from 'lucide-react';
import { submitReport } from '../../services/api.js';
import ImageUpload from './ImageUpload.jsx';
import LocationPicker from './LocationPicker.jsx';

const LABELS = {
  en: {
    desc: 'Describe the Damage',
    descPlaceholder: 'Describe what happened — damage to buildings, roads, number of people affected, immediate needs...',
    name: 'Your Name (Optional)',
    phone: 'Phone Number (Optional)',
    submit: 'Submit Report',
    submitting: 'Analyzing with AI…',
    toggle: 'বাংলা',
  },
  bn: {
    desc: 'ক্ষতির বিবরণ দিন',
    descPlaceholder: 'কী হয়েছে তা বর্ণনা করুন — ভবন, রাস্তার ক্ষতি, আক্রান্ত মানুষের সংখ্যা, তাৎক্ষণিক প্রয়োজনীয়তা...',
    name: 'আপনার নাম (ঐচ্ছিক)',
    phone: 'ফোন নম্বর (ঐচ্ছিক)',
    submit: 'রিপোর্ট জমা দিন',
    submitting: 'AI বিশ্লেষণ করছে…',
    toggle: 'English',
  },
};

export default function ReportForm({ onSuccess, onError }) {
  const [lang, setLang]           = useState('en');
  const [description, setDesc]    = useState('');
  const [images, setImages]       = useState([]);
  const [location, setLocation]   = useState({ lat: '', lng: '', address: '' });
  const [name, setName]           = useState('');
  const [phone, setPhone]         = useState('');
  const [loading, setLoading]     = useState(false);

  const L = LABELS[lang];
  const isValid = description.trim() && location.lat && location.lng;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    const res = await submitReport({
      description,
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lng),
      address: location.address || undefined,
      reporter_name: name || undefined,
      reporter_phone: phone || undefined,
      images,
    });
    setLoading(false);
    if (res.success) onSuccess(res.data);
    else onError(res.error || 'Failed to submit report. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Language toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setLang(l => l === 'en' ? 'bn' : 'en')}
        >
          <Globe size={14} />
          {L.toggle}
        </button>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">{L.desc} *</label>
        <textarea
          className="form-input form-textarea"
          placeholder={L.descPlaceholder}
          value={description}
          onChange={e => setDesc(e.target.value)}
          required
          style={{ fontFamily: lang === 'bn' ? 'inherit' : 'inherit', minHeight: 140 }}
        />
      </div>

      {/* Location */}
      <LocationPicker location={location} onChange={setLocation} />

      {/* Images */}
      <ImageUpload images={images} onChange={setImages} />

      {/* Reporter info */}
      <div className="card" style={{ padding: 20 }}>
        <p className="form-label mb-4">Reporter Information</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label" style={{ textTransform: 'none', fontSize: 12 }}>{L.name}</label>
            <input className="form-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ textTransform: 'none', fontSize: 12 }}>{L.phone}</label>
            <input className="form-input" placeholder="+880..." type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary btn-lg w-full"
        disabled={!isValid || loading}
        style={{ justifyContent: 'center' }}
      >
        {loading ? <><span className="spinner spinner-sm" /> {L.submitting}</> : <><Send size={18} /> {L.submit}</>}
      </button>

      {!isValid && (
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--color-text-faint)' }}>
          * Description and location are required
        </p>
      )}
    </form>
  );
}
