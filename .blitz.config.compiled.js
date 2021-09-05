// blitz.config.js
var {sessionMiddleware, simpleRolesIsAuthorized} = require("blitz");
var withSourceMaps = require("@zeit/next-source-maps");
var SentryWebpackPlugin = require("@sentry/webpack-plugin");
var {
  SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  VERCEL_GITHUB_COMMIT_SHA,
  RENDER_GIT_COMMIT
} = process.env;
var COMMIT_SHA = VERCEL_GITHUB_COMMIT_SHA || RENDER_GIT_COMMIT;
module.exports = withSourceMaps({
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN
  },
  serverRuntimeConfig: {
    rootDir: __dirname
  },
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
      cookiePrefix: "euro2020"
    })
  ],
  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser";
    }
    if (SENTRY_DSN && SENTRY_ORG && SENTRY_PROJECT && SENTRY_AUTH_TOKEN && COMMIT_SHA && NODE_ENV === "production") {
      config.plugins.push(new SentryWebpackPlugin({
        include: ".next",
        ignore: ["node_modules"],
        stripPrefix: ["webpack://_N_E/"],
        urlPrefix: `~/_next`,
        release: COMMIT_SHA
      }));
    }
    return config;
  }
});
