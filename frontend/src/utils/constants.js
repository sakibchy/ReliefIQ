// Urgency score → display config
export const URGENCY = {
  critical: { label: 'Critical', cssClass: 'badge-critical', color: '#ef4444', weight: 4 },
  high:     { label: 'High',     cssClass: 'badge-high',     color: '#f97316', weight: 3 },
  medium:   { label: 'Medium',   cssClass: 'badge-medium',   color: '#eab308', weight: 2 },
  low:      { label: 'Low',      cssClass: 'badge-low',      color: '#22c55e', weight: 1 },
};

// Report status → display config
export const STATUS = {
  submitted:      { label: 'Submitted',      cssClass: 'badge-submitted',      icon: '📥' },
  under_review:   { label: 'Under Review',   cssClass: 'badge-under-review',   icon: '🔍' },
  aid_dispatched: { label: 'Aid Dispatched', cssClass: 'badge-aid-dispatched', icon: '🚑' },
  resolved:       { label: 'Resolved',       cssClass: 'badge-resolved',       icon: '✅' },
};

// Damage level labels
export const DAMAGE_LEVEL = {
  none:         { label: 'No Damage',    color: '#6b7280' },
  minor:        { label: 'Minor',        color: '#22c55e' },
  moderate:     { label: 'Moderate',     color: '#eab308' },
  severe:       { label: 'Severe',       color: '#f97316' },
  catastrophic: { label: 'Catastrophic', color: '#ef4444' },
};

// Relief items → emoji labels
export const RELIEF_ITEMS = {
  food:        { label: 'Food',        emoji: '🍚' },
  clean_water: { label: 'Clean Water', emoji: '💧' },
  medicine:    { label: 'Medicine',    emoji: '💊' },
  shelter:     { label: 'Shelter',     emoji: '🏕️' },
  rescue:      { label: 'Rescue',      emoji: '🚑' },
  sanitation:  { label: 'Sanitation',  emoji: '🧹' },
};

// Map defaults (centered on Bangladesh)
export const MAP_DEFAULTS = {
  center: [23.685, 90.356],
  zoom: 7,
};

// Marker colors by urgency
export const MARKER_COLORS = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#22c55e',
  default:  '#60a5fa',
};
