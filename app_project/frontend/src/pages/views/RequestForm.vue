<template>
  <div class="w-full max-w-12xl mx-auto p-6 my-6">
    <!-- Phần 1: Tiêu đề chính -->
    <div class="mt-0 mb-6">
      <h2 class="text-4xl font-extrabold text-blue-300 uppercase text-center">
        Quản lý phiếu bảo trì
      </h2>
    </div>

    <!-- Phần 2: Form nhập liệu phiếu bảo trì -->
    <div class="mb-6">
      <div class="bg-gray-700 text-gray-200 px-4 py-2 rounded-t-lg shadow-sm">
        <h3 class="text-lg font-medium">Thông tin phiếu bảo trì</h3>
      </div>
      <div class="bg-gradient-to-br from-gray-800 via-gray-750 to-gray-700 p-6 rounded-b-lg shadow-lg">
        <!-- Div trên: Form thông tin phiếu bảo trì -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <!-- Nhóm bên trái:-->
          <div class="grid grid-cols-1 gap-y-2 self-start">
            <div>
              <label for="requestNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Số phiếu
              </label>
              <input
                v-model="maintenanceForm.RequestNumber"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.RequestNumber ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.RequestNumber" class="text-red-500 text-xs mt-1">
                Vui lòng nhập số phiếu.
              </p>
            </div>
            <div>
              <label for="machineName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Tên máy
              </label>
              <input
                v-model="maintenanceForm.MachineName"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.MachineName ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.MachineName" class="text-red-500 text-xs mt-1">
                Vui lòng nhập tên máy.
              </p>
            </div>
            <div>
              <label for="diagnosis" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Chuẩn đoán
              </label>
              <textarea
                v-model="maintenanceForm.Diagnosis"
                rows="4"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.Diagnosis ? 'border-red-500' : 'border-gray-300'
                ]"
              ></textarea>
              <p v-if="errors.Diagnosis" class="text-red-500 text-xs mt-1">
                Vui lòng nhập chuẩn đoán.
              </p>
            </div>
            <div>
              <label for="warehouse" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kho</label>
              <select
                v-model="maintenanceForm.WarehouseId"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none',
                  errors.WarehouseId ? 'border-red-500' : 'border-gray-300'
                ]"
              >
                <option disabled value="">Chọn Kho</option>
                <option
                  v-for="warehouse in warehouses"
                  :key="warehouse.WarehouseID"
                  :value="warehouse.WarehouseID"
                >
                  {{ warehouse.WarehouseName }}
                </option>
              </select>
              <p v-if="errors.WarehouseId" class="text-red-500 text-xs mt-1">
                Vui lòng chọn Kho.
              </p>
            </div> 
            <div>
              <label for="requestedBy" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Người yêu cầu
              </label>
              <input
                v-model="maintenanceForm.RequestedBy"
                required
                :class="[
                  'w-full px-3 py-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.RequestedBy ? 'border-red-500' : 'border-gray-300'
                ]"
              />
              <p v-if="errors.RequestedBy" class="text-red-500 text-xs mt-1">
                Vui lòng nhập người yêu cầu.
              </p>
            </div>
            
          </div>
          <!-- Nhóm bên phải: -->
          <div class="grid grid-cols-1 gap-y-2">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Chọn vật tư
              </label>
              <!-- Input tìm kiếm vật tư -->
              <input
                v-model="searchMaterial"
                placeholder="Nhập tên hoặc mã vật tư..."
                class="w-full px-3 py-2 mb-2 text-sm text-white bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <!-- Danh sách vật tư có thể scroll -->
              <div class="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                <div
                  v-for="item in filteredMaterials"
                  :key="item.MaterialID"
                  class="flex justify-between items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                  @click="handleSelect(item)"
                >
                  <div>
                    <span>{{ item.MaterialName }}</span>
                    <span class="text-sm text-gray-500">({{ item.MaterialCode }})</span>
                  </div>
                  <button class="text-blue-500 text-sm">Thêm</button>
                </div>
              </div>
            </div>            
            <div>
              <label for="LIST" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Vật tư đã chọn
              </label>
              <div>
                <ag-grid-vue
                  class="ag-theme-quartz rounded"
                  style="width: 100%; height: auto;"
                  :columnDefs="detailColumnDefs"
                  :rowData="selectedMaterials"
                  :gridOptions="detailGridOptions"
                  domLayout="autoHeight"
                />
              </div>
            </div>     
          </div>
        </div>
        <!-- Div dưới: 2 nút Lưu và Làm mới -->
        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="saveMaintenanceRequest"
            class="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Lưu phiếu
          </button>
          <button
            @click="resetForm"
            class="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Phần 3: Bảng danh sách phiếu bảo trì -->
    <div class="mb-6">
      <div class="bg-gray-700 text-gray-200 px-4 py-2 rounded-t-lg shadow-sm">
        <h3 class="text-lg font-medium">Danh sách phiếu bảo trì</h3>
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
          :rowData="maintenanceRequests"
          :gridOptions="gridOptions"
          :quickFilterText="quickFilterText"
          domLayout="autoHeight"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject, type Ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useMaterial } from "@/hooks/useMaterial";
import { useWarehouse } from "@/hooks/warehouse";
import type {
  MaintenanceRequestCreate,
  MaintenanceRequestUpdate
} from "@/models/maintenance";
import type { Material } from "@/models/material";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { showConfirmToast } from "@/utils/confirmToast";
import 'vue-multiselect/dist/vue-multiselect.css';
import type { GridApi, GridOptions } from "ag-grid-community";

// ----------------- PHẦN QUẢN LÝ PHIẾU BẢO TRÌ -----------------
const {
  fetchMaintenanceRequests,
  addMaintenanceRequest,
  approveMaintenanceRequest,
  updateMaintenanceRequest,
  maintenanceRequests,
  selectedMaintenanceRequest,
  fetchMaintenanceRequestById
} = useMaintenance();

onMounted(fetchMaintenanceRequests);
const { warehouses ,fetchWarehouses } = useWarehouse();

const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;

const maintenanceForm = ref<MaintenanceRequestCreate & { RequestID?: number }>({
  RequestNumber: "",
  MachineName: "",
  Diagnosis: "",
  RequestedBy: "",
  Status: "Pending",
  WarehouseId: 0,
  Details: []
});

const errors = ref({
  RequestNumber: false,
  MachineName: false,
  Diagnosis: false,
  RequestedBy: false,
  WarehouseId: false
});
onMounted(() => {
  fetchWarehouses();
});

const validateAll = (): boolean => {
  let isValid = true;
  const requiredFields = ["RequestNumber", "MachineName", "Diagnosis", "RequestedBy"];
  requiredFields.forEach((field) => {
    if (!maintenanceForm.value[field as keyof typeof maintenanceForm.value]) {
      errors.value[field as keyof typeof errors.value] = true;
      isValid = false;
    } else {
      errors.value[field as keyof typeof errors.value] = false;
    }
  });
  return isValid;
};

const resetForm = () => {
  maintenanceForm.value = {
    RequestNumber: "",
    MachineName: "",
    Diagnosis: "",
    RequestedBy: "",
    Status: "Pending",
    WarehouseId: 0,
    Details: []
  };
  searchMaterial.value = "";
  selectedMaterials.value = [];
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = false;
  });
};

const quickFilterText = ref("");

// ----------------- PHẦN VẬT TƯ -----------------
const { fetchMaterials, materials, fetchMaterialWithStock } = useMaterial();
onMounted(fetchMaterials);

// selectedMaterials chứa các vật tư được chọn cùng thuộc tính QuantityUsed (mặc định là 0)
const selectedMaterials = ref<(Material & { QuantityUsed: number; RemainingStock: number })[]>([]);

const searchMaterial = ref("");
// materialOptions được cập nhật từ materials
const materialOptions = computed(() => materials.value);

// Lọc danh sách vật tư dựa trên từ khóa (nếu người dùng gõ trực tiếp)
const filteredMaterials = computed(() => {
  if (!searchMaterial.value) return materialOptions.value;
  return materialOptions.value.filter((mat) =>
    mat.MaterialName.toLowerCase().includes(searchMaterial.value.toLowerCase()) ||
    mat.MaterialCode.toLowerCase().includes(searchMaterial.value.toLowerCase())
  );
});

// Hàm xử lý khi người dùng chọn vật tư
const handleSelect = async (material: Material) => {
  if (material && !selectedMaterials.value.find((m) => m.MaterialID === material.MaterialID)) {
    const warehouseId = 1; // hoặc lấy từ biến cấu hình nếu cần
    try {
      // Ép kiểu trả về cho fetchMaterialWithStock
      const materialWithStock = await fetchMaterialWithStock(material.MaterialID, warehouseId);
      const remainingStock = materialWithStock?.remaining_quantity || 0;
      
      selectedMaterials.value = [
        ...selectedMaterials.value,
        { ...material, QuantityUsed: 0, RemainingStock: remainingStock }
      ];
    } catch (error) {
      console.error("Lỗi khi lấy thông tin tồn kho:", error);
    }
  }
};

// ----------------- AG Grid CHO CHI TIẾT VẬT TƯ -----------------
const detailColumnDefs = ref([
  { headerName: "Mã vật tư", field: "MaterialCode", flex: 1 },
  { headerName: "Tên vật tư", field: "MaterialName", flex: 1 },
  { 
    headerName: "SL sử dụng", 
    field: "QuantityUsed", 
    editable: true, 
    flex: 1,
    cellEditor: "agTextCellEditor", 
    valueParser: (params: any) => Number(params.newValue)
  },
  { 
    headerName: "SL tồn kho", 
    field: "RemainingStock", 
    flex: 1,
    valueFormatter: (params: any) => params.value === 0 ? "" : params.value
   },
  { headerName: "Đơn vị tính", field: "Unit", flex: 1 },
  {
    headerName: "Hành động",
    field: "actions",
    cellRenderer: (_params: any) => {
      return `<button class="btn-remove text-red-500">Xóa</button>`;
    },
    cellRendererParams: {
      onClick: (params: any) => {
        selectedMaterials.value = selectedMaterials.value.filter(
          (item) => item.MaterialID !== params.data.MaterialID
        );
      }
    },
    flex: 1
  }
]);

const detailGridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: 5,
  paginationPageSizeSelector: [5, 10, 20],
  domLayout: "autoHeight",
  onCellValueChanged: (_params: any) => {
    // Giá trị số lượng trong selectedMaterials đã được cập nhật tự động qua valueParser
  }
});

// ----------------- SAVE PHIẾU BẢO TRÌ -----------------
const saveMaintenanceRequest = async () => {
  if (!validateAll()) return;

  // Map vật tư đã chọn thành chi tiết phiếu bảo trì
  maintenanceForm.value.Details = selectedMaterials.value.map((item) => ({
    MaterialID: item.MaterialID,
    WarehouseID: maintenanceForm.value.WarehouseId, 
    QuantityUsed: item.QuantityUsed
  }));

  try {
    if (!maintenanceForm.value.RequestID) {
      // Tạo mới phiếu bảo trì
      const response = await addMaintenanceRequest(maintenanceForm.value);
      if (response.success && response.data && response.data.RequestID) {
        toast?.value?.showToast("Tạo phiếu bảo trì thành công!", "success");
      } else {
        toast?.value?.showToast(response.message || "Có lỗi xảy ra khi tạo phiếu bảo trì!", "error");
      }
    } else {
      // Cập nhật phiếu bảo trì
      const response = await updateMaintenanceRequest(
        maintenanceForm.value.RequestID,
        maintenanceForm.value as MaintenanceRequestUpdate
      );
      if (response.success && response.data && response.data.RequestID) {
        toast?.value?.showToast("Cập nhật phiếu bảo trì thành công!", "success");
      } else {
        toast?.value?.showToast(response.message || "Có lỗi xảy ra khi cập nhật phiếu bảo trì!", "error");
      }
    }
    resetForm();
    fetchMaintenanceRequests();
  } catch (error) {
    toast?.value?.showToast("Có lỗi xảy ra, vui lòng thử lại!", "error");
  }
};
const selectedEditRowId = ref<number | null>(null);

// ----------------- AG Grid DANH SÁCH PHIẾU BẢO TRÌ -----------------
const columnDefs = ref([
  { headerName: "Số phiếu", field: "RequestNumber", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Tên máy", field: "MachineName", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Chuẩn đoán", field: "Diagnosis", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Người yêu cầu", field: "RequestedBy", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  { headerName: "Trạng thái", field: "Status", sortable: true, filter: "agTextColumnFilter", flex: 1 },
  {
    headerName: "Hành động",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: (params: any) => {
      // Tạo container cho các icon
      const container = document.createElement("div");
      container.setAttribute("data-row-id", params.data.RequestID);

      // Tạo icon edit (pencil)
      const editIcon = document.createElement("i");
      // Kiểm tra nếu dòng được chọn thì icon hiển thị màu vàng, ngược lại màu xám
      if (selectedEditRowId.value === params.data.RequestID) {
        editIcon.className = "mdi mdi-pencil text-yellow-500 text-lg cursor-pointer";
      } else {
        editIcon.className = "mdi mdi-pencil text-gray-500 text-lg cursor-pointer";
      }
      editIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        // Cập nhật dòng được chọn
        selectedEditRowId.value = params.data.RequestID;
        // Refresh lại grid để cập nhật màu của các cell (nếu bạn có sử dụng grid API)
        params.api.refreshCells({ force: true });
        // Gọi hàm onEdit được truyền qua cellRendererParams
        params.colDef.cellRendererParams.onEdit(params.data.RequestID);
      });
      container.appendChild(editIcon);

      // Tạo icon approve (check-circle)
      const approveIcon = document.createElement("i");
      if (params.data.Status === "Approved") {
        // Nếu trạng thái là Approved -> hiển thị màu xám và không cho click
        approveIcon.className = "mdi mdi-check-circle text-gray-500 text-lg ml-2";
      } else {
        // Nếu khác "Approved" -> hiển thị màu xanh và cho phép click
        approveIcon.className = "mdi mdi-check-circle text-green-500 text-lg cursor-pointer ml-2";
        approveIcon.addEventListener("click", (event) => {
          event.stopPropagation();
          params.colDef.cellRendererParams.onApprove(params.data.RequestID);
        }, { once: true });
      }
      container.appendChild(approveIcon);

      return container;
    },
    cellRendererParams: {
    onEdit: async (requestId: number) => {
      await fetchMaintenanceRequestById(requestId);
      if (selectedMaintenanceRequest.value) {
        maintenanceForm.value = {
           ...selectedMaintenanceRequest.value, 
           WarehouseId: (selectedMaintenanceRequest.value.Details as any).WarehouseId ?? 0         
          };
        if (maintenanceForm.value.Details && maintenanceForm.value.Details.length) {

          // Sử dụng Promise.all để load tồn kho cho từng vật tư
          const updatedMaterials = await Promise.all(
            maintenanceForm.value.Details.map(async (d: any) => {
              const material = materialOptions.value.find(
                (m) => m.MaterialID === d.MaterialID
              );
              let remainingStock = 0;              
              try {
                const warehouseID =
                      selectedMaintenanceRequest.value!.Status === "Approved"
                        ? 0
                        : d.WarehouseID;
                        
                const materialWithStock = await fetchMaterialWithStock(
                  d.MaterialID,
                  warehouseID
                );                
                remainingStock = materialWithStock?.remaining_quantity || 0;
              } catch (error) {
                console.error("Lỗi khi lấy tồn kho cho vật tư", d.MaterialID, error);
              }
              return {
                MaterialID: d.MaterialID,
                MaterialCode: material ? material.MaterialCode : "",
                MaterialName: material ? material.MaterialName : "",
                QuantityUsed: d.QuantityUsed,
                Unit: material ? material.Unit : "",
                RemainingStock: remainingStock,
                WarehouseID: d.WarehouseID
              };
            })
          );
          selectedMaterials.value = updatedMaterials;
        }
      }
    },
    onApprove: async (requestId: number) => {
        // Load thông tin request nếu chưa có
        await fetchMaintenanceRequestById(requestId);
        // Kiểm tra nếu request đã duyệt
        if (
          selectedMaintenanceRequest.value &&
          selectedMaintenanceRequest.value.Status === "Approved"
        ) {
          toast?.value?.showToast("Số phiếu đã được duyệt", "error");
          return;
        }
        const confirmed = await showConfirmToast(
          "Bạn có chắc muốn duyệt phiếu bảo trì này?"
        );
        if (confirmed) {
          const response = await approveMaintenanceRequest(requestId);
          if (response.success) {
            toast?.value?.showToast(response.message, "success");
            fetchMaintenanceRequests();
          } else {
            toast?.value?.showToast(
              response.message || "Có lỗi xảy ra khi duyệt phiếu bảo trì!",
              "error"
            );
          }
        }
      },
    },
    flex: 1
  }
]);

const gridApi = ref<GridApi | null>(null);
const gridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: 5,
  domLayout: "autoHeight",
  paginationPageSizeSelector: [5, 20, 50, 100],
  onGridReady: (params) => {
    gridApi.value = params.api;
    params.api.sizeColumnsToFit();
    params.api.setGridOption("rowData", maintenanceRequests.value);
  },
  onCellClicked: (event) => {
    if (event.colDef.field === "actions") {
      const requestId = event.data.RequestID;
      const target = event.event?.target as HTMLElement;
      if (!target) return;
      if (target.classList.contains("mdi-pencil")) {
        event.colDef.cellRendererParams?.onEdit(requestId);
      } else if (target.classList.contains("mdi-check-circle")) {
        event.colDef.cellRendererParams?.onApprove(requestId);
      }
    }
  }
});
</script>
