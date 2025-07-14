from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.permissions import permission_required
from app.schemas.inventory.maintenance import (
    MaintenanceRequestCreate,
    MaintenanceRequestResponse,
    MaintenanceRequestUpdate
)
from app.services.inventory.maintenance_service import (
    create_maintenance_request,
    approve_maintenance_request,
    update_maintenance_request,
    get_all_maintenance_requests,
    get_maintenance_request_by_id,
    delete_maintenance_request
)

router = APIRouter(
    prefix="/maintenance-requests",
    tags=["Maintenance Requests"],
    dependencies=[Depends(permission_required())]
)

@router.post("", response_model=MaintenanceRequestResponse)
def create_request(request_data: MaintenanceRequestCreate, db: Session = Depends(get_db)):
    """
    Create a new maintenance request.
    """
    try:
        return create_maintenance_request(db, request_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid maintenance request data.")

@router.get("", response_model=list[MaintenanceRequestResponse])
def list_requests(db: Session = Depends(get_db)):
    """
    Get all maintenance requests.
    """
    return get_all_maintenance_requests(db)

@router.get("/{request_id}", response_model=MaintenanceRequestResponse)
def retrieve_request(request_id: int, db: Session = Depends(get_db)):
    """
    Get a specific maintenance request by ID.
    """
    request = get_maintenance_request_by_id(db, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")
    return request

@router.put("/{request_id}", response_model=MaintenanceRequestResponse)
def update_request(request_id: int, update_data: MaintenanceRequestUpdate, db: Session = Depends(get_db)):
    """
    Update an existing maintenance request.
    """
    try:
        updated = update_maintenance_request(db, request_id, update_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Maintenance request not found.")
        return updated
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid update data for maintenance request.")

@router.patch("/{request_id}/approve", response_model=MaintenanceRequestResponse)
def approve_request(request_id: int, db: Session = Depends(get_db)):
    """
    Approve a maintenance request.
    """
    try:
        approved = approve_maintenance_request(db, request_id)
        if not approved:
            raise HTTPException(status_code=404, detail="Maintenance request not found.")
        return approved
    except ValueError:
        raise HTTPException(status_code=400, detail="Approval failed due to invalid request status.")

@router.delete("/{request_id}")
def delete_request(request_id: int, db: Session = Depends(get_db)):
    """
    Delete a maintenance request by ID.
    """
    deleted = delete_maintenance_request(db, request_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")
    return {"message": "Maintenance request deleted successfully."}
