FELLOWSHIP_DATES = {
    "start": "2026-06-01",
    "end": "2026-08-10",
}

FELLOWSHIP_DELIVERABLES = [
    {
        "label": "Research paper",
        "date": "2026-08-10",
        "description": "Publish to arXiv and submit to a target journal or conference.",
    },
    {
        "label": "Final presentation",
        "date": "2026-08-05",
        "description": "Present the summer's work in Anote-themed slides during the recorded showcase.",
    },
    {
        "label": "Product contribution",
        "date": "2026-08-10",
        "description": "Own one Anote product and ship meaningful improvements in its repo.",
    },
]

FELLOWSHIP_RECURRING_EVENTS = [
    {
        "label": "AI Research Standup",
        "label_zh": "AI 研究 Standup",
        "cadence": "Every Tuesday, 5:00-5:30 PM ET",
        "cadence_zh": "每周二，东部时间 17:00-17:30",
        "notes": "Virtual research sprint check-in for paper direction and progress.",
        "notes_zh": "线上研究冲刺 check-in，同步 paper 方向与进展。",
        "keywords": ["research standup", "research sync", "tuesday", "周二", "每周二", "研究站会", "研究 standup"],
    },
    {
        "label": "AI Product Standup",
        "label_zh": "AI 产品 Standup",
        "cadence": "Every Thursday, 5:00-5:30 PM ET",
        "cadence_zh": "每周四，东部时间 17:00-17:30",
        "notes": "Virtual product sprint check-in for repo progress and blockers.",
        "notes_zh": "线上产品冲刺 check-in，同步仓库进度与卡点。",
        "keywords": ["product standup", "thursday", "周四", "每周四", "产品站会", "产品 standup"],
    },
    {
        "label": "Fellowship Talk",
        "label_zh": "Fellowship 讲座",
        "cadence": "Every Friday, 1:00-2:00 PM ET",
        "cadence_zh": "每周五，东部时间 13:00-14:00",
        "notes": "Guest AI expert talk, in person at WeWork NYC plus virtual.",
        "notes_zh": "邀请 AI 嘉宾的分享，WeWork 纽约线下 + 线上同步。",
        "keywords": ["fellowship talk", "friday", "周五", "每周五", "guest speaker", "嘉宾分享"],
    },
]

FELLOWSHIP_FIXED_EVENTS = [
    {
        "label": "Orientation & Welcome",
        "label_zh": "迎新 & Kickoff",
        "date": "2026-06-01",
        "time": "6:00-8:00 PM ET",
        "time_zh": "东部时间 18:00-20:00",
        "notes": "Kickoff, team intro, product and research assignments, and slides template sharing.",
        "notes_zh": "启动会、团队相互认识、分配产品与研究方向、分发 slides 模板。",
        "keywords": ["orientation", "kickoff", "welcome", "入职", "开营", "启动"],
    },
    {
        "label": "Midpoint one-on-one check-ins",
        "label_zh": "与 Natan 的 Midpoint 一对一",
        "date": "2026-07-01",
        "time": "5:00-10:00 PM ET",
        "time_zh": "东部时间 17:00-22:00",
        "notes": "20-minute fellow check-ins with Natan on research progress, product work, and blockers.",
        "notes_zh": "每位 fellow 20 分钟，和 Natan 同步 paper 进度、产品贡献与卡点。",
        "keywords": ["midpoint", "check-in", "one-on-one", "1:1", "natan", "midpoint review", "中期", "一对一"],
    },
    {
        "label": "Final presentations",
        "label_zh": "最终展示",
        "date": "2026-08-05",
        "time": "5:00-10:00 PM ET",
        "time_zh": "东部时间 17:00-22:00",
        "notes": "Recorded fellowship showcase presentations for the summer's work.",
        "notes_zh": "录制版 fellowship showcase，展示整个暑期的成果。",
        "keywords": ["final presentation", "final presentations", "presentation day", "showcase", "最终展示", "汇报"],
    },
    {
        "label": "Anote Summer Party",
        "label_zh": "Anote 夏日派对",
        "date": "2026-08-07",
        "time": "7:00-10:00 PM ET",
        "time_zh": "东部时间 19:00-22:00",
        "notes": "NYC in-person celebration for fellows and the Anote team.",
        "notes_zh": "纽约线下的庆祝活动，fellows 和 Anote 团队一起参与。",
        "keywords": ["summer party", "party", "庆祝", "聚会"],
    },
    {
        "label": "Last day / final wrap-up",
        "label_zh": "最后一天 / 项目收尾",
        "date": "2026-08-10",
        "time": "All day",
        "time_zh": "全天",
        "notes": "Clean up code, document work, submit papers, and finish all handoffs.",
        "notes_zh": "整理代码、补齐文档、投递 paper，完成所有交接。",
        "keywords": ["last day", "wrap-up", "final wrap", "end date", "结束", "最后一天", "收尾"],
    },
]


def pick_event_field(event: dict, field: str, lang: str) -> str:
    """Return localized field for fellowship event, falling back to English."""
    if lang == "zh":
        zh_value = event.get(f"{field}_zh")
        if zh_value:
            return zh_value
    return event.get(field, "")
