from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.festival import Festival
from app.schemas.news.festival import FestivalCreate, FestivalUpdate

def create_festival(db: Session, data: FestivalCreate) -> Festival:
    festival = Festival(**data.model_dump())
    db.add(festival)
    db.commit()
    db.refresh(festival)
    return festival

def update_festival(db: Session, festival_id: int, data: FestivalUpdate) -> Festival:
    festival = db.query(Festival).filter(Festival.id == festival_id).first()
    if not festival:
        raise HTTPException(404, f"Festival {festival_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(festival, field, value)
    db.commit()
    db.refresh(festival)
    return festival

def delete_festival(db: Session, festival_id: int) -> bool:
    festival = db.query(Festival).filter(Festival.id == festival_id).first()
    if not festival:
        raise HTTPException(404, f"Festival {festival_id} not found")
    db.delete(festival)
    db.commit()
    return True

def get_all_festivals(db: Session):
    return db.query(Festival).order_by(Festival.start_date.desc()).all()