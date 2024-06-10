const blitz = require("@blitzjs/next/eslint")

module.exports = {
  extends: ["./node_modules/@blitzjs/next/eslint"],
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
  },
}
