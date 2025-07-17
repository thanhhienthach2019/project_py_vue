from fastapi import APIRouter, Depends, HTTPException, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.scripture import (
    ScriptureCreate, ScriptureUpdate, ScriptureResponse,
    ScriptureCategoryCreate, ScriptureCategoryUpdate, ScriptureCategoryResponse
)
from app.models.news.scripture import Scripture, ScriptureCategory
from app.services.news.scripture_service import (
    create_category, update_category,
    create_scripture, update_scripture, delete_scripture
)

router = APIRouter(
    dependencies=[Depends(permission_required_safe())]
)

# ===== CATEGORY ROUTES =====

@router.post("/categories", response_model=ScriptureCategoryResponse)
def create_scripture_category(
    data: ScriptureCategoryCreate,
    db: Session = Depends(get_db)
):
    return create_category(db, data)


@router.put("/categories/{category_id}", response_model=ScriptureCategoryResponse)
def update_scripture_category(
    category_id: int,
    data: ScriptureCategoryUpdate,
    db: Session = Depends(get_db)
):
    return update_category(db, category_id, data)


@router.get("/categories", response_model=List[ScriptureCategoryResponse])
def list_scripture_categories(db: Session = Depends(get_db)):
    return db.query(ScriptureCategory).order_by(ScriptureCategory.created_at.desc()).all()


@router.get("/categories/{category_id}", response_model=ScriptureCategoryResponse)
def get_scripture_category_detail(category_id: int, db: Session = Depends(get_db)):
    category = db.query(ScriptureCategory).filter(ScriptureCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# ===== SCRIPTURE ROUTES =====

@router.post("", response_model=ScriptureResponse)
def create_scripture_endpoint(
    title: str = Form(...),
    author: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    pdf_url: Optional[str] = Form(None),
    category_id: int = Form(...),
    db: Session = Depends(get_db)
):
    scripture_data = ScriptureCreate(
        title=title,
        author=author,
        content=content,
        pdf_url=pdf_url,
        category_id=category_id,
    )
    return create_scripture(db, scripture_data)


@router.put("/{scripture_id}", response_model=ScriptureResponse)
def update_scripture_endpoint(
    scripture_id: int,
    title: str = Form(...),
    author: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    pdf_url: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    db: Session = Depends(get_db)
):
    update_data = ScriptureUpdate(
        title=title,
        author=author,
        content=content,
        pdf_url=pdf_url,
        category_id=category_id,
    )
    return update_scripture(db, scripture_id, update_data)


@router.delete("/{scripture_id}")
def delete_scripture_endpoint(scripture_id: int, db: Session = Depends(get_db)):
    success = delete_scripture(db, scripture_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scripture not found")
    return {"message": "Scripture deleted successfully"}


@router.get("", response_model=List[ScriptureResponse])
def list_scriptures(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return db.query(Scripture).order_by(Scripture.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{scripture_id}", response_model=ScriptureResponse)
def get_scripture_detail(scripture_id: int, db: Session = Depends(get_db)):
    scripture = db.query(Scripture).filter(Scripture.id == scripture_id).first()
    if not scripture:
        raise HTTPException(status_code=404, detail="Scripture not found")
    return scripture
