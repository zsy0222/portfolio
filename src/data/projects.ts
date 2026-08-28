export interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  role: string;
  highlights: string[];
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  availability?: string;
}

export const projects: Project[] = [
  {
    id: "assertion-guided-cascaded-hybrid-slicing",
    title: "Assertion-Guided Cascaded Hybrid Slicing",
    description:
      "An ongoing fault-localization study that turns dynamic slice evidence into explicit, auditable constraints for LLM-assisted program repair.",
    status: "Research in progress",
    role:
      "Research framework, workflow design, prototype integration, controlled experiments, and evidence analysis.",
    highlights: [
      "Cascades dynamic backward analysis with assertion-guided static forward validation.",
      "Uses an Error Invariant to connect slice evidence, candidate locations, and constrained repair.",
      "The initial Defects4J Gson-7 pilot passed 3/3 trigger-test trials with the full workflow.",
    ],
    tags: ["#program-analysis", "#fault-localization", "#llm", "#research"],
    availability: "Private research repository; public release review is in progress.",
  },
  {
    id: "cost-aware-asynchronous-quantitative-strategy",
    title: "Cost-Aware Asynchronous Quantitative Strategy",
    description:
      "A quantitative-investment project on intraday liquidity dispersion, execution-aware factor scoring, asynchronous holding, and transaction-cost control.",
    status: "Final deliverable completed",
    role:
      "Factor construction, execution-aware strategy analysis, backtesting, LSTM extension, result verification, and final reporting.",
    highlights: [
      "Test-set L1/L2/L3 total returns were 10.66%, 10.25%, and 15.29%.",
      "The L3 design reduced average sell turnover from 37.80% to 12.71% and cumulative cost from 4.91% to 1.64%.",
      "The LSTM reached a 0.636 test AUC, and 89/89 independent verification checks passed.",
    ],
    tags: ["#quantitative-finance", "#backtesting", "#transaction-costs", "#lstm"],
    availability: "Private repository; results are historical backtests, not investment advice.",
  },
  {
    id: "smart-elderly-care-equipment-industry-research",
    title: "Smart Elderly-Care Equipment Industry Research",
    description:
      "An industry study of smart equipment and connected services for elderly care at home, with a focus on product design, installation, maintenance, and service delivery.",
    status: "Research in progress",
    role:
      "B-group product taxonomy and e-commerce research, including product consolidation, classification, review analysis, data cleaning, and related report sections.",
    highlights: [
      "Structured more than 460 product records by function, price, and age-friendly design.",
      "Used review evidence to identify installation, reliability, maintenance, false-alarm, and usability pain points.",
      "Connected product evidence to the shift from standalone hardware toward equipment, installation, service, and platform bundles.",
    ],
    tags: ["#industry-research", "#elderly-care", "#e-commerce", "#product-taxonomy"],
    availability: "Public results are withheld until finalization and publication approval.",
  },
  {
    id: "digital-technology-expansion-in-malaysia",
    title: "Digital Technology Expansion in Malaysia",
    description:
      "A multi-case field study of how Chinese enterprises use digital technologies to improve operational efficiency and build digital value chains in Malaysia.",
    status: "Final paper under release review",
    role:
      "Field-research synthesis, analytical framework development, case-evidence organization, and report writing within a team project.",
    highlights: [
      "Examines operational efficiency and digital value-chain development as two connected analytical dimensions.",
      "Studies localization, data governance, technology support, and cross-border operating constraints.",
      "Separates public sources, enterprise-provided information, field observations, and researcher interpretation.",
    ],
    tags: ["#international-business", "#digitalization", "#malaysia", "#case-study"],
    availability: "The paper and field materials remain private pending authorization and sensitivity review.",
  },
  {
    id: "brain-computer-interface-industry-mapping",
    title: "Brain-Computer Interface Industry Mapping",
    description:
      "A student-oriented map of the brain-computer interface industry, linking technology routes, leading companies, clinical progress, commercialization, and career pathways.",
    status: "Research in progress",
    role:
      "Leading-company research, technology-route comparison, evidence verification, and industry-to-career synthesis within a collaborative book project.",
    highlights: [
      "Compares invasive, endovascular or semi-invasive, and non-invasive technology routes.",
      "Maps eight leading Chinese and international companies across financing, clinical progress, productization, and talent needs.",
      "Builds an industry-to-company-to-role-to-employment structure for university readers.",
    ],
    tags: ["#bci", "#frontier-technology", "#industry-mapping", "#career-research"],
    availability: "Private repository; time-sensitive company and clinical data are still being reviewed.",
  },
  {
    id: "campus-recycling-tracker",
    title: "Campus Recycling Tracker",
    description:
      "An AI-assisted campus recycling prototype that follows materials from user submission to batch collection, reuse, and final feedback.",
    status: "Working prototype",
    role:
      "System design and full-stack implementation across visual recognition, batch management, anti-cheating checks, APIs, and the web interface.",
    highlights: [
      "Implements a closed loop from location scan and AI recognition to batch claiming and reuse feedback.",
      "Combines GPS validation, submission cooldowns, perceptual-hash duplicate checks, and multi-item counting.",
      "Uses FastAPI, SQLite, a lightweight web client, and a CPU-compatible MobileNetV3-based recognition path.",
    ],
    tags: ["#python", "#fastapi", "#ai", "#sustainability"],
    repoUrl: "https://github.com/zsy0222/LC_project",
  },
];
