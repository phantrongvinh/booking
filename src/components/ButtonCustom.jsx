import { Button } from "./ui/button";

const ButtonCustom = ({ name, size }) => {
  return (
    <Button size={size} className="bg-[#FFC13B] py-4 px-6 cursor-pointer ">
      {name}
    </Button>
  );
};

export default ButtonCustom;
