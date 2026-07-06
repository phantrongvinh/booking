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

// Dữ liệu mẫu ban đầu của nhân viên
const initialStaffList = [
  {
    id: "NV-001",
    fullName: "Phạm Trần Minh Anh",
    role: "Quản lý",
    phone: "0912345678",
    email: "minhanh@booking.com",
    status: "Hoạt động",
    createdAt: "2026-01-10",
  },
  {
    id: "NV-002",
    fullName: "Nguyễn Hoàng Nam",
    role: "Thu ngân",
    phone: "0987654321",
    email: "namnh@booking.com",
    status: "Hoạt động",
    createdAt: "2026-02-15",
  },
  {
    id: "NV-003",
    fullName: "Trần Thị Mai",
    role: "Đầu bếp",
    phone: "0905123456",
    email: "maitt@booking.com",
    status: "Hoạt động",
    createdAt: "2026-02-20",
  },
  {
    id: "NV-004",
    fullName: "Lê Văn Hùng",
    role: "Nhân viên phục vụ",
    phone: "0934567890",
    email: "hunglv@booking.com",
    status: "Tạm khóa",
    createdAt: "2026-03-01",
  },
  {
    id: "NV-005",
    fullName: "Nguyễn Thị Lan",
    role: "Nhân viên pha chế",
    phone: "0978123456",
    email: "lannt@booking.com",
    status: "Hoạt động",
    createdAt: "2026-03-05",
  },
  {
    id: "NV-006",
    fullName: "Vũ Minh Đức",
    role: "Giao hàng",
    phone: "0967890123",
    email: "ducvm@booking.com",
    status: "Hoạt động",
    createdAt: "2026-03-12",
  },
  {
    id: "NV-007",
    fullName: "Đặng Hồng Nhung",
    role: "Thu ngân",
    phone: "0923456789",
    email: "nhungdh@booking.com",
    status: "Hoạt động",
    createdAt: "2026-04-02",
  },
  {
    id: "NV-008",
    fullName: "Hoàng Văn Khánh",
    role: "Đầu bếp",
    phone: "0945678901",
    email: "khanhhv@booking.com",
    status: "Tạm khóa",
    createdAt: "2026-04-10",
  },
];

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
  const [staffList, setStaffList] = useState([]);
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

  // --- Load & Save Local Storage ---
  useEffect(() => {
    const stored = localStorage.getItem("booking_staff_list");
    if (stored) {
      try {
        setStaffList(JSON.parse(stored));
      } catch (e) {
        setStaffList(initialStaffList);
      }
    } else {
      setStaffList(initialStaffList);
      localStorage.setItem("booking_staff_list", JSON.stringify(initialStaffList));
    }
  }, []);

  const saveToStorage = (newList) => {
    setStaffList(newList);
    localStorage.setItem("booking_staff_list", JSON.stringify(newList));
  };

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
        staff.phone.includes(searchQuery) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleOpenEditModal = (staff, e) => {
    e.stopPropagation();
    setEditStaff(staff);
    setIsStaffModalOpen(true);
  };

  const handleSaveStaff = (formData) => {
    if (editStaff) {
      // Edit mode
      const updated = staffList.map((item) =>
        item.id === editStaff.id ? { ...item, ...formData } : item,
      );
      saveToStorage(updated);
      showToast(`Cập nhật thông tin nhân viên ${formData.fullName} thành công!`);
    } else {
      // Add mode
      // Generate custom ID (NV-xxx)
      let nextNum = 1;
      if (staffList.length > 0) {
        const ids = staffList.map((s) => {
          const match = s.id.match(/NV-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        nextNum = Math.max(...ids) + 1;
      }
      const newId = `NV-${String(nextNum).padStart(3, "0")}`;

      const newStaff = {
        id: newId,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      saveToStorage([newStaff, ...staffList]);
      showToast(`Đã thêm nhân viên mới ${formData.fullName}!`);
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

  const handleConfirmDelete = () => {
    if (deleteTarget === "batch") {
      const updated = staffList.filter((s) => !selectedIds.includes(s.id));
      saveToStorage(updated);
      showToast(`Đã xóa thành công ${selectedIds.length} nhân viên được chọn.`);
      setSelectedIds([]);
    } else if (deleteTarget) {
      const updated = staffList.filter((s) => s.id !== deleteTarget.id);
      saveToStorage(updated);
      showToast(`Đã xóa nhân viên ${deleteTarget.fullName} khỏi hệ thống.`);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    }
    setIsDeleteModalOpen(false);
  };

  // --- Simulated Excel upload action ---
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    showToast("Đang tải lên và phân tích tệp danh sách...", "success");

    // Giả lập xử lý đọc file
    setTimeout(() => {
      let nextNum = 1;
      if (staffList.length > 0) {
        const ids = staffList.map((s) => {
          const match = s.id.match(/NV-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        nextNum = Math.max(...ids) + 1;
      }

      const importedStaff = [
        {
          id: `NV-${String(nextNum).padStart(3, "0")}`,
          fullName: "Lâm Quốc Khánh",
          role: "Đầu bếp",
          phone: "0909112233",
          email: "khanhlq@booking.com",
          status: "Hoạt động",
          createdAt: new Date().toISOString().split("T")[0],
        },
        {
          id: `NV-${String(nextNum + 1).padStart(3, "0")}`,
          fullName: "Tạ Tuyết Trinh",
          role: "Thu ngân",
          phone: "0988554433",
          email: "trinhtt@booking.com",
          status: "Hoạt động",
          createdAt: new Date().toISOString().split("T")[0],
        },
        {
          id: `NV-${String(nextNum + 2).padStart(3, "0")}`,
          fullName: "Hoàng Gia Bảo",
          role: "Nhân viên phục vụ",
          phone: "0933778899",
          email: "baohg@booking.com",
          status: "Tạm khóa",
          createdAt: new Date().toISOString().split("T")[0],
        },
      ];

      const updated = [...importedStaff, ...staffList];
      saveToStorage(updated);
      showToast("Tải lên thành công! Đã thêm 3 nhân viên mới vào hệ thống.");
      // Clear file input
      e.target.value = "";
    }, 1500);
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
              {currentStaffPage.length === 0 ? (
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
