import { Button } from "./ui/button";

const ButtonCustom = ({ name, size }) => {
  return (
    <Button
      size={size}
      className="border-[#A67C52] py-4 px-6 cursor-pointer text-[#A67C52] hover:bg-[#A67C52]
    hover:text-white "
    >
      {name}
    </Button>
  );
};

export default ButtonCustom;
