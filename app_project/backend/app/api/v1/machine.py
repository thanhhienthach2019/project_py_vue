from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.permissions import permission_required
from app.services.machine_service import (
    add_machine, update_machine, delete_machine, get_all_machines, get_machine_by_id
)
from app.schemas.machine import MachineCreate, MachineUpdate

router = APIRouter()

@router.get("/get_machines")
def fetch_machines(db: Session = Depends(get_db),
                   _: None = Depends(permission_required("menu:machines", "view"))):
    try:
        return get_all_machines(db)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.get("/get_machine/{machine_id}")
def fetch_machine_by_id(machine_id: int, 
                        db: Session = Depends(get_db), 
                        _: None = Depends(permission_required("menu:machines", "view"))):
    try:
        return get_machine_by_id(db, machine_id)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

@router.post("/add_machine")
def create_machine(machine: MachineCreate, 
                   db: Session = Depends(get_db), 
                   _: None = Depends(permission_required("menu:machines", "create"))):
    try:
        return add_machine(db, machine)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)    

@router.put("/update_machine/{machine_id}")
def modify_machine(machine_id: int, 
                   machine: MachineUpdate, 
                   db: Session = Depends(get_db), 
                   _: None = Depends(permission_required("menu:machines", "update"))):
    try:
        return update_machine(db, machine_id, machine)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)    

@router.delete("/delete_machine/{machine_id}")
def remove_machine(machine_id: int, 
                   db: Session = Depends(get_db), 
                   _: None = Depends(permission_required("menu:machines", "delete"))):
    try:
        return delete_machine(db, machine_id)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
