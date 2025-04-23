<template>
    <div class="relative group">
      <input
        type="file"
        accept="image/*"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        @change="onFileChange"
      />
      <div 
        class="border-2 border-dashed border-white/20 rounded-xl p-6 transition-all duration-300"
        :class="{
          'border-blue-400/50 bg-blue-500/10': isDragging,
          'hover:border-blue-400/30': !previewUrl
        }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop"
      >
        <div v-if="!previewUrl" class="flex flex-col items-center justify-center space-y-3 text-center">
          <div class="p-3 bg-white/5 rounded-full">
            <Icon icon="mdi:cloud-upload" class="text-2xl text-blue-400" />
          </div>
          <p class="text-sm font-medium text-white">Drag & drop image here</p>
          <p class="text-xs text-gray-400">or click to browse (max 5MB)</p>
        </div>
        <div v-else class="relative">
          <img 
            :src="previewUrl" 
            alt="Preview" 
            class="w-full h-48 object-cover rounded-lg shadow-md"
          />
          <button
            @click.stop="removeImage"
            class="absolute -top-3 -right-3 p-1.5 bg-red-500/90 rounded-full shadow-lg hover:bg-red-400 transition-colors"
          >
            <Icon icon="mdi:close" class="text-white text-sm" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Icon } from '@iconify/vue';
  
  const props = defineProps({
    previewUrl: {
      type: String,
      default: null
    }
  });
  
  const emit = defineEmits(['update:previewUrl', 'update:file']);
  
  const isDragging = ref(false);
  
  const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      processFile(target.files[0]);
    }
  };
  
  const handleDrop = (e: DragEvent) => {
    isDragging.value = false;
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  
  const processFile = (file: File) => {
    // Validate file type and size
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      emit('update:previewUrl', result);
      emit('update:file', file);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    emit('update:previewUrl', null);
    emit('update:file', null);
  };
  
  watch(() => props.previewUrl, (newVal) => {
    if (!newVal) {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  });
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