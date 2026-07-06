import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Printer, Search } from "lucide-react";
import {
  fetchOrder,
  getOrderById,
  updateOrderStatus,
} from "@/store/slices/orderSlice";
import { useFetch, useSubmit } from "@/hook/customHook";
import ulti from "@/ultis/ulti";
import { Button } from "@/components/ui/button";

const StaffOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.order);

  const { id } = useParams();

  const {
    data: { orders },
    loading,
    fetch: reloadList,
  } = useFetch(
    async () => {
      const res = await dispatch(fetchOrder()).unwrap();
      const orders = res.data;
      return {
        orders,
      };
    },
    { initialData: { orders: [] } },
  );

  // filter orders
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = orders?.filter((order) => {
    const matchStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    const keyword = query.trim().toLowerCase();

    const matchSearch =
      String(order.orderId).includes(keyword) ||
      (order.customerName ?? order.user?.fullName ?? "")
        .toLowerCase()
        .includes(keyword) ||
      (order.shippingAddress ?? "").toLowerCase().includes(keyword);

    return matchStatus && matchSearch;
  });

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil((filteredOrders?.length || 0) / pageSize);

  const currentOrders = filteredOrders?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedStatus]);

  // xem chi tiết
  const [selectedStatusOrder, setSelectedStatusOrder] = useState("");

  const {
    data: { order } = {},
    loading: orderLoading,
    fetch: reloadOrder,
  } = useFetch(
    async () => {
      if (!id) {
        return { order: null };
      }

      const res = await dispatch(getOrderById(id)).unwrap();

      return { order: res.data };
    },
    {
      initialData: {
        order: null,
      },
    },
  );

  const closeDialog = () => {
    navigate("/staff/orders");
  };

  // cập nhật trạng thái
  const statusOptions = [
    { value: "1", label: "Đang làm" },
    { value: "2", label: "Đang giao" },
    { value: "3", label: "Hoàn thành" },
  ];

  const [note, setNote] = useState("");

  const { submit: updateStatus, loading: updating } = useSubmit(
    async ({ orderId, newStatus, note }) => {
      await dispatch(updateOrderStatus({ orderId, newStatus, note })).unwrap();
    },
    {
      onSuccess: () => {
        reloadList();
        reloadOrder();
        setNote("");
        setSelectedStatusOrder("");
      },
    },
  );

  const handleSubmit = () => {
    if (!selectedStatus) return;
    updateStatus({
      orderId: order.orderId,
      newStatus: Number(selectedStatus),
      note,
    });
  };

  // in hóa đơn
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Đơn hàng</h1>
        <p className="text-gray-500">Quản lý và cập nhật trạng thái đơn hàng</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          {/* SEARCH */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm sản phẩm…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full h-10 sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent className="w-[var(--radix-select-trigger-width)]">
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
              <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
              <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
              <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* ================= LIST ================= */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3">Mã đơn</th>
                <th className="px-5 py-3">Khách hàng</th>
                <th className="px-5 py-3">Tổng tiền</th>
                <th className="px-5 py-3 text-center">Trạng thái</th>
                <th className="px-5 py-3 text-center">Thời gian</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className=" py-8  text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentOrders?.length === 0 ? (
                <tr className="">
                  <td
                    colSpan={6}
                    className=" py-8  text-center text-muted-foreground"
                  >
                    Không tìm thấy đơn hàng.
                  </td>
                </tr>
              ) : (
                currentOrders?.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-muted/30">
                    <td className="px-5 py-3 font-semibold">{o.orderId}</td>
                    <td className="px-5 py-3">
                      <div>{o.customerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {o.phone}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {ulti.formatVND(o.totalPrice)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {" "}
                      <span
                        className={`inline-flex  items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          o.status === "Đang làm"
                            ? "bg-blue-100 text-blue-700"
                            : o.status === "Đang giao"
                              ? "bg-yellow-100 text-yellow-700"
                              : o.status === "Hoàn thành"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-center">
                      {ulti.formatDate(o.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/staff/orders/${o.orderId}`)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="flex items-center justify-between border-t p-4">
            <span className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * pageSize + 1} -
              {Math.min(currentPage * pageSize, filteredOrders?.length)}
              {" / "}
              {filteredOrders?.length} đơn hàng
            </span>

            <div className="flex items-center gap-2">
              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Trước
              </button>

              <span className="text-sm">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                className="rounded border px-3 py-1 disabled:opacity-50"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
        {/* ================= DIALOG ================= */}
        <Dialog open={!!id} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            {!order ? (
              <div className="p-6 text-center">Đang tải...</div>
            ) : (
              <>
                <DialogHeader className="flex flex-row items-start justify-between">
                  <div>
                    <DialogTitle>Đơn hàng #{order.orderId}</DialogTitle>
                    <DialogDescription>
                      Tạo lúc {ulti.formatDateTime(order.createdAt)}
                    </DialogDescription>
                  </div>
                </DialogHeader>

                {/* Thông tin đơn hàng */}
                <div className="print-area">
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Khách hàng</p>
                      <p className="font-medium">{order.customerName}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">SĐT</p>
                      <p className="font-medium">{order.phone}</p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-muted-foreground">Địa chỉ giao hàng</p>
                      <p>{order.shippingAddress}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Thanh toán</p>
                      <p>{order.paymentMethod}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Trạng thái</p>
                      {order.status}
                    </div>

                    {order.note && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Ghi chú</p>
                        <p>{order.note}</p>
                      </div>
                    )}

                    {order.cancelReason && (
                      <div className="col-span-2 rounded-lg bg-red-50 p-3 text-red-600">
                        <strong>Lý do hủy:</strong> {order.cancelReason}
                      </div>
                    )}
                  </div>

                  {/* Danh sách sản phẩm */}
                  <div>
                    <h3 className="mb-2 font-semibold">Sản phẩm</h3>

                    <div className="rounded-lg border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">Sản phẩm</th>
                            <th className="px-4 py-2 text-center">SL</th>
                            <th className="px-4 py-2 text-right">Đơn giá</th>
                            <th className="px-4 py-2 text-right">Thành tiền</th>
                          </tr>
                        </thead>

                        <tbody>
                          {order.items.map((item) => (
                            <tr key={item.productId} className="border-t">
                              <td className="px-4 py-2">{item.productName}</td>

                              <td className="px-4 py-2 text-center">
                                {item.quantity}
                              </td>

                              <td className="px-4 py-2 text-right">
                                {ulti.formatVND(item.unitPrice)}
                              </td>

                              <td className="px-4 py-2 text-right font-medium">
                                {ulti.formatVND(item.totalPrice)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tổng tiền */}
                  <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                    <span className="font-medium">Tổng thanh toán</span>

                    <span className="text-xl font-bold text-primary">
                      {ulti.formatVND(order.totalPrice)}
                    </span>
                  </div>
                </div>
                {/* Lịch sử trạng thái */}
                <div>
                  <h3 className="mb-2 font-semibold">Lịch sử trạng thái</h3>

                  <div className="space-y-3">
                    {order.statusHistory.map((history, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">{history.status}</span>

                          <span className="text-muted-foreground">
                            {ulti.formatDateTime(history.changedAt)}
                          </span>
                        </div>

                        <div className="text-muted-foreground mt-1">
                          {history.changedByUserName}
                        </div>

                        {history.note && (
                          <div className="mt-1 italic">{history.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cập nhật trạng thái */}
                <div className="space-y-2">
                  <div className="text-sm font-medium mb-2">
                    Cập nhật trạng thái
                  </div>

                  <Select
                    value={selectedStatusOrder}
                    onValueChange={setSelectedStatusOrder}
                    disabled={
                      order.statusHistory[order.statusHistory.length - 1]
                        .status === "Hoàn thành"
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Cập nhật trạng thái" />
                    </SelectTrigger>

                    <SelectContent className="w-[var(--radix-select-trigger-width)]">
                      {statusOptions.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú..."
                    className="border rounded-lg p-2 text-sm w-full"
                    disabled={
                      order.statusHistory[order.statusHistory.length - 1]
                        .status === "Hoàn thành"
                    }
                  />

                  {error && (
                    <p className="text-sm text-red-500">
                      {error.message || error}
                    </p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !selectedStatusOrder ||
                      updating ||
                      order.statusHistory[order.statusHistory.length - 1]
                        .status === "Hoàn thành"
                    }
                    className="w-full border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00] hover:text-[#FFF]"
                  >
                    {order.statusHistory[order.statusHistory.length - 1]
                      .status === "Hoàn thành"
                      ? "Đã hoàn thành "
                      : updating
                        ? "Đang cập nhật..."
                        : "Xác nhận cập nhật"}
                  </Button>
                </div>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" />
                  In hóa đơn
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default StaffOrder;
