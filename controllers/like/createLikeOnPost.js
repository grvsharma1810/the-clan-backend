const Notification = require("../../models/Notification");
const Post = require("../../models/Post");

const createLikeNotification = async (post, userId) => {
    try {
        const notification = {
            notificationType: "LIKE",
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


const createLikeOnPost = async (req, res) => {
    try {
        const postId = req.postId;
        const { userId } = req.tokenData;
        let post = await Post.findById(postId);
        post.likes.push(userId);
        post = await post.save();
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
        if(post.user._id != userId){            
            createLikeNotification(post, userId)
        }        
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = createLikeOnPost;