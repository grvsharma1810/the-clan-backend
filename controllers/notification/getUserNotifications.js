const Notification = require("../../models/Notification");

const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ targetUser: req.tokenData.userId })
            .sort({ time: 'desc' })
            .populate('sourceUser')
        res.status(201).json({ notifications });
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getUserNotifications;