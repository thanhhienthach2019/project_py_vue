<template>
  <div
    class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300"
  >
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20 transition-all duration-300"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Role Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Manage user-role assignments
          </p>
        </div>
        <button
          @click="resetForm()"
          class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20 transition-all duration-300"
        >
          <Icon
            icon="mdi:autorenew"
            class="text-purple-400 text-xl group-hover:rotate-180 transition-transform duration-300"
          />
          <span class="text-gray-100 font-medium tracking-wide"
            >Reset Form</span
          >
        </button>
      </div>
    </div>

    <!-- Form -->
    <div
      class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Type</label
          >
          <select
            v-model="form.ptype"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50"
          >
            <option
              class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
              value="g"
            >
              g (grouping)
            </option>
          </select>
        </div>

        <div class="relative w-full">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Subject
          </label>
          <SearchableSelect
            v-model="form.v0"
            :options="userOptions"
            label-key="label"
            value-key="username"
            placeholder="Select a user"
          />
        </div>

        <div v-if="form.ptype === 'g'">
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Roles/Resource</label
          >
          <select
            v-model="form.v1"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-400 focus:ring-purple-400/30 focus:border-purple-50"
          >
            <option
              class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
              disabled
              value=""
            >
              Select a role
            </option>
            <option
              v-for="r in roles"
              :key="r"
              :value="r"
              class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
            >
              {{ r }}
            </option>
          </select>
        </div>

        <div class="md:col-span-5 flex space-x-4 mt-2">
          <button
            v-permission.disable="'menu:settings:policy:create'"
            @click="onAdd()"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="mdi:shield-plus"
              class="text-lg group-hover:animate-pulse transition-transform duration-300"
            />
            <span>Add Roles</span>
            <div
              class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"
            ></div>
          </button>

          <button
            v-permission.disable="'menu:settings:policy:delete'"
            @click="onRemove()"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-semibold shadow-md hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              icon="mdi:shield-remove"
              class="text-lg group-hover:animate-pulse transition-transform duration-300"
            />
            <span>Remove Roles</span>
            <div
              class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"
            ></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div
      class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      <div
        class="px-8 py-6 border-b border-white/10 flex items-center justify-between"
      >
        <div>
          <h2
            class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
          >
            User Roles
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            Assign and manage roles for your users
          </p>
        </div>
        <div class="relative w-72">
          <input
            v-model="searchText"
            placeholder="Search Roles..."
            class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
          />
          <Icon
            icon="mdi:magnify"
            class="absolute right-3 top-2.5 text-gray-400"
          />
        </div>
      </div>

      <div>
        <table
          class="w-full text-left table-auto border-separate border-spacing-y-2"
        >
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
            <tr
              v-for="g in paginatedPolicies"
              :key="`${g.ptype}-${g.v0}-${g.v1}-${g.v2}`"
              class="bg-[#1E2A38] hover:bg-[#27313f]"
            >
              <td class="px-4 py-2 text-white">{{ g.ptype }}</td>
              <td class="px-4 py-2 text-white">{{ g.v0 }}</td>
              <td class="px-4 py-2 text-white">{{ g.v1 }}</td>
              <td class="px-4 py-2 text-white">{{ g.v2 || "-" }}</td>
              <td class="px-4 py-2 text-right">
                <button
                  v-permission.disable="'menu:settings:policy:delete'"
                  @click="removeInline(g)"
                  class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-400 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
            <!-- Empty Rows for Consistent Height -->
            <tr
              v-for="index in emptyRowCount"
              :key="'empty-' + index"
              class="bg-[#1E2A38]"
            >
              <td colspan="5" class="px-4 py-2">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="!filteredPolicies.length && !loading"
          class="text-center text-gray-400 py-6"
        >
          No Roles found.
        </div>
        <div class="text-center text-gray-400 py-6" v-if="loading">
          Loading...
        </div>

        <!-- Enhanced Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex justify-center items-center space-x-2 px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-800/30 via-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-b-2xl"
        >
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
          >
            <Icon icon="mdi:chevron-left" class="text-lg" />
            <span class="ml-1 text-sm">Prev</span>
          </button>

          <template v-for="(page, idx) in pagesToShow" :key="idx">
            <span
              v-if="page === '...'"
              class="w-9 h-9 flex items-center justify织center text-gray-400"
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
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
              ]"
            >
              {{ page }}
            </button>
          </template>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, type Ref, watch } from "vue";
import { usePolicy } from "@/hooks/usePolicy";
import type { PolicyItem, PolicyCreate } from "@/models/policy";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { Icon } from "@iconify/vue";
import { useUser } from "@/hooks/useUser";
import { UserRole } from "@/models/user";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";

const {
  fetchPoliciesGroup,
  addNewPolicyGroup,
  removePolicyGroup,
  policiesGroup,
  loading,
} = usePolicy();
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;
const { fetchUsers, users } = useUser();

const roles = Object.values(UserRole);

const form = ref<PolicyCreate>({ ptype: "g", v0: "", v1: "", v2: "" });
const searchText = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;

// Filtered Policies (without slicing)
const filteredPolicies = computed(() => {
  const search = searchText.value.toLowerCase();
  return policiesGroup.value.filter((g) =>
    [g.ptype, g.v0, g.v1, g.v2].some((field) =>
      field?.toLowerCase().includes(search)
    )
  );
});

const userOptions = computed(() =>
  Array.isArray(users.value)
    ? users.value.map((user) => ({
        ...user,
        label: `${user.full_name || user.username} (${user.username})`,
      }))
    : []
);
// Total Pages
const totalPages = computed(() =>
  Math.ceil(filteredPolicies.value.length / itemsPerPage)
);

// Paginated Policies
const paginatedPolicies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPolicies.value.slice(start, start + itemsPerPage);
});

// Empty Row Count for Consistent Table Height
const emptyRowCount = computed(() => {
  if (filteredPolicies.value.length === 0) return 0;
  const remainder = filteredPolicies.value.length % itemsPerPage;
  return currentPage.value === totalPages.value && remainder !== 0
    ? itemsPerPage - remainder
    : 0;
});

// Dynamic Page Numbers with Ellipses
const pagesToShow = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];

  range.push(1);
  for (
    let i = Math.max(2, current - delta);
    i <= Math.min(total - 1, current + delta);
    i++
  ) {
    range.push(i);
  }
  if (total > 1) range.push(total);

  let prev: number | undefined;
  for (const page of range) {
    if (prev !== undefined) {
      if (page - prev === 2) rangeWithDots.push(prev + 1);
      else if (page - prev > 2) rangeWithDots.push("...");
    }
    rangeWithDots.push(page);
    prev = page;
  }
  return rangeWithDots;
});

onMounted(() => {
  fetchUsers();
  fetchPoliciesGroup();
});

// Reset Current Page on Search
watch(searchText, () => {
  currentPage.value = 1;
});

// Adjust Current Page if Exceeds Total Pages
watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal || 1;
  }
});

function resetForm() {
  form.value = { ptype: "g", v0: "", v1: "", v2: "" };
}

async function onAdd() {
  if (!form.value.v0 || !form.value.v1) {
    toast.value?.showToast("Please fill subject, resource.", "error");
    return;
  }
  const resp = await addNewPolicyGroup(form.value);
  if (resp.success) {
    toast.value?.showToast("Role added.", "success");
    resetForm();
  } else {
    toast.value?.showToast(resp.message, "error");
  }
}

async function onRemove() {
  if (!form.value.v0 || !form.value.v1) {
    toast.value?.showToast("Please fill subject and resource.", "error");
    return;
  }
  const resp = await removePolicyGroup(form.value);
  if (resp.success) {
    toast.value?.showToast("Role removed.", "success");
    resetForm();
  } else {
    toast.value?.showToast(resp.message, "error");
  }
}

async function removeInline(g: PolicyItem) {
  const payload: PolicyCreate = {
    ptype: g.ptype,
    v0: g.v0,
    v1: g.v1,
    v2: g.v2,
  };
  const resp = await removePolicyGroup(payload);
  if (resp.success) {
    toast.value?.showToast("Role removed.", "success");
  } else {
    toast.value?.showToast(resp.message, "error");
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
