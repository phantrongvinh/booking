import { Banknote, Cake, ShoppingBag, Wallet, Wheat } from "lucide-react";
import StaffLayout from "./layout/StaffLayout";
import StatCard from "@/components/staff/StatCard";
import { Link } from "react-router-dom";
import { useFetch } from "@/hook/customHook";
import { useDispatch } from "react-redux";
import { fetchOrder } from "@/store/slices/orderSlice";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const StaffHome = () => {
  const dispatch = useDispatch();

  const {
    data: { orders },
    loading,
  } = useFetch(
    async () => {
      const rs = await dispatch(fetchOrder()).unwrap();
      const orders = rs.data;
      return { orders };
    },
    {
      initialData: { orders: [] },
    },
  );

  const recent = orders
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tổng quan</h1>
        <p className="text-gray-500">
          Chào mừng trở lại, đây là tình hình hôm nay 🥐
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon={<Banknote className="h-5 w-5 text-green-500" />}
          accent="bg-green-500/12"
          label="Tổng đơn hàng"
          value={1000}
        />

        <StatCard
          icon={<ShoppingBag className="h-5 w-5 text-yellow-500" />}
          accent="bg-yellow-500/12"
          label="Đơn hàng chờ xử lý"
          value={28}
        />

        <StatCard
          icon={<ShoppingBag className="h-5 w-5 text-destructive" />}
          accent="bg-destructive/12"
          label="Cảnh báo hết hàng"
          value={9}
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Đơn hàng gần đây
            </h2>
            <p className="text-sm text-muted-foreground">
              Danh sách 5 đơn hàng mới nhất
            </p>
          </div>

          <Link
            to="/staff/orders"
            className="rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-500 transition hover:bg-orange-50"
          >
            Xem tất cả
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="bg-orange-50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Mã đơn
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Khách hàng
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-orange-500">
                  SL
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Tổng tiền
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {recent.length > 0 ? (
                recent.map((order) => (
                  <tr
                    key={order.orderId}
                    className="transition-colors hover:bg-orange-50"
                  >
                    {/* Mã đơn */}
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-sm font-bold text-orange-600 shadow-sm">
                        #{order.orderId}
                      </span>
                    </td>

                    {/* Khách hàng */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600 shadow-sm">
                          {order.userId}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-600">
                            User #{order.userId}
                          </span>
                          <span className="text-xs text-gray-400">
                            {order.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SL */}
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-sm font-semibold text-orange-600 shadow-sm">
                        {order.totalQuantity}
                      </span>
                    </td>

                    {/* Tổng tiền */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-orange-600">
                        {formatVND(order.totalPrice)}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-4 text-center">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="bg-orange-100 text-orange-600 shadow-sm hover:bg-orange-200 hover:text-orange-600"
                      >
                        <Link
                          to="/in-phieu-che-bien"
                          search={{ order: order.orderId }}
                        >
                          <Printer className="mr-1 h-4 w-4" /> In phiếu
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingBag className="h-10 w-10 text-orange-200" />
                      <p className="text-gray-600">Chưa có đơn hàng nào.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffHome;
