from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List
from app.core.permissions import permission_required_root
from app.schemas.policy.policy import PolicyItem, PolicyCreate
from app.services.policy.policy_service import PolicyService

router = APIRouter()


@router.get(
    "/policies/permission",
    response_model=List[PolicyItem],
    dependencies=[Depends(permission_required_root("menu:settings:policy", "read"))],
)
def list_policies_permission():
    return PolicyService.list_policies_permission()


@router.get(
    "/policies/group",
    response_model=List[PolicyItem],
    dependencies=[Depends(permission_required_root("menu:settings:policy", "read"))],
)
def list_policies_group():
    return PolicyService.list_policies_group()

@router.get(
    "/policies/permission/view",
    response_model=List[PolicyItem],
    dependencies=[Depends(permission_required_root("menu:settings:policy", "read"))],
)
def list_view_policies():
    return PolicyService.list_view_policies()

@router.post(
    "/policies",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(permission_required_root("menu:settings:policy", "create"))],
)
def add_policy(item: PolicyCreate):
    PolicyService.add_policy(item)
    return {"msg": "Policy added"}


@router.delete(
    "/policies",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(permission_required_root("menu:settings:policy", "delete"))],
)
def remove_policy(item: PolicyCreate = Body(...)):
    PolicyService.remove_policy(item)
