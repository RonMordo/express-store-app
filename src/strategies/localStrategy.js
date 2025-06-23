import passport from "passport";
import strategy from "passport-local";
import { comparePasswords } from "../utils/helpers.js";
import User from "../mongoose/schemas/user.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new strategy(async (username, password, done) => {
    try {
      const userFound = await User.findOne({ username });
      if (!userFound) throw new Error("User not found");
      const matched = await comparePasswords(password, userFound.password);
      if (!matched) throw new Error("Bad credentials");
      done(null, userFound);
    } catch (err) {
      done(err, null);
    }
  })
);
