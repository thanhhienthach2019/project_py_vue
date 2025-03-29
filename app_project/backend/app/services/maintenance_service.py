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
    # Lấy ngày hiện tại theo định dạng YYYYMMDD
    today_str = datetime.now().strftime("%Y%m%d")
    prefix = f"REQ-{today_str}-"
    
    # Truy vấn phiếu bảo trì có RequestNumber có cùng prefix, sắp xếp giảm dần
    last_request = (
        db.query(MaintenanceRequests)
        .filter(MaintenanceRequests.RequestNumber.like(f"{prefix}%"))
        .order_by(MaintenanceRequests.RequestNumber.desc())
        .first()
    )
    
    if last_request and last_request.RequestNumber:
        # Lấy phần số thứ tự (giả sử luôn là 3 chữ số ở cuối)
        last_seq = int(last_request.RequestNumber[-3:])
        new_seq = last_seq + 1
    else:
        new_seq = 1
    
    # Định dạng RequestNumber với 3 chữ số (đệm số 0 nếu cần)
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
            raise ValueError("Details phải là danh sách chi tiết vật tư")
        
        details_objects = []
        for detail in request_data.Details:
            if not hasattr(detail, "MaterialID") or not hasattr(detail, "WarehouseID") or not hasattr(detail, "QuantityUsed"):
                raise ValueError("Mỗi chi tiết phải có MaterialID, WarehouseID và QuantityUsed")
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
        raise ValueError("RequestNumber đã tồn tại, vui lòng nhập số khác")
    except Exception as e:
        db.rollback()
        raise ValueError(f"Lỗi khi tạo yêu cầu bảo trì: {str(e)}")
    
def approve_maintenance_request(db: Session, request_id: int):
    try:
        maintenance_request = db.query(MaintenanceRequests).filter(MaintenanceRequests.RequestID == request_id).first()
        if not maintenance_request:
            raise ValueError("Phiếu yêu cầu bảo trì không tồn tại")
        
        if maintenance_request.Status != "Pending":
            raise ValueError("Chỉ có thể duyệt phiếu yêu cầu ở trạng thái Pending")
        
        request_details = db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request_id
        ).all()

        if not request_details:
            raise ValueError("Phiếu yêu cầu không có chi tiết vật tư")
        
        for detail in request_details:
            export_result = export_stock(db, detail.WarehouseID, detail.MaterialID, detail.QuantityUsed)
            if not export_result:
                raise ValueError(f"Không đủ số lượng trong kho để xuất vật tư ID {detail.MaterialID}")
        maintenance_request.Status = "Approved"
        maintenance_request.ApprovedAt = datetime.now()

        db.commit()
        db.refresh(maintenance_request)
        return {"message":"Phiếu yêu cầu bảo trì đã được duyệt và vật tư đã xuất kho"}

    except IntegrityError:
        db.rollback()
        raise ValueError("Lỗi cơ sở dữ liệu khi duyệt yêu cầu")
    except Exception as e:
        db.rollback()
        raise ValueError(f"Lỗi: {str(e)}")
    
def update_maintenance_request(db: Session, request_id: int, update_data: MaintenanceRequestUpdate) -> MaintenanceRequestResponse:
    try:
        maintenance_request = db.query(MaintenanceRequests).filter(
            MaintenanceRequests.RequestID == request_id
        ).first()

        if not maintenance_request:
            raise ValueError("Phiếu yêu cầu bảo trì không tồn tại")

        if maintenance_request.Status != "Pending":
            raise ValueError("Chỉ có thể chỉnh sửa phiếu yêu cầu ở trạng thái Pending")

        if update_data.MachineName:
            maintenance_request.MachineName = update_data.MachineName
        if update_data.Diagnosis:
            maintenance_request.Diagnosis = update_data.Diagnosis
        if update_data.RequestedBy:
            maintenance_request.RequestedBy = update_data.RequestedBy
        
        db.commit()
        db.refresh(maintenance_request)

        if update_data.Details:
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
        raise HTTPException(status_code=400, detail="Lỗi cập nhật dữ liệu")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi cập nhật phiếu bảo trì: {str(e)}")

def get_all_maintenance_requests(db: Session) -> list[MaintenanceRequestResponse]:
    maintenance_requests = db.query(MaintenanceRequests).all()
    
    responses = []
    for request in maintenance_requests:
        # Lấy danh sách chi tiết của mỗi phiếu bảo trì
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
    # Lấy thông tin phiếu bảo trì theo RequestID
    maintenance_request = db.query(MaintenanceRequests).filter(
        MaintenanceRequests.RequestID == request_id
    ).first()

    if not maintenance_request:
        raise HTTPException(status_code=404, detail="Phiếu bảo trì không tồn tại")
    
    # Lấy danh sách chi tiết của phiếu bảo trì
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
        print(f"Đang lấy phiếu bảo trì với RequestID: {request_id}")
        maintenance_request = db.query(MaintenanceRequests).filter(
            MaintenanceRequests.RequestID == request_id
        ).first()

        if not maintenance_request:
            print("Phiếu bảo trì không tồn tại")
            raise HTTPException(status_code=404, detail="Phiếu yêu cầu bảo trì không tồn tại")

        print(f"Trạng thái phiếu: {maintenance_request.Status}")
        if maintenance_request.Status != "Pending":
            print("Phiếu không ở trạng thái Pending")
            raise HTTPException(status_code=400, detail="Chỉ có thể xóa phiếu yêu cầu ở trạng thái Pending")

        print("Đang xóa chi tiết liên quan")
        db.query(MaintenanceRequestDetails).filter(
            MaintenanceRequestDetails.RequestID == request_id
        ).delete(synchronize_session=False)

        print("Đang xóa phiếu bảo trì")
        db.delete(maintenance_request)
        db.commit()
        print("Commit thành công, đã xóa phiếu bảo trì")

        return {"message": "Xóa phiếu bảo trì thành công"}
    
    except IntegrityError as ie:
        db.rollback()
        print("Lỗi xóa dữ liệu do ràng buộc liên kết")
        raise HTTPException(status_code=400, detail="Lỗi xóa dữ liệu do ràng buộc liên kết")
    except Exception as e:
        db.rollback()
        print("Lỗi khi xóa phiếu bảo trì")
        raise HTTPException(status_code=500, detail=f"Lỗi khi xóa phiếu bảo trì: {str(e)}")