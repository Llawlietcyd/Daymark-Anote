import React, { useMemo, useState } from 'react';
import FellowshipCalendar from './FellowshipCalendar';
import FellowProfileCard from './FellowProfileCard';
import { createTask, getTasks } from '../http/api';
import { useLanguage } from '../i18n/LanguageContext';
import {
  FELLOWSHIP_PROGRAM,
  FELLOWSHIP_SEED_TASKS,
  fellowshipTitleVariants,
  isoDate,
  parseIsoDate,
  pickLang,
} from '../data/fellowshipProgram';

const DAY_MS = 24 * 60 * 60 * 1000;

const MONTH_MARKS = [
  { date: '2026-06-01', label: 'JUNE' },
  { date: '2026-07-01', label: 'JULY' },
  { date: '2026-08-01', label: 'AUGUST' },
];

const TIMELINE_DELIVERABLE_IDS = new Set([
  'topic-proposal',
  'abstract',
  'methodology',
  'full-draft',
  'revisions',
]);

const TIMELINE_SHORT_LABELS = {
  orientation: { en: 'Orientation', zh: '迎新' },
  'orientation-event': { en: 'Orientation', zh: '迎新' },
  'topic-proposal': { en: 'Proposal', zh: 'Proposal' },
  abstract: { en: 'Outline', zh: '提纲' },
  midpoint: { en: 'Midpoint', zh: '中期' },
  'midpoint-event': { en: 'Midpoint', zh: '中期' },
  methodology: { en: 'Methods', zh: '方法' },
  'full-draft': { en: 'Full draft', zh: '完整 draft' },
  revisions: { en: 'Revision', zh: '修订' },
  presentation: { en: 'Finals', zh: '展示' },
  'final-presentations-event': { en: 'Finals', zh: '展示' },
  'summer-party': { en: 'Party', zh: '派对' },
  'wrap-up': { en: 'Wrap', zh: '收尾' },
  'last-day': { en: 'Wrap', zh: '收尾' },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function daysBetween(startIso, endIso) {
  return Math.round((parseIsoDate(endIso) - parseIsoDate(startIso)) / DAY_MS);
}

function formatShortDate(isoString, lang) {
  const date = parseIsoDate(isoString);
  if (lang === 'zh') {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatFullDate(isoString, lang) {
  const date = parseIsoDate(isoString);
  if (lang === 'zh') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function timelinePercent(isoString) {
  const start = parseIsoDate(FELLOWSHIP_PROGRAM.startDate);
  const end = parseIsoDate(FELLOWSHIP_PROGRAM.endDate);
  const current = parseIsoDate(isoString);
  const total = Math.max(1, end - start);
  return clamp(((current - start) / total) * 100, 0, 100);
}

function getProgramPosition(todayIso) {
  const totalDays = Math.max(1, daysBetween(FELLOWSHIP_PROGRAM.startDate, FELLOWSHIP_PROGRAM.endDate));

  if (todayIso < FELLOWSHIP_PROGRAM.startDate) {
    const daysUntilStart = Math.max(0, daysBetween(todayIso, FELLOWSHIP_PROGRAM.startDate));
    return {
      phase: 'setup',
      progress: 0,
      markerPercent: 0,
      week: 0,
      weeksTotal: Math.ceil((totalDays + 1) / 7),
      daysUntilStart,
      daysLeft: totalDays,
    };
  }

  if (todayIso > FELLOWSHIP_PROGRAM.endDate) {
    return {
      phase: 'wrapped',
      progress: 100,
      markerPercent: 100,
      week: Math.ceil((totalDays + 1) / 7),
      weeksTotal: Math.ceil((totalDays + 1) / 7),
      daysUntilStart: 0,
      daysLeft: 0,
    };
  }

  const elapsedDays = daysBetween(FELLOWSHIP_PROGRAM.startDate, todayIso);
  const daysLeft = Math.max(0, daysBetween(todayIso, FELLOWSHIP_PROGRAM.endDate));
  return {
    phase: 'live',
    progress: clamp(Math.round((elapsedDays / totalDays) * 100), 0, 100),
    markerPercent: clamp((elapsedDays / totalDays) * 100, 0, 100),
    week: Math.floor(elapsedDays / 7) + 1,
    weeksTotal: Math.ceil((totalDays + 1) / 7),
    daysUntilStart: 0,
    daysLeft,
  };
}

function dayName(isoString) {
  return parseIsoDate(isoString)
    .toLocaleDateString('en-US', { weekday: 'short' })
    .toUpperCase();
}

function getUpcomingMilestones(todayIso) {
  const fallbackStart = todayIso < FELLOWSHIP_PROGRAM.startDate ? FELLOWSHIP_PROGRAM.startDate : todayIso;
  return FELLOWSHIP_PROGRAM.milestones
    .filter((item) => item.date >= fallbackStart)
    .slice(0, 4);
}

function getAnchorTimelineItems(lang) {
  return FELLOWSHIP_PROGRAM.anchorEvents.map((item, index) => ({
    id: item.id,
    iso: item.date,
    label: pickLang(item, 'label', lang),
    shortLabel: TIMELINE_SHORT_LABELS[item.id]?.[lang] || TIMELINE_SHORT_LABELS[item.id]?.en || pickLang(item, 'label', lang),
    date: formatShortDate(item.date, lang),
    level: index >= 2 ? index - 2 : 0,
  }));
}

function getDeliverableTimelineItems(lang) {
  return FELLOWSHIP_PROGRAM.milestones
    .filter((item) => TIMELINE_DELIVERABLE_IDS.has(item.id))
    .map((item) => ({
      id: item.id,
      iso: item.date,
      label: pickLang(item, 'label', lang),
      shortLabel: TIMELINE_SHORT_LABELS[item.id]?.[lang] || TIMELINE_SHORT_LABELS[item.id]?.en || pickLang(item, 'label', lang),
      date: formatShortDate(item.date, lang),
      level: item.id === 'full-draft' ? 1 : 0,
    }));
}

function StatusDot({ status }) {
  if (status === 'done') {
    return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--text)]" />;
  }
  if (status === 'doing') {
    return <span className="h-2.5 w-2.5 shrink-0 rounded-full border-2 border-[color:var(--text)] bg-white" />;
  }
  return <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[color:var(--line-strong)]" />;
}

function ProgramTimeline({ lang, position }) {
  const anchorItems = useMemo(() => getAnchorTimelineItems(lang), [lang]);
  const deliverableItems = useMemo(() => getDeliverableTimelineItems(lang), [lang]);
  const todayIso = isoDate(new Date());
  const markerLabel =
    position.phase === 'setup'
      ? 'YOU · SETUP'
      : position.phase === 'wrapped'
        ? 'WRAPPED'
        : `YOU · WK ${String(position.week).padStart(2, '0')}`;

  return (
    <div className="relative mt-8 overflow-x-auto pb-3">
      <div className="relative min-w-[960px] px-8 pb-36 pt-32">
        <div className="absolute left-0 right-8 top-4 h-10">
          {MONTH_MARKS.map((mark) => (
            <div
              key={mark.date}
              className="absolute font-[var(--mono)] text-[10px] font-bold uppercase tracking-[0.34em] text-[rgba(16,16,16,0.38)]"
              style={{ left: `calc(28px + ${timelinePercent(mark.date)}%)` }}
            >
              {mark.label}
            </div>
          ))}
        </div>

        <div className="relative h-0.5 bg-[rgba(17,17,17,0.14)]">
          <div
            className="absolute left-0 top-[-1px] h-[3px] bg-[color:var(--text)]"
            style={{ width: `${position.markerPercent}%` }}
          />

          {Array.from({ length: position.weeksTotal + 1 }, (_, index) => (
            <span
              key={`tick-${index}`}
              className="absolute top-[-3px] w-px bg-[rgba(17,17,17,0.32)]"
              style={{
                left: `${(index / position.weeksTotal) * 100}%`,
                height: index % 2 === 0 ? 14 : 6,
              }}
            />
          ))}

          {anchorItems.map((item) => {
            const passed = item.iso <= todayIso && position.phase !== 'setup';
            return (
              <div
                key={item.id}
                className="absolute flex -translate-x-1/2 flex-col items-center gap-2"
                style={{ left: `${timelinePercent(item.iso)}%`, bottom: `${18 + item.level * 38}px` }}
              >
                <div
                  className={`whitespace-nowrap rounded-full border border-[color:var(--line)] bg-white/90 px-2 py-1 font-[var(--mono)] text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    passed ? 'text-[color:var(--text)]' : 'text-[color:var(--muted)]'
                  }`}
                  title={`${item.label} · ${item.date}`}
                >
                  {item.shortLabel}
                </div>
                <span
                  className={`h-3 w-3 border-[1.5px] border-[color:var(--text)] ${
                    passed ? 'bg-[color:var(--text)]' : 'bg-white'
                  }`}
                />
              </div>
            );
          })}

          {deliverableItems.map((item) => {
            const passed = item.iso < todayIso && position.phase !== 'setup';
            return (
              <div
                key={item.id}
                className="absolute flex -translate-x-1/2 flex-col items-center gap-2.5"
                style={{ left: `${timelinePercent(item.iso)}%`, top: `${18 + item.level * 54}px` }}
              >
                <span
                  className={`h-3 w-3 rounded-full border-[1.5px] border-[color:var(--text)] ${
                    passed ? 'bg-[color:var(--text)]' : 'bg-white'
                  }`}
                />
                <div
                  className={`max-w-[92px] text-center text-[12px] font-semibold leading-tight tracking-[-0.01em] ${
                    passed ? 'text-[color:var(--muted)] line-through decoration-[rgba(16,16,16,0.35)]' : 'text-[color:var(--text)]'
                  }`}
                  title={item.label}
                >
                  {item.shortLabel}
                </div>
                <div className="font-[var(--mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
                  {item.date}
                </div>
              </div>
            );
          })}

          <div
            className="absolute bottom-[-110px] top-[-92px] w-0 -translate-x-px border-l-[1.5px] border-dashed border-[rgba(16,16,16,0.55)]"
            style={{ left: `${position.markerPercent}%` }}
          />
          <div
            className="absolute top-[-108px] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[color:var(--text)] px-3 py-1.5 font-[var(--mono)] text-[10px] font-bold uppercase tracking-[0.22em] text-white shadow-[0_8px_20px_rgba(16,16,16,0.18)]"
            style={{ left: `${position.markerPercent}%` }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            {markerLabel}
          </div>
        </div>
      </div>

      <div className="grid gap-3 border-t border-[color:var(--line)] pt-4 md:grid-cols-2">
        <div>
          <div className="panel-label !text-[10px] !tracking-[0.18em]">ANCHORS</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {anchorItems.map((item) => (
              <span key={`anchor-summary-${item.id}`} className="tech-chip">
                {item.date} · {item.label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="panel-label !text-[10px] !tracking-[0.18em]">DELIVERABLE STEPS</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {deliverableItems.map((item) => (
              <span key={`deliverable-summary-${item.id}`} className="tech-chip">
                {item.date} · {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgramWindow({ copy, lang, position, upcoming }) {
  const progressLabel = `${position.progress}%`;
  const rows = upcoming.length
    ? upcoming
    : [
        {
          id: 'wrapped',
          date: FELLOWSHIP_PROGRAM.endDate,
          label: copy.wrappedRow,
        },
      ];

  return (
    <section className="board-card px-6 py-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div className="panel-label">{copy.windowEyebrow}</div>
        <div className="flex items-center gap-2 font-[var(--mono)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
          <span>{copy.loadLabel}</span>
          <span className="font-bold tracking-[0.08em] text-[color:var(--text)]">{progressLabel}</span>
        </div>
      </div>

      <h2 className="mt-4 max-w-3xl text-[32px] leading-[1.12] tracking-[-0.04em] text-[color:var(--text)]">
        {copy.windowTitle}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--muted)]">{copy.windowBody}</p>

      <div className="relative mt-6">
        <div className="h-1.5 overflow-hidden rounded-full border border-[color:var(--line)] bg-[rgba(17,17,17,0.08)]">
          <div className="h-full bg-[color:var(--text)]" style={{ width: `${position.progress}%` }} />
        </div>
        <div className="mt-2 grid grid-cols-7 font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
          {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-x-10 border-t border-[color:var(--line)] pt-4 lg:grid-cols-2">
        {rows.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-[20px_48px_minmax(0,1fr)_auto] items-center gap-3 py-2.5"
          >
            <StatusDot status={index === 0 && position.phase === 'live' ? 'doing' : 'queued'} />
            <span className="panel-label !tracking-[0.18em]">{dayName(item.date)}</span>
            <span className="text-[15px] tracking-[-0.005em] text-[color:var(--text)]">
              {pickLang(item, 'label', lang)}
            </span>
            <span className="font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              {formatShortDate(item.date, lang)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklyRhythm({ copy, lang }) {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const rows = FELLOWSHIP_PROGRAM.recurringEvents.map((event) => ({
    ...event,
    dayIndex: (event.weekday + 6) % 7,
  }));

  return (
    <section className="board-card px-6 py-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="panel-label">{copy.rhythmEyebrow}</div>
        <div className="panel-label !tracking-[0.18em]">
          {rows.length} {copy.seriesLabel}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[220px_repeat(7,1fr)_96px] items-center border-b border-[color:var(--line)] pb-2">
            <div />
            {days.map((day) => (
              <div key={day} className="text-center font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {day}
              </div>
            ))}
            <div className="text-right font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
              {copy.timeLabel}
            </div>
          </div>

          {rows.map((event, index) => (
            <div
              key={event.id}
              className={`grid grid-cols-[220px_repeat(7,1fr)_96px] items-center py-4 ${
                index === rows.length - 1 ? '' : 'border-b border-dotted border-[rgba(17,17,17,0.12)]'
              }`}
            >
              <div>
                <div className="text-[15px] font-semibold tracking-[-0.015em] text-[color:var(--text)]">
                  {pickLang(event, 'label', lang)}
                </div>
                <div className="mt-0.5 font-[var(--mono)] text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  {pickLang(event, 'tone', lang)}
                </div>
              </div>
              {days.map((day, dayIndex) => (
                <div key={`${event.id}-${day}`} className="flex justify-center">
                  <span
                    className={`transition-all ${
                      dayIndex === event.dayIndex
                        ? 'h-[22px] w-[22px] rounded-md bg-[color:var(--text)]'
                        : 'h-2.5 w-2.5 rounded-full bg-[rgba(17,17,17,0.08)]'
                    }`}
                  />
                </div>
              ))}
              <div className="text-right font-[var(--mono)] text-[11px] font-semibold uppercase tracking-[0.08em] text-[color:var(--text)]">
                {event.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliverableCards({ copy, lang }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {FELLOWSHIP_PROGRAM.deliverables.map((item) => (
        <div key={item.id} className="rounded-[24px] border border-[color:var(--line-strong)] bg-white/85 p-5 shadow-[10px_10px_0_rgba(16,16,16,0.025)]">
          <div className="flex items-start justify-between gap-3">
            <div className="panel-label">{copy.deliverableLabel}</div>
            <span className="tech-chip">{pickLang(item, 'date', lang)}</span>
          </div>
          <h3 className="mt-4 text-xl leading-tight tracking-[-0.03em] text-[color:var(--text)]">
            {pickLang(item, 'label', lang)}
          </h3>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            {pickLang(item, 'description', lang)}
          </p>
        </div>
      ))}
    </section>
  );
}

function FellowshipPage() {
  const { lang } = useLanguage();
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const todayIso = isoDate(new Date());
  const position = useMemo(() => getProgramPosition(todayIso), [todayIso]);
  const upcoming = useMemo(() => getUpcomingMilestones(todayIso), [todayIso]);

  const copy = useMemo(
    () => (
      lang === 'zh'
        ? {
            eyebrow: 'DAYMARK // FELLOWSHIP OS',
            cohort: 'COHORT 2026',
            importAction: '导入 Fellowship 任务',
            importedAction: '已导入',
            statusBusy: '正在导入...',
            importedPrefix: '导入结果：',
            noChanges: '这些 fellowship 任务已经在你的 Daymark 里了。',
            importedCount: (count) => `已新增 ${count} 个 fellowship 任务到你的工作区。`,
            setupTitle: 'Setup. Stand before the timeline.',
            liveTitle: (week) => `Week ${String(week).padStart(2, '0')}. Stand on the timeline.`,
            wrappedTitle: 'Wrapped. Review the evidence.',
            heroBody:
              '一条从 orientation 到 final wrap-up 的连续轨迹。Daymark 标出该交付什么、什么会重复出现、以及你现在站在哪里。',
            elapsed: 'ELAPSED',
            ofWeeks: (weeks) => `OF ${weeks} WEEKS`,
            kickoff: 'KICKOFF',
            daysUntil: (days) => `${days} DAYS TO START`,
            daysLeft: (days) => `${days} DAYS LEFT`,
            demo: 'WRAP-UP',
            windowEyebrow: 'NEXT WINDOW // OFFICIAL TIMELINE',
            windowTitle:
              position.phase === 'setup'
                ? 'Load the official path before kickoff.'
                : position.phase === 'wrapped'
                  ? 'The official timeline has already fully played out.'
                  : 'Keep the current fellowship week visible.',
            windowBody:
              position.phase === 'setup'
                ? '这里不会把当前日期误判成 fellowship 活动，只显示下一批真实 program 日期。'
                : position.phase === 'wrapped'
                  ? '现在更适合去 Review 页面看完成记录、focus 证据和交付轨迹。'
                  : '用这条 strip 看接下来最靠近你的官方 milestone，而不是把未来任务误读成今天发生。',
            loadLabel: 'PROGRAM',
            wrappedRow: 'Final wrap-up complete',
            rhythmEyebrow: 'RECURRING // WEEKLY RHYTHM',
            seriesLabel: 'SERIES',
            timeLabel: 'TIME',
            deliverableLabel: 'DELIVERABLE',
            detailEyebrow: 'DETAILS // PROFILE + CALENDAR',
            sourceLabel: 'Source',
            sourceText: 'Structured from the public Anote AI Research Fellowship repository.',
          }
        : {
            eyebrow: 'DAYMARK // FELLOWSHIP OS',
            cohort: 'COHORT 2026',
            importAction: 'Import timeline into Daymark',
            importedAction: 'Imported',
            statusBusy: 'Importing...',
            importedPrefix: 'Import result:',
            noChanges: 'Those fellowship tasks are already present in your Daymark workspace.',
            importedCount: (count) => `Added ${count} fellowship tasks into your workspace.`,
            setupTitle: 'Setup. Stand before the timeline.',
            liveTitle: (week) => `Week ${String(week).padStart(2, '0')}. Stand on the timeline.`,
            wrappedTitle: 'Wrapped. Review the evidence.',
            heroBody:
              'One continuous arc from orientation to final wrap-up. Daymark plots what is due, what repeats, and where you are on a single spine.',
            elapsed: 'ELAPSED',
            ofWeeks: (weeks) => `OF ${weeks} WEEKS`,
            kickoff: 'KICKOFF',
            daysUntil: (days) => `${days} DAYS TO START`,
            daysLeft: (days) => `${days} DAYS LEFT`,
            demo: 'WRAP-UP',
            windowEyebrow: 'NEXT WINDOW // OFFICIAL TIMELINE',
            windowTitle:
              position.phase === 'setup'
                ? 'Load the official path before kickoff.'
                : position.phase === 'wrapped'
                  ? 'The official timeline has already fully played out.'
                  : 'Keep the current fellowship week visible.',
            windowBody:
              position.phase === 'setup'
                ? 'This strip only shows the next real fellowship dates, without pretending today has program activity.'
                : position.phase === 'wrapped'
                  ? 'Review is the better surface now: completion history, focus evidence, and delivery trace.'
                  : 'Use this strip to see the official milestone nearest to you, without making future tasks look like they happen today.',
            loadLabel: 'PROGRAM',
            wrappedRow: 'Final wrap-up complete',
            rhythmEyebrow: 'RECURRING // WEEKLY RHYTHM',
            seriesLabel: 'SERIES',
            timeLabel: 'TIME',
            deliverableLabel: 'DELIVERABLE',
            detailEyebrow: 'DETAILS // PROFILE + CALENDAR',
            sourceLabel: 'Source',
            sourceText: 'Structured from the public Anote AI Research Fellowship repository.',
          }
    ),
    [lang, position.phase]
  );

  const heroTitle =
    position.phase === 'setup'
      ? copy.setupTitle
      : position.phase === 'wrapped'
        ? copy.wrappedTitle
        : copy.liveTitle(position.week);

  const handleImport = async () => {
    setIsImporting(true);
    setImportMessage('');
    try {
      const existingTasks = await getTasks('all', 'Fellowship:');
      const existingTitles = new Set(
        (existingTasks || []).flatMap((task) => fellowshipTitleVariants(task.title))
      );
      const pendingTasks = FELLOWSHIP_SEED_TASKS.filter(
        (task) => !fellowshipTitleVariants(task.title).some((title) => existingTitles.has(title))
      );

      if (!pendingTasks.length) {
        setImportMessage(copy.noChanges);
        setIsImporting(false);
        return;
      }

      for (const task of pendingTasks) {
        await createTask(
          task.title,
          task.description,
          task.priority,
          task.category,
          task.dueDate,
          task.taskKind,
          task.recurrenceWeekday
        );
      }

      window.dispatchEvent(new Event('dp-assistant-updated'));
      setImportMessage(copy.importedCount(pendingTasks.length));
    } catch (error) {
      setImportMessage(error.message || 'Failed to import fellowship tasks.');
    }
    setIsImporting(false);
  };

  return (
    <div className="space-y-5">
      <section className="board-card overflow-hidden px-6 pb-2 pt-8 lg:px-10 lg:pt-10">
        <div className="flex flex-wrap items-start justify-between gap-6 pb-2">
          <div>
            <div className="panel-label">{copy.eyebrow}</div>
            <div className="mt-3 flex flex-wrap items-center gap-3 font-[var(--mono)] text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              <span>{copy.cohort}</span>
              <span className="opacity-40">·</span>
              <span>{lang === 'zh' ? FELLOWSHIP_PROGRAM.datesZh : FELLOWSHIP_PROGRAM.dates}</span>
              <span className="opacity-40">·</span>
              <span>{lang === 'zh' ? FELLOWSHIP_PROGRAM.locationZh : FELLOWSHIP_PROGRAM.location}</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <button
              type="button"
              onClick={handleImport}
              disabled={isImporting}
              className="btn-primary !rounded-[20px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? copy.statusBusy : copy.importAction}
            </button>
            <div className="flex flex-wrap items-center gap-2 text-sm text-[color:var(--muted)] sm:justify-end">
              <span className="tech-chip">{copy.sourceLabel}</span>
              <span>{copy.sourceText}</span>
              <a
                href="https://github.com/anote-ai/Anote-AI-Research-Fellowship"
                target="_blank"
                rel="noreferrer"
                className="text-[color:var(--text)] underline underline-offset-4"
              >
                GitHub repo
              </a>
            </div>
          </div>
        </div>

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-center">
          <div>
            <h1 className="max-w-3xl text-[clamp(40px,5vw,72px)] leading-[0.96] tracking-[-0.055em] text-[color:var(--text)]">
              {heroTitle}{' '}
              <span className="text-[color:var(--muted)]">
                {position.phase === 'setup' ? 'Only real program dates.' : 'One spine, less noise.'}
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-7 text-[color:var(--muted)]">{copy.heroBody}</p>
          </div>

          <div>
            <div className="flex items-baseline gap-4">
              <div className="text-[clamp(88px,9vw,128px)] font-semibold leading-[0.85] tracking-[-0.07em] text-[color:var(--text)]">
                {position.progress}
                <span className="text-[clamp(36px,4vw,56px)] tracking-[-0.03em] text-[color:var(--muted)]">%</span>
              </div>
              <div className="flex flex-col gap-1 font-[var(--mono)] text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                <span>{copy.elapsed}</span>
                <span>{copy.ofWeeks(position.weeksTotal)}</span>
              </div>
            </div>
            <div className="mt-5 h-[3px] max-w-xl bg-[rgba(17,17,17,0.12)]">
              <div className="h-full bg-[color:var(--text)]" style={{ width: `${position.progress}%` }} />
            </div>
            <div className="mt-3 flex max-w-xl justify-between gap-3 font-[var(--mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
              <span>{copy.kickoff} · {formatShortDate(FELLOWSHIP_PROGRAM.startDate, lang)}</span>
              <span>
                {position.phase === 'setup'
                  ? copy.daysUntil(position.daysUntilStart)
                  : copy.daysLeft(position.daysLeft)}
              </span>
              <span>{copy.demo} · {formatShortDate(FELLOWSHIP_PROGRAM.endDate, lang)}</span>
            </div>
          </div>
        </div>

        <ProgramTimeline lang={lang} position={position} />

        {importMessage ? (
          <div className="mb-5 mt-2 rounded-[22px] border border-[color:var(--line)] bg-white/90 px-4 py-3 text-sm text-[color:var(--text)]">
            <span className="font-semibold">{copy.importedPrefix}</span> {importMessage}
          </div>
        ) : null}
      </section>

      <ProgramWindow copy={copy} lang={lang} position={position} upcoming={upcoming} />

      <WeeklyRhythm copy={copy} lang={lang} />

      <DeliverableCards copy={copy} lang={lang} />

      <section className="space-y-4">
        <div className="panel-label">{copy.detailEyebrow}</div>
        <FellowProfileCard />
        <FellowshipCalendar />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 px-2 font-[var(--mono)] text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted)]">
        <span>{FELLOWSHIP_PROGRAM.title} · {copy.cohort.toLowerCase()} · {FELLOWSHIP_PROGRAM.location}</span>
        <span>ET {formatFullDate(todayIso, lang)}</span>
      </div>
    </div>
  );
}

export default FellowshipPage;
