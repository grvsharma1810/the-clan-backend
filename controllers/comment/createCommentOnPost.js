const Notification = require("../../models/Notification");
const Post = require("../../models/Post");

const createCommentNotification = async (post, userId) => {
    try {
        const notification = {
            notificationType: "COMMENT",
            time: new Date(),
            post: post._id,
            targetUser: post.user,
            sourceUser: userId,
        }
        Notification.create(notification);
    } catch (error) {
        console.log(error);
    }
}

const createCommentOnPost = async (req, res) => {
    try {
        const postId = req.postId;
        const { userId } = req.tokenData;
        const comment = {
            user: userId,
            content: req.body.content,
            time: req.body.time
        }
        let post = await Post.findById(postId);
        post.comments.push(comment);
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
        res.status(201).json({ post })
        if (post.user._id != userId) {
            createCommentNotification(post, userId);
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = createCommentOnPost;