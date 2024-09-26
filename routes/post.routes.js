const express = require("express");
const createPost = require("../controllers/post/createPost");
const deletePostById = require("../controllers/post/deletePostById");
const getPostsById = require("../controllers/post/getPostById");
const getPostsByUserId = require("../controllers/post/getPostsByUserId");
const router = express.Router();

router.get("/", getPostsByUserId);
router.get("/:postId", getPostsById);
router.post("/", createPost);
router.delete("/:postId", deletePostById);

module.exports = router;