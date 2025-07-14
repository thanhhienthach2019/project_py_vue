from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import permission_required
from app.services.inventory.machine_service import (
    add_machine,
    update_machine,
    delete_machine,
    get_all_machines,
    get_machine_by_id,
)
from app.schemas.inventory.machine import MachineCreate, MachineUpdate

router = APIRouter(
    prefix="/machines",
    tags=["Machines"],
    dependencies=[Depends(permission_required())],  
)

@router.get("")
def list_machines(db: Session = Depends(get_db)):
    """
    Get a list of all machines.
    """
    return get_all_machines(db)


@router.get("/{machine_id}")
def retrieve_machine(machine_id: int, db: Session = Depends(get_db)):
    """
    Get a single machine by its ID.
    """
    machine = get_machine_by_id(db, machine_id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine


@router.post("")
def create_machine(machine: MachineCreate, db: Session = Depends(get_db)):
    """
    Create a new machine.
    """
    return add_machine(db, machine)


@router.put("/{machine_id}")
def update_machine_info(machine_id: int, machine: MachineUpdate, db: Session = Depends(get_db)):
    """
    Update an existing machine.
    """
    updated = update_machine(db, machine_id, machine)
    if not updated:
        raise HTTPException(status_code=404, detail="Machine not found")
    return updated


@router.delete("/{machine_id}")
def delete_machine_info(machine_id: int, db: Session = Depends(get_db)):
    """
    Delete a machine by its ID.
    """
    deleted = delete_machine(db, machine_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Machine not found")
    return {"message": "Machine deleted successfully"}
