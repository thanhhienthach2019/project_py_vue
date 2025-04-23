// src/models/material.ts
export interface Material {
    MaterialID: number;  
    MaterialCode: string;
    MaterialName: string;
    Unit?: string;
    Description?: string;
    ImageUrl?: File | string | null;
    Model?: string;
    Origin?: string;
    Weight?: number;
    Dimensions?: string;
    CreatedAt?: string; 
  }