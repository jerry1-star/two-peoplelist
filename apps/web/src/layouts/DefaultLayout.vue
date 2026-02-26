<script setup lang="ts">
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col bg-[#111022] text-slate-100">
    <TheHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>
