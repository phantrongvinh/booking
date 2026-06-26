import { useSelector } from "react-redux";
import ButtonCustom from "../ButtonCustom";

const Profile = () => {
  const handleUpdateProfile = (event) => {
    event.preventDefault();
    console.log("Profile");
  };

  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#6B4E41] mb-6">
        Thông tin cá nhân
      </h2>

      <form className="space-y-4">
        <div>
          <label>Họ tên</label>

          <input
            className="w-full border rounded-lg p-3 mt-1"
            defaultValue={user.username}
          />
        </div>

        <div>
          <label>Email</label>

          <input
            className="w-full border rounded-lg p-3 mt-1"
            defaultValue={user.email}
          />
        </div>

        <div>
          <label>Số điện thoại</label>

          <input
            className="w-full border rounded-lg p-3 mt-1"
            defaultValue="0123456789"
          />
        </div>

        <ButtonCustom
          name="Thay đổi"
          size="lg"
          color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
          onClick={() => handleUpdateProfile(event)}
        ></ButtonCustom>
      </form>
    </>
  );
};

export default Profile;
