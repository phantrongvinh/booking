import { Button } from "./ui/button";

const ButtonCustom = ({ name, size }) => {
  return (
    <Button
      size={size}
      className="border-[#FF7A00] py-4 px-6 cursor-pointer text-[#FF7A00] hover:bg-[#FF7A00]
    hover:text-white "
    >
      {name}
    </Button>
  );
};

export default ButtonCustom;
