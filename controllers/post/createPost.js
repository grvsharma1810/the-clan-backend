const Notification = require("../../models/Notification");
const Post = require("../../models/Post");
const UserLink = require("../../models/UserLink");


const createNewPostNotification = async (post, req) => {    
    try {
        const notification = {
            time: new Date(),
            notificationType: "NEW POST",
            post: post._id,
            sourceUser: req.tokenData.userId
        }
        const followers = await UserLink.find({ follows: req.tokenData.userId });
        const notifications = followers.map(follower => ({
            ...notification,
            targetUser: follower.user
        }))
        Notification.insertMany(notifications);
    } catch (error) {
        console.log(error);
    }
}


const createPost = async (req, res) => {    
    try {
        let post = {
            user: req.tokenData.userId,
            content: req.body.content,
            time: req.body.time,
        }
        if (req.body.media) {
            post.media = req.body.media;
        }
        post = await Post.create(post);
        post = await post.populate('user').execPopulate();
        res.status(201).json({ post });        
        createNewPostNotification(post, req);
    } catch (error) {
        console.log(err);
        res.status(404).json({ success: false })
    }
}

module.exports = createPost;