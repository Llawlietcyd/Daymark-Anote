import React, { useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  FELLOWSHIP_PROGRAM,
  EVENT_KIND_META,
  getEventsForDate,
  isoDate,
  parseIsoDate,
} from '../data/fellowshipProgram';

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];

const CALENDAR_MONTHS = [
  { year: 2026, month: 5, labelEn: 'June 2026', labelZh: '2026年6月' },
  { year: 2026, month: 6, labelEn: 'July 2026', labelZh: '2026年7月' },
  { year: 2026, month: 7, labelEn: 'August 2026', labelZh: '2026年8月' },
];

function formatDateLabel(value, lang) {
  const date = parseIsoDate(value);
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

function FellowshipCalendar() {
  const { lang } = useLanguage();
  const weekdays = lang === 'zh' ? WEEKDAYS_ZH : WEEKDAYS_EN;

  const todayIso = isoDate(new Date());
  const initialMonthIndex = useMemo(() => {
    const idx = CALENDAR_MONTHS.findIndex((m) => {
      const first = `${m.year}-${String(m.month + 1).padStart(2, '0')}-01`;
      const last = `${m.year}-${String(m.month + 1).padStart(2, '0')}-${new Date(m.year, m.month + 1, 0).getDate()}`;
      return todayIso >= first && todayIso <= last;
    });
    return idx >= 0 ? idx : 0;
  }, [todayIso]);

  const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (todayIso >= FELLOWSHIP_PROGRAM.startDate && todayIso <= FELLOWSHIP_PROGRAM.endDate) {
      return todayIso;
    }
    return FELLOWSHIP_PROGRAM.startDate;
  });

  const currentMonth = CALENDAR_MONTHS[monthIndex];
  const { year, month } = currentMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);

  const copy = useMemo(
    () => (
      lang === 'zh'
        ? {
            eyebrow: 'Program calendar',
            title: '整个 fellowship 在这里面',
            hint: '点击任何一天看当天的 standup、talk 或里程碑；浅底色代表项目进行中的日子。',
            prev: '上一月',
            next: '下一月',
            empty: '这一天在 fellowship 窗口里没有固定安排。你可以自己排产品 sprint 的工作。',
            todayTag: '今天',
            outOfRange: '不在项目周期内',
            detailTitle: (dateLabel) => `${dateLabel} 当天发生什么`,
            rhythmHeading: '颜色图例',
          }
        : {
            eyebrow: 'Program calendar',
            title: 'The whole fellowship fits inside one board',
            hint: 'Click any day to see its standup, talk, or milestone. Shaded cells mark days that fall inside the program.',
            prev: 'Prev',
            next: 'Next',
            empty: 'No fixed fellowship event for this day. Use it for your own product sprint work.',
            todayTag: 'Today',
            outOfRange: 'Outside program window',
            detailTitle: (dateLabel) => `What happens on ${dateLabel}`,
            rhythmHeading: 'Legend',
          }
    ),
    [lang]
  );

  const selectedEvents = useMemo(() => getEventsForDate(selectedDate), [selectedDate]);
  const selectedInRange =
    selectedDate >= FELLOWSHIP_PROGRAM.startDate && selectedDate <= FELLOWSHIP_PROGRAM.endDate;

  const legendItems = useMemo(
    () => [
      { kind: 'research', label: lang === 'zh' ? '研究 Standup' : 'Research standup' },
      { kind: 'product', label: lang === 'zh' ? '产品 Standup' : 'Product standup' },
      { kind: 'talk', label: lang === 'zh' ? '周五讲座' : 'Friday talk' },
      { kind: 'milestone', label: lang === 'zh' ? '交付里程碑' : 'Deliverable milestone' },
      { kind: 'anchor', label: lang === 'zh' ? '大日子' : 'Anchor day' },
    ],
    [lang]
  );

  return (
    <div className="space-y-4">
      <section className="card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="panel-label">{copy.eyebrow}</div>
            <h2 className="mt-2 text-[26px] leading-tight text-[color:var(--text)]">{copy.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[color:var(--muted)]">{copy.hint}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}
              disabled={monthIndex === 0}
              className="btn-ghost !rounded-[16px] !px-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← {copy.prev}
            </button>
            <div className="rounded-[18px] border border-[color:var(--line)] bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--text)]">
              {lang === 'zh' ? currentMonth.labelZh : currentMonth.labelEn}
            </div>
            <button
              type="button"
              onClick={() => setMonthIndex((i) => Math.min(CALENDAR_MONTHS.length - 1, i + 1))}
              disabled={monthIndex === CALENDAR_MONTHS.length - 1}
              className="btn-ghost !rounded-[16px] !px-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copy.next} →
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2 text-center">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--muted)]"
            >
              {day}
            </div>
          ))}

          {cells.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} />;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = getEventsForDate(dateStr);
            const inRange =
              dateStr >= FELLOWSHIP_PROGRAM.startDate && dateStr <= FELLOWSHIP_PROGRAM.endDate;
            const isToday = dateStr === todayIso;
            const isSelected = dateStr === selectedDate;
            const hasAnchor = events.some((e) => e.kind === 'anchor' || e.kind === 'milestone');

            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`relative flex min-h-[76px] flex-col items-start rounded-[18px] border px-2 py-2 text-left transition-all ${
                  isSelected
                    ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft,rgba(200,77,47,0.08))]'
                    : inRange
                      ? 'border-[color:var(--line)] bg-white/70 hover:border-[color:var(--line-strong)]'
                      : 'border-transparent bg-transparent text-[color:var(--muted)] opacity-60'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={`text-sm font-semibold ${
                      isToday ? 'text-[color:var(--accent)]' : 'text-[color:var(--text)]'
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="rounded-full border border-[color:var(--accent)] bg-white/70 px-1.5 py-[1px] text-[9px] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">
                      {copy.todayTag}
                    </span>
                  )}
                </div>

                {events.length > 0 && (
                  <div className="mt-1 flex w-full flex-col gap-1">
                    {events.slice(0, 3).map((event) => {
                      const meta = EVENT_KIND_META[event.kind] || EVENT_KIND_META.anchor;
                      const chipLabel = lang === 'zh'
                        ? (event.shortLabelZh || event.shortLabel || event.labelZh || event.label)
                        : (event.shortLabel || event.label);
                      const titleLabel = lang === 'zh' ? (event.labelZh || event.label) : event.label;
                      return (
                        <span
                          key={event.id}
                          className={`truncate rounded-[8px] px-1.5 py-[2px] text-[10px] font-medium leading-tight ${
                            event.kind === 'anchor' || event.kind === 'milestone'
                              ? 'text-white'
                              : 'text-[color:var(--text)]'
                          }`}
                          style={{
                            backgroundColor:
                              event.kind === 'anchor' || event.kind === 'milestone'
                                ? meta.accent
                                : 'rgba(255,255,255,0.85)',
                            border: `1px solid ${meta.accent}`,
                            color:
                              event.kind === 'anchor' || event.kind === 'milestone'
                                ? '#fff'
                                : meta.accent,
                          }}
                          title={titleLabel}
                        >
                          {chipLabel}
                        </span>
                      );
                    })}
                    {events.length > 3 && (
                      <span className="text-[10px] text-[color:var(--muted)]">
                        +{events.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {hasAnchor && !isSelected && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 border-t border-[color:var(--line)] pt-4 text-[11px] text-[color:var(--muted)]">
          <span className="font-semibold uppercase tracking-[0.16em]">{copy.rhythmHeading}</span>
          {legendItems.map((item) => {
            const meta = EVENT_KIND_META[item.kind];
            return (
              <span key={item.kind} className="inline-flex items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: meta.accent }}
                />
                {item.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="card">
        <div className="panel-label">
          {copy.detailTitle(formatDateLabel(selectedDate, lang))}
        </div>

        {!selectedInRange && (
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{copy.outOfRange}</p>
        )}

        {selectedInRange && selectedEvents.length === 0 && (
          <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{copy.empty}</p>
        )}

        {selectedEvents.length > 0 && (
          <div className="mt-4 space-y-3">
            {selectedEvents.map((event) => {
              const meta = EVENT_KIND_META[event.kind] || EVENT_KIND_META.anchor;
              const evLabel = lang === 'zh' ? (event.labelZh || event.label) : event.label;
              const evLocation = lang === 'zh' ? (event.locationZh || event.location) : event.location;
              const evDescription = lang === 'zh' ? (event.descriptionZh || event.description) : event.description;
              const evNote = lang === 'zh' ? (event.noteZh || event.note) : event.note;
              return (
                <div
                  key={event.id}
                  className="rounded-[20px] border border-[color:var(--line)] bg-white/80 p-4"
                  style={{ borderLeft: `4px solid ${meta.accent}` }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-[color:var(--text)]">
                      {evLabel}
                    </h3>
                    <span
                      className="rounded-full px-2.5 py-[2px] text-[11px] font-semibold uppercase tracking-[0.14em]"
                      style={{ backgroundColor: `${meta.accent}1A`, color: meta.accent }}
                    >
                      {lang === 'zh' ? meta.toneZh : meta.toneEn}
                    </span>
                  </div>
                  <p className="mt-1 font-[var(--mono)] text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    {event.time}
                    {evLocation ? ` · ${evLocation}` : ''}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {evDescription}
                  </p>
                  {evNote && (
                    <p className="mt-2 rounded-[14px] bg-[color:var(--surface-muted,rgba(0,0,0,0.03))] px-3 py-2 text-[13px] leading-6 text-[color:var(--text)]">
                      {evNote}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default FellowshipCalendar;
