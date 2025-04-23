import os
import datetime
from app.core.config import settings
from fastapi import APIRouter, Depends, Query, HTTPException, Request, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.material_service import (
    add_material, update_material, delete_material,
    get_all_materials, get_material_by_id, get_material_with_stock
)
from app.schemas.material import MaterialCreate, MaterialUpdate
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.post("/add_material")
def create_material(
    MaterialCode: str = Form(...),
    MaterialName: str = Form(...),
    Unit: str | None = Form(None),
    Description: str | None = Form(None),
    Model: str | None = Form(None),
    Origin: str | None = Form(None),
    image: UploadFile = File(None),
    Weight: str | None = Form(None),
    Dimensions: str | None = Form(None),
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    image_url = None
    upload_dir = settings.UPLOAD_DIR

    if image:
        # Kiểm tra tên file hợp lệ (không rỗng)
        if not image.filename:
            raise HTTPException(status_code=400, detail="Tên file không hợp lệ")

        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir)

        # Xử lý tên file: loại bỏ các ký tự không hợp lệ
        safe_filename = image.filename.replace("/", "_").replace("\\", "_")

        # Lấy phần mở rộng của file và chuyển thành chữ thường
        ext = os.path.splitext(safe_filename)[1].lower()
        # Danh sách các định dạng hình ảnh cho phép
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Chỉ cho phép tải lên hình ảnh")

        # Tạo timestamp hiện tại (YYYYMMDDHHMMSSmmm)
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]

        # Nối timestamp vào trước tên file
        new_filename = f"{timestamp}_{safe_filename}"
        file_location = os.path.join(upload_dir, new_filename)

        # Lưu file vào thư mục
        with open(file_location, "wb") as file_object:
            file_object.write(image.file.read())

        # Đường dẫn tương đối để truy cập file
        image_url = f"{new_filename}"

    # Tạo Material mới
    material_data = MaterialCreate(
        MaterialCode=MaterialCode,
        MaterialName=MaterialName,
        Unit=Unit,
        Description=Description,
        ImageUrl=image_url,
        Model=Model,
        Origin=Origin,
        Weight=Weight,
        Dimensions=Dimensions
    )
    
    return add_material(db, material_data)

@router.put("/update_material/{material_id}")
def modify_material(
    material_id: int,
    MaterialCode: str = Form(...),
    MaterialName: str = Form(...),
    Unit: str | None = Form(None),
    Description: str | None = Form(None),
    Model: str | None = Form(None),
    Origin: str | None = Form(None),
    image: UploadFile = File(None),
    Weight: str | None = Form(None),
    Dimensions: str | None = Form(None),
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    image_url = None

    if image:
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)

        # Kiểm tra tên file hợp lệ
        if not image.filename:
            raise HTTPException(status_code=400, detail="Tên file không hợp lệ")

        # Xử lý tên file: thay thế ký tự không hợp lệ
        safe_filename = image.filename.replace("/", "_").replace("\\", "_")
        ext = os.path.splitext(safe_filename)[1].lower()

        # Danh sách định dạng hình ảnh cho phép
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Chỉ cho phép tải lên hình ảnh")

        # Thêm timestamp vào tên file để tránh trùng lặp
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        new_filename = f"{timestamp}_{safe_filename}"
        file_location = os.path.join(upload_dir, new_filename)

        # Lưu file vào thư mục
        with open(file_location, "wb+") as file_object:
            file_object.write(image.file.read())

        image_url = f"{new_filename}"
    else:        
        image_url = None

    material_data = MaterialUpdate(
        MaterialCode=MaterialCode,
        MaterialName=MaterialName,
        Unit=Unit,
        Description=Description,
        ImageUrl=image_url,
        Model=Model,
        Origin=Origin,
        Weight=Weight,
        Dimensions=Dimensions
    )
    
    up_material = update_material(db, material_id, material_data)
    if not up_material:
        raise HTTPException(status_code=404, detail="Vật tư không tồn tại")
    return up_material

@router.delete("/delete_material/{material_id}")
def remove_material(material_id: int, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    success = delete_material(db, material_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vật tư không tồn tại")
    return {"message" : "Xoá vật tư thành công"}

@router.get("/materials")
def get_materials(request: Request, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    materials = get_all_materials(db)
    return materials

@router.get("/materials/{material_id}")
def get_material(material_id: int, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    material = get_material_by_id(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Vật tư không tồn tại")
    
    return material

@router.get("/materials/with-stock/{material_id}")
def get_material_with_stock_endpoint(
    material_id: int,
    warehouse_id: int = Query(..., description="ID của kho cần lấy tồn kho"),
    db: Session = Depends(get_db),
    payload: dict = Depends(custom_verify_token)
):
    # Gọi hàm service đã tách riêng để lấy thông tin vật tư kèm tồn kho theo material_id và warehouse_id
    material_with_stock = get_material_with_stock(db, material_id, warehouse_id)
    if not material_with_stock:
        raise HTTPException(status_code=404, detail="Vật tư không tồn tại")
    return material_with_stock