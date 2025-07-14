from pydantic import BaseModel
from datetime import datetime

class DonorBase(BaseModel):
    full_name: str
    donation_amount: float
    message: str | None = None

class DonorCreate(DonorBase):
    image: bytes | None = None

class DonorUpdate(DonorBase):
    image: bytes | None = None

class DonorResponse(DonorBase):
    id: int
    donated_at: datetime
    image: bytes | None = None

    class Config:
        from_attributes = True
