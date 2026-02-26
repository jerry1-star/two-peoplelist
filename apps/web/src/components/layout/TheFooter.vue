<template>
  <footer class="bg-black/50 border-t border-white/5 py-16 px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div class="col-span-1">
        <div class="flex items-center gap-3 text-[#3625f4] mb-6">
          <AppIcon name="rocket_launch" class="w-5 h-5" />
          <h2 class="text-lg font-bold tracking-tight text-white uppercase">PE Expert</h2>
        </div>
        <p class="text-slate-500 text-sm leading-relaxed mb-6">
          人人都是产品专家。在这个由算法定义的时代，重新定义你自己的商业边界。
        </p>
      </div>
      <div>
        <h4 class="text-white font-bold mb-6">平台内容</h4>
        <ul class="space-y-4 text-sm text-slate-500">
          <li><RouterLink to="/learning" class="hover:text-[#3625f4] transition-colors">课程体系</RouterLink></li>
          <li><RouterLink to="/tools" class="hover:text-[#3625f4] transition-colors">工具库</RouterLink></li>
          <li><RouterLink to="/cases" class="hover:text-[#3625f4] transition-colors">成功案例</RouterLink></li>
          <li><RouterLink to="/forum" class="hover:text-[#3625f4] transition-colors">社群论坛</RouterLink></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold mb-6">社区互动</h4>
        <ul class="space-y-4 text-sm text-slate-500">
          <li><RouterLink to="/forum" class="hover:text-[#3625f4] transition-colors">问答论坛</RouterLink></li>
          <li><a href="#" class="hover:text-[#3625f4] transition-colors">私享社群</a></li>
          <li><a href="#" class="hover:text-[#3625f4] transition-colors">线下沙龙</a></li>
        </ul>
      </div>
      <div>
        <h4 class="text-white font-bold mb-6">订阅简报</h4>
        <p class="text-slate-500 text-sm mb-4">获取最新的 AI 商业周报，直达邮箱。</p>
        <div class="flex gap-2">
          <input class="bg-white/5 border border-white/10 rounded-lg text-sm px-4 py-2 w-full focus:outline-none focus:border-[#3625f4] text-white placeholder:text-slate-500" placeholder="Email 地址" type="email" />
          <button class="bg-[#3625f4] px-4 py-2 rounded-lg text-white font-bold text-sm hover:bg-[#2d1fd4] transition-colors">订阅</button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
      <p>© 2024 人人都是产品专家. All Rights Reserved.</p>
      <div class="flex gap-6">
        <a class="hover:text-slate-400" href="#">隐私政策</a>
        <a class="hover:text-slate-400" href="#">服务条款</a>
        <a class="hover:text-slate-400" href="#">商务合作</a>
      </div>
    </div>
  </footer>
</template>
