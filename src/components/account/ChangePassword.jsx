import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useSubmit } from "@/hook/customHook";
import { changePassword } from "@/store/slices/userSlice";
import ToastNotification from "../admin/ToastNotification";

const schema = yup.object({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại."),
  newPassword: yup
    .string()
    .required("Vui lòng nhập mật khẩu mới.")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
    .test(
      "not-same-as-current",
      "Mật khẩu mới phải khác mật khẩu hiện tại.",
      function (value) {
        return value !== this.parent.currentPassword;
      },
    ),
  confirmNewPassword: yup
    .string()
    .required("Vui lòng xác nhận mật khẩu mới.")
    .oneOf([yup.ref("newPassword")], "Xác nhận mật khẩu không khớp."),
});

const fieldCls =
  "w-full rounded-xl border border-[#FFE7BA] bg-white px-3.5 py-2.5 pr-10 text-sm text-[#5B3A0A] outline-none transition-colors focus:border-[#FA8C00] focus:ring-2 focus:ring-[#FA8C00]/20";
const labelCls = "mb-1.5 block text-xs font-semibold text-gray-500";
const errorCls = "mt-1 text-xs font-medium text-rose-600";

const rows = [
  {
    key: "currentPassword",
    lbl: "Mật khẩu hiện tại",
    ph: "Nhập mật khẩu hiện tại",
  },
  { key: "newPassword", lbl: "Mật khẩu mới", ph: "Nhập mật khẩu mới" },
  {
    key: "confirmNewPassword",
    lbl: "Xác nhận mật khẩu mới",
    ph: "Nhập lại mật khẩu mới",
  },
];

const ChangePassword = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordCallback = useCallback(
    async (form) => {
      await dispatch(changePassword(form)).unwrap();
    },
    [dispatch],
  );

  const { submit, loading: saving } = useSubmit(changePasswordCallback, {
    onSuccess: () => {
      reset();
      setToast({ message: "Đổi mật khẩu thành công!", type: "success" });
    },
    onError: (err) => {
      const message = typeof err === "string" ? err : "Đổi mật khẩu thất bại.";
      setToast({ message, type: "error" });
    },
  });

  const toggleShow = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#5B3A0A]">Đổi mật khẩu</h1>
        <p className="text-sm text-gray-500">
          Đảm bảo tài khoản của bạn luôn an toàn.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(submit)}
        className="max-w-md rounded-2xl border border-[#FFE7BA] bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-[#FFF7E6] p-3 text-sm text-[#5B3A0A]">
          <ShieldCheck className="h-5 w-5 shrink-0 text-[#FA8C00]" />
          Mật khẩu mới nên có ít nhất 6 ký tự.
        </div>

        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.key}>
              <label className={labelCls}>{r.lbl}</label>
              <div className="relative">
                <input
                  type={show[r.key] ? "text" : "password"}
                  className={fieldCls}
                  placeholder={r.ph}
                  {...register(r.key)}
                />
                <button
                  type="button"
                  onClick={() => toggleShow(r.key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show[r.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors[r.key] && (
                <p className={errorCls}>{errors[r.key].message}</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FA8C00] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e07f00] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Lock className="h-4 w-4" />{" "}
          {saving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
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

export default ChangePassword;
