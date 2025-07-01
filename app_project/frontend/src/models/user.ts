// src/models/user.ts

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  profile_picture?: string;    
  is_active: boolean;
  is_verified: boolean;
  role: UserRole;              
  created_at: string;          
  updated_at: string;          
  last_login?: string | null;  
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  profile_picture?: string;    
  role?: UserRole;             
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  phone_number?: string;
  profile_picture?: string;
  password?: string;
  is_active?: boolean;
  is_verified?: boolean;
  role?: UserRole;
}

export enum UserRole {
  ADMIN       = 'admin',
  USER        = 'user',
  GUEST       = 'guest',
  MANAGER     = 'manager',
  TEAM_LEAD   = 'team_lead',
  SUPERVISOR  = 'supervisor',
  ROOT        = 'root',
  AUDITOR     = 'auditor',
  SUPPORT     = 'support',
}

export interface UserListParams {
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

export interface PaginatedUsers {
  data: UserResponse[];
  total: number;
  skip: number;
  limit: number;
}
