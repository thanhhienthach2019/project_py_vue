from typing import Optional
from pydantic import BaseModel, ConfigDict

# ======== Router Schemas ========

class RouterBase(BaseModel):
    name: str
    path: str
    method: str

class RouterCreate(RouterBase):
    pass

class RouterUpdate(RouterBase):
    pass

class RouterResponse(RouterBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ======== Permission Schemas ========

class PermissionBase(BaseModel):
    resource: str
    action: str

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(PermissionBase):
    pass

class PermissionResponse(PermissionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# ======== RouterPermission Schemas ========

class RouterPermissionBase(BaseModel):
    router_id: int
    permission_id: int

class RouterPermissionCreate(RouterPermissionBase):
    pass

class RouterPermissionUpdate(RouterPermissionBase):
    pass

class RouterPermissionResponse(RouterPermissionBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
    
class RouterPermissionWithDetails(RouterPermissionResponse):
    router: Optional[RouterResponse]
    permission: Optional[PermissionResponse]