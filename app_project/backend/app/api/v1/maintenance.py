from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.maintenance import MaintenanceRequestCreate, MaintenanceRequestResponse, MaintenanceRequestUpdate
from app.services.maintenance_service import (
    create_maintenance_request, 
    approve_maintenance_request, 
    update_maintenance_request, 
    get_all_maintenance_requests, 
    get_maintenance_request_by_id, 
    delete_maintenance_request)
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

@router.get("/maintenance-requests", response_model=list[MaintenanceRequestResponse])
def get_all_maintenance_requests_api(db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    try:
        return get_all_maintenance_requests(db)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/maintenance-requests/{request_id}", response_model=MaintenanceRequestResponse)
def get_maintenance_request_by_id_api(request_id: int, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    try:
        return get_maintenance_request_by_id(db, request_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/delete-maintenance-request/{request_id}")
def delete_maintenance_request_api(
    request_id: int,
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    try:
        return delete_maintenance_request(db, request_id)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)