// app/api/auth/[...auth].ts
import { passportAuth } from "blitz"
import FacebookStrategy from "passport-facebook"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import db from "db"

const oauthHandler = async ({
  profile,
  source,
  done,
}: {
  profile: {
    id: string
    emails: Array<{ value: string; verified: boolean }>
    displayName: string
  }
  source: "facebook" | "google"
  done: (
    error?: Error,
    data?: {
      publicData: {
        userId: string
        roles: Array<string>
        source: string
      }
    }
  ) => void
}) => {
  const email = profile.emails && profile.emails[0]?.value

  if (!email) {
    // This can happen if you haven't enabled email access in your Facebook app permissions
    return done(new Error(`${source} OAuth response doesn't have email.`))
  }

  const user = await db.user.upsert({
    where: { email },
    create: {
      email,
      name: profile.displayName,
      [`${source}Id`]: profile.id,
    },
    update: { email, [`${source}Id`]: profile.id },
  })

  const publicData = {
    userId: user.id,
    roles: [user.role],
    source,
  }
  done(undefined, { publicData })
}

export default passportAuth({
  successRedirectUrl: "/",
  errorRedirectUrl: "/",
  // secureProxy: true,
  strategies: [
    {
      strategy: new FacebookStrategy(
        {
          profileFields: ["id", "displayName", "emails"],
          scope: ["email"],
          clientID: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          callbackURL:
            process.env.NODE_ENV === "production"
              ? "https://gisk.app/api/auth/facebook/callback"
              : "http://localhost:3000/api/auth/facebook/callback",
        },
        async (_token, _tokenSecret, profile, done) => {
          oauthHandler({
            profile,
            source: "facebook",
            done,
          })
        }
      ),
    },
    {
      strategy: new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.NODE_ENV === "production"
              ? "https://gisk.app/api/auth/google/callback"
              : "http://localhost:3000/api/auth/google/callback",
          profileFields: ["id", "displayName", "name", "emails"],
          scope: ["email", "https://www.googleapis.com/auth/userinfo.profile"],
        },
        async (_token, _tokenSecret, profile, done) => {
          oauthHandler({
            profile,
            source: "google",
            done,
          })
        }
      ),
    },
  ],
})
