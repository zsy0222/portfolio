import { projects } from "./projects";

/** Shared, serializable content registry. Missing media stays absent, never a demo URL. */
export type Localized = { zh: string; en: string };
export type WorkCategory = "software" | "research" | "worlds" | "film";
export interface CreativeWork {
  slug: string;
  category: WorkCategory;
  title: Localized;
  summary: Localized;
  status: Localized;
  year: string;
  tags: string[];
  sections: { title: Localized; body: Localized }[];
  image?: string;
  imageKind?: "photo" | "artwork";
  links?: { label: Localized; href: string }[];
  modelUrl?: string;
  videoUrl?: string;
  sourceProjectId?: string;
  availability?: Localized;
}

export const workCategories: { id: WorkCategory; number: string; label: Localized; description: Localized }[] = [
  { id: "software", number: "01", label: { zh: "软件工程", en: "Software Engineering" }, description: { zh: "把问题变成可以使用的系统。", en: "Turning questions into systems people can use." } },
  { id: "research", number: "02", label: { zh: "AI 与研究", en: "AI & Research" }, description: { zh: "从证据出发，保持好奇。", en: "Starting with evidence. Staying curious." } },
  { id: "worlds", number: "03", label: { zh: "3D 世界与数字艺术", en: "3D Worlds & Digital Art" }, description: { zh: "为想象建立空间。", en: "Giving imagination a place to live." } },
  { id: "film", number: "04", label: { zh: "影像与视觉叙事", en: "Video & Visual Storytelling" }, description: { zh: "让一段经历拥有自己的节奏。", en: "Finding the rhythm of a memory." } },
];

const translations: Record<string, { title: string; summary: string; status: string; role: string; highlights: string; availability?: string }> = {
  "assertion-guided-cascaded-hybrid-slicing": {
    title: "断言引导的级联混合程序切片",
    summary: "将动态切片证据转化为明确、可审计的约束，探索大语言模型辅助的故障定位与程序修复。",
    status: "研究进行中",
    role: "研究框架、工作流设计、原型集成、对照实验与证据分析。",
    highlights: "将动态反向分析与断言引导的静态前向验证级联。通过 Error Invariant 连接切片证据、候选位置与受约束修复。初始 Defects4J Gson-7 试点中，完整工作流通过了 3/3 次触发测试试验；这一结果仅对应已记录的试点，不代表普遍效果。",
    availability: "私有研究仓库；公开发布审查进行中。",
  },
  "cost-aware-asynchronous-quantitative-strategy": {
    title: "成本感知的异步量化策略",
    summary: "围绕日内流动性分散、执行感知因子评分、异步持仓与交易成本控制开展的量化投资项目。",
    status: "最终交付已完成",
    role: "因子构建、执行感知策略分析、回测、LSTM 扩展、结果核验与最终报告。",
    highlights: "原项目记录的测试集 L1/L2/L3 总收益率分别为 10.66%、10.25% 和 15.29%。L3 的平均卖出换手率从 37.80% 降至 12.71%，累计成本从 4.91% 降至 1.64%。LSTM 测试 AUC 为 0.636，89/89 项独立核验通过。这些是历史回测结果，不能解释为当前或未来收益。",
    availability: "私有仓库；结果为历史回测，不构成投资建议。",
  },
  "smart-elderly-care-equipment-industry-research": {
    title: "智慧居家养老设备行业研究",
    summary: "研究居家养老智能设备及关联服务，关注产品设计、安装、维护与服务交付。",
    status: "研究进行中",
    role: "B 组产品分类与电商研究，包括产品归集、分类、评价分析、数据清洗与相关报告章节。",
    highlights: "按功能、价格及适老化设计整理了 460 余条产品记录。利用评价证据识别安装、可靠性、维护、误报及易用性问题；进一步讨论行业从独立硬件向设备、安装、服务和平台组合的变化。",
    availability: "研究成果在最终定稿与发布授权完成前不公开。",
  },
  "digital-technology-expansion-in-malaysia": {
    title: "中国企业在马来西亚的数字技术拓展",
    summary: "通过多案例实地研究，探索中国企业如何在马来西亚运用数字技术提升运营效率并构建数字价值链。",
    status: "论文待发布审查",
    role: "在团队项目中承担实地调研综合、分析框架构建、案例证据整理与报告写作。",
    highlights: "以运营效率与数字价值链发展为相互联系的分析维度。关注本地化、数据治理、技术支持与跨境运营约束；明确区分公开来源、企业提供信息、实地观察与研究者解释。",
    availability: "论文与实地材料在授权和敏感性审查完成前保持私有。",
  },
  "brain-computer-interface-industry-mapping": {
    title: "脑机接口产业与职业图谱",
    summary: "面向大学生梳理脑机接口产业，连接技术路线、头部企业、临床进展、商业化与职业路径。",
    status: "研究进行中",
    role: "在合作编书项目中承担头部企业研究、技术路线对比、证据核验与产业到职业的综合分析。",
    highlights: "比较侵入式、血管介入或半侵入式、非侵入式技术路线。围绕融资、临床进展、产品化与人才需求整理八家中外头部企业，建立产业—企业—岗位—就业的阅读结构。",
    availability: "私有仓库；时效性较强的企业和临床数据仍在核验。",
  },
  "campus-recycling-tracker": {
    title: "校园低碳回收全路径追踪系统",
    summary: "从用户提交、批次收集到再利用和最终反馈，为校园可持续行动建立可追踪的闭环。",
    status: "可运行原型",
    role: "系统设计与全栈实现，覆盖视觉识别、批次管理、防作弊检查、接口与网页端。",
    highlights: "实现位置扫码、AI 识别、批次认领和再利用反馈的闭环。结合 GPS 验证、提交冷却、感知哈希重复检查与多物品计数。采用 FastAPI、SQLite、轻量网页客户端与兼容 CPU 的 MobileNetV3 识别路径。",
  },
};

const existingWorks: CreativeWork[] = projects.map((project) => {
  const zh = translations[project.id];
  return {
    slug: project.id,
    sourceProjectId: project.id,
    category: project.id === "campus-recycling-tracker" ? "software" : "research",
    title: { zh: zh.title, en: project.title },
    summary: { zh: zh.summary, en: project.description },
    status: { zh: zh.status, en: project.status },
    year: "2026",
    tags: project.tags.map((tag) => tag.replace(/^#/, "")),
    sections: [
      { title: { zh: "问题与背景", en: "Context & question" }, body: { zh: zh.summary, en: project.description } },
      { title: { zh: "我的工作", en: "My contribution" }, body: { zh: zh.role, en: project.role } },
      { title: { zh: "实现与已有记录", en: "Implementation & recorded evidence" }, body: { zh: zh.highlights, en: project.highlights.join(" ") + (project.id === "assertion-guided-cascaded-hybrid-slicing" ? " This is a recorded pilot result, not a claim of general performance." : "") } },
      { title: { zh: "项目档案", en: "Project archive" }, body: { zh: "此页承接原网站的项目记录。完整架构图、实验材料与进一步复盘仅在本人整理并确认可公开后补充。", en: "This page carries forward the original project record. Full architecture diagrams, experimental material and further reflections will be added after they have been curated and cleared for publication." } },
    ],
    availability: project.availability ? { zh: zh.availability || project.availability, en: project.availability } : undefined,
    links: [
      ...(project.repoUrl ? [{ label: { zh: project.availability ? "GitHub 仓库（访问可能受限）" : "GitHub 源码", en: project.availability ? "GitHub repository (access may be restricted)" : "Source on GitHub" }, href: project.repoUrl }] : []),
      ...(project.liveUrl ? [{ label: { zh: "打开演示", en: "Open demo" }, href: project.liveUrl }] : []),
    ],
  };
});

const newWorks: CreativeWork[] = [
  {
    slug: "academic-partner", category: "software", title: { zh: "AI 学术搭子", en: "AI Academic Partners" },
    summary: { zh: "为南大研究生牵线搭桥：从基础画像与推荐开始，按需与对方的 AI 分身交流。", en: "Helping NJU graduate students find collaborators through profiles, recommendations and optional conversations with a profile-based AI counterpart." },
    status: { zh: "交互原型阶段", en: "Interactive prototype" }, year: "2026", tags: ["product-design", "AI", "collaboration"],
    sections: [
      { title: { zh: "要解决的问题", en: "The question" }, body: { zh: "同学之间存在研究方向、技能和合作习惯的信息差。平台旨在帮助发现相契合的人，并将线上了解引向真实的线下合作。", en: "Research interests, skills and working habits are often difficult to discover. The platform aims to help students find compatible peers and move from online introductions to real collaboration." } },
      { title: { zh: "核心流程", en: "Core journey" }, body: { zh: "统一认证 → 完成基础资料 → 查看初始匹配 → 可选的分身问答 → 确认画像更新 → 双方同意后交换联系方式。分身对话不是浏览推荐的前置条件。", en: "University authentication → basic profile → initial matches → optional AI counterpart conversation → confirmed profile updates → contact exchange with mutual consent. Conversations are optional, not a prerequisite for browsing recommendations." } },
      { title: { zh: "我的工作与边界", en: "My work & scope" }, body: { zh: "需求梳理、核心流程和交互原型设计。分身只依据已提供资料回答，推断信息需本人确认。项目处于原型阶段，生产环境技术栈、统一认证接入与匹配有效性尚待确认。", en: "Requirements, core flows and interaction prototyping. The AI counterpart answers from supplied information; inferred profile changes need confirmation. Production architecture, university authentication integration and matching effectiveness are still to be established." } },
    ],
  },
  {
    slug: "sakura-cottage", category: "worlds", title: { zh: "樱花下的童话木屋", en: "A Cottage Under Sakura" },
    summary: { zh: "一间可以走近的童话木屋：从外观、室内比例到家具与生活小物，持续打磨一个居住的想象。", en: "A lived-in imagined home, developed through its exterior, interior proportions, furniture and everyday objects." },
    status: { zh: "持续制作中", en: "Work in progress" }, year: "2026", tags: ["Blender", "world-building", "interior"],
    sections: [
      { title: { zh: "创作起点", en: "Starting point" }, body: { zh: "以两层木屋为核心，把建筑外观与室内空间放在同一个可探索世界中。淡紫与粉色、樱花树和柔和的建筑轮廓构成视觉方向。", en: "A two-storey cottage connects an exterior and interior in one explorable world. Pale purple and pink, a sakura tree and softened architectural forms guide the visual direction." } },
      { title: { zh: "制作过程", en: "Making the space" }, body: { zh: "先建立建筑与室内白模，再校对门窗、楼梯和家具的位置关系；逐步调整床与楼梯距离、书架高度和生活小物。当前仍在迭代比例与细节。", en: "The process begins with architectural and interior blockouts, aligns doors, windows, stairs and furniture, then refines the bed-to-stair distance, shelving and small objects. Proportions and details remain in development." } },
      { title: { zh: "展陈进度", en: "Exhibition status" }, body: { zh: "本网站尚未接入经确认可公开的成品渲染、GLB 模型或 Blender 工程。完成素材整理后再提供 360° 预览与工程入口。", en: "Approved final renders, a GLB model and a Blender project have not yet been connected to this website. A 360° preview and project link will appear when those assets are available." } },
    ],
  },
  {
    slug: "future-ecological-city", category: "worlds", title: { zh: "未来生态科技城市", en: "A Future Ecological City" },
    summary: { zh: "围绕巨型生态树构想城市，让建筑、立体交通与自然共同生长。", en: "Imagining a city around a giant ecological tree, where buildings, layered transport and nature grow together." },
    status: { zh: "世界构建进行中", en: "World building in progress" }, year: "2026", tags: ["Blender", "voxel", "ecological-futures"],
    sections: [
      { title: { zh: "空间构想", en: "Spatial idea" }, body: { zh: "以巨型生态树为中心，组合高耸建筑、空中平台、透明交通管道、立体连廊、风力设施与水上建筑。蓝青色科技感与翠绿植被构成视觉方向。", en: "A giant ecological tree anchors towers, aerial platforms, transparent transit tubes, elevated walkways, wind infrastructure and buildings on water. Blue-cyan technology and green vegetation form the visual direction." } },
      { title: { zh: "制作与展陈", en: "Production & exhibition" }, body: { zh: "以体素微缩景观为创作形式。已明确世界构建需求，本站暂未接入可展示的模型与成品渲染；此页作为项目索引保留创作方向。", en: "The intended format is a voxel miniature landscape. The world-building brief is established, but no model or finished render has been connected here; this entry records the creative direction." } },
    ],
  },
  {
    slug: "voxel-worlds", category: "worlds", title: { zh: "体素微缩世界", en: "Worlds in Miniature" },
    summary: { zh: "用一个个小体块，研究建筑、地形与梦境空间的关系。", en: "Exploring architecture, terrain and dreamlike space, one small volume at a time." },
    status: { zh: "系列创作中", en: "Series in development" }, year: "2026", tags: ["Blender", "voxel", "miniature"],
    sections: [
      { title: { zh: "系列方向", en: "Series direction" }, body: { zh: "系列包含校园微缩景观与梦境空间探索。真实校园题材需要以地图和建筑资料核对空间关系；想象题材则保持其虚构属性。", en: "The series includes campus miniatures and dream-space explorations. Real campus subjects require spatial checks against maps and building references; imagined settings remain explicitly fictional." } },
      { title: { zh: "当前状态", en: "Current status" }, body: { zh: "持续完善比例、建筑细节与展示方式。本站暂未连接这一系列的模型、过程视频与正式渲染，不显示不可用的下载入口。", en: "Proportions, architectural details and presentation are being refined. Models, process videos and final renders are not yet connected to this site, so download controls remain absent." } },
    ],
  },
  {
    slug: "personal-digital-studio", category: "worlds", title: { zh: "我的数字创作室", en: "My Digital Studio" },
    summary: { zh: "把电脑、书架、照片墙与笔记本变成个人数字世界的入口。", en: "A computer, bookshelf, photo wall and notebook become doorways into a personal digital world." },
    status: { zh: "交互场景", en: "Interactive scene" }, year: "2026", tags: ["Three.js", "WebGL", "interaction"],
    sections: [
      { title: { zh: "空间就是导航", en: "Space as navigation" }, body: { zh: "创作室将工程项目、学习资料、旅行与思考映射为熟悉的生活物体。内容也保留普通网页入口，使阅读不依赖 3D。", en: "The studio connects projects, learning, travel and thoughts to familiar objects. Ordinary web routes remain available so reading never depends on 3D." } },
      { title: { zh: "场景说明", en: "Scene note" }, body: { zh: "这是依据个人创作室设定建立的数字空间示意，不是现实房间的摄影记录。后续可接入经优化的 Blender 与 GLB 资产。", en: "This is a digital interpretation of a personal studio brief, not a photographic record of an actual room. Optimized Blender and GLB assets can be connected later." } },
    ],
    links: [{ label: { zh: "进入交互创作室", en: "Enter the interactive studio" }, href: "/world" }],
  },
  {
    slug: "hulunbuir-vlog", category: "film", title: { zh: "呼伦贝尔 · 把夏天留下", en: "Hulunbuir · Keep a Little Summer" },
    summary: { zh: "高考后的夏天，四位高中同学走进草原。把真实影像与温暖的视觉叙事慢慢整理在一起。", en: "Four high-school friends, a summer after the entrance exams and the grasslands. Real footage is being shaped into a warm visual story." },
    status: { zh: "影像整理与制作中", en: "Editing & production" }, year: "2025 → 2026", tags: ["travel-vlog", "editing", "visual-storytelling"],
    image: "/images/huolunbeier-memory.webp", imageKind: "photo",
    sections: [
      { title: { zh: "真实旅途", en: "A real journey" }, body: { zh: "旅行发生在 2025 年夏天。广阔草原、山头的落日与朋友们共同构成这段记忆。封面为现有真实旅行照片拼图。", en: "The journey took place in summer 2025. Open grassland, sunsets on the hills and friends form the memory. The cover is the existing collage of real travel photographs." } },
      { title: { zh: "视觉叙事", en: "Visual storytelling" }, body: { zh: "计划结合原始视频、照片剪辑与明确标识的 AI 辅助视觉内容。温暖、治愈、文艺的基调中保留年轻轻快的节奏，采用 16:9 横屏。", en: "The plan combines original footage, photo editing and clearly identified AI-assisted visuals. A warm, gentle tone leaves room for a youthful rhythm in a 16:9 frame." } },
      { title: { zh: "素材状态", en: "Media status" }, body: { zh: "本站尚未接入完成版 Vlog。当前可浏览真实照片与旅行故事；没有使用生成片段冒充旅行实拍。", en: "The finished vlog is not yet connected to this site. Real photographs and the travel story are available; generated scenes are not presented as travel footage." } },
    ], links: [{ label: { zh: "前往旅行记忆", en: "Visit the memory museum" }, href: "/memories/hulunbuir" }],
  },
  {
    slug: "travel-route-animation", category: "film", title: { zh: "把旅途翻成一页", en: "A Journey, One Page at a Time" },
    summary: { zh: "为旅行影像制作纸艺微缩风格的章节、路线与转场动画。", en: "Paper-miniature chapters, routes and transitions designed for a travel film." },
    status: { zh: "动画制作中", en: "Animation in production" }, year: "2026", tags: ["Blender", "motion", "paper-art"],
    sections: [
      { title: { zh: "视觉语言", en: "Visual language" }, body: { zh: "奶油白纸张、自然草绿与天空蓝，配合少量暖橙细节。纸纤维、折痕与接触阴影建立真实手账感，让动画衔接照片与旅途章节。", en: "Cream paper, natural green and sky blue with restrained warm-orange details. Paper fibers, folds and contact shadows build a tactile journal that connects photographs and chapters." } },
      { title: { zh: "制作约束", en: "Production constraints" }, body: { zh: "目标为 16:9、30fps 的 4K 动画，先检查低清预览。中文标题保留为可编辑文字；路线只使用确认过的点位。此处列出的是制作目标，不代表全部片段均已完成。", en: "The target is 16:9, 30fps 4K animation, following a low-resolution preview check. Chinese titles remain editable; routes use confirmed locations only. These are production goals, not a claim that every sequence is finished." } },
      { title: { zh: "展陈进度", en: "Exhibition status" }, body: { zh: "本站尚未接入经确认可公开的成片与工程。完成媒体整理后，将分别标识 Blender 渲染与真实旅行影像。", en: "Approved videos and project files have not yet been connected to the website. Blender renders and real travel footage will be labeled separately when the media is curated." } },
    ],
  },
];

const wallpaperWork: CreativeWork = {
  slug: "sunlit-elf-live-wallpaper", category: "software", title: { zh: "暖阳精灵动态壁纸", en: "Sunlit Elf Live Wallpaper" },
  summary: { zh: "从暖阳精灵插画出发，把循环画面、时间日期与轻触花瓣带入 Android 桌面。", en: "Bringing a sunlit illustration to the Android home screen with looping visuals, a clock and touch-responsive petals." },
  status: { zh: "0.2.0 测试版 · 待真机验证", en: "0.2.0 test build · device validation pending" }, year: "2026", tags: ["Android", "live-wallpaper", "interaction"],
  image: "/images/sunlit-wallpaper-poster.jpg", imageKind: "artwork",
  sections: [
    { title: { zh: "从视觉到交互", en: "From visual to interaction" }, body: { zh: "截至 2026 年 10 月 23 日，0.2.0 测试版已接入约 10 秒的无声循环画面、桌面时间与日期、轻触花瓣反馈和静态显示选项。画面以整体视频呈现。", en: "As recorded on 23 October 2026, the 0.2.0 test build includes an approximately ten-second silent visual loop, a desktop clock and date, touch-responsive petals and a static display option. The scene is presented as a full-frame video." } },
    { title: { zh: "下一步验证", en: "Next validation" }, body: { zh: "待在小米手机上验证桌面与系统预览显示、裁切、点击兼容、息屏恢复、耗电与温升。轻倾斜视差和昼夜自动亮度尚未实现。普通动态壁纸不会替换系统锁屏时钟、安全界面或通知。", en: "Xiaomi device checks remain for the home screen and system preview, cropping, touch compatibility, wake recovery, battery use and temperature. Tilt parallax and automatic day/night brightness are not implemented. A normal live wallpaper does not replace the system lock-screen clock, security interface or notifications." } },
  ], links: [{ label: { zh: "阅读制作记录", en: "Read the making-of note" }, href: "/blog/sunlit-elf-live-wallpaper" }],
};

export const creativeWorks: CreativeWork[] = [
  existingWorks.find((work) => work.slug === "campus-recycling-tracker")!,
  existingWorks.find((work) => work.slug === "assertion-guided-cascaded-hybrid-slicing")!,
  newWorks[1], newWorks[5], newWorks[0], newWorks[2],
  ...existingWorks.filter((work) => !["campus-recycling-tracker", "assertion-guided-cascaded-hybrid-slicing"].includes(work.slug)),
  newWorks[3], newWorks[4], newWorks[6], wallpaperWork,
];
export function getWorkBySlug(slug: string): CreativeWork | undefined {
  return creativeWorks.find((work) => work.slug === slug);
}
