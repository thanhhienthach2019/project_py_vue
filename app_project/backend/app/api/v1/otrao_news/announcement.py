from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from app.services.news.announcement_service import (
    create_announcement,
    update_announcement,
    delete_announcement,
    get_all_announcements,
)
from app.models.news.announcement import Announcement

router = APIRouter(
    prefix="/announcements",
    tags=["Announcements"],
    dependencies=[Depends(permission_required_safe())]
)

@router.post("", response_model=AnnouncementResponse)
def create_announcement_endpoint(
    data: AnnouncementCreate,
    db: Session = Depends(get_db)
):
    return create_announcement(db, data)


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement_endpoint(
    announcement_id: int,
    data: AnnouncementUpdate,
    db: Session = Depends(get_db)
):
    return update_announcement(db, announcement_id, data)


@router.delete("/{announcement_id}")
def delete_announcement_endpoint(
    announcement_id: int,
    db: Session = Depends(get_db)
):
    success = delete_announcement(db, announcement_id)
    if not success:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"message": "Announcement deleted successfully"}


@router.get("", response_model=List[AnnouncementResponse])
def list_announcements(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    all_announcements = get_all_announcements(db)
    return all_announcements[skip: skip + limit]


@router.get("/{announcement_id}", response_model=AnnouncementResponse)
def get_announcement_detail(
    announcement_id: int,
    db: Session = Depends(get_db)
):
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return announcement
