import uuid
import json
from datetime import datetime
import logging
from typing import Optional, List

from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, desc

from models.database import Report, ReportStatus
from services.gemma_service import analyze_report
from utils.websocket import manager
from utils.image import validate_image, save_upload, encode_image_base64

logger = logging.getLogger(__name__)

async def create_report(
    session: AsyncSession, 
    description: str, 
    lat: float, 
    lng: float, 
    address: Optional[str], 
    images: list, 
    reporter_name: Optional[str], 
    reporter_phone: Optional[str]
) -> Report:
    
    saved_image_paths = []
    base64_images = []
    
    if images:
        for img in images:
            content = await validate_image(img)
            path = await save_upload(img, content)
            saved_image_paths.append(path)
            base64_images.append(encode_image_base64(path))
            
    ai_result = await analyze_report(
        description=description,
        images=base64_images,
        location={"lat": lat, "lng": lng, "address": address}
    )
    
    report = Report(
        description=description,
        lat=lat,
        lng=lng,
        address=address,
        reporter_name=reporter_name,
        reporter_phone=reporter_phone,
        image_paths=json.dumps(saved_image_paths)
    )
    
    if ai_result:
        report.damage_level = ai_result.get("damage_level")
        report.urgency_score = ai_result.get("urgency_score")
        report.relief_items = json.dumps(ai_result.get("relief_items", []))
        report.missing_resources = json.dumps(ai_result.get("missing_resources", []))
        report.description_en = ai_result.get("translated_description")
        report.ai_summary = ai_result.get("ai_summary")
        report.confidence = ai_result.get("confidence")
        
    session.add(report)
    await session.commit()
    await session.refresh(report)
    
    await manager.broadcast({
        "event": "new_report",
        "data": {
            "id": str(report.id),
            "urgency_score": report.urgency_score,
            "lat": report.lat,
            "lng": report.lng
        }
    })
    
    return report

async def get_reports(
    session: AsyncSession,
    page: int,
    limit: int,
    status_filter: Optional[str],
    urgency_filter: Optional[str],
    from_date: Optional[str],
    to_date: Optional[str]
) -> tuple[List[Report], int]:
    
    query = select(Report)
    
    if status_filter:
        query = query.where(Report.status == status_filter)
    if urgency_filter:
        query = query.where(Report.urgency_score == urgency_filter)
    if from_date:
        query = query.where(Report.created_at >= datetime.fromisoformat(from_date.replace("Z", "+00:00")))
    if to_date:
        query = query.where(Report.created_at <= datetime.fromisoformat(to_date.replace("Z", "+00:00")))
        
    count_query = select(func.count()).select_from(query.subquery())
    total_count = (await session.execute(count_query)).scalar_one()
    
    query = query.order_by(desc(Report.created_at)).offset((page - 1) * limit).limit(limit)
    reports = (await session.execute(query)).scalars().all()
    
    return list(reports), total_count

async def get_report_by_id(session: AsyncSession, report_id: str) -> Optional[Report]:
    try:
        uid = uuid.UUID(report_id)
        return await session.get(Report, uid)
    except ValueError:
        return None

async def update_report_status(
    session: AsyncSession, 
    report_id: str, 
    new_status: str, 
    assigned_team: Optional[str]
) -> Optional[Report]:
    
    report = await get_report_by_id(session, report_id)
    if not report:
        return None
        
    report.status = ReportStatus(new_status)
    if assigned_team is not None:
        report.assigned_team = assigned_team
        
    session.add(report)
    await session.commit()
    await session.refresh(report)
    
    await manager.broadcast({
        "event": "status_updated",
        "data": {
            "id": str(report.id),
            "status": report.status.value
        }
    })
    
    return report
