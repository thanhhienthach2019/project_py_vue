// ─── CATEGORY ─────────────────────────────────────────
export interface ScriptureCategoryBase {
  name: string;
  slug: string;
  description?: string | null;
}

export interface ScriptureCategoryCreate extends ScriptureCategoryBase {}
export interface ScriptureCategoryUpdate extends ScriptureCategoryBase {}

export interface ScriptureCategoryResponse extends ScriptureCategoryBase {
  id: number;
  created_at: string;
  updated_at: string;
}

// ─── SCRIPTURE ────────────────────────────────────────
export interface ScriptureBase {
  title: string;
  author?: string | null;
  content?: string | null;
  pdf_url?: string | null;
}

export interface ScriptureCreate extends ScriptureBase {
  category_id: number;
}

export interface ScriptureUpdate extends ScriptureBase {
  category_id?: number;
}

export interface ScriptureResponse extends ScriptureBase {
  id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
}
