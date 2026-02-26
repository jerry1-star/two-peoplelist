<template>
  <div class="min-h-screen bg-[#111022] flex flex-col items-center justify-center text-center px-6">
    <AppIcon name="error" class="w-5 h-5" />
    <h1 class="text-6xl font-black text-white mb-4">404</h1>
    <p class="text-slate-400 text-lg mb-8">页面不存在，可能已被删除或链接有误</p>
    <RouterLink to="/" class="bg-[#3625f4] hover:bg-[#2d1fd4] text-white px-8 py-3 rounded-xl font-bold transition-all neon-glow">
      返回首页
    </RouterLink>
  </div>
</template>
