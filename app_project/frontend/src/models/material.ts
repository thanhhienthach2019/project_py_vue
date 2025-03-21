// src/models/material.ts
export interface Material {
    MaterialID?: number;  
    MaterialCode: string;
    MaterialName: string;
    Unit?: string;
    Description?: string;
    ImageUrl?: string;
    Model?: string;
    Origin?: string;
    CreatedAt?: string; 
  }