import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useLayout() {
  const sidebarOpen = ref(true);
  const isMobile = ref(false);

  const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 1024;
    sidebarOpen.value = !isMobile.value;
  };

  onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkScreenSize);
  });

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };

  return {
    sidebarOpen,
    isMobile,
    toggleSidebar
  };
}