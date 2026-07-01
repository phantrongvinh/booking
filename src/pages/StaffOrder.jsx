import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { useSelector } from "react-redux";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";

const StaffOrder = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { orders } = useSelector((state) => state.order);

  const selected = useMemo(() => {
    return orders?.find((o) => String(o.id) === id);
  }, [id, orders]);

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
              placeholder="Tìm sản phẩm…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </div>

          <Select>
            <SelectTrigger className="w-full h-10 sm:w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="dang-xu-ly">Đang xử lý</SelectItem>
              <SelectItem value="hoan-thanh">Hoàn thành</SelectItem>
              <SelectItem value="da-huy">Đã hủy</SelectItem>
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
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3">Thời gian</th>
                <th className="px-5 py-3 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((o) => (
                <tr key={o.id} className="border-t hover:bg-muted/30">
                  <td className="px-5 py-3 font-semibold">{o.id}</td>
                  <td className="px-5 py-3">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted-foreground">
                      {o.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3">{formatVND(o.total)}</td>
                  <td className="px-5 py-3">
                    {/* <OrderStatusBadge status={o.status} /> */}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {o.createdAt}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/orders/${o.id}`)}
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ================= DIALOG ================= */}
        <Dialog open={!!id} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="sm:max-w-lg">
            {!selected ? (
              <div className="text-sm text-muted-foreground">
                Không tìm thấy đơn hàng
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Đơn {selected.id}</DialogTitle>
                </DialogHeader>

                {/* ITEMS */}
                <div className="rounded-xl border">
                  {selected.items.map((it) => (
                    <div
                      key={it.id || it.productName}
                      className="flex justify-between border-b px-4 py-2 text-sm last:border-0"
                    >
                      <span>{it.productName}</span>
                      <span className="text-muted-foreground">x{it.qty}</span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="flex justify-between rounded-xl bg-muted/50 px-4 py-3">
                  <span>Tổng tiền</span>
                  <span className="font-semibold">
                    {formatVND(selected.total)}
                  </span>
                </div>

                {/* STATUS UPDATE */}
                <Select
                  value={selected.status}
                  onValueChange={(v) => updateStatus(selected.id, v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dang-xu-ly">Đang xử lý</SelectItem>
                    <SelectItem value="hoan-thanh">Hoàn thành</SelectItem>
                    <SelectItem value="da-huy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default StaffOrder;
