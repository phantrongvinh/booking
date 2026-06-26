import React, { useState } from "react"; // Gộp lại ở đây

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useFetch } from "@/hook/customHook";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/slices/authSlice";

/* Inline SVG icons – no external icon library needed */
function MailIcon({ size = 16, color = "#FF7A00" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon({ size = 16, color = "#FF7A00" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon({ size = 16, color = "#FF7A00" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EyeIcon({ size = 16, color = "#7A6A5C" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ size = 16, color = "#7A6A5C" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.78 0 1.53-.09 2.24-.26" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function FacebookIcon({ size = 18, color = "#2B1B12" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function AuthPage() {
  return <AuthPageInner />;
}

function AuthPageInner() {
  const [tab, setTab] = useState("login");
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#FFF8E8" }}
    >
      <Link to="/" className="px-10 pt-8">
        <img
          src="https://i.ibb.co/v47yVGfx/logo.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />
      </Link>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div
          className="w-full max-w-5xl rounded-3xl grid md:grid-cols-2 items-stretch overflow-hidden"
          style={{ backgroundColor: "#FFF3D6", minHeight: 520 }}
        >
          {/* Left side – Banner (Chiếm đúng 50%) */}
          <div className="hidden md:block h-full bg-gray-200 rounded-l-3xl overflow-hidden relative">
            <img
              src="https://i.ibb.co/d0HWjGHL/image.png"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side – Card (Đã bỏ max-w-md và mx-auto để nó giãn ra 100% cột) */}

          <div className="bg-white rounded-r-3xl shadow-sm p-6 md:p-8 w-full h-full flex items-center justify-center">
            <div className="w-full max-w-sm flex flex-col items-center justify-center gap-7">
              <div
                className="flex w-full max-w-xs mx-auto p-1.5"
                style={{
                  borderRadius: 9999,
                  border: "1px solid #E8D8C3",
                  backgroundColor: "#FFF8E8",
                  gap: 6,
                }}
              >
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className="flex-1 text-sm font-semibold transition-colors"
                  style={{
                    padding: "12px 0",
                    borderRadius: 9999,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      tab === "login" ? "#FF7A00" : "transparent",
                    color: tab === "login" ? "#fff" : "#2B1B12",
                    boxShadow:
                      tab === "login"
                        ? "0 10px 24px rgba(255, 122, 0, 0.22)"
                        : "none",
                  }}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className="flex-1 text-sm font-semibold transition-colors"
                  style={{
                    padding: "12px 0",
                    borderRadius: 9999,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor:
                      tab === "register" ? "#FF7A00" : "transparent",
                    color: tab === "register" ? "#fff" : "#2B1B12",
                    boxShadow:
                      tab === "register"
                        ? "0 10px 24px rgba(255, 122, 0, 0.22)"
                        : "none",
                  }}
                >
                  Đăng ký
                </button>
              </div>

              <div className="w-full">
                {tab === "login" ? (
                  <LoginForm showPwd={showPwd} setShowPwd={setShowPwd} />
                ) : (
                  <RegisterForm showPwd={showPwd} setShowPwd={setShowPwd} />
                )}
              </div>

              <div className="w-full">
                <div className="flex items-center gap-3 my-6">
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "#E8D8C3" }}
                  />
                  <span
                    className="text-xs"
                    style={{ color: "#7A6A5C", whiteSpace: "nowrap" }}
                  >
                    Hoặc đăng nhập với
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ backgroundColor: "#E8D8C3" }}
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    style={{ borderColor: "#2B1B12" }}
                  >
                    <FacebookIcon size={18} color="#2B1B12" />
                  </button>
                  <button
                    aria-label="Pinterest"
                    className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    style={{ borderColor: "#2B1B12" }}
                  >
                    <span
                      className="font-bold text-sm"
                      style={{ color: "#2B1B12" }}
                    >
                      P
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  type = "text",
  placeholder,
  rightSlot,
  value,
  onChange,
}) {
  return (
    <div
      className="flex items-center gap-2 border-b py-2"
      style={{ borderColor: "#E8D8C3" }}
    >
      <span className="flex-shrink-0 flex items-center justify-center">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm min-w-0"
        style={{ color: "#2B1B12", height: 28, padding: "4px 0" }}
        value={value}
        onChange={onChange}
      />
      {rightSlot ? (
        <span className="flex-shrink-0 flex items-center justify-center">
          {rightSlot}
        </span>
      ) : null}
    </div>
  );
}

function LoginForm({ showPwd, setShowPwd }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập Email hoặc SĐT";
    if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải từ 6 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // hanleLogin
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await dispatch(login(formData)).unwrap();
      navigate("/");
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <h2
        className="text-center text-2xl font-bold mb-8"
        style={{ color: "#2B1B12" }}
      >
        Chào mừng trở lại
      </h2>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          className="text-sm font-semibold tracking-wide block"
          style={{ color: "#2B1B12" }}
        >
          Email hoặc Số điện thoại
        </label>
        <Field
          icon={<MailIcon size={16} color="#FF7A00" />}
          placeholder="example@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          className="text-sm font-semibold tracking-wide block"
          style={{ color: "#2B1B12" }}
        >
          Mật khẩu
        </label>
        <Field
          icon={<LockIcon size={16} color="#FF7A00" />}
          type={showPwd ? "text" : "password"}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="p-1"
            >
              {showPwd ? (
                <EyeIcon size={16} color="#7A6A5C" />
              ) : (
                <EyeOffIcon size={16} color="#7A6A5C" />
              )}
            </button>
          }
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between text-xs pt-2">
        <label
          className="flex items-center gap-2 cursor-pointer font-medium"
          style={{ color: "#2B1B12" }}
        >
          <input type="checkbox" className="accent-orange-500" />
          Lưu thông tin
        </label>
        <a
          href="/forgot-password"
          className="font-medium hover:text-[#FF7A00] transition-colors"
          style={{ color: "#7A6A5C" }}
        >
          Quên mật khẩu?
        </a>
      </div>

      <button
        type="submit"
        className="w-full py-4 rounded-full text-white font-extrabold text-xl shadow-xl hover:bg-orange-600 active:scale-[0.98] transition-all"
        style={{ backgroundColor: "#FF7A00", letterSpacing: "0.02em" }}
      >
        Đăng nhập
      </button>
    </form>
  );
}

function RegisterForm({ showPwd, setShowPwd }) {
  // Giả lập trạng thái lỗi
  const [errors, setErrors] = React.useState({});

  return (
    <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
      <h2 className="text-center text-2xl font-bold text-[#2B1B12] mb-8">
        Tạo tài khoản mới
      </h2>

      {/* Input Group */}
      <div className="space-y-5">
        <InputField
          label="Họ và tên"
          icon={<UserIcon size={18} color="#FF7A00" />}
          error={errors.name}
        />

        <InputField
          label="Email hoặc Số điện thoại"
          icon={<MailIcon size={18} color="#FF7A00" />}
          error={errors.email}
        />

        <InputField
          label="Mật khẩu"
          type={showPwd ? "text" : "password"}
          icon={<LockIcon size={18} color="#FF7A00" />}
          error={errors.password}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              {showPwd ? (
                <EyeIcon size={18} color="#7A6A5C" />
              ) : (
                <EyeOffIcon size={18} color="#7A6A5C" />
              )}
            </button>
          }
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-[#2B1B12] cursor-pointer">
        <input type="checkbox" className="w-4 h-4 accent-orange-500" />
        <span>Đồng ý với điều khoản và điều kiện</span>
      </label>

      <button
        type="submit"
        className="w-full py-4 rounded-full text-white font-extrabold text-xl shadow-xl hover:bg-[#ff8c2e] active:scale-[0.98] transition-all"
        style={{ backgroundColor: "#FF7A00", letterSpacing: "0.02em" }}
      >
        Đăng ký
      </button>
    </form>
  );
}

// Component phụ để quản lý style input đồng bộ và hiển thị lỗi
function InputField({ label, icon, error, rightSlot, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold tracking-wide text-[#2B1B12]">
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border px-3 py-3 rounded-xl bg-white ${error ? "border-red-500" : "border-gray-200"} focus-within:ring-2 focus-within:ring-orange-200 transition-all`}
      >
        {icon}
        <input className="flex-1 outline-none text-sm" {...props} />
        {rightSlot}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
