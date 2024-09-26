const User = require("../../models/User");
const UserLink = require("../../models/UserLink");

const getUserById = async (req, res) => {
    try {        
        const userId = req.params.userId;        
        const user = await User.findById(userId);
        delete user.password;
        const userLink = await UserLink.findOne({user: req.tokenData.userId, follows: userId});
        if(userLink){
            res.status(200).json({ user, following: userLink });   
            return;
        }
        res.status(200).json({ user, following: userLink });   
    } catch (error) {
        console.log(error);
        res.status(404).json({ success: false })
    }
}

module.exports = getUserById;