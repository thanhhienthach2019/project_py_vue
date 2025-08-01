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
            :disabled="isCreateDisabled"
            @click="onAdd"
            :class="[
              'flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
              createClass,
            ]"
          >
            <Icon
              :icon="isCreating ? 'mdi:loading' : 'mdi:plus-box'"
              :class="['text-xl', { 'animate-spin': isCreating }]"
            />
            <span>{{ isCreating ? "Creating..." : "Create Roles" }}</span>
          </button>

          <button
            v-permission.disable="'menu:settings:policy:delete'"
            :disabled="isDeleteDisabled"
            @click="onRemove"
            :class="[
              'btn-gradient-red flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all',
              deleteClass,
            ]"
          >
            <Icon
              :icon="isDeleting ? 'mdi:loading' : 'mdi:account-remove'"
              :class="['text-lg', { 'animate-spin': isDeleting }]"
            />
            <span>
              {{ isDeleting ? "Deleting..." : "Delete Roles" }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div
      class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
    >
      <div class="px-8 py-6 border-b border-white/10">
        <div class="flex items-start justify-between">
          <!-- Left: icon + title + info -->
          <div class="flex items-center space-x-4">
            <div class="relative group">
              <div
                class="w-14 h-10 bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 group-hover:border-green-400/40 transition-all duration-300 flex items-center justify-center"
              >
                <Icon icon="mdi:database" class="w-8 h-8 text-white" />
              </div>
              <div
                class="absolute -bottom-1 left-4 right-4 h-1 bg-white/5 blur-sm rounded-full group-hover:bg-green-400/30 transition-colors"
              ></div>
            </div>
            <div class="flex-1 min-w-0">
              <h3
                class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight"
              >
                User Roles Data
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                Assign and manage roles for your users
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm font-medium text-gray-400"
                  >Total Roles:</span
                >
                <span
                  class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                >
                  {{ policiesGroup.length }} active
                </span>
              </div>
            </div>
          </div>

          <!-- Right: search box -->
          <div class="relative w-72">
            <input
              v-model="quickFilterText"
              :disabled="isLoading"
              placeholder="Search Roles..."
              class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
            />
            <Icon
              icon="mdi:magnify"
              class="absolute right-3 top-2.5 text-gray-400"
            />
          </div>
        </div>
      </div>

      <div
        ref="gridContainer"
        class="grid-wrapper overflow-x-auto overflow-y-visible relative p-4 bg-gray-800 rounded-2xl shadow-xl border border-white/10 transition-all"
      >
        <div
          v-if="delayedLoading"
          class="h-[600px] w-full flex items-start gap-2"
        >
          <SkeletonTable />
        </div>

        <ag-grid-vue
          v-else
          class="ag-theme-material-futura h-[600px] w-full"
          :defaultColDef="defaultColDef"
          :columnDefs="columnDefs"
          :rowData="policiesGroup"
          :frameworkComponents="frameworkComponents"
          :gridOptions="gridOptions"
          :quickFilterText="quickFilterText"
          @grid-ready="onGridReady"
          @first-data-rendered="onFirstDataRendered"
          :rowModelType="'clientSide'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  inject,
  type Ref,
  watch,
  nextTick,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { usePolicy } from "@/hooks/settings/usePolicy";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { Icon } from "@iconify/vue";
import { useUser } from "@/hooks/auth/useUser";
import { UserRole } from "@/models/auth/user";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import RoleActionCell from "@/components/ui/RoleActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { useGroupPolicyRealtime } from "@/composables/settings/useGroupPolicyRealtime";

const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;

const {
  policiesGroup,
  isLoading,
  isLoadingGroups,
  isCreating,
  isDeleting,
  fetchPolicyGroups,
  addPolicyGroup,
  removePolicyGroup,
} = usePolicy();

useGroupPolicyRealtime();

const { isDisabled: isCreateDisabled, disabledClass: createClass } =
  useActionDisabled(isCreating, isLoading);
const { isDisabled: isDeleteDisabled, disabledClass: deleteClass } =
  useActionDisabled(isDeleting, isLoading);

const delayedLoading = useDelayedLoading(isLoadingGroups, 300);

const { fetchUsers, users } = useUser();
const roles = Object.values(UserRole);

const form = ref<PolicyCreate>({ ptype: "g", v0: "", v1: "", v2: "" });
const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

const userOptions = computed(() =>
  Array.isArray(users.value)
    ? users.value.map((user) => ({
        ...user,
        label: `${user.full_name || user.username} (${user.username})`,
      }))
    : []
);

const columnDefs = ref<ColDef[]>([
  { headerName: "Type", field: "ptype", minWidth: 150 },
  { headerName: "Subject", field: "v0", minWidth: 150 },
  { headerName: "Resource", field: "v1", minWidth: 150 },
  {
    headerName: "Action",
    field: "v2",
    minWidth: 150,
    flex: 1,
  },
  {
    headerName: "Domain",
    field: "v3",
    minWidth: 150,
    flex: 1,
  },
  {
    headerName: "Time",
    field: "v4",
    minWidth: 150,
    flex: 1,
  },
  {
    headerName: "IP",
    field: "v5",
    minWidth: 150,
    flex: 1,
  },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    width: 100,
    cellRenderer: RoleActionCell,
  },
]);

const frameworkComponents = { RoleActionCell };
const gridApi = ref<GridApi | null>(null);
const gridContainer = ref<HTMLElement | null>(null);

const defaultColDef: ColDef = {
  sortable: true,
  filter: "agTextColumnFilter",
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSize = ["ptype", "v0", "v1"];
const { onGridReady, onFirstDataRendered, resizeNow } = useAutoResizeGrid(
  gridApi,
  gridContainer,
  columnsToAutoSize
);

const itemsPerPage = ref(10);
const currentPage = ref(1);

const gridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: itemsPerPage.value,
  paginationPageSizeSelector: [5, 10, 20, 50],
  onPaginationChanged: () => {
    if (gridApi.value) {
      currentPage.value = gridApi.value.paginationGetCurrentPage() + 1;
      nextTick(resizeNow);
    }
  },
  domLayout: "autoHeight",
  onGridReady: (params) => {
    gridApi.value = params.api;
    params.api.sizeColumnsToFit();
  },
  context: {
    onDelete: handleDeletePolicyLine,
  },
  rowModelType: "clientSide",
  animateRows: true,
  suppressColumnVirtualisation: false,
  suppressRowTransform: false,
  enableCellTextSelection: true,
  suppressCellFocus: true,
  suppressHorizontalScroll: true,
  tooltipShowDelay: 300,
  tooltipHideDelay: 200,
});

watch(policiesGroup, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

onMounted(() => {
  fetchUsers();
  fetchPolicyGroups();
});

function resetForm() {
  form.value = { ptype: "g", v0: "", v1: "", v2: "" };
  nextTick(() => inputRef.value?.focus());
}

async function onAdd() {
  if (!form.value.v0 || !form.value.v1) {
    toast.value?.showToast("Please fill subject, resource.", "error");
    return;
  }
  const resp = await addPolicyGroup(form.value);
  if (resp.success) {
    toast.value?.showToast(resp.message, "success");
    resetForm();
    quickFilterText.value = "";
    setQuickFilterSafe(gridApi.value, "");
    await nextTick();
    gridApi.value?.paginationGoToLastPage();
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

async function handleDeletePolicyLine(g: PolicyItem) {
  const payload: PolicyCreate = {
    ptype: g.ptype,
    v0: g.v0,
    v1: g.v1,
    v2: g.v2,
  };
  const confirmed = await showConfirmToast(
    `Are you sure you want to delete this Role Policy?`
  );
  if (!confirmed) return;

  const resp = await removePolicyGroup(payload);
  if (resp.success) {
    toast.value?.showToast("Policy removed successfully", "success");
  } else {
    toast.value?.showToast(resp.message, "error");
  }
}
</script>
