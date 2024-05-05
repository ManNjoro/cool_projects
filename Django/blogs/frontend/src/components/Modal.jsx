/* eslint-disable react/prop-types */
import "../styles/modal.css";

export default function Modal({
  id,
  header,
  body,
  footer,
  setShowModalPopup,
  createBlog,
  updateBlog,
  setTitle,
  setContent,
  title,
  content,
  action,
}) {
  const handleCloseModal = () => {
    setShowModalPopup(false);
  };
  return (
    <div id="Modal" className="modal">
      <div className="content">
        <div className="header">
          <span className="close-modal-icon" onClick={handleCloseModal}>
            &times;
          </span>
          <h2>{header ? header : "Header"}</h2>
        </div>
        <div className="body">
          {body ? (
            body
          ) : (
            <form
              className="blog-form"
              onSubmit={(e) => (action ? updateBlog(e, id) : createBlog(e))}
            >
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
              <button>{action ? action : "Create"}</button>
            </form>
          )}
        </div>
        <div className="footer">
          {footer ? (
            footer
          ) : (
            <div>
              <h2>This is our footer</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
