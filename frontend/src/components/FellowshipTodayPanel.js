import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { createTask, getTasks } from '../http/api';
import { ROUTE_CONSTANTS } from '../constants/RouteConstants';
import { useLanguage } from '../i18n/LanguageContext';
import {
  EVENT_KIND_META,
  FELLOWSHIP_PROGRAM,
  FELLOWSHIP_SEED_TASKS,
  fellowshipTitleVariants,
  getEventsForDate,
} from '../data/fellowshipProgram';
import { useSession } from './SessionContext';
import { readFellowProfile } from './FellowProfileCard';

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDateLabel(value, lang) {
  const date = parseIsoDate(value);
  if (lang === 'zh') {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function diffDays(fromDate, toDate) {
  const ms = parseIsoDate(toDate).getTime() - fromDate.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function FellowshipTodayPanel({ onImported }) {
  const { lang } = useLanguage();
  const { session } = useSession();
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');
  const [fellowshipTaskCount, setFellowshipTaskCount] = useState(0);

  const today = useMemo(() => new Date(), []);
  const todayKey = useMemo(() => isoDate(today), [today]);
  const userId = session?.user_id || null;
  const [fellowProfile, setFellowProfile] = useState(() => readFellowProfile(userId));

  useEffect(() => {
    const handleProfileChange = (event) => {
      if (!event?.detail || event.detail.userId === userId) {
        setFellowProfile(event?.detail?.profile || readFellowProfile(userId));
      }
    };
    window.addEventListener('dp-fellow-profile-updated', handleProfileChange);
    return () => window.removeEventListener('dp-fellow-profile-updated', handleProfileChange);
  }, [userId]);

  useEffect(() => {
    setFellowProfile(readFellowProfile(userId));
  }, [userId]);

  const copy = useMemo(
    () => (
      lang === 'zh'
        ? {
            eyebrow: '项目节奏',
            title: '把今天放回 fellowship 的真实上下文里',
            prestart: '距离项目开始还有',
            active: '项目进行中',
            ended: '项目已结束',
            days: '天',
            importAction: '导入官方里程碑',
            importing: '导入中...',
            importedCount: (count) => `当前 workspace 里已经有 ${count} 个 fellowship 任务。`,
            importedFresh: (count) => `已导入 ${count} 个 fellowship 任务。`,
            noChanges: 'fellowship 任务已经都在当前工作区里了。',
            currentContext: '当前上下文',
            todayAgenda: '今天的固定安排',
            noTodayAgenda: '今天没有固定活动，属于自主推进 paper / product 的时间块。',
            nextMilestone: '下一个官方节点',
            weeklyRhythm: '本周固定节奏',
            profilePaper: '论文',
            profileProduct: '产品',
            profileVenue: '投稿目标',
            profileEmpty: '还没设置 fellow profile。',
            configureProfile: '设置 profile',
            viewProgram: '查看完整项目页',
            viewReview: '去看复盘',
            prestartNote: '现在是 runway mode：先把官方时间线、你的 paper / product 方向和演示任务对齐。',
            activeNote: 'Today 应该优先告诉你现在要推进什么，而不是把整条时间线都重新讲一遍。',
            endedNote: '项目已经收尾，这里更像 handoff 和 final review 的控制台。',
            phaseLabel: '模式',
            importedLabel: '官方任务',
            daysAway: (count) => `${count} 天后`,
            daysPast: (count) => `${count} 天前`,
            todayOnly: '今天',
          }
        : {
            eyebrow: 'Program pulse',
            title: 'Put today back into the real fellowship context',
            prestart: 'Days until the program starts',
            active: 'Program in progress',
            ended: 'Program wrapped',
            days: 'days',
            importAction: 'Import official milestones',
            importing: 'Importing...',
            importedCount: (count) => `${count} fellowship task(s) are already in this workspace.`,
            importedFresh: (count) => `Imported ${count} fellowship task(s).`,
            noChanges: 'The fellowship tasks are already present in this workspace.',
            currentContext: 'Current context',
            todayAgenda: "Today's fixed rhythm",
            noTodayAgenda: 'No fixed event today — this block is yours for paper or product work.',
            nextMilestone: 'Next official checkpoint',
            weeklyRhythm: 'This week\'s rhythm',
            profilePaper: 'Paper',
            profileProduct: 'Product',
            profileVenue: 'Venue',
            profileEmpty: 'Fellow profile not set yet.',
            configureProfile: 'Set profile',
            viewProgram: 'Open fellowship page',
            viewReview: 'Open review',
            prestartNote: 'This is runway mode: align the official timeline, your paper/product direction, and the demo tasks before kickoff.',
            activeNote: 'Today should tell you what to move now, not repeat the whole timeline at the top of the page.',
            endedNote: 'The program is wrapped, so this reads more like a handoff and final review console.',
            phaseLabel: 'Mode',
            importedLabel: 'Official tasks',
            daysAway: (count) => `In ${count} day(s)`,
            daysPast: (count) => `${count} day(s) ago`,
            todayOnly: 'Today',
          }
    ),
    [lang]
  );

  useEffect(() => {
    let active = true;
    async function loadFellowshipTasks() {
      setLoading(true);
      try {
        const tasks = await getTasks('all', 'Fellowship:');
        if (!active) return;
        setFellowshipTaskCount((tasks || []).length);
      } catch {
        if (!active) return;
        setFellowshipTaskCount(0);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadFellowshipTasks();
    return () => {
      active = false;
    };
  }, []);

  const startDate = '2026-06-01';
  const endDate = '2026-08-10';
  const phase = todayKey < startDate ? 'prestart' : todayKey > endDate ? 'ended' : 'active';
  const daysUntilStart = diffDays(today, startDate);

  const nextMilestones = useMemo(() => {
    const source = FELLOWSHIP_PROGRAM.milestones.filter((item) => item.date >= todayKey);
    return (source.length ? source : FELLOWSHIP_PROGRAM.milestones.slice(-3)).slice(0, 3);
  }, [todayKey]);
  const nextMilestone = nextMilestones[0] || null;

  const todayEvents = useMemo(() => getEventsForDate(todayKey), [todayKey]);
  const weeklyRhythm = useMemo(
    () => FELLOWSHIP_PROGRAM.recurringEvents.map((item) => ({
      id: item.id,
      label: lang === 'zh' ? (item.labelZh || item.label) : item.label,
      cadence: lang === 'zh' ? (item.cadenceZh || item.cadence) : item.cadence,
      tone: lang === 'zh' ? (item.toneZh || item.tone) : item.tone,
    })),
    [lang]
  );

  const note =
    phase === 'prestart'
      ? copy.prestartNote
      : phase === 'active'
        ? copy.activeNote
        : copy.endedNote;

  const milestoneDelta = nextMilestone ? diffDays(today, nextMilestone.date) : null;
  const milestoneDeltaLabel = milestoneDelta == null
    ? ''
    : milestoneDelta === 0
      ? copy.todayOnly
      : milestoneDelta > 0
        ? copy.daysAway(milestoneDelta)
        : copy.daysPast(Math.abs(milestoneDelta));

  async function handleImport() {
    setImporting(true);
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
        setFellowshipTaskCount((existingTasks || []).length);
        setImporting(false);
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

      const newCount = (existingTasks || []).length + pendingTasks.length;
      setFellowshipTaskCount(newCount);
      setImportMessage(copy.importedFresh(pendingTasks.length));
      window.dispatchEvent(new Event('dp-assistant-updated'));
      if (onImported) onImported();
    } catch (error) {
      setImportMessage(error.message || 'Import failed.');
    }
    setImporting(false);
  }

  return (
    <section className="board-card overflow-hidden px-5 py-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="panel-label">{copy.eyebrow}</div>
          <h2 className="mt-3 text-[32px] leading-[0.98] text-[color:var(--text)]">{copy.title}</h2>
          <p className="mt-3 max-w-[50rem] text-sm leading-6 text-[color:var(--muted)]">{note}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span className="tech-chip">
              {phase === 'prestart' ? `${copy.prestart}: ${daysUntilStart} ${copy.days}` : phase === 'active' ? copy.active : copy.ended}
            </span>
            {!loading && fellowshipTaskCount > 0 ? (
              <span>
                {copy.importedLabel}: {fellowshipTaskCount}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {importing ? copy.importing : copy.importAction}
          </button>
          <Link to={ROUTE_CONSTANTS.FELLOWSHIP} className="btn-ghost">
            {fellowProfile.researchTopic || fellowProfile.assignedProduct || fellowProfile.paperTarget
              ? copy.viewProgram
              : copy.configureProfile}
          </Link>
          <Link to={ROUTE_CONSTANTS.REVIEW} className="btn-ghost">
            {copy.viewReview}
          </Link>
        </div>
      </div>

      {importMessage ? (
        <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-white/90 px-4 py-3 text-sm text-[color:var(--text)]">
          {importMessage}
        </div>
      ) : null}

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/82 p-4">
          <div className="panel-label">{copy.nextMilestone}</div>
          {nextMilestone ? (
            <div className="mt-3 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg text-[color:var(--text)]">{lang === 'zh' ? (nextMilestone.labelZh || nextMilestone.label) : nextMilestone.label}</h3>
                <span className="tech-chip">{formatDateLabel(nextMilestone.date, lang)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{lang === 'zh' ? (nextMilestone.descriptionZh || nextMilestone.description) : nextMilestone.description}</p>
              <div className="mt-3 font-[var(--mono)] text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                {milestoneDeltaLabel}
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/82 p-4">
          <div className="panel-label">{copy.weeklyRhythm}</div>
          <div className="mt-3 space-y-3">
            {weeklyRhythm.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-[color:var(--text)]">{item.label}</div>
                  <span className="tech-chip">{item.tone}</span>
                </div>
                <div className="mt-2 font-[var(--mono)] text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                  {item.cadence}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[color:var(--line)] bg-white/82 p-4">
          <div className="panel-label">{copy.currentContext}</div>
          {(fellowProfile.researchTopic || fellowProfile.assignedProduct || fellowProfile.paperTarget) ? (
            <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
              {fellowProfile.researchTopic && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-2.5 py-1 text-[color:var(--text)]">
                  <span className="font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{copy.profilePaper}</span>
                  {fellowProfile.researchTopic}
                </span>
              )}
              {fellowProfile.assignedProduct && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-2.5 py-1 text-[color:var(--text)]">
                  <span className="font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{copy.profileProduct}</span>
                  {fellowProfile.assignedProduct}
                </span>
              )}
              {fellowProfile.paperTarget && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-2.5 py-1 text-[color:var(--text)]">
                  <span className="font-semibold uppercase tracking-[0.14em] text-[color:var(--muted)]">{copy.profileVenue}</span>
                  {fellowProfile.paperTarget}
                </span>
              )}
            </div>
          ) : (
            <div className="mt-3 rounded-[20px] border border-dashed border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3">
              <p className="text-sm leading-6 text-[color:var(--muted)]">{copy.profileEmpty}</p>
              <Link to={ROUTE_CONSTANTS.FELLOWSHIP} className="btn-ghost mt-3 inline-flex !rounded-[16px] !px-3 !py-2">
                {copy.configureProfile}
              </Link>
            </div>
          )}

          <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-muted)] px-4 py-3">
            <div className="panel-label">{copy.todayAgenda}</div>
            {phase === 'active' && todayEvents.length > 0 ? (
              <div className="mt-3 space-y-2">
                {todayEvents.map((event) => {
                  const meta = EVENT_KIND_META[event.kind] || EVENT_KIND_META.anchor;
                  const eventLabel = lang === 'zh' ? (event.labelZh || event.label) : event.label;
                  const eventLocation = lang === 'zh' ? (event.locationZh || event.location) : event.location;
                  return (
                    <div key={event.id} className="rounded-[16px] border bg-white/90 px-3 py-2" style={{ borderColor: `${meta.accent}40` }}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold text-[color:var(--text)]">{eventLabel}</div>
                        <span className="tech-chip">{lang === 'zh' ? meta.toneZh : meta.toneEn}</span>
                      </div>
                      <div className="mt-2 font-[var(--mono)] text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                        {event.time}
                        {eventLocation ? ` · ${eventLocation}` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{copy.noTodayAgenda}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FellowshipTodayPanel;
