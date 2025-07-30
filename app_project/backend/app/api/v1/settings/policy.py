from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List
from app.core.permissions import permission_required
from app.schemas.settings.policy import PolicyItem, PolicyCreate
from app.services.settings.policy_service import PolicyService

router = APIRouter(
    prefix="/policies",
    tags=["Policy"],
    dependencies=[Depends(permission_required())]
)

@router.get(
    "/permission",
    response_model=List[PolicyItem]
)
def list_policies_permission():
    return PolicyService.list_policies_permission()

@router.get(
    "/group",
    response_model=List[PolicyItem]    
)
def list_policies_group():
    return PolicyService.list_policies_group()

@router.get(
    "/permission/view",
    response_model=List[PolicyItem]    
)
def list_view_policies():
    return PolicyService.list_view_policies()

@router.post("/", status_code=status.HTTP_201_CREATED)
async def add_policy(item: PolicyCreate):
    await PolicyService.add_policy(item)
    return {
        "msg": "Policy added",
        "data": item  
    }

@router.delete(
    "/",
    status_code=status.HTTP_204_NO_CONTENT    
)
async def remove_policy(item: PolicyCreate = Body(...)):
    await PolicyService.remove_policy(item)
