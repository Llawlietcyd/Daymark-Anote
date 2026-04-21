# Turning a Fellowship Calendar into an AI Planning System

Most fellowship programs begin with a calendar.

The calendar is useful. It tells fellows when orientation happens, when standups repeat, when the midpoint review lands, and when the final presentation is due. But a calendar does not answer the question that matters every morning:

**What should I do today so that the long-term work actually moves forward?**

That question is harder than it sounds. A research fellowship has multiple layers of work happening at once. There is a paper to shape, a product contribution to ship, a final presentation to prepare, and recurring meetings that keep the cohort aligned. The official schedule explains the structure, but fellows still have to translate that structure into daily action.

Daymark-Anote is my attempt to explore what happens when a fellowship calendar becomes an operating board instead of a static document.

## The Problem with Static Program Schedules

Static schedules are good at showing dates. They are weaker at showing momentum.

A fellow might know that the abstract draft is due on June 23, but that does not automatically tell them what to do on June 10. A product standup might happen every Thursday, but the calendar does not remember whether the fellow made progress since last week. A mentor might ask how the project is going, but the answer often depends on scattered notes, half-finished tasks, and memory.

The deeper issue is that long-horizon work creates a translation problem:

- Program goals need to become weekly priorities.
- Weekly priorities need to become daily plans.
- Daily work needs to leave evidence.
- Evidence needs to become review and adjustment.

Most tools only handle one piece of that loop.

## What Daymark-Anote Does

Daymark started as a personal planning product focused on daily execution, review, mood, focus, and an AI concierge. For this take-home, I adapted it into a fellowship-specific system for the Anote AI Research Fellowship.

The modified version adds a dedicated Fellowship page that maps the official program timeline into the app. Milestones, recurring standups, final deliverables, and important program events become part of the planning system instead of living only in a markdown calendar.

The app keeps the original Today workflow intact. That was important to me. The goal was not to replace daily planning with a fellowship dashboard. The goal was to connect the fellowship context to the planning loop that already existed.

In practice, the system supports four surfaces:

- **Fellowship:** a program board showing the long-horizon timeline, recurring rhythm, deliverables, and calendar.
- **Today:** a daily task stack where the user decides what actually belongs in the current day.
- **Review:** a place to inspect what was planned, completed, deferred, deleted, and focused on over time.
- **Concierge:** an assistant that can answer questions about the app and the fellowship schedule.

The important design choice is that the app does not treat the fellowship calendar as decoration. It turns the calendar into structured state that can influence planning and review.

## Why AI Matters Here

An AI assistant is useful only if it is grounded in the right context.

For example, if a fellow asks, “What happens this week in the fellowship?”, the assistant should answer from the actual program calendar. If they ask, “What is my plan for next Tuesday?”, the assistant should look at their tasks. Those sound similar, but they are not the same question.

This distinction matters because planning assistants can easily become too generic. They can answer with motivational boilerplate, confuse future tasks with today’s work, or override the user’s actual task data with program-level summaries.

Daymark-Anote treats this as a product and evaluation problem. The assistant should:

- Know the official fellowship timeline.
- Respect the user’s actual task state.
- Avoid duplicating imported milestones.
- Preserve account boundaries when multiple users share the same browser.
- Keep review history accurate instead of making future work look like past activity.

Those details are not glamorous, but they are what make an AI planning system trustworthy.

## A Research Framing

The research question behind Daymark-Anote is:

**Can an AI-assisted planning system help research fellows translate long-horizon program goals into daily plans, reviewable progress traces, and actionable evaluation signals?**

This is not a traditional model benchmark. It is an applied AI systems question. The system is valuable if it helps fellows make better planning decisions and gives mentors or program managers clearer signals about progress.

A possible evaluation would compare a static calendar workflow against the Daymark-Anote workflow. We could measure how quickly fellows create realistic daily plans, how often their tasks align with upcoming milestones, whether review artifacts reveal drift earlier, and whether the assistant answers schedule questions accurately.

The goal is not to prove that AI can “manage” a research fellowship. The goal is to explore whether AI can reduce the gap between long-term goals and daily execution.

## What I Learned from Building It

The biggest lesson was that turning a calendar into a system requires more than importing dates.

A static calendar can tolerate ambiguity. A planning system cannot. If a milestone is renamed, duplicate detection needs to handle it. If an event is both an anchor event and a milestone, the calendar should not show it twice. If a task was completed or deleted, the review page still needs to remember that it existed. If a timer or profile is stored locally, it needs to be scoped to the current user.

These are small product details, but they are also research details. They determine whether the system produces trustworthy signals.

That is why I think Daymark-Anote is interesting as an applied AI systems prototype. It is not just a dashboard for a fellowship. It is a testbed for studying how AI-assisted planning tools can support long-horizon work without losing the human context that makes planning meaningful.

## Closing Thought

A good fellowship calendar tells you where the program is going.

A good planning system helps you decide what to do today.

The space between those two things is where Daymark-Anote lives.
