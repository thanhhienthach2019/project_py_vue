<template>
  <div
    class="flex flex-col min-h-screen bg-gradient-to-b from-amber-50 to-white"
  >
    <Header />
    <main class="flex-grow container mx-auto px-4 py-6">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/layout/UserHeader.vue";
import Footer from "@/components/layout/UserFooter.vue";
</script>

<style scoped>
.container {
  max-width: 1280px;
}
</style>
