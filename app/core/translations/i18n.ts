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
      SCORING_TOTAL: "Maximum",
      POINT: "point",

      INVITE_CODE_TO_LEAGUE: "Invite code to league",
      INVITE_CODE: "Invite code",
      SCORE: "points",

      REMOVE_USER_FROM_LEAGUE_MODAL_TITLE: "Remove user from league",
      REMOVE_USER_FROM_LEAGUE_MODAL_DESCRIPTION:
        "Are you sure? You can't undo this action afterwards.",

      DELETE_LEAGUE_MODAL_TITLE: "Delete league",
      DELETE_LEAGUE_MODAL_DESCRIPTION: "Are you sure? You can't undo this action afterwards.",

      MATCHES_TIMEZONE_INFO: "Displayed kickoffs are in Greenwich Mean Time (GMT)",
      SHOW_PREDICTED_MATCHES: "Predicted matches",
      SHOW_PAST_MATCHES: "Past matches",
      RANDOM_GENERATE_PREDICTIONS: "Randomise unpredicted matches",
      RANDOM_GENERATE_MODAL_TITLE: "Random prediction",
      RANDOM_GENERATE_MODAL_DESCRIPTION: "Gisk will predict your unpredicted matches, one time.",

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
      TODAY: "Today",

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
      CONFIRM: "Confirm",
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
      WELCOME_DESCRIPTION: "Kepptu vi?? vini ????na! Hver er f??tboltasnillingurinn ?? h??pnum ????num?",
      WELCOME_LOGIN: "N?? ??egar me?? a??gang?",
      WELCOME_SIGNUP: "Stofna a??gang",
      WELCOME_FREE: "??a?? er 100% fr??tt",

      LEAGUES: "Deildir",
      MATCHES: "Leikir",
      TEAMS: "Li??",
      ADMIN: "Stj??rnbor??",
      SETTINGS: "Stillingar",
      BUY_ME_A_COFFEE: "Viltu spl??sa ?? kaffi?",
      SCORE_UPDATED_TITLE: "T??kst!",
      SCORE_UPDATED_ERROR: "??ps.",
      SCORE_NON_NEGATIVE: "Sp?? m?? ekki vera neikv????",
      SCORE_UPDATED: "Sp?? uppf??r??",

      NEW_LEAGUE: "N?? deild",
      NEW_LEAGUE_JOIN: "Skr??ning ?? deild",
      JOIN_LEAGUE_MODAL: "Skr??ning ?? deild",
      LEAGUE_NAME: "Nafn deildar",
      GOT_AN_INVITE: "Ertu me?? bo?? ?? deild?",
      SCORING: "Stigagj??f",
      SCORING_RULE_1: "R??tt sigurli?? (1X2)",
      SCORING_RULE_2: "R??tt ??rslit",
      SCORING_TOTAL: "H??mark",
      POINT: "stig",

      INVITE_CODE_TO_LEAGUE: "Bo??sk????i ?? deild",
      INVITE_CODE: "Bo??sk????i",
      SCORE: "stig",
      REMOVE_USER_FROM_LEAGUE_MODAL_TITLE: "Fjarl??gja notanda ??r deild",
      REMOVE_USER_FROM_LEAGUE_MODAL_DESCRIPTION: "Ertu viss? ???? getur ekki teki?? ??etta til baka.",
      DELETE_LEAGUE_MODAL_TITLE: "Ey??a deild",
      DELETE_LEAGUE_MODAL_DESCRIPTION: "Ertu viss? ???? getur ekki teki?? ??etta til baka.",

      MATCHES_TIMEZONE_INFO: "Birtar t??masetningar eru ?? Greenwich Mean Time (GMT)",
      SHOW_PREDICTED_MATCHES: "Sp????ir leikir",
      SHOW_PAST_MATCHES: "Fort????ar leikir",
      RANDOM_GENERATE_PREDICTIONS: "Setja inn sj??lfvirka sp?? fyrir ??sp????a leiki",
      RANDOM_GENERATE_MODAL_TITLE: "Sj??lfvirk sp??",
      RANDOM_GENERATE_MODAL_DESCRIPTION:
        "Gisk mun b??a til sp?? fyrir ??sp????a leiki hj?? ????r, ?? eitt skipti.",
      QUIZ_ALERT:
        "Svara??u spurningum ????ur en m??ti?? byrjar til a?? eiga m??guleika ?? a?? f?? b??nus stig!",
      QUIZ_QUESTION_1: "Hva??a ??j???? vinnur EM?",
      QUIZ_QUESTION_2: "Hva??a ??j???? lendir ?? ????ru s??ti?",
      QUIZ_QUESTION_3: "Hva??a ??j???? skorar flest m??rk?",
      QUIZ_QUESTION_4: "Hva??a ??j???? f??r ?? sig flest m??rk?",
      HOME: "Heimali??",
      PREDICTION: "Sp??",
      RESULT: "??rslit",
      AWAY: "??tili??",
      ANSWER: "Svar",
      SELECT_A_TEAM: "Veldu li??",

      GROUP: "Ri??ill",
      TODAY: "?? dag",

      EMAIL: "Netfang",
      PASSWORD: "Lykilor??",
      NAME: "Nafn",
      LOGOUT: "??tskr??",
      FORGOT_PASSWORD: "Gleymt lykilor???",
      LOGIN_BUTTON: "Skr?? inn",
      SIGNUP_FORM_LOGIN: "Viltu frekar skr?? ??ig inn?",
      LOGIN_FORM_SIGNUP: "Viltu frekar stofna a??gang?",
      CREATE_ACCOUNT_TITLE: "Stofna??u a??gang",
      CREATE_ACCOUNT_SUBTITLE: "???? getur svo b??i?? til deild og bo??i?? vinum ????num!",
      CREATE: "Stofna",
      CANCEL: "H??tta vi??",
      UPDATE: "Vista",
      DELETE: "Ey??a",
      CONFIRM: "Sta??festa",
      REQUEST_SUBMITTED: "Bei??ni send",
      RESET_PASSWORD_INSTRUCTIONS:
        "Ef a?? netfangi?? ??itt er skr???? ?? kerfi??, f??r?? ???? sendar lei??beiningar til a?? endurstilla lykilor??i?? ??itt von br????ar.",
      SEND_RESET_PASSWORD_INSTRUCTIONS: "Senda endurstillingar lei??beiningar",
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
