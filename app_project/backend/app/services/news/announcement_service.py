from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.announcement import Announcement
from app.schemas.news.announcement import AnnouncementCreate, AnnouncementUpdate

def create_announcement(db: Session, data: AnnouncementCreate) -> Announcement:
    announcement = Announcement(**data.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

def update_announcement(db: Session, announcement_id: int, data: AnnouncementUpdate) -> Announcement:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(404, f"Announcement {announcement_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(announcement, field, value)
    db.commit()
    db.refresh(announcement)
    return announcement

def delete_announcement(db: Session, announcement_id: int) -> bool:
    announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not announcement:
        raise HTTPException(404, f"Announcement {announcement_id} not found")
    db.delete(announcement)
    db.commit()
    return True

def get_all_announcements(db: Session):
    return db.query(Announcement).order_by(Announcement.announcement_date.desc()).all()