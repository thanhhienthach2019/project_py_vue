export interface NewsCategoryBase {
  name: string;
  slug: string;
  description?: string | null;
}

export interface NewsCategoryCreate extends NewsCategoryBase {}
export interface NewsCategoryUpdate extends NewsCategoryBase {}

export interface NewsCategoryResponse extends NewsCategoryBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NewsArticleBase {
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  is_published?: boolean;
}

export interface NewsArticleCreate extends NewsArticleBase {
  category_id: number;
  image?: File | null;
}

export interface NewsArticleUpdate extends NewsArticleBase {
  category_id?: number;
  image?: File | null;
}

export interface NewsArticleResponse extends NewsArticleBase {
  id: number;
  category_id: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  image?: string | null; 
}
