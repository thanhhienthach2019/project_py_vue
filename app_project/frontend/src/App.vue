<template>
  <router-view />
  <ToastTailwind ref="toastRef" />
</template>

<script setup lang="ts">
import { useAuthStore } from "@/store/auth";
import { onMounted, ref, provide } from "vue";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";

const authStore = useAuthStore();
const toastRef = ref<InstanceType<typeof ToastTailwind> | null>(null);
provide("toast", toastRef);

onMounted(() => {
  authStore.fetchUser();
});
</script>
<!-- <template>
  <div class="flex">
    <Sidebar />
    <div class="flex-1">
      <Header />
      <MainContent />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import MainContent from '@/components/layout/MainContent.vue'

export default defineComponent({
  components: { Sidebar, Header, MainContent },
})
</script> -->