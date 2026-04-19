import { questions } from '../db/schema'
import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'


export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)

  if (!query.id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'A valid numeric ID parameter is required'
    })
  }


  const result = await db.query.questions.findFirst({
    where: eq(questions.id, id)
  })

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: `Question with id ${id} not found`
    })
  }

  return result
})
