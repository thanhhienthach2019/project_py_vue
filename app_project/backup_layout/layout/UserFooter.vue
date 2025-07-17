<template>
  <footer class="bg-gradient-to-b from-amber-900 to-amber-950 text-amber-100">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-3 mb-4">
            <div class="bg-amber-600 rounded-full p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                class="w-8 h-8 fill-white"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <span class="text-white text-xl font-bold">ព្រះធម៌</span>
          </div>
          <p class="mb-6 max-w-md">
            វេបសាយផ្សព្វផ្សាយព័ត៌មានអំពីវប្បធម៌ខ្មែរ ព្រះពុទ្ធសាសនា
            និងពិធីបុណ្យទាន ដើម្បីរក្សាសម្បត្តិវប្បធម៌ជាតិឱ្យគង់វង្ស។
          </p>
          <div class="flex space-x-4">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              class="bg-amber-800 hover:bg-amber-700 p-2 rounded-full transition-colors"
            >
              <component :is="social.icon" class="h-5 w-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3
            class="text-white text-lg font-semibold mb-4 border-b border-amber-700 pb-2"
          >
            តំណភ្ជាប់
          </h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.name">
              <router-link
                :to="link.path"
                class="hover:text-white transition-colors"
              >
                {{ link.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3
            class="text-white text-lg font-semibold mb-4 border-b border-amber-700 pb-2"
          >
            ទំនាក់ទំនង
          </h3>
          <ul class="space-y-3">
            <li class="flex items-start space-x-3">
              <MapPinIcon class="h-5 w-5 mt-0.5 text-amber-300" />
              <span>ភ្នំពេញ, កម្ពុជា</span>
            </li>
            <li class="flex items-start space-x-3">
              <PhoneIcon class="h-5 w-5 mt-0.5 text-amber-300" />
              <span>+855 12 345 678</span>
            </li>
            <li class="flex items-start space-x-3">
              <EnvelopeIcon class="h-5 w-5 mt-0.5 text-amber-300" />
              <span>info@khmerculture.org</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div
        class="border-t border-amber-800 mt-12 pt-6 text-center text-amber-500"
      >
        <p>
          © {{ new Date().getFullYear() }} វេបសាយព័ត៌មានវប្បធម៌ខ្មែរ.
          រក្សាសិទ្ធិគ្រប់យ៉ាង។
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/vue/24/outline";

import {
  FacebookIcon,
  YoutubeIcon,
  InstagramIcon,
  TwitterIcon,
} from "lucide-vue-next";

const quickLinks = [
  { name: "ទំព័រដើម", path: "/" },
  { name: "អំពីពួកយើង", path: "/about" },
  { name: "ព័ត៌មាន", path: "/news" },
  { name: "ព្រះធម៌", path: "/scriptures" },
  { name: "ឯកសារ", path: "/documents" },
];

const socialLinks = [
  { name: "Facebook", url: "#", icon: FacebookIcon },
  { name: "YouTube", url: "#", icon: YoutubeIcon },
  { name: "Instagram", url: "#", icon: InstagramIcon },
  { name: "Twitter", url: "#", icon: TwitterIcon },
];
</script>
