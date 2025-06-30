from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Optional
from pydantic import BaseModel
from app.core.casbin import enforcer
from app.core.permissions import permission_required

router = APIRouter()


# --- Schemas ---
class PolicyItem(BaseModel):
    ptype: str
    v0: str
    v1: str
    v2: Optional[str] = None
    v3: Optional[str] = None
    v4: Optional[str] = None
    v5: Optional[str] = None


class PolicyCreate(BaseModel):
    ptype: str
    v0: str
    v1: str
    v2: Optional[str] = None


# --- Endpoints ---
@router.get(
    "/policies/permission",
    response_model=List[PolicyItem],
    dependencies=[Depends(permission_required("menu:settings:policy", "read"))]
)
def list_policies_permission():
    """List all policies (p)."""
    items: List[PolicyItem] = []

    for row in enforcer.get_policy():
        items.append(PolicyItem(ptype="p", **dict(zip(["v0", "v1", "v2", "v3", "v4", "v5"], row))))

    return items

@router.get(
    "/policies/group",
    response_model=List[PolicyItem],
    dependencies=[Depends(permission_required("menu:settings:policy", "read"))]
)
def list_policies_group():
    """List all policies (g)."""
    items: List[PolicyItem] = []

    for row in enforcer.get_grouping_policy():
        items.append(PolicyItem(ptype="g", **dict(zip(["v0", "v1"], row))))

    return items

@router.post(
    "/policies",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(permission_required("menu:settings:policy", "create"))]
)
def add_policy(item: PolicyCreate):
    """Add a policy rule (p or g)."""
    if item.ptype == "p":
        ok = enforcer.add_policy(item.v0, item.v1, item.v2)
    elif item.ptype == "g":
        ok = enforcer.add_grouping_policy(item.v0, item.v1)
    else:
        raise HTTPException(400, "Invalid policy type")

    if not ok:
        raise HTTPException(400, "Policy already exists or is invalid")

    enforcer.save_policy()
    return {"msg": "Policy added"}


@router.delete(
    "/policies",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(permission_required("menu:settings:policy", "delete"))]
)
def remove_policy(item: PolicyCreate = Body(...)):
    """Remove a policy rule (p or g)."""
    if item.ptype == "p":
        ok = enforcer.remove_policy(item.v0, item.v1, item.v2)
    elif item.ptype == "g":
        ok = enforcer.remove_grouping_policy(item.v0, item.v1)
    else:
        raise HTTPException(400, "Invalid policy type")

    if not ok:
        raise HTTPException(404, "Policy not found")

    enforcer.save_policy()
