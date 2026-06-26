import { NavLink } from "react-router-dom";

const AccountSideBar = () => {
  const menus = [
    {
      name: "Thông tin cá nhân",
      path: "/account/profile",
    },

    {
      name: "Thông báo",
      path: "/account/notification",
    },
    {
      name: "Đơn hàng của tôi",
      path: "/account/orders",
    },
    {
      name: "Sản phẩm yêu thích",
      path: "/account/favorites",
    },
    {
      name: "Địa chỉ giao hàng",
      path: "/account/address",
    },
    {
      name: "Kho voucher",
      path: "/account/voucher",
    },
    {
      name: "Đổi mật khẩu",
      path: "/account/change-password",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/avatar.png"
            alt=""
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">Phan Trọng Vinh</p>
            <p className="text-sm text-gray-500">Thành viên thân thiết</p>
          </div>
        </div>
      </div>

      <div className="py-2">
        {menus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `block px-6 py-3 transition ${
                isActive
                  ? "bg-[#FFE7B3] text-[#6B4E41] font-semibold"
                  : "hover:bg-gray-50"
              }`
            }
          >
            {menu.name}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AccountSideBar;
