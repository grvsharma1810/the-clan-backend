const express = require("express");
const createCommentOnPost = require("../controllers/comment/createCommentOnPost");
const deleteCommentOnPost = require("../controllers/comment/deleteCommentOnPost");

const router = express.Router();

router.post("/", createCommentOnPost);
router.delete("/:commentId", deleteCommentOnPost)

module.exports = router;