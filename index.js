const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cron = require("node-cron");
const initializeDBConnection = require("./db/db.connect");
const authVerify = require("./middlewares/authVerify");
const Notification = require("./models/Notification");
const User = require("./models/User");

dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(morgan('dev'));

initializeDBConnection();

app.use("/", require("./routes/auth.routes"));
app.use("/posts", authVerify, require("./routes/post.routes"))
app.use("/posts/:postId/likes", (req, res, next) => { req.postId = req.params.postId; next() }, authVerify, require("./routes/like.routes"))
app.use("/posts/:postId/comments", (req, res, next) => { req.postId = req.params.postId; next() }, authVerify, require("./routes/comment.routes"))
app.use("/home", authVerify, require("./routes/home.routes"))
app.use("/users", authVerify, require("./routes/user.routes"))
app.use("/user-links", authVerify, require("./routes/user-link.routes"))
app.use("/notifications", authVerify, require("./routes/notification.routes"))

const PORT = process.env.PORT || 3001;

cron.schedule("* * 30 * *", async () => {
    try {
        const users = await User.find();
        for (user of users) {
            const userNotifications = await Notification.find({ targetUser: user._id }).sort({ time: 'desc' });
            if (userNotifications.length > process.env.MAX_USER_NOTIFICATION_COUNT) {
                let staleNotifications = userNotifications.slice(process.env.MAX_USER_NOTIFICATION_COUNT);
                staleNotifications = staleNotifications.map(staleNotification => staleNotification._id);
                await Notification.deleteMany({ _id: { $in: staleNotifications } });
            }
        }
    } catch (error) {
        console.log(error);
    }
})

/**
 * 404 Route Handler
 * Note: DO not MOVE. This should be the last route
 */
app.use((req, res) => {
    res.status(404).json({ success: false, message: "route not found on server, please check" })
})


/**
 * Error Handler
 * Don't move
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "error occured, see the errMessage key for more details", errorMessage: err.message })
})

app.listen(PORT, () => {
    console.log("Server started at port " + PORT);
})