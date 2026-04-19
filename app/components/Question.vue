<script setup lang="ts">

import type { Question } from '@/composables/useQuestions'

const props = defineProps<{
  question: Question,
  showAnswer?: boolean
}>()



const answer = ref<string>()

const emit = defineEmits<{
  "answer-changed": [qid: number, answer: string]
}>()

const parsedOptions = computed(() => {
  // If TF (True/False), use fixed options
  if (props.question.kind === 'TF') {
    return [
      { label: '√ 对', value: `T`},
      { label: '× 错', value: `F` }
    ]
  }

  // If CH (Choice), parse options from string
  if (!props.question.options) return []
  return props.question.options.map((opt: any, index: number) => {
        const label = `${opt.label} ${opt.value}`
        const value = opt.label
        
        return { 
          label,
          value
        }
      })

})

// Emit the selected value when it changes
watch(answer, (val) => {
  if (val) {
    emit('answer-changed', props.question.qid, val)
  }
})



</script>

<template>
  <UCard 
    class="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-500 hover:shadow-2xl border-none ring-1 ring-gray-200 dark:ring-gray-800"
    :ui="{
      root: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
      header: 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800',
      footer: 'bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800'
    }"
  >
    <template #header>
      <div class="flex gap-2 p-1 flex-col">
        <div 
          class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg w-fit"
          :class="question.kind === 'CH' ? 'bg-primary-500 shadow-primary-500/20' : 'bg-neutral-600 shadow-neutral-500/20'"
        >
          {{ question.kind === 'CH' ? `选择题 ${question.qid}` : `判断题 ${question.qid}` }}
        </div>
      <MDC :value="question.title" />
      </div>
    </template>

    <div class="p-6">
      <URadioGroup
        :name="`question-${question.qid}`"
        v-model="answer"
        :items="parsedOptions"
        variant="table"
        color="primary"
        class="w-full"
      >
      </URadioGroup>
    </div>

    <template #footer v-if="showAnswer">
        <div>
          <UBadge :label="question.answer === answer ? '正确' : '错误'" :color="question.answer === answer ? 'success' : 'error'" variant="soft" class="mb-4" />
          <pre class="text-gray-900 dark:text-white">正确答案: {{ question.answer }}</pre>
        </div>
    </template>

  </UCard>
</template>
