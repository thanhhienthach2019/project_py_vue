<template>
  <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300">
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20 transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">Policy Management</h1>
          <p class="text-purple-200 mt-2 font-medium">Manage access control rules using Casbin policies</p>
        </div>
        <button
          @click="resetForm()"
          class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20 transition-all duration-300"
        >
          <Icon
            icon="mdi:autorenew"
            class="text-purple-400 text-xl group-hover:rotate-180 transition-transform duration-300"
          />
          <span class="text-gray-100 font-medium tracking-wide">Reset Form</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
          <select v-model="form.ptype" class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50">
            <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" value="p">p (permission)</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Subject</label>
          <select
                v-model="form.v0"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:ring-purple-400/30 focus:border-purple-50"
            >
                <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" disabled value="">Select a role</option>
                <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" v-for="role in casbinRoles" :key="role" :value="role">
                {{ role }}
                </option>
            </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Resource</label>
           <select
                v-model="form.v1"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50"
            >
                <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" disabled value="">Select a resource</option>
                <option
                class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                v-for="item in allMenus"
                :key="item.id"
                :value="item.permission_key"
                >
                {{ item.title }} - {{ item.permission_key }}
                </option>
            </select>
        </div>

        <div v-if="form.ptype === 'p'">
          <label class="block text-sm font-medium text-gray-300 mb-2">Action</label>
           <select
                v-model="form.v2"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:ring-purple-400/30 focus:border-purple-50"
            >
                <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" disabled value="">Select an action</option>
                <option class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20" v-for="action in casbinActions" :key="action" :value="action">
                {{ action }}
                </option>
            </select>
        </div>

        <div class="md:col-span-5 flex space-x-4 mt-2">
          <!-- Add Policy Button -->
            <button
            v-permission.disable="'menu:settings:policy:create'"
            @click="onAdd()"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <Icon icon="mdi:shield-plus" class="text-lg group-hover:animate-pulse transition-transform duration-300" />
            <span>Add Policy</span>
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
            </button>

            <!-- Remove Policy Button -->
            <button
            v-permission.disable="'menu:settings:policy:delete'"
            @click="onRemove()"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
            <Icon icon="mdi:shield-remove" class="text-lg group-hover:animate-pulse transition-transform duration-300" />
            <span>Remove Policy</span>
            <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
            </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div class="px-8 py-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Existing Policies</h2>
          <p class="text-sm text-gray-400 mt-1">Manage all current Casbin rules</p>
        </div>
        <div class="relative w-72">
          <input
            v-model="searchText"
            placeholder="Search policies..."
            class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
          />
          <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div>
        <table class="w-full text-left table-auto border-separate border-spacing-y-2">
          <thead>
            <tr class="bg-[#1E2A38]">
              <th class="px-4 py-2 text-gray-400">Type</th>
              <th class="px-4 py-2 text-gray-400">Subject</th>
              <th class="px-4 py-2 text-gray-400">Resource</th>
              <th class="px-4 py-2 text-gray-400">Action</th>
              <th class="px-4 py-2 text-right text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredPolicies" :key="`${p.ptype}-${p.v0}-${p.v1}-${p.v2}`" class="bg-[#1E2A38] hover:bg-[#27313f]">
              <td class="px-4 py-2 text-white">{{ p.ptype }}</td>
              <td class="px-4 py-2 text-white">{{ p.v0 }}</td>
              <td class="px-4 py-2 text-white">{{ p.v1 }}</td>
              <td class="px-4 py-2 text-white">{{ p.v2 || '-' }}</td>
              <td class="px-4 py-2 text-right">
                <button
                  v-permission.disable="'menu:settings:policy:delete'"
                  @click="removeInline(p)"
                  class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!filteredPolicies.length && !loading" class="text-center text-gray-400 py-6">
          No policies found.
        </div>
        <div class="text-center text-gray-400 py-6" v-if="loading">Loading...</div>

        <!-- Pagination -->
        <div class="flex justify-end items-center px-8 pb-6 space-x-4" v-if="totalPages > 1">
          <button @click="currentPage--" :disabled="currentPage === 1"
                  class="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50">Previous</button>
          <span class="text-white">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
                  class="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref } from "vue";
import { usePolicy } from "@/hooks/usePolicy";
import type { PolicyItem, PolicyCreate } from "@/models/policy";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { Icon } from "@iconify/vue";
import { useMenu } from "@/hooks/useMenu";

const { fetchPolicies, addNewPolicy, removePolicy, policies, loading } = usePolicy();
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>('toast')!;
const { fetchAllMenus, allMenus } = useMenu();

const casbinActions = [
  "view",
  "create",
  "update",
  "delete",
  "read",
  "write",
  "execute",
  "manage",
  "access"
];
const casbinRoles = [
  "admin",
  "user",
  "guest",
  "manager",
  "team_lead",
  "supervisor",
  "root",
  "auditor",
  "support"
];

const form = ref<PolicyCreate>({ ptype: 'p', v0: '', v1: '', v2: '' });
const searchText = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const filteredPolicies = computed(() => {
  const filtered = policies.value.filter((p) => {
    const search = searchText.value.toLowerCase();
    return (
      p.ptype.toLowerCase().includes(search) ||
      p.v0.toLowerCase().includes(search) ||
      p.v1.toLowerCase().includes(search) ||
      (p.v2 && p.v2.toLowerCase().includes(search))
    );
  });
  const start = (currentPage.value - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
});

onMounted(() => {
  fetchAllMenus(); 
});

const totalPages = computed(() => {
  const count = policies.value.filter((p) => {
    const search = searchText.value.toLowerCase();
    return (
      p.ptype.toLowerCase().includes(search) ||
      p.v0.toLowerCase().includes(search) ||
      p.v1.toLowerCase().includes(search) ||
      (p.v2 && p.v2.toLowerCase().includes(search))
    );
  }).length;
  return Math.ceil(count / itemsPerPage);
});

onMounted(fetchPolicies);

function resetForm() {
  form.value = { ptype: 'p', v0: '', v1: '', v2: '' };
}

async function onAdd() {
  if (!form.value.v0 || !form.value.v1 || (form.value.ptype === 'p' && !form.value.v2)) {
    toast.value?.showToast('Please fill subject, resource, and action.', 'error');
    return;
  }
  const resp = await addNewPolicy(form.value);
  if (resp.success) {
    toast.value?.showToast('Policy added.', 'success');
    resetForm();
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}

async function onRemove() {
  if (!form.value.v0 || !form.value.v1) {
    toast.value?.showToast('Please fill subject and resource.', 'error');
    return;
  }
  const resp = await removePolicy(form.value);
  if (resp.success) {
    toast.value?.showToast('Policy removed.', 'success');
    resetForm();
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}

async function removeInline(p: PolicyItem) {
  const payload: PolicyCreate = { ptype: p.ptype, v0: p.v0, v1: p.v1, v2: p.v2 };
  const resp = await removePolicy(payload);
  if (resp.success) {
    toast.value?.showToast('Policy removed.', 'success');
  } else {
    toast.value?.showToast(resp.message, 'error');
  }
}
</script>

<style scoped>
table::-webkit-scrollbar {
  height: 6px;
}
table::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
