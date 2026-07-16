from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from models.database import get_session, Report, ReportStatus, UrgencyScore
from utils.auth import get_current_admin
from collections import Counter
import json

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
async def get_stats(
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    reports = (await session.execute(select(Report))).scalars().all()
    
    total = len(reports)
    critical = sum(1 for r in reports if r.urgency_score == UrgencyScore.critical.value)
    high = sum(1 for r in reports if r.urgency_score == UrgencyScore.high.value)
    medium = sum(1 for r in reports if r.urgency_score == UrgencyScore.medium.value)
    low = sum(1 for r in reports if r.urgency_score == UrgencyScore.low.value)
    
    resolved = sum(1 for r in reports if r.status == ReportStatus.resolved.value)
    pending = total - resolved
    
    relief_items_counter = Counter()
    for report in reports:
        items = report.relief_items_list
        for item in items:
            relief_items_counter[item] += 1
            
    top_relief_needed = [item for item, _ in relief_items_counter.most_common(3)]
    
    return {
        "success": True,
        "data": {
            "total_reports": total,
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "resolved": resolved,
            "pending": pending,
            "top_relief_needed": top_relief_needed
        },
        "error": None
    }

@router.get("/map")
async def get_map_data(
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    reports = (await session.execute(select(Report))).scalars().all()
    
    features = []
    for report in reports:
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [report.lng, report.lat]
            },
            "properties": {
                "id": str(report.id),
                "urgency_score": report.urgency_score,
                "damage_level": report.damage_level,
                "status": report.status.value,
                "created_at": report.created_at.isoformat() + "Z"
            }
        })
        
    return {
        "success": True,
        "data": {
            "type": "FeatureCollection",
            "features": features
        },
        "error": None
    }
