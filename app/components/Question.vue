<script setup lang="ts">

import type { Question } from '@/composables/useQuestions'
import { snapdom } from '@zumer/snapdom';


const props = defineProps<{
  question: Question,
  showAnswer?: boolean
}>()

const toast = useToast()


const answer = ref<string>()
const questionNode = useTemplateRef('questionNode')

const emit = defineEmits<{
  "answer-changed": [qid: number, answer: string]
}>()

const parsedOptions = computed(() => {
  // If TF (True/False), use fixed options
  if (props.question.kind === 'TF') {
    return [
      { label: '对', value: `T`},
      { label: '错', value: `F` }
    ]
  }

  // If CH (Choice), parse options from string
  if (!props.question.options) return []
  return props.question.options.map((opt: any, index: number) => {
        const label = `${opt.value}`
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

async function copyQuestion(){
  const q = props.question
  const image_tag = '![](media'
  let content: string
  if (q.title.includes(image_tag) || parsedOptions.value.find(opt => opt.label.includes(image_tag))){
    const node = questionNode.value?.$el as HTMLElement
    const img = await snapdom.toBlob(node, {
      type: 'png',
      quality: 0.9,
    })
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': img })])
      toast.add({ title: '复制成功！在AI应用中粘贴来详细解析', color: 'success' })
    } catch (error) {
      toast.add({ title: '复制失败！', color: 'error' })
      console.error(error)
    }
  }else{
    content = `请分析一下这道题的, 正确答案是${q.answer}, 而我选了${q.userAnswer}, 哪里错了?

## 题目
${q.title}

## 选项
${parsedOptions.value.map(opt => opt.value + ":" + opt.label).join('\n')}

  `
    try {
      await navigator.clipboard.writeText(content)
      toast.add({ title: '复制成功！在AI应用中粘贴来详细解析', color: 'success' })
    } catch (error) {
      toast.add({ title: '复制失败！', color: 'error' })
    }
  }
  
}

</script>

<template>
  <UCard 
    class="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-500 hover:shadow-2xl border-none ring-1 ring-gray-200 dark:ring-gray-800"
    :ui="{
      root: 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl',
      header: 'bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-100 dark:border-gray-800',
      footer: 'bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800'
    }"
    ref="questionNode"
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
        <template #label="{ item }">
          <div class="flex gap-1">
            <div>{{ item.value }}</div>
            <MDC :value="item.label" v-if="item.label.includes('![](media') || item.label.includes('\\n')" />
            <div v-else>{{ item.label }}</div>
          </div>
        </template>
      </URadioGroup>
    </div>

    <template #footer v-if="showAnswer">
        <div class="flex gap-4 justify-end items-center">
          <UBadge :label="question.answer === answer ? '正确' : '错误'" :color="question.answer === answer ? 'success' : 'error'" variant="soft" />
          <pre class="text-gray-900 dark:text-white">正确答案: {{ question.answer }}</pre>
          <UButton @click="copyQuestion" color="secondary" variant="outline">复制问题去问问AI</UButton>
        </div>
    </template>

  </UCard>
</template>
