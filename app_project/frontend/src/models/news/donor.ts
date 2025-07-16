// models/news/donor.ts

export interface DonorBase {
  full_name: string;
  donation_amount: number;
  message?: string | null;
}

export interface DonorCreate extends DonorBase {
  image?: File | null;
}

export interface DonorUpdate extends DonorBase {
  image?: File | null;
}

export interface DonorResponse extends DonorBase {
  id: number;
  donated_at: string; // ISO date string
  image?: string | null; // base64 or URL if handled separately
}
