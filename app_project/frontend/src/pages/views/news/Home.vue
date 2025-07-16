<template>
  <section class="min-h-screen bg-white text-gray-800">
    <!-- Hero Section -->
    <div
      class="bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 relative overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 py-32 text-center">
        <h1
          class="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-gray-900 font-['Poppins'] drop-shadow-md"
        >
          Welcome to Khmer Temple Media
        </h1>
        <p class="mt-6 text-xl md:text-2xl text-gray-700">
          Discover Buddhist teachings, cultural festivals, sacred scriptures,
          and the spirit of generosity.
        </p>
        <div class="mt-10 flex justify-center space-x-6">
          <RouterLink
            to="/news"
            class="btn-primary shadow-lg hover:shadow-xl transition-shadow"
            >Explore News</RouterLink
          >
          <RouterLink
            to="/scriptures"
            class="btn-secondary shadow-lg hover:shadow-xl transition-shadow"
            >Visit Scriptures</RouterLink
          >
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white py-20">
      <div
        class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        <FeatureCard
          class="transform hover:scale-105 hover:shadow-xl transition-all duration-300 bg-white rounded-xl p-6 shadow-md"
          title="News & Announcements"
          description="Stay updated with the latest happenings, ceremonies, and community activities."
          icon="mdi:news"
          link="/news"
        />
        <FeatureCard
          class="transform hover:scale-105 hover:shadow-xl transition-all duration-300 bg-white rounded-xl p-6 shadow-md"
          title="Scriptures & Teachings"
          description="Access a sacred collection of scriptures and Buddhist wisdom."
          icon="mdi:book-open-variant"
          link="/scriptures"
        />
        <FeatureCard
          class="transform hover:scale-105 hover:shadow-xl transition-all duration-300 bg-white rounded-xl p-6 shadow-md"
          title="Festivals & Culture"
          description="Celebrate Khmer traditions and festivals that reflect spiritual harmony."
          icon="mdi:party-popper"
          link="/festivals"
        />
      </div>
    </div>

    <!-- Latest News Section -->
    <div
      class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
    >
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="article in articles.slice(0, 3)"
            :key="article.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              <RouterLink
                :to="`/news/${article.id}`"
                class="hover:text-indigo-600"
              >
                {{ article.title }}
              </RouterLink>
            </h3>
            <p class="text-gray-600 text-sm line-clamp-3 mb-4">
              {{ article.summary || article.content?.slice(0, 100) + "..." }}
            </p>
            <RouterLink
              :to="`/news/${article.id}`"
              class="text-indigo-600 font-medium hover:underline"
            >
              Read more →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Events Section -->
    <div
      class="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
    >
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="fest in festivals.slice(0, 3)"
            :key="fest.id"
            class="bg-white rounded-lg shadow hover:shadow-lg transition p-6"
          >
            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              <RouterLink
                :to="`/festivals/${fest.id}`"
                class="hover:text-green-600"
              >
                {{ fest.name }}
              </RouterLink>
            </h3>
            <p class="text-gray-600 text-sm mb-2">
              Starts: {{ fest.start_date }}
            </p>
            <RouterLink
              :to="`/festivals/${fest.id}`"
              class="text-green-600 font-medium hover:underline"
            >
              Learn more →
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote Section -->
    <div
      class="bg-gradient-to-r from-purple-200 via-blue-200 to-yellow-200 py-20"
    >
      <div class="max-w-4xl mx-auto px-4 text-center relative">
        <span class="absolute text-6xl text-gray-300 -top-4 left-4">“</span>
        <blockquote
          class="text-3xl md:text-4xl italic text-gray-800 font-['Poppins']"
        >
          "Thousands of candles can be lit from a single candle, and the life of
          the candle will not be shortened."
        </blockquote>
        <p class="mt-6 text-lg text-gray-600">— Buddha</p>
        <span class="absolute text-6xl text-gray-300 -bottom-4 right-4">”</span>
      </div>
    </div>

    <!-- Media Highlights Section -->
    <div class="bg-white py-20">
      <div class="max-w-7xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
          Explore Media
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <MediaCard
            class="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            title="Videos"
            image="/images/video-preview.jpg"
            link="/videos"
            description="Watch our latest temple activities and teachings."
          />
          <MediaCard
            class="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            title="Photos"
            image="/images/photo-preview.jpg"
            link="/photos"
            description="Browse a gallery of sacred ceremonies and cultural events."
          />
          <MediaCard
            class="bg-white rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            title="Donations"
            image="/images/donation-preview.jpg"
            link="/donate"
            description="Support the temple through charitable contributions."
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { onMounted } from "vue";
import FeatureCard from "@/components/home/FeatureCard.vue";
import MediaCard from "@/components/home/MediaCard.vue";
import { useNews } from "@/hooks/news/useNews";
import { useFestival } from "@/hooks/news/useFestival";

const { fetchArticles, articles } = useNews();
const { fetchFestivals, festivals } = useFestival();

onMounted(() => {
  fetchArticles();
  fetchFestivals();
});
</script>

<style scoped>
.btn-primary {
  @apply bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all duration-300;
}
.btn-secondary {
  @apply bg-white text-indigo-600 border-2 border-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-50 transition-all duration-300;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
