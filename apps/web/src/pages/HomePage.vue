<script setup lang="ts">
import { onMounted, ref } from 'vue'
import client from '@/api/client'
import type { Banner } from '@renren/shared'

const banners = ref<Banner[]>([])

onMounted(async () => {
  try {
    const res = await client.get<void, Banner[]>('/banners?position=HOME_TOP')
    banners.value = res ?? []
  } catch { /* ignore */ }
})
</script>

<template>
  <!-- Hero Section -->
  <section class="relative pt-20 pb-16 px-6 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <div class="absolute top-1/4 -left-20 w-96 h-96 rounded-full blur-[120px]" style="background: rgba(54, 37, 244, 0.2)"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px]" style="background: rgba(147, 51, 234, 0.1)"></div>
    </div>
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="flex flex-col items-center text-center gap-8">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style="background: rgba(54, 37, 244, 0.1); border: 1px solid rgba(54, 37, 244, 0.2); color: #3625f4">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3625f4] opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-[#3625f4]"></span>
          </span>
          未来已来 · 独立创作者首选
        </div>
        <h1 class="text-5xl md:text-7xl font-black text-white leading-tight">
          用 AI 开启你的<br />
          <span class="text-transparent bg-clip-text" style="background-image: linear-gradient(to right, #3625f4, #a855f7)">个人商业帝国</span>
        </h1>
        <p class="text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed">
          专为独立创作者打造的一站式 AI 学习与商业增长平台。从 0 到 1 掌握大模型，重塑你的个人价值与效率上限。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 mt-4">
          <RouterLink
            to="/learning"
            class="bg-[#3625f4] hover:bg-[#2d1fd4] text-white px-10 py-4 rounded-xl text-lg font-bold transition-all flex items-center gap-2 group"
            style="box-shadow: 0 0 20px rgba(54, 37, 244, 0.4)"
          >
            立即开始
            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
          <RouterLink
            to="/learning"
            class="glass-card hover:bg-white/10 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all"
          >
            查看学习路径
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Banner Section (if any active banners) -->
  <section v-if="banners.length" class="max-w-7xl mx-auto px-6 pb-8">
    <div class="grid gap-4">
      <a
        v-for="banner in banners"
        :key="banner.id"
        :href="banner.link ?? '#'"
        class="block rounded-xl overflow-hidden"
      >
        <img :src="banner.imageUrl" alt="Banner" class="w-full h-48 object-cover" />
      </a>
    </div>
  </section>

  <!-- Latest AI News -->
  <section class="max-w-7xl mx-auto px-6 py-16">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold text-white flex items-center gap-3">
        <svg class="w-7 h-7 text-[#3625f4]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"/></svg>
        最新 AI 资讯
      </h2>
      <RouterLink to="/forum" class="text-[#3625f4] font-medium hover:underline flex items-center gap-1">
        查看全部
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
      </RouterLink>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <RouterLink
        v-for="(item, i) in newsItems"
        :key="i"
        :to="item.link"
        class="glass-card rounded-xl overflow-hidden group hover:border-[#3625f4]/50 transition-all cursor-pointer"
      >
        <div class="h-48 overflow-hidden relative" :style="{ background: item.bgColor }">
          <div class="w-full h-full flex items-center justify-center">
            <span class="text-7xl opacity-30 select-none">{{ item.emoji }}</span>
          </div>
          <div :class="item.tagClass" class="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold text-white uppercase">
            {{ item.tag }}
          </div>
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-white mb-3 group-hover:text-[#3625f4] transition-colors">{{ item.title }}</h3>
          <p class="text-slate-400 text-sm leading-relaxed mb-4">{{ item.desc }}</p>
          <div class="flex items-center gap-3 border-t border-white/5 pt-4">
            <div class="size-8 rounded-full bg-[#3625f4]/20 flex items-center justify-center text-xs text-[#3625f4] font-bold">
              {{ item.author[0] }}
            </div>
            <div class="text-xs">
              <p class="text-slate-200 font-bold">{{ item.author }}</p>
              <p class="text-slate-500">{{ item.time }}</p>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>

  <!-- Core Modules -->
  <section class="py-20 px-6" style="background: rgba(54, 37, 244, 0.05)">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-white mb-4">核心赋能模块</h2>
        <p class="text-slate-400">系统化的路径，实战化的工具，闭环化的商业落地</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(mod, i) in coreModules"
          :key="i"
          :class="['glass-card p-8 rounded-2xl transition-colors group', i === 1 ? 'border-[#3625f4]/30 bg-[#3625f4]/10' : 'hover:bg-[#3625f4]/10']"
        >
          <div
            :class="['size-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-2xl', i === 1 ? 'bg-[#3625f4] neon-glow' : 'bg-[#3625f4]/20']"
          >
            {{ mod.emoji }}
          </div>
          <h3 class="text-2xl font-bold text-white mb-3">{{ mod.title }}</h3>
          <p class="text-slate-400 mb-6">{{ mod.desc }}</p>
          <ul class="space-y-3 mb-8">
            <li v-for="item in mod.features" :key="item" class="flex items-center gap-2 text-sm text-slate-300">
              <svg class="w-4 h-4 text-[#3625f4] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/></svg>
              {{ item }}
            </li>
          </ul>
          <RouterLink :to="mod.link" class="inline-flex items-center gap-2 text-[#3625f4] font-bold group-hover:gap-3 transition-all">
            {{ mod.cta }}
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Community Section -->
  <section class="max-w-7xl mx-auto px-6 py-24">
    <div class="glass-card rounded-[2rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative">
      <div class="absolute top-0 right-0 p-8 opacity-5 text-[12rem] leading-none select-none">💬</div>
      <div class="flex-1 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
          不只是平台，<br />更是你的<span class="text-[#3625f4]">智囊团</span>
        </h2>
        <p class="text-slate-400 text-lg mb-8">
          加入超过 50,000+ 位像你一样的 AI 创作者社群。在这里，没有废话，只有实操与共赢。
        </p>
        <RouterLink
          to="/forum"
          class="inline-flex items-center gap-2 bg-[#3625f4] hover:bg-[#2d1fd4] text-white px-8 py-3 rounded-xl font-bold transition-all neon-glow"
        >
          进入社群
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/></svg>
        </RouterLink>
      </div>
      <div class="flex-1 grid grid-cols-2 gap-4 w-full">
        <div class="bg-white/5 p-5 rounded-2xl border border-white/5">
          <p class="text-xs text-[#3625f4] font-bold mb-2 uppercase">热门讨论</p>
          <RouterLink to="/forum" class="block text-sm text-white font-medium mb-4 hover:text-[#3625f4] transition-colors"># 如何用 ChatGPT 写出千万爆款文案？</RouterLink>
          <div class="flex items-center gap-2 text-[10px] text-slate-500">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
            12k
            <svg class="w-3 h-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"/></svg>
            482
          </div>
        </div>
        <div class="bg-white/5 p-5 rounded-2xl border border-white/5 mt-8">
          <p class="text-xs text-purple-400 font-bold mb-2 uppercase">资源共享</p>
          <RouterLink to="/forum" class="block text-sm text-white font-medium mb-4 hover:text-[#3625f4] transition-colors">整理了 200 个 Midjourney 垂直风格词库包</RouterLink>
          <div class="flex items-center gap-2 text-[10px] text-slate-500">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            3.4k
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
const newsItems = [
  {
    emoji: '🧠',
    bgColor: 'linear-gradient(135deg, #1a1a3e 0%, #2d1b69 100%)',
    tag: '行业趋势',
    tagClass: 'bg-[#3625f4]',
    title: 'AI 赋能个人品牌：2024 新范式',
    desc: '专家点评：AI 正在重塑内容分发逻辑，个人创作者需要掌握"Prompt 架构师"思维，而非仅仅是使用工具...',
    author: '老沈 (资深产品专家)',
    time: '3小时前发布',
    link: '/forum',
  },
  {
    emoji: '🌐',
    bgColor: 'linear-gradient(135deg, #1a1a3e 0%, #4a1d96 100%)',
    tag: '深度解析',
    tagClass: 'bg-purple-600',
    title: '大模型时代下的副业变现机会',
    desc: '分析如何利用 LLM 提高 10x 生产效率，并锁定 3 个目前竞争最小、天花板最高的 AI 内容赛道...',
    author: 'Emma (AI研究员)',
    time: '5小时前发布',
    link: '/forum',
  },
  {
    emoji: '📱',
    bgColor: 'linear-gradient(135deg, #1a1a3e 0%, #064e3b 100%)',
    tag: '工具推荐',
    tagClass: 'bg-green-600',
    title: '2024 AI 效率工具全景地图',
    desc: '精选 100+ 提升生产力的神器，涵盖文本、图片、音视频及自动化工作流，告别工具焦虑...',
    author: '阿强 (流程架构师)',
    time: '8小时前发布',
    link: '/tools',
  },
]

const coreModules = [
  {
    emoji: '🗺️',
    title: 'AI 学习路径',
    desc: '从零基础到 AI 提示词专家，结构化课程体系带你通关。',
    features: ['基础大模型原理', '进阶 Prompt 工程', '垂直领域落地实战'],
    link: '/learning',
    cta: '开始学习',
  },
  {
    emoji: '🔧',
    title: 'AI 工具库',
    desc: '全球精选 AI 生产力工具雷达，一键对比与推荐最适合你的神器。',
    features: ['每日更新工具榜单', '独家内测邀请码', '使用教程与场景案例'],
    link: '/tools',
    cta: '探索工具',
  },
  {
    emoji: '✨',
    title: '成功案例',
    desc: '真实可复制的个人 AI 商业闭环，看先行者是如何赚到第一桶金的。',
    features: ['复盘拆解复利逻辑', '变现路径深度揭秘', '专属陪跑社群资源'],
    link: '/cases',
    cta: '学习案例',
  },
]
</script>
