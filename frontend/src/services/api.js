const BASE = '/api';

/**
 * Core fetch wrapper — always returns { success, data, error }.
 */
async function request(method, path, body = null, isFormData = false) {
  const opts = {
    method,
    credentials: 'include', // send httpOnly cookies
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = isFormData ? body : JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const json = await res.json().catch(() => ({ success: false, error: 'Invalid response', data: null }));

  if (!res.ok) {
    return { success: false, data: null, error: json.detail || json.error || 'Request failed' };
  }
  return json;
}

// ── Reports ────────────────────────────────────────────────────

/**
 * Submit a new disaster report (multipart/form-data).
 * @param {Object} fields - { description, lat, lng, address?, reporter_name?, reporter_phone?, images: File[] }
 */
export async function submitReport(fields) {
  const form = new FormData();
  form.append('description', fields.description);
  form.append('lat', fields.lat);
  form.append('lng', fields.lng);
  if (fields.address)        form.append('address', fields.address);
  if (fields.reporter_name)  form.append('reporter_name', fields.reporter_name);
  if (fields.reporter_phone) form.append('reporter_phone', fields.reporter_phone);
  (fields.images || []).forEach(img => form.append('images', img));

  return request('POST', '/reports', form, true);
}

/**
 * List all reports (admin).
 * @param {Object} params - { page, limit, status, urgency, from_date, to_date }
 */
export async function listReports(params = {}) {
  const qs = new URLSearchParams();
  if (params.page)      qs.set('page', params.page);
  if (params.limit)     qs.set('limit', params.limit);
  if (params.status)    qs.set('status', params.status);
  if (params.urgency)   qs.set('urgency', params.urgency);
  if (params.from_date) qs.set('from_date', params.from_date);
  if (params.to_date)   qs.set('to_date', params.to_date);
  return request('GET', `/reports?${qs}`);
}

/**
 * Get a single report by ID.
 */
export async function getReport(id) {
  return request('GET', `/reports/${id}`);
}

/**
 * Update report status (admin).
 */
export async function updateReportStatus(id, status, assigned_team) {
  return request('PATCH', `/reports/${id}/status`, { status, assigned_team });
}

/**
 * Get PDF download URL for a report.
 */
export function getReportPdfUrl(id) {
  return `${BASE}/reports/${id}/pdf`;
}

// ── Dashboard ──────────────────────────────────────────────────

/**
 * Get dashboard summary statistics.
 */
export async function getDashboardStats() {
  return request('GET', '/dashboard/stats');
}

/**
 * Get GeoJSON map data for all reports.
 */
export async function getMapData() {
  return request('GET', '/dashboard/map');
}

/**
 * Generate AI Situation Report.
 */
export async function generateSitrep() {
  return request('GET', '/dashboard/sitrep');
}

/**
 * Generate AI Resource Allocation Plan.
 */
export async function generateAllocationPlan() {
  return request('GET', '/dashboard/allocate');
}

// ── Auth ───────────────────────────────────────────────────────

/**
 * Admin login.
 */
export async function login(username, password) {
  return request('POST', '/auth/login', { username, password });
}

/**
 * Admin logout.
 */
export async function logout() {
  return request('POST', '/auth/logout');
}
