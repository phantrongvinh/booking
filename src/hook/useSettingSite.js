import { useState, useEffect } from "react";

export const STORAGE_KEY = "siteSettings";

export const DEFAULT_SETTINGS = {
  headerColor: "#FFF8E8",
  headerTopColor: "#FFC13B",
  footerColor: "#FFF3D6",
  footerCopyrightColor: "#FF7A00",
  bannerImage: "",
  bannerTitle: "",
  bannerSubtitle: "",
  slides: [
    {
      id: 1,
      title: "Bánh mới",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&h=900&fit=crop",
    },
    {
      id: 2,
      title: "Giảm giá đến 50%",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&h=900&fit=crop",
    },
    {
      id: 3,
      title: "Nhận ưu đãi",
      image:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1600&h=900&fit=crop",
    },
  ],
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    // merge với default để tránh thiếu field khi settings cũ chưa có field mới
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

// Hook đọc site settings, tự động cập nhật khi Settings admin lưu (cùng tab)
// hoặc khi đổi ở tab/cửa sổ khác (khác tab, qua sự kiện "storage")
export const useSiteSettings = () => {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    // Cùng tab: lắng nghe custom event bắn ra từ trang Settings khi save
    const handleLocalUpdate = () => setSettings(loadSettings());

    // Khác tab: browser tự bắn "storage" event
    const handleStorageEvent = (e) => {
      if (e.key === STORAGE_KEY) setSettings(loadSettings());
    };

    window.addEventListener("site-settings-updated", handleLocalUpdate);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener("site-settings-updated", handleLocalUpdate);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, []);

  return settings;
};

// Gọi hàm này ở trang Settings sau khi lưu vào localStorage,
// để các component khác (Header/Footer/Slide) đang mở cùng lúc cập nhật ngay lập tức
export const notifySiteSettingsUpdated = () => {
  window.dispatchEvent(new Event("site-settings-updated"));
};
