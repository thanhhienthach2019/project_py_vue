from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.donor import DonorCreate, DonorUpdate, DonorResponse
from app.models.news.donor import Donor
from app.services.news.donor_service import (
    create_donor,
    update_donor,
    delete_donor,
    get_all_donors,
)

router = APIRouter(
    dependencies=[Depends(permission_required_safe())]
)

# ===== CREATE =====
@router.post("", response_model=DonorResponse)
def create_donor_endpoint(
    full_name: str = Form(...),
    donation_amount: float = Form(...),
    message: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    donor_data = DonorCreate(
        full_name=full_name,
        donation_amount=donation_amount,
        message=message,
        image=image_bytes,
    )
    return create_donor(db, donor_data)


# ===== UPDATE =====
@router.put("/{donor_id}", response_model=DonorResponse)
def update_donor_endpoint(
    donor_id: int,
    full_name: str = Form(...),
    donation_amount: float = Form(...),
    message: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    update_data = DonorUpdate(
        full_name=full_name,
        donation_amount=donation_amount,
        message=message,
        image=image_bytes
    )
    return update_donor(db, donor_id, update_data)


# ===== DELETE =====
@router.delete("/{donor_id}")
def delete_donor_endpoint(donor_id: int, db: Session = Depends(get_db)):
    success = delete_donor(db, donor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Donor not found")
    return {"message": "Donor deleted successfully"}


# ===== LIST + DETAIL =====
@router.get("", response_model=List[DonorResponse])
def list_donors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return get_all_donors(db)[skip: skip + limit]


@router.get("/{donor_id}", response_model=DonorResponse)
def get_donor_detail(donor_id: int, db: Session = Depends(get_db)):
    donor = db.query(Donor).filter(Donor.id == donor_id).first()
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    return donor
