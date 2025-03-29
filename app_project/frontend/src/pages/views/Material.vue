<template>
  <div class="w-full max-w-12xl mx-auto p-6 my-6">
    <!-- Phần 1: Tiêu đề chính -->
    <div class="mt-0 mb-6">
      <h2 class="text-4xl font-extrabold text-blue-300 uppercase text-center">
        Quản lý vật tư
      </h2>
    </div>

    <!-- Phần 2: Form nhập liệu -->
    <div class="mb-6">
      <!-- Tiêu đề cho form nhập liệu -->
      <div class="bg-gray-700 text-gray-200 px-4 py-2 rounded-t-lg shadow-sm">
        <h3 class="text-lg font-medium">Thông tin vật tư</h3>
      </div>
      <div class="bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 p-6 rounded-b-lg shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Cột 1: Tên vật tư & Mô tả -->
          <div class="grid grid-cols-1 gap-y-2">
            <div>
              <label for="material_name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Tên vật tư</label>
              <input
                v-model="materialForm.MaterialName"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.MaterialName ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.MaterialName" class="text-red-500 text-xs mt-1">
                Vui lòng nhập Tên vật tư.
              </p>
            </div>
            <div>
              <label for="discription" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mô tả</label>
              <textarea
              v-model="materialForm.Description"
              rows="4"
              class="w-full px-3 py-2 text-sm text-white bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
            </div>            
          </div>

          <!-- Cột 2: Đơn vị, Model, Xuất xứ -->
          <div class="grid grid-cols-1 gap-y-2">
            <div>
              <label for="unit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đơn vị tính</label>
              <select
                v-model="materialForm.Unit"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none',
                  errors.Unit ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option v-for="unit in unitOptions" :key="unit" :value="unit">{{ unit }}</option>
              </select>
              <p v-if="errors.Unit" class="text-red-500 text-xs mt-1">
                Vui lòng chọn Đơn vị tính.
              </p>
            </div>            
            <div>
              <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đặt tả</label>
              <input
                v-model="materialForm.Model"                
                class="w-full px-3 py-2 text-sm text-white bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label for="model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Xuất xứ</label>
              <input
                v-model="materialForm.Origin"                
                class="w-full px-3 py-2 text-sm text-white bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>            
          </div>
          <!-- Cột 3: Hình ảnh -->
          <div class="grid grid-cols-1 gap-y-2">
            <div>
              <label for="unit" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Hình ảnh</label>
              <input
                id="imageUpload"
                type="file"
                @change="handleImageUpload"
                class="w-full text-white border border-gray-600 rounded px-3 py-1 bg-transparent"
              />
              <div v-if="previewUrl" class="mt-2">
                <img
                  :src="previewUrl"
                  alt="Hình ảnh"
                  class="w-64 h-40 object-cover rounded-lg border border-gray-600"
                />
              </div>
            </div>            
          </div>
        </div>        
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="saveMaterial"
            class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <i class="mdi mdi-content-save mr-1"></i>
            Lưu dữ liệu
          </button>
          <button
            @click="resetForm"
            class="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <i class="mdi mdi-refresh mr-1"></i>
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Phần 3: Bảng dữ liệu -->
    <div class="mb-6">
      <!-- Tiêu đề cho bảng dữ liệu -->
      <div class="bg-gray-700 text-gray-200 px-4 py-2 rounded-t-lg shadow-sm">
        <h3 class="text-lg font-medium">Danh sách vật tư</h3>
      </div>
      <div class="mt-2 mb-2 shadow-md rounded">
        <!-- Quick Filter -->
        <div class="mb-2 text-left">
          <input
            v-model="quickFilterText"
            placeholder="Tìm kiếm..."
            class="w-full md:w-1/6 px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <ag-grid-vue
          class="ag-theme-quartz rounded"
          style="width: 100%;"
          :columnDefs="columnDefs"
          :rowData="materials"
          :gridOptions="gridOptions"
          :quickFilterText="quickFilterText"
          domLayout="autoHeight"
        />
      </div>
    </div>

    <!-- Lightbox hiển thị hình ảnh -->
    <vue-easy-lightbox
      :visible="showViewer"
      :imgs="[selectedImage]"
      @hide="showViewer = false"
    />
    <!-- Gọi modal xác nhận xóa -->
    <DeleteConfirmModal 
      :show="showDeleteModal" 
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, type Ref } from "vue";
import { useMaterial } from "@/hooks/useMaterial";
import type { Material } from "@/models/material";
import VueEasyLightbox from "vue-easy-lightbox";
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal.vue";
const showDeleteModal = ref(false);
const selectedMaterialId = ref<number | null>(null);

const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;

const { fetchMaterials, addMaterial, editMaterial, removeMaterial, materials } = useMaterial();

onMounted(fetchMaterials);

// Danh sách đơn vị
const unitOptions = ref([
  "Cái",
  "Kg",
  "Lít",
  "Mét",
  "Hộp",
  "Thùng",
  "Bao",
  "Cuộn"
]);
// Biến reactive cho form nhập liệu
const materialForm = ref<Material>({
  MaterialID: 0,
  MaterialCode: "",
  MaterialName: "",
  Unit: "",
  Description: "",
  ImageUrl: "" as string | File | null,
  Model: "",
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
const previewUrl = ref<string | null>(null);
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    materialForm.value.ImageUrl = file;
    previewUrl.value = URL.createObjectURL(file);
  }
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
  previewUrl.value = null;
  errors.value.MaterialName = false;
  errors.value.Unit = false;
  const imageInput = document.getElementById("imageUpload") as HTMLInputElement;
  if (imageInput) {
    imageInput.value = "";
  }
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
        toast?.value?.showToast(response.message, "success");          
      } else {
        toast?.value?.showToast(response.message, "error");
      }
    } else {
      const response = await editMaterial(materialForm.value.MaterialID, materialForm.value);      
      if (response?.success) {
        toast?.value?.showToast(response.message, "success");
      } else {
        toast?.value?.showToast(response?.message || "Có lỗi xảy ra, vui lòng thử lại.", "error");
      }
    }
    resetForm();
    fetchMaterials();
  } catch (error) {    
    toast?.value?.showToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
  }
};
//Xoá dữ liệu 
const handleDelete = async () => {
  if (selectedMaterialId.value !== null) {
    try {
      await removeMaterial(selectedMaterialId.value);
      toast?.value?.showToast("Xoá dữ liệu thành công!", "success");
      fetchMaterials();
    } catch (error) {
      toast?.value?.showToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
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

// Định nghĩa columnDefs cho AG Grid
const columnDefs = ref<ColDef[]>([
  { headerName: "Mã vật tư", field: "MaterialCode", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Tên vật tư", field: "MaterialName", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Đơn vị", field: "Unit", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Mô tả", field: "Description", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  {
    headerName: "Hình ảnh",
    field: "ImageUrl",
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      const imageUrl = params.value;
      if (imageUrl && typeof imageUrl === "string") {
        return `
          <img
            src="${imageUrl}"
            alt="Hình ảnh"
            class="w-12 h-12 object-cover rounded-md cursor-pointer my-2"
          />
        `;
      }
      return "";
    },
    cellRendererParams: { onClick: openViewer },
    flex: 1,
  },
  { headerName: "Đặt tả", field: "Model", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  {
    headerName: "Hành động",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: (_params: any) => {
      return `
        <div data-row-id="${_params.data.MaterialID}">
          <i class="mdi mdi-pencil text-gray-500 text-lg cursor-pointer"></i>
          <i class="mdi mdi-delete text-gray-500 text-lg cursor-pointer ml-2"></i>
        </div>
      `;
    },
    cellRendererParams: {
      onEdit: (materialId: number) => {
        const material = materials.value.find((item) => item.MaterialID === materialId);
        if (material) {
          materialForm.value = { ...material };
          if (typeof material.ImageUrl === "string") {
            previewUrl.value = material.ImageUrl;
          }
        }
      },
      onDelete: (materialId: number) => {
        selectedMaterialId.value = materialId;
        showDeleteModal.value = true; // Hiển thị modal xác nhận xoá
      },
    },
    flex: 1,
  },
]);

// Cấu hình cho AG Grid
const gridApi = ref<GridApi | null>(null);
const selectedRowId = ref<number | null>(null);
const itemsPerPage = ref(5);
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
    } else if (event.colDef.field === "actions") {
      const materialId = event.data.MaterialID;
      const target = event.event?.target as HTMLElement;
      const cellElement = target.closest(".ag-cell");

      if (!cellElement) return;

      const editIcon = cellElement.querySelector(".mdi-pencil");
      const deleteIcon = cellElement.querySelector(".mdi-delete");

      // Nếu đã chọn dòng khác trước đó thì reset màu icon của dòng trước
      if (selectedRowId.value !== materialId) {
        const prevRow = document.querySelector(`[data-row-id="${selectedRowId.value}"]`);
        if (prevRow) {
          prevRow.querySelector(".mdi-pencil")?.classList.remove("text-yellow-500");
          prevRow.querySelector(".mdi-pencil")?.classList.add("text-gray-500");
          prevRow.querySelector(".mdi-delete")?.classList.remove("text-red-500");
          prevRow.querySelector(".mdi-delete")?.classList.add("text-gray-500");
        }
        selectedRowId.value = materialId;
      }

      // Xử lý màu khi click icon
      if (target.classList.contains("mdi-pencil")) {
        editIcon?.classList.add("text-yellow-500");
        editIcon?.classList.remove("text-gray-500");
        deleteIcon?.classList.add("text-gray-500");
        deleteIcon?.classList.remove("text-red-500");

        event.colDef.cellRendererParams?.onEdit(materialId);
      } else if (target.classList.contains("mdi-delete")) {
        deleteIcon?.classList.add("text-red-500");
        deleteIcon?.classList.remove("text-gray-500");
        editIcon?.classList.add("text-gray-500");
        editIcon?.classList.remove("text-yellow-500");

        event.colDef.cellRendererParams?.onDelete(materialId);
      }
    }
  },
});
</script>