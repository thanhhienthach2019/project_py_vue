export interface MenuItemBase {
  title: string;
  path: string;
  icon: string;
  permission_key: string;
  parent_id?: number | null;
  order: number;
}

export interface MenuItemCreate extends MenuItemBase {
  children?: MenuItemCreate[];
}

export interface MenuItemUpdate extends MenuItemBase {}

export interface MenuItemResponse extends MenuItemBase {
  id: number;
  children?: MenuItemResponse[];
}
