export interface VideoBase {
  title: string;
  description?: string | null;
  youtube_url: string;
  is_active: boolean;
}

export interface VideoCreate extends VideoBase {
  thumbnail?: File | null;
}

export interface VideoUpdate extends Partial<VideoBase> {
  thumbnail?: File | null;
}

export interface VideoResponse extends VideoBase {
  id: number;
  thumbnail?: string | null; 
  published_at: string;
  created_at: string;
  updated_at: string;
}
