import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X, Ticket } from "lucide-react";
import { useFetch, useSubmit } from "@/hook/customHook";
import { editVoucher, postVoucher } from "@/store/slices/voucherSlice";
import { fetchAllProduct } from "@/store/slices/productSlice";
import { discountTypeOptions, applyScopeOptions } from "@/lib/voucherConstants";
import ToastNotification from "../ToastNotification";
const inputCls =
  "w-full rounded-lg border border-[#FFE7BA] px-3 py-2 text-sm text-[#5B3A0A] focus:border-[#FA8C00] focus:outline-none";
const labelCls = "mb-1 block text-xs font-semibold text-[#5B3A0A]";
const errorCls = "mt-1 text-xs font-medium text-rose-600";

const schema = yup.object({
  code: yup.string().trim().required("Vui lòng nhập mã voucher."),
  description: yup.string().nullable(),
  discountType: yup.number().required().oneOf([0, 1]),
  discountValue: yup
    .number()
    .typeError("Vui lòng nhập số.")
    .required("Vui lòng nhập giá trị giảm.")
    .positive("Giá trị phải lớn hơn 0.")
    .when("discountType", {
      is: 0,
      then: (s) => s.max(100, "Giảm theo % không vượt quá 100."),
    }),
  minOrderValue: yup
    .number()
    .typeError("Vui lòng nhập số.")
    .min(0, "Không được âm.")
    .required("Vui lòng nhập đơn tối thiểu."),
  maxDiscountAmount: yup
    .number()
    .typeError("Vui lòng nhập số.")
    .nullable()
    .transform((v, orig) => (orig === "" ? null : v)),
  startDate: yup.string().required("Vui lòng chọn ngày bắt đầu."),
  endDate: yup
    .string()
    .required("Vui lòng chọn ngày kết thúc.")
    .test(
      "after-start",
      "Ngày kết thúc phải sau ngày bắt đầu.",
      function (value) {
        if (!value || !this.parent.startDate) return true;
        return new Date(value) >= new Date(this.parent.startDate);
      },
    ),
  status: yup.string().oneOf(["active", "inactive"]).required(),
  canCombineWithPromotion: yup.boolean(),
  applyScope: yup.number().required().oneOf([0, 1]),
  productIds: yup
    .array()
    .of(yup.number())
    .when("applyScope", {
      is: 1,
      then: (s) => s.min(1, "Vui lòng chọn ít nhất 1 sản phẩm."),
    }),
});

const defaultValues = {
  code: "",
  description: "",
  discountType: 0,
  discountValue: 10,
  minOrderValue: 0,
  maxDiscountAmount: null,
  startDate: "",
  endDate: "",
  status: "active",
  canCombineWithPromotion: true,
  applyScope: 0,
  productIds: [],
};

const VoucherModal = ({ open, voucher, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    if (voucher) {
      reset({
        code: voucher.code,
        description: voucher.description ?? "",
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        minOrderValue: voucher.minOrderValue,
        maxDiscountAmount: voucher.maxDiscountAmount ?? null,
        startDate: voucher.startDate?.slice(0, 10) ?? "",
        endDate: voucher.endDate?.slice(0, 10) ?? "",
        status: voucher.status,
        canCombineWithPromotion: voucher.canCombineWithPromotion,
        applyScope: voucher.applyScope,
        productIds: voucher.productIds ?? [],
      });
    } else {
      reset(defaultValues);
    }
  }, [open, voucher, reset]);

  const fetchProductsCallback = useCallback(async () => {
    const products = await dispatch(fetchAllProduct()).unwrap();
    return { products };
  }, [dispatch]);

  const {
    data: { products },
  } = useFetch(fetchProductsCallback, { initialData: { products: [] } });

  const createCallback = useCallback(
    async (data) => {
      await dispatch(postVoucher(data)).unwrap();
    },
    [dispatch],
  );

  const updateCallback = useCallback(
    async (data) => {
      await dispatch(
        editVoucher({ id: voucher.voucherId, form: data }),
      ).unwrap();
    },
    [voucher],
  );

  const { submit, loading: saving } = useSubmit(
    voucher ? updateCallback : createCallback,
    {
      onSuccess: () =>
        onSaved?.(voucher ? "Đã cập nhật voucher." : "Đã tạo voucher mới."),
      onError: (err) => {
        const message = typeof err === "string" ? err : "Lưu voucher thất bại.";
        setToast({ message, type: "error" });
      },
    },
  );

  const onSubmit = (data) => {
    if (voucher && !isDirty) {
      onClose();
      return;
    }
    const basePayload = {
      description: data.description,
      discountType: Number(data.discountType),
      discountValue: Number(data.discountValue),
      minOrderValue: Number(data.minOrderValue),
      maxDiscountAmount: data.maxDiscountAmount
        ? Number(data.maxDiscountAmount)
        : null,
      startDate: data.startDate,
      endDate: data.endDate,
      canCombineWithPromotion: data.canCombineWithPromotion,
      applyScope: Number(data.applyScope),
      productIds: Number(data.applyScope) === 1 ? data.productIds : [],
    };

    if (voucher) {
      submit({ ...basePayload, status: data.status });
    } else {
      submit({ ...basePayload, code: data.code.trim().toUpperCase() });
    }
  };

  const discountType = Number(watch("discountType"));
  const applyScope = Number(watch("applyScope"));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#5B3A0A]">
            <Ticket className="h-5 w-5 text-[#FA8C00]" />
            {voucher ? "Sửa voucher" : "Thêm voucher"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Mã voucher *</label>
                <input
                  className={
                    inputCls +
                    (voucher
                      ? " cursor-not-allowed bg-gray-50 text-gray-400"
                      : "")
                  }
                  placeholder="VD: SALE20"
                  disabled={!!voucher}
                  {...register("code")}
                />
                {errors.code && (
                  <p className={errorCls}>{errors.code.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Loại giảm giá</label>
                <select className={inputCls} {...register("discountType")}>
                  {discountTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Mô tả</label>
              <textarea
                className={inputCls}
                rows={2}
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  {discountType === 0 ? "Giá trị (%)" : "Giá trị (đ)"}
                </label>
                <input
                  type="number"
                  className={inputCls}
                  {...register("discountValue")}
                />
                {errors.discountValue && (
                  <p className={errorCls}>{errors.discountValue.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Đơn tối thiểu (đ)</label>
                <input
                  type="number"
                  className={inputCls}
                  {...register("minOrderValue")}
                />
                {errors.minOrderValue && (
                  <p className={errorCls}>{errors.minOrderValue.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {discountType === 0 && (
                <div>
                  <label className={labelCls}>Giảm tối đa (đ)</label>
                  <input
                    type="number"
                    className={inputCls}
                    {...register("maxDiscountAmount")}
                  />
                </div>
              )}
              <div>
                <label className={labelCls}>Ngày bắt đầu *</label>
                <input
                  type="date"
                  className={inputCls}
                  {...register("startDate")}
                />
                {errors.startDate && (
                  <p className={errorCls}>{errors.startDate.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>Ngày kết thúc *</label>
                <input
                  type="date"
                  className={inputCls}
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className={errorCls}>{errors.endDate.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className={labelCls}>Phạm vi áp dụng</label>
              <select className={inputCls} {...register("applyScope")}>
                {applyScopeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {applyScope === 1 && (
              <div>
                <label className={labelCls}>Chọn sản phẩm áp dụng *</label>
                <Controller
                  name="productIds"
                  control={control}
                  render={({ field }) => (
                    <div className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-[#FFE7BA] p-2">
                      {products.map((p) => {
                        const checked = field.value.includes(p.productId);
                        return (
                          <label
                            key={p.productId}
                            className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-[#FFF7E6]"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, p.productId]);
                                } else {
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== p.productId,
                                    ),
                                  );
                                }
                              }}
                              className="h-4 w-4 accent-[#FA8C00]"
                            />
                            {p.name}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
                {errors.productIds && (
                  <p className={errorCls}>{errors.productIds.message}</p>
                )}
              </div>
            )}

            <label className="flex items-center gap-2 text-sm font-semibold text-[#5B3A0A]">
              <input
                type="checkbox"
                {...register("canCombineWithPromotion")}
                className="h-4 w-4 accent-[#FA8C00]"
              />
              Cho phép kết hợp với khuyến mãi khác
            </label>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#FFE7BA] px-3 py-2.5">
              <span className="text-sm font-semibold text-[#5B3A0A]">
                Trạng thái hoạt động
              </span>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value === "active" ? "inactive" : "active",
                      )
                    }
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      field.value === "active" ? "bg-[#FA8C00]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        field.value === "active"
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-[#FFE7BA] px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#FFE7BA] px-4 py-2.5 text-sm font-semibold text-gray-500 hover:bg-[#FFF7E6]"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#FA8C00] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e07f00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
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

export default VoucherModal;
