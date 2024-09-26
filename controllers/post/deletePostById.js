const Post = require("../../models/Post");

const deletePostById = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findByIdAndDelete(postId);
        res.status(200).json({ deleted: post._id });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = deletePostById;