<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { charset: 'UTF-8'}
  ],
  title: 'LYZ的IT通识',
  link: [
    { rel: 'icon', href: '/favicon.png' }
  ]
})

</script>

<template>
  <UApp>
    <UHeader title="">
      <div>
        LYZ的IT通识 (题库: 天津 2025)
      </div>
    </UHeader>
    <UMain>
      <NuxtPage />
    </UMain>

  </UApp>
</template>
