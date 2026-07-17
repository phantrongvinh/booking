import { Package, TrendingUp, TriangleAlert, CircleOff } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

import ProductStatCard from "@/components/admin/product/ProductStatCard";
import ProductToolbar from "@/components/admin/product/ProductToolbar";
import ProductTable from "@/components/admin/product/ProductTable";
import ProductPagination from "@/components/admin/product/ProductPagination";
import ProductPopup from "@/components/admin/product/ProductPopup";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { useFetch } from "@/hook/customHook";
import productAPI from "@/api/productAPI";
import categoryAPI from "@/api/categoryAPI";
import productIngredientAPI from "@/api/productIngredientAPI";

const ITEMS_PER_PAGE = 10;

const AdProduct = () => {
  const fetchProducts = useCallback(async () => {
    const [productRs, categoryRs] = await Promise.all([
      productAPI.fetchProduct(),
      categoryAPI.fetchCategory(),
    ]);

    return {
      products: productRs,
      categories: categoryRs,
    };
  }, []);

  const {
    data: { products, categories },
    loading,
    fetch: reloadProducts,
  } = useFetch(fetchProducts, {
    initialData: {
      products: [],
      categories: [],
    },
  });

  const [openPopup, setOpenPopup] = useState(false);
  const [popupMode, setPopupMode] = useState("create");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // =========================
  // CREATE / EDIT PRODUCT
  // =========================
  const handleSubmitProduct = async (data) => {
    try {
      // =========================
      // ADD INGREDIENT
      // =========================
      if (popupMode === "addIngredient") {
        const payload = {
          productId: selectedProduct.productId,
          ingredientId: Number(data.ingredientId), 
          quantityRequired: Number(data.quantityRequired),
        };

        console.log("ADD INGREDIENT:", payload);

        await productIngredientAPI.createProductIngredient(payload);

        alert("Thêm nguyên liệu thành công");

        setOpenPopup(false);
        setSelectedProduct(null);

        return;
      }

      // =========================
      // CREATE PRODUCT
      // =========================
      if (popupMode === "create") {
        await productAPI.createProduct(data);

        alert("Thêm sản phẩm thành công");
      }

      // =========================
      // EDIT PRODUCT
      // =========================
      if (popupMode === "edit") {
        const id = selectedProduct.productId;

        const requests = [];

        if (
          data.name !== selectedProduct.name ||
          Number(data.categoryId) !== selectedProduct.categoryId
        ) {
          requests.push(
            productAPI.updateNameCategory(
              id,
              data.name,
              Number(data.categoryId),
            ),
          );
        }

        if (Number(data.price) !== selectedProduct.price) {
          requests.push(productAPI.updatePrice(id, Number(data.price)));
        }

        if (data.description !== selectedProduct.description) {
          requests.push(productAPI.updateDescription(id, data.description));
        }

        if (Number(data.stockQuantity) !== selectedProduct.stockQuantity) {
          requests.push(productAPI.updateStock(id, Number(data.stockQuantity)));
        }

        if (data.storageInstructions !== selectedProduct.storageInstructions) {
          requests.push(
            productAPI.updateStorageInstructions(id, data.storageInstructions),
          );
        }

        if (data.sizeName !== selectedProduct.sizeName) {
          requests.push(productAPI.updateSizeName(id, data.sizeName));
        }

        if (data.image) {
          requests.push(productAPI.updateImage(id, data.image));
        }

        // UPDATE INGREDIENTS
        if (data.ingredients) {
          const ingredientPayload = data.ingredients.map((item) => ({
            productId: id,
            ingredientId: Number(item.ingredientId),
            quantityRequired: Number(item.quantityRequired),
          }));

          console.log("UPDATE INGREDIENT:", ingredientPayload);

          requests.push(
            productIngredientAPI.updateProductIngredient(ingredientPayload),
          );
        }

        await Promise.all(requests);

        alert("Cập nhật sản phẩm thành công");
      }

      setOpenPopup(false);
      setSelectedProduct(null);

      await reloadProducts();
    } catch (error) {
      console.log(error);

      alert(
        popupMode === "create"
          ? "Thêm sản phẩm thất bại"
          : popupMode === "addIngredient"
            ? "Thêm nguyên liệu thất bại"
            : "Cập nhật sản phẩm thất bại",
      );
    }
  };

  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setPopupMode("create");
    setOpenPopup(true);
  };

  const handleOpenView = (product) => {
    setSelectedProduct(product);
    setPopupMode("view");
    setOpenPopup(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setPopupMode("edit");
    setOpenPopup(true);
  };

  const handleOpenAddIngredient = (product) => {
    setSelectedProduct(product);
    setPopupMode("addIngredient");
    setOpenPopup(true);
  };

  // =========================
  // DELETE
  // =========================
  const handleDeleteProduct = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");

    if (!confirm) return;

    try {
      await productAPI.deleteProduct(id);

      alert("Xóa sản phẩm thành công");

      await reloadProducts();
    } catch (error) {
      console.log(error);

      alert("Xóa sản phẩm thất bại");
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const totalProducts = products.length;

  const activeProducts = products.filter((p) => p.status === "Active").length;

  const inactiveProducts = products.filter((p) => p.status !== "Active").length;

  const lowStockProducts = products.filter((p) => p.stockQuantity <= 10).length;

  // =========================
  // FILTER
  // =========================

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredProducts = [...products]
    .filter((p) => {
      const categoryMatch =
        selectedCategory === "" || p.categoryId === Number(selectedCategory);

      const statusMatch = selectedStatus === "" || p.status === selectedStatus;

      return categoryMatch && statusMatch;
    })
    .sort((a, b) => b.productId - a.productId);

  // =========================
  // PAGINATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-2 py-4 sm:px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Danh sách sản phẩm</h1>

          <p className="text-gray-500">
            Quản lý toàn bộ sản phẩm trong cửa hàng
          </p>
        </div>

        <Button onClick={handleOpenCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <ProductStatCard
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={<Package />}
          color="bg-blue-100 text-blue-600"
        />

        <ProductStatCard
          title="Đang kinh doanh"
          value={activeProducts}
          icon={<TrendingUp />}
          color="bg-green-100 text-green-600"
        />

        <ProductStatCard
          title="Sắp hết hàng"
          value={lowStockProducts}
          icon={<TriangleAlert />}
          color="bg-yellow-100 text-yellow-600"
        />

        <ProductStatCard
          title="Ngừng kinh doanh"
          value={inactiveProducts}
          icon={<CircleOff />}
          color="bg-red-100 text-red-600"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <ProductToolbar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          onAdd={handleOpenCreate}
        />

        <ProductTable
          products={currentProducts}
          loading={loading}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleDeleteProduct}
          onAddIngredient={handleOpenAddIngredient}
        />

        <ProductPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProducts.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      <ProductPopup
        open={openPopup}
        onOpenChange={setOpenPopup}
        categories={categories}
        product={selectedProduct}
        mode={popupMode}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
};

export default AdProduct;
