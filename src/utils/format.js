// Botswana currency: the Pula (BWP), written with a leading "P".

export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  const fixed = Math.abs(n).toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${n < 0 ? '-' : ''}P ${grouped}.${decPart}`;
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatDate(value) {
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

export function monthLabel(ref = new Date()) {
  return `${MONTHS_LONG[ref.getMonth()]} ${ref.getFullYear()}`;
}

export function isSameMonth(value, ref = new Date()) {
  const d = new Date(value);
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
}

export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isValidDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}
