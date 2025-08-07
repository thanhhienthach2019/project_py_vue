<template>
  <div class="relative group w-full">
    <input
      type="file"
      accept="image/*"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      @change="onFileChange"
    />

    <div
      class="border-2 border-dashed border-white/20 rounded-xl transition-all duration-300 overflow-hidden"
      :class="{
        'border-blue-400/50 bg-blue-500/10': isDragging,
        'hover:border-blue-400/30': !previewUrl,
      }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div
        v-if="!previewUrl"
        class="flex flex-col items-center justify-center space-y-3 text-center px-6 py-8"
      >
        <div class="p-3 bg-white/5 rounded-full">
          <Icon icon="mdi:cloud-upload" class="text-2xl text-blue-400" />
        </div>
        <p class="text-sm font-medium text-white">Drag & drop image here</p>
        <p class="text-xs text-gray-400">or click to browse (max 5MB)</p>
      </div>

      <div
        v-else
        class="relative w-[180px] h-[180px] rounded-xl overflow-hidden"
      >
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-full h-full object-cover"
        />
        <button
          @click.stop="removeImage"
          class="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full shadow-lg hover:bg-red-400 transition-colors z-20"
        >
          <Icon icon="mdi:close" class="text-white text-sm" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = defineProps({
  previewUrl: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:previewUrl", "update:file", "remove"]);

const isDragging = ref(false);

const onFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files?.[0]) processFile(input.files[0]);
};

const handleDrop = (e: DragEvent) => {
  isDragging.value = false;
  const file = e.dataTransfer?.files?.[0];
  if (file) processFile(file);
};

const processFile = (file: File) => {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be under 5MB.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result as string;
    emit("update:previewUrl", result);
    emit("update:file", file);
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  emit("update:previewUrl", null);
  emit("update:file", null);
  emit("remove");
};

watch(
  () => props.previewUrl,
  (newVal) => {
    if (!newVal) {
      const input = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (input) input.value = "";
    }
  }
);
</script>

<style scoped>
input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}
</style>
