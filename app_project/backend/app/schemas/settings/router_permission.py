from typing import Optional, Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints

StrippedNonEmptyStr = Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]
# ======== Router Schemas ========

class RouterBase(BaseModel):
    name: StrippedNonEmptyStr
    path: StrippedNonEmptyStr
    method: StrippedNonEmptyStr

class RouterCreate(RouterBase):
    pass

class RouterUpdate(RouterBase):
    pass

class RouterResponse(BaseModel):
    id: int
    name: str
    path: str
    method: str
    model_config = ConfigDict(from_attributes=True)

# ======== Permission Schemas ========

class PermissionBase(BaseModel):
    resource: StrippedNonEmptyStr
    action: StrippedNonEmptyStr

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(PermissionBase):
    pass

class PermissionResponse(BaseModel):
    id: int
    resource: str
    action: str
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