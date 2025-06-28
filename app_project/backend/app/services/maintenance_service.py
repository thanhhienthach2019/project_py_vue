from sqlalchemy.orm import Session
from sqlalchemy import update
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from app.models.maintenance import MaintenanceRequests, MaintenanceRequestDetails
from app.schemas.maintenance import (
    MaintenanceRequestCreate,
    MaintenanceRequestResponse,
    MaintenanceRequestDetailResponse,
    MaintenanceRequestUpdate
)
from app.services.inventory_service import export_stock

def generate_request_number(db: Session) -> str:
    # Get the current date in YYYYMMDD format
    today_str = datetime.now().strftime("%Y%m%d")
    prefix = f"REQ-{today_str}-"
    
    # Query maintenance requests with the same prefix and order them descending
    last_request = (
        db.query(MaintenanceRequests)
        .filter(MaintenanceRequests.RequestNumber.like(f"{prefix}%"))
        .order_by(MaintenanceRequests.RequestNumber.desc())
        .first()
    )
    
    if last_request and last_request.RequestNumber:
        # Extract the sequence number (assumed to be 3 digits at the end)
        last_seq = int(last_request.RequestNumber[-3:])
        new_seq = last_seq + 1
    else:
        new_seq = 1
    
    # Format the request number with 3 digits (padding with leading zeros if necessary)
    new_request_number = f"{prefix}{new_seq:03d}"
    return new_request_number

def create_maintenance_request(db: Session, request_data: MaintenanceRequestCreate) -> MaintenanceRequestResponse:
    try:
        new_request_number = generate_request_number(db)
        new_request = MaintenanceRequests(
            RequestNumber = new_request_number,
            MachineName = request_data.MachineName,
            Diagnosis = request_data.Diagnosis,
            RequestedBy = request_data.RequestedBy,
            Status = request_data.Status
        )
        print(request_data)
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        
        if not isinstance(request_data.Details, list):
            raise ValueError("Details must be a list of materials.")
        
        details_objects = []
        for detail in request_data.Details:
            if not hasattr(detail, "MaterialID") or not hasattr(detail, "WarehouseID") or not hasattr(detail, "QuantityUsed"):
                raise ValueError("Each detail must have MaterialID, WarehouseID, and QuantityUsed.")
            details_objects.append(
                MaintenanceRequestDetails(
                    RequestID=new_request.RequestID,
                    MaterialID=detail.MaterialID,
                    WarehouseID=detail.WarehouseID,
                    QuantityUsed=detail.QuantityUsed
                )
            )

        db.bulk_save_objects(details_objects)
        db.commit()

        inserted_details = (
            db.query(MaintenanceRequestDetails)
            .filter(MaintenanceRequestDetails.RequestID == new_request.RequestID)
            .all()            
        )
        details_response = []
        for d in inserted_details:
            details_response.append(
                MaintenanceRequestDetailResponse(
                    RequestDetailID=d.RequestDetailID,
                    RequestID=d.RequestID,
                    MaterialID=d.MaterialID,
                    WarehouseID=d.WarehouseID,
                    QuantityUsed=d.QuantityUsed
                )
            )

        response = MaintenanceRequestResponse(
            RequestID=new_request.RequestID,
            RequestNumber=new_request.RequestNumber,
            MachineName=new_request.MachineName,
            Diagnosis=new_request.Diagnosis,
            RequestedBy=new_request.RequestedBy,
            Status=new_request.Status,
            RequestDate=new_request.RequestDate,
            CreatedAt=new_request.CreatedAt,
            Details=details_response
        )

        return response
        
    except IntegrityError:
        db.rollback()
        raise ValueError("RequestNumber already exists, please enter a different number.")
    except Exception as e:
        db.rollback()
        raise ValueError(f"Error creating maintenance request: {str(e)}")
    
def approve_maintenance_request(db: Session, request_id: int):
    try:
        maintenance_request = db.query(MaintenanceRequests).filter(MaintenanceRequests.RequestID == request_id).first()
        if not maintenance_request:
            raise ValueError("Maintenance request not found.")
        
        if maintenance_request.Status != "Pending":
            raise ValueError("Only pending requests can be approved.")
        
        request_details = db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request_id
        ).all()

        if not request_details:
            raise ValueError("No material details found for this request.")
        
        for detail in request_details:
            export_result = export_stock(db, detail.WarehouseID, detail.MaterialID, detail.QuantityUsed)
            if not export_result:
                raise ValueError(f"Insufficient stock to export material ID {detail.MaterialID}.")
        maintenance_request.Status = "Approved"
        maintenance_request.ApprovedAt = datetime.now()

        db.commit()
        db.refresh(maintenance_request)
        return {"message": "Maintenance request approved and materials exported successfully."}

    except IntegrityError:
        db.rollback()
        raise ValueError("Database error occurred while approving the request.")
    except Exception as e:
        db.rollback()
        raise ValueError(f"Error: {str(e)}")
    
def update_maintenance_request(db: Session, request_id: int, update_data: MaintenanceRequestUpdate) -> MaintenanceRequestResponse:
    try:
        maintenance_request = db.query(MaintenanceRequests).filter(
            MaintenanceRequests.RequestID == request_id
        ).first()

        if not maintenance_request:
            raise ValueError("Maintenance request not found.")

        if maintenance_request.Status != "Pending":
            raise ValueError("Only pending requests can be updated.")

        if update_data.MachineName:
            maintenance_request.MachineName = update_data.MachineName
        if update_data.Diagnosis:
            maintenance_request.Diagnosis = update_data.Diagnosis
        if update_data.RequestedBy:
            maintenance_request.RequestedBy = update_data.RequestedBy
        
        db.commit()
        db.refresh(maintenance_request)        
        
        if update_data.Details:
            existing_details = db.query(MaintenanceRequestDetails).filter(
                MaintenanceRequestDetails.RequestID == request_id
            ).all()
            new_detail_keys = set((d.MaterialID, d.WarehouseID) for d in update_data.Details)
            for existing in existing_details:
                key = (existing.MaterialID, existing.WarehouseID)
                if key not in new_detail_keys:
                    db.delete(existing)
                    
            for detail in update_data.Details:
                existing_detail = db.query(MaintenanceRequestDetails).filter(
                    MaintenanceRequestDetails.RequestID == request_id,
                    MaintenanceRequestDetails.MaterialID == detail.MaterialID,
                    MaintenanceRequestDetails.WarehouseID == detail.WarehouseID
                ).first()

                if existing_detail:
                    if detail.WarehouseID is not None:
                        existing_detail.WarehouseID = detail.WarehouseID
                    if detail.QuantityUsed is not None:
                        existing_detail.QuantityUsed = detail.QuantityUsed
                    existing_detail.LastUpdated = datetime.now()
                else:
                    new_detail = MaintenanceRequestDetails(
                        RequestID=request_id,
                        MaterialID=detail.MaterialID,
                        WarehouseID=detail.WarehouseID,
                        QuantityUsed=detail.QuantityUsed
                    )
                    db.add(new_detail)
            db.commit()
        updated_details = db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request_id
        ).all()

        details_response = [
            MaintenanceRequestDetailResponse(
                RequestDetailID=d.RequestDetailID,
                RequestID=d.RequestID,
                MaterialID=d.MaterialID,
                WarehouseID=d.WarehouseID,
                QuantityUsed=d.QuantityUsed
            ) for d in updated_details
        ]

        response = MaintenanceRequestResponse(
            RequestID=maintenance_request.RequestID,
            RequestNumber=maintenance_request.RequestNumber,
            MachineName=maintenance_request.MachineName,
            Diagnosis=maintenance_request.Diagnosis,
            RequestedBy=maintenance_request.RequestedBy,
            Status=maintenance_request.Status,
            RequestDate=maintenance_request.RequestDate,
            CreatedAt=maintenance_request.CreatedAt,
            Details=details_response
        )

        return response

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Data update error.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating maintenance request: {str(e)}")

def get_all_maintenance_requests(db: Session) -> list[MaintenanceRequestResponse]:
    maintenance_requests = db.query(MaintenanceRequests).all()
    
    responses = []
    for request in maintenance_requests:
        # Get the details for each maintenance request
        request_details = db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request.RequestID
        ).all()

        details_response = [
            MaintenanceRequestDetailResponse(
                RequestDetailID=d.RequestDetailID,
                RequestID=d.RequestID,
                MaterialID=d.MaterialID,
                WarehouseID=d.WarehouseID,
                QuantityUsed=d.QuantityUsed
            ) for d in request_details
        ]

        responses.append(
            MaintenanceRequestResponse(
                RequestID=request.RequestID,
                RequestNumber=request.RequestNumber,
                MachineName=request.MachineName,
                Diagnosis=request.Diagnosis,
                RequestedBy=request.RequestedBy,
                Status=request.Status,
                RequestDate=request.RequestDate,
                CreatedAt=request.CreatedAt,
                Details=details_response
            )
        )
    
    return responses

def get_maintenance_request_by_id(db: Session, request_id: int) -> MaintenanceRequestResponse:
    # Get the maintenance request by RequestID
    maintenance_request = db.query(MaintenanceRequests).filter(
        MaintenanceRequests.RequestID == request_id
    ).first()

    if not maintenance_request:
        raise HTTPException(status_code=404, detail="Maintenance request not found.")
    
    # Get the details of the maintenance request
    request_details = db.query(MaintenanceRequestDetails).filter(
        MaintenanceRequestDetails.RequestID == request_id
    ).all()

    details_response = [
        MaintenanceRequestDetailResponse(
            RequestDetailID=d.RequestDetailID,
            RequestID=d.RequestID,
            MaterialID=d.MaterialID,
            WarehouseID=d.WarehouseID,
            QuantityUsed=d.QuantityUsed
        ) for d in request_details
    ]
    
    response = MaintenanceRequestResponse(
        RequestID=maintenance_request.RequestID,
        RequestNumber=maintenance_request.RequestNumber,
        MachineName=maintenance_request.MachineName,
        Diagnosis=maintenance_request.Diagnosis,
        RequestedBy=maintenance_request.RequestedBy,
        Status=maintenance_request.Status,
        RequestDate=maintenance_request.RequestDate,
        CreatedAt=maintenance_request.CreatedAt,
        Details=details_response
    )

    return response

def delete_maintenance_request(db: Session, request_id: int) -> dict:
    try:
        print(f"Fetching maintenance request with RequestID: {request_id}")
        maintenance_request = db.query(MaintenanceRequests).filter(
            MaintenanceRequests.RequestID == request_id
        ).first()

        if not maintenance_request:
            print("Maintenance request not found.")
            raise HTTPException(status_code=404, detail="Maintenance request not found.")

        print(f"Request status: {maintenance_request.Status}")
        if maintenance_request.Status != "Pending":
            print("Request is not in Pending status.")
            raise HTTPException(status_code=400, detail="Only pending requests can be deleted.")

        print("Deleting related details.")
        db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request_id
        ).delete(synchronize_session=False)

        print("Deleting maintenance request.")
        db.delete(maintenance_request)
        db.commit()
        print("Commit successful, maintenance request deleted.")

        return {"message": "Maintenance request deleted successfully."}
    
    except IntegrityError as ie:
        db.rollback()
        print("Data deletion error due to relational constraints.")
        raise HTTPException(status_code=400, detail="Data deletion error due to relational constraints.")
    except Exception as e:
        db.rollback()
        print("Error deleting maintenance request.")
        raise HTTPException(status_code=500, detail=f"Error deleting maintenance request: {str(e)}")
