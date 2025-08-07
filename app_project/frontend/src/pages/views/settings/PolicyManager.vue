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
            Policy Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Manage access control rules using Casbin policies
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
      <!-- Dòng đầu tiên: Type, Subject, Resource -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- Type -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Type</label
          >
          <select
            v-model="form.ptype"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:ring-purple-400/30 focus:border-purple-50"
          >
            <option value="p">p (permission)</option>
          </select>
        </div>

        <!-- Subject -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Subject</label
          >
          <SearchableSelect
            v-model="form.v0"
            :options="roleOptions"
            label-key="label"
            value-key="value"
            placeholder="Select a role"
          />
        </div>

        <!-- Resource -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Resource</label
          >
          <SearchableSelect
            v-model="bindingForm.v1"
            :options="routerOptions"
            label-key="label"
            value-key="value"
            placeholder="Select a router"
          />
        </div>
      </div>

      <!-- Dòng thứ hai: Action, Path, Method -->
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
        v-if="form.ptype === 'p'"
      >
        <!-- Action -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Action</label
          >
          <input
            v-model="bindingForm.v2"
            readonly
            placeholder="e.g. read"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
          />
        </div>

        <!-- Path -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Path</label
          >
          <input
            v-model="bindingForm.path"
            readonly
            placeholder="e.g. /menus/all"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
          />
        </div>

        <!-- Method -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Method</label
          >
          <input
            v-model="bindingForm.method"
            readonly
            placeholder="e.g. GET"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white uppercase tracking-wide"
          />
        </div>

        <!-- Resource -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Resource</label
          >
          <input
            v-model="bindingForm.resource"
            readonly
            placeholder="e.g. menu:settings:menu"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
          />
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex space-x-4 mt-2">
        <!-- Add Policy Button -->
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
            {{ isDeleting ? "Deleting..." : "Delete Policy" }}
          </span>
        </button>
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
                Existing Policies Data
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                Manage all current Casbin rules
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm font-medium text-gray-400"
                  >Total policies:</span
                >
                <span
                  class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                >
                  {{ policies.length }} active
                </span>
              </div>
            </div>
          </div>

          <!-- Right: search box -->
          <div class="relative w-72">
            <input
              v-model="quickFilterText"
              :disabled="isLoading"
              placeholder="Search policies..."
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
          :rowData="policies"
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
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { debounce } from "lodash";
import { usePolicy } from "@/hooks/settings/usePolicy";
import type { PolicyItem, PolicyCreate } from "@/models/settings/policy";
import { Icon } from "@iconify/vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { UserRole } from "@/models/auth/user";
import { usePermissionRouter } from "@/hooks/settings/usePermissionRouter";
import RoleActionCell from "@/components/ui/RoleActionCell.vue";
import type { RouterPermissionWithDetails } from "@/models/settings/permissionRouter";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { usePermissionPolicyRealtime } from "@/composables/settings/usePermissionPolicyRealtime";

const {
  policies,
  isLoading,
  isLoadingPolicies,
  isCreating,
  isDeleting,
  fetchPolicies,
  addPolicy,
  removePolicy,
} = usePolicy();

usePermissionPolicyRealtime();
const { isDisabled: isCreateDisabled, disabledClass: createClass } =
  useActionDisabled(isCreating, isLoading);
const { isDisabled: isDeleteDisabled, disabledClass: deleteClass } =
  useActionDisabled(isDeleting, isLoading);

const delayedLoading = useDelayedLoading(isLoadingPolicies, 300);

const casbinRoles = Object.values(UserRole).filter(
  (v) => typeof v === "string"
);

const roleOptions = computed(() =>
  casbinRoles.map((role) => ({
    label: role.replace(/_/g, " ").toUpperCase(),
    value: role,
  }))
);

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
const autosize = debounce(() => {
  if (gridApi.value && !gridApi.value.isDestroyed?.()) {
    gridApi.value.autoSizeColumns(columnsToAutoSize);
  }
}, 100);

const { onGridReady, onFirstDataRendered } = useAutoResizeGrid(
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
      nextTick(() => autosize());
    }
  },
  domLayout: "autoHeight",
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

watch(policies, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    autosize();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

onMounted(() => {
  fetchPolicies();
  fetchDetailedBindings();
});

const inputRef = ref<HTMLInputElement | null>(null);
const { fetchDetailedBindings, detailedBindings } = usePermissionRouter();

const bindingForm = ref({
  ptype: "p",
  v0: null as number | null,
  v1: null as number | null,
  v2: "",
  path: "",
  method: "",
  resource: "",
});

const form = ref<PolicyCreate>({ ptype: "p", v0: "", v1: "", v2: "" });

const routerOptions = computed(() =>
  Array.isArray(detailedBindings.value)
    ? detailedBindings.value.map((b: RouterPermissionWithDetails) => ({
        value: b.router_id,
        label: b.router?.name ?? "—",
        router: b.router!,
        permission: b.permission!,
      }))
    : []
);

watch(
  () => bindingForm.value.v1,
  (newId) => {
    const sel = routerOptions.value.find((o) => o.value === newId);
    if (sel) {
      bindingForm.value.path = sel.router.path;
      bindingForm.value.method = sel.router.method;
      bindingForm.value.v2 = sel.permission.action;
      bindingForm.value.resource = sel.permission.resource;
      form.value.v1 = sel.permission.resource;
      form.value.v2 = sel.permission.action;
    } else {
      bindingForm.value.path = "";
      bindingForm.value.method = "";
      bindingForm.value.v2 = "";
      bindingForm.value.resource = "";
      form.value.v1 = "";
      form.value.v2 = "";
    }
  }
);

function resetForm() {
  form.value = { ptype: "p", v0: "", v1: "", v2: "" };
  bindingForm.value = {
    ptype: "p",
    v0: null,
    v1: null,
    v2: "",
    path: "",
    method: "",
    resource: "",
  };
  nextTick(() => {
    inputRef.value?.focus();
  });
}

async function onAdd() {
  const resp = await addPolicy(form.value);
  if (resp.success) {
    resetForm();
  }
}

async function onRemove() {
  const resp = await removePolicy(form.value);
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

  const resp = await removePolicy(payload);
  if (resp.success) {
    resetForm();
  }
}
</script>
