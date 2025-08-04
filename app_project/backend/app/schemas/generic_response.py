from typing import Generic, TypeVar, Optional, Dict, Any
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

class GenericResponse(GenericModel, Generic[T]):
    data: Optional[T] = None
    message: Optional[str] = None  
    args: Optional[Dict[str, Any]] = None  
