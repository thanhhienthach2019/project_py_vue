from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.core.database import get_db
from app.core.permissions import permission_required_safe
from app.schemas.news.news import (
    NewsCategoryCreate, NewsCategoryUpdate, NewsCategoryResponse,
    NewsArticleCreate, NewsArticleUpdate, NewsArticleResponse
)
from app.models.news.news import NewsCategory, NewsArticle
from app.services.news.news_service import (
    create_category, update_category, delete_category, get_all_categories,
    create_article, update_article, delete_article, get_all_articles, get_article_by_id_and_slug, get_article_by_id
)

router = APIRouter(
    dependencies=[Depends(permission_required_safe())]
)

# ====== CATEGORY ROUTES ======

@router.post("/categories", response_model=NewsCategoryResponse)
def create_news_category(
    data: NewsCategoryCreate,
    db: Session = Depends(get_db)
):
    return create_category(db, data)

@router.put("/categories/{category_id}", response_model=NewsCategoryResponse)
def update_news_category(
    category_id: int,
    data: NewsCategoryUpdate,
    db: Session = Depends(get_db)
):
    return update_category(db, category_id, data)

@router.delete("/categories/{category_id}")
def delete_news_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    success = delete_category(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

@router.get("/categories", response_model=List[NewsCategoryResponse])
def list_news_categories(db: Session = Depends(get_db)):
    return get_all_categories(db)

@router.get("/categories/{category_id}", response_model=NewsCategoryResponse)
def get_news_category_detail(
    category_id: int,
    db: Session = Depends(get_db)
):
    category = db.query(NewsCategory).filter(NewsCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


# ====== ARTICLE ROUTES ======

@router.post("", response_model=NewsArticleResponse)
def create_news_article(
    title: str = Form(...),
    slug: str = Form(...),
    summary: Optional[str] = Form(None),
    content: str = Form(...),
    is_published: bool = Form(False),
    category_id: int = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read() if image else None

    article_data = NewsArticleCreate(
        title=title,
        slug=slug,
        summary=summary,
        content=content,
        is_published=is_published,
        category_id=category_id,
        image=image_bytes
    )
    return create_article(db, article_data)


@router.put("/{article_id}", response_model=NewsArticleResponse)
def update_news_article(
    article_id: int,
    title: str = Form(...),
    slug: str = Form(...),
    summary: Optional[str] = Form(None),
    content: str = Form(...),
    is_published: bool = Form(False),
    category_id: Optional[int] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_bytes = image.file.read() if image else None

    update_data = NewsArticleUpdate(
        title=title,
        slug=slug,
        summary=summary,
        content=content,
        is_published=is_published,
        category_id=category_id,
        image=image_bytes
    )
    return update_article(db, article_id, update_data)


@router.delete("/{article_id}")
def delete_news_article(article_id: int, db: Session = Depends(get_db)):
    success = delete_article(db, article_id)
    if not success:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted successfully"}

@router.get("/details/{article_id}/{slug}", response_model=NewsArticleResponse)
def read_article(article_id: int, slug: str, db: Session = Depends(get_db)):
    return get_article_by_id_and_slug(db, article_id, slug)

@router.get("", response_model=List[NewsArticleResponse])
def list_news_articles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, le=1000),
    db: Session = Depends(get_db)
):
    return get_all_articles(db)[skip: skip + limit]

@router.get("/{article_id}", response_model=NewsArticleResponse)
def get_news_article_detail(article_id: int, db: Session = Depends(get_db)):
    return get_article_by_id(db, article_id)
