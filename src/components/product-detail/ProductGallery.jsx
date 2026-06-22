import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductGallery = ({ product }) => {
  const images =
    product.images?.length > 0 ? product.images : [product.image_url];

  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div>
      {/* Ảnh lớn */}
      <div className="bg-[#F3E7CD] rounded-[32px] overflow-hidden aspect-[16/10]">
        <img
          src={images[currentImage]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <Button
          size="icon"
          variant="outline"
          onClick={prevImage}
          className="rounded-full"
        >
          <ChevronLeft />
        </Button>

        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-16 h-16 rounded overflow-hidden border-2 transition ${
              currentImage === index
                ? "border-orange-500"
                : "border-transparent"
            }`}
          >
            <img src={image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}

        <Button
          size="icon"
          variant="outline"
          onClick={nextImage}
          className="rounded-full"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default ProductGallery;
