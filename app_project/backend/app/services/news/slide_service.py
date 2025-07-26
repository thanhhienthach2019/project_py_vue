from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import List, Optional

from app.models.news.slide import Slide
from app.schemas.news.slide import SlideCreate, SlideUpdate


def get_or_404(db: Session, slide_id: int) -> Slide:
    slide = db.query(Slide).filter(Slide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail=f"Slide {slide_id} not found")
    return slide


def create_slide(db: Session, data: SlideCreate) -> Slide:
    slide = Slide(**data.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def update_slide(db: Session, slide_id: int, data: SlideUpdate) -> Slide:
    slide = get_or_404(db, slide_id)
    update_data = data.model_dump(exclude_unset=True)

    if "image" in update_data and update_data["image"] is None:
        del update_data["image"]

    for field, value in update_data.items():
        setattr(slide, field, value)

    db.commit()
    db.refresh(slide)
    return slide


def delete_slide(db: Session, slide_id: int) -> bool:
    slide = get_or_404(db, slide_id)
    db.delete(slide)
    db.commit()
    return True


def get_all_slides(db: Session) -> List[Slide]:
    return (
        db.query(Slide)
        .filter(Slide.is_active == True)
        .order_by(Slide.order.asc(), Slide.id.asc())
        .all()
    )
