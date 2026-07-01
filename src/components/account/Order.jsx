import OrderItem from "./OrderItem";

const Order = () => {
  const orders = [
    {
      id: "DH001",
      createdAt: "2026-06-15 09:30",
      status: "COMPLETED",
      totalAmount: 650000,
      paymentMethod: "COD",
      address: {
        receiverName: "Phan Trong Vinh",
        phone: "0901234567",
        detail: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      },
      items: [
        {
          id: 1,
          name: "Bánh Red Velvet",
          image: "/images/red-velvet.jpg",
          quantity: 1,
          price: 350000,
        },
        {
          id: 2,
          name: "Bánh Tiramisu Mini",
          image: "/images/tiramisu.jpg",
          quantity: 2,
          price: 150000,
        },
      ],
    },
    {
      id: "DH002",
      createdAt: "2026-06-17 14:15",
      status: "SHIPPING",
      totalAmount: 420000,
      paymentMethod: "MOMO",
      address: {
        receiverName: "Phan Trong Vinh",
        phone: "0901234567",
        detail: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      },
      items: [
        {
          id: 3,
          name: "Bánh Matcha Cheese",
          image: "/images/matcha-cheese.jpg",
          quantity: 1,
          price: 420000,
        },
      ],
    },
    {
      id: "DH003",
      createdAt: "2026-06-18 20:00",
      status: "PROCESSING",
      totalAmount: 580000,
      paymentMethod: "VNPAY",
      address: {
        receiverName: "Phan Trong Vinh",
        phone: "0901234567",
        detail: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      },
      items: [
        {
          id: 4,
          name: "Bánh Chocolate Mousse",
          image: "/images/chocolate-mousse.jpg",
          quantity: 1,
          price: 280000,
        },
        {
          id: 5,
          name: "Bánh Strawberry Shortcake",
          image: "/images/strawberry.jpg",
          quantity: 1,
          price: 300000,
        },
      ],
    },
  ];
  const ORDER_STATUS = {
    PROCESSING: "Đang xử lý",
    SHIPPING: "Đang giao",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {orders.map((order) => (
        <OrderItem order={order} key={order.id} />
      ))}
    </div>
  );
};

export default Order;
