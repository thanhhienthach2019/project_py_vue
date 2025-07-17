from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import datetime

from app.core.database import get_db
from app.core.config import settings
from app.core.permissions import permission_required_safe

from app.schemas.news.document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
    DocumentCategoryCreate,
    DocumentCategoryUpdate,
    DocumentCategoryResponse
)
from app.models.news.document import Document, DocumentCategory
from app.services.news.document_service import (
    create_document,
    update_document,
    delete_document,
    create_category,
    update_category,
)

router = APIRouter(
    dependencies=[Depends(permission_required_safe())]
)

# ===== Document CRUD =====

@router.post("", response_model=DocumentResponse)
def create_document_endpoint(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file_url: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    category_id: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    document_data = DocumentCreate(
        title=title,
        description=description,
        file_url=file_url,
        content=content,
        category_id=category_id,
        image=image_bytes,
    )
    return create_document(db, document_data)


@router.put("/{document_id}", response_model=DocumentResponse)
def update_document_endpoint(
    document_id: int,
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file_url: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = None
    if image:
        image_bytes = image.file.read()

    update_data = DocumentUpdate(
        title=title,
        description=description,
        file_url=file_url,
        content=content,
        category_id=category_id,
        image=image_bytes,
    )
    return update_document(db, document_id, update_data)


@router.delete("/{document_id}")
def delete_document_endpoint(document_id: int, db: Session = Depends(get_db)):
    success = delete_document(db, document_id)
    if not success:
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}


@router.get("", response_model=List[DocumentResponse])
def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return db.query(Document).order_by(Document.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document_detail(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


# ===== Category CRUD =====

@router.post("/categories", response_model=DocumentCategoryResponse)
def create_document_category(
    name: str = Form(...),
    slug: str = Form(...),
    description: Optional[str] = Form(None),
    icon: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    icon_bytes = None
    if icon:
        icon_bytes = icon.file.read()

    category_data = DocumentCategoryCreate(
        name=name,
        slug=slug,
        description=description,
        icon=icon_bytes
    )
    return create_category(db, category_data)


@router.put("/categories/{category_id}", response_model=DocumentCategoryResponse)
def update_document_category(
    category_id: int,
    name: str = Form(...),
    slug: str = Form(...),
    description: Optional[str] = Form(None),
    icon: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    icon_bytes = None
    if icon:
        icon_bytes = icon.file.read()

    update_data = DocumentCategoryUpdate(
        name=name,
        slug=slug,
        description=description,
        icon=icon_bytes
    )
    return update_category(db, category_id, update_data)


@router.get("/categories", response_model=List[DocumentCategoryResponse])
def list_document_categories(db: Session = Depends(get_db)):
    return db.query(DocumentCategory).order_by(DocumentCategory.created_at.desc()).all()


@router.get("/categories/{category_id}", response_model=DocumentCategoryResponse)
def get_category_detail(category_id: int, db: Session = Depends(get_db)):
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
