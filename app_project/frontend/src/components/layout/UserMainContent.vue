<template>
  <div class="space-y-12 py-8">
    <!-- Hero Section -->
    <!-- Hero Section with Slideshow -->
    <section class="relative rounded-2xl overflow-hidden shadow-xl">
      <!-- Slideshow Container -->
      <div class="relative h-[500px]">
        <!-- Slide Backgrounds -->
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          :class="{
            'opacity-100 z-0': currentSlideIndex === index,
            'opacity-0 z-0': currentSlideIndex !== index,
          }"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-amber-900/80 to-amber-800/60 z-10"
          ></div>

          <!-- Slide Image -->
          <img
            :src="
              slide.image_base64
                ? `data:image/jpeg;base64,${slide.image_base64}`
                : '/placeholder.jpg'
            "
            :alt="slide.title || 'Khmer Culture Slide'"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Slide Content -->
        <div class="absolute inset-0 z-20 flex items-center">
          <div class="container mx-auto px-8 text-white">
            <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              ស្វែងយល់ពី<br /><br />
              <span v-if="currentSlide && currentSlide.title">
                {{ currentSlide.title }}
              </span>
            </h1>

            <!-- Slide Title -->
            <p
              v-if="currentSlide && currentSlide.headline"
              class="text-xl max-w-2xl mb-8 text-amber-100 animate-fadeIn"
            >
              {{ currentSlide.headline }}
            </p>

            <!-- Default Text if no slide title -->
            <p v-else class="text-xl max-w-2xl mb-8 text-amber-100">
              ប្រព័ន្ធផ្សព្វផ្សាយព័ត៌មានអំពីទំនៀមទំលាប់ ពិធីបុណ្យ
              និងព្រះធម៌ប្រៀនប្រដៅរបស់ព្រះពុទ្ធសាសនា
            </p>

            <button
              class="bg-amber-600 hover:bg-amber-700 px-6 py-3 rounded-full text-lg font-medium transition-colors"
            >
              ស្វែងយល់បន្ថែម
            </button>
          </div>
        </div>

        <!-- Navigation Dots -->
        <div
          class="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2"
        >
          <button
            v-for="(_, index) in slides"
            :key="index"
            class="w-3 h-3 rounded-full transition-all"
            :class="{
              'bg-white': currentSlideIndex === index,
              'bg-white/50': currentSlideIndex !== index,
            }"
            @click="goToSlide(index)"
          />
        </div>
      </div>
    </section>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useSlide } from "@/hooks/news/useSlide";
import { onMounted, ref, computed, onUnmounted } from "vue";

const { slides, fetchSlides } = useSlide();
const currentSlideIndex = ref(0);
let slideInterval: number | null = null;

// Get current active slide
const currentSlide = computed(() => {
  if (
    slides.value.length > 0 &&
    currentSlideIndex.value < slides.value.length
  ) {
    return slides.value[currentSlideIndex.value];
  }
  return null;
});

// Fetch slides on component mount
onMounted(async () => {
  await fetchSlides();

  // Start slideshow only if there are slides
  if (slides.value.length > 1) {
    startSlideshow();
  }
});

// Cleanup interval on component unmount
onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});

// Navigation to specific slide
const goToSlide = (index: number) => {
  currentSlideIndex.value = index;

  // Reset interval when user manually changes slide
  if (slideInterval) {
    clearInterval(slideInterval);
    startSlideshow();
  }
};

// Start automatic slideshow
const startSlideshow = () => {
  slideInterval = setInterval(() => {
    currentSlideIndex.value =
      (currentSlideIndex.value + 1) % slides.value.length;
  }, 5000); // Change slide every 5 seconds
};
</script>

<style scoped>
article:hover h3 {
  @apply text-amber-700;
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
