<template>
  <div class="container mx-auto px-4 py-8 max-w-6xl">
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center text-sm text-gray-600">
        <li>
          <router-link to="/" class="text-amber-700 hover:text-amber-900"
            >ទំព័រដើម</router-link
          >
        </li>
        <li class="mx-2">/</li>
        <li>
          <router-link to="/news" class="text-amber-700 hover:text-amber-900"
            >ព័ត៌មាន</router-link
          >
        </li>
        <li class="mx-2">/</li>
        <li class="font-medium text-gray-900 line-clamp-1">
          {{ article.title }}
        </li>
      </ol>
    </nav>

    <!-- Article Header -->
    <header class="mb-10">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <span
            class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            {{ articleCategory(article.category_id) }}
          </span>
          <span class="mx-3 text-gray-400">•</span>
          <div class="flex items-center text-gray-500">
            <svg
              class="h-5 w-5 mr-1"
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
        </div>

        <!-- Social Sharing -->
        <div class="flex space-x-2">
          <button
            class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              class="h-5 w-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
              />
            </svg>
          </button>
          <button
            class="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg
              class="h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m13 2h-2.5A3.5 3.5 0 0 0 12 8.5V11h-2v3h2v7h3v-7h3v-3h-3V9a1 1 0 0 1 1-1h2V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
        {{ article.title }}
      </h1>
      <p
        v-if="article.summary"
        class="text-xl text-gray-600 mb-6 leading-relaxed"
      >
        {{ article.summary }}
      </p>
    </header>

    <!-- Featured Image -->
    <div class="relative mb-10 rounded-xl overflow-hidden">
      <img
        :src="article.image || '/placeholder-news.jpg'"
        :alt="article.title"
        class="w-full h-auto max-h-[500px] object-cover"
      />
      <div
        v-if="article.image_credit"
        class="absolute bottom-0 right-0 bg-black/50 text-white text-xs px-3 py-1"
      >
        រូបភាព៖ {{ article.image_credit }}
      </div>
    </div>

    <!-- Article Content -->
    <article class="prose prose-lg max-w-none mb-16">
      <div v-html="article.content"></div>
    </article>

    <!-- Tags -->
    <div v-if="article.tags && article.tags.length" class="mb-12">
      <h3 class="text-lg font-semibold text-gray-900 mb-3">
        ស្លាក​ពាក្យ​គន្លឹះ
      </h3>
      <div class="flex flex-wrap gap-2">
        <router-link
          v-for="tag in article.tags"
          :key="tag"
          :to="`/news?tag=${tag}`"
          class="px-3 py-1.5 bg-gray-100 hover:bg-amber-100 text-gray-700 rounded-full text-sm transition-colors"
        >
          #{{ tag }}
        </router-link>
      </div>
    </div>

    <!-- Related Articles -->
    <section v-if="relatedArticles.length" class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">ព័ត៌មានពាក់ព័ន្ធ</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="related in relatedArticles"
          :key="related.id"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <router-link
            :to="{
              name: 'NewsDetail',
              params: {
                id: related.id,
                slug: related.slug,
              },
            }"
          >
            <img
              :src="related.image || '/placeholder-news.jpg'"
              :alt="related.title"
              class="w-full h-48 object-cover"
            />
          </router-link>
          <div class="p-5">
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
              <span>{{ formatDateKhmer(related.published_at) }}</span>
            </div>
            <h3
              class="text-xl font-bold text-gray-900 mb-3 hover:text-amber-700"
            >
              <router-link
                :to="{
                  name: 'NewsDetail',
                  params: {
                    id: related.id,
                    slug: related.slug,
                  },
                }"
              >
                {{ related.title }}
              </router-link>
            </h3>
            <p class="text-gray-600 mb-4 line-clamp-2">
              {{ related.summary || truncateText(related.content, 80) }}
            </p>
            <router-link
              :to="{
                name: 'NewsDetail',
                params: {
                  id: related.id,
                  slug: related.slug,
                },
              }"
              class="text-amber-700 hover:text-amber-900 font-medium text-sm"
            >
              អានបន្ត
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- Comments Section -->
    <section class="bg-gray-50 rounded-xl p-6 mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">មតិយោបល់</h2>

      <!-- Comment Form -->
      <div class="bg-white p-5 rounded-lg shadow-sm mb-8">
        <div class="flex items-start mb-4">
          <div
            class="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-3"
          />
          <div class="flex-grow">
            <textarea
              placeholder="សូមចុចសរសេរមតិយោបល់របស់អ្នក..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            បញ្ចូលមតិ
          </button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="comments.length" class="space-y-6">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="bg-white p-5 rounded-lg shadow-sm"
        >
          <div class="flex items-start mb-3">
            <div
              class="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3"
            />
            <div>
              <h4 class="font-bold text-gray-900">{{ comment.name }}</h4>
              <p class="text-xs text-gray-500">
                {{ formatDateKhmer(comment.date) }}
              </p>
            </div>
          </div>
          <p class="text-gray-700">{{ comment.content }}</p>

          <!-- Reply Form (Hidden by default) -->
          <div
            v-if="comment.showReply"
            class="mt-4 pl-4 border-l-2 border-gray-200"
          >
            <textarea
              placeholder="សូមចុចសរសេរចម្លើយ..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              rows="2"
            ></textarea>
            <div class="flex justify-end mt-2">
              <button
                class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium mr-2"
                @click="comment.showReply = false"
              >
                បោះបង់
              </button>
              <button
                class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-1.5 rounded text-sm font-medium"
              >
                បញ្ចូលចម្លើយ
              </button>
            </div>
          </div>

          <!-- Reply Button -->
          <button
            v-else
            class="mt-3 text-amber-700 hover:text-amber-900 text-sm font-medium flex items-center"
            @click="comment.showReply = true"
          >
            <svg
              class="h-4 w-4 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                clip-rule="evenodd"
              />
            </svg>
            ឆ្លើយតប
          </button>
        </div>
      </div>

      <!-- No Comments -->
      <div v-else class="text-center py-8 text-gray-500">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <p class="mt-4">
          មិនទាន់មានមតិយោបល់ទេ។ សូមក្លាយជាមនុស្សដំបូងដែលចែករំលែកមតិ!
        </p>
      </div>
    </section>

    <!-- Back to News -->
    <div class="text-center">
      <router-link
        to="/news"
        class="inline-flex items-center text-amber-700 hover:text-amber-900 font-medium"
      >
        <svg
          class="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        ត្រលប់ទៅកាន់ទំព័រព័ត៌មាន
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useNews } from "@/hooks/news/useNews";
import type { NewsArticleResponse } from "@/models/news/news";
import { formatDateKhmer } from "@/utils/khmerDate";

type ArticleVM = NewsArticleResponse & {
  image_credit: string;
  tags: string[];
};

const route = useRoute();
const {
  getArticleBySlug,
  selectedArticle,
  articles,
  fetchArticles,
  categories,
  fetchCategories,
} = useNews();

// State
const article = ref<ArticleVM>({
  id: 0,
  title: "",
  slug: "",
  summary: null,
  content: "",
  is_published: false,
  category_id: 0,
  published_at: "",
  created_at: "",
  updated_at: "",
  image: null,
  image_credit: "",
  tags: [],
});

const comments = ref([
  {
    id: 1,
    name: "វណ្ណា សុខណា",
    date: "2024-05-15T08:30:00Z",
    content: "អត្ថបទនេះមានប្រយោជន៍ណាស់! ខ្ញុំរៀនបានច្រើនអំពីវប្បធម៌ខ្មែរ។",
    showReply: false,
  },
  {
    id: 2,
    name: "គង់ សុភា",
    date: "2024-05-14T14:20:00Z",
    content: "សូមអរគុណសម្រាប់ការចែករំលែកព័ត៌មានដ៏មានតម្លៃនេះ។",
    showReply: false,
  },
]);

// Hàm tải bài viết dựa trên slug và ID
const loadArticle = async () => {
  const id = Number(route.params.id);
  const slug = String(route.params.slug);

  if (isNaN(id)) {
    console.error("Invalid article ID");
    return;
  }

  try {
    await getArticleBySlug(id, slug);

    if (selectedArticle.value) {
      const resp = selectedArticle.value;

      // Map sang ArticleVM
      article.value = {
        ...resp,
        image_credit: (resp as any).image_credit ?? "",
        tags: Array.isArray((resp as any).tags) ? (resp as any).tags : [],
      };
    }
  } catch (err) {
    console.error("Error loading article:", err);
  }
};

// Watch for route changes
watch(
  () => route.params,
  () => {
    loadArticle();
  }
);

// Fetch data on component mount
onMounted(async () => {
  await loadArticle();
  await fetchCategories();

  // Fetch articles nếu cần cho bài viết liên quan
  if (articles.value.length === 0) {
    await fetchArticles();
  }
});

// Lấy tên thể loại từ ID
const articleCategory = (categoryId: number) => {
  const category = categories.value.find((cat) => cat.id === categoryId);
  return category ? category.name : "ព័ត៌មាន";
};

const truncateText = (text: string, maxLength: number) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const relatedArticles = computed(() => {
  return articles.value
    .filter(
      (a) =>
        a.id !== article.value.id &&
        a.category_id === article.value.category_id &&
        a.is_published
    )
    .slice(0, 3)
    .map((a) => ({
      ...a,
      tags: Array.isArray((a as any).tags) ? (a as any).tags : [],
    }));
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.prose :deep(img) {
  border-radius: 0.75rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose :deep(h2) {
  color: #b45309;
  font-weight: 700;
  font-size: 1.875rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose :deep(h3) {
  color: #b45309;
  font-weight: 600;
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose :deep(p) {
  font-size: 1.125rem;
  line-height: 1.75;
  margin-bottom: 1.25rem;
  color: #374151;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-bottom: 1.25rem;
  padding-left: 1.5rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose :deep(a) {
  color: #b45309;
  text-decoration: underline;
}

.prose :deep(a:hover) {
  color: #92400e;
}

.prose :deep(blockquote) {
  border-left: 4px solid #fbbf24;
  padding-left: 1.5rem;
  font-style: italic;
  color: #4b5563;
  margin: 1.5rem 0;
}

.prose :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.prose :deep(th) {
  background-color: #fef3c7;
  text-align: left;
  padding: 0.75rem;
  border: 1px solid #fde68a;
}

.prose :deep(td) {
  padding: 0.75rem;
  border: 1px solid #fde68a;
}

.prose :deep(tr:nth-child(even)) {
  background-color: #fffbeb;
}
</style>
