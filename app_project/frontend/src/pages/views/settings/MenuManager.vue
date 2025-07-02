<template>
  <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Menu Management</h1>
          <p class="text-purple-200 mt-2 font-medium">Manage application menus (CRUD)</p>
        </div>
        <button @click="resetForm()" class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20">
          <Icon icon="mdi:autorenew" class="text-purple-400 text-xl group-hover:rotate-180 transition-transform" />
          <span class="text-gray-100 font-medium">Reset Form</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Title</label>
          <input v-model="form.title" type="text" placeholder="Menu Title" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white" />
        </div>
        <!-- Path -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Path</label>
          <input v-model="form.path" type="text" placeholder="Route Path" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white" />
        </div>
        <!-- Icon -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Icon</label>
          <input v-model="form.icon" type="text" placeholder="Icon name" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white" />
        </div>
        <!-- Permission Key -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Permission Key</label>
          <input v-model="form.permission_key" type="text" placeholder="permission:key" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white" />
        </div>
        <!-- Parent Menu -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Parent Menu</label>
          <select v-model="form.parent_id" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white">
            <option :value="null" class="bg-gray-800 text-gray-200">None</option>
            <option v-for="m in allMenus" :key="m.id" :value="m.id" class="bg-gray-800 text-gray-200">
              {{ m.title }}
            </option>
          </select>
        </div>
        <!-- Order -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Order</label>
          <input v-model.number="form.order" type="number" placeholder="Display Order" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white" />
        </div>
        <!-- Actions -->
        <div class="md:col-span-3 lg:col-span-4 flex space-x-4 mt-2">
            <button
                v-if="!editMode"
                @click="onAdd"
                class="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                >
                <Icon icon="mdi:plus-box" class="text-xl" />
                Create Menu
            </button>

            <!-- Update Button -->
            <button
                v-if="editMode"
                @click="onUpdate"
                class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                >
                <Icon icon="mdi:content-save-edit" class="text-xl" />
                Update Menu
            </button>

            <!-- Delete Button -->
            <button
                v-if="editMode"
                @click="onDelete"
                class="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                >
                <Icon icon="mdi:delete-forever" class="text-xl" />
                Delete Menu
            </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-white">Menus List</h2>
          <p class="mt-1 text-sm">Manage your menu structure and access hierarchy</p>
        </div>
        <div class="relative w-72">
          <input v-model="searchText" placeholder="Search Menus..." class="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white" />
          <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>
      <table class="w-full text-left table-auto border-separate border-spacing-y-2">
        <thead>
          <tr class="bg-[#1E2A38]">
            <th class="px-4 py-2 text-gray-400">Title</th>
            <th class="px-4 py-2 text-gray-400">Path</th>
            <th class="px-4 py-2 text-gray-400">Icon</th>
            <th class="px-4 py-2 text-gray-400">Permission Key</th>
            <th class="px-4 py-2 text-gray-400">Order</th>
            <th class="px-4 py-2 text-gray-400">Parent</th>
            <th class="px-4 py-2 text-right text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedMenus" :key="item.id" class="bg-[#1E2A38] hover:bg-[#27313f]">
            <td class="px-4 py-2 text-white">{{ item.title }}</td>
            <td class="px-4 py-2 text-white">{{ item.path }}</td>
            <td class="px-4 py-2 text-white"><Icon :icon="item.icon" /></td>
            <td class="px-4 py-2 text-white">{{ item.permission_key }}</td>
            <td class="px-4 py-2 text-white">{{ item.order }}</td>
            <td class="px-4 py-2 text-white">{{ getParentTitle(item.parent_id) }}</td>
            <td class="px-4 py-2 text-right">
              <button @click="onEdit(item)" class="px-3 py-1 bg-blue-500 rounded-lg text-white">Edit</button>
            </td>
          </tr>
          <tr
            v-for="index in emptyRowCount"
            :key="'empty-' + index"
            class="bg-[#1E2A38]"
          >
            <td class="px-4 py-2" colspan="7">&nbsp;</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filteredMenus.length" class="text-center text-gray-400 py-6">No menus found.</div>
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
          class="w-9 h-9 flex items-center justify-center text-gray-400"
        >
          ...
        </span>
        <button
          v-else
          @click="currentPage = page as number"
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
import { useMenu } from '@/hooks/useMenu';
import type { MenuItemResponse, MenuItemCreate, MenuItemUpdate } from '@/models/menu';

const { fetchAllMenus, addMenu, updateMenu, removeMenu, allMenus } = useMenu();
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>('toast')!;

const form = ref<MenuItemCreate>({ title: '', path: '', icon: '', permission_key: '', parent_id: null, order: 0 });
const editMode = ref(false);
const currentEditId = ref<number | null>(null);
const searchText = ref('');

const filteredMenus = computed(() => {
  const s = searchText.value.toLowerCase();
  return allMenus.value.filter(m =>
    m.title.toLowerCase().includes(s) || m.path.toLowerCase().includes(s) || m.permission_key.toLowerCase().includes(s)
  );
});

onMounted(() => fetchAllMenus());

function resetForm() {
  form.value = { title: '', path: '', icon: '', permission_key: '', parent_id: null, order: 0 };
  editMode.value = false;
  currentEditId.value = null;
}

async function onAdd() {
  const resp = await addMenu(form.value);
  if (resp.success) {
    toast.value.showToast('Menu created.', 'success');
    resetForm();
    await fetchAllMenus();
  } else {
    toast.value.showToast(resp.message, 'error');
  }
}

function onEdit(item: MenuItemResponse) {
  editMode.value = true;
  currentEditId.value = item.id;
  form.value = { ...item };
}

async function onUpdate() {
  if (currentEditId.value === null) return;
  const resp = await updateMenu(currentEditId.value, form.value as MenuItemUpdate);
  if (resp.success) {
    toast.value.showToast('Menu updated.', 'success');
    resetForm();
    await fetchAllMenus();
  } else {
    toast.value.showToast(resp.message, 'error');
  }
}

async function onDelete() {
  if (currentEditId.value === null) return;
  const resp = await removeMenu(currentEditId.value);
  if (resp.success) {
    toast.value.showToast('Menu deleted.', 'success');
    resetForm();
    await fetchAllMenus();
  } else {
    toast.value.showToast(resp.message, 'error');
  }
}

function getParentTitle(id?: number | null) {
  const parent = allMenus.value.find(m => m.id === id);
  return parent ? parent.title : '-';
}

const currentPage = ref(1);
const pageSize = ref(5);

const filteredMenusRaw = computed(() => {
  const s = searchText.value.toLowerCase();
  return allMenus.value.filter(m =>
    [m.title, m.path, m.permission_key].some(field =>
      field.toLowerCase().includes(s)
    )
  );
});

const totalPages = computed(() =>
  Math.ceil(filteredMenusRaw.value.length / pageSize.value)
);

const emptyRowCount = computed(() => {
  return pageSize.value - paginatedMenus.value.length;
});

const paginatedMenus = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredMenusRaw.value.slice(start, start + pageSize.value);
});

const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (last !== undefined) {
      if (typeof page === 'number' && typeof last === 'number') {
        if (page - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (page - last > 2) {
          rangeWithDots.push('...');
        }
      }
    }
    rangeWithDots.push(page);
    last = page as number;
  }

  return rangeWithDots;
});

watch(searchText, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
table::-webkit-scrollbar { height: 6px; }
table::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 3px; }
</style>
