import { useEffect, useState } from "react";
import api from "../api";
import Modal from "../components/Modal";
import Blog from "./Blog";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [showModalPopup, setShowModalPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const fetchBlogs = async () => {
    const res = await api.get("/blogs/");
    console.log(res.data);
    setBlogs(res.data);
  };
  useEffect(() => {
    fetchBlogs();
  }, []);
  console.log(blogs);

  const handleClick = async () => {
    setTitle("");
    setContent("");
    setShowModalPopup(!showModalPopup);
  };

  const createBlog = async (e) => {
    e.preventDefault()
    const res = await api.post("blogs/", { title, content });
        if (res.status == 201) {
          setTitle("");
          setContent("");
          setShowModalPopup(false);
          fetchBlogs();
        }
  }
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return
      const res = await api.delete(`blogs/delete/${id}/`);
      if (res.status == 204) {
        fetchBlogs();
      }
      console.log(id);
    } catch (error) {
      alert(error);
    }
  };

  const updateBlog = async (e, id) => {
    e.preventDefault()
    try {
      const res = await api.patch(`blogs/update/${id}/`, { title, content });
      console.log(res.status);
    } catch (error) {
      alert(error);
    }
  };
  return (
    <div>
      <button onClick={handleClick}>Create</button>
      {showModalPopup && (
        <Modal
          header={<h2>Create Blog</h2>}
          footer={<h2>Customized Footer</h2>}
          setShowModalPopup={setShowModalPopup}
          createBlog={createBlog}
          title={title}
          content={content}
          setTitle={setTitle}
          setContent={setContent}
        />
      )}
      <h1>All Blogs</h1>
      <div className="blogs-container">
      {blogs &&
        blogs.length > 0 &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            id={blog.id}
            title={blog.title}
            content={blog.content}
            handleDelete={handleDelete}
            setShowModalPopup={setShowModalPopup}
            showModalPopup={showModalPopup}
            setTitle={setTitle}
            setContent={setContent}
            created_at={blog.created_at}
            updateBlog={updateBlog}
          />
        ))}
        </div>
    </div>
  );
}
