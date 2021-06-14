const Post = require("../../models/Post");
const UserLink = require("../../models/UserLink");

const getUserFeed = async (req, res) => {
    try {
        const { userId } = req.tokenData;
        let { current, size } = req.query;
        current = parseInt(current);
        size = parseInt(size);        
        let users = await UserLink.find({ user: userId }).select("follows");
        users = users.map((user) => user.follows);  // TODO: find a way to remove this map method since it adds extra computation
        const postOfFollowingUsers = await Post.find({ $or: [{ user: { $in: users } }, { user: userId }] })
            .sort({ time: 'desc' })
            .limit(size)
            .skip(current)
            .populate({
                path: 'likes',
                select: 'name username photo bio',
                model: 'User'
            })
            .populate({
                path: 'comments.user',
                select: 'name username photo bio',
                model: 'User'
            })
            .populate('user');

        if ((current + size + 1) >= await Post.countDocuments()) {
            next = null;
        } else {
            next = current + size;
        }
        res.status(200).json({ posts: postOfFollowingUsers, current, next });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getUserFeed;