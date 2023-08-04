const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const response = require("../utils/util");
const GoogleAccount = require("../models/GoogleAccount");
const {
  authenticateUser,
  LoginById,
} = require("../controllers/AuthController");
require("../config/passport-auth");

//google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/redirectURL",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
  }),
  authenticateUser
);

router.post("/login/:id", LoginById);

router.get("/logout/:id", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }
    res.redirect("http://localhost:5173/login");
  });
});

module.exports = { AuthRouter: router };
