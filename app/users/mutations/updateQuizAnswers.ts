import { resolver } from "@blitzjs/rpc"
import db from "db"
import * as z from "zod"

const UpdateQuizAnswer = z.object({
  quizQuestionId: z.string(),
  answer: z.string(),
})

const updateQuizAnswer = resolver.pipe(
  resolver.zod(UpdateQuizAnswer),
  resolver.authorize(),
  async (input, ctx) => {
    await db.quizQuestion.update({
      where: {
        id: input.quizQuestionId,
      },
      data: {
        UserQuizQuestion: {
          upsert: {
            create: {
              userId: ctx.session.userId,
              answer: input.answer,
            },
            update: {
              userId: ctx.session.userId,
              answer: input.answer,
            },
            where: {
              userId_quizQuestionId: {
                quizQuestionId: input.quizQuestionId,
                userId: ctx.session.userId,
              },
            },
          },
        },
      },
    })
  }
)

export default updateQuizAnswer
