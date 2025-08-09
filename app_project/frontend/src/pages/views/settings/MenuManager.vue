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
              Menu Management
            </span>
          </h1>
          <p class="text-gray-300 mt-2 text-sm sm:text-base">
            Manage application menus (CRUD)
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Title</label
          >
          <input
            v-model="form.title"
            type="text"
            placeholder="Menu Title"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
          />
        </div>

        <!-- Path -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Path</label
          >
          <input
            v-model="form.path"
            type="text"
            placeholder="Route Path"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
          />
        </div>

        <!-- Icon -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Icon</label
          >
          <input
            v-model="form.icon"
            type="text"
            placeholder="Icon name"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
          />
        </div>

        <!-- Permission Key -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Permission Key</label
          >
          <input
            v-model="form.permission_key"
            type="text"
            placeholder="permission:key"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
          />
        </div>

        <!-- Parent Menu -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Parent Menu</label
          >
          <select
            v-model="form.parent_id"
            class="w-full px-4 py-2.5 bg-[#3B4856] border border-white/10 rounded-lg text-white"
          >
            <option :value="null" class="bg-gray-800 text-gray-200">
              None
            </option>
            <option
              v-for="m in allMenus"
              :key="m.id"
              :value="m.id"
              class="bg-gray-800 text-gray-200"
            >
              {{ m.title }}
            </option>
          </select>
        </div>

        <!-- Order -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Order</label
          >
          <input
            v-model.number="form.order"
            type="number"
            placeholder="Display Order"
            class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
          />
        </div>

        <!-- Action Buttons -->
        <div
          class="md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-3 mt-2"
        >
          <!-- Create Button -->
          <button
            v-if="!editMode"
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
            <span>{{ isCreating ? "Creating..." : "Create Menu" }}</span>
          </button>

          <!-- Update Button -->
          <button
            v-permission.disable="'menu:settings:menu:update'"
            v-if="editMode"
            :disabled="isUpdateDisabled || updatingId !== currentEditId"
            @click="onUpdate"
            :class="[
              'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
              updateClass,
            ]"
          >
            <Icon
              :icon="
                isUpdating && updatingId === currentEditId
                  ? 'mdi:loading'
                  : 'mdi:content-save-edit'
              "
              :class="[
                'text-xl',
                { 'animate-spin': isUpdating && updatingId === currentEditId },
              ]"
            />
            <span>
              {{
                isUpdating && updatingId === currentEditId
                  ? "Updating..."
                  : "Update Menu"
              }}
            </span>
          </button>

          <!-- Delete Button -->
          <button
            v-permission.disable="'menu:settings:menu:delete'"
            v-if="editMode"
            :disabled="isDeleteDisabled || deletingId !== currentEditId"
            @click="onDelete"
            :class="[
              'btn-gradient-red flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all',
              deleteClass,
            ]"
          >
            <Icon
              :icon="
                isDeleting && deletingId === currentEditId
                  ? 'mdi:loading'
                  : 'mdi:delete'
              "
              :class="[
                'text-xl',
                { 'animate-spin': isDeleting && deletingId === currentEditId },
              ]"
            />
            <span>
              {{
                isDeleting && deletingId === currentEditId
                  ? "Deleting..."
                  : "Delete Menu"
              }}
            </span>
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
              <h3 class="text-xl font-bold text-white">Menu List Data</h3>
              <p class="text-sm text-gray-400">
                View and manage application menus
                <span
                  class="ml-2 text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full text-xs"
                >
                  {{ allMenus.length }} active
                </span>
              </p>
            </div>
          </div>

          <!-- Search Box -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="quickFilterText"
              :disabled="isLoading"
              placeholder="Search Menus..."
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
            <SkeletonTable :rows="5" :columns="5" variant="default" />
          </div>

          <!-- AG Grid Table -->
          <ag-grid-vue
            v-else
            class="ag-theme-material-futura h-[600px] w-full"
            :defaultColDef="defaultColDef"
            :columnDefs="columnDefs"
            :rowData="allMenus"
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
import { ref, onMounted, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useMenu } from "@/hooks/settings/useMenu";
import EditActionCell from "@/components/ui/EditActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { useMenuRealtime } from "@/composables/settings/useMenuRealtime";
import type {
  MenuItemResponse,
  MenuItemCreate,
  MenuItemUpdate,
} from "@/models/settings/menu";

const {
  allMenus,
  isLoading,
  isLoadingMenus,
  isCreating,
  isUpdating,
  isDeleting,
  updatingId,
  deletingId,
  loadMenus,
  createMenu,
  updateMenu,
  deleteMenu,
} = useMenu();

useMenuRealtime();

const { isDisabled: isCreateDisabled, disabledClass: createClass } =
  useActionDisabled(isCreating, isLoading);
const { isDisabled: isUpdateDisabled, disabledClass: updateClass } =
  useActionDisabled(isUpdating, isLoading);
const { isDisabled: isDeleteDisabled, disabledClass: deleteClass } =
  useActionDisabled(isDeleting, isLoading);

const delayedLoading = useDelayedLoading(isLoadingMenus, 300);

const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

const columnDefs = ref<ColDef[]>([
  { headerName: "ID", field: "id", minWidth: 350 },
  { headerName: "Title", field: "title", minWidth: 300 },
  { headerName: "Path", field: "path", minWidth: 300 },
  { headerName: "Icon", field: "icon", minWidth: 200 },
  {
    headerName: "Permission Key",
    field: "permission_key",
    minWidth: 170,
  },
  { headerName: "Order", field: "order" },
  {
    headerName: "Parent",
    field: "parent",
    valueGetter: (params) => {
      const parentId = params.data.parent_id;
      const parent = allMenus.value.find((m) => m.id === parentId);
      return parent ? parent.title : "-";
    },
  },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponents = { EditActionCell };
const gridApi = ref<GridApi | null>(null);
const gridContainer = ref<HTMLElement | null>(null);

const defaultColDef: ColDef = {
  sortable: true,
  flex: 1,
  minWidth: 100,
  filter: "agTextColumnFilter",
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSize = ["title", "path", "permission_key", "parent"];
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
    params.api.sizeColumnsToFit();
  },
  context: {
    onEdit: onEdit,
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

watch(allMenus, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

const form = ref<MenuItemCreate>({
  title: "",
  path: "",
  icon: "",
  permission_key: "",
  parent_id: null,
  order: 0,
  version: 0,
});
const editMode = ref(false);
const currentEditId = ref<string | null>(null);

onMounted(() => loadMenus());

function resetForm() {
  form.value = {
    title: "",
    path: "",
    icon: "",
    permission_key: "",
    parent_id: null,
    order: 0,
    version: 0,
  };
  editMode.value = false;
  currentEditId.value = null;
  nextTick(() => inputRef.value?.focus());
}

async function onAdd() {
  if (isCreateDisabled.value) return;
  const resp = await createMenu(form.value);
  if (resp.success) {
    resetForm();
  }
}

function onEdit(item: MenuItemResponse) {
  editMode.value = true;
  currentEditId.value = item.id;
  form.value = { ...item };
}

async function onUpdate() {
  if (isCreateDisabled.value) return;
  if (currentEditId.value === null) return;
  const resp = await updateMenu(
    currentEditId.value,
    form.value as MenuItemUpdate
  );
  if (resp.success) {
    resetForm();
  }
}

async function onDelete() {
  if (isCreateDisabled.value) return;
  if (currentEditId.value === null) return;
  const confirmed = await showConfirmToast();
  if (!confirmed) return;
  const resp = await deleteMenu(currentEditId.value);
  if (resp.success) {
    resetForm();
  }
}
</script>
