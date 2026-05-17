// Default expense categories relevant to everyday life in Botswana.
// Users can edit, remove, or add their own on the Categories screen.
export const DEFAULT_CATEGORIES = [
  { id: 'groceries', label: 'Groceries', icon: '🛒', color: '#4CAF50' },
  { id: 'transport', label: 'Transport', icon: '🚕', color: '#FF9800' },
  { id: 'rent', label: 'Rent', icon: '🏠', color: '#3F51B5' },
  { id: 'utilities', label: 'Water & Electricity', icon: '💡', color: '#00BCD4' },
  { id: 'airtime', label: 'Airtime & Data', icon: '📱', color: '#9C27B0' },
  { id: 'school', label: 'School Fees', icon: '🎓', color: '#795548' },
  { id: 'health', label: 'Healthcare', icon: '🏥', color: '#E91E63' },
  { id: 'dining', label: 'Dining Out', icon: '🍽️', color: '#F4511E' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#673AB7' },
  { id: 'clothing', label: 'Clothing', icon: '👕', color: '#009688' },
  { id: 'family', label: 'Family Support', icon: '👪', color: '#1565C0' },
  { id: 'savings', label: 'Savings', icon: '💰', color: '#8BC34A' },
  { id: 'other', label: 'Other', icon: '📦', color: '#607D8B' },
];

export const FALLBACK_CATEGORY = {
  id: '__none__',
  label: 'Uncategorised',
  icon: '❓',
  color: '#9AA5B1',
};

// Choices offered when creating or editing a category.
export const ICON_OPTIONS = [
  '🛒', '🚕', '🏠', '💡', '📱', '🎓', '🏥', '🍽️', '🎬', '👕',
  '👪', '💰', '📦', '✈️', '⛽', '🎁', '💊', '🐾', '☕', '🏋️',
  '📚', '🔧', '🎮', '💇', '🍺', '🚗', '💳', '🌐', '🧾', '🎵',
];

export const COLOR_OPTIONS = [
  '#4CAF50', '#FF9800', '#3F51B5', '#00BCD4', '#9C27B0', '#795548',
  '#E91E63', '#F4511E', '#673AB7', '#009688', '#1565C0', '#8BC34A',
  '#607D8B', '#E5484D', '#0F4C81', '#2E9E5B',
];
