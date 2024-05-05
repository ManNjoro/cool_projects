/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import Blog from "./Blog";

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const fetchBlog = async () => {
    try {
      const res = await api.get(`blogs/${id}/`);
      if (res.status == 200) {
        setBlog(res.data);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);
  console.log(blog);
  return (
    <div>
      <Blog
        id={blog.id}
        key={blog.id}
        title={blog.title}
        content={blog.content}
        created_at={blog.created_at}
      />
    </div>
  );
}
