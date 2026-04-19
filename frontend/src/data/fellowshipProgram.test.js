import {
  FELLOWSHIP_PROGRAM,
  FELLOWSHIP_SEED_TASKS,
  fellowshipTitleVariants,
  getEventsForDate,
} from './fellowshipProgram';

describe('fellowshipTitleVariants', () => {
  it('treats refinement and polish milestone titles as aliases', () => {
    const refinementTitle = 'Fellowship: Final paper refinement and arXiv prep';
    const polishTitle = 'Fellowship: Final paper polish and arXiv prep';

    expect(fellowshipTitleVariants(refinementTitle)).toContain(refinementTitle);
    expect(fellowshipTitleVariants(refinementTitle)).toContain(polishTitle);
    expect(fellowshipTitleVariants(polishTitle)).toContain(polishTitle);
    expect(fellowshipTitleVariants(polishTitle)).toContain(refinementTitle);
  });
});

describe('getEventsForDate', () => {
  it('does not duplicate anchor-backed milestone dates', () => {
    const midpointEvents = getEventsForDate('2026-07-01');
    const finalPresentationEvents = getEventsForDate('2026-08-05');

    expect(midpointEvents.filter((event) => event.source === 'anchor')).toHaveLength(1);
    expect(midpointEvents.filter((event) => event.source === 'milestone')).toHaveLength(0);
    expect(finalPresentationEvents.filter((event) => event.source === 'anchor')).toHaveLength(1);
    expect(finalPresentationEvents.filter((event) => event.source === 'milestone')).toHaveLength(0);
  });
});

describe('fellowship schedule consistency', () => {
  it('keeps fixed milestone dates aligned with imported tasks', () => {
    const seedDueDatesByTitle = new Map(
      FELLOWSHIP_SEED_TASKS
        .filter((task) => task.dueDate)
        .map((task) => [task.title, task.dueDate])
    );

    expect(seedDueDatesByTitle.get('Fellowship: Attend orientation and kickoff')).toBe('2026-06-01');
    expect(seedDueDatesByTitle.get('Fellowship: Midpoint one-on-one with Natan')).toBe('2026-07-01');
    expect(seedDueDatesByTitle.get('Fellowship: Prepare final presentation')).toBe('2026-08-05');
    expect(seedDueDatesByTitle.get('Fellowship: Ship product contribution and final docs')).toBe('2026-08-10');

    expect(FELLOWSHIP_PROGRAM.anchorEvents.find((event) => event.id === 'orientation-event').date).toBe('2026-06-01');
    expect(FELLOWSHIP_PROGRAM.anchorEvents.find((event) => event.id === 'midpoint-event').date).toBe('2026-07-01');
    expect(FELLOWSHIP_PROGRAM.anchorEvents.find((event) => event.id === 'final-presentations-event').date).toBe('2026-08-05');
    expect(FELLOWSHIP_PROGRAM.anchorEvents.find((event) => event.id === 'last-day').date).toBe('2026-08-10');
  });

  it('keeps recurring event weekdays aligned with weekly task recurrence weekdays', () => {
    const weeklyTasks = new Map(
      FELLOWSHIP_SEED_TASKS
        .filter((task) => task.taskKind === 'weekly')
        .map((task) => [task.title, task.recurrenceWeekday])
    );
    const taskWeekdayFromJsWeekday = (weekday) => (weekday + 6) % 7;

    expect(taskWeekdayFromJsWeekday(FELLOWSHIP_PROGRAM.recurringEvents[0].weekday)).toBe(
      weeklyTasks.get('Fellowship: Join weekly AI Research Standup')
    );
    expect(taskWeekdayFromJsWeekday(FELLOWSHIP_PROGRAM.recurringEvents[1].weekday)).toBe(
      weeklyTasks.get('Fellowship: Join weekly AI Product Standup')
    );
    expect(taskWeekdayFromJsWeekday(FELLOWSHIP_PROGRAM.recurringEvents[2].weekday)).toBe(
      weeklyTasks.get('Fellowship: Join Friday fellowship talk')
    );
  });
});
