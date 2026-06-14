import BlogCard from "@/components/blog/BlogCard";
import ulti from "@/ultis/ulti";

export const blogs = [
  {
    id: 1,
    slug: "5-loai-banh-sinh-nhat-duoc-yeu-thich-nhat-2026",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200",
    title: "5 loại bánh sinh nhật được yêu thích nhất năm 2026",
    author: "Sweet Bakery",
    createdAt: "2026-06-12",
    content: `
# 5 loại bánh sinh nhật được yêu thích nhất năm 2026

Bánh sinh nhật không chỉ là món tráng miệng mà còn là biểu tượng của những khoảnh khắc đáng nhớ. Trong năm 2026, những chiếc bánh mang phong cách tối giản nhưng tinh tế đang ngày càng được yêu thích.

## 1. Red Velvet

Red Velvet nổi bật với lớp bánh mềm mịn kết hợp cùng kem cheese béo nhẹ, phù hợp với nhiều độ tuổi.

## 2. Bánh Mousse Trái Cây

Vị thanh mát từ trái cây tươi giúp mousse trở thành lựa chọn hoàn hảo cho những ngày hè.

## 3. Tiramisu

Hương vị cà phê quyện cùng mascarpone mang đến trải nghiệm tinh tế và sang trọng.
`,
  },

  {
    id: 2,
    slug: "cach-bao-quan-banh-kem-dung-cach",
    image:
      "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1200",
    title: "Cách bảo quản bánh kem đúng cách",
    author: "Sweet Bakery",
    createdAt: "2026-06-08",
    content: `
# Cách bảo quản bánh kem đúng cách

Bảo quản bánh đúng cách giúp giữ được hương vị và chất lượng tốt nhất.

## 1. Bảo quản trong tủ lạnh

Nên đặt bánh trong hộp kín và giữ ở nhiệt độ từ **2–5°C**.

## 2. Tránh ánh nắng trực tiếp

Nhiệt độ cao có thể làm kem bị chảy và ảnh hưởng đến kết cấu bánh.

## 3. Sử dụng sớm

Bánh kem nên được dùng trong vòng **24–48 giờ** sau khi nhận.
`,
  },

  {
    id: 3,
    slug: "bi-quyet-chon-banh-cuoi-hoan-hao",
    image:
      "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=1200",
    title: "Bí quyết chọn bánh cưới hoàn hảo",
    author: "Sweet Bakery",
    createdAt: "2026-06-03",
    content: `
# Bí quyết chọn bánh cưới hoàn hảo

Bánh cưới là điểm nhấn quan trọng trong ngày trọng đại của các cặp đôi.

## 1. Chọn kích thước phù hợp

Hãy dựa vào số lượng khách mời để quyết định số tầng và kích thước bánh.

## 2. Đồng nhất với concept

Màu sắc và phong cách bánh nên hài hòa với không gian tiệc cưới.

## 3. Ưu tiên hương vị yêu thích

Một chiếc bánh ngon sẽ để lại ấn tượng khó quên cho khách mời.
`,
  },

  {
    id: 4,
    slug: "top-7-mon-banh-ngot-cho-buoi-tra-chieu",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200",
    title: "Top 7 món bánh ngọt cho buổi trà chiều",
    author: "Sweet Bakery",
    createdAt: "2026-05-28",
    content: `
# Top 7 món bánh ngọt cho buổi trà chiều

Một buổi trà chiều sẽ trở nên hoàn hảo hơn khi kết hợp cùng những món bánh ngọt tinh tế.

## Những món bánh nên thử

- Croissant
- Cheesecake
- Macaron
- Brownie
- Fruit Tart
- Muffin
- Donut

Mỗi loại bánh đều mang đến một hương vị riêng, phù hợp với từng sở thích khác nhau.
`,
  },

  {
    id: 5,
    slug: "banh-it-duong-xu-huong-ngot-ngao-lanh-manh",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200",
    title: "Bánh ít đường – xu hướng ngọt ngào lành mạnh",
    author: "Sweet Bakery",
    createdAt: "2026-05-22",
    content: `
# Bánh ít đường – xu hướng ngọt ngào lành mạnh

Ngày càng nhiều người quan tâm đến sức khỏe và lựa chọn những món bánh ít đường.

## **Ưu điểm**

- Giảm lượng đường nhưng vẫn giữ được hương vị thơm ngon.

## **Phù hợp với ai?**

- Người ăn kiêng
- Người lớn tuổi
- Những ai yêu thích lối sống lành mạnh

## Xu hướng tương lai

Bánh healthy được dự đoán sẽ tiếp tục phát triển mạnh trong những năm tới.
`,
  },
];

const Blog = () => {
  return (
    <div className="py-20 container mx-auto">
      <div className="pb-30">
        <div className="text-center pb-10">
          <p className="font-light text-5xl border-b-3 inline-block pb-10 px-4">
            Blog
          </p>
        </div>
        <p className="text-center leading-loose mx-50">
          Không chỉ mang đến những chiếc bánh thơm ngon, chúng tôi còn muốn chia
          sẻ những kiến thức hữu ích và những câu chuyện thú vị xoay quanh thế
          giới bánh ngọt. Từ cách chọn bánh cho từng dịp đặc biệt đến những xu
          hướng mới nhất, tất cả đều được gửi gắm trong từng bài viết tại đây.
        </p>
      </div>

      <div className="flex gap-4">
        {ulti.splitIntoColumns(blogs, 3).map((col, i) => (
          <div className="flex flex-col gap-4 flex-1" key={i}>
            {col.map((item) => (
              <BlogCard key={item.id} data={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
