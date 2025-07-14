from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.document import Document, DocumentCategory
from app.schemas.news.document import DocumentCreate, DocumentUpdate, DocumentCategoryCreate, DocumentCategoryUpdate

# DocumentCategory
def create_category(db: Session, data: DocumentCategoryCreate) -> DocumentCategory:
    category = DocumentCategory(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def update_category(db: Session, category_id: int, data: DocumentCategoryUpdate) -> DocumentCategory:
    category = db.query(DocumentCategory).filter(DocumentCategory.id == category_id).first()
    if not category:
        raise HTTPException(404, f"Category {category_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category

# Document
def create_document(db: Session, data: DocumentCreate) -> Document:
    document = Document(**data.model_dump())
    db.add(document)
    db.commit()
    db.refresh(document)
    return document

def update_document(db: Session, document_id: int, data: DocumentUpdate) -> Document:
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(404, f"Document {document_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(document, field, value)
    db.commit()
    db.refresh(document)
    return document

def delete_document(db: Session, document_id: int):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(404, f"Document {document_id} not found")
    db.delete(document)
    db.commit()
    return True
