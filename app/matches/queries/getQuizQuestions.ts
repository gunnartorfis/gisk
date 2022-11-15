import { z } from "zod"
import { resolver } from "blitz"
import db from "db"

const GetQuizQuestionsInput = z.object({
  userId: z.optional(z.string()),
})


export default resolver.pipe(resolver.zod(GetQuizQuestionsInput), resolver.authorize(), async ({ userId }, ctx) => {
  const idToFetch = userId || ctx.session.userId;
  const quizQuestions = await db.quizQuestion.findMany({
    include: {
      UserQuizQuestion: true,
      translations: true,
    },
  })

  const userQuizQuestions = quizQuestions.map(q => ({ ...q, UserQuizQuestion: q.UserQuizQuestion.filter(a => a.userId === idToFetch) }))

  return userQuizQuestions.filter((q) => q.deadlineAt === null || q.deadlineAt > new Date())
})
