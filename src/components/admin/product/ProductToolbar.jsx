const ProductToolbar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Danh mục */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((cate) => (
            <option key={cate.categoryId} value={cate.categoryId}>
              {cate.name}
            </option>
          ))}
        </select>

        {/* Trạng thái */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">Trạng thái: Tất cả</option>
          <option value="Active">Đang kinh doanh</option>
          <option value="Inactive">Ngừng kinh doanh</option>
        </select>
      </div>

      <div className="text-sm text-slate-500">Bộ lọc sản phẩm</div>
    </div>
  );
};

export default ProductToolbar;
