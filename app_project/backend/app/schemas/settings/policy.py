from typing import Optional
from pydantic import BaseModel

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
