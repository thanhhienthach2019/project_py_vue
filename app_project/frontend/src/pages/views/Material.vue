<template>
  <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-2 transition-all duration-300">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500">
      <div class="flex items-center space-x-6">
        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transform transition-all duration-500 hover:rotate-12">
          <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Material Management System</h1>
          <p class="text-indigo-200 mt-2 font-medium">Comprehensive material lifecycle management solution</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white/3 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl transition-all duration-500 hover:shadow-2xl">
      <!-- Form Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Icon icon="mdi:cube-scan" class="text-2xl text-emerald-400" />
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white">Material Profile</h2>
            <p class="text-sm text-gray-300 mt-1">Fields marked with * are required</p>
          </div>
        </div>
        <button
          @click="resetForm"
          class="group relative px-6 py-3.5 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl flex items-center gap-3 hover:bg-gray-700/70 transition-all duration-300 border border-white/10 hover:border-white/20"
        >
          <Icon icon="mdi:autorenew" class="text-blue-400 text-xl transition-transform duration-300 group-hover:rotate-180" />
          <span class="text-gray-100 font-medium tracking-wide">Reset Form</span>
        </button>
      </div>

      <!-- Main Form Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Left Column - Basic Info -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Basic Info Card -->
          <div class="bg-black/20 p-6 rounded-xl border border-white/10">
            <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Icon icon="mdi:information-outline" class="text-blue-400" />
              <span>Basic Information</span>
            </h3>
            <div class="space-y-5">
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Material Name</span>
                  <span class="text-rose-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="materialForm.MaterialName"
                    required
                    placeholder="Enter material name"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                    :class="{ 'border-rose-500': errors.MaterialName }"
                  />
                  <Icon v-if="errors.MaterialName" icon="mdi:alert-circle" class="absolute right-3 top-3.5 text-rose-500 text-lg" />
                </div>
                <p v-if="errors.MaterialName" class="text-rose-500 text-xs mt-1.5 ml-1">Material name is required</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="relative group">
                  <label class="block text-sm font-medium text-gray-300 mb-2">Unit Type</label>
                  <div class="relative">
                    <select
                      v-model="materialForm.Unit"
                      required
                      class="w-full pl-4 pr-10 py-3 text-sm bg-white/5 backdrop-blur-sm rounded-xl border
                            border-white/15 hover:border-white/30 focus:border-blue-400/60
                            focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2 focus:ring-offset-gray-900
                            transition-all duration-300 appearance-none cursor-pointer
                            text-gray-200 placeholder-gray-400/60
                            shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                      :class="{ 'border-rose-500/60': errors.Unit }"
                    >
                      <option 
                        disabled 
                        value="" 
                        class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                      >
                        Select Unit Type
                      </option>
                      <option
                        v-for="unit in unitOptions"
                        :key="unit"
                        :value="unit"
                        class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                      >
                        {{ formatUnit(unit) }}
                      </option>
                    </select>

                    <!-- Custom Chevron -->
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg 
                        class="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path 
                          stroke-linecap="round" 
                          stroke-linejoin="round" 
                          d="M19 9l-7 7-7-7" 
                        />
                      </svg>
                    </div>

                    <!-- Error Indicator -->
                    <div 
                      v-if="errors.Unit"
                      class="absolute right-10 top-1/2 -translate-y-1/2 flex items-center"
                    >
                      <svg 
                        class="w-5 h-5 text-rose-500 animate-pulse"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                  </div>

                  <p 
                    v-if="errors.Unit"
                    class="mt-2 ml-1 text-rose-400/80 text-xs font-medium flex items-center"
                  >
                    <svg 
                      class="w-4 h-4 mr-1.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Please select a valid unit type
                  </p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Material Type</label>
                  <input
                    v-model="materialForm.Model"
                    placeholder="Enter material type"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  v-model="materialForm.Description"
                  rows="3"
                  placeholder="Enter material description"
                  class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Specifications Card -->
          <div class="bg-black/20 p-6 rounded-xl border border-white/10">
            <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Icon icon="mdi:cube-outline" class="text-purple-400" />
              <span>Technical Specifications</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <!-- Add more specification fields here -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                <input
                  v-model="materialForm.Weight"
                  type="number"
                  placeholder="0.00"
                  class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Dimensions</label>
                <input
                  v-model="materialForm.Dimensions"
                  placeholder="L x W x H"
                  class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column - Visual & Actions -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Upload Card with Save Button -->
          <div class="bg-black/20 p-6 rounded-xl border border-white/10 h-full flex flex-col">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
                <Icon icon="mdi:image-filter" class="text-amber-400" />
                <span>Material Visual</span>
              </h3>
              <ImageUploader
                v-model:previewUrl="previewUrl"
                @update:file="handleImageUpload"
                class="h-full min-h-[300px]"
              />
            </div>

            <!-- Save Button integrated inside Visual section -->
            <div class="mt-6 pt-6 border-t border-white/5">
              <button
                @click="saveMaterial"
                class="w-full group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Icon icon="mdi:content-save-check" class="text-white text-xl animate-pulse" />
                <span class="text-white font-semibold text-lg tracking-wide">Save Material Profile</span>
                <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
              </button>
            </div>
          </div>
        </div>       
      </div>              
    </div>
    <!-- Data Table Section -->
    <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div class="px-8 py-6 border-b border-white/10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Icon Container with Animated Gradient Border -->
            <div class="relative group">
              <!-- Floating Cloud Database -->
              <div class="w-14 h-10 bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 group-hover:border-blue-400/40 transition-all duration-300 flex items-center justify-center">
                <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19L6 14M18 19L18 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M21 14H3C3 11.7909 4.79086 10 7 10C7 6.68629 9.68629 4 13 4C16.3137 4 19 6.68629 19 10C21.2091 10 23 11.7909 23 14C23 16.2091 21.2091 18 19 18H5C2.79086 18 1 16.2091 1 14C1 11.7909 2.79086 10 5 10" stroke="url(#cloud-gradient)" stroke-width="1.5"/>
                  <defs>
                    <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#a5b4fc"/>
                      <stop offset="100%" stop-color="#818cf8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="absolute -bottom-1 left-4 right-4 h-1 bg-white/5 blur-sm rounded-full group-hover:bg-blue-400/30 transition-colors"></div>
            </div>

            <!-- Text Content with Enhanced Typography -->
            <div class="flex-1 min-w-0">
              <h3 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight">
                Material Data
              </h3>
              <div class="flex items-center space-x-2 mt-1">
                <span class="text-sm font-medium text-gray-400">Inventory Status:</span>
                <span class="text-sm font-semibold text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded-full flex items-center">
                  <span class="w-2 h-2 bg-purple-400 rounded-full mr-1.5 animate-pulse"></span>
                  {{ materials.length }} active materials
                </span>
              </div>
            </div>

            <!-- Optional: Animated Stats Badge -->
            <div 
              v-if="materials.length > 0"
              class="hidden md:flex items-center space-x-1.5 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-purple-400/30 transition-all duration-300"
            >
              <Icon icon="mdi:trending-up" class="text-green-400 text-lg" />
              <span class="text-xs font-medium text-gray-200">+{{ Math.floor(materials.length * 0.12) }}%</span>
              <span class="text-xs text-gray-400">this month</span>
            </div>
          </div>
          <div class="relative w-72">
            <input
              v-model="quickFilterText"
              placeholder="Search materials..."
              class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
            />
            <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Enhanced AG Grid -->
      <div ref="gridContainer" style="overflow-x: auto">
        <ag-grid-vue
          class="ag-theme-material-futura h-[600px]"
          style="width: 100%;"
          :defaultColDef="defaultColDef"
          :columnDefs="columnDefs"
          :rowData="materials"
          :frameworkComponents="frameworkComponents"
          :gridOptions="gridOptions"
          :quickFilterText="quickFilterText"
          @grid-ready="onGridReady"
          @first-data-rendered="onFirstDataRendered"
        />
      </div>      
    </div>
    <!-- Lightbox Viewer -->
    <vue-easy-lightbox
      :visible="showViewer"
      :imgs="[selectedImage]"
      @hide="showViewer = false"
      :loop="false"
      :move-disabled="true"
      :zoom-scale="3"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmModal 
      :show="showDeleteModal" 
      @close="showDeleteModal = false"
      @confirm="handleDelete"
      title="Delete Material"
      description="This action will permanently remove the material and all related data."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, type Ref, watch, nextTick, provide  } from "vue";
import { debounce } from "lodash";
import { useMaterial } from "@/hooks/useMaterial";
import type { Material } from "@/models/material";
import VueEasyLightbox from "vue-easy-lightbox";
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal.vue";
import ImageUploader from '@/components/ui/ImageUploader.vue';
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { Icon } from '@iconify/vue';
import ActionCell  from "@/components/ui/ActionsCell.vue";

const showDeleteModal = ref(false);
const selectedMaterialId = ref<number | null>(null);
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;

const { fetchMaterials, addMaterial, editMaterial, removeMaterial, materials } = useMaterial();

onMounted(fetchMaterials);

// Component logic remains mostly the same, just update text labels
const unitOptions = ref(["Piece", "Kg", "Liter", "Meter", "Box", "Package", "Roll", "Set"]);

function formatUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    Piece: "Piece – Cái",
    Kg: "Kg – Kilogram",
    Gram: "Gram – Gram",
    Liter: "Liter – Lít",
    Ml: "Ml – Milliliter",
    Meter: "Meter – Mét",
    Cm: "Cm – Centimeter",
    Mm: "Mm – Millimeter",
    Inch: "Inch – Inch",
    Foot: "Foot – Foot (Feet)",
    Yard: "Yard – Yard",
    Box: "Box – Hộp",
    Package: "Package – Gói",
    Pack: "Pack – Gói nhỏ",
    Roll: "Roll – Cuộn",
    Set: "Set – Bộ",
    Bag: "Bag – Túi",
    Pair: "Pair – Đôi",
    Sheet: "Sheet – Tờ / Tấm",
    Bottle: "Bottle – Chai",
    Can: "Can – Lon",
    Tube: "Tube – Tuýp",
    Carton: "Carton – Thùng carton",
    Bundle: "Bundle – Bó",
    PiecePack: "PiecePack – Gói lẻ",
    Pallet: "Pallet – Pallet",
    Case: "Case – Thùng",
    Barrel: "Barrel – Thùng phi",
    Drum: "Drum – Thùng phuy",
    Dozen: "Dozen – Tá"
  }
  return unitMap[unit] || unit
}


const materialForm = ref<Material>({
  MaterialID: 0,
  MaterialCode: "",
  MaterialName: "",
  Unit: "",
  Description: "",
  ImageUrl: "" as string | File | null,
  Model: "",
  Weight: 0,
  Dimensions: "",
  Origin: "",
});
// Biến reactive lưu trạng thái lỗi của các trường bắt buộc
const errors = ref({
  MaterialName: false,
  Unit: false
});
// Hàm kiểm tra các trường bắt buộc khi blur hoặc trước submit
const validateField = (field: keyof typeof errors.value): boolean => {
  const isValid = !!materialForm.value[field]; // Chuyển giá trị về boolean
  errors.value[field] = !isValid; // Nếu không hợp lệ, đặt lỗi = true
  return isValid; // Trả về kết quả kiểm tra
};
// Biến reactive cho Quick Filter (AG Grid)
const quickFilterText = ref("");

// Hàm xử lý upload ảnh
const previewUrl = ref<string | undefined>(undefined);
  const handleImageUpload = (file: File) => {
  materialForm.value.ImageUrl = file;
  previewUrl.value = URL.createObjectURL(file);
};
// Làm mới form
const resetForm = () => {
  materialForm.value = {
    MaterialID: 0,
    MaterialCode: "",
    MaterialName: "",
    Unit: "",
    Description: "",
    ImageUrl: "",
    Model: "",
    Origin: "",
  };
  previewUrl.value = undefined;
  errors.value.MaterialName = false;
  errors.value.Unit = false;
  const imageInput = document.getElementById("imageUpload") as HTMLInputElement;
  if (imageInput) {
    imageInput.value = "";
  }
  selectedMaterialId.value  = null;
  gridApi.value?.refreshCells({ force: true }); 
};

// Hàm lưu vật tư mới hoặc cập nhật
const saveMaterial = async () => {
  const nameValid = validateField('MaterialName');
  const unitValid = validateField('Unit');

  if (!nameValid || !unitValid) {
    return;
  }

  try {
    if (materialForm.value.MaterialID === 0) {
      const response = await addMaterial(materialForm.value);
      if (response.success) {
        toast?.value?.showToast(response.message || "Material added successfully.", "success");
      } else {
        toast?.value?.showToast(response.message || "Failed to add material. Please try again.", "error");
      }
    } else {
      const response = await editMaterial(materialForm.value.MaterialID, materialForm.value);
      if (response?.success) {
        toast?.value?.showToast(response.message || "Material updated successfully.", "success");
      } else {
        toast?.value?.showToast(response?.message || "Failed to update material. Please try again.", "error");
      }
    }    
    fetchMaterials();
    resetForm();
  } catch (error) {
    toast?.value?.showToast("An unexpected error occurred. Please try again later.", "error");
  }
};

//Xoá dữ liệu 
const handleDelete = async () => {
  if (selectedMaterialId.value !== null) {
    try {
      await removeMaterial(selectedMaterialId.value);
      toast?.value?.showToast("Material deleted successfully.", "success");
      fetchMaterials();
      resetForm();
    } catch (error) {
      toast?.value?.showToast("An error occurred while deleting the material. Please try again.", "error");
    }
    showDeleteModal.value = false;
    selectedMaterialId.value = null;
  }
};


// Lightbox hiển thị hình ảnh
const showViewer = ref(false);
const selectedImage = ref<string>("");
const openViewer = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  showViewer.value = true;
};

const columnDefs = ref<ColDef[]>([
  {
    headerName: "Material Code",
    field: "MaterialCode",
  },
  {
    headerName: "Material Name",
    field: "MaterialName",
  },
  {
    headerName: "Unit",
    field: "Unit",
  },
  {
    headerName: "Description",
    field: "Description",
  },
  {
    headerName: "Image",
    field: "ImageUrl",
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const imageUrl = params.value;
      if (imageUrl && typeof imageUrl === "string") {
        return `
          <img src="${params.value}" class="w-12 h-12 object-cover rounded-md cursor-pointer" />
        `;
      }
      return "";
    },
    cellRendererParams: { onClick: openViewer },
  },
  {
    headerName: "Model",
    field: "Model",
  },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: ActionCell,
  },
]);
provide("onEdit", (materialId: number) => {
  const material = materials.value.find((item) => item.MaterialID === materialId);
  if (material) {
    materialForm.value = { ...material };
    previewUrl.value = typeof material.ImageUrl === "string"
      ? material.ImageUrl
      : material.ImageUrl instanceof File
        ? URL.createObjectURL(material.ImageUrl)
        : undefined;
  }
});

provide("onDelete", (materialId: number) => {
  selectedMaterialId.value = materialId;
  showDeleteModal.value = true;
});

// Đăng ký component cho ag-grid
const frameworkComponents = {
  ActionCell,
};
//Setup column autosize
const gridApi = ref<GridApi | null>(null);
const gridContainer = ref<HTMLElement | null>(null);
const columnsToAutoSize = ['MaterialName', 'Description'];
const { onGridReady, onFirstDataRendered, resizeNow: resizeNow } = useAutoResizeGrid(gridApi, gridContainer, columnsToAutoSize);
const debouncedResize = debounce(async () => {
  await nextTick();
  resizeNow();
}, 200);

watch(
  materialForm,
  debouncedResize,
  { deep: true }
);
const defaultColDef: ColDef = { flex:1, minWidth:150, sortable:true, filter:'agTextColumnFilter' };

// Cấu hình cho AG Grid
const itemsPerPage = ref(10);
const currentPage = ref(1);
const gridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: itemsPerPage.value,
  paginationPageSizeSelector: [5, 10, 20, 50],
  onPaginationChanged: () => {
    if (gridApi.value) {
      currentPage.value = gridApi.value.paginationGetCurrentPage() + 1;
    }
  },
  domLayout: "autoHeight",
  onGridReady: (params) => {
    gridApi.value = params.api;
    params.api.sizeColumnsToFit();
    params.api.setGridOption("rowData", materials.value);
  },
  onCellClicked: (event) => {
    if (event.colDef.field === "ImageUrl") {
      const imageUrl = event.data.ImageUrl;
      if (imageUrl && typeof imageUrl === "string") {
        event.colDef.cellRendererParams?.onClick(imageUrl);
      }
    }
  },
  context: {
    onEdit: (materialId: number) => {
      const material = materials.value.find(item => item.MaterialID === materialId);
      if (material) {
        materialForm.value = { ...material };
        previewUrl.value = typeof material.ImageUrl === "string"
          ? material.ImageUrl
          : material.ImageUrl instanceof File
            ? URL.createObjectURL(material.ImageUrl)
            : undefined;
      }
    },
    onDelete: (materialId: number) => {
      selectedMaterialId.value = materialId;
      showDeleteModal.value = true;
    },
  },
});

</script>
