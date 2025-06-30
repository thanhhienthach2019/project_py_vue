from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services import user_service  
from app.core.permissions import permission_required

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)

@router.get(
    "/",
    response_model=List[UserResponse],
    dependencies=[Depends(permission_required("menu:settings:user", "read"))]
)
def read_users(
    skip: int = 0,
    limit: int = 100,
    is_active: bool = True,
    db: Session = Depends(get_db)
):
    return user_service.get_users(db, skip=skip, limit=limit, is_active=is_active)

@router.post(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(permission_required("menu:settings:user", "create"))]
)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_service.get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return user_service.create_user(db, user)

@router.get(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(permission_required("menu:settings:user", "read"))]
)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put(
    "/{user_id}",
    response_model=UserResponse,
    dependencies=[Depends(permission_required("menu:settings:user", "update"))]
)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    user = user_service.update_user(db, user_id, user_update)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(permission_required("menu:settings:user", "delete"))]
)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = user_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return