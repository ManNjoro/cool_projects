const mongoose = require("mongoose");
const Blog = require("../model/Blog");

// fetch list ofblogs

const fetchListOfBlogs = async (req, res) => {
  let blogList;
  try {
    blogList = await Blog.find();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  if (!blogList) {
    return res.status(404).json({ message: "No Blogs found" });
  }

  return res.status(200).json({ blogList });
};

// add a new blog
// delete a blog
// update a blog
