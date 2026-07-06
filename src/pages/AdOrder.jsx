import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Plus,
  Eye,
  SlidersHorizontal,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Clock,
  CircleDollarSign,
  Ban,
  CalendarCheck,
} from "lucide-react";
import OrderModal from "@/components/admin/OrderModal";
import OrderFilterDrawer from "@/components/admin/OrderFilterDrawer";
import ToastNotification from "@/components/admin/ToastNotification";

// Dữ liệu mẫu ban đầu
const initialOrderList = [
  {
    orderId: "ORD-9021",
    customerName: "Nguyễn Văn Linh",
    phone: "0912345678",
    email: "linh.nv@example.com",
    createdAt: "2023-10-15T14:30:00",
    totalPrice: 1250000,
    status: "Đã giao",
    shippingAddress: "123 Đường Ba Tháng Hai, Quận 10, TP.HCM",
    note: "Giao giờ hành chính, gọi điện trước khi đến.",
    payment: { paymentMethod: "Momo", status: "Đã thanh toán" },
    items: [
      { productId: 101, productName: "Bánh Kem Dâu Tây Grand", quantity: 3, unitPrice: 350000, totalPrice: 1050000 },
      { productId: 105, productName: "Bánh Bông Lan Trứng Muối", quantity: 1, unitPrice: 200000, totalPrice: 200000 },
    ],
  },
  {
    orderId: "ORD-9022",
    customerName: "Hà Thị Thu",
    phone: "0987654321",
    email: "thuha88@example.com",
    createdAt: "2023-10-15T15:12:00",
    totalPrice: 850000,
    status: "Đang giao",
    shippingAddress: "456 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    note: "Không cần muỗng nĩa nhựa.",
    payment: { paymentMethod: "Chuyển khoản", status: "Đã thanh toán" },
    items: [
      { productId: 101, productName: "Bánh Kem Dâu Tây Grand", quantity: 2, unitPrice: 350000, totalPrice: 700000 },
      { productId: 102, productName: "Bánh Croissant Bơ Pháp", quantity: 3, unitPrice: 50000, totalPrice: 150000 },
    ],
  },
  {
    orderId: "ORD-9023",
    customerName: "Phạm Văn Nam",
    phone: "0905123456",
    email: "nampham@gmail.com",
    createdAt: "2023-10-15T16:05:00",
    totalPrice: 3400000,
    status: "Chờ xác nhận",
    shippingAddress: "789 Nguyễn Huệ, Quận 1, TP.HCM",
    note: "Làm bánh ít ngọt, viết chữ 'Chúc mừng sinh nhật bé Bo'.",
    payment: { paymentMethod: "Tiền mặt", status: "Chưa thanh toán" },
    items: [
      { productId: 101, productName: "Bánh Kem Dâu Tây Grand", quantity: 8, unitPrice: 350000, totalPrice: 2800000 },
      { productId: 105, productName: "Bánh Bông Lan Trứng Muối", quantity: 3, unitPrice: 200000, totalPrice: 600000 },
    ],
  },
  {
    orderId: "ORD-9024",
    customerName: "Trần Anh Tú",
    phone: "0934567890",
    email: "anhtu.tr@example.com",
    createdAt: "2023-10-15T16:45:00",
    totalPrice: 540000,
    status: "Đã hủy",
    shippingAddress: "12 Hoàng Hoa Thám, Quận Tân Bình, TP.HCM",
    note: "",
    payment: { paymentMethod: "Tiền mặt", status: "Chưa thanh toán" },
    items: [
      { productId: 102, productName: "Bánh Croissant Bơ Pháp", quantity: 2, unitPrice: 50000, totalPrice: 100000 },
      { productId: 103, productName: "Bánh Tiramisu Ý Classic", quantity: 4, unitPrice: 110000, totalPrice: 440000 },
    ],
  },
  {
    orderId: "ORD-9025",
    customerName: "Lê Thị Lan",
    phone: "0978123456",
    email: "lanle@gmail.com",
    createdAt: "2023-10-16T09:20:00",
    totalPrice: 980000,
    status: "Đã giao",
    shippingAddress: "88 Lý Tự Trọng, Quận 1, TP.HCM",
    payment: { paymentMethod: "Momo", status: "Đã thanh toán" },
    items: [
      { productId: 104, productName: "Bánh Mousse Chanh Dây", quantity: 15, unitPrice: 65000, totalPrice: 975000 },
    ],
  },
  {
    orderId: "ORD-9026",
    customerName: "Vũ Minh Đức",
    phone: "0967890123",
    email: "ducvm@booking.com",
    createdAt: "2023-10-16T10:45:00",
    totalPrice: 470000,
    status: "Chờ xác nhận",
    shippingAddress: "321 Đoàn Văn Bơ, Quận 4, TP.HCM",
    payment: { paymentMethod: "Tiền mặt", status: "Chưa thanh toán" },
    items: [
      { productId: 103, productName: "Bánh Tiramisu Ý Classic", quantity: 3, unitPrice: 110000, totalPrice: 330000 },
      { productId: 102, productName: "Bánh Croissant Bơ Pháp", quantity: 2, unitPrice: 50000, totalPrice: 100000 },
      { productId: 106, productName: "Trà Đào Cam Sả", quantity: 1, unitPrice: 40000, totalPrice: 40000 },
    ],
  },
];

// Helper lấy initials cho Avatar
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
];

const getAvatarColor = (name) => {
  if (!name) return avatarColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

const AdOrder = () => {
  // --- States ---
  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest

  // Drawer Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minPrice: "",
    maxPrice: "",
    paymentMethod: "all",
    status: "all",
  });
  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals & Toast
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view | create
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  // --- Load/Save Local Storage ---
  useEffect(() => {
    const stored = localStorage.getItem("booking_order_list");
    if (stored) {
      try {
        setOrderList(JSON.parse(stored));
      } catch (e) {
        setOrderList(initialOrderList);
      }
    } else {
      setOrderList(initialOrderList);
      localStorage.setItem("booking_order_list", JSON.stringify(initialOrderList));
    }
  }, []);

  const saveToStorage = (newList) => {
    setOrderList(newList);
    localStorage.setItem("booking_order_list", JSON.stringify(newList));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // --- Calculations for Stats Cards ---
  const stats = useMemo(() => {
    const totalToday = orderList.length; // Có thể hiểu là tổng đơn hàng đang lưu trữ
    const pending = orderList.filter((o) => o.status === "Chờ xác nhận").length;
    const revenue = orderList
      .filter((o) => o.status !== "Đã hủy")
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const cancelled = orderList.filter((o) => o.status === "Đã hủy").length;

    return { totalToday, pending, revenue, cancelled };
  }, [orderList]);

  // --- Filter and Search logic ---
  const processedOrders = useMemo(() => {
    let result = orderList.filter((order) => {
      // 1. Search Query
      const matchSearch =
        !searchQuery ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.includes(searchQuery);

      // 2. Status
      const matchStatus =
        appliedFilters.status === "all" || order.status === appliedFilters.status;

      // 3. Payment Method
      const matchPayment =
        appliedFilters.paymentMethod === "all" ||
        order.payment?.paymentMethod === appliedFilters.paymentMethod;

      // 4. Date Range
      let matchDate = true;
      if (appliedFilters.startDate) {
        matchDate = matchDate && new Date(order.createdAt) >= new Date(appliedFilters.startDate);
      }
      if (appliedFilters.endDate) {
        // Tới cuối ngày đó
        const endDateTime = new Date(appliedFilters.endDate);
        endDateTime.setHours(23, 59, 59, 999);
        matchDate = matchDate && new Date(order.createdAt) <= endDateTime;
      }

      // 5. Price Range
      let matchPrice = true;
      if (appliedFilters.minPrice) {
        matchPrice = matchPrice && order.totalPrice >= parseFloat(appliedFilters.minPrice);
      }
      if (appliedFilters.maxPrice) {
        matchPrice = matchPrice && order.totalPrice <= parseFloat(appliedFilters.maxPrice);
      }

      return matchSearch && matchStatus && matchPayment && matchDate && matchPrice;
    });

    // Sort Logic
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [orderList, searchQuery, appliedFilters, sortBy]);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, appliedFilters, sortBy]);

  const totalPages = Math.ceil(processedOrders.length / pageSize) || 1;
  const currentOrdersPage = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedOrders.slice(start, start + pageSize);
  }, [processedOrders, currentPage]);

  // --- Filter Drawer Actions ---
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setIsFilterOpen(false);
    showToast("Đã áp dụng bộ lọc nâng cao.", "success");
  };

  const handleResetFilters = () => {
    const cleared = {
      startDate: "",
      endDate: "",
      minPrice: "",
      maxPrice: "",
      paymentMethod: "all",
      status: "all",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setIsFilterOpen(false);
    showToast("Đã đặt lại bộ lọc.", "success");
  };

  // --- Open Modal Actions ---
  const handleOpenViewModal = (order) => {
    setSelectedOrder(order);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedOrder(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // --- Save / Update Actions ---
  const handleSaveOrder = (data) => {
    if (modalMode === "view") {
      // Update status mode
      const updated = orderList.map((item) =>
        item.orderId === data.orderId ? { ...item, status: data.status } : item
      );
      saveToStorage(updated);
      showToast(`Đã chuyển trạng thái đơn hàng #${data.orderId} sang "${data.status}"`);
    } else {
      // Create new order mode
      // Generate ID
      let nextNum = 9021;
      if (orderList.length > 0) {
        const ids = orderList.map((o) => {
          const match = o.orderId.match(/ORD-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        });
        nextNum = Math.max(...ids) + 1;
      }
      const newOrderId = `ORD-${nextNum}`;

      const newOrder = {
        orderId: newOrderId,
        customerName: data.customerInfo.fullName,
        phone: data.customerInfo.phone,
        email: data.customerInfo.email,
        createdAt: new Date().toISOString(),
        totalPrice: data.totalPrice,
        status: "Chờ xác nhận",
        shippingAddress: data.customerInfo.address,
        note: data.note,
        payment: data.payment,
        items: data.items,
        voucher: data.voucher,
      };

      saveToStorage([newOrder, ...orderList]);
      showToast(`Tạo đơn hàng #${newOrderId} thành công!`);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-2 py-4 sm:px-4">
      {/* Alert toast notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Title Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#5B3A0A]">
            Danh sách Đơn hàng
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi, xử lý đơn đặt hàng tại quầy và đơn hàng giao online.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[#FFE7BA] bg-white px-4 py-2 text-sm font-semibold text-[#5B3A0A] hover:bg-[#FFF7E6] transition-all cursor-pointer shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#FA8C00]" />
            Bộ lọc
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 rounded-lg bg-[#FA8C00] px-4 py-2 text-sm font-bold text-white hover:bg-[#D97706] active:translate-y-[1px] transition-all cursor-pointer shadow-md"
          >
            <Plus className="h-4 w-4" />
            Tạo đơn hàng mới
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total orders today */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tổng đơn hàng
            </p>
            <p className="text-2xl font-black text-[#5B3A0A]">{stats.totalToday}</p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
              +12% hôm nay
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#FA8C00]">
            <ShoppingBag className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 2: Pending processing */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Chờ xử lý
            </p>
            <p className="text-2xl font-black text-amber-600">{stats.pending}</p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
              -5% hôm qua
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Clock className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 3: Today's Revenue */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Doanh thu hôm nay
            </p>
            <p className="text-2xl font-black text-[#5B3A0A]">
              {stats.revenue.toLocaleString("vi-VN")}đ
            </p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
              +8.2%
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CircleDollarSign className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Card 4: Cancelled orders */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Đơn đã hủy
            </p>
            <p className="text-2xl font-black text-rose-600">{stats.cancelled}</p>
            <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
              Ổn định
            </span>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <Ban className="h-5.5 w-5.5" />
          </div>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Table Subheader (Filter and Sort) */}
        <div className="flex flex-col justify-between gap-3 border-b border-border p-4 lg:flex-row lg:items-center bg-[#FFFDF8]">
          <h2 className="text-base font-extrabold text-[#5B3A0A]">Tất cả đơn hàng</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search inputs */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã đơn, tên khách..."
                className="h-9 w-full rounded-lg border border-[#FFE7BA] bg-white pl-8 pr-3 text-xs outline-none hover:border-[#F3D5A1] focus:border-[#FA8C00]"
              />
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 rounded-lg border border-[#FFE7BA] bg-white px-3 text-xs outline-none focus:border-[#FA8C00]"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            {/* Reset Filter Button */}
            <button
              onClick={handleResetFilters}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#FFE7BA] hover:bg-orange-50/20 text-gray-500 hover:text-[#FA8C00] transition-colors cursor-pointer"
              title="Đặt lại bộ lọc"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Count details */}
        <div className="flex items-center justify-end border-b border-border px-5 py-2.5 bg-[#FFFDF8]/80">
          <span className="text-xs text-gray-500 font-medium">
            Hiển thị{" "}
            {processedOrders.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
            - {Math.min(currentPage * pageSize, processedOrders.length)} trong số{" "}
            <strong className="text-gray-700">{processedOrders.length}</strong> đơn hàng
          </span>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm text-left">
            <thead>
              <tr className="bg-[#FFF7E6] text-[#5B3A0A] text-xs font-bold uppercase tracking-wider">
                <th className="px-5 py-4 w-32">Mã đơn hàng</th>
                <th className="px-5 py-4">Khách hàng</th>
                <th className="px-5 py-4">Ngày đặt</th>
                <th className="px-5 py-4">Tổng tiền</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">Hành động</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border bg-white">
              {currentOrdersPage.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-400">
                    Không tìm thấy đơn hàng nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                currentOrdersPage.map((order, idx) => (
                  <tr
                    key={order.orderId}
                    onClick={() => handleOpenViewModal(order)}
                    className="group border-t border-border hover:bg-[#FFF8E8]/40 transition-colors cursor-pointer"
                  >
                    {/* Order ID */}
                    <td className="px-5 py-4 font-extrabold text-blue-600 group-hover:text-blue-700">
                      #{order.orderId}
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm shrink-0 ${getAvatarColor(
                            order.customerName
                          )}`}
                        >
                          {getInitials(order.customerName)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#FA8C00] transition-colors">
                            {order.customerName}
                          </p>
                          <p className="text-[11px] text-gray-500 font-medium">{order.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Order Date */}
                    <td className="px-5 py-4 text-gray-600">
                      <div className="space-y-0.5 text-xs font-medium">
                        <p>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                        <p className="text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </td>

                    {/* Total price */}
                    <td className="px-5 py-4 font-extrabold text-gray-900">
                      {order.totalPrice?.toLocaleString("vi-VN")}đ
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          order.status === "Đã giao"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Đang giao"
                            ? "bg-blue-50 text-blue-700"
                            : order.status === "Chờ xác nhận"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            order.status === "Đã giao"
                              ? "bg-emerald-600"
                              : order.status === "Đang giao"
                              ? "bg-blue-600"
                              : order.status === "Chờ xác nhận"
                              ? "bg-amber-500"
                              : "bg-rose-600"
                          }`}
                        />
                        {order.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenViewModal(order)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#FA8C00] hover:text-[#FA8C00] hover:bg-orange-50/20 transition-all cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setModalMode("view");
                            setIsModalOpen(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#FA8C00] hover:text-[#FA8C00] hover:bg-orange-50/20 transition-all cursor-pointer"
                          title="Cập nhật trạng thái"
                        >
                          <CalendarCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 bg-[#FFFDF8]">
            <button
              className="rounded-lg p-1.5 text-gray-500 hover:bg-orange-50/40 disabled:opacity-40 transition-colors cursor-pointer"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

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

      {/* Advanced Filter Drawer */}
      <OrderFilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      {/* Main Order Modal (View & Create) */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveOrder}
        order={selectedOrder}
        mode={modalMode}
      />
    </div>
  );
};

export default AdOrder;
