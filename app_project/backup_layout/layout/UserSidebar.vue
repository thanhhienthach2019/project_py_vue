<template>
  <aside
    :class="[
      'lg:flex lg:flex-col lg:w-2/12 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen fixed top-16 rounded-r-2xl shadow-xl transition-transform duration-500 ease-in-out',
      isOpen
        ? 'flex transform translate-x-0'
        : 'hidden lg:flex transform -translate-x-full lg:translate-x-0',
    ]"
  >
    <nav class="flex-1 px-6 py-6 space-y-3">
      <details
        v-for="category in categories"
        :key="category.name"
        class="group"
      >
        <summary
          class="flex items-center px-4 py-3 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 cursor-pointer font-semibold text-gray-800 dark:text-gray-100 text-base"
        >
          <Icon
            :icon="category.icon"
            class="w-6 h-6 mr-3 transform group-open:scale-110 transition-transform"
          />
          <span class="relative group">
            <span class="inline-block group-hover:hidden">{{
              category.name
            }}</span>
            <span
              class="hidden group-hover:inline-block font-['Noto Serif Khmer'] text-base"
              >{{ category.khmerText }}</span
            >
          </span>
          <Icon
            icon="mdi:chevron-down"
            class="w-5 h-5 ml-auto group-open:rotate-180 transition-transform duration-300"
          />
        </summary>
        <div class="pl-8 space-y-2 mt-2">
          <router-link
            v-for="link in category.links"
            :key="link.text"
            :to="link.to"
            class="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 text-gray-700 dark:text-gray-200 text-base transform hover:scale-105"
            active-class="bg-indigo-200 dark:bg-indigo-800 font-semibold text-indigo-700 dark:text-indigo-300"
          >
            <Icon icon="link.icon" class="w-5 h-5 mr-3" />
            <span class="relative group">
              <span class="inline-block group-hover:hidden">{{
                link.text
              }}</span>
              <span
                class="hidden group-hover:inline-block font-['Noto Serif Khmer'] text-base"
                >{{ link.khmerText }}</span
              >
            </span>
          </router-link>
        </div>
      </details>
    </nav>

    <div class="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
      <router-link
        to="/contact"
        class="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition duration-300 text-gray-600 dark:text-gray-400 text-base transform hover:scale-105"
      >
        <Icon icon="mdi:email" class="w-5 h-5 mr-3" />
        <span class="relative group">
          <span class="inline-block group-hover:hidden">Contact</span>
          <span
            class="hidden group-hover:inline-block font-['Noto Serif Khmer'] text-base"
            >ទំនាក់ទំនង</span
          >
        </span>
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { Icon } from "@iconify/vue";

const isOpen = ref(false);

const categories = [
  {
    name: "News",
    khmerText: "ព័ត៌មាន",
    icon: "mdi:newspaper",
    links: [
      {
        text: "Latest News",
        to: "/news/latest",
        icon: "mdi:newspaper",
        khmerText: "ព័ត៌មានថ្មី",
      },
      {
        text: "Featured News",
        to: "/news/featured",
        icon: "mdi:star",
        khmerText: "ព័ត៌មានលេចធ្លោ",
      },
      {
        text: "Community News",
        to: "/news/community",
        icon: "mdi:account-group",
        khmerText: "ព័ត៌មានសហគមន៍",
      },
    ],
  },
  {
    name: "Events",
    khmerText: "ព្រឹត្តិការណ៍",
    icon: "mdi:calendar",
    links: [
      {
        text: "Upcoming Events",
        to: "/festivals/upcoming",
        icon: "mdi:calendar-star",
        khmerText: "ព្រឹត្តិការណ៍ជិតមកដល់",
      },
      {
        text: "Past Events",
        to: "/festivals/past",
        icon: "mdi:history",
        khmerText: "ព្រឹត្តិការណ៍កន្លងមក",
      },
      {
        text: "Cultural Festivals",
        to: "/festivals/cultural",
        icon: "mdi:party-popper",
        khmerText: "ពិធីបុណ្យវប្បធម៌",
      },
    ],
  },
  {
    name: "Scriptures",
    khmerText: "គម្ពីរ",
    icon: "mdi:book",
    links: [
      {
        text: "Classics",
        to: "/scriptures/classics",
        icon: "mdi:book-open",
        khmerText: "គម្ពីរបុរាណ",
      },
      {
        text: "Teachings",
        to: "/scriptures/teachings",
        icon: "mdi:school",
        khmerText: "ការបង្រៀន",
      },
      {
        text: "References",
        to: "/scriptures/references",
        icon: "mdi:library",
        khmerText: "ឯកសារយោង",
      },
    ],
  },
  {
    name: "Gallery",
    khmerText: "វិចិត្រសាល",
    icon: "mdi:image",
    links: [
      {
        text: "Photos",
        to: "/gallery/photos",
        icon: "mdi:image-album",
        khmerText: "រូបថត",
      },
      {
        text: "Videos",
        to: "/gallery/videos",
        icon: "mdi:video",
        khmerText: "វីដេអូ",
      },
      {
        text: "Archives",
        to: "/gallery/archives",
        icon: "mdi:archive",
        khmerText: "បណ្ណសារ",
      },
    ],
  },
  {
    name: "Donors",
    khmerText: "ម្ចាស់ជំនួយ",
    icon: "mdi:heart",
    links: [
      {
        text: "Donor List",
        to: "/donors/list",
        icon: "mdi:account-heart",
        khmerText: "បញ្ជីម្ចាស់ជំនួយ",
      },
      {
        text: "Fundraising",
        to: "/donors/fundraising",
        icon: "mdi:cash",
        khmerText: "ការរៃអង្គាស",
      },
      {
        text: "Stories",
        to: "/donors/stories",
        icon: "mdi:book-heart",
        khmerText: "រឿងរ៉ាវ",
      },
    ],
  },
];

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
};

defineExpose({ toggleSidebar, isOpen });
</script>

<style scoped>
/* Ensure Khmer font is applied correctly */
@import url("https://fonts.googleapis.com/css2?family=Noto+Serif+Khmer:wght@400;700&display=swap");

@media (max-width: 1023px) {
  aside {
    width: 100%;
    max-width: 320px;
    z-index: 50;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  }
}

details > div {
  animation: slideDown 0.4s ease-in-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
