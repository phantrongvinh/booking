import { useDispatch, useSelector } from "react-redux";
import ButtonCustom from "../ButtonCustom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSubmit } from "@/hook/customHook";
import { clearMessage, updateProfile } from "@/store/slices/userSlice";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller } from "react-hook-form";

const Profile = () => {
  // handle fetch user
  const dispatch = useDispatch();
  const {
    user,
    message,
    error: storeError,
  } = useSelector((state) => state.user);

  // handle validate user
  const today = new Date();

  const minBirthday = new Date();
  minBirthday.setFullYear(today.getFullYear() - 13);

  const schema = yup.object({
    fullName: yup
      .string()
      .required("Vui lòng nhập họ tên")
      .min(2, "Họ tên tối thiểu 2 ký tự"),
    email: yup
      .string()
      .required("Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phone: yup
      .string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, "Số điện thoại không hợp lệ"),
    birthday: yup
      .date()
      .typeError("Vui lòng chọn ngày sinh")
      .required("Ngày sinh không được để trống")
      .max(today, "Ngày sinh không được lớn hơn ngày hiện tại")
      .max(minBirthday, "Người dùng phải từ 13 tuổi trở lên"),

    gender: yup.string().required("Vui lòng chọn giới tính"),

    address: yup.string().trim().required("Địa chỉ không được để trống"),

    avatarUrl: yup.string().required("Vui lòng chọn ảnh đại diện"),
  });

  // handle upload avatar
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const handleUploadAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    setAvatarPreview(URL.createObjectURL(file));

    // Nếu backend nhận Base64
    const reader = new FileReader();
    reader.onload = () => {
      setValue("avatarUrl", reader.result, {
        shouldValidate: true,
      });
    };
    reader.readAsDataURL(file);
  };

  const {
    register,
    handleSubmit,
    setValue,
    control,
    fetch: reloadUser,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      birthday: user?.birthday ? dayjs(user?.birthday).toISOString() : null,
      gender: user?.gender ?? "",
      address: user?.address ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  const { submit, loading } = useSubmit(
    (data) => {
      if (!isDirty) {
        console.log("không thay đổi");
        return;
      }
      const payload = {
        fullName: data.fullName,
        birthday: data.birthday ? dayjs(data.birthday).toISOString() : null,
        gender: data.gender,
        address: data.address,
        avatarUrl: data.avatarUrl || null,
        phone: data.phone,
      };

      return dispatch(updateProfile(payload)).unwrap();
    },
    {
      onSuccess: () => {
        reLoadUser();
      },
    },
  );

  // handle clear message
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      dispatch(clearMessage());
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, dispatch]);

  return (
    <>
      <h2 className="text-2xl font-bold text-[#6B4E41] mb-6">
        Thông tin cá nhân
      </h2>

      {message && (
        <p className="text-green-600 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          {message}
        </p>
      )}

      {storeError && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          {storeError}
        </p>
      )}

      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadAvatar}
          />

          <img
            src={
              avatarPreview ||
              user?.avatarUrl ||
              "https://placehold.co/150x150?text=Avatar"
            }
            alt="Avatar"
            onClick={() => fileInputRef.current?.click()}
            className="
          w-28 h-28
          sm:w-32 sm:h-32
          md:w-36 md:h-36
          rounded-full
          object-cover
          border-2 border-gray-300
          cursor-pointer
          hover:opacity-80
          transition
        "
          />

          <p className="text-sm text-gray-500 mt-3">Nhấn vào ảnh để thay đổi</p>

          <input type="hidden" {...register("avatarUrl")} />

          {errors.avatarUrl && (
            <p className="text-red-500 text-sm mt-2">
              {errors.avatarUrl.message}
            </p>
          )}
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="font-medium">Họ tên</label>
            <input
              {...register("fullName")}
              className="w-full border rounded-lg p-3 mt-1"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">Email</label>
            <input
              {...register("email")}
              disabled
              className="w-full border rounded-lg p-3 mt-1 bg-gray-100 cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">Số điện thoại</label>
            <input
              {...register("phone")}
              className="w-full border rounded-lg p-3 mt-1"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Ngày sinh</label>

            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date)}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  placeholderText="Chọn ngày sinh"
                  className="w-full border rounded-lg p-3 mt-1"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                />
              )}
            />

            {errors.birthday && (
              <p className="text-red-500 text-sm mt-1">
                {errors.birthday.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">Giới tính</label>

            <select
              {...register("gender")}
              className="w-full border rounded-lg p-3 mt-1"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>

            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">Địa chỉ</label>

            <input
              {...register("address")}
              className="w-full border rounded-lg p-3 mt-1"
            />

            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <ButtonCustom
            name={loading ? "Đang lưu..." : "Thay đổi"}
            size="lg"
            color="border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]"
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </>
  );
};

export default Profile;
