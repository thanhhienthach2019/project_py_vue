<template>
  <div class="relative w-full" ref="wrapper">
    <!-- Search input -->
    <div class="relative">
      <input
        v-model="search"
        @focus="openDropdown"
        @input="openDropdown"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ChevronDown class="absolute right-3 top-2.5 text-gray-400 w-4 h-4" />
      <X
        v-if="search"
        @click="clearSearch"
        class="absolute right-8 top-2.5 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-200 transition"
      />
    </div>

    <!-- Teleport dropdown ra body -->
    <Teleport to="body">
      <ul
        v-if="isOpen"
        ref="dropdown"
        :style="dropdownStyles"
        class="fixed z-[999] max-h-80 overflow-auto rounded-lg bg-[#1e2a38]/95 text-white border border-gray-700 shadow-xl pointer-events-auto"
      >
        <li
          v-for="item in filteredOptions"
          :key="item[valueKey]"
          @click.prevent="select(item)"
          class="px-4 py-2 hover:bg-blue-600 cursor-pointer transition"
        >
          {{ item[labelKey] }}
        </li>
        <li v-if="filteredOptions.length === 0" class="px-4 py-2 text-gray-400">
          No results found.
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { ChevronDown, X } from "lucide-vue-next";
import type { CSSProperties } from "vue";

interface Props {
  modelValue: number | string | null;
  options: any[];
  labelKey: string;
  valueKey: string;
  placeholder?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number | string | null): void;
}>();

const search = ref("");
const isOpen = ref(false);
const wrapper = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const filteredOptions = computed(() => {
  const kw = search.value.toLowerCase().trim();
  return props.options.filter((opt) =>
    String(opt[props.labelKey]).toLowerCase().includes(kw)
  );
});

const dropdownStyles = reactive<CSSProperties>({
  position: "fixed",
  top: "0px",
  left: "0px",
  width: "0px",
});

function updateDropdownPosition() {
  if (!wrapper.value) return;
  const rect = wrapper.value.getBoundingClientRect();
  dropdownStyles.top = `${rect.top + rect.height}px`;
  dropdownStyles.left = `${rect.left}px`;
  dropdownStyles.width = `${rect.width}px`;
}

function openDropdown() {
  isOpen.value = true;
  nextTick(() => {
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
  });
}

function clearSearch() {
  search.value = "";
  emit("update:modelValue", null);
  openDropdown();
}

function select(item: any) {
  emit("update:modelValue", item[props.valueKey]);
  search.value = item[props.labelKey];
  closeDropdown();
}

function closeDropdown() {
  isOpen.value = false;
  window.removeEventListener("scroll", updateDropdownPosition, true);
  window.removeEventListener("resize", updateDropdownPosition);
}

function onClickOutside(e: MouseEvent) {
  if (
    !wrapper.value?.contains(e.target as Node) &&
    !dropdown.value?.contains(e.target as Node)
  ) {
    closeDropdown();
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));

watch(
  () => props.modelValue,
  (val) => {
    const sel = props.options.find((o) => o[props.valueKey] === val);
    search.value = sel ? sel[props.labelKey] : "";
  },
  { immediate: true }
);
</script>
