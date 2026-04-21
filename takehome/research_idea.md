# Draft Research Paper Idea

## Working Title

**Daymark-Anote: Evaluating AI-Assisted Planning Workflows for Long-Horizon Research Fellowship Programs**

## Core Question

Can an AI-assisted planning system help research fellows translate long-horizon program goals into daily plans, reviewable progress traces, and actionable evaluation signals?

More specifically:

- Can a planning assistant reduce the gap between a static fellowship calendar and what a fellow should do today?
- Can daily planning, task execution, and review artifacts become useful signals for measuring progress toward research and product deliverables?
- Can an assistant answer schedule and deliverable questions without distorting the underlying program timeline?

## Why It Matters

Research fellowships are often organized around long-horizon deliverables: a paper, a product contribution, and a final presentation. These deliverables are usually described in calendars, onboarding docs, and milestone trackers. The challenge is not that fellows lack information. The challenge is that the information is fragmented and does not automatically become a daily execution plan.

This creates several practical problems:

- Fellows may understand the final goals but struggle to decide what matters today.
- Program managers may see final outcomes but not the daily signals that explain why someone is ahead, blocked, or drifting.
- Static calendars do not capture deferrals, focus time, mood, task completion, or assistant interactions.
- AI assistants can answer questions, but without grounding in the program structure they may overgeneralize, hallucinate, or treat future tasks as if they belong to the current day.

Daymark-Anote explores whether an AI-assisted planning interface can convert a fellowship calendar into an operating system for daily execution and review.

## Proposed Methodology

The project uses Daymark-Anote as a working prototype. The system maps the Anote AI Research Fellowship into an existing planning product by adding:

- A Fellowship page that visualizes official milestones, recurring rituals, deliverables, and the current program position.
- A Today workflow that keeps the original daily planning loop intact while surfacing relevant fellowship context.
- A Review view that turns completed, deferred, planned, and focus activity into a progress trace.
- A concierge assistant that can answer fellowship schedule and deliverable questions while still operating on user tasks.
- Import logic that converts official fellowship milestones and recurring events into first-class tasks.

The evaluation would combine trace-based tests, scenario-based user tasks, and a small human study.

## Evaluation Plan

### 1. Schedule-grounding accuracy

Create a benchmark of fellowship schedule questions, such as:

- What happens today in the fellowship?
- What is due this week?
- When is the midpoint check-in?
- What are the final deliverables?
- What is my plan for next Tuesday?

Evaluate whether the assistant:

- Returns the correct date and event.
- Distinguishes recurring events from fixed milestones.
- Avoids answering unrelated task questions with fellowship boilerplate.
- Does not treat future tasks as if they belong to the selected review date.

### 2. Planning alignment

Compare two conditions:

- **Static calendar condition:** fellows use the public fellowship calendar and manually manage their work.
- **Daymark-Anote condition:** fellows import the timeline into Daymark-Anote and use the Today, Fellowship, Review, and concierge workflows.

Measure:

- Time required to produce a realistic daily plan.
- Percentage of daily tasks aligned with upcoming milestones.
- Number of missed or duplicated milestone tasks.
- Number of deferrals and whether they are visible in review.
- Fellow confidence in what to work on next.

### 3. Review and progress trace quality

Ask participants or reviewers to inspect weekly review artifacts and judge:

- Whether the system makes progress and drift visible.
- Whether the review view distinguishes actual activity from future scheduled work.
- Whether the trace is useful for mentor or PM check-ins.

### 4. Qualitative feedback

Interview users about:

- Whether the system helped them understand the fellowship timeline.
- Whether the assistant felt grounded or generic.
- Where the planning flow added value versus friction.
- What signals would be most useful to mentors and program managers.

## Anticipated Contribution

This work aims to contribute:

1. **A framing of fellowship planning as an AI-assisted evaluation workflow.** The system treats planning artifacts as signals, not just productivity data.
2. **A working prototype.** Daymark-Anote shows how a general daily planning app can be adapted into a domain-specific operating board.
3. **An evaluation protocol.** The proposed benchmark measures schedule grounding, planning alignment, and review trace quality.
4. **Design lessons for applied AI systems.** The project highlights why assistants should preserve user context, avoid generic fast-path hijacking, and keep long-horizon goals connected to daily execution.

## Current Prototype

The current implementation is available here:

https://github.com/Llawlietcyd/Daymark-Anote

It includes a working React/FastAPI prototype with fellowship-specific pages, task import, review flows, assistant behavior, and tests around schedule consistency.
