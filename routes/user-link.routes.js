const express = require("express");
const createUserLink = require("../controllers/user-link/createUserLink");
const deleteUserLink = require("../controllers/user-link/deleteUserLink");
const getUsersByLinkType = require("../controllers/user-link/getUsersByLinkType");
const router = express.Router();

router.get("/", getUsersByLinkType);
router.post("/", createUserLink);
router.delete("/:linkId", deleteUserLink);

module.exports = router;