from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.festival import FestivalCreate, FestivalUpdate, FestivalResponse
from app.models.news.festival import Festival
from app.services.news.festival_service import (
    create_festival,
    update_festival,
    delete_festival,
    get_all_festivals,
)

router = APIRouter(
    prefix="/festivals",
    tags=["Festivals"],
    dependencies=[Depends(permission_required_safe())]
)

# ===== CREATE =====
@router.post("", response_model=FestivalResponse)
def create_festival_endpoint(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    start_date: datetime = Form(...),
    end_date: Optional[datetime] = Form(None),
    location: Optional[str] = Form(None),
    is_active: bool = Form(True),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    festival_data = FestivalCreate(
        name=name,
        description=description,
        start_date=start_date,
        end_date=end_date,
        location=location,
        is_active=is_active,
        image=image_bytes,
    )
    return create_festival(db, festival_data)


# ===== UPDATE =====
@router.put("/{festival_id}", response_model=FestivalResponse)
def update_festival_endpoint(
    festival_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    start_date: datetime = Form(...),
    end_date: Optional[datetime] = Form(None),
    location: Optional[str] = Form(None),
    is_active: bool = Form(True),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    update_data = FestivalUpdate(
        name=name,
        description=description,
        start_date=start_date,
        end_date=end_date,
        location=location,
        is_active=is_active,
        image=image_bytes,
    )
    return update_festival(db, festival_id, update_data)


# ===== DELETE =====
@router.delete("/{festival_id}")
def delete_festival_endpoint(festival_id: int, db: Session = Depends(get_db)):
    success = delete_festival(db, festival_id)
    if not success:
        raise HTTPException(status_code=404, detail="Festival not found")
    return {"message": "Festival deleted successfully"}


# ===== LIST + DETAIL =====
@router.get("", response_model=List[FestivalResponse])
def list_festivals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return get_all_festivals(db)[skip: skip + limit]


@router.get("/{festival_id}", response_model=FestivalResponse)
def get_festival_detail(festival_id: int, db: Session = Depends(get_db)):
    festival = db.query(Festival).filter(Festival.id == festival_id).first()
    if not festival:
        raise HTTPException(status_code=404, detail="Festival not found")
    return festival
