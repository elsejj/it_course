import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const questions = sqliteTable('questions', {
  qid: integer().primaryKey({ autoIncrement: true }),
  id: integer(),
  kind: text(),
  title: text(),
  options: text(),
  area: text(),
  year: integer(),
  answer: text()
})
