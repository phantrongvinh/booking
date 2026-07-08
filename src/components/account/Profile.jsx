import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Save } from "lucide-react";
import { useFetch, useSubmit } from "@/hook/customHook";
import { fetchMe, updateProfile } from "@/store/slices/userSlice";
import ToastNotification from "../admin/ToastNotification";

const getInitials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Chuyển ISO datetime -> "YYYY-MM-DD" cho input type="date"
const toDateInputValue = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

const schema = yup.object({
  fullName: yup.string().trim().required("Vui lòng nhập họ tên."),
  phone: yup
    .string()
    .trim()
    .matches(/^0\d{9,10}$/, {
      message: "Số điện thoại không hợp lệ.",
      excludeEmptyString: true,
    })
    .nullable(),
  birthday: yup.string().nullable(),
  gender: yup.string().nullable(),
  address: yup.string().nullable(),
});

const field =
  "w-full rounded-xl border border-[#FFE7BA] bg-white px-3.5 py-2.5 text-sm text-[#5B3A0A] outline-none transition-colors placeholder:text-gray-400 focus:border-[#FA8C00] focus:ring-2 focus:ring-[#FA8C00]/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-gray-500";
const errorCls = "mt-1 text-xs font-medium text-rose-600";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const fetchMeCallback = useCallback(async () => {
    const res = await dispatch(fetchMe()).unwrap();
    return { profile: res };
  }, [dispatch]);

  const {
    data: { profile },
    fetch: reloadProfile,
  } = useFetch(fetchMeCallback, {
    initialData: { profile: { fullName: "", avatarUrl: null } },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      birthday: "",
      gender: "",
      address: "",
    },
  });

  // Khi profile fetch xong (hoặc đổi), đồng bộ vào form
  useEffect(() => {
    if (profile?.profileId) {
      reset({
        fullName: profile.fullName ?? "",
        phone: profile.phone ?? "",
        birthday: toDateInputValue(profile.birthday),
        gender: profile.gender ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile?.profileId]);

  const { submit, loading: saving } = useSubmit(
    async (data) => {
      // Không gửi avatarUrl - đổi ảnh dùng API riêng
      await dispatch(
        updateProfile({
          fullName: data.fullName,
          phone: data.phone,
          birthday: data.birthday
            ? new Date(data.birthday).toISOString()
            : null,
          gender: data.gender,
          address: data.address,
        }),
      ).unwrap();
    },
    {
      onSuccess: () => {
        reloadProfile();
        setToast({
          message: "Cập nhật thông tin cá nhân thành công!",
          type: "success",
        });
      },
      onError: (err) => {
        const message =
          typeof err === "string" ? err : "Cập nhật thất bại, thử lại sau.";
        setToast({ message, type: "error" });
      },
    },
  );

  const fullNameValue = watch("fullName");

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">Thông tin cá nhân</h1>
        <p className="text-sm text-gray-500">
          Cập nhật thông tin hồ sơ của bạn.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="rounded-2xl border border-[#FFE7BA] bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-4">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FA8C00] text-xl font-bold text-white">
              {getInitials(fullNameValue)}
            </span>
          )}
          <div>
            <p className="font-bold text-[#5B3A0A]">
              {fullNameValue || "Khách hàng"}
            </p>
            <p className="text-sm text-gray-400">{profile.email}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Họ và tên</label>
            <input
              className={field}
              placeholder="Nguyễn Văn A"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className={errorCls}>{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className={labelCls}>Số điện thoại</label>
            <input
              className={field}
              placeholder="09xxxxxxxx"
              {...register("phone")}
            />
            {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
          </div>

          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email"
              className={field + " cursor-not-allowed bg-gray-50 text-gray-400"}
              value={profile.email ?? ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <label className={labelCls}>Ngày sinh</label>
            <input type="date" className={field} {...register("birthday")} />
          </div>

          <div>
            <label className={labelCls}>Giới tính</label>
            <select className={field} {...register("gender")}>
              <option value="">Chưa chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Địa chỉ</label>
            <input
              className={field}
              placeholder="Số nhà, đường, quận, thành phố"
              {...register("address")}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={!isDirty}
            onClick={() =>
              reset({
                fullName: profile.fullName ?? "",
                phone: profile.phone ?? "",
                birthday: toDateInputValue(profile.birthday),
                gender: profile.gender ?? "",
                address: profile.address ?? "",
              })
            }
            className="rounded-xl border border-[#FFE7BA] px-4 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:bg-[#FFF7E6] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Hoàn tác
          </button>
          <button
            type="submit"
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#FA8C00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e07f00] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Save className="h-4 w-4" />{" "}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>

      {toast && (
        <ToastNotification
          key={toast.message + Date.now()}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
