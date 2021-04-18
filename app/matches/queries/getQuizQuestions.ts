import { resolver } from "blitz"
import db from "db"

export default resolver.pipe(resolver.authorize(), async (_, ctx) => {
  const quizQuestions = await db.quizQuestion.findMany({
    include: {
      UserQuizQuestion: true,
      translations: true,
    },
  })

  return quizQuestions.filter((q) => q.deadlineAt === null || q.deadlineAt > new Date())
})
