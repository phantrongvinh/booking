import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  Upload,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import StaffModal from "@/components/admin/StaffModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ToastNotification from "@/components/admin/ToastNotification";
import staffAPI from "@/api/staffAPI";
import { useFetch } from "@/hook/customHook";

// Helper lấy chữ cái đầu để vẽ Avatar
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColors = [
  "bg-amber-500",
  "bg-orange-500",
  "bg-yellow-600",
  "bg-amber-600",
  "bg-orange-600",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const AdStaff = () => {
  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals & Notifications
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, fullName } or "batch"

  const [toast, setToast] = useState(null);

  // Hidden File input ref for mock file upload
  const fileInputRef = useRef(null);

  // --- Fetch staff list from backend ---
  const {
    data: staffData,
    loading: staffLoading,
    fetch: refetchStaffs,
  } = useFetch(() => staffAPI.fetchStaffs(), {
    initialData: [],
  });

  const staffList = useMemo(() => {
    if (!staffData || !Array.isArray(staffData)) return [];
    return staffData.map((s) => ({
      ...s,
      id: s.userId || s.id || `NV-${s.userId}`,
      fullName: s.fullName || s.username || "Chưa cập nhật",
      role: s.role || "Nhân viên phục vụ",
      status: s.status || "Hoạt động",
      email: s.email || "—",
      phone: s.phone || "—",
      createdAt: s.createdAt || "—",
    }));
  }, [staffData]);

  // --- Show Toast message ---
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // --- Stats calculations ---
  const stats = useMemo(() => {
    const total = staffList.length;
    const active = staffList.filter((s) => s.status === "Hoạt động").length;
    const locked = total - active;
    return { total, active, locked };
  }, [staffList]);

  // --- Filter and Search logic ---
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const matchSearch =
        !searchQuery ||
        staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone?.includes(searchQuery) ||
        staff.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(staff.id).toLowerCase().includes(searchQuery.toLowerCase());

      const matchRole = roleFilter === "all" || staff.role === roleFilter;
      const matchStatus = statusFilter === "all" || staff.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [staffList, searchQuery, roleFilter, statusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchQuery, roleFilter, statusFilter]);

  // --- Pagination items ---
  const totalPages = Math.ceil(filteredStaff.length / pageSize) || 1;
  const currentStaffPage = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, currentPage]);

  // --- Select checkbox actions ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = currentStaffPage.map((s) => s.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    } else {
      const pageIds = currentStaffPage.map((s) => s.id);
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const isAllPageSelected = useMemo(() => {
    if (currentStaffPage.length === 0) return false;
    return currentStaffPage.every((s) => selectedIds.includes(s.id));
  }, [currentStaffPage, selectedIds]);

  // --- Add / Edit actions ---
  const handleOpenAddModal = () => {
    setEditStaff(null);
    setIsStaffModalOpen(true);
  };

  const handleOpenEditModal = async (staff, e) => {
    e.stopPropagation();
    try {
      showToast("Đang tải thông tin chi tiết...");
      const detail = await staffAPI.fetchStaffByUserId(staff.id);
      setEditStaff(detail || staff);
      setIsStaffModalOpen(true);
    } catch (err) {
      console.error(err);
      setEditStaff(staff);
      setIsStaffModalOpen(true);
    }
  };

  const handleSaveStaff = async (formData) => {
    if (editStaff) {
      // Edit mode
      try {
        const payload = {
          fullName: formData.fullName,
          phone: formData.phone,
          gender: formData.gender || "Nam",
          address: formData.address || "",
          birthday: formData.birthday || new Date().toISOString()
        };
        await staffAPI.updateStaffProfile(payload);
        showToast(`Cập nhật thông tin nhân viên ${formData.fullName} thành công!`);
        refetchStaffs();
      } catch (err) {
        showToast("Không thể cập nhật nhân viên (Yêu cầu tài khoản chính chủ)", "error");
      }
    } else {
      // Add mode
      try {
        const username = formData.email.split("@")[0];
        const password = "StaffPassword123@";
        await staffAPI.registerStaff({
          username,
          email: formData.email,
          password,
          phone: formData.phone
        });
        showToast(`Đã thêm nhân viên mới ${formData.fullName}! Mật khẩu mặc định: ${password}`);
        refetchStaffs();
      } catch (err) {
        showToast(err.response?.data?.message || "Lỗi tạo tài khoản nhân viên", "error");
      }
    }
    setIsStaffModalOpen(false);
  };

  // --- Delete actions ---
  const handleOpenDeleteConfirm = (staff, e) => {
    e.stopPropagation();
    setDeleteTarget(staff);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBatchDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    setDeleteTarget("batch");
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget === "batch") {
      try {
        await Promise.all(selectedIds.map((id) => staffAPI.deleteStaff(id)));
        showToast(`Đã xóa thành công ${selectedIds.length} nhân viên được chọn.`);
        setSelectedIds([]);
        refetchStaffs();
      } catch (err) {
        showToast("Lỗi khi xóa danh sách nhân viên", "error");
      }
    } else if (deleteTarget) {
      try {
        await staffAPI.deleteStaff(deleteTarget.id);
        showToast(`Đã xóa nhân viên ${deleteTarget.fullName} khỏi hệ thống.`);
        setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
        refetchStaffs();
      } catch (err) {
        showToast(`Lỗi khi xóa nhân viên ${deleteTarget.fullName}`, "error");
      }
    }
    setIsDeleteModalOpen(false);
  };

  // --- Simulated Excel upload action ---
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast("Đang tải lên và phân tích tệp danh sách...", "success");

    try {
      const mockImports = [
        {
          fullName: "Lâm Quốc Khánh",
          role: "Đầu bếp",
          phone: "0909112233",
          email: "khanhlq@booking.com",
        },
        {
          fullName: "Tạ Tuyết Trinh",
          role: "Thu ngân",
          phone: "0988554433",
          email: "trinhtt@booking.com",
        }
      ];

      await Promise.all(
        mockImports.map(item =>
          staffAPI.registerStaff({
            username: item.email.split("@")[0],
            email: item.email,
            password: "StaffPassword123@",
            phone: item.phone
          })
        )
      );

      showToast("Nhập danh sách nhân viên từ tệp thành công!");
      refetchStaffs();
      e.target.value = "";
    } catch (err) {
      showToast("Lỗi nhập dữ liệu nhân viên từ tệp", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      {/* --- Alert Toast --- */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* --- Header & Action buttons --- */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#5B3A0A]">
            Quản lý nhân viên
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Xem, thêm mới, phân quyền và quản lý trạng thái tài khoản của các nhân viên.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* File input ẩn */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            className="hidden"
          />

          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 rounded-lg border border-[#FA8C00] bg-white px-4 py-2 text-sm font-semibold text-[#FA8C00] hover:bg-[#FFF7E6] transition-all cursor-pointer shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Tải lên danh sách
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-bold text-white hover:bg-[#D97706] active:translate-y-[1px] transition-all cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {/* --- Statistics Cards --- */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng số nhân viên
            </p>
            <p className="mt-1 text-3xl font-extrabold text-[#5B3A0A]">
              {stats.total.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#FA8C00]">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Đang hoạt động
            </p>
            <p className="mt-1 text-3xl font-extrabold text-emerald-600">
              {stats.active.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tạm khóa / Ngưng việc
            </p>
            <p className="mt-1 text-3xl font-extrabold text-rose-600">
              {stats.locked.toLocaleString("vi-VN")}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <UserX className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* --- Filter & Search bar --- */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b border-border p-4 lg:flex-row lg:items-center bg-[#FFFDF8]">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhân viên theo tên, email, số điện thoại..."
              className="h-10 w-full rounded-lg border border-[#FFE7BA] bg-white pl-10 pr-4 text-sm outline-none transition-all hover:border-[#F3D5A1] focus:border-[#FA8C00] focus:bg-[#FFF3D6] focus:ring-1 focus:ring-[#FA8C00]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Bộ lọc Vai trò */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Vai trò:
              </span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-10 rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none hover:border-[#F3D5A1] focus:border-[#FA8C00]"
              >
                <option value="all">Tất cả</option>
                <option value="Quản lý">Quản lý</option>
                <option value="Thu ngân">Thu ngân</option>
                <option value="Đầu bếp">Đầu bếp</option>
                <option value="Nhân viên pha chế">Nhân viên pha chế</option>
                <option value="Nhân viên phục vụ">Nhân viên phục vụ</option>
                <option value="Giao hàng">Giao hàng</option>
              </select>
            </div>

            {/* Bộ lọc Trạng thái */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                Trạng thái:
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-[#FFE7BA] bg-white px-3 text-sm outline-none hover:border-[#F3D5A1] focus:border-[#FA8C00]"
              >
                <option value="all">Tất cả</option>
                <option value="Hoạt động">Hoạt động</option>
                <option value="Tạm khóa">Tạm khóa</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- Batch actions (Bulk Delete) --- */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between border-b border-border bg-orange-50/40 px-5 py-3 transition-all duration-200">
            <span className="text-sm font-semibold text-[#5B3A0A]">
              Đã chọn <strong className="text-[#FA8C00]">{selectedIds.length}</strong> nhân viên
            </span>
            <button
              onClick={handleOpenBatchDeleteConfirm}
              className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa các mục đã chọn
            </button>
          </div>
        )}

        {/* --- Table count info --- */}
        <div className="flex items-center justify-end border-b border-border px-5 py-2.5 bg-[#FFFDF8]/80">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị{" "}
            {filteredStaff.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
            - {Math.min(currentPage * pageSize, filteredStaff.length)} trong số{" "}
            <strong className="text-gray-700">{filteredStaff.length}</strong> nhân viên
          </span>
        </div>

        {/* --- Staff Table --- */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm text-left">
            <thead>
              <tr className="bg-[#FFF7E6] text-[#5B3A0A] text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-4 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPageSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 accent-[#FA8C00]"
                  />
                </th>
                <th className="px-5 py-4">Họ và tên</th>
                <th className="px-5 py-4">Vai trò</th>
                <th className="px-5 py-4">Số điện thoại</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-white">
              {staffLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-[#FA8C00]" />
                      <span className="text-sm text-gray-500">Đang tải danh sách nhân viên…</span>
                    </div>
                  </td>
                </tr>
              ) : currentStaffPage.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    Không có dữ liệu nhân viên nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                currentStaffPage.map((staff, index) => {
                  const isSelected = selectedIds.includes(staff.id);
                  return (
                    <tr
                      key={staff.id}
                      onClick={() => handleSelectRow(staff.id, !isSelected)}
                      className={`group border-t border-border transition-colors hover:bg-[#FFF8E8]/40 cursor-pointer ${
                        isSelected ? "bg-orange-50/15" : ""
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                    >
                      {/* Checkbox select */}
                      <td
                        className="px-5 py-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(staff.id, e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 accent-[#FA8C00]"
                        />
                      </td>

                      {/* Name & ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${getAvatarColor(
                              staff.fullName,
                            )}`}
                          >
                            {getInitials(staff.fullName)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-[#FA8C00] transition-colors">
                              {staff.fullName}
                            </p>
                            <p className="text-xs text-gray-500 font-medium">
                              ID: #{staff.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-lg px-2.5 py-1 text-xs font-bold bg-[#FFE7BA]/75 text-[#92400E]">
                          {staff.role}
                        </span>
                      </td>

                      {/* Phone & Email */}
                      <td className="px-5 py-4 text-gray-600">
                        <div className="space-y-0.5 text-xs font-medium">
                          <p>☎ {staff.phone}</p>
                          <p className="text-gray-400">✉ {staff.email}</p>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            staff.status === "Hoạt động"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              staff.status === "Hoạt động"
                                ? "bg-emerald-600"
                                : "bg-rose-600"
                            }`}
                          />
                          {staff.status}
                        </span>
                      </td>

                      {/* Edit / Delete Buttons */}
                      <td className="px-5 py-4 text-center">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => handleOpenEditModal(staff, e)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#FA8C00] hover:text-[#FA8C00] hover:bg-orange-50/20 transition-all cursor-pointer"
                            title="Sửa nhân viên"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => handleOpenDeleteConfirm(staff, e)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50/20 transition-all cursor-pointer"
                            title="Xóa nhân viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination Footer --- */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 bg-[#FFFDF8]">
            {/* Prev button */}
            <button
              className="rounded-lg p-1.5 text-gray-500 hover:bg-orange-50/40 disabled:opacity-40 transition-colors cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Page buttons */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`min-w-[34px] h-8 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-[#FA8C00] text-white shadow-sm"
                      : "text-gray-600 hover:bg-[#FFF7E6] hover:text-[#5B3A0A]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Next button */}
            <button
              className="rounded-lg p-1.5 text-gray-500 hover:bg-orange-50/40 disabled:opacity-40 transition-colors cursor-pointer"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* --- Modal Form (Add / Edit) --- */}
      <StaffModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        onSave={handleSaveStaff}
        staff={editStaff}
      />

      {/* --- Confirm Delete Modal --- */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        staffName={
          deleteTarget === "batch"
            ? `${selectedIds.length} nhân viên đã chọn`
            : deleteTarget?.fullName || ""
        }
      />
    </div>
  );
};

export default AdStaff;
