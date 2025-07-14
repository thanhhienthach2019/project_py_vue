from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.donor import Donor
from app.schemas.news.donor import DonorCreate, DonorUpdate

def create_donor(db: Session, data: DonorCreate) -> Donor:
    donor = Donor(**data.model_dump())
    db.add(donor)
    db.commit()
    db.refresh(donor)
    return donor

def update_donor(db: Session, donor_id: int, data: DonorUpdate) -> Donor:
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(404, f"Donor {donor_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(donor, field, value)
    db.commit()
    db.refresh(donor)
    return donor

def delete_donor(db: Session, donor_id: int) -> bool:
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(404, f"Donor {donor_id} not found")
    db.delete(donor)
    db.commit()
    return True

def get_all_donors(db: Session):
    return db.query(Donor).order_by(Donor.donated_at.desc()).all()