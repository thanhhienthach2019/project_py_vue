export interface MenuItemBase {
  title: string;
  path: string;
  icon: string;
  permission_key: string;
  parent_id?: string | null;
  version: number,
  order: number;
}

export interface MenuItemCreate extends MenuItemBase {
  children?: MenuItemCreate[];
}

export interface MenuItemUpdate extends MenuItemBase {}

export interface MenuItemResponse extends MenuItemBase {
  id: string;
  children?: MenuItemResponse[];
}
