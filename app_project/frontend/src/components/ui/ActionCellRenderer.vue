<template>
  <div class="relative">
    <!-- Nút 3 chấm -->
    <button @click="toggleDropdown" class="text-gray-500 hover:text-gray-700 transition-colors">
      <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div v-if="isDropdownOpen" class="absolute right-0 w-40 bg-white border rounded-md shadow-lg mt-2 z-50">
      <button @click="handleEdit" class="block w-full px-4 py-2 text-left hover:bg-gray-100">
        ✏️ Chỉnh sửa
      </button>
      <button @click="handleDelete" class="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600">
        🗑 Xóa
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue";

interface Props {
  params: {
    data: any;
    context: {
      onEdit: (id: number) => void;
      onDelete: (id: number) => void;
    };
  };
}

const props = withDefaults(defineProps<Props>(), {
  params: () => ({
    data: {},
    context: {
      onEdit: () => console.warn("Edit handler not provided!"),
      onDelete: () => console.warn("Delete handler not provided!")
    }
  })
});

const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleEdit = () => {
  if (props.params.data?.MaterialID) {
    props.params.context.onEdit(props.params.data.MaterialID);
    isDropdownOpen.value = false;
  } else {
    console.error("MaterialID is missing!");
  }
};

const handleDelete = () => {
  if (props.params.data?.MaterialID) {
    props.params.context.onDelete(props.params.data.MaterialID);
    isDropdownOpen.value = false;
  } else {
    console.error("MaterialID is missing!");
  }
};
</script>