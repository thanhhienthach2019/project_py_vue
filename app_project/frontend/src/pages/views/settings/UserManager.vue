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
            User Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Manage users and perform CRUD operations
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
      class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl space-y-10"
    >
      <!-- Grid: Inputs -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Full Name"
          v-model="form.full_name"
          placeholder="Enter full name"
        />
        <InputField
          label="Username"
          v-model="form.username"
          :disabled="editMode"
          placeholder="Enter username"
        />
        <InputField
          label="Email"
          type="email"
          v-model="form.email"
          placeholder="Enter email"
        />
        <InputField
          label="Phone Number"
          type="tel"
          v-model="form.phone_number"
          placeholder="Enter phone number"
        />
        <InputField
          label="Password"
          type="password"
          v-model="form.password"
          placeholder="Enter password"
          :required="!editMode"
        />
      </div>

      <!-- Grid: Upload + Checkbox -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <!-- ImageUploader bên trái -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Icon icon="mdi:image-filter" class="text-amber-400 text-xl" />
            <h3 class="text-base font-semibold text-white">Profile Picture</h3>
          </div>
          <ImageUploader
            v-model:previewUrl="previewUrl"
            @update:file="handleImageUpload"
            @remove="handleRemove"
          />
        </div>

        <!-- Checkbox bên phải -->
        <div class="flex flex-col space-y-4 pt-2">
          <label class="inline-flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              v-model="form.is_active"
              class="h-5 w-5 text-green-500 rounded"
            />
            <span>Active</span>
          </label>
          <label class="inline-flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              v-model="form.is_verified"
              class="h-5 w-5 text-blue-500 rounded"
            />
            <span>Verified</span>
          </label>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4">
        <button
          v-permission.disable="'menu:settings:user:create'"
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
          <span>{{ isCreating ? "Creating..." : "Create User" }}</span>
        </button>

        <button
          v-permission.disable="'menu:settings:user:update'"
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
                : "Update User"
            }}
          </span>
        </button>

        <button
          v-permission.disable="'menu:settings:user:delete'"
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
                : "Delete User"
            }}
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
                  {{ users.length }} active
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
          :rowData="users"
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
import { ref, onMounted, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useUser } from "@/hooks/auth/useUser";
import type { UserResponse, UserCreate, UserUpdate } from "@/models/auth/user";
import ImageUploader from "@/components/ui/ImageUploader.vue";
import EditActionCell from "@/components/ui/EditActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import InputField from "@/components/ui/InputField.vue";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { useUserRealtime } from "@/composables/auth/useUserRealtime";
import { useToastStore } from "@/store/toast/toastStore";
import { getImageUrl } from "@/helpers/imageUrl";

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
const {
  users,
  isLoading,
  isLoadingUsers,
  isCreating,
  isUpdating,
  isDeleting,
  updatingId,
  deletingId,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} = useUser();

useUserRealtime();
defineProps<{ profile_picture?: string }>();
const toast = useToastStore();

const { isDisabled: isCreateDisabled, disabledClass: createClass } =
  useActionDisabled(isCreating, isLoading);
const { isDisabled: isUpdateDisabled, disabledClass: updateClass } =
  useActionDisabled(isUpdating, isLoading);
const { isDisabled: isDeleteDisabled, disabledClass: deleteClass } =
  useActionDisabled(isDeleting, isLoading);
const delayedLoading = useDelayedLoading(isLoadingUsers, 500);

// Form state
const form = ref<UserForm>({
  username: "",
  email: "",
  password: "",
  full_name: "",
  phone_number: "",
  profile_picture: "",
  is_active: true,
  is_verified: false,
});
const editMode = ref(false);
const currentEditId = ref<number | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

const columnDefs = ref<ColDef[]>([
  { headerName: "Full Name", field: "full_name", minWidth: 150 },
  { headerName: "User Name", field: "username", minWidth: 150 },
  { headerName: "Email", field: "email", minWidth: 150 },
  { headerName: "Active", field: "is_active", minWidth: 70, flex: 1 },
  { headerName: "Verified", field: "is_verified", minWidth: 70, flex: 1 },
  { headerName: "Role", field: "role", minWidth: 70, flex: 1 },
  { headerName: "Last Login", field: "last_login", minWidth: 70, flex: 1 },
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

const columnsToAutoSize = ["full_name", "username", "email", "role"];
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
    onEdit: handleEdit,
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

watch(users, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

// Lifecycle
onMounted(() => fetchUsers());

// Helpers
function resetForm() {
  form.value = {
    username: "",
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    profile_picture: "",
    is_active: true,
    is_verified: false,
  };
  imageFile.value = null;
  previewUrl.value = undefined;
  editMode.value = false;
  currentEditId.value = null;
  nextTick(() => inputRef.value?.focus());
}

// Image
const imageFile = ref<File | null>(null);
// Preview
const previewUrl = ref<string | undefined>(undefined);
const shouldRemoveImage = ref(false);
// File upload handler
const handleImageUpload = (file: File | null) => {
  imageFile.value = file;
  shouldRemoveImage.value = false;
};

function handleRemove() {
  imageFile.value = null;
  shouldRemoveImage.value = true;
}

// CRUD actions
async function onAdd() {
  if (!form.value.password) {
    toast.show("Password is required for creating a new user.", "error");
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
    resetForm();
  }
}

async function handleEdit(user: UserResponse) {
  editMode.value = true;
  currentEditId.value = user.id;
  imageFile.value = null;

  previewUrl.value = user.profile_picture
    ? getImageUrl(user.profile_picture)
    : undefined;

  form.value = {
    username: user.username,
    email: user.email,
    password: "",
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

  const resp = await updateUser(
    currentEditId.value,
    updateData,
    imageFile.value,
    shouldRemoveImage.value
  );

  if (resp.success) {
    resetForm();
  }
}

async function onDelete() {
  if (currentEditId.value === null) return;
  const confirmed = await showConfirmToast();
  if (!confirmed) return;
  const resp = await deleteUser(currentEditId.value);
  if (resp.success) {
    resetForm();
  }
}
</script>
