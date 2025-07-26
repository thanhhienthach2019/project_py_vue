<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { ref, onMounted, inject, type Ref, watch, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { useSlide } from "@/hooks/news/useSlide";
import type {
  SlideResponse,
  SlideCreate,
  SlideUpdate,
} from "@/models/news/slide";
import ImageUploader from "@/components/ui/ImageUploader.vue";
import EditActionCell from "@/components/ui/EditActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import InputField from "@/components/ui/InputField.vue";
import TextareaField from "@/components/ui/TextareaField.vue";

const {
  fetchSlides,
  addSlide,
  editSlide,
  removeSlide,
  slides,
  loading,
  error,
  success,
} = useSlide();
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;

// Form state
interface SlideForm {
  headline?: string;
  title?: string;
  description?: string;
  link?: string;
  order: number;
  is_active: boolean;
}
const form = ref<SlideForm>({
  order: 0,
  is_active: true,
});
const imageFile = ref<File | null>(null);
const previewUrl = ref<string | undefined>(undefined);
const editMode = ref(false);
const currentEditId = ref<number | null>(null);
const quickFilterText = ref("");

const columnDefs = ref<ColDef[]>([
  { headerName: "ID", field: "id", width: 100 },
  { headerName: "Headline", field: "headline", minWidth: 150 },
  { headerName: "Title", field: "title", minWidth: 150 },
  { headerName: "Link", field: "link", minWidth: 150, flex: 1 },
  { headerName: "Order", field: "order", width: 100, flex: 1 },
  { headerName: "Active", field: "is_active", width: 100, flex: 1 },
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

const columnsToAutoSize = ["headline", "title", "link"];
const { onGridReady, onFirstDataRendered, resizeNow } = useAutoResizeGrid(
  gridApi,
  gridContainer,
  columnsToAutoSize
);

const gridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [5, 10, 20, 50],
  onPaginationChanged: () => {
    if (gridApi.value) {
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

watch(slides, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

// Lifecycle
onMounted(() => fetchSlides());

// Helpers
function resetForm() {
  form.value = {
    order: 0,
    is_active: true,
  };
  imageFile.value = null;
  previewUrl.value = undefined;
  editMode.value = false;
  currentEditId.value = null;
}

function handleImageUpload(file: File | null) {
  imageFile.value = file;
}

async function handleEdit(slide: SlideResponse) {
  editMode.value = true;
  currentEditId.value = slide.id;
  form.value = {
    headline: slide.headline || "",
    title: slide.title || "",
    description: slide.description || "",
    link: slide.link || "",
    order: slide.order,
    is_active: slide.is_active,
  };
  previewUrl.value = slide.image_base64
    ? `data:image/jpeg;base64,${slide.image_base64}`
    : undefined;
  imageFile.value = null;
}

async function onAdd() {
  if (!imageFile.value) {
    toast.value?.showToast(
      "Image is required for creating a new slide.",
      "error"
    );
    return;
  }
  const payload: SlideCreate = {
    ...form.value,
    image: imageFile.value,
  };
  await addSlide(payload);
}

async function onUpdate() {
  if (currentEditId.value === null) return;
  const payload: SlideUpdate = {
    ...form.value,
    image: imageFile.value || undefined,
  };
  await editSlide(currentEditId.value, payload);
}

async function onDelete() {
  if (currentEditId.value === null) return;
  const confirmed = await showConfirmToast(
    `Are you sure you want to delete this slide?`
  );
  if (!confirmed) return;
  await removeSlide(currentEditId.value);
}

// Watch for success and error
watch(success, (val) => {
  if (val) {
    toast.value?.showToast(val, "success");
    resetForm();
  }
});

watch(error, (val) => {
  if (val) {
    toast.value?.showToast(val, "error");
  }
});
</script>

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
            Slide Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Manage slides and perform CRUD operations
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
          label="Headline"
          v-model="form.headline"
          placeholder="Enter headline"
        />
        <InputField
          label="Title"
          v-model="form.title"
          placeholder="Enter title"
        />

        <InputField label="Link" v-model="form.link" placeholder="Enter link" />
        <InputField
          label="Order"
          type="number"
          v-model.number="form.order"
          placeholder="Enter order"
        />
      </div>

      <!-- Grid: Upload + Checkbox -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <!-- ImageUploader bên trái -->
        <div class="space-y-2">
          <div class="flex items-center space-x-2">
            <Icon icon="mdi:image-filter" class="text-amber-400 text-xl" />
            <h3 class="text-base font-semibold text-white">Slide Image</h3>
          </div>
          <ImageUploader
            v-model:previewUrl="previewUrl"
            @update:file="handleImageUpload"
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
          <TextareaField
            label="Description"
            v-model="form.description"
            placeholder="Enter a detailed description for the slide"
            :rows="5"
            :required="false"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4">
        <button v-if="!editMode" @click="onAdd()" class="btn-gradient-green">
          <Icon
            icon="mdi:plus"
            class="text-green-300 text-lg group-hover:animate-pulse"
          />
          <span class="text-white font-medium tracking-wide">Create Slide</span>
        </button>
        <button v-if="editMode" @click="onUpdate()" class="btn-gradient-blue">
          <Icon
            icon="mdi:edit"
            class="text-blue-300 text-lg group-hover:animate-pulse"
          />
          <span class="text-white font-medium tracking-wide">Update Slide</span>
        </button>
        <button v-if="editMode" @click="onDelete()" class="btn-gradient-red">
          <Icon
            icon="mdi:delete"
            class="text-red-300 text-lg group-hover:animate-pulse"
          />
          <span class="text-white font-medium tracking-wide">Delete Slide</span>
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
                Slides List Data
              </h3>
              <p class="text-sm text-gray-400 mt-1">
                View and manage application slides
              </p>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm font-medium text-gray-400"
                  >Total Slides:</span
                >
                <span
                  class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                >
                  {{ slides.length }} slides
                </span>
              </div>
            </div>
          </div>

          <!-- Right: search box -->
          <div class="relative w-72">
            <input
              v-model="quickFilterText"
              :disabled="loading"
              placeholder="Search Slides..."
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
        style="overflow-x: auto"
      >
        <div v-if="loading" class="flex items-center justify-center h-[600px]">
          <Icon icon="mdi:loading" class="animate-spin w-8 h-8 text-blue-400" />
        </div>

        <ag-grid-vue
          v-if="!loading"
          class="ag-theme-material-futura h-[600px] w-full"
          :defaultColDef="defaultColDef"
          :columnDefs="columnDefs"
          :rowData="slides"
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
