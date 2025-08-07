<!-- src/views/profile/MyProfile.vue -->
<template>
  <div class="w-full max-w-6xl mx-auto p-4 my-6 space-y-8">
    <!-- Header Section -->
    <div
      class="bg-gradient-to-r from-blue-700/30 via-purple-700/30 to-indigo-700/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl"
    >
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div class="flex items-center gap-6">
          <div class="relative">
            <div
              v-if="isLoadingProfile"
              class="skeleton-avatar w-24 h-24 rounded-full"
            ></div>
            <template v-else>
              <div class="relative group">
                <img
                  :src="
                    profile?.profile_picture
                      ? getImageUrl(profile.profile_picture)
                      : defaultAvatar
                  "
                  class="w-24 h-24 rounded-full object-cover border-4 border-white/20 shadow-lg"
                  alt="Profile picture"
                />
                <div
                  class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <label for="avatar-upload" class="cursor-pointer">
                    <Icon icon="mdi:camera" class="text-white text-2xl" />
                  </label>
                </div>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
            </template>
          </div>

          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">
              <template v-if="isLoadingProfile">
                <div class="skeleton-text w-48 h-8 rounded-md"></div>
              </template>
              <template v-else>
                {{ profile?.full_name || "My Profile" }}
              </template>
            </h1>
            <p class="text-purple-200 mt-1 font-medium">
              <template v-if="isLoadingProfile">
                <div class="skeleton-text w-32 h-5 mt-2 rounded-md"></div>
              </template>
              <template v-else>
                {{ profile?.email || "user@example.com" }}
              </template>
            </p>
          </div>
        </div>

        <button
          v-if="!isLoadingProfile"
          @click="removeProfileImage"
          class="flex items-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 rounded-xl border border-red-500/30 text-red-100 transition-all"
        >
          <Icon icon="mdi:trash-can-outline" />
          <span>Remove Photo</span>
        </button>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Profile Information Card -->
      <div
        class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-xl"
      >
        <div class="flex items-center justify-between mb-6">
          <h2
            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
          >
            Personal Information
          </h2>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Full Name</label
            >
            <template v-if="isLoadingProfile">
              <div class="skeleton-input w-full h-12 rounded-xl"></div>
            </template>
            <template v-else>
              <input
                v-model="profileForm.full_name"
                type="text"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                placeholder="Enter your full name"
              />
            </template>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Email Address</label
            >
            <template v-if="isLoadingProfile">
              <div class="skeleton-input w-full h-12 rounded-xl"></div>
            </template>
            <template v-else>
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                placeholder="Enter your email"
              />
            </template>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Phone Number</label
            >
            <template v-if="isLoadingProfile">
              <div class="skeleton-input w-full h-12 rounded-xl"></div>
            </template>
            <template v-else>
              <input
                v-model="profileForm.phone_number"
                type="tel"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                placeholder="Enter your phone number"
              />
            </template>
          </div>
          <div>
            <button
              @click="updateProfileInfo"
              :disabled="isUpdatingProfile"
              class="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              <Icon
                :icon="isUpdatingProfile ? 'mdi:loading' : 'mdi:content-save'"
                :class="{ 'animate-spin': isUpdatingProfile }"
              />
              <span>{{
                isUpdatingProfile ? "Saving..." : "Save Changes"
              }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Change Password Card -->
      <div
        class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-xl"
      >
        <h2
          class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-6"
        >
          Change Password
        </h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Current Password</label
            >
            <div class="relative">
              <input
                v-model="passwordForm.old_password"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all pr-12"
                placeholder="Enter current password"
              />
              <button
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                <Icon :icon="showCurrentPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >New Password</label
            >
            <div class="relative">
              <input
                v-model="passwordForm.new_password"
                :type="showNewPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all pr-12"
                placeholder="Enter new password"
              />
              <button
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                <Icon :icon="showNewPassword ? 'mdi:eye-off' : 'mdi:eye'" />
              </button>
            </div>
            <div class="mt-2 text-xs text-gray-400">
              <p>Password must contain:</p>
              <ul class="list-disc pl-5 space-y-1 mt-1">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>
          </div>

          <div>
            <button
              @click="changePasswordHandler"
              :disabled="isChangingPassword || !isPasswordFormValid"
              class="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl text-white font-medium transition-all disabled:opacity-50"
            >
              <Icon
                :icon="isChangingPassword ? 'mdi:loading' : 'mdi:lock-reset'"
                :class="{ 'animate-spin': isChangingPassword }"
              />
              <span>{{
                isChangingPassword ? "Updating..." : "Change Password"
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useProfile } from "@/hooks/auth/useProfile";
import defaultAvatar from "@/assets/default-avatar.png";
import { getImageUrl } from "@/helpers/imageUrl";

// Initialize profile hook
const {
  profiles: profile,
  isLoadingProfile,
  isUpdatingProfile,
  isChangingPassword,
  fetchProfiles,
  updateProfile,
  changePassword,
} = useProfile();

// Local form states
const profileForm = reactive({
  full_name: "",
  email: "",
  phone_number: "",
});

const passwordForm = reactive({
  old_password: "",
  new_password: "",
});

// UI states
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const uploadedImage = ref<File | undefined>(undefined);

// Fetch profile on mount
onMounted(() => {
  fetchProfiles().then(() => {
    if (profile.value) {
      Object.assign(profileForm, {
        full_name: profile.value.full_name || "",
        email: profile.value.email || "",
        phone_number: profile.value.phone_number || "",
      });
    }
  });
});

// Handle image upload
const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    uploadedImage.value = input.files[0];
    updateProfile(profileForm, uploadedImage.value);
  }
};

// Remove profile image
const removeProfileImage = () => {
  uploadedImage.value = undefined;
  updateProfile(profileForm, undefined);
};

// Update profile information
const updateProfileInfo = () => {
  updateProfile(profileForm, uploadedImage.value);
};

// Change password
const changePasswordHandler = () => {
  changePassword(passwordForm);

  // Reset password form
  passwordForm.old_password = "";
  passwordForm.new_password = "";
};

// Password validation
const isPasswordFormValid = computed(() => {
  return (
    passwordForm.old_password.length >= 8 &&
    passwordForm.new_password.length >= 8 &&
    /[A-Z]/.test(passwordForm.new_password) &&
    /[0-9]/.test(passwordForm.new_password) &&
    /[!@#$%^&*]/.test(passwordForm.new_password)
  );
});
</script>

<style scoped>
.skeleton-avatar {
  background: linear-gradient(90deg, #2d3748, #4a5568, #2d3748);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-text {
  background: linear-gradient(90deg, #2d3748, #4a5568, #2d3748);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

.skeleton-input {
  background: linear-gradient(90deg, #2d3748, #4a5568, #2d3748);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

input::placeholder {
  color: #a0aec0;
  opacity: 0.6;
}
</style>
