from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.maintenance import MaintenanceRequestCreate, MaintenanceRequestResponse, MaintenanceRequestUpdate
from app.services.maintenance_service import create_maintenance_request, approve_maintenance_request, update_maintenance_request
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.post("/maintenance-requests", response_model=MaintenanceRequestResponse)
def create_maintenance_request_api(request_data: MaintenanceRequestCreate, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    try:
        return create_maintenance_request(db, request_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/approve-maintenance-request")
def approve_maintenance_request_api(request_id: int, db:Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    try:
        return approve_maintenance_request(db, request_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/update-maintenance-request/{request_id}")
def update_maintenance_request_api(
    request_id: int,
    update_data: MaintenanceRequestUpdate,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    try:
        return update_maintenance_request(db, request_id, update_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))