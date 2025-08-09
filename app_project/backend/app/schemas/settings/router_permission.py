from typing import Optional, Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints, Field
from uuid import UUID

StrippedNonEmptyStr = Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]

# ======== Router Schemas ========

class RouterBase(BaseModel):
    name: StrippedNonEmptyStr
    path: StrippedNonEmptyStr
    method: StrippedNonEmptyStr
    version: int

class RouterCreate(RouterBase):
    pass

class RouterUpdate(RouterBase):
    model_config = ConfigDict(from_attributes=True)

class RouterResponse(RouterBase):
    id: UUID
    model_config = ConfigDict(from_attributes=True)


# ======== Permission Schemas ========

class PermissionBase(BaseModel):
    resource: StrippedNonEmptyStr
    action: StrippedNonEmptyStr
    version: int

class PermissionCreate(PermissionBase):
    pass

class PermissionUpdate(PermissionBase):

    model_config = ConfigDict(from_attributes=True)

class PermissionResponse(PermissionBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)


# ======== RouterPermission Schemas ========

class RouterPermissionBase(BaseModel):
    router_id: UUID
    permission_id: UUID
    version: int

class RouterPermissionCreate(RouterPermissionBase):
    pass

class RouterPermissionUpdate(RouterPermissionBase):
    model_config = ConfigDict(from_attributes=True)

class RouterPermissionResponse(RouterPermissionBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)

class RouterPermissionWithDetails(RouterPermissionResponse):
    router: Optional[RouterResponse]
    permission: Optional[PermissionResponse]
