<template>
  <div class="w-full mx-auto p-2 sm:p-4 space-y-6 transition-all duration-300">
    <!-- Header Card -->
    <div class="bg-[#2E3A47] rounded-2xl p-6 border border-white/10 shadow-lg">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            <span
              class="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Form Access Management
            </span>
          </h1>
          <p class="text-gray-300 mt-2 text-sm sm:text-base">
            Define and control user permissions on system forms using Casbin
          </p>
        </div>
        <button
          @click="resetForm()"
          class="group flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-[#3B4856] hover:bg-[#475769] rounded-xl border border-white/10 transition-all duration-300"
        >
          <Icon
            icon="mdi:autorenew"
            class="text-blue-400 text-lg group-hover:rotate-180 transition-transform duration-500"
          />
          <span class="text-gray-100 font-medium">Reset Form</span>
        </button>
      </div>
    </div>

    <!-- Form Card -->
    <div class="bg-[#2E3A47] rounded-2xl p-6 border border-white/10 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- Type Select -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Type
          </label>
          <input
            v-model="form.ptype"
            readonly
            type="text"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
            placeholder="Enter type (e.g. p)"
          />
        </div>

        <!-- Subject Select -->
        <div class="relative w-full">
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Subject</label
          >
          <SearchableSelect
            v-model="form.v0"
            :options="roleOptions"
            label-key="label"
            value-key="value"
            placeholder="Select a role"
            class="bg-[#3B4856] border-white/10"
          />
        </div>

        <!-- Resource Select -->
        <div class="relative z-[99]">
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Resource</label
          >
          <SearchableSelect
            v-model="form.v1"
            :options="menuOptions"
            label-key="label"
            value-key="permission_key"
            placeholder="Select a resource"
            class="bg-[#3B4856] border-white/10"
          />
        </div>

        <!-- Action Select -->
        <div v-if="form.ptype === 'p'">
          <label class="block text-sm font-medium text-gray-300 mb-2">
            Action
          </label>
          <input
            v-model="form.v2"
            readonly
            type="text"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
            placeholder="Enter action (e.g. view)"
          />
        </div>

        <!-- Action Buttons -->
        <div class="md:col-span-5 flex flex-col sm:flex-row gap-3 mt-2">
          <!-- Create Button -->
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
            <span>{{ isCreating ? "Creating..." : "Create Policy" }}</span>
          </button>

          <!-- Delete Button -->
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
            <span>{{ isDeleting ? "Deleting..." : "Delete Policy" }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div
      class="bg-[#2E3A47] rounded-2xl border border-white/10 shadow-lg overflow-hidden"
    >
      <!-- Table Header -->
      <div class="px-6 py-4 border-b border-white/10">
        <div
          class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <!-- Title Section -->
          <div class="flex items-center gap-4">
            <div
              class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"
            >
              <Icon icon="mdi:database" class="text-blue-400 text-2xl" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">
                Form Policy Table Data
              </h3>
              <p class="text-sm text-gray-400">
                Casbin rules applied to form access
                <span
                  class="ml-2 text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full text-xs"
                >
                  {{ viewPolicies.length }} active
                </span>
              </p>
            </div>
          </div>

          <!-- Search Box -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="quickFilterText"
              :disabled="isLoading"
              placeholder="Search Policy..."
              class="w-full pl-4 pr-10 py-2 text-sm bg-[#3B4856] border border-white/10 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
            />
            <Icon
              icon="mdi:magnify"
              class="absolute right-3 top-2.5 text-gray-400"
            />
          </div>
        </div>
      </div>

      <!-- Table Content -->
      <div class="p-4 bg-[#2E3A47] rounded-b-2xl">
        <div
          ref="gridContainer"
          class="grid-wrapper overflow-x-auto overflow-y-visible relative"
        >
          <!-- Loading State -->
          <div
            v-if="delayedLoading"
            class="h-[500px] w-full flex items-start gap-2"
          >
            <SkeletonTable />
          </div>

          <!-- AG Grid Table -->
          <ag-grid-vue
            v-else
            class="ag-theme-material-futura h-[600px] w-full"
            :defaultColDef="defaultColDef"
            :columnDefs="columnDefs"
            :rowData="viewPolicies"
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
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { usePolicy } from "@/hooks/settings/usePolicy";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";
import { Icon } from "@iconify/vue";
import { useMenu } from "@/hooks/settings/useMenu";
import RoleActionCell from "@/components/ui/RoleActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { UserRole } from "@/models/auth/user";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { useViewPolicyRealtime } from "@/composables/settings/useViewPolicyRealtime";

const {
  viewPolicies,
  isLoading,
  isLoadingViews,
  isCreating,
  isDeleting,
  fetchViewPolicies,
  addViewPolicy,
  removeViewPolicy,
} = usePolicy();

useViewPolicyRealtime();
const { loadMenus, allMenus } = useMenu();
const { isDisabled: isCreateDisabled, disabledClass: createClass } =
  useActionDisabled(isCreating, isLoading);
const { isDisabled: isDeleteDisabled, disabledClass: deleteClass } =
  useActionDisabled(isDeleting, isLoading);

const delayedLoading = useDelayedLoading(isLoadingViews, 300);

const casbinRoles = Object.values(UserRole).filter(
  (v) => typeof v === "string"
);

const roleOptions = computed(() =>
  casbinRoles.map((role) => ({
    label: role.replace(/_/g, " ").toUpperCase(),
    value: role,
  }))
);

const menuOptions = computed(() =>
  Array.isArray(allMenus.value)
    ? allMenus.value.map((item) => ({
        ...item,
        label: `${item.title} - ${item.permission_key}`,
      }))
    : []
);

const form = ref<PolicyCreate>({ ptype: "p", v0: "", v1: "", v2: "view" });
const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

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

const columnsToAutoSize = ["v0", "v1"];
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
  domLayout: "normal",
  onGridReady: (params) => {
    gridApi.value = params.api;
    // params.api.sizeColumnsToFit();
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
  suppressHorizontalScroll: false,
  tooltipShowDelay: 300,
  tooltipHideDelay: 200,
});

watch(viewPolicies, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

onMounted(() => {
  loadMenus();
  fetchViewPolicies();
});

function resetForm() {
  form.value = { ptype: "p", v0: "", v1: "", v2: "view" };
  nextTick(() => inputRef.value?.focus());
}

async function onAdd() {
  const resp = await addViewPolicy(form.value);
  if (resp.success) {
    resetForm();
  }
}

async function onRemove() {
  const resp = await removeViewPolicy(form.value);
  if (resp.success) {
    resetForm();
  }
}

async function handleDeletePolicyLine(g: PolicyItem) {
  const payload: PolicyCreate = {
    ptype: g.ptype,
    v0: g.v0,
    v1: g.v1,
    v2: g.v2,
  };
  const confirmed = await showConfirmToast();
  if (!confirmed) return;

  const resp = await removeViewPolicy(payload);
  if (resp.success) {
    resetForm();
  }
}
</script>
