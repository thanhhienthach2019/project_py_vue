from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.media.video import VideoCreate, VideoUpdate, VideoResponse
from app.models.media.video import Video
from app.services.media.video_service import (
    create_video,
    update_video,
    delete_video,
    get_all_videos
)

router = APIRouter(
    dependencies=[Depends(permission_required_safe())]
)

# ===== CREATE =====
@router.post("", response_model=VideoResponse)
def create_video_endpoint(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    youtube_url: str = Form(...),
    is_active: bool = Form(True),
    thumbnail: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    thumbnail_bytes = thumbnail.file.read() if thumbnail else None

    video_data = VideoCreate(
        title=title,
        description=description,
        youtube_url=youtube_url,
        is_active=is_active,
        thumbnail=thumbnail_bytes,
    )
    return create_video(db, video_data)


# ===== UPDATE =====
@router.put("/{video_id}", response_model=VideoResponse)
def update_video_endpoint(
    video_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    youtube_url: Optional[str] = Form(None),
    is_active: bool = Form(True),
    thumbnail: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    thumbnail_bytes = thumbnail.file.read() if thumbnail else None

    update_data = VideoUpdate(
        title=title,
        description=description,
        youtube_url=youtube_url,
        is_active=is_active,
        thumbnail=thumbnail_bytes,
    )
    return update_video(db, video_id, update_data)


# ===== DELETE =====
@router.delete("/{video_id}")
def delete_video_endpoint(video_id: int, db: Session = Depends(get_db)):
    success = delete_video(db, video_id)
    if not success:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted successfully"}


# ===== LIST =====
@router.get("", response_model=List[VideoResponse])
def list_videos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    videos = get_all_videos(db)
    return videos[skip: skip + limit]


# ===== DETAIL =====
@router.get("/{video_id}", response_model=VideoResponse)
def get_video_detail(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video
