const router = require("express").Router();
const passport = require("passport");

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
    failureRedirect: "/",
  }),
  authenticateUser
);

router.post("/login/:id", LoginById);

router.get("/logout/:id", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
    }
    res.redirect("https://main--velvety-crepe-d210ac.netlify.app");
  });
});

module.exports = { AuthRouter: router };
