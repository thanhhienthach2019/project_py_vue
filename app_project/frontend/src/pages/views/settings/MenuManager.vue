<template>
  <div
    class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300"
  >
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Menu Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Manage application menus (CRUD)
          </p>
        </div>
        <button
          @click="resetForm()"
          class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20"
        >
          <Icon
            icon="mdi:autorenew"
            class="text-purple-400 text-xl group-hover:rotate-180 transition-transform"
          />
          <span class="text-gray-100 font-medium">Reset Form</span>
        </button>
      </div>
    </div>

    <!-- Form -->
    <div
      class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Title</label
          >
          <input
            v-model="form.title"
            type="text"
            placeholder="Menu Title"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
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
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
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
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
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
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
          />
        </div>
        <!-- Parent Menu -->
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2"
            >Parent Menu</label
          >
          <select
            v-model="form.parent_id"
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
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
            class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
          />
        </div>
        <!-- Actions -->
        <div class="md:col-span-3 lg:col-span-4 flex space-x-4 mt-2">
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
                  : 'mdi:account-remove'
              "
              :class="[
                'text-lg',
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

    <!-- Table -->
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
                Users List Data
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                View and manage application users
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm font-medium text-gray-400"
                  >Total Users:</span
                >
                <span
                  class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                >
                  {{ allMenus.length }} active
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
        <!-- Skeleton when loading -->
        <div
          v-if="delayedLoading"
          class="h-[600px] w-full flex items-start gap-2"
        >
          <SkeletonTable :rows="5" :columns="5" variant="default" />
        </div>

        <!-- AG Grid shown when not loading -->
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
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { ref, onMounted, inject, type Ref, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
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

const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;
const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

const columnDefs = ref<ColDef[]>([
  { headerName: "Title", field: "title", minWidth: 150 },
  { headerName: "Path", field: "path", minWidth: 150 },
  { headerName: "Icon", field: "icon", minWidth: 150 },
  {
    headerName: "Permission Key",
    field: "permission_key",
    minWidth: 70,
  },
  { headerName: "Order", field: "order", minWidth: 70, flex: 1 },
  {
    headerName: "Parent",
    field: "parent",
    minWidth: 70,
    flex: 1,
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
    width: 100,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponents = { EditActionCell };
const gridApi = ref<GridApi | null>(null);
const gridContainer = ref<HTMLElement | null>(null);

const defaultColDef: ColDef = {
  sortable: true,
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
  domLayout: "autoHeight",
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
  suppressHorizontalScroll: true,
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
});
const editMode = ref(false);
const currentEditId = ref<number | null>(null);

onMounted(() => loadMenus());

function resetForm() {
  form.value = {
    title: "",
    path: "",
    icon: "",
    permission_key: "",
    parent_id: null,
    order: 0,
  };
  editMode.value = false;
  currentEditId.value = null;
  nextTick(() => inputRef.value?.focus());
}

async function onAdd() {
  if (isCreateDisabled.value) return;
  const resp = await createMenu(form.value);
  if (resp.success) {
    toast.value.showToast(resp.message, "success");
    resetForm();
  } else {
    toast.value.showToast(resp.message, "error");
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
    toast.value.showToast(resp.message, "success");
    resetForm();
  } else {
    toast.value.showToast(resp.message, "error");
  }
}

async function onDelete() {
  if (isCreateDisabled.value) return;
  if (currentEditId.value === null) return;
  const confirmed = await showConfirmToast(
    `Are you sure you want to delete this menu?`
  );
  if (!confirmed) return;
  const resp = await deleteMenu(currentEditId.value);
  if (resp.success) {
    toast.value.showToast(resp.message, "success");
    resetForm();
  } else {
    toast.value.showToast(resp.message, "error");
  }
}
</script>
