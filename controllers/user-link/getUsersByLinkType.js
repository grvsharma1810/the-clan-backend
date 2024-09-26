const UserLink = require("../../models/UserLink")

const getUsersByLinkType = async (req, res) => {
    try{
        const userId = req.query.userId;
        const type = req.query.type;
        if (type === "following") {
            const followings = await UserLink.find({ user: userId }).select("follows").populate("follows");
            res.status(200).json({ followings });
        } else if (type === "follower") {
            const followers = await UserLink.find({ follows: userId }).select("user").populate("user");
            res.status(200).json({ followers });
        } else {
            res.status(400).json({ message: "No Link Type Provided" })
            return;
        }
    } catch (error){
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getUsersByLinkType