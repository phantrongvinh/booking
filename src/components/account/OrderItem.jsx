import ulti from "@/ultis/ulti";
import ButtonCustom from "../ButtonCustom";

const OrderItem = ({ order }) => {
  const handleClick = (o) => {
    console.log(o);
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 md:px-6 py-4 border-b">
        <div>
          <h3 className="font-semibold text-base md:text-lg text-[#6B4E41]">
            #{order.id}
          </h3>
          <p className="text-sm text-gray-500">Ngày đặt: {order.createdAt}</p>
        </div>

        <span className="self-start sm:self-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          {order.status}
        </span>
      </div>

      {/* Product list */}
      <div className="px-4 md:px-6 py-2">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 md:gap-4 py-4 border-b last:border-none"
          >
            <img
              src={item.image}
              alt=""
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-[#6B4E41] line-clamp-2">
                {item.name}
              </h4>

              <p className="text-sm text-gray-500 mt-1">
                Số lượng: x{item.quantity}
              </p>

              <p className="font-semibold text-[#6B4E41] mt-2 md:hidden">
                {ulti.formatVND(item.price)}
              </p>
            </div>

            <div className="hidden md:block font-semibold text-[#6B4E41]">
              {ulti.formatVND(item.price)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-4 bg-[#FFF8E8]">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Tổng tiền:</span>

          <span className="text-lg md:text-xl font-bold text-[#FF7A00]">
            {ulti.formatVND(order.totalAmount)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {order.status === "PROCESSING" && (
            <ButtonCustom
              size="lg"
              name="Hủy đơn"
              color="border-[#ff0000] text-[#ff0000] hover:bg-[#ff0000]"
            />
          )}

          {order.status === "COMPLETED" && (
            <ButtonCustom
              size="lg"
              name="Mua lại"
              color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
            />
          )}

          <ButtonCustom
            size="lg"
            name="Xem chi tiết"
            color="border-[#6B4E41] text-[#6B4E41] hover:bg-[#6B4E41]"
            onClick={() => handleClick(order)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
