const UserLink = require("../../models/UserLink");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

const createNewFollowerNotification = async (user, follows, req) => {
    try {
        const notification = {
            notificationType: "NEW FOLLOWER",
            time: new Date(),
            targetUser: follows,
            sourceUser: user
        }
        Notification.create(notification);
    } catch (error) {
        console.log(error);
    }
}

const createUserLink = async (req, res) => {
    try {
        const { user, follows } = req.body;
        const following = await UserLink.create({ user, follows });
        const sourceUser = await User.findById(user);
        const targetUser = await User.findById(follows);
        sourceUser.followingCount = sourceUser.followingCount + 1;
        targetUser.followerCount = targetUser.followerCount + 1;
        await sourceUser.save();
        await targetUser.save();
        res.status(201).json({ following });
        createNewFollowerNotification(user, follows, req);
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = createUserLink;