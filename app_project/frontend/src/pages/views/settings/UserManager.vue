<template>
  <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20 transition-all duration-300">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
          <p class="text-purple-200 mt-2 font-medium">Manage users and perform CRUD operations</p>
        </div>
        <button @click="resetForm()" class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20 transition-all duration-300">
          <Icon icon="mdi:autorenew" class="text-purple-400 text-xl group-hover:rotate-180 transition-transform duration-300" />
          <span class="text-gray-100 font-medium tracking-wide">Reset Form</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Full Name -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
          <input v-model="form.full_name" type="text" placeholder="Enter full name" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50" />
        </div>
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
          <input v-model="form.username" type="text" placeholder="Enter username" :disabled="editMode" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-gray-300 disabled:opacity-50 focus:ring-purple-400/30 focus:border-purple-50" />
        </div>
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input v-model="form.email" type="email" placeholder="Enter email" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50" />
        </div>
        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input v-model="form.password" type="password" placeholder="Enter password" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50" :required="!editMode" />
        </div>
        <!-- Phone Number -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
          <input v-model="form.phone_number" type="tel" placeholder="Enter phone number" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50" />
        </div>        
        <!-- Active & Verified -->
        <div class="flex items-center space-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Active</label>
            <input type="checkbox" v-model="form.is_active" class="h-5 w-5 text-green-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Verified</label>
            <input type="checkbox" v-model="form.is_verified" class="h-5 w-5 text-blue-500" />
          </div>
        </div>
        <!-- Profile Picture Upload -->
        <div class="col-span-full">
          <div class="grid grid-cols-4 gap-6">
            <!-- Title: full width -->
            <div class="col-span-4 flex items-center space-x-2 mb-2">
              <Icon icon="mdi:image-filter" class="text-amber-400 text-xl" />
              <h3 class="text-lg font-semibold text-white">Profile Picture</h3>
            </div>
            <!-- ImageUploader: only 1 column -->
            <div class="col-span-1">
              <ImageUploader
                v-model:previewUrl="previewUrl"
                @update:file="handleImageUpload"
                class="h-full min-h-[150px]"
              />
            </div>
          </div>
        </div>
        <!-- Actions -->
        <div class="md:col-span-4 flex space-x-4 mt-2">
          <button v-permission.disable="'menu:settings:user:create'" v-if="!editMode" @click="onAdd()" class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300">
            <Icon icon="mdi:account-plus" class="text-lg group-hover:animate-pulse transition-transform duration-300" />
            <span>Create User</span>
          </button>
          <button v-permission.disable="'menu:settings:user:update'" v-if="editMode" @click="onUpdate()" class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300">
            <Icon icon="mdi:account-edit" class="text-lg group-hover:animate-pulse transition-transform duration-300" />
            <span>Update User</span>
          </button>
          <button v-permission.disable="'menu:settings:user:delete'" v-if="editMode" @click="onDelete()" class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300">
            <Icon icon="mdi:account-remove" class="text-lg group-hover:animate-pulse transition-transform duration-300" />
            <span>Delete User</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2R xl overflow-hidden">
      <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Users List</h2>
          <p class="text-sm text-gray-400 mt-1">View and manage application users</p>
        </div>
        <div class="relative w-72">
          <input v-model="searchText" placeholder="Search Users..." class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all" />
          <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <table class="w-full text-left table-auto border-separate border-spacing-y-2">
        <thead>
          <tr class="bg-[#1E2A38]">
            <th class="px-4 py-2 text-gray-400">Full Name</th>
            <th class="px-4 py-2 text-gray-400">Username</th>
            <th class="px-4 py-2 text-gray-400">Email</th>
            <th class="px-4 py-2 text-gray-400">Active</th>
            <th class="px-4(py-2 text-gray-400">Verified</th>
            <th class="px-4 py-2 text-gray-400">Role</th>
            <th class="px-4 py-2 text-gray-400">Last Login</th>
            <th class="px-4 py-2 text-right text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Data Rows -->
          <tr v-for="user in paginatedUsers" :key="user.id" class="bg-[#1E2A38] hover:bg-[#27313f]">
            <td class="px-4 py-2 text-white">{{ user.full_name }}</td>
            <td class="px-4 py-2 text-white">{{ user.username }}</td>
            <td class="px-4 py-2 text-white">{{ user.email }}</td>
            <td class="px-4 py-2 text-white">{{ user.is_active ? 'Yes' : 'No' }}</td>
            <td class="px-4 py-2 text-white">{{ user.is_verified ? 'Yes' : 'No' }}</td>
            <td class="px-4 py-2 text-white">{{ user.role }}</td>
            <td class="px-4 py-2 text-white">{{ user.last_login ? formatDate(user.last_login) : '-' }}</td>
            <td class="px-4 py-2 text-right">
              <button @click="onEdit(user)" class="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-400">Edit</button>
            </td>
          </tr>
          <!-- Empty Rows to Fill Up to itemsPerPage -->
          <tr
            v-for="index in emptyRowCount"
            :key="'empty-' + index"
            class="bg-[#1E2A38]"
          >
            <td class="px-4 py-2" colspan="8">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <div v-if="!filteredUsers.length && !loading" class="text-center text-gray-400 py-6">No users found.</div>
      <div v-if="loading" class="text-center text-gray-400 py-6">Loading...</div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center items-center space-x-2 px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-800/30 via-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-b-2xl"
      >
        <!-- Previous -->
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
        >
          <Icon icon="mdi:chevron-left" class="text-lg" />
          <span class="ml-1 text-sm">Prev</span>
        </button>

        <!-- Dynamic Page Numbers with Dots -->
        <template v-for="(page, idx) in pagesToShow" :key="idx">
          <span
            v-if="page === '...'"
            class="w-9 h-9|Hflex items-center justify-center text-gray-400"
          >
            ...
          </span>
          <button
            v-else
            @click="typeof page === 'number' && (currentPage = page)"
            :class="[
              'w-9 h-9 rounded-full text-sm font-semibold transition',
              currentPage === page
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            ]"
          >
            {{ page }}
          </button>
        </template>

        <!-- Next -->
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
        >
          <span class="mr-1 text-sm">Next</span>
          <Icon icon="mdi:chevron-right" class="text-lg" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import ToastTailwind from '@/pages/Toast/ToastTailwind.vue';
import { useUser } from '@/hooks/useUser';
import type { UserResponse, UserCreate, UserUpdate } from '@/models/user';
import dayjs from 'dayjs';
import ImageUploader from '@/components/ui/ImageUploader.vue';

// Define UserForm interface directly if not in models/user.ts
interface UserForm {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  phone_number?: string;
  profile_picture?: string;
  is_active: boolean;
  is_verified: boolean;
}

const { fetchUsers, createUser, updateUser, deleteUser, users, loading } = useUser();
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>('toast')!;

// Form state
const form = ref<UserForm>({
  username: '',
  email: '',
  password: '',
  full_name: '',
  phone_number: '',
  profile_picture: '',
  is_active: true,
  is_verified: false,
});
const editMode = ref(false);
const currentEditId = ref<number | null>(null);

// Image
const imageFile = ref<File | null>(null);

// Table state
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

// Computed filtered & paginated users
const filteredUsers = computed(() => {
  const search = searchText.value.toLowerCase();
  return users.value.filter(u =>
    [u.full_name, u.username, u.email].some(field => field?.toLowerCase().includes(search))
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
);

const emptyRowCount = computed(() => {
  return itemsPerPage - paginatedUsers.value.length;
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredUsers.value.slice(start, start + itemsPerPage);
});

const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 1;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  // Add page 1
  range.push(1);

  // Add pages near currentPage
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  // Add last page if total > 1
  if (total > 1) {
    range.push(total);
  }

  // Create rangeWithDots
  let prev: number | undefined;
  for (const page of range) {
    if (prev !== undefined) {
      if (page - prev === 2) {
        rangeWithDots.push(prev + 1);
      } else if (page - prev > 2) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(page);
    prev = page;
  }

  return rangeWithDots;
});

// Adjust currentPage if it exceeds totalPages after filtering
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal || 1;
  }
});

// Reset currentPage to 1 when searchText changes
watch(searchText, () => {
  currentPage.value = 1;
});

// Lifecycle
onMounted(() => fetchUsers());

// Helpers
function resetForm() {
  form.value = {
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    profile_picture: '',
    is_active: true,
    is_verified: false,
  };
  imageFile.value = null;
  previewUrl.value = undefined;
  editMode.value = false;
  currentEditId.value = null;
}

// Preview
const previewUrl = ref<string | undefined>(undefined);

function formatDate(dateStr: string) {
  return dayjs(dateStr).format('DD/MM/YYYY HH:mm');
}

// File upload handler
const handleImageUpload = (file: File | null) => {
  imageFile.value = file;
};

// CRUD actions
async function onAdd() {
  if (!form.value.password) {
    toast.value?.showToast('Password is required for creating a new user.', 'error');
    return;
  }
  const userCreate: UserCreate = {
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    full_name: form.value.full_name,
    phone_number: form.value.phone_number,
    profile_picture: form.value.profile_picture,
  };
  const resp = await createUser(userCreate, imageFile.value);
  if (resp.success) {
    toast.value?.showToast('User created.', 'success');
    await fetchUsers();
    resetForm();
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}

function onEdit(user: UserResponse) {
  editMode.value = true;
  currentEditId.value = user.id;
  imageFile.value = null;
  form.value = {
    username: user.username,
    email: user.email,
    password: '',
    full_name: user.full_name,
    phone_number: user.phone_number,
    profile_picture: user.profile_picture,
    is_active: user.is_active,
    is_verified: user.is_verified,
  };
}

async function onUpdate() {
  if (currentEditId.value === null) return;

  const updateData: UserUpdate = {
    email: form.value.email,
    full_name: form.value.full_name,
    phone_number: form.value.phone_number,
    profile_picture: form.value.profile_picture,
    is_active: form.value.is_active,
    is_verified: form.value.is_verified,
  };

  if (form.value.password) {
    updateData.password = form.value.password;
  }

  const resp = await updateUser(currentEditId.value, updateData, imageFile.value);

  if (resp.success) {
    toast.value?.showToast('User updated.', 'success');
    await fetchUsers();
    resetForm();
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}

async function onDelete() {
  if (currentEditId.value === null) return;
  const resp = await deleteUser(currentEditId.value);
  if (resp.success) {
    toast.value?.showToast('User deleted.', 'success');
    await fetchUsers();
    resetForm();
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}
</script>

<style scoped>
table::-webkit-scrollbar { height: 6px; }
table::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
</style>