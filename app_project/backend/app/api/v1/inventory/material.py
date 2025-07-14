from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
import os
import datetime

from app.core.config import settings
from app.core.database import get_db
from app.core.permissions import permission_required

from app.services.inventory.material_service import (
    add_material,
    update_material,
    delete_material,
    get_all_materials,
    get_material_by_id,
    get_material_with_stock,
)
from app.schemas.inventory.material import MaterialCreate, MaterialUpdate

router = APIRouter(
    prefix="/materials",
    tags=["Materials"],
    dependencies=[Depends(permission_required())]  
)

@router.post("")
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
):
    image_url = None
    upload_dir = settings.UPLOAD_DIR

    if image:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid filename")

        os.makedirs(upload_dir, exist_ok=True)
        safe_filename = image.filename.replace("/", "_").replace("\\", "_")
        ext = os.path.splitext(safe_filename)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}

        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Only image uploads are allowed")

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        new_filename = f"{timestamp}_{safe_filename}"
        file_location = os.path.join(upload_dir, new_filename)

        with open(file_location, "wb") as file_object:
            file_object.write(image.file.read())

        image_url = new_filename

    material_data = MaterialCreate(
        MaterialCode=MaterialCode,
        MaterialName=MaterialName,
        Unit=Unit,
        Description=Description,
        ImageUrl=image_url,
        Model=Model,
        Origin=Origin,
        Weight=Weight,
        Dimensions=Dimensions,
    )

    return add_material(db, material_data)


@router.put("/{material_id}")
def update_material_endpoint(
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
):
    image_url = None

    if image:
        upload_dir = settings.UPLOAD_DIR
        os.makedirs(upload_dir, exist_ok=True)

        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid filename")

        safe_filename = image.filename.replace("/", "_").replace("\\", "_")
        ext = os.path.splitext(safe_filename)[1].lower()
        allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}

        if ext not in allowed_extensions:
            raise HTTPException(status_code=400, detail="Only image uploads are allowed")

        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")[:-3]
        new_filename = f"{timestamp}_{safe_filename}"
        file_location = os.path.join(upload_dir, new_filename)

        with open(file_location, "wb") as file_object:
            file_object.write(image.file.read())

        image_url = new_filename

    material_data = MaterialUpdate(
        MaterialCode=MaterialCode,
        MaterialName=MaterialName,
        Unit=Unit,
        Description=Description,
        ImageUrl=image_url,
        Model=Model,
        Origin=Origin,
        Weight=Weight,
        Dimensions=Dimensions,
    )

    updated = update_material(db, material_id, material_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Material not found")
    return updated


@router.delete("/{material_id}")
def delete_material_endpoint(material_id: int, db: Session = Depends(get_db)):
    success = delete_material(db, material_id)
    if not success:
        raise HTTPException(status_code=404, detail="Material not found")
    return {"message": "Material deleted successfully"}


@router.get("")
def list_materials(db: Session = Depends(get_db)):
    return get_all_materials(db)


@router.get("/{material_id}")
def get_material_detail(material_id: int, db: Session = Depends(get_db)):
    material = get_material_by_id(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material


@router.get("/{material_id}/with-stock")
def get_material_with_stock_endpoint(
    material_id: int,
    warehouse_id: int = Query(..., description="Warehouse ID"),
    db: Session = Depends(get_db),
):
    material_with_stock = get_material_with_stock(db, material_id, warehouse_id)
    if not material_with_stock:
        raise HTTPException(status_code=404, detail="Material not found")
    return material_with_stock
