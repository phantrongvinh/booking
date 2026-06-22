import { Trash2 } from "lucide-react";

const CartItem = ({ item, onToggle, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="border rounded-3xl p-4 flex items-center gap-4 bg-white">
      {/* CHECKBOX */}
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => onToggle(item.product_id)}
      />

      {/* IMAGE */}
      <div className="w-24 h-24 bg-gray-300 rounded-md" />

      {/* INFO */}
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>

        <p className="text-orange-500 font-bold">
          {item.price.toLocaleString()}đ
        </p>

        {/* QUANTITY */}
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onDecrease(item.product_id)}
            className="border px-3 rounded"
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => onIncrease(item.product_id)}
            className="border px-3 rounded"
          >
            +
          </button>
        </div>
      </div>

      {/* REMOVE */}
      <button onClick={() => onRemove(item.product_id)}>
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
