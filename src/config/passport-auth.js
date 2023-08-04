const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleAccount = require("../models/GoogleAccount");
const jwt = require("jsonwebtoken");
const json = require("../../.google.json");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: json.web.client_id,
      clientSecret: json.web.client_secret,
      callbackURL: "/auth/google/redirectURL",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existUser = await GoogleAccount.findOne({ googleID: profile.id });

      if (existUser) {
        return done(null, existUser);
      }
      const NewUser = new GoogleAccount({
        googleID: profile.id,
        fullname: profile.displayName,
        email: profile.emails[0].value,
        profilePic: profile._json.picture,
        token: "",
      });

      await NewUser.save();
      return done(null, NewUser);
    }
  )
);

passport.serializeUser(async (user, done) => {
  const User = await GoogleAccount.findById(user.id);
  const token = jwt.sign({ userID: User.id }, process.env.SECRET_KEY);

  User.token = token;
  await User.save();
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await GoogleAccount.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
