export type MemoryText = { zh: string; en: string };

export interface Memory {
  slug: string;
  title: MemoryText;
  subtitle: MemoryText;
  period: MemoryText;
  summary: MemoryText;
  image?: string;
  kind: "photo" | "pending";
  location: MemoryText;
  story: MemoryText[];
  relatedHref?: string;
}

/** Personal memories. Dates, routes and media are only added when confirmed. */
export const memories: Memory[] = [
  {
    slug: "hulunbuir",
    title: { zh: "呼伦贝尔", en: "Hulunbuir" },
    subtitle: { zh: "风还留在那个夏天", en: "A summer the wind remembers" },
    period: { zh: "2025 · 夏天", en: "SUMMER · 2025" },
    summary: { zh: "高考之后，和高中同学一起走进草原。躺在山头看落日，记住一种自由的感觉。", en: "A post-exam journey with high-school friends. Grasslands, a sunset from a hillside, and the feeling of being free." },
    image: "/images/huolunbeier-memory.webp",
    kind: "photo",
    location: { zh: "中国 · 内蒙古 · 呼伦贝尔", en: "Hulunbuir · Inner Mongolia · China" },
    story: [
      { zh: "2025 年夏天，高考结束后，我和高中同学去了呼伦贝尔。没有家长陪同，这段旅程由我们自己走过。", en: "In the summer of 2025, after the college entrance examination, I travelled to Hulunbuir with friends from high school. Without our parents accompanying us, this was a journey of our own." },
      { zh: "草原比照片里更辽阔。我们一起躺在山头，看太阳慢慢落下，看眼前连绵起伏、几乎没有人的草坡。风吹过草地，那一刻有一种难以言说的自由与惬意。", en: "The grassland felt wider than it ever had in photographs. We lay on a hillside, watching the sun slowly disappear beyond rolling slopes with almost nobody in sight. There was a freedom and ease in that moment that words cannot quite hold." },
      { zh: "后来整理照片和视频，我又想起那段时光。画面保留了当时的风景，也让我开始思考：未来是否有一种技术，能让人重新接近回忆中的主观感受？这个念头，成为了一篇关于脑机接口的随想。", en: "Sorting through the photographs and videos later brought that summer back. The images kept the landscape, but also raised another question: could future technology help us come closer to the way a memory actually felt? That question became a personal reflection on brain-computer interfaces." },
    ],
    relatedHref: "/blog/experience-recording-and-replay",
  },
  {
    slug: "malaysia",
    title: { zh: "马来西亚", en: "Malaysia" },
    subtitle: { zh: "在观察与提问中，理解世界", en: "Learning to see through fieldwork" },
    period: { zh: "社会实践档案", en: "FIELDWORK ARCHIVE" },
    summary: { zh: "围绕中国企业在马来西亚的数字技术应用开展团队研究，连接实地观察、案例证据与商业分析。", en: "Team fieldwork on Chinese enterprises’ use of digital technology in Malaysia, connecting observation, case evidence and business analysis." },
    kind: "pending",
    location: { zh: "马来西亚", en: "Malaysia" },
    story: [
      { zh: "这段社会实践与一项跨案例研究相连：数字技术如何帮助中国企业提升在马来西亚的运营效率，并构建数字价值链。", en: "This fieldwork connects to a multi-case study of how Chinese enterprises use digital technologies to improve operational efficiency and build digital value chains in Malaysia." },
      { zh: "我参与团队的实地材料综合、分析框架构建、案例证据整理与报告写作。公开资料、企业提供的信息、实地观察和研究者解释在研究中保持区分。", en: "My work within the team included field-research synthesis, analytical framework development, case-evidence organisation and report writing. Public sources, enterprise-provided information, field observations and researcher interpretations are kept distinct." },
      { zh: "个人旅行照片和具体路线仍待整理。研究论文与实地材料沿用原项目的公开范围，不在这里展示尚未获准公开的内容。", en: "Personal photographs and the detailed route are still being organised. The research paper and field materials retain their existing publication boundaries; unreleased materials are not displayed here." },
    ],
    relatedHref: "/projects/digital-technology-expansion-in-malaysia",
  },
  {
    slug: "tongpan-island",
    title: { zh: "铜盘岛", en: "Tongpan Island" },
    subtitle: { zh: "把海风放进档案", en: "A place for the sea breeze" },
    period: { zh: "旅行记忆 · 待整理", en: "MEMORY · TO BE CURATED" },
    summary: { zh: "海岛旅行的记忆入口。照片、旅程时间与故事将在整理后补入。", en: "An entry for an island memory. Photographs, travel dates and the story will be added after curation." },
    kind: "pending", location: { zh: "铜盘岛", en: "Tongpan Island" },
    story: [{ zh: "这里为铜盘岛旅行保留一页。真实照片与已确认行程将成为展览的起点；在素材整理完成前，不补写日期或路线。", en: "This page is reserved for the Tongpan Island journey. Real photographs and a confirmed itinerary will be the starting point; dates and routes are left open until the materials are ready." }],
  },
  {
    slug: "yehliu", title: { zh: "野柳", en: "Yehliu" }, subtitle: { zh: "时间留在海岸的形状", en: "Time, written along the shore" },
    period: { zh: "旅行记忆 · 待整理", en: "MEMORY · TO BE CURATED" },
    summary: { zh: "为野柳的旅行记忆留下一页，等待真实影像和个人叙述。", en: "A place for memories of Yehliu, awaiting the original images and personal account." },
    kind: "pending", location: { zh: "野柳", en: "Yehliu" },
    story: [{ zh: "旅行目的地已收录，影像与时间线仍待核对。这里暂不展示无法确认拍摄地点的照片。", en: "The destination is recorded; its images and timeline still need to be checked. Photographs with unconfirmed locations are not presented as records of this journey." }],
  },
  {
    slug: "chongqing", title: { zh: "重庆", en: "Chongqing" }, subtitle: { zh: "城市的另一种层次", en: "Another layer of the city" },
    period: { zh: "旅行记忆 · 待整理", en: "MEMORY · TO BE CURATED" },
    summary: { zh: "重庆旅行的档案入口。真实照片、视频和故事整理后陆续加入。", en: "An archive entry for Chongqing. Original photographs, video and stories will follow as they are curated." },
    kind: "pending", location: { zh: "重庆", en: "Chongqing" },
    story: [{ zh: "这一页等待来自重庆的真实记录。具体日期、路线和故事尚未录入，保留空白也是对记忆的尊重。", en: "This page awaits the original records from Chongqing. Dates, routes and stories have not yet been added; the archive leaves room for them." }],
  },
  {
    slug: "ice-and-snow-world", title: { zh: "冰雪大世界", en: "Ice and Snow World" }, subtitle: { zh: "收藏一个冬天", en: "Keeping a winter" },
    period: { zh: "旅行记忆 · 待整理", en: "MEMORY · TO BE CURATED" },
    summary: { zh: "冰雪旅行的记忆入口，等待原始影像与已确认时间线。", en: "A place for a winter journey, awaiting original media and a confirmed timeline." },
    kind: "pending", location: { zh: "冰雪大世界", en: "Ice and Snow World" },
    story: [{ zh: "这里将收录冰雪大世界的旅行记录。照片、视频与个人感受整理完成后，再让这一页变得完整。", en: "This page will hold the Ice and Snow World travel record. Photographs, video and personal reflections will complete it when they have been organised." }],
  },
];
