import React, { useState, useEffect } from "react";
import { X, User, Phone, Mail, ShieldAlert, Award } from "lucide-react";

const StaffModal = ({ isOpen, onClose, onSave, staff = null }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    role: "Nhân viên phục vụ",
    status: "Hoạt động",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (staff) {
      setFormData({
        fullName: staff.fullName || "",
        phone: staff.phone || "",
        email: staff.email || "",
        role: staff.role || "Nhân viên phục vụ",
        status: staff.status || "Hoạt động",
      });
    } else {
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        role: "Nhân viên phục vụ",
        status: "Hoạt động",
      });
    }
    setErrors({});
  }, [staff, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Họ và tên phải có ít nhất 3 ký tự";
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ (ví dụ: lienhe@booking.com)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const roles = [
    "Quản lý",
    "Thu ngân",
    "Đầu bếp",
    "Nhân viên pha chế",
    "Nhân viên phục vụ",
    "Giao hàng",
  ];

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 className="text-xl font-bold text-[#5B3A0A]">
            {staff ? "Chỉnh sửa thông tin" : "Thêm nhân viên mới"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-[#5B3A0A] mb-1">
              Họ và tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên nhân viên"
                className={`h-10 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition-all ${
                  errors.fullName
                    ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-border hover:border-[#FFE7BA] focus:border-[#F59E0B] focus:bg-[#FFF3D6] focus:ring-1 focus:ring-[#F59E0B]"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-rose-500">{errors.fullName}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#5B3A0A] mb-1">
                Số điện thoại <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0912345678"
                  className={`h-10 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition-all ${
                    errors.phone
                      ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-border hover:border-[#FFE7BA] focus:border-[#F59E0B] focus:bg-[#FFF3D6] focus:ring-1 focus:ring-[#F59E0B]"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#5B3A0A] mb-1">
                Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Ví dụ: lienhe@gmail.com"
                  className={`h-10 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition-all ${
                    errors.email
                      ? "border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-border hover:border-[#FFE7BA] focus:border-[#F59E0B] focus:bg-[#FFF3D6] focus:ring-1 focus:ring-[#F59E0B]"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-[#5B3A0A] mb-1">
                Vai trò <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Award className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition-all hover:border-[#FFE7BA] focus:border-[#F59E0B] focus:bg-[#FFF3D6] appearance-none"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[#5B3A0A] mb-1">
                Trạng thái <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <ShieldAlert className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm outline-none transition-all hover:border-[#FFE7BA] focus:border-[#F59E0B] focus:bg-[#FFF3D6] appearance-none"
                >
                  <option value="Hoạt động">Hoạt động</option>
                  <option value="Tạm khóa">Tạm khóa</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium hover:bg-muted transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#FA8C00] px-5 py-2 text-sm font-semibold text-white hover:bg-[#D97706] transition-colors shadow-md cursor-pointer"
            >
              {staff ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffModal;
