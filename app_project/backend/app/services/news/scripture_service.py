from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.scripture import Scripture, ScriptureCategory
from app.schemas.news.scripture import ScriptureCreate, ScriptureUpdate, ScriptureCategoryCreate, ScriptureCategoryUpdate

def create_category(db: Session, data: ScriptureCategoryCreate) -> ScriptureCategory:
    category = ScriptureCategory(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def update_category(db: Session, category_id: int, data: ScriptureCategoryUpdate) -> ScriptureCategory:
    category = db.query(ScriptureCategory).filter(ScriptureCategory.id == category_id).first()
    if not category:
        raise HTTPException(404, f"ScriptureCategory {category_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category

def create_scripture(db: Session, data: ScriptureCreate) -> Scripture:
    scripture = Scripture(**data.model_dump())
    db.add(scripture)
    db.commit()
    db.refresh(scripture)
    return scripture

def update_scripture(db: Session, scripture_id: int, data: ScriptureUpdate) -> Scripture:
    scripture = db.query(Scripture).filter(Scripture.id == scripture_id).first()
    if not scripture:
        raise HTTPException(404, f"Scripture {scripture_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(scripture, field, value)
    db.commit()
    db.refresh(scripture)
    return scripture

def delete_scripture(db: Session, scripture_id: int) -> bool:
    scripture = db.query(Scripture).filter(Scripture.id == scripture_id).first()
    if not scripture:
        raise HTTPException(404, f"Scripture {scripture_id} not found")
    db.delete(scripture)
    db.commit()
    return True
