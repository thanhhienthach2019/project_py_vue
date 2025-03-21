from fastapi import APIRouter, Depends
from fastapi.templating import Jinja2Templates
from fastapi.requests import Request
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, get_db
from app.models.inventory import Inventory

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

@router.get("/inventory_html")
def get_inventory_html(request: Request, db: Session = Depends(get_db)):
    inventory = db.query(Inventory).all()
    return templates.TemplateResponse("index.html", {"request": request, "inventory": inventory})