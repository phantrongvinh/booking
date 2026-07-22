import { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { X, BadgePercent, Upload } from "lucide-react";
import {
  createPromotion,
  updatePromotion,
  getPromotionById,
  addPromotionOnProduct,
  deletePromotionOnProduct,
} from "@/store/slices/promotionSlice";
import { fetchAllProduct } from "@/store/slices/productSlice";
import { useFetch, useSubmit } from "@/hook/customHook";
import ToastNotification from "../ToastNotification";
import ulti from "@/ultis/ulti";

const inputCls =
  "w-full rounded-lg border border-[#FFE7BA] px-3 py-2 text-sm text-[#5B3A0A] focus:border-[#FA8C00] focus:outline-none";
const labelCls = "mb-1 block text-xs font-semibold text-[#5B3A0A]";
const errorCls = "mt-1 text-xs font-medium text-rose-600";

const schema = yup.object({
  title: yup.string().trim().required("Vui lòng nhập tiêu đề."),
  content: yup.string().nullable(),
  discountType: yup.string().required().oneOf(["percent", "amount"]),
  discountValue: yup
    .number()
    .typeError("Vui lòng nhập số.")
    .required("Vui lòng nhập giá trị giảm.")
    .positive("Giá trị phải lớn hơn 0.")
    .when("discountType", {
      is: "percent",
      then: (s) => s.max(100, "Giảm theo % không vượt quá 100."),
    }),
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
  productIds: yup.array().of(yup.number()),
});

const defaultValues = {
  title: "",
  content: "",
  discountType: "percent",
  discountValue: 10,
  startDate: "",
  endDate: "",
  status: "active",
  productIds: [],
};

const PromotionModal = ({ open, promotion, onClose, onSaved }) => {
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(schema), defaultValues });

  // Fetch chi tiết khi edit
  const fetchPromotionDetail = useCallback(async () => {
    const promotionDetail = await dispatch(
      getPromotionById(promotion.promotionId),
    ).unwrap();

    return { promotionDetail };
  }, [dispatch, promotion]);

  const {
    data: { promotionDetail },
    loading: promotionDetailLoading,
  } = useFetch(fetchPromotionDetail, { initialData: { promotionDetail: [] } });

  useEffect(() => {
    if (!open) return;

    if (!promotion) {
      reset(defaultValues);
      setBannerFile(null);
      setBannerPreview(null);
      return;
    }

    if (promotionDetail) {
      reset({
        title: promotionDetail.title ?? "",
        content: promotionDetail.content ?? "",
        discountType: promotionDetail.discountType ?? "percent",
        discountValue: promotionDetail.discountValue ?? 10,
        startDate: ulti.formatDateDetail(promotionDetail.startDate) ?? "",
        endDate: ulti.formatDateDetail(promotionDetail.endDate) ?? "",
        status: promotionDetail.status ?? "active",
        productIds: promotionDetail.products?.map((p) => p.productId) ?? [],
      });

      setBannerPreview(promotionDetail.bannerUrl ?? null);
      setBannerFile(null);
    }
  }, [open, promotionDetail, promotion, reset]);

  // Fetch products
  const fetchProductsCallback = useCallback(async () => {
    const products = await dispatch(fetchAllProduct()).unwrap();
    return { products };
  }, [dispatch]);

  const {
    data: { products },
  } = useFetch(fetchProductsCallback, { initialData: { products: [] } });

  // Submit
  const createCallback = useCallback(
    async (form) => {
      await dispatch(createPromotion(form)).unwrap();
    },
    [dispatch],
  );

  const updateCallback = useCallback(
    async (form) => {
      await dispatch(
        updatePromotion({
          id: promotion.promotionId,
          form,
        }),
      ).unwrap();

      const oldProductIds =
        promotionDetail?.products?.map((p) => p.productId) ?? [];

      const newProductIds = form.getAll("productIds").map((id) => Number(id));

      const added = newProductIds.filter((id) => !oldProductIds.includes(id));

      const removed = oldProductIds.filter((id) => !newProductIds.includes(id));

      if (added.length > 0) {
        await dispatch(
          addPromotionOnProduct({
            promotionId: promotion.promotionId,
            productIds: added,
          }),
        ).unwrap();
      }

      if (removed.length > 0) {
        await dispatch(
          deletePromotionOnProduct({
            promotionId: promotion.promotionId,
            productIds: removed,
          }),
        ).unwrap();
      }
    },
    [dispatch, promotion, promotionDetail],
  );

  const { submit, loading: saving } = useSubmit(
    promotion ? updateCallback : createCallback,
    {
      onSuccess: () =>
        onSaved?.(
          promotion ? "Đã cập nhật khuyến mãi." : "Đã tạo khuyến mãi mới.",
        ),
      onError: (err) =>
        setToast({
          message: typeof err === "string" ? err : "Lưu thất bại.",
          type: "error",
        }),
    },
  );

  const onSubmit = (data) => {
    if (promotion && !isDirty && !bannerFile) {
      onClose();
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title.trim());
    formData.append("content", data.content ?? "");
    formData.append("discountType", data.discountType);
    formData.append("discountValue", Number(data.discountValue));
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("status", data.status);
    data.productIds.forEach((id) => formData.append("productIds", id));
    if (bannerFile) formData.append("bannerImage", bannerFile);
    submit(formData);
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const discountType = watch("discountType");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFE7BA] px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-[#5B3A0A]">
            <BadgePercent className="h-5 w-5 text-[#FA8C00]" />
            {promotion ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}
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
          {promotionDetailLoading ? (
            <div className="flex flex-1 items-center justify-center p-10">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFE7BA] border-t-[#FA8C00]" />
                <p className="text-sm font-medium text-[#8C5A11] animate-pulse">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {/* Banner */}
              <div>
                <label className={labelCls}>Ảnh banner</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#FFE7BA] bg-[#FFF7E6] py-4 hover:border-[#FA8C00]">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="banner"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <Upload className="mb-1 h-6 w-6 text-[#FA8C00]" />
                      <span className="text-xs text-gray-400">
                        Nhấn để chọn ảnh
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                </label>
              </div>

              {/* Tiêu đề */}
              <div>
                <label className={labelCls}>Tiêu đề *</label>
                <input
                  className={inputCls}
                  placeholder="VD: Khuyến mãi mùa hè"
                  {...register("title")}
                />
                {errors.title && (
                  <p className={errorCls}>{errors.title.message}</p>
                )}
              </div>

              {/* Nội dung */}
              <div>
                <label className={labelCls}>Nội dung</label>
                <textarea
                  className={inputCls}
                  rows={2}
                  placeholder="Mô tả chi tiết..."
                  {...register("content")}
                />
              </div>

              {/* Loại + Giá trị */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Loại giảm giá</label>
                  <select className={inputCls} {...register("discountType")}>
                    <option value="percent">Phần trăm (%)</option>
                    <option value="amount">Số tiền (đ)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>
                    {discountType === "percent" ? "Giá trị (%)" : "Giá trị (đ)"}
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
              </div>

              {/* Ngày */}
              <div className="grid grid-cols-2 gap-3">
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

              {/* Sản phẩm */}
              <div>
                <label className={labelCls}>Sản phẩm áp dụng</label>
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
                                if (e.target.checked)
                                  field.onChange([...field.value, p.productId]);
                                else
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== p.productId,
                                    ),
                                  );
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

              {/* Toggle status */}
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
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${field.value === "active" ? "bg-[#FA8C00]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${field.value === "active" ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  )}
                />
              </div>
            </div>
          )}

          {/* Footer */}
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

export default PromotionModal;
