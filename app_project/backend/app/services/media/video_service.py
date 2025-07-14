from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.media.video import Video
from app.schemas.media.video import VideoCreate, VideoUpdate

def create_video(db: Session, data: VideoCreate) -> Video:
    video = Video(**data.model_dump())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

def update_video(db: Session, video_id: int, data: VideoUpdate) -> Video:
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(404, f"Video {video_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(video, field, value)
    db.commit()
    db.refresh(video)
    return video

def delete_video(db: Session, video_id: int) -> bool:
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(404, f"Video {video_id} not found")
    db.delete(video)
    db.commit()
    return True

def get_all_videos(db: Session):
    return db.query(Video).order_by(Video.published_at.desc()).all()