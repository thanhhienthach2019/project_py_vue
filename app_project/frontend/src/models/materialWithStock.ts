// src/models/materialWithStock.ts
import type { Material } from "@/models/material";
import type { Inventory } from "@/models/inventory";

export interface MaterialWithStock {
  material: Material;
  remaining_quantity: number;
  inventories: Inventory[];
}
