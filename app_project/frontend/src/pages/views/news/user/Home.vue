<template>
  <!-- Featured News -->
  <section>
    <div class="flex items-center justify-between mb-8">
      <h2
        class="text-3xl font-bold text-amber-900 border-l-4 border-amber-600 pl-4"
      >
        ព័ត៌មានថ្មីៗ
      </h2>
      <router-link
        to="/news"
        class="text-amber-700 hover:text-amber-900 font-medium flex items-center"
      >
        មើលទាំងអស់
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article
        v-for="(item, index) in featuredNews"
        :key="index"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
      >
        <img
          :src="item.image"
          :alt="item.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <span class="text-amber-600 text-sm font-medium">{{
            item.category
          }}</span>
          <h3
            class="text-xl font-bold text-gray-900 mb-3 hover:text-amber-700 transition-colors"
          >
            <router-link
              :to="{
                name: 'NewsDetail',
                params: {
                  id: item.id,
                  slug: item.slug,
                },
              }"
            >
              {{ item.title }}
            </router-link>
          </h3>
          <p class="text-gray-600 mb-4">{{ item.excerpt }}</p>
          <div class="flex items-center text-gray-500 text-sm">
            <ClockIcon class="h-4 w-4 mr-1" />
            <span>{{ item.date }}</span>
          </div>
        </div>
      </article>
    </div>
  </section>

  <!-- Upcoming Festivals -->
  <section class="py-12 bg-amber-50 rounded-2xl">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center text-amber-900 mb-12">
        ពិធីបុណ្យខាងមុខ
      </h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="festival in upcomingFestivals"
          :key="festival.name"
          class="bg-white rounded-2xl shadow-lg p-6 flex"
        >
          <div
            class="flex-shrink-0 w-24 h-24 bg-amber-100 rounded-xl flex flex-col items-center justify-center mr-6"
          >
            <span class="text-amber-800 font-bold text-2xl">{{
              festival.day
            }}</span>
            <span class="text-amber-600 font-medium">{{ festival.month }}</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ festival.name }}
            </h3>
            <p class="text-gray-600 mb-4">{{ festival.description }}</p>
            <div class="flex items-center text-gray-500 text-sm">
              <CalendarIcon class="h-4 w-4 mr-1" />
              <span>{{ festival.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Buddhist Teachings -->
  <section>
    <h2 class="text-3xl font-bold text-amber-900 mb-8 text-center">
      ព្រះធម៌ប្រៀនប្រដៅ
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Scriptures -->
      <article
        class="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-lg p-8"
      >
        <div class="flex items-center mb-6">
          <div class="bg-amber-800 text-white p-3 rounded-lg mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-amber-900">គម្ពីរព្រះត្រៃបិដក</h3>
        </div>
        <p class="text-gray-700 mb-6">
          ប្រមូលផ្តុំឯកសារព្រះពុទ្ធសាសនាដ៏ពិសិដ្ឋ
          និងជាគោលការណ៍សម្រាប់ការសិក្សាស្វែងយល់ព្រះធម៌។
        </p>
        <router-link
          to="/scriptures"
          class="text-amber-700 hover:text-amber-900 font-medium"
        >
          អានបន្ថែម
        </router-link>
      </article>

      <!-- Videos -->
      <article
        class="bg-gradient-to-br from-amber-50 to-white rounded-2xl shadow-lg p-8"
      >
        <div class="flex items-center mb-6">
          <div class="bg-amber-800 text-white p-3 rounded-lg mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-amber-900">ព្រះធម៌ទេសនា</h3>
        </div>
        <p class="text-gray-700 mb-6">
          វីដេអូព្រះធម៌ទេសនាដោយព្រះគ្រូចៅអធិការ និងព្រះសង្ឃជាន់ខ្ពស់
          សម្រាប់យល់ដឹងពីអត្ថន័យព្រះធម៌។
        </p>
        <router-link
          to="/videos"
          class="text-amber-700 hover:text-amber-900 font-medium"
        >
          មើលវីដេអូ
        </router-link>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ClockIcon, CalendarIcon } from "@heroicons/vue/24/outline";
import { onMounted, computed } from "vue";
import { useNews } from "@/hooks/news/useNews";
import { useFestival } from "@/hooks/news/useFestival";
import { khmerMonths } from "@/utils/khmerDate";

const { fetchArticles, articles } = useNews();
const { fetchFestivals, festivals } = useFestival();

onMounted(async () => {
  await fetchArticles();
});

onMounted(async () => {
  await fetchArticles();
  await fetchFestivals();
});

const featuredNews = computed(() => {
  return articles.value
    .filter((a) => a.is_published)
    .sort((a, b) => {
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    })
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: "",
      excerpt: a.summary || "",
      date: new Date(a.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      image: `/news/${a.id}/image`,
    }));
});

const upcomingFestivals = computed(() => {
  const now = new Date();

  return festivals.value
    .filter((f) => f.is_active && new Date(f.start_date) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .map((f) => {
      const start = new Date(f.start_date);
      const end = f.end_date ? new Date(f.end_date) : null;

      return {
        name: f.name,
        day: start.getDate().toString(),
        month: khmerMonths[start.getMonth()],
        date: end
          ? `${start.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })} - ${end.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}`
          : start.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
        description: f.description || "",
      };
    })
    .slice(0, 5);
});
</script>
