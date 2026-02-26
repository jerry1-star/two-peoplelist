import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始 Seed...')

  // ─── 权限 ──────────────────────────────────────────────────────────────────
  const permissions = await Promise.all([
    prisma.permission.upsert({ where: { resource_action: { resource: 'users', action: 'read' } }, update: {}, create: { resource: 'users', action: 'read', description: '查看用户' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'users', action: 'manage' } }, update: {}, create: { resource: 'users', action: 'manage', description: '管理用户' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'posts', action: 'read' } }, update: {}, create: { resource: 'posts', action: 'read', description: '查看帖子' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'posts', action: 'write' } }, update: {}, create: { resource: 'posts', action: 'write', description: '发布帖子' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'posts', action: 'review' } }, update: {}, create: { resource: 'posts', action: 'review', description: '审核帖子' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'posts', action: 'manage' } }, update: {}, create: { resource: 'posts', action: 'manage', description: '管理帖子' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'courses', action: 'read' } }, update: {}, create: { resource: 'courses', action: 'read', description: '查看课程' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'courses', action: 'manage' } }, update: {}, create: { resource: 'courses', action: 'manage', description: '管理课程' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'tools', action: 'manage' } }, update: {}, create: { resource: 'tools', action: 'manage', description: '管理工具' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'cases', action: 'manage' } }, update: {}, create: { resource: 'cases', action: 'manage', description: '管理案例' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'banners', action: 'manage' } }, update: {}, create: { resource: 'banners', action: 'manage', description: '管理 Banner' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'categories', action: 'manage' } }, update: {}, create: { resource: 'categories', action: 'manage', description: '管理分类' } }),
    prisma.permission.upsert({ where: { resource_action: { resource: 'dashboard', action: 'read' } }, update: {}, create: { resource: 'dashboard', action: 'read', description: '查看数据看板' } }),
  ])

  console.log(`✅ 创建了 ${permissions.length} 个权限`)

  // ─── 角色 ──────────────────────────────────────────────────────────────────
  const superAdmin = await prisma.role.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: { name: 'super_admin', description: '超级管理员，拥有所有权限' },
  })

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: '管理员，拥有大部分管理权限' },
  })

  const moderator = await prisma.role.upsert({
    where: { name: 'moderator' },
    update: {},
    create: { name: 'moderator', description: '版主，可审核帖子和管理分类' },
  })

  const member = await prisma.role.upsert({
    where: { name: 'member' },
    update: {},
    create: { name: 'member', description: '普通会员' },
  })

  console.log('✅ 创建了 4 个角色')

  // 超级管理员拥有所有权限
  await prisma.rolePermission.deleteMany({ where: { roleId: superAdmin.id } })
  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({ roleId: superAdmin.id, permissionId: p.id })),
  })

  // admin 拥有除 users manage 以外的所有权限
  const adminPermissions = permissions.filter((p) => !(p.resource === 'users' && p.action === 'manage'))
  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } })
  await prisma.rolePermission.createMany({
    data: adminPermissions.map((p) => ({ roleId: adminRole.id, permissionId: p.id })),
  })

  // moderator 只有帖子审核和分类管理权限
  const modPermissions = permissions.filter(
    (p) => (p.resource === 'posts' && ['read', 'review'].includes(p.action)) ||
           (p.resource === 'categories' && p.action === 'manage'),
  )
  await prisma.rolePermission.deleteMany({ where: { roleId: moderator.id } })
  await prisma.rolePermission.createMany({
    data: modPermissions.map((p) => ({ roleId: moderator.id, permissionId: p.id })),
  })

  console.log('✅ 分配了权限矩阵')

  // ─── 超级管理员用户（手机号登录） ─────────────────────────────────────────
  const superAdminUser = await prisma.user.upsert({
    where: { phone: '18888888888' },
    update: {},
    create: {
      phone: '18888888888',
      nickname: '超级管理员',
      bio: '平台超级管理员',
    },
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superAdminUser.id, roleId: superAdmin.id } },
    update: {},
    create: { userId: superAdminUser.id, roleId: superAdmin.id },
  })

  // ─── admin 账号（用户名密码登录） ─────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash('123123', 10)
  const adminUser = await prisma.user.upsert({
    where: { phone: '19999999999' },
    update: { username: 'admin', passwordHash: adminPasswordHash, nickname: '管理员' },
    create: {
      phone: '19999999999',
      username: 'admin',
      passwordHash: adminPasswordHash,
      nickname: '管理员',
      bio: '平台管理员账号',
    },
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: superAdmin.id } },
    update: {},
    create: { userId: adminUser.id, roleId: superAdmin.id },
  })

  // moderator 账号
  const modPasswordHash = await bcrypt.hash('mod123456', 10)
  const modUser = await prisma.user.upsert({
    where: { phone: '17777777777' },
    update: { username: 'moderator', passwordHash: modPasswordHash, nickname: '版主小李' },
    create: {
      phone: '17777777777',
      username: 'moderator',
      passwordHash: modPasswordHash,
      nickname: '版主小李',
      bio: '社区版主',
    },
  })
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: modUser.id, roleId: moderator.id } },
    update: {},
    create: { userId: modUser.id, roleId: moderator.id },
  })

  console.log('✅ 创建管理账号: admin/123123, moderator/mod123456, 手机号 18888888888 (验证码 123456)')

  // ─── 普通用户假数据 ────────────────────────────────────────────────────────
  const normalUsers = [
    { phone: '13800138000', nickname: '产品小白', bio: '刚入门的产品新人，正在学习中' },
    { phone: '13800138001', nickname: '张产品', bio: '5年产品经理，专注 ToB 方向' },
    { phone: '13800138002', nickname: 'AI 探索者', bio: '热爱 AI 技术，每天研究新工具' },
    { phone: '13800138003', nickname: '李小红', bio: '内容创作者，用 AI 提升工作效率' },
    { phone: '13800138004', nickname: '王大锤', bio: '创业者，正在用 AI 搭建自己的产品' },
    { phone: '13800138005', nickname: '设计师老吴', bio: 'UI/UX 设计师，AI 绘图爱好者' },
    { phone: '13800138006', nickname: '程序员小陈', bio: '全栈开发，GitHub Copilot 重度用户' },
    { phone: '13800138007', nickname: '运营达人', bio: '新媒体运营，用 AI 写文案效率翻倍' },
    { phone: '13800138008', nickname: '市场营销专家', bio: '10年市场从业，探索 AI 营销新方式' },
    { phone: '13800138009', nickname: '教育从业者', bio: '在线教育产品，研究 AI 教学应用' },
  ]

  const createdUsers: { id: string }[] = []
  for (const u of normalUsers) {
    const user = await prisma.user.upsert({
      where: { phone: u.phone },
      update: {},
      create: u,
    })
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: user.id, roleId: member.id } },
      update: {},
      create: { userId: user.id, roleId: member.id },
    })
    createdUsers.push(user)
  }
  console.log(`✅ 创建了 ${createdUsers.length} 个普通用户`)

  // ─── 论坛分类 ──────────────────────────────────────────────────────────────
  const categoryData = [
    { name: 'AI 工具讨论', description: '分享和讨论各类 AI 工具的使用技巧与心得', sortOrder: 0 },
    { name: '学习交流', description: '产品经理学习路径、资源推荐与经验分享', sortOrder: 1 },
    { name: '成功案例', description: '真实的 AI 副业变现案例，可复制的成功经验', sortOrder: 2 },
    { name: '问答求助', description: '遇到问题？来这里提问，社区一起帮你解决', sortOrder: 3 },
    { name: '资源分享', description: '优质教程、模板、提示词等资源免费分享', sortOrder: 4 },
    { name: '产品设计', description: '产品思维、需求分析、PRD 写作讨论', sortOrder: 5 },
  ]

  const categories: Record<string, string> = {}
  for (const c of categoryData) {
    const cat = await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    })
    categories[c.name] = cat.id
  }
  console.log(`✅ 创建了 ${categoryData.length} 个论坛分类`)

  // ─── 论坛帖子假数据 ────────────────────────────────────────────────────────
  const postsData = [
    {
      title: '用 ChatGPT 写 PRD 的完整流程分享',
      content: '最近发现用 ChatGPT 来辅助写 PRD 效率提升了至少 3 倍，分享一下我的完整流程...\n\n1. 先用 ChatGPT 做竞品分析\n2. 生成需求框架\n3. 逐模块填充细节\n4. 用 AI 检查逻辑漏洞\n\n附上我的 Prompt 模板，大家可以直接用。',
      authorId: createdUsers[0].id,
      categoryId: categories['AI 工具讨论'],
      status: 'APPROVED' as const,
      viewCount: 1243,
    },
    {
      title: 'Midjourney 生成产品原型图的技巧总结',
      content: '作为一个产品经理，学会用 Midjourney 生成原型概念图真的太有用了！\n\n关键技巧：\n- 使用 --style raw 参数获得更清晰的 UI 风格\n- 描述时加上 "clean UI, minimal design" 关键词\n- 用 /blend 混合参考图和描述\n\n实际案例展示...',
      authorId: createdUsers[1].id,
      categoryId: categories['AI 工具讨论'],
      status: 'APPROVED' as const,
      viewCount: 876,
    },
    {
      title: '零基础产品小白的 AI 学习路径建议',
      content: '很多人问我从零开始学产品，结合 AI 工具该怎么规划学习路径。\n\n推荐顺序：\n1. 先学产品基础（推荐《人人都是产品经理》）\n2. 同步学 Prompt 工程\n3. 用 AI 做竞品分析练手\n4. 参与社区讨论，找 mentor\n\n每阶段时间建议和资源推荐...',
      authorId: createdUsers[2].id,
      categoryId: categories['学习交流'],
      status: 'APPROVED' as const,
      viewCount: 2156,
    },
    {
      title: '我用 AI 写作副业月入 2 万的经历',
      content: '去年下半年开始尝试 AI 写作变现，现在稳定月入 2 万+，来分享一下真实经历。\n\n核心业务：\n- 企业品牌文案\n- 公众号代运营\n- 产品宣传材料\n\n关键是找准定位，AI 是工具，你的思维和行业理解才是核心竞争力...',
      authorId: createdUsers[3].id,
      categoryId: categories['成功案例'],
      status: 'APPROVED' as const,
      viewCount: 4521,
    },
    {
      title: '求推荐：有没有好用的 AI 视频生成工具？',
      content: '最近需要制作产品演示视频，想用 AI 工具来降低成本。\n\n目前了解到的有 Runway、Pika、Sora...\n\n请问大家有没有实际用过的，效果怎么样？主要需求是：\n1. 文字转视频\n2. 图片动画化\n3. 最好有中文支持',
      authorId: createdUsers[4].id,
      categoryId: categories['问答求助'],
      status: 'APPROVED' as const,
      viewCount: 687,
    },
    {
      title: '分享我收集的 100 个高质量产品 Prompt 模板',
      content: '花了 3 个月整理的 100 个产品经理常用 Prompt 模板，免费分享！\n\n分类包括：\n- 需求分析类（20个）\n- 竞品分析类（15个）\n- 用户研究类（20个）\n- PRD 撰写类（25个）\n- 数据分析类（20个）\n\n在评论区回复"领取"我私信给你...',
      authorId: createdUsers[5].id,
      categoryId: categories['资源分享'],
      status: 'APPROVED' as const,
      viewCount: 5892,
    },
    {
      title: 'Claude 3.5 Sonnet 深度测评：比 ChatGPT 强在哪？',
      content: '用了两周 Claude 3.5 Sonnet，来分享一下和 ChatGPT 的对比...\n\n优势：\n- 长文本处理能力更强，上下文窗口大\n- 代码生成质量更高\n- 更不容易"断层"或偷懒\n\n劣势：\n- 图像理解不如 GPT-4V\n- 插件生态不如 ChatGPT\n\n综合来看...',
      authorId: createdUsers[6].id,
      categoryId: categories['AI 工具讨论'],
      status: 'APPROVED' as const,
      viewCount: 3201,
    },
    {
      title: '用 AI 搭建内容矩阵，3 个月涨粉 5 万的方法论',
      content: '今天来分享一个比较系统的内容矩阵搭建方法，结合 AI 工具可以做到事半功倍...\n\n核心思路：一个核心内容 × AI 拆解 = N 个平台内容\n\n具体操作步骤，以小红书+公众号+视频号为例...',
      authorId: createdUsers[7].id,
      categoryId: categories['成功案例'],
      status: 'APPROVED' as const,
      viewCount: 2987,
    },
    {
      title: '【待审核】AI 营销自动化实战指南',
      content: '本文将介绍如何搭建一套 AI 营销自动化系统...',
      authorId: createdUsers[8].id,
      categoryId: categories['AI 工具讨论'],
      status: 'PENDING' as const,
      viewCount: 0,
    },
    {
      title: '【待审核】在线教育如何应用 AI 提升学习效果',
      content: '作为在线教育从业者，我尝试了多种 AI 辅助教学工具...',
      authorId: createdUsers[9].id,
      categoryId: categories['学习交流'],
      status: 'PENDING' as const,
      viewCount: 0,
    },
  ]

  for (const p of postsData) {
    const existing = await prisma.post.findFirst({ where: { title: p.title } })
    if (!existing) {
      await prisma.post.create({ data: p })
    }
  }
  console.log(`✅ 创建了 ${postsData.length} 篇帖子`)

  // ─── 课程数据 ──────────────────────────────────────────────────────────────
  const courseData = [
    { title: 'AI 大模型入门：从零开始', description: '从零开始了解大模型原理，学习基础 Prompt 工程，无需编程基础。课程涵盖 ChatGPT、Claude、Gemini 等主流模型的使用技巧。', sortOrder: 0, isPublished: true },
    { title: '进阶 Prompt 工程实战', description: '掌握高级 Prompt 技术，包括 Chain-of-Thought、Few-shot、Role-playing 等核心技巧，让 AI 输出质量翻倍。', sortOrder: 1, isPublished: true },
    { title: 'AI 副业变现：从 0 到 1', description: '真实可复制的 AI 商业模式，手把手教你用 AI 开启副业。包含 AI 写作、AI 设计、AI 编程等多条变现路径。', sortOrder: 2, isPublished: true },
    { title: '产品经理 AI 工具箱', description: '专为产品经理打造的 AI 工具课程，覆盖需求分析、原型设计、数据分析、竞品研究全流程。', sortOrder: 3, isPublished: true },
    { title: 'AI 绘画商业变现实战', description: '从 Midjourney 入门到商业接单，手把手教你用 AI 绘画赚钱。包含接单平台推荐、报价策略、客户沟通技巧。', sortOrder: 4, isPublished: true },
    { title: '企业 AI 转型落地指南', description: '面向中小企业决策者和管理层，系统讲解如何推动企业 AI 转型，降本增效，构建 AI 竞争优势。', sortOrder: 5, isPublished: false },
  ]

  for (const c of courseData) {
    await prisma.course.upsert({
      where: { id: `seed-course-${c.sortOrder}` },
      update: c,
      create: { id: `seed-course-${c.sortOrder}`, ...c },
    })
  }
  console.log(`✅ 创建了 ${courseData.length} 门课程`)

  // ─── AI 工具数据（真实链接）────────────────────────────────────────────────
  const toolData = [
    // 对话 AI
    { name: 'ChatGPT', description: 'OpenAI 推出的大语言模型，全球最流行的 AI 对话工具，适合文案创作、代码助手、数据分析等场景。', link: 'https://chat.openai.com', categoryName: '对话 AI', tags: ['对话', '写作', '代码', 'OpenAI'], isRecommended: true, sortOrder: 0 },
    { name: 'Claude', description: 'Anthropic 出品的 AI 助手，长文本处理能力极强，上下文窗口达 200K，适合长篇写作和深度分析。', link: 'https://claude.ai', categoryName: '对话 AI', tags: ['对话', '分析', '写作', 'Anthropic'], isRecommended: true, sortOrder: 1 },
    { name: 'Gemini', description: 'Google DeepMind 推出的多模态大模型，深度集成 Google 生态，支持图文理解和实时搜索。', link: 'https://gemini.google.com', categoryName: '对话 AI', tags: ['对话', '多模态', 'Google'], isRecommended: true, sortOrder: 2 },
    { name: 'Perplexity AI', description: 'AI 驱动的搜索引擎，能实时联网搜索并给出有来源引用的精准答案，研究工作必备。', link: 'https://www.perplexity.ai', categoryName: '对话 AI', tags: ['搜索', '研究', '实时信息'], isRecommended: true, sortOrder: 3 },
    // 图像生成
    { name: 'Midjourney', description: '顶级 AI 绘图工具，生成高质量艺术图片和概念图，商业设计师的最爱。通过 Discord 使用。', link: 'https://www.midjourney.com', categoryName: '图像生成', tags: ['图像', '艺术', '设计', '商业'], isRecommended: true, sortOrder: 4 },
    { name: 'DALL-E 3', description: 'OpenAI 的图像生成模型，集成在 ChatGPT 中，能精准理解复杂文字描述，生成高质量图片。', link: 'https://labs.openai.com', categoryName: '图像生成', tags: ['图像', 'OpenAI', '创意'], isRecommended: false, sortOrder: 5 },
    { name: 'Stable Diffusion', description: '开源图像生成模型，可本地部署，支持高度自定义，专业用户的首选，Civitai 社区资源丰富。', link: 'https://stability.ai', categoryName: '图像生成', tags: ['图像', '开源', '本地部署'], isRecommended: false, sortOrder: 6 },
    { name: 'Leonardo AI', description: '专业 AI 图像创作平台，提供精细控制选项，特别适合游戏素材和概念艺术创作。', link: 'https://leonardo.ai', categoryName: '图像生成', tags: ['图像', '游戏', '概念艺术'], isRecommended: false, sortOrder: 7 },
    // 视频生成
    { name: 'Runway', description: 'AI 视频生成和编辑平台，Gen-2 模型可将图片或文字转换为高质量视频，创意工作者必备。', link: 'https://runwayml.com', categoryName: '视频生成', tags: ['视频', '创意', '影视'], isRecommended: true, sortOrder: 8 },
    { name: 'Pika', description: '简单易用的 AI 视频生成工具，一句话生成短视频，非常适合社交媒体内容创作者。', link: 'https://pika.art', categoryName: '视频生成', tags: ['视频', '社交媒体', '短视频'], isRecommended: false, sortOrder: 9 },
    { name: 'HeyGen', description: 'AI 数字人视频生成平台，可快速生成专业的营销视频、培训视频，支持多语言配音和口型同步。', link: 'https://www.heygen.com', categoryName: '视频生成', tags: ['数字人', '营销', '培训'], isRecommended: true, sortOrder: 10 },
    // 音频生成
    { name: 'ElevenLabs', description: '顶级 AI 语音合成平台，声音克隆效果逼真，支持多语言，有声书、播客和配音的首选工具。', link: 'https://elevenlabs.io', categoryName: '音频生成', tags: ['语音', '配音', '播客'], isRecommended: true, sortOrder: 11 },
    { name: 'Suno AI', description: 'AI 音乐创作平台，输入歌词或主题描述，几秒钟生成完整歌曲，零基础也能创作专业级音乐。', link: 'https://suno.com', categoryName: '音频生成', tags: ['音乐', '创作', '娱乐'], isRecommended: true, sortOrder: 12 },
    // 效率工具
    { name: 'GitHub Copilot', description: 'GitHub 和 OpenAI 联合推出的 AI 编程助手，深度集成 VS Code，代码补全准确率极高。', link: 'https://github.com/features/copilot', categoryName: '编程辅助', tags: ['代码', '编程', 'GitHub'], isRecommended: true, sortOrder: 13 },
    { name: 'Cursor', description: 'AI 原生代码编辑器，基于 VS Code 改造，支持自然语言编写代码，程序员效率神器。', link: 'https://cursor.sh', categoryName: '编程辅助', tags: ['代码', '编辑器', 'AI原生'], isRecommended: true, sortOrder: 14 },
    { name: 'Notion AI', description: 'Notion 内置的 AI 写作助手，可在笔记中直接调用 AI 润色文章、总结内容、生成任务列表。', link: 'https://www.notion.so', categoryName: '效率工具', tags: ['笔记', '写作', '效率'], isRecommended: false, sortOrder: 15 },
    { name: 'Gamma', description: 'AI 驱动的演示文稿生成工具，输入主题几秒生成精美 PPT，告别繁琐的幻灯片制作。', link: 'https://gamma.app', categoryName: '效率工具', tags: ['PPT', '演示', '效率'], isRecommended: true, sortOrder: 16 },
    { name: 'Kimi', description: '月之暗面推出的国产 AI 助手，长文本处理能力强，支持上传 PDF 等文件分析，中文理解出色。', link: 'https://kimi.moonshot.cn', categoryName: '对话 AI', tags: ['对话', '中文', '长文本', '国产'], isRecommended: true, sortOrder: 17 },
    { name: '文心一言', description: '百度推出的大语言模型，深度融合百度搜索和知识图谱，适合中文创作和信息检索。', link: 'https://yiyan.baidu.com', categoryName: '对话 AI', tags: ['对话', '中文', '百度', '国产'], isRecommended: false, sortOrder: 18 },
  ]

  for (const t of toolData) {
    const existing = await prisma.tool.findFirst({ where: { name: t.name } })
    if (!existing) {
      await prisma.tool.create({ data: { ...t, isPublished: true } })
    } else {
      await prisma.tool.update({ where: { id: existing.id }, data: t })
    }
  }
  console.log(`✅ 创建/更新了 ${toolData.length} 个 AI 工具`)

  // ─── 成功案例数据 ──────────────────────────────────────────────────────────
  const casesData = [
    {
      title: '辞职 3 个月，用 AI 写作月入 3 万',
      summary: '从传统媒体编辑转型 AI 写作自由职业者，分享从 0 到月入 3 万的完整历程',
      content: '我叫小雨，原来是一家传统媒体的编辑，月薪 8000。去年辞职后，专心研究 AI 写作变现...\n\n核心方法：\n1. 选择细分赛道：专注做教育行业的内容\n2. AI 提效而非替代：用 AI 做框架，人工做深度\n3. 建立客户口碑：第一个月亏本做，换取好评\n\n现在稳定月入 3 万，还在增长中。',
      authorName: '小雨',
      revenue: '月入 3 万',
      isPublished: true,
      sortOrder: 0,
    },
    {
      title: '副业设计师：AI 绘画让我月增收 8000',
      summary: '白天上班的 UI 设计师，用 Midjourney 接单，每月多赚 8000 元的真实经历',
      content: '我是一名普通的 UI 设计师，本职工作之外，用 Midjourney 接了很多概念图设计的单...\n\n变现路径：\n- 站酷、花瓣等平台接单\n- 游戏公司的概念图外包\n- 品牌视觉物料设计\n\n关键技巧是要有设计审美，AI 只是工具，审美才是核心竞争力。',
      authorName: '老吴设计',
      revenue: '月增收 8000',
      isPublished: true,
      sortOrder: 1,
    },
    {
      title: '用 AI 搭建课程，知识付费月收 5 万',
      summary: '产品经理转型知识博主，用 AI 工具辅助课程开发，实现知识付费变现',
      content: '做了 7 年产品经理，决定把经验变现。用 AI 工具极大加速了课程开发速度...\n\n具体做法：\n1. 用 AI 做课程大纲规划\n2. 用 AI 生成练习题和案例\n3. 用 AI 辅助制作课程配套材料\n4. 用 AI 做 SEO 和内容营销\n\n上线第一个月就卖出 100+ 份，现在稳定月收 5 万。',
      authorName: '产品张老师',
      revenue: '月收 5 万',
      isPublished: true,
      sortOrder: 2,
    },
    {
      title: '零成本起步：AI 代运营让我多了一份稳定收入',
      summary: '全职妈妈利用碎片时间，用 AI 工具帮中小企业做内容代运营，月增收 1.5 万',
      content: '在家带孩子的我，想找一份灵活的副业。发现很多中小企业的公众号、小红书缺乏专业运营...\n\n服务内容：\n- 每周 3 篇公众号文章\n- 每天 2 条小红书笔记\n- 每月 1 份数据分析报告\n\n用 AI 工具，我一个人可以同时服务 5-6 家企业，每家每月收 3000 元。',
      authorName: '宝妈王玲',
      revenue: '月增收 1.5 万',
      isPublished: true,
      sortOrder: 3,
    },
  ]

  for (const c of casesData) {
    const existing = await prisma.case.findFirst({ where: { title: c.title } })
    if (!existing) {
      await prisma.case.create({ data: c })
    }
  }
  console.log(`✅ 创建了 ${casesData.length} 个成功案例`)

  // ─── Banner 数据 ──────────────────────────────────────────────────────────
  const bannersData = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&h=400&fit=crop',
      link: '/learning',
      position: 'HOME_TOP' as const,
      isActive: true,
      sortOrder: 0,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&h=400&fit=crop',
      link: '/forum',
      position: 'HOME_TOP' as const,
      isActive: true,
      sortOrder: 1,
    },
  ]

  for (const b of bannersData) {
    const existing = await prisma.banner.findFirst({ where: { imageUrl: b.imageUrl } })
    if (!existing) {
      await prisma.banner.create({ data: b })
    }
  }
  console.log(`✅ 创建了 ${bannersData.length} 个 Banner`)

  console.log('\n🎉 Seed 完成！')
  console.log('─────────────────────────────────────────')
  console.log('🔑 管理员账号登录方式：')
  console.log('   用户名: admin    密码: 123123')
  console.log('   用户名: moderator  密码: mod123456')
  console.log('📱 手机号登录：18888888888  验证码: 123456')
  console.log('─────────────────────────────────────────')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
