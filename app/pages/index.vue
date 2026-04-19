<script setup lang="ts">
const { getRandomQuestions, submitAnswers } = useQuestions()

// Fetching 10 Choice and 5 T/F questions randomly
const { data: questions, error, refresh, status } = await useAsyncData('random-questions', () => getRandomQuestions(10, 5))


const markingResult = ref<{total: number, score: number, marked: boolean} >({total: 0, score: 0, marked: false})

async function handleSubmit() {
  console.log("test handleSubmit", questions.value)
  const result = await submitAnswers(questions.value!)
  markingResult.value = {
    total: result.total,
    score: result.score,
    marked: true,
  }
  document.getElementById("question_list")!.scrollIntoView({ behavior: "smooth" })
}

watch(questions, (val) => {
  markingResult.value = {total: 0, score: 0, marked: false}
  document.getElementById("question_list")!.scrollIntoView({ behavior: "smooth" })
})

</script>

<template>
  <UContainer class="py-8">
    <header>
      <div class="flex items-end justify-end gap-4">
        <UButton 
          size="md"
          icon="i-lucide-refresh-cw" 
          variant="solid" 
          color="secondary" 
          :loading="status === 'pending'"
          class="rounded-2xl px-8 shadow-lg shadow-primary-500/20"
          @click="async () => {
            await refresh()
          }"
        >
          换一批
        </UButton>
        <UButton
          label="交卷"
          size="md"
          icon="i-lucide-check"
          variant="solid"
          color="primary"
          class="rounded-2xl px-8 shadow-lg shadow-primary-500/20"
          @click="handleSubmit"
        >
          交卷
        </UButton>
      </div>
    </header>
    <div v-if="markingResult.marked" class="max-w-3xl mx-auto space-y-8 mt-3">
      <UAlert 
        icon="i-lucide-check-circle" 
        color="success" 
        variant="soft" 
        title="批改完成"
        :description="`您的分数是: ${markingResult.score}/${markingResult.total}`"
        class="max-w-lg mx-auto p-6 rounded-3xl"
      />
    </div>
    <div class="max-w-3xl mx-auto space-y-16 mt-4" id="question_list">

      <!-- Questions List -->
      <div v-if="questions?.length" class="space-y-24">
        <div 
          v-for="(q, index) in questions" 
          :key="q.id" 
          class="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000"
          :style="{ animationDelay: `${index * 150}ms` }"
        >
          <!-- Item Divider -->
          <div class="flex items-center gap-6 px-4">
            <span class="text-4xl font-black text-gray-100 dark:text-gray-800 italic select-none">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
          </div>

          <!-- Component -->
          <Question :question="q" :show-answer="markingResult.marked"  @answer-changed='(_, answer) => {q.userAnswer = answer}'/>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-20 text-center" >
        <UAlert 
          icon="i-lucide-alert-triangle" 
          color="error" 
          variant="soft" 
          title="数据库连接错误" 
          :description="error.message"
          class="max-w-lg mx-auto p-6 rounded-3xl"
        />
        <div class="mt-8">
          <UButton variant="link" color="primary" @click="async () => {
              await refresh()
            }">重新获取</UButton>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="status !== 'pending'" class="text-center py-32 space-y-4">
        <UIcon name="i-lucide-database-zap" class="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" />
        <p class="text-xl font-medium text-gray-400 italic">No questions matched your criteria.</p>
      </div>

    </div>
    <div class="flex items-end justify-end gap-4 mt-4">
      <UButton 
        size="md"
        icon="i-lucide-refresh-cw" 
        variant="solid" 
        color="secondary" 
        :loading="status === 'pending'"
        class="rounded-2xl px-8 shadow-lg shadow-primary-500/20"
        @click="async () => {
          await refresh()
        }"
      >
        换一批
      </UButton>
      <UButton
        label="交卷"
        size="md"
        icon="i-lucide-check"
        variant="solid"
        color="primary"
        class="rounded-2xl px-8 shadow-lg shadow-primary-500/20"
        @click="handleSubmit"
      >
        交卷
      </UButton>
    </div>
  </UContainer>
</template>

<style scoped>
/* Page-level transitions and smooth scroll */
html {
  scroll-behavior: smooth;
}
</style>
