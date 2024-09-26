const Post = require("../../models/Post");

const deleteCommentOnPost = async (req, res) => {
    try {
        const postId = req.postId;
        const { userId } = req.tokenData;
        const { commentId } = req.params;
        let post = await Post.findById(postId);
        post.comments.pull({ _id: commentId });
        await post.save();
        post = await post.populate({
            path: 'likes',
            select: 'name username photo bio',
            model: 'User'
        })
            .populate({
                path: 'comments.user',
                select: 'name username photo bio',
                model: 'User'
            })
            .populate('user').execPopulate();
        res.status(200).json({ post })
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = deleteCommentOnPost;