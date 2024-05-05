/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom";

export default function Blog({ id, title, content, created_at, handleDelete }) {
  const navigate = useNavigate();
  const formattedDate = new Date(created_at).toLocaleDateString("en-US");

  return (
    <div className="blog-container">
      <header>
        <h3>{title}</h3>
        <h4>{formattedDate}</h4>
        <div className="blog-actions">
          <button onClick={() => navigate(`/blogs/edit/${id}`)}>Edit</button>
          <button onClick={() => navigate(`/blogs/${id}`)}>Details</button>
          <button onClick={() => handleDelete(id)}>Delete</button>
        </div>
      </header>
      <div className="blog-content">{content}</div>
    </div>
  );
}
