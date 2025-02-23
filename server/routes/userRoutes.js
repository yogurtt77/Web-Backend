const express = require("express");
const { register, login, getUserProfile } = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getUserProfile);

module.exports = router;
