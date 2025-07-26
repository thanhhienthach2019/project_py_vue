<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Tiêu đề trang -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-amber-900 mb-4">ព័ត៌មាន</h1>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        តាមដានព័ត៌មានថ្មីៗអំពីវប្បធម៌ខ្មែរ ព្រះពុទ្ធសាសនា និងពិធីបុណ្យទាន
      </p>
    </div>

    <!-- Thanh công cụ tìm kiếm và lọc -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Tìm kiếm -->
        <div class="flex-grow">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ស្វែងរកព័ត៌មាន..."
              class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <svg
              class="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>

        <!-- Lọc theo thể loại -->
        <div class="w-full md:w-64">
          <select
            v-model.number="selectedCategory"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option :value="null">ទាំងអស់</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Kết quả tìm kiếm -->
    <div v-if="filteredArticles.length === 0" class="text-center py-16">
      <svg
        class="mx-auto h-16 w-16 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900">
        ពុំមានព័ត៌មានត្រូវតាមលក្ខខណ្ឌ
      </h3>
      <p class="mt-2 text-gray-500">
        សូមព្យាយាមប្តូរពាក្យស្វែងរក ឬ ប្រភេទផ្សេងទៀត។
      </p>
    </div>

    <!-- Danh sách bài viết -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
    >
      <article
        v-for="article in paginatedArticles"
        :key="article.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      >
        <!-- Hình ảnh -->
        <div class="relative">
          <img
            :src="article.image || '/placeholder-news.jpg'"
            :alt="article.title"
            class="w-full h-56 object-cover"
          />
          <div
            class="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ articleCategory(article.category_id) }}
          </div>
        </div>

        <!-- Nội dung -->
        <div class="p-6 flex-grow flex flex-col">
          <div class="mb-4">
            <div class="flex items-center text-sm text-gray-500 mb-2">
              <svg
                class="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{{ formatDateKhmer(article.published_at) }}</span>
            </div>
            <h3
              class="text-xl font-bold text-gray-900 mb-3 hover:text-amber-700 transition-colors"
            >
              <router-link
                :to="{
                  name: 'NewsDetail',
                  params: {
                    id: article.id,
                    slug: article.slug,
                  },
                }"
              >
                {{ article.title }}
              </router-link>
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-3">
              {{ article.summary || truncateText(article.content, 120) }}
            </p>
          </div>
          <div class="mt-auto">
            <router-link
              :to="{
                name: 'NewsDetail',
                params: {
                  id: article.id,
                  slug: article.slug,
                },
              }"
              class="text-amber-700 hover:text-amber-900 font-medium inline-flex items-center"
            >
              អានបន្ត
              <svg
                class="h-4 w-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </article>
    </div>

    <!-- Phân trang -->
    <div
      v-if="filteredArticles.length > itemsPerPage"
      class="flex justify-center"
    >
      <nav class="flex items-center space-x-1">
        <button
          @click="currentPage = currentPage - 1"
          :disabled="currentPage === 1"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
          :class="{ 'cursor-not-allowed': currentPage === 1 }"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 rounded-md text-sm font-medium"
          :class="{
            'bg-amber-600 text-white': currentPage === page,
            'text-gray-500 hover:bg-gray-50': currentPage !== page,
          }"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage = currentPage + 1"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
          :class="{ 'cursor-not-allowed': currentPage === totalPages }"
        >
          <svg
            class="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useNews } from "@/hooks/news/useNews";
import { formatDateKhmer } from "@/utils/khmerDate";

const { articles, fetchArticles, categories, fetchCategories } = useNews();

const searchQuery = ref("");
const selectedCategory = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(9);

onMounted(async () => {
  await fetchArticles();
  await fetchCategories();
});

const articleCategory = (categoryId: number) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "ព័ត៌មាន";
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const filteredArticles = computed(() => {
  return articles.value
    .filter((article) => {
      if (
        selectedCategory.value !== null &&
        article.category_id !== selectedCategory.value
      ) {
        return false;
      }

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          (article.summary && article.summary.toLowerCase().includes(query)) ||
          (article.content && article.content.toLowerCase().includes(query))
        );
      }

      return true;
    })
    .sort((a, b) => {
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      );
    });
});

const totalPages = computed(() => {
  return Math.ceil(filteredArticles.value.length / itemsPerPage.value);
});

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredArticles.value.slice(start, end);
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.router-link-active {
  @apply text-amber-700;
}
</style>
