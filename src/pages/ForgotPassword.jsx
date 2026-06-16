import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

function Field({ icon, value, onChange, placeholder }) {
  return (
    <div
      className="flex items-center gap-2 border-b py-2"
      style={{ borderColor: "#E8D8C3" }}
    >
      <span className="flex-shrink-0">{icon}</span>

      <input
        type="email"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm"
        style={{
          color: "#2B1B12",
          height: 28,
          padding: "4px 0",
        }}
      />
    </div>
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    navigate("/verify-otp", {
      state: { email },
    });
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#FFF8E8" }}
    >
      {/* Logo */}
      <div className="px-10 pt-8">
        <img
          src="https://i.ibb.co/v47yVGfx/logo.png"
          alt="Logo"
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div
          className="w-full max-w-5xl rounded-3xl grid md:grid-cols-2 items-stretch overflow-hidden"
          style={{
            backgroundColor: "#FFF3D6",
            minHeight: 520,
          }}
        >
          {/* Left Banner */}
          <div className="hidden md:block h-full bg-gray-200 rounded-l-3xl overflow-hidden relative">
            <img
              src="https://i.ibb.co/d0HWjGHL/image.png"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Form */}
          <div className="bg-white rounded-r-3xl shadow-sm p-6 md:p-8 w-full h-full flex items-center justify-center">
            <div className="w-full max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-7">
                <h2
                  className="text-center text-2xl font-bold"
                  style={{ color: "#2B1B12" }}
                >
                  Quên mật khẩu
                </h2>

                <p
                  className="text-center text-sm leading-relaxed"
                  style={{ color: "#7A6A5C" }}
                >
                  Nhập email của bạn để nhận mã xác thực
                  <br />
                  đặt lại mật khẩu
                </p>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    className="text-sm font-semibold tracking-wide block"
                    style={{ color: "#2B1B12" }}
                  >
                    Email
                  </label>

                  <Field
                    icon={<MailIcon />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-full text-white font-extrabold text-xl shadow-xl hover:bg-orange-600 active:scale-[0.98] transition-all"
                  style={{
                    backgroundColor: "#FF7A00",
                    letterSpacing: "0.02em",
                  }}
                >
                  Tiếp tục
                </button>

                {/* Back */}
                <div className="text-center">
                  <Link
                    to="/auth"
                    className="font-medium hover:text-[#FF7A00] transition-colors"
                    style={{ color: "#7A6A5C" }}
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>


              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}