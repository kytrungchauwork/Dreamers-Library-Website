const STORAGE_KEY = "BOOK_READER_STORAGE";
const USER_KEY = "BOOK_READER_USER_ID";

/* ================= USER ================= */

/**
 * Lấy hoặc tạo userId cho trình duyệt
 */
export const getUserId = () => {
  let userId = localStorage.getItem(USER_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(USER_KEY, userId);
  }

  return userId;
};

/* ================= DATA ================= */

export const loadAllData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getStoryData = (storyId) => {
  const data = loadAllData();
  return data[storyId] || null;
};

export const saveStoryData = (storyId, newData) => {
  const allData = loadAllData();

  allData[storyId] = {
    ...allData[storyId],
    ...newData
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allData));
};
