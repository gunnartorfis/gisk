import i18n from "i18next"
import { initReactI18next } from "react-i18next"

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      NAV_BAR_MOBILE_TITLE: "EURO 2020",

      WELCOME_TITLE: "UEFA EURO 2020",
      WELCOME_DESCRIPTION: "Compete with your friends! Who's the football genius in your group?",
      WELCOME_LOGIN: "Already have an account?",
      WELCOME_SIGNUP: "Create an account",
      WELCOME_FREE: "It's 100% free",

      LEAGUES: "Leagues",
      MATCHES: "Matches",
      TEAMS: "Teams",
      ADMIN: "Admin",
      SETTINGS: "Settings",
      BUY_ME_A_COFFEE: "Buy me a coffee",

      NEW_LEAGUE: "New league",
      NEW_LEAGUE_JOIN: "Join a league",
      JOIN_LEAGUE_MODAL: "Join a league",
      LEAGUE_NAME: "League name",
      GOT_AN_INVITE: "Got an invite?",
      SCORING: "Scoring",
      SCORING_RULE_1: "Correct result (1X2)",
      SCORING_RULE_2: "Correct score",
      POINT: "point",

      INVITE_CODE_TO_LEAGUE: "Invite code to league",
      INVITE_CODE: "Invite code",
      SCORE: "points",

      MATCHES_TIMEZONE_INFO: "Displayed kickoffs are in Greenwich Mean Time (GMT)",

      QUIZ_ALERT: "Answer questions before the league starts for a chance to earn bonus points!",
      QUIZ_QUESTION_1: "Which country will win Euro 2020?",
      QUIZ_QUESTION_2: "Which country will be runner up?",
      QUIZ_QUESTION_3: "Which country will score the most goals?",
      QUIZ_QUESTION_4: "Which country will concede the most goals?",
      HOME: "Home",
      PREDICTION: "Prediction",
      RESULT: "Result",
      AWAY: "Away",
      ANSWER: "Answer",
      SELECT_A_TEAM: "Select a team",

      GROUP: "Group",

      SCORE_UPDATED_TITLE: "Success!",
      SCORE_UPDATED_ERROR: "Oops.",
      SCORE_NON_NEGATIVE: "Score can't be negative",
      SCORE_UPDATED: "Score updated",
      EMAIL: "Email",
      PASSWORD: "Password",
      NAME: "Name",
      LOGOUT: "Logout",
      FORGOT_PASSWORD: "Forgot password?",
      LOGIN_BUTTON: "LOG IN",
      SIGNUP_FORM_LOGIN: "Log in instead?",
      LOGIN_FORM_SIGNUP: "Sign up instead?",
      CREATE_ACCOUNT_TITLE: "Create an account",
      CREATE_ACCOUNT_SUBTITLE: "then create a league to play with your friends!",
      CREATE: "Create",
      CANCEL: "Cancel",
      UPDATE: "Update",
      DELETE: "Delete",
      REQUEST_SUBMITTED: "Request Submitted",
      RESET_PASSWORD_INSTRUCTIONS:
        "If your email is in our system, you will receive instructions to reset your password shortly.",
      SEND_RESET_PASSWORD_INSTRUCTIONS: "Send Reset Password Instructions",
    },
  },
  is: {
    translation: {
      NAV_BAR_MOBILE_TITLE: "EM 2020",

      WELCOME_TITLE: "EM 2020",
      WELCOME_DESCRIPTION: "Kepptu við vini þína! Hver er fótboltasnillingurinn í hópnum þínum?",
      WELCOME_LOGIN: "Nú þegar með aðgang?",
      WELCOME_SIGNUP: "Stofna aðgang",
      WELCOME_FREE: "Það er 100% frítt",

      LEAGUES: "Deildir",
      MATCHES: "Leikir",
      TEAMS: "Lið",
      ADMIN: "Stjórnborð",
      SETTINGS: "Stillingar",
      BUY_ME_A_COFFEE: "Viltu splæsa í kaffi?",
      SCORE_UPDATED_TITLE: "Tókst!",
      SCORE_UPDATED_ERROR: "Úps.",
      SCORE_NON_NEGATIVE: "Spá má ekki vera neikvæð",
      SCORE_UPDATED: "Spá uppfærð",

      NEW_LEAGUE: "Ný deild",
      NEW_LEAGUE_JOIN: "Skráning í deild",
      JOIN_LEAGUE_MODAL: "Skráning í deild",
      LEAGUE_NAME: "Nafn deildar",
      GOT_AN_INVITE: "Ertu með boð í deild?",
      SCORING: "Stigagjöf",
      SCORING_RULE_1: "Rétt sigurlið (1X2)",
      SCORING_RULE_2: "Rétt úrslit",
      POINT: "stig",

      INVITE_CODE_TO_LEAGUE: "Boðskóði í deild",
      INVITE_CODE: "Boðskóði",
      SCORE: "stig",

      MATCHES_TIMEZONE_INFO: "Birtar tímasetningar eru í Greenwich Mean Time (GMT)",

      QUIZ_ALERT:
        "Svaraðu spurningum áður en mótið byrjar til að eiga möguleika á að fá bónus stig!",
      QUIZ_QUESTION_1: "Hvaða þjóð vinnur EM?",
      QUIZ_QUESTION_2: "Hvaða þjóð lendir í öðru sæti?",
      QUIZ_QUESTION_3: "Hvaða þjóð skorar flest mörk?",
      QUIZ_QUESTION_4: "Hvaða þjóð fær á sig flest mörk?",
      HOME: "Heimalið",
      PREDICTION: "Spá",
      RESULT: "Úrslit",
      AWAY: "Útilið",
      ANSWER: "Svar",
      SELECT_A_TEAM: "Veldu lið",

      GROUP: "Riðill",

      EMAIL: "Netfang",
      PASSWORD: "Lykilorð",
      NAME: "Nafn",
      LOGOUT: "Útskrá",
      FORGOT_PASSWORD: "Gleymt lykilorð?",
      LOGIN_BUTTON: "Skrá inn",
      SIGNUP_FORM_LOGIN: "Viltu frekar skrá þig inn?",
      LOGIN_FORM_SIGNUP: "Viltu frekar stofna aðgang?",
      CREATE_ACCOUNT_TITLE: "Stofnaðu aðgang",
      CREATE_ACCOUNT_SUBTITLE: "þú getur svo búið til deild og boðið vinum þínum!",
      CREATE: "Stofna",
      CANCEL: "Hætta við",
      UPDATE: "Vista",
      DELETE: "Eyða",
      REQUEST_SUBMITTED: "Beiðni send",
      RESET_PASSWORD_INSTRUCTIONS:
        "Ef að netfangið þitt er skráð í kerfið, færð þú sendar leiðbeiningar til að endurstilla lykilorðið þitt von bráðar.",
      SEND_RESET_PASSWORD_INSTRUCTIONS: "Senda endurstillingar leiðbeiningar",
    },
  },
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "is",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
