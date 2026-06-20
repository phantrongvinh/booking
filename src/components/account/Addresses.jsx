import ButtonCustom from "../ButtonCustom";

const Addresses = () => {
  const addresses = [
    {
      id: 1,
      receiverName: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: 2,
      receiverName: "Nguyễn Văn B",
      phone: "0907654321",
      address: "456 Lê Lợi, Quận 3, TP.HCM",
      isDefault: false,
    },
  ];
  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#6B4E41]">Địa chỉ giao hàng</h1>

        <ButtonCustom
          name="+ Thêm địa chỉ"
          size="lg"
          color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
        />
      </div>

      {addresses.map((address) => (
        <div
          key={address.id}
          className="bg-white rounded-2xl shadow-sm border p-6"
        >
          <div className="flex justify-between">
            <div>
              <div className="flex gap-3 items-center">
                <h3 className="font-semibold text-lg">
                  {address.receiverName}
                </h3>

                {address.isDefault && (
                  <span className="border border-red-500 text-red-500 px-2 py-1 rounded-md text-xs">
                    Mặc định
                  </span>
                )}
              </div>

              <p className="text-gray-500">{address.phone}</p>

              <p className="mt-2 text-gray-600">{address.address}</p>
            </div>

            <div className="space-x-3">
              <ButtonCustom
                name="Xóa"
                size="lg"
                color="border-[#FF0000] text-[#FF0000] hover:bg-[#FF0000]"
              />
              <ButtonCustom
                name="Chỉnh sửa"
                size="lg"
                color="border-[#6B4E41] text-[#6B4E41] hover:bg-[#6B4E41]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Addresses;
