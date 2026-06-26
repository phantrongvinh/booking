import { Trash2 } from "lucide-react";

const CartItem = ({
  item,
  selected,
  onToggle,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  return (
    <div className="border rounded-3xl p-4 flex items-center gap-4 bg-white">
      {/* CHECKBOX */}
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggle(item.productId)}
      />

      {/* IMAGE */}
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-24 h-24 rounded-md object-cover border"
      />

      {/* INFO */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{item.name}</h3>

        <p className="text-orange-500 font-bold mt-1">
          {item.price.toLocaleString()}đ
        </p>

        {/* QUANTITY */}
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => onDecrease(item.productId)}
            className="w-8 h-8 border rounded flex items-center justify-center"
          >
            -
          </button>

          <span className="min-w-6 text-center">{item.quantity}</span>

          <button
            onClick={() => onIncrease(item.productId)}
            className="w-8 h-8 border rounded flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>

      {/* REMOVE */}
      <button
        onClick={() => onRemove(item.productId)}
        className="text-red-500 hover:text-red-600"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
