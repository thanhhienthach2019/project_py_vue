<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { onMounted } from "vue";

const authStore = useAuthStore();

onMounted(() => {
  authStore.fetchUser();
});
</script>
