// composables/useActionDisabled.ts
import { computed, type Ref } from "vue";

export function useActionDisabled(...flags: (boolean | Ref<boolean>)[]) {
  const isDisabled = computed(() =>
    flags.some((f) => (typeof f === "boolean" ? f : f.value))
  );

  const disabledClass = computed(() =>
    isDisabled.value ? "opacity-50 cursor-not-allowed" : ""
  );

  return {
    isDisabled,
    disabledClass,
  };
}
