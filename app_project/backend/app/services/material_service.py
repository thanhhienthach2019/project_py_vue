from sqlalchemy.orm import Session
from app.models.material import Materials
from app.schemas.material import MaterialCreate, MaterialUpdate

def add_material(db: Session, material_data: MaterialCreate):
    new_material = Materials(
        MaterialCode = material_data.MaterialCode,
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
    material.ImageUrl = material_data.ImageUrl
    material.Model = material_data.Model
    material.Origin = material_data.Origin

    db.commit()
    db.refresh(material)
    return material

def delete_material(db: Session, material_id: int):
    material = db.query(Materials).filter(Materials.MaterialID == material_id)
    if not material:
        raise ValueError(f"Material với ID {material_id} không tồn tại")
    
    db.delete()
    db.commit()
    return True

def get_all_materials(db: Session):
    return db.query(Materials).all()

def get_material_by_id(db: Session, material_id: int):
    material = db.query(Materials).filter(Materials.MaterialID == material_id)
    if not material:
        return None
    return material
