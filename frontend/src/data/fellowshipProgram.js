export const FELLOWSHIP_PROGRAM = {
  title: 'Anote AI Research Fellowship',
  titleZh: 'Anote AI 研究 Fellowship',
  subtitle: 'A Daymark adaptation for the Summer 2026 fellowship program.',
  subtitleZh: '为 2026 年夏季 fellowship 调整的 Daymark 版本。',
  dates: 'June 1 - August 10, 2026',
  datesZh: '2026年6月1日 - 2026年8月10日',
  startDate: '2026-06-01',
  endDate: '2026-08-10',
  location: 'New York City + virtual',
  locationZh: '纽约 + 线上',
  recurringEvents: [
    {
      id: 'research-standup',
      label: 'AI Research Standup',
      labelZh: 'AI 研究 Standup',
      shortLabel: 'Research',
      shortLabelZh: '研究',
      cadence: 'Every Tuesday · 5:00-5:30 PM ET',
      cadenceZh: '每周二 · 东部时间 17:00-17:30',
      weekday: 2,
      time: '17:00-17:30 ET',
      tone: 'Research sprint ritual',
      toneZh: '研究冲刺节奏',
      kind: 'research',
      description: 'Weekly checkpoint for paper direction, literature review, and experiment progress.',
      descriptionZh: '每周同步 paper 方向、文献综述和实验进展。',
    },
    {
      id: 'product-standup',
      label: 'AI Product Standup',
      labelZh: 'AI 产品 Standup',
      shortLabel: 'Product',
      shortLabelZh: '产品',
      cadence: 'Every Thursday · 5:00-5:30 PM ET',
      cadenceZh: '每周四 · 东部时间 17:00-17:30',
      weekday: 4,
      time: '17:00-17:30 ET',
      tone: 'Product ownership ritual',
      toneZh: '产品 ownership 节奏',
      kind: 'product',
      description: 'Weekly sync on the product repo, sprint scope, blockers, and shipping progress.',
      descriptionZh: '每周同步产品仓库、sprint 范围、卡点和上线进度。',
    },
    {
      id: 'fellowship-talk',
      label: 'Fellowship Talk',
      labelZh: 'Fellowship 讲座',
      shortLabel: 'Talk',
      shortLabelZh: '讲座',
      cadence: 'Every Friday · 1:00-2:00 PM ET',
      cadenceZh: '每周五 · 东部时间 13:00-14:00',
      weekday: 5,
      time: '13:00-14:00 ET',
      tone: 'In-person + virtual',
      toneZh: '线下 + 线上',
      kind: 'talk',
      description: 'NYC fellowship talk series with guest AI speakers and recorded sessions.',
      descriptionZh: '纽约现场的 fellowship 讲座系列，邀请 AI 嘉宾并录制。',
    },
  ],
  deliverables: [
    {
      id: 'paper',
      label: 'Research paper',
      labelZh: '研究论文',
      date: 'By Aug 10',
      dateZh: '8月10日前',
      description: 'Draft, refine, and submit a publishable paper to arXiv and a target venue.',
      descriptionZh: '起草、打磨并向 arXiv 以及目标会议/期刊投递可发表的论文。',
    },
    {
      id: 'presentation',
      label: 'Final presentation',
      labelZh: '最终展示',
      date: 'Aug 5',
      dateZh: '8月5日',
      description: 'Prepare an Anote-themed final presentation showcasing the summer work.',
      descriptionZh: '准备 Anote 风格的最终展示，呈现整个暑期的成果。',
    },
    {
      id: 'product',
      label: 'Product contribution',
      labelZh: '产品贡献',
      date: 'By Aug 10',
      dateZh: '8月10日前',
      description: 'Own one Anote product and ship meaningful improvements with Codex or Claude Code.',
      descriptionZh: '独立负责一个 Anote 产品，借助 Codex / Claude Code 推出有价值的改进。',
    },
  ],
  milestones: [
    {
      id: 'orientation',
      date: '2026-06-01',
      label: 'Orientation & Welcome',
      labelZh: '迎新 & Kickoff',
      description: 'Kickoff, assignments, slides template, and program expectations.',
      descriptionZh: '启动会、分配产品与研究方向、分发 slides 模板、明确项目预期。',
    },
    {
      id: 'topic-proposal',
      date: '2026-06-09',
      label: 'Research topic proposal due',
      labelZh: '研究方向 proposal 提交',
      description: 'Confirm the paper direction and share the initial research plan.',
      descriptionZh: '确认 paper 方向并分享最初的研究计划。',
    },
    {
      id: 'abstract',
      date: '2026-06-23',
      label: 'Abstract / outline draft due',
      labelZh: '摘要 / 提纲草稿提交',
      description: 'Lock the framing of the paper and prepare for midpoint review.',
      descriptionZh: '锁定 paper 的 framing，准备迎接 midpoint review。',
    },
    {
      id: 'midpoint',
      date: '2026-07-01',
      label: 'Midpoint one-on-one with Natan',
      labelZh: '与 Natan 的 Midpoint 一对一',
      description: 'Review paper progress, product work, blockers, and second-half goals.',
      descriptionZh: '回顾 paper 进度、产品工作、卡点，以及下半程的目标。',
    },
    {
      id: 'methodology',
      date: '2026-07-14',
      label: 'Methodology / experiments section due',
      labelZh: '方法论 / 实验章节提交',
      description: 'Move from framing into concrete experiments and evidence.',
      descriptionZh: '从 framing 走到具体的实验和证据。',
    },
    {
      id: 'full-draft',
      date: '2026-07-21',
      label: 'Full paper draft shared',
      labelZh: '完整论文 draft 提交',
      description: 'Hand over a full draft for review and team feedback.',
      descriptionZh: '提交完整草稿供团队 review 与反馈。',
    },
    {
      id: 'revisions',
      date: '2026-07-28',
      label: 'Revision target set',
      labelZh: '修订目标确定',
      description: 'Incorporate peer feedback and lock the submission plan.',
      descriptionZh: '吸收 peer 反馈，确定投稿方案。',
    },
    {
      id: 'presentation',
      date: '2026-08-05',
      label: 'Final presentations',
      labelZh: '最终展示',
      description: 'Present the summer work live and recorded for Anote channels.',
      descriptionZh: '现场展示整个暑期成果，并录制用于 Anote 的传播渠道。',
    },
    {
      id: 'wrap-up',
      date: '2026-08-10',
      label: 'Final wrap-up',
      labelZh: '项目收尾',
      description: 'Clean up code, document work, and finish research/product handoff.',
      descriptionZh: '整理代码、完成文档、交接 research 和 product。',
    },
  ],
  anchorEvents: [
    {
      id: 'orientation-event',
      date: '2026-06-01',
      time: '18:00-20:00 ET',
      label: 'Orientation & Welcome',
      labelZh: '迎新 & Kickoff',
      kind: 'anchor',
      location: 'WeWork NYC + Virtual',
      locationZh: 'WeWork 纽约 + 线上',
      description: 'Welcome remarks, program overview, meet the team, assign products & research topics.',
      descriptionZh: '欢迎致辞、项目概览、团队相互认识，分配产品与研究课题。',
    },
    {
      id: 'midpoint-event',
      date: '2026-07-01',
      time: '17:00-22:00 ET',
      label: 'Midpoint one-on-ones with Natan',
      labelZh: '与 Natan 的 Midpoint 一对一',
      kind: 'anchor',
      location: 'Virtual',
      locationZh: '线上',
      description: '20-min slots per fellow. Topics: research paper progress, product contributions, blockers, second-half goals.',
      descriptionZh: '每位 fellow 20 分钟。话题：论文进度、产品贡献、卡点、下半程目标。',
    },
    {
      id: 'final-presentations-event',
      date: '2026-08-05',
      time: '17:00-22:00 ET',
      label: 'Final Presentations',
      labelZh: '最终展示',
      kind: 'anchor',
      location: 'WeWork NYC + Virtual',
      locationZh: 'WeWork 纽约 + 线上',
      description: 'Each fellow presents their summer work. Recorded for YouTube and Anote website.',
      descriptionZh: '每位 fellow 展示整个暑期工作，录制后上传至 YouTube 与 Anote 官网。',
    },
    {
      id: 'summer-party',
      date: '2026-08-07',
      time: '19:00-22:00 ET',
      label: 'Anote Summer Party',
      labelZh: 'Anote 夏日派对',
      kind: 'anchor',
      location: 'NYC (in-person)',
      locationZh: '纽约（线下）',
      description: 'Celebration for all fellows and Anote team.',
      descriptionZh: '所有 fellow 和 Anote 团队的庆祝活动。',
    },
    {
      id: 'last-day',
      date: '2026-08-10',
      label: 'Last Day — Final Wrap-Up',
      labelZh: '最后一天 — 项目收尾',
      kind: 'anchor',
      location: 'NYC + Virtual',
      locationZh: '纽约 + 线上',
      description: 'Clean up code, write documentation, submit research papers to arXiv, final product handoffs.',
      descriptionZh: '整理代码、补齐文档、向 arXiv 投递论文、完成产品最终交接。',
    },
  ],
  milestoneNotesByDate: {
    '2026-06-09': 'Research topic proposals due — each fellow shares chosen paper direction.',
    '2026-06-16': 'Literature review progress check.',
    '2026-06-23': 'Abstract / outline draft due.',
    '2026-06-30': 'Mid-June research check-in, blockers.',
    '2026-07-14': 'Paper draft methodology / experiments section due.',
    '2026-07-21': 'Full paper draft review — share draft with team.',
    '2026-07-28': 'Paper revision & peer feedback; submission target set.',
    '2026-08-04': 'Final paper refinement; confirm arXiv & journal/conference submission.',
  },
  milestoneNotesByDateZh: {
    '2026-06-09': '研究方向 proposal 提交 — 每位 fellow 分享选定的 paper 方向。',
    '2026-06-16': '文献综述进度检查。',
    '2026-06-23': '摘要 / 提纲草稿提交。',
    '2026-06-30': '6月中研究 check-in，梳理卡点。',
    '2026-07-14': '论文 draft：方法论 / 实验章节提交。',
    '2026-07-21': '完整论文 draft review — 分享给团队。',
    '2026-07-28': '论文修订 & peer 反馈；确定投稿目标。',
    '2026-08-04': '论文最后打磨；确认 arXiv 与会议/期刊投稿。',
  },
};

export function pickLang(item, field, lang) {
  if (!item) return '';
  if (lang === 'zh') {
    const zhField = `${field}Zh`;
    return item[zhField] || item[field] || '';
  }
  return item[field] || '';
}

function pad(value) {
  return String(value).padStart(2, '0');
}

export function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function fellowshipTitleVariants(title) {
  const variants = new Set([title]);
  if (title.includes('refinement')) {
    variants.add(title.replace('refinement', 'polish'));
  }
  if (title.includes('polish')) {
    variants.add(title.replace('polish', 'refinement'));
  }
  return Array.from(variants);
}

const HOLIDAY_SKIPS = new Set([]);

export function getEventsForDate(isoString) {
  const withinRange =
    isoString >= FELLOWSHIP_PROGRAM.startDate && isoString <= FELLOWSHIP_PROGRAM.endDate;
  if (!withinRange) return [];

  const date = parseIsoDate(isoString);
  const weekday = date.getDay();
  const events = [];

  FELLOWSHIP_PROGRAM.recurringEvents.forEach((event) => {
    if (event.weekday === weekday && !HOLIDAY_SKIPS.has(isoString)) {
      events.push({
        id: `${event.id}-${isoString}`,
        kind: event.kind,
        label: event.label,
        labelZh: event.labelZh,
        shortLabel: event.shortLabel,
        shortLabelZh: event.shortLabelZh,
        time: event.time,
        description: event.description,
        descriptionZh: event.descriptionZh,
        source: 'recurring',
        note: FELLOWSHIP_PROGRAM.milestoneNotesByDate[isoString] || null,
        noteZh: (FELLOWSHIP_PROGRAM.milestoneNotesByDateZh && FELLOWSHIP_PROGRAM.milestoneNotesByDateZh[isoString]) || null,
      });
    }
  });

  FELLOWSHIP_PROGRAM.anchorEvents
    .filter((event) => event.date === isoString)
    .forEach((event) => {
      events.push({
        id: event.id,
        kind: event.kind,
        label: event.label,
        labelZh: event.labelZh,
        shortLabel: 'Anchor',
        shortLabelZh: '大日子',
        time: event.time || 'All day',
        location: event.location,
        locationZh: event.locationZh,
        description: event.description,
        descriptionZh: event.descriptionZh,
        source: 'anchor',
      });
    });

  FELLOWSHIP_PROGRAM.milestones
    .filter((milestone) => milestone.date === isoString)
    .forEach((milestone) => {
      const alreadyAnchored = events.some(
        (event) => event.source === 'anchor'
      );
      if (alreadyAnchored) return;
      events.push({
        id: `milestone-${milestone.id}`,
        kind: 'milestone',
        label: milestone.label,
        labelZh: milestone.labelZh,
        shortLabel: 'Milestone',
        shortLabelZh: '里程碑',
        time: 'Due',
        description: milestone.description,
        descriptionZh: milestone.descriptionZh,
        source: 'milestone',
      });
    });

  events.sort((a, b) => {
    const rank = { anchor: 0, milestone: 1, research: 2, product: 3, talk: 4 };
    return (rank[a.kind] ?? 9) - (rank[b.kind] ?? 9);
  });

  return events;
}

export const EVENT_KIND_META = {
  research: { toneEn: 'Research', toneZh: '研究', accent: 'var(--accent)' },
  product: { toneEn: 'Product', toneZh: '产品', accent: '#1f6f5c' },
  talk: { toneEn: 'Talk', toneZh: '讲座', accent: '#4a5db8' },
  anchor: { toneEn: 'Anchor', toneZh: '大日子', accent: 'var(--text)' },
  milestone: { toneEn: 'Milestone', toneZh: '里程碑', accent: '#b25b17' },
};

export const FELLOWSHIP_SEED_TASKS = [
  {
    title: 'Fellowship: Attend orientation and kickoff',
    description: 'Welcome remarks, assign product and research topics, and collect all setup links.',
    priority: 5,
    category: 'core',
    dueDate: '2026-06-01',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Join weekly AI Research Standup',
    description: 'Recurring Tuesday research standup throughout the fellowship.',
    priority: 3,
    category: 'core',
    dueDate: null,
    taskKind: 'weekly',
    recurrenceWeekday: 1,
  },
  {
    title: 'Fellowship: Join weekly AI Product Standup',
    description: 'Recurring Thursday product standup throughout the fellowship.',
    priority: 3,
    category: 'core',
    dueDate: null,
    taskKind: 'weekly',
    recurrenceWeekday: 3,
  },
  {
    title: 'Fellowship: Join Friday fellowship talk',
    description: 'Recurring Friday guest talk with in-person NYC expectation.',
    priority: 3,
    category: 'core',
    dueDate: null,
    taskKind: 'weekly',
    recurrenceWeekday: 4,
  },
  {
    title: 'Fellowship: Submit research topic proposal',
    description: 'Choose the paper direction and share the proposal in standup.',
    priority: 5,
    category: 'core',
    dueDate: '2026-06-09',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Draft abstract and outline',
    description: 'Prepare the abstract / outline milestone for week 4.',
    priority: 5,
    category: 'core',
    dueDate: '2026-06-23',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Midpoint one-on-one with Natan',
    description: 'Discuss research progress, product contribution, and blockers.',
    priority: 5,
    category: 'core',
    dueDate: '2026-07-01',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Finish methodology / experiments section',
    description: 'Have the methodology and experiments section ready by week 7.',
    priority: 5,
    category: 'core',
    dueDate: '2026-07-14',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Share full paper draft for review',
    description: 'Send the full draft to the team for week 8 review.',
    priority: 5,
    category: 'core',
    dueDate: '2026-07-21',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Revise paper and lock submission target',
    description: 'Incorporate peer feedback and confirm the conference / journal target.',
    priority: 5,
    category: 'core',
    dueDate: '2026-07-28',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Final paper refinement and arXiv prep',
    description: 'Refine the final version and confirm submission readiness.',
    priority: 5,
    category: 'core',
    dueDate: '2026-08-04',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Prepare final presentation',
    description: 'Finalize the Anote-themed deck for the recorded presentation day.',
    priority: 5,
    category: 'core',
    dueDate: '2026-08-05',
    taskKind: 'temporary',
  },
  {
    title: 'Fellowship: Ship product contribution and final docs',
    description: 'Ensure product PRs, README updates, and handoff docs are completed.',
    priority: 5,
    category: 'core',
    dueDate: '2026-08-10',
    taskKind: 'temporary',
  },
];
