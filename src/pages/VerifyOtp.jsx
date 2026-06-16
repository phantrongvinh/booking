import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

export default function VerifyOtp() {
  const location = useLocation();
  const email = location.state?.email || "example@gmail.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [expireSeconds, setExpireSeconds] = useState(5 * 60);
  const [resendSeconds, setResendSeconds] = useState(58);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (expireSeconds <= 0) return;

    const timer = setInterval(() => {
      setExpireSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [expireSeconds]);

  useEffect(() => {
    if (resendSeconds <= 0) return;

    const timer = setInterval(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendSeconds]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      alert("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    console.log("OTP:", code);

    // TODO:
    // navigate("/reset-password");
  };

  const handleResend = () => {
    if (resendSeconds > 0) return;

    setResendSeconds(58);
    setExpireSeconds(5 * 60);
    setOtp(["", "", "", "", "", ""]);

    console.log("Resend OTP");
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
          {/* Banner */}
          <div className="hidden md:block h-full bg-gray-200 rounded-l-3xl overflow-hidden">
            <img
              src="https://i.ibb.co/d0HWjGHL/image.png"
              alt="Banner"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Form */}
          <div className="bg-white rounded-r-3xl shadow-sm p-6 md:p-8 w-full h-full flex items-center justify-center">
            <div className="w-full max-w-sm">
              <form onSubmit={handleSubmit} className="space-y-7">
                <h2
                  className="text-center text-2xl font-bold"
                  style={{ color: "#2B1B12" }}
                >
                  Xác thực OTP
                </h2>

                <p
                  className="text-center text-sm leading-relaxed"
                  style={{ color: "#7A6A5C" }}
                >
                  Chúng tôi đã gửi mã xác thực đến
                  <br />
                  <span className="font-semibold">{email}</span>
                </p>

                {/* OTP */}
                <div className="flex justify-center gap-3">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputsRef.current[index] = el)}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      value={value}
                      onChange={(e) =>
                        handleChange(index, e.target.value)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(index, e)
                      }
                      className="w-12 h-12 rounded-xl border border-[#E8D8C3] text-center text-lg font-bold outline-none focus:border-[#FF7A00]"
                    />
                  ))}
                </div>

                {/* Expire */}
                <div className="text-center">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2B1B12" }}
                  >
                    Mã hết hạn sau:{" "}
                    <span style={{ color: "#FF7A00" }}>
                      {formatTime(expireSeconds)}
                    </span>
                  </span>
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
                  Xác thực
                </button>

                {/* Resend */}
                <div className="text-center text-sm">
                  <span style={{ color: "#7A6A5C" }}>
                    Chưa nhận được mã?{" "}
                  </span>

                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendSeconds > 0}
                    className="font-semibold disabled:text-gray-400"
                    style={{
                      color:
                        resendSeconds > 0
                          ? "#9CA3AF"
                          : "#FF7A00",
                    }}
                  >
                    Gửi lại
                    {resendSeconds > 0 &&
                      ` (${resendSeconds}s)`}
                  </button>
                </div>

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
