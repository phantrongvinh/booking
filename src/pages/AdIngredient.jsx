import { useEffect, useMemo, useState } from "react";
import ingredientAPI from "@/api/ingredientAPI";

import IngredientStatCard from "@/components/admin/ingredient/IngredientStatCard";
import IngredientToolbar from "@/components/admin/ingredient/IngredientToolbar";
import IngredientTable from "@/components/admin/ingredient/IngredientTable";
import IngredientPagination from "@/components/admin/ingredient/IngredientPagination";
import IngredientPopup from "@/components/admin/ingredient/IngredientPopup";

import { Button } from "@/components/ui/button";
import { Plus, Package, TriangleAlert } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const AdIngredient = () => {
  const [ingredients, setIngredients] = useState([]);

  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [openPopup, setOpenPopup] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState(null);

  // create | edit | view
  const [popupMode, setPopupMode] = useState("create");

  const loadIngredients = async () => {
    try {
      setLoading(true);

      const data = await ingredientAPI.fetchAllIngredient();

      setIngredients(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const totalValue = useMemo(() => {
    return ingredients.reduce(
      (sum, item) => sum + item.currentStock * item.costPerUnit,
      0,
    );
  }, [ingredients]);

  const lowStock = ingredients.filter(
    (item) => item.status !== "AVAILABLE",
  ).length;

  const filtered = ingredients.filter((item) =>
    item.name?.toLowerCase().includes(keyword.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const currentData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // thêm nguyên liệu
  const handleCreate = () => {
    setSelectedIngredient(null);
    setPopupMode("create");
    setOpenPopup(true);
  };

  // sửa nguyên liệu
  const handleEdit = (item) => {
    setSelectedIngredient(item);
    setPopupMode("edit");
    setOpenPopup(true);
  };

  // xem nguyên liệu
  const handleView = (item) => {
    setSelectedIngredient(item);
    setPopupMode("view");
    setOpenPopup(true);
  };

  // xóa nguyên liệu
  const handleDelete = async (item) => {
    try {
      const confirmDelete = window.confirm(
        `Bạn có chắc muốn xóa nguyên liệu "${item.name}" không?`,
      );

      if (!confirmDelete) return;

      await ingredientAPI.deleteIngredient(item.ingredientId);

      await loadIngredients();
    } catch (error) {
      console.error("Delete ingredient error:", error);
    }
  };

  return (
    <div
      className="
        mx-auto
        max-w-7xl
        px-4
        py-5
        space-y-5
        bg-slate-50
        min-h-screen
      "
    >
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <h1
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          Danh sách Nguyên liệu
        </h1>

        <Button
          onClick={handleCreate}
          className="
            h-10
            px-4
            bg-blue-600
            text-white
            hover:bg-blue-700
            font-medium
          "
        >
          <Plus size={16} />
          Nhập nguyên liệu mới
        </Button>
      </div>

      {/* CARD */}

      <div
        className="
          grid
          md:grid-cols-2
          gap-4
        "
      >
        <IngredientStatCard
          title="Tổng giá trị tồn"
          value={`${totalValue.toLocaleString()} đ`}
          icon={<Package />}
          color="
            bg-blue-100
            text-blue-600
          "
        />

        <IngredientStatCard
          title="Sắp hết hàng"
          value={`${lowStock} mặt hàng`}
          icon={<TriangleAlert />}
          color="
            bg-red-100
            text-red-600
          "
        />
      </div>

      {/* TABLE */}

      <div
        className="
          rounded-xl
          border
          bg-white
          overflow-hidden
        "
      >
        <IngredientToolbar
          keyword={keyword}
          setKeyword={setKeyword}
          onAdd={handleCreate}
        />

        <IngredientTable
          ingredients={currentData}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <IngredientPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* POPUP */}

      <IngredientPopup
        open={openPopup}
        mode={popupMode}
        ingredient={selectedIngredient}
        onClose={() => {
          setOpenPopup(false);
          setSelectedIngredient(null);
        }}
        onSubmit={async (data) => {
          try {
            if (popupMode === "create") {
              await ingredientAPI.createIngredient(data);
            }

            if (popupMode === "edit") {
              await ingredientAPI.updateIngredient(
                selectedIngredient.ingredientId,
                data,
              );
            }

            await loadIngredients();

            setOpenPopup(false);

            setSelectedIngredient(null);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </div>
  );
};

export default AdIngredient;
