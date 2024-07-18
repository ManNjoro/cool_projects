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
const addNewBlog = async(req, res) => {
    const {title, description} = req.body
    const currentDate = new Date()
    const newlyCreateBlog = new Blog({
        title, description, date: currentDate
    })
    try {
       await newlyCreateBlog.save()
    } catch(e) {
        res.status(500).json({message: e.message})
    }
}

// delete a blog
// update a blog
