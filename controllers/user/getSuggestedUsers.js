const User = require("../../models/User");
const UserLink = require("../../models/UserLink");

const getSuggestedUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const max = (userCount - 10) > 0 ? (userCount - 10) : 0;
        const startInd = Math.floor(Math.random() * (max));

        let followedUsers = await UserLink.find({ user: req.tokenData.userId }).select("follows");
        followedUsers = followedUsers.map((user) => user.follows);

        let users = await User.find({ _id: { $nin: followedUsers } }).limit(10).skip(startInd).select("name photo username");                
        users = users.filter(user => user._id != req.tokenData.userId);
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getSuggestedUsers;