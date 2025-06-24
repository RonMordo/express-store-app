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
    done(err);
  }
});

passport.use(
  new strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return done(null, false, { message: "User not found" });
      }
      const matched = await comparePasswords(password, userFound.password);
      if (!matched) {
        return done(null, false, { message: "Bad crendetials" });
      }
      done(null, userFound);
    } catch (err) {
      done(err);
    }
  })
);
