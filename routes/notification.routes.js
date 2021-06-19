const express = require("express");
const getUserNotifications = require("../controllers/notification/getUserNotifications");

const router = express.Router();

router.get("/", getUserNotifications);

module.exports = router;