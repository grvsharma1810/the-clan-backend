const Post = require("../../models/Post");
const UserLink = require("../../models/UserLink");
const Notification = require("../../models/Notification");

const getUserHome = async (req, res) => {
    try {
        const { userId } = req.tokenData;
        let users = await UserLink.find({ user: userId }).select("follows");
        users = users.map((user) => user.follows);  // TODO: find a way to remove this map method since it adds extra computation
        const postOfFollowingUsers = await Post.find({ $or: [{ user: { $in: users } }, { user: userId }] }).sort({ time: 'desc' })
            .populate({
                path: 'likes',
                select: 'name username photo bio',
                model: 'User'
            })
            .populate({
                path: 'comments.user',
                select: 'name username photo bio',
                model: 'User'
            }).populate('user');;
        const notifications = await Notification.find({ targetUser: userId });
        res.status(200).json({ posts: postOfFollowingUsers, notifications: notifications });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getUserHome;