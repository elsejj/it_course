import { questions } from '../db/schema'
import { eq, sql } from 'drizzle-orm'
import { db } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const chCount = Number(query.ch) || 0
  const tfCount = Number(query.tf) || 0

  if (chCount <= 0 && tfCount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Please provide at least one count (ch or tf) greater than 0'
    })
  }

  const results = []

  // Fetch random Choice questions
  if (chCount > 0) {
    const chList = await db.select()
      .from(questions)
      .where(eq(questions.kind, 'CH'))
      .orderBy(sql`RANDOM()`)
      .limit(chCount)
    results.push(...chList)
  }

  // Fetch random True/False questions
  if (tfCount > 0) {
    const tfList = await db.select()
      .from(questions)
      .where(eq(questions.kind, 'TF'))
      .orderBy(sql`RANDOM()`)
      .limit(tfCount)
    results.push(...tfList)
  }

  // Shuffle the final list to mix types
  return results.sort(() => Math.random() - 0.5)
})
