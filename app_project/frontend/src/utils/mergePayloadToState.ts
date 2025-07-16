// utils/mergePayloadToState.ts

export function mergePayloadToState<TOriginal extends object, TUpdate extends object>(
  original: TOriginal,
  payload: TUpdate,
  fileKeys: (keyof TOriginal & keyof TUpdate)[]
): TOriginal {
  const cleanedPayload: Partial<TUpdate> = { ...payload };

  for (const key of fileKeys) {
    if (key in cleanedPayload && cleanedPayload[key] instanceof File) {
      delete cleanedPayload[key];
    }
  }

  return { ...original, ...cleanedPayload } as TOriginal;
}
