from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.news.news import NewsCategory, NewsArticle
from app.schemas.news.news import (
    NewsCategoryCreate, NewsCategoryUpdate,
    NewsArticleCreate, NewsArticleUpdate
)
from slugify import slugify

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
    if not data.slug:
        data.slug = make_slug(data.title)
    article = NewsArticle(**data.model_dump())
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

def update_article(db: Session, article_id: int, data: NewsArticleUpdate) -> NewsArticle:
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(404, f"Article {article_id} not found")

    data_dict = data.model_dump(exclude_unset=True)

    if "title" in data_dict and not data_dict.get("slug"):
        data_dict["slug"] = make_slug(data_dict["title"])

    for field, value in data_dict.items():
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

def make_slug(title: str) -> str:
    return slugify(title, separator='-', allow_unicode=True, lowercase=True, max_length=60)

def get_all_articles(db: Session):
    return db.query(NewsArticle).order_by(NewsArticle.published_at.desc()).all()

def get_article_by_id(db: Session, article_id: int) -> NewsArticle:
    article = db.query(NewsArticle).filter(
        NewsArticle.id == article_id,
        NewsArticle.is_published == True
    ).first()
    if not article:
        raise HTTPException(404, "Article not found")
    return article

def get_article_by_id_and_slug(
    db: Session,
    article_id: int,
    slug: str
) -> NewsArticle:
    article = db.query(NewsArticle).filter(
        NewsArticle.id == article_id,
        NewsArticle.slug == slug,            
        NewsArticle.is_published == True
    ).first()

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    return article