import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogs } from "./Blog";
import ReactMarkdown from "react-markdown";
import BlogCard from "@/components/blog/BlogCard";
import ulti from "@/ultis/ulti";

const BlogDetail = () => {
  const { slug } = useParams();
  const blog = blogs.find((b) => b.slug === slug);

  const relateBlog = blogs.filter((b) => b.slug !== slug);
  return (
    <div className="container mx-auto px-6 py-12">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full aspect-[16/7] object-cover rounded-3xl"
      />

      <h1 className="mt-10 text-4xl font-bold text-[#6B4E41]">{blog.title}</h1>

      <div className="mt-4 flex items-center gap-6 text-sm text-[#FF7A00]">
        <span>{blog.author}</span> - <span>{blog.createdAt}</span>
      </div>

      {/* Content */}
      <div className="leading-loose py-10 my-10 border-t border-b border-[#FF7A00]">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-6">{children}</h1>
            ),

            h2: ({ children }) => (
              <h2 className="text-lg font-semibold mt-8 mb-4">{children}</h2>
            ),

            p: ({ children }) => (
              <p className="leading-loose text-slate-700 mb-4">{children}</p>
            ),

            li: ({ children }) => (
              <li className="ml-6 list-disc mb-2">{children}</li>
            ),
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </div>

      {/* Related */}
      <div className="mt-16 border-tborder-[#FF7A00]">
        <h2 className="text-2xl font-semibold text-[#4B2E2E] mb-10">
          Bài viết liên quan
        </h2>

        <div className="flex gap-4">
          {ulti.splitIntoColumns(relateBlog, 3).map((col, i) => (
            <div className="flex flex-col gap-4 flex-1" key={i}>
              {col.map((item) => (
                <BlogCard key={item.id} data={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
