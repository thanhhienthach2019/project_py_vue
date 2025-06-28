from enum import Enum

class MovementType(Enum):
    IMPORT = "Import"
    EXPORT = "Export"

class ReferenceType(Enum):
    PURCHASE_ORDER = "PurchaseOrder"
    MATERIAL_REQUEST = "MaterialRequest"
    MANUAL_ADJUSTMENT = "ManualAdjustment"