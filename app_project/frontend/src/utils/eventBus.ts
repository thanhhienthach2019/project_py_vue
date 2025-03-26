import mitt from "mitt";

export type Events = {
  toast: { message: string; variant?: string };
};

export const emitter = mitt<Events>();