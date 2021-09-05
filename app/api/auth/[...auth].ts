// app/api/auth/[...auth].ts
import { passportAuth } from "blitz"
import FacebookStrategy from "passport-facebook"
import db from "db"

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/login",
  // secureProxy: true,
  strategies: [
    {
      strategy: new FacebookStrategy(
        {
          profileFields: ["id", "displayName", "emails"],
          scope: ["email"],
          clientID:
            process.env.NODE_ENV === "production"
              ? process.env.FACEBOOK_CLIENT_ID
              : process.env.FACEBOOK_CLIENT_ID_TEST,
          clientSecret:
            process.env.NODE_ENV === "production"
              ? process.env.FACEBOOK_CLIENT_SECRET
              : process.env.FACEBOOK_CLIENT_SECRET_TEST,
          callbackURL:
            process.env.NODE_ENV === "production"
              ? "https://example.com/api/auth/facebook/callback"
              : "http://localhost:3000/api/auth/facebook/callback",
        },
        async function (_token, _tokenSecret, profile, done) {
          const email = profile.emails && profile.emails[0]?.value
          console.log("1111", profile)

          if (!email) {
            // This can happen if you haven't enabled email access in your Facebook app permissions
            return done(new Error("Facebook OAuth response doesn't have email."))
          }

          const user = await db.user.upsert({
            where: { email },
            create: {
              email,
              name: profile.displayName,
              facebookId: profile.id,
            },
            update: { email },
          })

          const publicData = {
            userId: user.id,
            roles: [user.role],
            source: "facebook",
          }
          done(undefined, { publicData })
        }
      ),
    },
  ],
})
