<template>
    <!-- Modal xác nhận xóa -->
    <div 
      v-if="show" 
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-semibold text-gray-800">Xác nhận xóa</h2>
        <p class="text-gray-600 mt-2">Bạn có chắc chắn muốn xóa dữ liệu này?</p>
  
        <!-- Nút Hủy và Xóa -->
        <div class="mt-4 flex justify-end">
          <button 
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
            @click="closeModal"
          >
            Hủy
          </button>
          <button 
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            @click="confirmDelete"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    show: Boolean, // Trạng thái hiển thị modal
  });
  
  const emit = defineEmits(["close", "confirm"]);
  
  // Đóng modal
  const closeModal = () => {
    emit("close");
  };
  
  // Xác nhận xóa
  const confirmDelete = () => {
    emit("confirm");
  };
  </script>
  