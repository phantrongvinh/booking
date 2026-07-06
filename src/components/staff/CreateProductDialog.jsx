import { useSubmit } from "@/hook/customHook";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2 } from "lucide-react";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createProduct,
  linkProductIngredient,
} from "@/store/slices/productSlice";

const brandOutline = "border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10";

const defaultValues = {
  categoryId: "",
  name: "",
  description: "",
  price: "",
  costPrice: "",
  stockQuantity: "",
  image: undefined,
  ingredients: [],
};

const CreateProductDialog = ({ trigger, onSuccess }) => {
  const productSchema = yup.object({
    categoryId: yup
      .number()
      .typeError("Vui lòng chọn danh mục")
      .integer()
      .required("Vui lòng chọn danh mục")
      .min(1, "Vui lòng chọn danh mục"),

    name: yup
      .string()
      .trim()
      .required("Vui lòng nhập tên sản phẩm")
      .max(150, "Tên sản phẩm tối đa 150 ký tự"),

    description: yup.string().trim().max(1000, "Mô tả tối đa 1000 ký tự"),

    price: yup
      .number()
      .transform((value, original) => (original === "" ? undefined : value))
      .typeError("Giá bán phải là số")
      .min(0, "Giá bán không được âm")
      .required("Vui lòng nhập giá bán"),

    costPrice: yup
      .number()
      .transform((value, original) => (original === "" ? undefined : value))
      .typeError("Giá vốn phải là số")
      .min(0, "Giá vốn không được âm"),

    stockQuantity: yup
      .number()
      .transform((value, original) => (original === "" ? undefined : value))
      .typeError("Số lượng tồn phải là số")
      .integer("Số lượng tồn phải là số nguyên")
      .min(0, "Số lượng tồn không được âm")
      .required("Vui lòng nhập số lượng tồn"),

    image: yup
      .mixed()
      .required("Vui lòng chọn ảnh sản phẩm")
      .test("fileType", "Chỉ chấp nhận file ảnh (jpg, png, webp)", (value) => {
        if (!value || value.length === 0) return false;
        const file = value[0];
        return (
          file && ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        );
      })
      .test("fileSize", "Ảnh tối đa 5MB", (value) => {
        if (!value || value.length === 0) return false;
        const file = value[0];
        return file && file.size <= 5 * 1024 * 1024;
      }),

    ingredients: yup
      .array()
      .of(
        yup.object({
          name: yup.string().trim().required("Nhập tên nguyên liệu"),
          quantity: yup
            .number()
            .transform((value, original) =>
              original === "" ? undefined : value,
            )
            .typeError("Số lượng phải là số")
            .moreThan(0, "Số lượng phải lớn hơn 0")
            .required("Nhập số lượng"),
        }),
      )
      .default([]),
  });

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(null);

  const categories = useSelector((state) => state.category.categories);
  const ingredients = useSelector((state) => state.ingredient.ingredients);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    submit,
    loading,
    error,
    reset: resetSubmit,
  } = useSubmit(
    async (formData) => {
      return await dispatch(createProduct(formData)).unwrap();
    },
    {
      onSuccess: () => {
        setOpen(false);
        resetForm(defaultValues);
        setPreview(null);
        onSuccess?.();
      },
    },
  );

  const handleOpenChange = (v) => {
    setOpen(v);
    if (!v) {
      resetForm(defaultValues);
      setPreview(null);
      resetSubmit?.();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setValue("image", e.target.files, { shouldValidate: true });
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const onSubmit = async (data) => {
    setSubmitting(true);
    setSubmitError("");

    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("name", data.name.trim());
    formData.append("description", data.description?.trim() || "");
    formData.append("price", data.price);
    if (data.costPrice !== undefined && data.costPrice !== "") {
      formData.append("costPrice", data.costPrice);
    }
    formData.append("stockQuantity", data.stockQuantity);
    formData.append("image", data.image[0]);

    const productName = data.name.trim();

    try {
      // BƯỚC 1: tạo product trước
      await dispatch(createProduct(formData)).unwrap();

      // BƯỚC 2: liên kết từng nguyên liệu bằng tên
      if (data.ingredients.length > 0) {
        const results = await Promise.allSettled(
          data.ingredients.map((ing) =>
            dispatch(
              linkProductIngredient({
                productName,
                ingredientName: ing.name.trim(),
                quantityRequired: Number(ing.quantity),
              }),
            ).unwrap(),
          ),
        );

        const failed = results.filter((r) => r.status === "rejected");
        if (failed.length > 0) {
          setSubmitError(
            `Đã tạo sản phẩm nhưng ${failed.length}/${data.ingredients.length} nguyên liệu liên kết thất bại. Vui lòng kiểm tra lại.`,
          );
          onSuccess?.();
          return;
        }
      }

      setOpen(false);
      resetForm(defaultValues);
      setPreview(null);
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.message || err || "Tạo sản phẩm thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin sản phẩm và thêm nguyên liệu nếu cần.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-category">Danh mục</Label>
            <Select
              onValueChange={(v) =>
                setValue("categoryId", Number(v), { shouldValidate: true })
              }
            >
              <SelectTrigger id="product-category">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                {categories?.map((c) => (
                  <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-red-500">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-name">Tên sản phẩm</Label>
            <Input
              id="product-name"
              placeholder="Ví dụ: Trà sữa trân châu"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-desc">Mô tả</Label>
            <Textarea
              id="product-desc"
              placeholder="Mô tả ngắn về sản phẩm"
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="product-price">Giá bán</Label>
              <Input
                id="product-price"
                type="number"
                min="0"
                placeholder="0"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="product-cost">Giá vốn</Label>
              <Input
                id="product-cost"
                type="number"
                min="0"
                placeholder="0"
                {...register("costPrice")}
              />
              {errors.costPrice && (
                <p className="text-sm text-red-500">
                  {errors.costPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-stock">Số lượng tồn</Label>
            <Input
              id="product-stock"
              type="number"
              min="0"
              placeholder="0"
              {...register("stockQuantity")}
            />
            {errors.stockQuantity && (
              <p className="text-sm text-red-500">
                {errors.stockQuantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-image">Ảnh sản phẩm</Label>
            <Input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Xem trước"
                className="mt-2 h-24 w-24 rounded-md object-cover border"
              />
            )}
            {errors.image && (
              <p className="text-sm text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nguyên liệu</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ name: "", quantity: "", unit: "" })}
                className={brandOutline}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm nguyên liệu
              </Button>
            </div>

            {fields.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#FF7A00]/40 p-4 text-center text-sm text-muted-foreground">
                Chưa có nguyên liệu nào. Bấm "Thêm nguyên liệu" để bắt đầu.
              </p>
            ) : (
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-1">
                    <div className="grid grid-cols-12 gap-2 rounded-md border p-2">
                      <Controller
                        name={`ingredients.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="col-span-5">
                              <SelectValue placeholder="Chọn nguyên liệu" />
                            </SelectTrigger>
                            <SelectContent>
                              {ingredients?.map((ing) => (
                                <SelectItem
                                  key={ing.ingredientId}
                                  value={ing.name}
                                >
                                  {ing.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        className="col-span-3"
                        type="number"
                        min="0"
                        placeholder="SL"
                        {...register(`ingredients.${index}.quantity`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="col-span-1 text-[#FF7A00] hover:bg-[#FF7A00] hover:text-white"
                        onClick={() => remove(index)}
                        aria-label="Xoá nguyên liệu"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {(errors.ingredients?.[index]?.name ||
                      errors.ingredients?.[index]?.quantity ||
                      errors.ingredients?.[index]?.unit) && (
                      <p className="text-xs text-red-500 px-1">
                        {errors.ingredients[index]?.name?.message ||
                          errors.ingredients[index]?.quantity?.message ||
                          errors.ingredients[index]?.unit?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error?.message || error}</p>
          )}
          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Huỷ
            </Button>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90"
            >
              {submitting ? "Đang tạo..." : "Tạo sản phẩm"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDialog;
