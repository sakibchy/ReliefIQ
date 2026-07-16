from typing import Optional, List
from fastapi import APIRouter, Depends, Form, UploadFile, File, Query, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from models.database import get_session
from services.report_service import create_report, get_reports, get_report_by_id, update_report_status
from utils.auth import get_current_admin

router = APIRouter(prefix="/api/reports", tags=["reports"])

class StatusUpdate(BaseModel):
    status: str
    assigned_team: Optional[str] = None

@router.post("")
async def submit_report(
    description: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    address: Optional[str] = Form(None),
    reporter_name: Optional[str] = Form(None),
    reporter_phone: Optional[str] = Form(None),
    images: List[UploadFile] = File(default=[]),
    session: AsyncSession = Depends(get_session)
):
    report = await create_report(
        session=session,
        description=description,
        lat=lat,
        lng=lng,
        address=address,
        images=images,
        reporter_name=reporter_name,
        reporter_phone=reporter_phone
    )
    
    return {
        "success": True,
        "data": {
            "id": str(report.id),
            "status": report.status.value,
            "urgency_score": report.urgency_score,
            "damage_level": report.damage_level,
            "relief_items": report.relief_items_list,
            "ai_summary": report.ai_summary,
            "confidence": report.confidence
        },
        "error": None
    }

@router.get("")
async def list_reports(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status_filter: Optional[str] = Query(None, alias="status"),
    urgency_filter: Optional[str] = Query(None, alias="urgency"),
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    reports, total = await get_reports(
        session=session,
        page=page,
        limit=limit,
        status_filter=status_filter,
        urgency_filter=urgency_filter,
        from_date=from_date,
        to_date=to_date
    )
    
    return {
        "success": True,
        "data": {
            "items": reports,
            "total": total,
            "page": page,
            "limit": limit
        },
        "error": None
    }

@router.get("/{id}")
async def get_report(id: str, session: AsyncSession = Depends(get_session)):
    report = await get_report_by_id(session, id)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    return {
        "success": True,
        "data": report,
        "error": None
    }

@router.patch("/{id}/status")
async def update_status(
    id: str,
    update: StatusUpdate,
    session: AsyncSession = Depends(get_session),
    admin: str = Depends(get_current_admin)
):
    report = await update_report_status(session, id, update.status, update.assigned_team)
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
        
    return {
        "success": True,
        "data": report,
        "error": None
    }
