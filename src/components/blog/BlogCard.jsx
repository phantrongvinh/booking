import ulti from "@/ultis/ulti";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const BlogCard = ({ data }) => {
  return (
    <Link to={`/blog/${data.slug}`}>
      <Card className="mb-2 overflow-hidden rounded cursor-pointer hover:shadow-md transition">
        <CardHeader className="p-0 flex items-center justify-center">
          <img src={data.image} alt="" className="object-contain" />
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold text-[#000000]">{data.title}</h3>
          <div className="my-2 text-sm  text-[#FF7A00]">
            {data.author} - {data.createdAt}
          </div>
          <div className="leading-loose prose max-w-none">
            <ReactMarkdown>{ulti.limitString(data.content, 200)}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default BlogCard;
