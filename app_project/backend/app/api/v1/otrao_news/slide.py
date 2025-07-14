from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.slide import SlideCreate, SlideUpdate, SlideResponse
from app.models.news.slide import Slide
from app.services.news.slide_service import (
    create_slide,
    update_slide,
    delete_slide,
    get_all_slides,
)

router = APIRouter(
    prefix="/slides",
    tags=["Slides"],
    dependencies=[Depends(permission_required_safe())]
)

# ===== CREATE =====
@router.post("", response_model=SlideResponse)
def create_slide_endpoint(
    title: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    order: int = Form(0),
    is_active: bool = Form(True),
    image: UploadFile = File(...),  
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read()

    slide_data = SlideCreate(
        title=title,
        link=link,
        order=order,
        is_active=is_active,
        image=image_bytes,
    )
    return create_slide(db, slide_data)


# ===== UPDATE =====
@router.put("/{slide_id}", response_model=SlideResponse)
def update_slide_endpoint(
    slide_id: int,
    title: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    order: int = Form(0),
    is_active: bool = Form(True),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read() if image else None

    update_data = SlideUpdate(
        title=title,
        link=link,
        order=order,
        is_active=is_active,
        image=image_bytes,
    )
    return update_slide(db, slide_id, update_data)


# ===== DELETE =====
@router.delete("/{slide_id}")
def delete_slide_endpoint(slide_id: int, db: Session = Depends(get_db)):
    success = delete_slide(db, slide_id)
    if not success:
        raise HTTPException(status_code=404, detail="Slide not found")
    return {"message": "Slide deleted successfully"}


# ===== LIST =====
@router.get("", response_model=List[SlideResponse])
def list_slides(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return get_all_slides(db)[skip: skip + limit]


# ===== DETAIL =====
@router.get("/{slide_id}", response_model=SlideResponse)
def get_slide_detail(slide_id: int, db: Session = Depends(get_db)):
    slide = db.query(Slide).filter(Slide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return slide
