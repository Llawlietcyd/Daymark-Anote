from __future__ import annotations

import json
from datetime import date, datetime, time, timedelta, timezone

from core.time import local_today
from database.models import (
    AppSetting,
    DailyPlan,
    FocusSession,
    HistoryAction,
    MoodEntry,
    PlanTask,
    PlanTaskStatus,
    Task,
    TaskHistory,
    TaskStatus,
    User,
    UserSession,
)

FELLOWSHIP_DEMO_USERNAME = "fellow-demo"
FELLOWSHIP_DEMO_PASSWORD = "daymark2026"
FELLOWSHIP_DEMO_BIRTHDAY = "2001-09-09"
FELLOWSHIP_DEMO_GENDER = "prefer_not_to_say"

_FELLOWSHIP_TASK_SPECS = [
    {
        "title": "Fellowship: Attend orientation and kickoff",
        "description": "Welcome remarks, assign product and research topics, and collect all setup links.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-06-01",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Join weekly AI Research Standup",
        "description": "Recurring Tuesday research standup throughout the fellowship.",
        "priority": 3,
        "category": "core",
        "task_kind": "weekly",
        "recurrence_weekday": 1,
    },
    {
        "title": "Fellowship: Join weekly AI Product Standup",
        "description": "Recurring Thursday product standup throughout the fellowship.",
        "priority": 3,
        "category": "core",
        "task_kind": "weekly",
        "recurrence_weekday": 3,
    },
    {
        "title": "Fellowship: Join Friday fellowship talk",
        "description": "Recurring Friday guest talk with in-person NYC expectation.",
        "priority": 3,
        "category": "core",
        "task_kind": "weekly",
        "recurrence_weekday": 4,
    },
    {
        "title": "Fellowship: Submit research topic proposal",
        "description": "Choose the paper direction and share the proposal in standup.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-06-09",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Draft abstract and outline",
        "description": "Prepare the abstract / outline milestone for week 4.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-06-23",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Midpoint one-on-one with Natan",
        "description": "Discuss research progress, product contribution, and blockers.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-07-01",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Finish methodology / experiments section",
        "description": "Have the methodology and experiments section ready by week 7.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-07-14",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Share full paper draft for review",
        "description": "Send the full draft to the team for week 8 review.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-07-21",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Revise paper and lock submission target",
        "description": "Incorporate peer feedback and confirm the conference / journal target.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-07-28",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Final paper refinement and arXiv prep",
        "description": "Refine the final version and confirm submission readiness.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-08-04",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Prepare final presentation",
        "description": "Finalize the Anote-themed deck for the recorded presentation day.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-08-05",
        "task_kind": "temporary",
    },
    {
        "title": "Fellowship: Ship product contribution and final docs",
        "description": "Ensure product PRs, README updates, and handoff docs are completed.",
        "priority": 5,
        "category": "core",
        "due_date": "2026-08-10",
        "task_kind": "temporary",
    },
]

_PREP_TASK_SPECS = [
    {
        "title": "Take-home: Review the fellowship repo and extract the official timeline",
        "description": "Turn the public repo into concrete milestones, rituals, and deliverables for the take-home demo.",
        "priority": 4,
        "category": "core",
        "task_kind": "temporary",
        "offset_days": -4,
        "status": TaskStatus.COMPLETED.value,
        "complete_offset_days": -3,
    },
    {
        "title": "Take-home: Map Daymark screens to the fellowship workflow",
        "description": "Decide how Today, Fellowship, and Review should reflect the program operating model.",
        "priority": 4,
        "category": "core",
        "task_kind": "temporary",
        "offset_days": -3,
        "status": TaskStatus.COMPLETED.value,
        "complete_offset_days": -2,
    },
    {
        "title": "Take-home: Tighten fellowship Q&A handling",
        "description": "Make sure the assistant can answer deliverables, midpoint, and schedule questions cleanly.",
        "priority": 5,
        "category": "core",
        "task_kind": "temporary",
        "offset_days": -2,
        "due_offset_days": 1,
        "status": TaskStatus.ACTIVE.value,
    },
    {
        "title": "Take-home: Capture the demo walkthrough",
        "description": "Write the 2-minute narration for the Daymark-to-fellowship product adaptation demo.",
        "priority": 3,
        "category": "unclassified",
        "task_kind": "temporary",
        "offset_days": -1,
        "due_offset_days": 2,
        "status": TaskStatus.ACTIVE.value,
    },
    {
        "title": "Take-home: Draft mentor questions for the midpoint review",
        "description": "Collect the questions to ask about paper scope, product contribution, and evaluation criteria.",
        "priority": 3,
        "category": "unclassified",
        "task_kind": "temporary",
        "offset_days": -1,
        "due_offset_days": 3,
        "status": TaskStatus.ACTIVE.value,
    },
]


def _stamp(day: date, hour: int, minute: int = 0) -> datetime:
    return datetime.combine(day, time(hour=hour, minute=minute), tzinfo=timezone.utc)


def _upsert_json_setting(db, key: str, payload: dict) -> None:
    value = json.dumps(payload, ensure_ascii=False)
    row = db.query(AppSetting).filter(AppSetting.key == key).first()
    if row:
        row.value = value
    else:
        db.add(AppSetting(key=key, value=value))
    db.flush()


def _clear_user_workspace(db, user_id: int) -> None:
    db.query(UserSession).filter(UserSession.user_id == user_id).delete(synchronize_session=False)
    db.query(MoodEntry).filter(MoodEntry.user_id == user_id).delete(synchronize_session=False)
    db.query(FocusSession).filter(FocusSession.user_id == user_id).delete(synchronize_session=False)

    task_ids = [row.id for row in db.query(Task.id).filter(Task.user_id == user_id).all()]
    if task_ids:
        db.query(TaskHistory).filter(TaskHistory.task_id.in_(task_ids)).delete(synchronize_session=False)
        db.query(Task).filter(Task.id.in_(task_ids)).delete(synchronize_session=False)

    plan_ids = [
        row.id
        for row in db.query(DailyPlan.id, DailyPlan.date).all()
        if str(row.date).startswith(f"{user_id}:")
    ]
    if plan_ids:
        db.query(PlanTask).filter(PlanTask.plan_id.in_(plan_ids)).delete(synchronize_session=False)
        db.query(DailyPlan).filter(DailyPlan.id.in_(plan_ids)).delete(synchronize_session=False)

    prefixes = [
        f"prototype_onboarding:{user_id}",
        f"assistant_profile:{user_id}",
        f"assistant_history:{user_id}",
        f"assistant_pending:{user_id}",
    ]
    db.query(AppSetting).filter(AppSetting.key.in_(prefixes)).delete(synchronize_session=False)
    db.flush()


def _add_history(db, task: Task, day: date, action: str, reasoning: str, hour: int, minute: int = 0) -> None:
    db.add(
        TaskHistory(
            task_id=task.id,
            date=day.isoformat(),
            action=action,
            ai_reasoning=reasoning,
            created_at=_stamp(day, hour, minute),
        )
    )


def _create_task(
    db,
    *,
    user_id: int,
    title: str,
    description: str,
    priority: int,
    category: str,
    task_kind: str,
    created_day: date,
    sort_order: int,
    due_date: str | None = None,
    recurrence_weekday: int | None = None,
    status: str = TaskStatus.ACTIVE.value,
    complete_day: date | None = None,
) -> Task:
    task = Task(
        user_id=user_id,
        title=title,
        description=description,
        priority=priority,
        category=category,
        source="ai",
        task_kind=task_kind,
        recurrence_weekday=recurrence_weekday,
        status=status,
        due_date=due_date,
        sort_order=sort_order,
        decision_reason="Seeded for the fellowship showcase workspace.",
        created_at=_stamp(created_day, 9, 0),
        updated_at=_stamp(complete_day or created_day, 18, 0),
        completed_at=_stamp(complete_day, 18, 10) if complete_day else None,
        completion_count=1 if complete_day else 0,
    )
    db.add(task)
    db.flush()
    _add_history(db, task, created_day, HistoryAction.CREATED.value, "Task created by concierge.", 9, 5)
    if complete_day:
        _add_history(db, task, complete_day, HistoryAction.COMPLETED.value, "Task completed by user.", 18, 15)
    return task


def _seed_fellowship_tasks(db, user: User, today: date) -> list[Task]:
    seeded = []
    base_day = max(date(2026, 4, 10), today - timedelta(days=6))
    for index, spec in enumerate(_FELLOWSHIP_TASK_SPECS):
        task = _create_task(
            db,
            user_id=user.id,
            title=spec["title"],
            description=spec["description"],
            priority=spec["priority"],
            category=spec["category"],
            task_kind=spec["task_kind"],
            created_day=base_day,
            sort_order=100 + index * 10,
            due_date=spec.get("due_date"),
            recurrence_weekday=spec.get("recurrence_weekday"),
        )
        seeded.append(task)
    return seeded


def _seed_prep_tasks(db, user: User, today: date) -> list[Task]:
    seeded = []
    for index, spec in enumerate(_PREP_TASK_SPECS):
        created_day = today + timedelta(days=spec["offset_days"])
        complete_day = None
        if spec["status"] == TaskStatus.COMPLETED.value:
            complete_day = today + timedelta(days=spec["complete_offset_days"])
        due_date = None
        if spec.get("due_offset_days") is not None:
            due_date = (today + timedelta(days=spec["due_offset_days"])).isoformat()
        task = _create_task(
            db,
            user_id=user.id,
            title=spec["title"],
            description=spec["description"],
            priority=spec["priority"],
            category=spec["category"],
            task_kind=spec["task_kind"],
            created_day=created_day,
            sort_order=10 + index * 10,
            due_date=due_date,
            status=spec["status"],
            complete_day=complete_day,
        )
        seeded.append(task)
    return seeded


def _seed_focus_and_mood(db, user_id: int, today: date, prep_tasks: list[Task]) -> None:
    mood_rows = [
        (-4, 4, "The fellowship take-home direction feels much clearer."),
        (-3, 4, "The program timeline finally maps cleanly onto the product."),
        (-2, 3, "Still tightening the assistant behavior and import flow."),
        (-1, 5, "The app is starting to look like a real fellowship OS."),
    ]
    for offset, mood_level, note in mood_rows:
        day = today + timedelta(days=offset)
        db.add(
            MoodEntry(
                user_id=user_id,
                date=day.isoformat(),
                mood_level=mood_level,
                note=note,
                created_at=_stamp(day, 21, 0),
            )
        )

    focus_rows = [
        (-3, prep_tasks[0].id, 45),
        (-2, prep_tasks[1].id, 70),
        (-1, prep_tasks[2].id, 55),
    ]
    for index, (offset, task_id, minutes) in enumerate(focus_rows):
        day = today + timedelta(days=offset)
        db.add(
            FocusSession(
                user_id=user_id,
                task_id=task_id,
                date=day.isoformat(),
                duration_minutes=minutes,
                session_type="work",
                created_at=_stamp(day, 14 + (index % 3), 20),
            )
        )

    db.flush()


def _seed_next_plan(db, user_id: int, today: date, prep_tasks: list[Task]) -> None:
    plan_day = today + timedelta(days=1)
    active_tasks = [task for task in prep_tasks if task.status == TaskStatus.ACTIVE.value][:3]
    plan = DailyPlan(
        date=f"{user_id}:{plan_day.isoformat()}",
        reasoning="Bias the next showcase plan toward demo refinement, assistant reliability, and a clear narrative.",
        overload_warning="",
        max_tasks=max(4, len(active_tasks)),
        created_at=_stamp(today, 18, 0),
    )
    db.add(plan)
    db.flush()

    for index, task in enumerate(active_tasks):
        db.add(
            PlanTask(
                plan_id=plan.id,
                task_id=task.id,
                status=PlanTaskStatus.PLANNED.value,
                order=index,
            )
        )
        _add_history(
            db,
            task,
            plan_day,
            HistoryAction.PLANNED.value,
            "Included in the next showcase plan for the fellowship demo.",
            8,
            15 + index,
        )

    db.flush()


def seed_fellowship_demo_workspace(db) -> User:
    today = local_today()
    user = db.query(User).filter(User.username == FELLOWSHIP_DEMO_USERNAME).first()
    if not user:
        user = User(
            username=FELLOWSHIP_DEMO_USERNAME,
            password=FELLOWSHIP_DEMO_PASSWORD,
            birthday=FELLOWSHIP_DEMO_BIRTHDAY,
            gender=FELLOWSHIP_DEMO_GENDER,
            created_at=_stamp(today - timedelta(days=30), 10, 0),
        )
        db.add(user)
        db.flush()
    else:
        user.password = FELLOWSHIP_DEMO_PASSWORD
        user.birthday = FELLOWSHIP_DEMO_BIRTHDAY
        user.gender = FELLOWSHIP_DEMO_GENDER

    _clear_user_workspace(db, user.id)

    prep_tasks = _seed_prep_tasks(db, user, today)
    _seed_fellowship_tasks(db, user, today)
    _seed_focus_and_mood(db, user.id, today, prep_tasks)
    _seed_next_plan(db, user.id, today, prep_tasks)

    _upsert_json_setting(
        db,
        f"prototype_onboarding:{user.id}",
        {
            "completed": True,
            "daily_capacity": 6,
            "profile_summary": "Seeded fellowship showcase workspace.",
            "brain_dump": "",
            "commitments": "",
            "goals": "",
        },
    )
    db.flush()
    return user
