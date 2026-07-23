import {
  AlertTriangle,
  ArrowRight,
  Banknote,
  Cake,
  CircleDollarSign,
  Clock,
  Printer,
  ShoppingBag,
  Wallet,
  Wheat,
} from "lucide-react";
import StatCard from "@/components/staff/StatCard";
import { Link } from "react-router-dom";
import { useFetch } from "@/hook/customHook";
import { useDispatch } from "react-redux";
import { fetchOrder } from "@/store/slices/orderSlice";
import { fetchAllIngredient } from "@/store/slices/ingredientSlice";
import { isToday } from "date-fns";
import ulti from "@/ultis/ulti";
import { statusDot, statusStyles } from "@/lib/orderConstants";

const StaffHome = () => {
  const dispatch = useDispatch();

  // call api lây danh sách sau đó đưa vào custom hook useFetch để tránh re call
  const fetchDashboard = useCallback(async () => {
    const [orderRes, ingredientRes] = await Promise.allSettled([
      dispatch(fetchOrder()).unwrap(),
      dispatch(fetchAllIngredient()).unwrap(),
    ]);

    return {
      orders: orderRes.status === "fulfilled" ? orderRes.value.data : [],
      ingredients:
        ingredientRes.status === "fulfilled" ? ingredientRes.value : [],
    };
  }, [dispatch]);

  const {
    data: { orders, ingredients },
    loading,
  } = useFetch(fetchDashboard, {
    initialData: {
      orders: [],
      ingredients: [],
    },
  });

  // số lượng đơn chờ, hoàn thành, tổng đơn hôm nay
  const stats = useMemo(() => {
    const todayOrders = orders?.filter((order) =>
      isToday(new Date(order.createdAt)),
    );

    const pendingOrders = orders?.filter(
      (order) => order.status === "Chờ xác nhận",
    );

    const revenueToday = todayOrders?.filter(
      (order) => order.status === "Hoàn thành",
    );

    return {
      todayOrders,
      pendingOrders,
      revenueToday,
    };
  }, [orders]);

  // số lượng nguyên liệu sắp hết
  const MIN_STOCK = 10;

  const lowIngredients = useMemo(() => {
    return ingredients.filter(
      (ingredient) => ingredient.currentStock <= MIN_STOCK,
    );
  }, [ingredients]);

  // danh sách đơn mới nhất đơn chờ xử lý
  const recentPendingOrders = useMemo(() => {
    return [...orders]
      .filter((order) => order.status === "Chờ xác nhận")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  // danh sách nguyên liệu sắp hết và cạn nhất

  const lowIngredientsList = useMemo(() => {
    return ingredients
      .filter((item) => item.currentStock <= MIN_STOCK)
      .sort((a, b) => a.currentStock - b.currentStock)
      .slice(0, 5);
  }, [ingredients]);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">Tổng quan</h1>
        <p className="text-sm text-gray-500">
          Chào mừng trở lại! Đây là tình hình hôm nay của tiệm bánh.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Đơn hàng hôm nay"
          value={stats.todayOrders.length}
          hint="Đơn tạo trong ngày"
          icon={ShoppingBag}
          tone="brand"
        />
        <StatCard
          label="Đơn chờ xử lý"
          value={stats.pendingOrders.length}
          hint="Chờ xác nhận"
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Đơn hoàn thành"
          value={stats.revenueToday.length}
          hint="Hoàn thành"
          icon={CircleDollarSign}
          tone="emerald"
        />
        <StatCard
          label="Cảnh báo nguyên liệu"
          value={lowIngredients.length}
          hint="Sắp hết / hết hàng"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Pending orders */}
        <div className="rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[#5B3A0A]">Đơn hàng chờ xử lý</h2>
            <Link
              to="/staff/orders"
              className="flex items-center gap-1 text-xs font-semibold text-[#FA8C00] hover:underline"
            >
              Xem tất cả <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[#FFE7BA] px-3 py-2.5 animate-pulse"
                >
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 rounded bg-[#FFE7BA]" />
                    <div className="h-3 w-20 rounded bg-[#FFE7BA]/60" />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="h-3.5 w-20 rounded bg-[#FFE7BA] ml-auto" />
                    <div className="h-3 w-14 rounded bg-[#FFE7BA]/60 ml-auto" />
                  </div>
                </div>
              ))
            ) : recentPendingOrders.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                Không có đơn nào đang chờ.
              </p>
            ) : (
              recentPendingOrders.map((o) => (
                <div
                  key={o.orderId}
                  className="flex items-center justify-between rounded-lg border border-[#FFE7BA] px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#5B3A0A]">
                      #{o.orderId} · {o.customerName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {ulti.formatDateTime(new Date(o.createdAt))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#FA8C00]">
                      {ulti.formatVND(o.totalPrice)}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusStyles[o.status]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot[o.status]}`}
                      />
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low ingredients */}
        <div className="rounded-2xl border border-[#FFE7BA] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-[#5B3A0A]">
              Cảnh báo nguyên liệu sắp hết
            </h2>
            <Link
              to="/staff/ingredients"
              className="flex items-center gap-1 text-xs font-semibold text-[#FA8C00] hover:underline"
            >
              Quản lý kho <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border border-[#FFE7BA] px-3 py-2.5 animate-pulse"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-[#FFE7BA]" />
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-24 rounded bg-[#FFE7BA]" />
                      <div className="h-3 w-32 rounded bg-[#FFE7BA]/60" />
                    </div>
                  </div>
                  <div className="h-5 w-14 rounded-full bg-[#FFE7BA]" />
                </div>
              ))
            ) : lowIngredientsList.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">
                Tất cả nguyên liệu đều đủ.
              </p>
            ) : (
              lowIngredientsList.map((i) => {
                const out = i.currentStock === 0;
                return (
                  <div
                    key={i.id}
                    className="flex items-center justify-between rounded-lg border border-[#FFE7BA] px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle
                        className={`h-4 w-4 ${out ? "text-rose-500" : "text-amber-500"}`}
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#5B3A0A]">
                          {i.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Còn {i.currentStock} {i.unit} / tối thiểu 10 {i.unit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${out ? "border-rose-200 bg-rose-50 text-rose-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
                    >
                      {out ? "Hết hàng" : "Sắp hết"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffHome;
