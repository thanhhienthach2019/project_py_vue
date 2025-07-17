from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
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
    dependencies=[Depends(permission_required_safe())]
)

# ===== CREATE =====
@router.post("", response_model=SlideResponse)
def create_slide_endpoint(
    headline: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    order: int = Form(0),
    is_active: bool = Form(True),
    image: UploadFile = File(...),  
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read()

    slide_data = SlideCreate(
        headline=headline,
        title=title,
        description=description,
        link=link,
        order=order,
        is_active=is_active,
        image=image_bytes,
    )
    slide = create_slide(db, slide_data)
    return SlideResponse.from_orm_with_base64(slide)


# ===== UPDATE =====
@router.put("/{slide_id}", response_model=SlideResponse)
def update_slide_endpoint(
    slide_id: int,
    headline: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    link: Optional[str] = Form(None),
    order: int = Form(0),
    is_active: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read() if image else None

    update_data = SlideUpdate(
        headline=headline,
        title=title,
        description=description,
        link=link,
        order=order,
        is_active=is_active,
        image=image_bytes,
    )
    slide = update_slide(db, slide_id, update_data)
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return SlideResponse.from_orm_with_base64(slide)


# ===== DELETE =====
@router.delete("/{slide_id}")
def delete_slide_endpoint(slide_id: int, db: Session = Depends(get_db)):
    success = delete_slide(db, slide_id)
    if not success:
        raise HTTPException(status_code=404, detail="Slide not found")
    return {"message": "Slide deleted successfully"}


# ===== LIST =====
@router.get("", response_model=List[SlideResponse])
def list_slides(db: Session = Depends(get_db)):
    slides = get_all_slides(db)
    return [SlideResponse.from_orm_with_base64(slide) for slide in slides]


# ===== DETAIL =====
@router.get("/{slide_id}", response_model=SlideResponse)
def get_slide_detail(slide_id: int, db: Session = Depends(get_db)):
    slide = db.query(Slide).filter(Slide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Slide not found")
    return SlideResponse.from_orm_with_base64(slide)
