/** Parallel editions of published articles. Originals remain in src/content. */
export interface ArticleTranslation {
  sourceLocale: "zh" | "en";
  title: { zh: string; en: string };
  summary: { zh: string; en: string };
  /** A reviewed, repository-local file under src/content-en (never a user path). */
  translationFile: string;
}

export const articleTranslations: Record<string, ArticleTranslation> = {
  "experience-recording-and-replay": {
    sourceLocale: "zh",
    title: { zh: "如果记忆可以被重新感受：脑机接口的未来应用", en: "What if memories could be felt again? A future for brain–computer interfaces" },
    summary: { zh: "从呼伦贝尔草原的一段旅行记忆出发，想象脑机接口未来是否能让人重新接近当时的主观体验。", en: "A memory from the Hulunbuir grasslands prompts a question: could future brain–computer interfaces bring us closer to a past subjective experience?" },
    translationFile: "experience-recording-and-replay.mdx",
  },
  "sunlit-elf-live-wallpaper": {
    sourceLocale: "zh",
    title: { zh: "暖阳精灵动态壁纸：从视觉方案到 0.2.0 测试版", en: "Sunlit Elf live wallpaper: from visual concept to test version 0.2.0" },
    summary: { zh: "从一张暖阳精灵插画出发，记录动态壁纸 0.2.0 测试版的阶段成果与下一步真机验证计划。", en: "From a sunlit elf illustration to live wallpaper test version 0.2.0: current progress and the plan for testing on a physical device." },
    translationFile: "sunlit-elf-live-wallpaper.mdx",
  },
  "sophomore-confusion-and-reflection": {
    sourceLocale: "zh",
    title: { zh: "大二初的迷茫与反思", en: "Uncertainty and reflection at the start of sophomore year" },
    summary: { zh: "进入大二后，在绩点、科研、项目与兴趣之间重新审视努力的方向，以及如何找到愿意长期投入的事。", en: "Reconsidering GPA, research, projects, and personal interests in sophomore year—and looking for something worth pursuing over the long term." },
    translationFile: "sophomore-confusion-and-reflection.mdx",
  },
  "dream-time-and-inspiration": {
    sourceLocale: "zh",
    title: { zh: "梦境：另一种时间与灵感的入口", en: "Dreams: another doorway into time and inspiration" },
    summary: { zh: "一次只有六分钟的清晨醒转，让我开始思考梦里的时间、灵感，以及记录梦境的意义。", en: "A six-minute interval between waking moments led me to reflect on time in dreams, inspiration, and the value of recording dreams." },
    translationFile: "dream-time-and-inspiration.mdx",
  },
  "summer-projects-2026": {
    sourceLocale: "en",
    title: { zh: "2026 暑期：技术与商业之间的六个项目", en: "Summer 2026: Six Projects Across Technology and Business" },
    summary: { zh: "一份暑期项目回顾，涵盖程序分析、量化金融、养老设备、马来西亚数字技术出海、脑机接口与校园可持续发展。", en: "A summer portfolio review spanning program analysis, quantitative finance, elderly-care equipment, digital expansion in Malaysia, brain-computer interfaces, and campus sustainability." },
    translationFile: "summer-projects-2026.mdx",
  },
  welcome: {
    sourceLocale: "zh",
    title: { zh: "欢迎来到我的博客", en: "Welcome to My Blog" },
    summary: { zh: "博客上线了——记录科研、课程、项目和随想。", en: "The blog is online—a place for research, coursework, projects, and reflections." },
    translationFile: "welcome.mdx",
  },
};

export const articleCategoryLabels: Record<string, { zh: string; en: string }> = {
  research: { zh: "科研记录", en: "Research" },
  "cross-disciplinary": { zh: "跨学科思考", en: "Cross-disciplinary" },
  projects: { zh: "项目手记", en: "Projects" },
  "career-future": { zh: "成长与未来", en: "Career & Future" },
  casual: { zh: "随想", en: "Casual" },
};
