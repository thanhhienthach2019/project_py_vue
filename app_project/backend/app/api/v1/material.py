from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.material_service import (
    add_material, update_material, delete_material,
    get_all_materials, get_material_by_id
)
from app.schemas.material import MaterialCreate, MaterialUpdate
from app.core.middleware import custom_verify_token

router = APIRouter()

@router.post("/add_material")
def create_material(material: MaterialCreate, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    return add_material(db, material)

@router.put("/update_material/{material_id}")
def modify_material(material_id: int, material: MaterialUpdate, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    up_material = update_material(db, material_id, material)
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
    token = request.cookies.get("token")  # 🔥 Lấy token từ cookie

    if not token:
        raise HTTPException(status_code=401, detail="Không có token trong cookie")

    materials = get_all_materials(db)
    return materials

@router.get("/materials/{material_id}")
def get_material(material_id: int, db: Session = Depends(get_db), payload: dict = Depends(custom_verify_token)):
    material = get_material_by_id(material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Vật tư không tồn tại")
    
    return material
