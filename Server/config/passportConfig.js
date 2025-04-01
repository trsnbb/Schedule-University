import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import UserSchema from "../models/User.js";
import dotenv from "dotenv";
import { linkPredmetToRegisteredTeacher } from "../controllers/teachingsController.js"; 

dotenv.config();

export const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
          let role;

          if (email.endsWith("@student.uzhnu.edu.ua")) {
            role = "student";
          } else if (email.endsWith("@uzhnu.edu.ua")) {
            role = "teacher";
          } else {
            return done(new Error("Використайте будь ласка корпоративну пошту"), null);
          }

          let user = await UserSchema.findOne({ email });
          if (!user) {
            user = new UserSchema({
              email,
              name: profile.displayName,
              role,
              avatarUrl: profile.photos ? profile.photos[0].value : null,
            });
            await user.save();
          } else {
            if (profile.photos && profile.photos[0].value !== user.avatarUrl) {
              user.avatarUrl = profile.photos[0].value;
              await user.save();
            }
          }

          if (role === "teacher") {
            await linkPredmetToRegisteredTeacher(user._id, email);
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await UserSchema.findById(id);
    done(null, user);
  });
};
