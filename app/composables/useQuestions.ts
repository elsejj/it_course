export interface Question {
  id: number
  qid: number
  kind: string
  title: string
  options: {
    label: string
    value: string
  }[] | null,
  area?: string
  year?: number
  userAnswer?: string
  answer?: string
}

const CH_SCORE = 2

const TF_SCORE = 2

export const useQuestions = () => {
  const getQuestion = async (id: number): Promise<Question> => {
    return await $fetch<Question>('/api/question', {
      query: { id }
    })
  }

  const getRandomQuestions = async (ch: number, tf: number): Promise<Question[]> => {
    const questions = await $fetch<any[]>('/api/questions', {
      query: { ch, tf }
    })
    const sorted = questions.sort((a, b) => {
      const c = a.kind.localeCompare(b.kind)
      if (c === 0) return a.qid - b.qid
      return c
    })
    return sorted.map(q => ({ ...q, userAnswer: '', options: JSON.parse(q.options) }))
  }

  const submitAnswers = async (questions: Question[]): Promise<{ total: number, score: number }> => {

    const { total, score } = questions.reduce((acc, q) => {
      const currentScore = q.kind === 'CH' ? CH_SCORE : TF_SCORE
      acc.total += currentScore
      if (q.userAnswer && q.answer && q.userAnswer === q.answer) {
        acc.score += currentScore
      }
      return acc
    }, { total: 0, score: 0 })

    try {
      await $fetch('/api/notify', {
        method: 'POST',
        body: { total, score }
      })
    } catch (error) {
      console.log("notify error: ", error)
    }

    return { total, score }

  }

  return {
    getQuestion,
    getRandomQuestions,
    submitAnswers
  }
}
