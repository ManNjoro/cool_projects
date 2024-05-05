/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/modal.css";

export default function BlogEdit() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchBlog = async () => {
    try {
      const res = await api.get(`blogs/${id}/`);
      if (res.status == 200) {
        setTitle(res.data.title);
        setContent(res.data.content);
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);
  const updateBlog = async (e, id) => {
    e.preventDefault();
    try {
      const res = await api.put(`blogs/update/${id}/`, { title, content });
      if (res.status == 200) {
        navigate("/");
      }
      console.log(res.status);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <form className="blog-form" onSubmit={(e) => updateBlog(e, id)}>
        <div className="blog-details">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className="blog-details">
          <label htmlFor="description">Description</label>
          <textarea
            name="content"
            id="content"
            cols="30"
            rows="5"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </div>
        <button>Update</button>
      </form>
    </div>
  );
}
