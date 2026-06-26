const SidebarItem = ({ icon, text, active }) => (
  <button
    className={`
        w-full
        flex
        items-center
        gap-4
        px-4
        py-3
        rounded-xl
        transition
        ${
          active
            ? "bg-orange-100 text-orange-600 font-semibold"
            : "hover:bg-gray-100 text-gray-700"
        }
    `}
  >
    {icon}

    <span>{text}</span>
  </button>
);

export default SidebarItem;
