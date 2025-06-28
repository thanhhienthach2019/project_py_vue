import os
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from app.models.machine import Machine
from app.schemas.machine import MachineCreate, MachineUpdate

load_dotenv()

def add_machine(db: Session, machine_data: MachineCreate):
    new_machine = Machine(
        Name=machine_data.Name,
        Type=machine_data.Type,
        Manufacturer=machine_data.Manufacturer,
        Model=machine_data.Model,
        SerialNumber=machine_data.SerialNumber,
        PurchaseDate=machine_data.PurchaseDate,
        LastMaintenance=machine_data.LastMaintenance,
        Status=machine_data.Status,
        Location=machine_data.Location,
        Description=machine_data.Description,
        CreatedBy=machine_data.CreatedBy
    )
    db.add(new_machine)
    db.commit()
    db.refresh(new_machine)
    return new_machine

def update_machine(db: Session, machine_id: int, machine_data: MachineUpdate):
    machine = db.query(Machine).filter(Machine.MachineID == machine_id).first()
    if not machine:
        raise ValueError(f"Machine với ID {machine_id} không tồn tại")

    machine.Name = machine_data.Name
    machine.Type = machine_data.Type
    machine.Manufacturer = machine_data.Manufacturer
    machine.Model = machine_data.Model
    machine.SerialNumber = machine_data.SerialNumber
    machine.PurchaseDate = machine_data.PurchaseDate
    machine.LastMaintenance = machine_data.LastMaintenance
    machine.Status = machine_data.Status
    machine.Location = machine_data.Location
    machine.Description = machine_data.Description
    machine.CreatedBy = machine_data.CreatedBy

    db.commit()
    db.refresh(machine)
    return machine

def delete_machine(db: Session, machine_id: int):
    machine = db.query(Machine).filter(Machine.MachineID == machine_id).first()
    if not machine:
        raise ValueError(f"Machine với ID {machine_id} không tồn tại")
    
    db.delete(machine)
    db.commit()
    return True

def get_all_machines(db: Session):
    return db.query(Machine).all()

def get_machine_by_id(db: Session, machine_id: int):
    return db.query(Machine).filter(Machine.MachineID == machine_id).first()
