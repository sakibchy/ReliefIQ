from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, case

from models.database import get_session, Report, ReportStatus, UrgencyScore
from utils.auth import get_current_admin

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/stats")
async def get_stats(
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    # Use SQL aggregates instead of loading all rows into memory
    total = (await session.execute(select(func.count(Report.id)))).scalar_one()

    urgency_counts = (await session.execute(
        select(Report.urgency_score, func.count(Report.id))
        .group_by(Report.urgency_score)
    )).all()

    status_counts = (await session.execute(
        select(Report.status, func.count(Report.id))
        .group_by(Report.status)
    )).all()

    urgency_map = {row[0]: row[1] for row in urgency_counts}
    status_map = {row[0]: row[1] for row in status_counts}

    resolved = status_map.get(ReportStatus.resolved, 0)
    pending = total - resolved

    # Aggregate relief items efficiently — only load what's needed
    relief_rows = (await session.execute(
        select(Report.relief_items).where(Report.relief_items != "[]")
    )).scalars().all()

    import json
    relief_counter: Counter = Counter()
    for row in relief_rows:
        try:
            items = json.loads(row)
            relief_counter.update(items)
        except (json.JSONDecodeError, TypeError):
            continue

    top_relief_needed = [item for item, _ in relief_counter.most_common(3)]

    return {
        "success": True,
        "data": {
            "total_reports": total,
            "critical": urgency_map.get(UrgencyScore.critical, 0),
            "high": urgency_map.get(UrgencyScore.high, 0),
            "medium": urgency_map.get(UrgencyScore.medium, 0),
            "low": urgency_map.get(UrgencyScore.low, 0),
            "resolved": resolved,
            "pending": pending,
            "top_relief_needed": top_relief_needed,
        },
        "error": None,
    }


@router.get("/map")
async def get_map_data(
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    # Only select the columns needed for map rendering — don't load full rows
    rows = (await session.execute(
        select(
            Report.id,
            Report.lat,
            Report.lng,
            Report.urgency_score,
            Report.damage_level,
            Report.status,
            Report.created_at,
        )
    )).all()

    features = [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row.lng, row.lat],
            },
            "properties": {
                "id": str(row.id),
                "urgency_score": row.urgency_score,
                "damage_level": row.damage_level,
                "status": row.status,
                "created_at": row.created_at.isoformat() + "Z",
            },
        }
        for row in rows
    ]

    return {
        "success": True,
        "data": {"type": "FeatureCollection", "features": features},
        "error": None,
    }
