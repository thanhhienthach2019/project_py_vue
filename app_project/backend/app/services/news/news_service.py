from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.news import NewsCategory, NewsArticle
from app.schemas.news.news import (
    NewsCategoryCreate, NewsCategoryUpdate,
    NewsArticleCreate, NewsArticleUpdate
)

# Categories
def create_category(db: Session, data: NewsCategoryCreate) -> NewsCategory:
    category = NewsCategory(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

def update_category(db: Session, category_id: int, data: NewsCategoryUpdate) -> NewsCategory:
    category = db.query(NewsCategory).filter(NewsCategory.id == category_id).first()
    if not category:
        raise HTTPException(404, f"Category {category_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category

def delete_category(db: Session, category_id: int) -> bool:
    category = db.query(NewsCategory).filter(NewsCategory.id == category_id).first()
    if not category:
        raise HTTPException(404, f"Category {category_id} not found")
    db.delete(category)
    db.commit()
    return True

def get_all_categories(db: Session):
    return db.query(NewsCategory).all()


# Articles
def create_article(db: Session, data: NewsArticleCreate) -> NewsArticle:
    article = NewsArticle(**data.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

def update_article(db: Session, article_id: int, data: NewsArticleUpdate) -> NewsArticle:
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(404, f"Article {article_id} not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(article, field, value)
    db.commit()
    db.refresh(article)
    return article

def delete_article(db: Session, article_id: int) -> bool:
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(404, f"Article {article_id} not found")
    db.delete(article)
    db.commit()
    return True

def get_all_articles(db: Session):
    return db.query(NewsArticle).order_by(NewsArticle.published_at.desc()).all()
