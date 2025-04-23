<!-- src/App.vue -->
<template>
  <router-view />
  <ToastTailwind ref="toastRef" />
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue';
import { useAuthStore } from '@/store/auth';
import ToastTailwind from '@/pages/Toast/ToastTailwind.vue';

const authStore = useAuthStore();
const toastRef = ref<InstanceType<typeof ToastTailwind> | null>(null);
provide('toast', toastRef);

onMounted(() => {
  authStore.fetchUser();
});
</script>
