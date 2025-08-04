// src/types/api.ts

export type GenericResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  args?: Record<string, any>;
  error?: any;
};

export type ActionResult<T = unknown> = {
  success: boolean
  message?: string
  args?: Record<string, any>
  data?: T
}