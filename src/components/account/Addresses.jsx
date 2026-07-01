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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#6B4E41]">
          Địa chỉ giao hàng
        </h1>

        <ButtonCustom
          name="+ Thêm địa chỉ"
          size="lg"
          color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
        />
      </div>

      {/* Address list */}
      {addresses.map((address) => (
        <div
          key={address.id}
          className="bg-white rounded-xl md:rounded-2xl shadow-sm border p-4 md:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:justify-between gap-5">
            {/* Thông tin */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-lg text-[#6B4E41]">
                  {address.receiverName}
                </h3>

                {address.isDefault && (
                  <span className="border border-red-500 text-red-500 px-2 py-1 rounded-md text-xs">
                    Mặc định
                  </span>
                )}
              </div>

              <p className="text-gray-500 mt-1">{address.phone}</p>

              <p className="mt-2 text-gray-600 break-words">
                {address.address}
              </p>
            </div>

            {/* Button */}
            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
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
