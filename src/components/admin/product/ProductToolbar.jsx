const ProductToolbar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  onAdd,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-3">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((cate) => (
            <option key={cate.categoryId} value={cate.categoryId}>
              {cate.name}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Active">Đang kinh doanh</option>
          <option value="Inactive">Ngừng kinh doanh</option>
        </select>
      </div>
    </div>
  );
};

export default ProductToolbar;
