<template>
  <div class="relative w-full">
    <!-- Search Input -->
    <div class="relative mb-4">
      <input
        v-model="search"
        placeholder="Search materials..."
        @focus="isOpen = true"
        class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
      />
      <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
    </div>

    <!-- Dropdown List -->
    <div
      v-if="isOpen"
      class="border border-white/10 rounded-xl overflow-hidden"
    >
      <div class="max-h-60 overflow-y-auto custom-scrollbar bg-white/3">
        <div
          v-for="item in filteredOptions"
          :key="item[valueKey]"
          @click="selectItem(item)"
          class="group flex justify-between items-center p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer border-b border-white/5"
        >
          <div class="flex-1">
            <p class="text-sm font-semibold text-white">
              {{ item[labelKey] }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ item[codeKey] }}
            </p>
          </div>
          <button
            class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30"
          >
            <Icon icon="mdi:plus" class="text-blue-400 text-sm" />
          </button>
        </div>
        <div
          v-if="filteredOptions.length === 0"
          class="px-4 py-2 text-gray-400"
        >
          No results found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  modelValue: number | string | null;
  options: any[];
  labelKey: string;
  valueKey: string;
  codeKey: string; // Prop mới để hiển thị code (ví dụ: MaterialCode)
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number | string | null): void;
}>();

const search = ref("");
const isOpen = ref(false);

// Sync label with selected modelValue
watch(
  () => props.modelValue,
  (val) => {
    const sel = props.options.find((o) => o[props.valueKey] === val);
    search.value = sel ? sel[props.labelKey] : "";
  },
  { immediate: true }
);

// Filter options by keyword
const filteredOptions = computed(() =>
  props.options.filter((opt) =>
    String(opt[props.labelKey])
      .toLowerCase()
      .includes(search.value.toLowerCase().trim())
  )
);

// Select item
function selectItem(item: any) {
  emit("update:modelValue", item[props.valueKey]);
  search.value = item[props.labelKey];
  isOpen.value = false;
}

// Close dropdown when clicking outside
const onClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest(".relative")) isOpen.value = false;
};

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}
</style>
