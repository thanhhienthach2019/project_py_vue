// src/models/materialWithStock.ts
import type { Material } from "@/models/inventory/material";
import type { Inventory } from "@/models/inventory/inventory";

export interface MaterialWithStock {
  material: Material;
  remaining_quantity: number;
  inventories: Inventory[];
}
