import React from "react";

export default function OrderStatusCard() {
  const order = {
    orderId: "DH20260001",
    orderDate: "15/06/2026",
    totalAmount: 350000,
    paymentStatus: "Đã thanh toán",
    orderStatus: "Đang giao",
  };

  const steps = [
    "Chờ xác nhận",
    "Đang chuẩn bị",
    "Đang giao",
    "Hoàn thành",
  ];

  const currentStep = 2;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">
        Theo dõi đơn hàng
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <p>
          <strong>Mã đơn:</strong> {order.orderId}
        </p>

        <p>
          <strong>Ngày đặt:</strong> {order.orderDate}
        </p>

        <p>
          <strong>Tổng tiền:</strong>{" "}
          {order.totalAmount.toLocaleString("vi-VN")} ₫
        </p>

        <p>
          <strong>Thanh toán:</strong>{" "}
          {order.paymentStatus}
        </p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex items-center flex-1"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                ${
                  index < currentStep
                    ? "bg-green-500 text-white"
                    : index === currentStep
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStep ? "✓" : index + 1}
              </div>

              <span
                className={`mt-2 text-sm text-center whitespace-nowrap
                ${
                  index === currentStep
                    ? "font-bold text-orange-500"
                    : ""
                }`}
              >
                {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2
                ${
                  index < currentStep
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}