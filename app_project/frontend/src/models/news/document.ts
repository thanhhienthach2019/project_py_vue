export interface DocumentBase {
  title: string;
  description?: string;
  file_url?: string;
  content?: string;
}

export interface DocumentCreate extends DocumentBase {
  category_id: number;
  image?: File | null;
}

export interface DocumentUpdate extends DocumentBase {
  category_id?: number;
  image?: File | null;
}

export interface DocumentResponse extends DocumentBase {
  id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  image?: string | null;
}

export interface DocumentCategoryBase {
  name: string;
  slug: string;
  description?: string;
}

export interface DocumentCategoryCreate extends DocumentCategoryBase {
  icon?: File;
}

export interface DocumentCategoryUpdate extends DocumentCategoryBase {
  icon?: File;
}

export interface DocumentCategoryResponse extends DocumentCategoryBase {
  id: number;
  created_at: string;
  updated_at: string;
  icon?: string | null;
}
