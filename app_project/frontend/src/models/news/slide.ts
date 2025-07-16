export interface SlideBase {
  title?: string | null;
  link?: string | null;
  order: number;
  is_active: boolean;
}

export interface SlideCreate extends SlideBase {
  image: File;
}

export interface SlideUpdate extends SlideBase {
  image?: File | null;
}

export interface SlideResponse extends SlideBase {
  id: number;
  created_at: string;
  updated_at: string;
  image?: string | null; 
}
