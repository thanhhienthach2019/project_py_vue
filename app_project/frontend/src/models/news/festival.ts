// models/news/festival.ts

export interface FestivalBase {
  name: string;
  description?: string;
  start_date: string; // ISO string format
  end_date?: string;
  location?: string;
  is_active: boolean;
}

export interface FestivalCreate extends FestivalBase {
  image?: File | null;
}

export interface FestivalUpdate extends FestivalBase {
  image?: File | null;
}

export interface FestivalResponse extends FestivalBase {
  id: number;
  created_at: string;
  updated_at: string;
  image?: string | null; // base64 encoded
}
