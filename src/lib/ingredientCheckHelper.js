export const CHECK_LOG_KEY = "ingredientCheckLog";

export const getTodayStr = () => new Date().toISOString().slice(0, 10);

// Kiểm tra dựa vào updatedAt trả về từ backend - chính xác, dùng được cho mọi thiết bị
export const isUpdatedToday = (updatedAt) => {
  if (!updatedAt) return false;
  return updatedAt.slice(0, 10) === getTodayStr();
};

// Đếm số lần kiểm kê trong ngày - CHỈ lưu local, không đồng bộ giữa các máy/nhân viên khác
export const getCheckLog = () => {
  try {
    const raw = localStorage.getItem(CHECK_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getTodayCheckCount = (ingredientId) => {
  const log = getCheckLog();
  const entry = log[ingredientId];
  if (!entry || entry.date !== getTodayStr()) return 0;
  return entry.count;
};

export const incrementTodayCheckCount = (ingredientId) => {
  const log = getCheckLog();
  const today = getTodayStr();
  const entry = log[ingredientId];
  const nextCount = entry && entry.date === today ? entry.count + 1 : 1;
  log[ingredientId] = { date: today, count: nextCount };
  localStorage.setItem(CHECK_LOG_KEY, JSON.stringify(log));
  return nextCount;
};
