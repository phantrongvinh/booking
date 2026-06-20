import { Button } from "./ui/button";

const ButtonCustom = ({ name, size, color, ...props }) => {
  return (
    <Button
      size={size}
      className={`${color} py-4 px-6 cursor-pointer 
    hover:text-white `}
      {...props}
    >
      {name}
    </Button>
  );
};

export default ButtonCustom;
