export interface AnnouncementCreate {
  title: string;
  message: string;
  announcement_date: string; // ISO date string
}

export interface AnnouncementUpdate {
  title?: string;
  message?: string;
  announcement_date?: string;
}

export interface AnnouncementResponse extends AnnouncementCreate {
  id: number;
  created_at: string;
  updated_at: string;
}
