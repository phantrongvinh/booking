// const Footer = () => {};

// export default Footer;
// import { Youtube, Twitter, LinkedinIcon } from "lucide-react";

const socials = [
  { label: "YouTube", href: "#", icon: YouTubeIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "Pinterest", href: "#", icon: PinterestIcon },
  { label: "LinkedIn", href: "#", icon: LinkedInIcon },
];

function YouTubeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.26 5 12 5 12 5s-6.26 0-7.82.42A2.5 2.5 0 0 0 2.42 7.19 26.2 26.2 0 0 0 2 12a26.2 26.2 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.74 19 12 19 12 19s6.26 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26.2 26.2 0 0 0 22 12a26.2 26.2 0 0 0-.42-4.81ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H22l-6.78 7.74L23.2 21h-6.9l-5.4-6.34L5.36 21H2.2l7.3-8.34L.8 3h7.06l4.9 5.77L18.9 3Zm-1.21 16h1.72L7.3 4.92H5.46L17.69 19Z" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 6.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88ZM4.75 21h4.38V8.5H4.75V21ZM12 8.5h4.19v1.71h.06c.58-1.05 2-2.16 4.1-2.16 4.38 0 5.18 2.88 5.18 6.63V21h-4.38v-5.36c0-1.28-.03-2.94-1.79-2.94-1.79 0-2.06 1.4-2.06 2.84V21H12V8.5Z" />
    </svg>
  );
}

function PinterestIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.09 2.46 7.6 5.97 9.14-.08-.78-.16-1.97.03-2.82.18-.77 1.16-4.92 1.16-4.92s-.3-.59-.3-1.46c0-1.37.79-2.39 1.78-2.39.84 0 1.25.63 1.25 1.39 0 .85-.54 2.12-.82 3.3-.23.99.5 1.79 1.47 1.79 1.77 0 3.13-1.87 3.13-4.56 0-2.38-1.71-4.05-4.16-4.05-2.83 0-4.5 2.12-4.5 4.32 0 .86.33 1.78.74 2.28a.3.3 0 0 1 .07.29c-.08.31-.25 1-.28 1.14-.04.18-.15.22-.34.13-1.25-.58-2.03-2.4-2.03-3.87 0-3.15 2.29-6.04 6.6-6.04 3.46 0 6.16 2.47 6.16 5.77 0 3.44-2.17 6.21-5.18 6.21-1.01 0-1.97-.53-2.29-1.15l-.62 2.37c-.23.87-.84 1.97-1.25 2.64A10 10 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
    </svg>
  );
}

function MapIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m1 6 7-3 8 3 7-3v14l-7 3-8-3-7 3Z" />
      <path d="M8 3v14" />
      <path d="M16 6v14" />
      <path d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      <path d="M12 20c2.8-2.4 4.5-4.8 4.5-7.1a4.5 4.5 0 0 0-9 0C7.5 15.2 9.2 17.6 12 20Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Scallop top */}
      <div className="relative">
        <div
          className="absolute bottom-0 w-full h-6 z-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12px 24px, #F7C75A 12px, transparent 13px)",
            backgroundSize: "24px 24px",
            backgroundRepeat: "repeat-x",
          }}
        />
      </div>

      {/* Thay đổi phần này vào code của bạn */}
      <div className="bg-[#FFF3D6]">
        <div className="mx-auto px-10 pt-16 pb-16 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto_1fr] gap-x-12 gap-y-8 text-[#2B1B12] ">
          {/* Cột 1: Logo, Slogan, Socials */}
          <div className="flex flex-col items-center text-center gap-3">
            <img
              src="https://i.ibb.co/v47yVGfx/logo.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
            <p className="text-base italic">slogan</p>
            <div className="flex items-center justify-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white border-2 border-[#2B1B12] flex items-center justify-center hover:bg-[#FFC13B] transition-all"
                >
                  <Icon className="w-5 h-5 text-[#2B1B12]" />
                </a>
              ))}
            </div>
          </div>

          {/* Các cột giữa: Căn giữa theo chiều dọc tự nhiên */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Liên hệ</h3>
            <p className="text-sm font-semibold">📱 0123456789</p>
            <p className="text-sm font-semibold">✉️ a@gmail.com</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Giờ mở cửa</h3>
            <p className="text-sm font-semibold">Thứ 2 - Thứ 6: 9:00 - 22:00</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold">Địa chỉ</h3>
            <p className="text-sm font-semibold">📍 123/45/67 Q1, TP HCM</p>
          </div>

          {/* Map: Đẩy sang phải một chút nếu cần */}
          <div className="w-full max-w-[280px] min-h-[140px] rounded-2xl bg-[#F3E7B9] border border-[#E1C96C] flex flex-col items-center justify-center gap-2 mx-auto">
            <MapIcon className="w-10 h-10" />
            <span className="text-sm font-semibold">Bản đồ cửa hàng</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="w-full bg-[#FF7A00]/50 py-5 text-center">
          <p className="text-sm font-semibold text-[#2B1B12]">
            © 2026 TÊN CỬA HÀNG . Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
