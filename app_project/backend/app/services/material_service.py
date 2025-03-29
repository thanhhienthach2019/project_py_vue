import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from app.models.material import Materials
from app.services import inventory_service
from app.schemas.material import MaterialCreate, MaterialUpdate

load_dotenv()
BASE_URL = f"{os.getenv("BASE_URL")}{os.getenv("PORT")}"

def add_material(db: Session, material_data: MaterialCreate):
    material_code = generate_material_code(db)
    new_material = Materials(
        MaterialCode = material_code,
        MaterialName = material_data.MaterialName,
        Unit = material_data.Unit,
        Description = material_data.Description,
        ImageUrl = material_data.ImageUrl,
        Model = material_data.Model,
        Origin = material_data.Origin
    )
    db.add(new_material)
    db.commit()
    db.refresh(new_material)
    return new_material

def update_material(db: Session, material_id: int,material_data: MaterialUpdate):
    material = db.query(Materials).filter(Materials.MaterialID == material_id).first()
    if not material:
        raise ValueError(f"Material với ID {material_id} không tồn tại")
    
    material.MaterialName = material_data.MaterialName
    material.Unit = material_data.Unit
    material.Description = material_data.Description
    if material_data.ImageUrl is not None:
        material.ImageUrl = material_data.ImageUrl        
    material.Model = material_data.Model
    material.Origin = material_data.Origin

    db.commit()
    db.refresh(material)
    return material

def delete_material(db: Session, material_id: int):
    material = db.query(Materials).filter(Materials.MaterialID == material_id).first()
    if not material:
        raise ValueError(f"Material với ID {material_id} không tồn tại")
    
    db.delete(material)
    db.commit()
    return True

def get_all_materials(db: Session):
    materials = db.query(Materials).all()
    for material in materials:
        if material.ImageUrl and material.ImageUrl.startswith("/public"):
            material.ImageUrl = f"{BASE_URL}{material.ImageUrl}"

    return materials

def get_material_by_id(db: Session, material_id: int):
    material = db.query(Materials).filter(Materials.MaterialID == material_id)
    if not material:
        return None
    return material

def generate_material_code(db: Session) -> str:
    latest_material = (
        db.query(func.max(cast(func.substring(Materials.MaterialCode, 4, 10), Integer)))
        .filter(Materials.MaterialCode.like("MAT%"))
        .scalar()
    )

    new_number = (latest_material or 0) + 1  
    return f"MAT{new_number:03d}"

def get_material_with_stock(db: Session, material_id: int, warehouse_id: int):
    # Lấy thông tin vật tư
    material = db.query(Materials).filter(Materials.MaterialID == material_id).first()
    if not material:
        return None

    # Gọi hàm trong inventory_service để lấy tồn kho theo material_id và warehouse_id
    inventories = inventory_service.get_inventory_by_material_and_warehouse_id(db, material_id, warehouse_id)

    # Tính tổng số lượng tồn kho
    remaining_quantity = sum(item.Quantity for item in inventories) if inventories else 0

    # Trả về kết quả dạng dict
    return {
        "material": material,
        "remaining_quantity": remaining_quantity,
        "inventories": inventories
    }