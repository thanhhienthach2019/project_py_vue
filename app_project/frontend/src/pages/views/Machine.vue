<template>
    <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-2 transition-all duration-300">
      <!-- Header Section -->
      <div
        class="bg-gradient-to-r from-green-600/30 to-teal-600/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500"
      >
        <div class="flex items-center space-x-6">
          <div
            class="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transform transition-all duration-500 hover:rotate-12"
          >
            <Icon icon="mdi:robot-industrial" class="w-10 h-10 text-green-400" />
          </div>
          <div>
            <h1 class="text-3xl font-bold text-white tracking-tight">Machine Management System</h1>
            <p class="text-teal-200 mt-2 font-medium">Comprehensive machine lifecycle management solution</p>
          </div>
        </div>
      </div>
  
      <!-- Form Container -->
      <div
        class="bg-white/3 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl transition-all duration-500 hover:shadow-2xl"
      >
        <!-- Form Header -->
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0"
        >
          <div class="flex items-center space-x-4">
            <div class="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <Icon icon="mdi:memory" class="text-2xl text-emerald-400" />
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-white">Machine Profile</h2>
              <p class="text-sm text-gray-300 mt-1">Fields marked with * are required</p>
            </div>
          </div>
          <button
            @click="resetForm"
            class="group relative px-6 py-3.5 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl flex items-center gap-3 hover:bg-gray-700/70 transition-all duration-300 border border-white/10 hover:border-white/20"
          >
            <Icon
              icon="mdi:autorenew"
              class="text-green-400 text-xl transition-transform duration-300 group-hover:rotate-180"
            />
            <span class="text-gray-100 font-medium tracking-wide">Reset Form</span>
          </button>
        </div>
  
        <!-- Main Form Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <!-- Left Column -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Basic Information -->
            <div class="bg-black/20 p-6 rounded-xl border border-white/10">
              <h3
                class="text-lg font-semibold text-white mb-6 flex items-center space-x-2"
              >
                <Icon icon="mdi:information-outline" class="text-green-400" />
                <span>Basic Information</span>
              </h3>
              <div class="space-y-5">
                <div>
                  <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <span>Name</span><span class="text-rose-500 ml-1">*</span>
                  </label>
                  <input
                    v-model="machineForm.Name"
                    required
                    placeholder="Enter machine name"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                  />
                  <p v-if="errors.Name" class="text-rose-500 text-xs mt-1.5 ml-1">Name is required</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <input
                      v-model="machineForm.Type"
                      placeholder="Enter machine type"
                      class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Manufacturer</label>
                    <input
                      v-model="machineForm.Manufacturer"
                      placeholder="Enter manufacturer"
                      class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Model</label>
                    <input
                      v-model="machineForm.Model"
                      placeholder="Enter model"
                      class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Serial Number</label>
                    <input
                      v-model="machineForm.SerialNumber"
                      placeholder="Enter serial number"
                      class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>            
  
            <!-- Description -->
            <div class="bg-black/20 p-6 rounded-xl border border-white/10">
              <h3
                class="text-lg font-semibold text-white mb-6 flex items-center space-x-2"
              >
                <Icon icon="mdi:clipboard-text" class="text-green-400" />
                <span>Description</span>
              </h3>
              <textarea
                v-model="machineForm.Description"
                rows="3"
                placeholder="Enter description"
                class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
              ></textarea>
            </div>
          </div>
  
          <!-- Right Column - Actions -->
          <div class="lg:col-span-2 flex flex-col justify-top space-y-6">
            <!-- Schedule & Location -->
            <div class="bg-black/20 p-6 rounded-xl border border-white/10">
              <h3
                class="text-lg font-semibold text-white mb-6 flex items-center space-x-2"
              >
                <Icon icon="mdi:calendar-check" class="text-teal-400" />
                <span>Schedule & Location</span>
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Purchase Date</label>
                  <input
                    v-model="machineForm.PurchaseDate"
                    type="date"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Last Maintenance</label>
                  <input
                    v-model="machineForm.LastMaintenance"
                    type="date"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/30 transition-all duration-300"
                  />
                </div>
              </div>
              <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <input
                    v-model="machineForm.Location"
                    placeholder="Enter location"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-green-400 focus:ring-2 focus:ring-green-400/30 placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <div class="flex items-center space-x-2">
                  <input v-model="machineForm.Status" type="checkbox" class="h-5 w-5 text-teal-400" />
                  <label class="block text-sm font-medium text-gray-300">Active</label>
                </div>
              </div>
            </div>
            <button
              v-permission.disable="'menu:machines:create'"
              @click="saveMachine"
              class="w-full group relative px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Icon icon="mdi:content-save-check" class="text-white text-xl animate-pulse" />
              <span class="text-white font-semibold text-lg tracking-wide">Save Machine Profile</span>
              <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
            </button>
          </div>
        </div>
      </div>
  
      <!-- Data Table Section -->
      <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div class="px-8 py-6 border-b border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="relative group">
                <div
                  class="w-14 h-10 bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 group-hover:border-green-400/40 transition-all duration-300 flex items-center justify-center"
                >
                  <Icon icon="mdi:database" class="w-8 h-8 text-white" />
                </div>
                <div class="absolute -bottom-1 left-4 right-4 h-1 bg-white/5 blur-sm rounded-full group-hover:bg-green-400/30 transition-colors"></div>
              </div>
              <div class="flex-1 min-w-0">
                <h3
                  class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 tracking-tight"
                >
                  Machine Data
                </h3>
                <div class="flex items-center space-x-2 mt-1">
                  <span class="text-sm font-medium text-gray-400">Total Machines:</span>
                  <span
                    class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                  >
                    {{ machines.length }} active
                  </span>
                </div>
              </div>
              <div class="relative w-72">
                <input
                  v-model="quickFilterText"
                  placeholder="Search machines..."
                  class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all"
                />
                <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div ref="gridContainer" style="overflow-x: auto">
          <ag-grid-vue
            class="ag-theme-material-futura h-[600px]"
            style="width: 100%"
            :defaultColDef="defaultColDef"
            :columnDefs="columnDefs"
            :rowData="machines"
            :frameworkComponents="frameworkComponents"
            :gridOptions="gridOptions"
            :quickFilterText="quickFilterText"
            @grid-ready="onGridReady"
            @first-data-rendered="onFirstDataRendered"
          />
        </div>
      </div>
  
      <!-- Delete Confirmation Modal -->
      <DeleteConfirmModal
        :show="showDeleteModal"
        @close="showDeleteModal = false"
        @confirm="handleDelete"
        title="Delete Machine"
        description="This action will permanently remove the machine and all related data."
      />
  
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, nextTick, watch, inject, type Ref  } from "vue";
  import { AgGridVue } from "ag-grid-vue3";
  import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
  import { useMachine } from "@/hooks/useMachine";
  import type { Machine } from "@/models/machine";
  import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal.vue";
  import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
  import { Icon } from "@iconify/vue";
  import MachineActionCell from "@/components/ui/MachineActionCell.vue";
  import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
  import { showConfirmToast } from "@/utils/confirmToast";

  
  const { fetchMachines, selectedMachine , addMachine, fetchMachineById, editMachine, removeMachine, machines } = useMachine();  
  const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;
  
  const machineForm = ref<Machine>({
    MachineID: 0,
    Name: "",
    Type: null,
    Manufacturer: null,
    Model: null,
    SerialNumber: null,
    PurchaseDate: null,
    LastMaintenance: null,
    Status: true,
    Location: null,
    Description: null,
    CreatedBy: null,
    CreateDate: null,
    LastUpdate: null,
  });
  
  const errors = ref({ Name: false });
  
  const quickFilterText = ref("");
  const showDeleteModal = ref(false);
    
  const columnDefs = ref<ColDef[]>([
    { headerName: "Name", field: "Name" },
    { headerName: "Type", field: "Type" },
    { headerName: "Manufacturer", field: "Manufacturer" },
    { headerName: "Location", field: "Location" },
    { headerName: "Description", field: "Description" },
    { headerName: "Model", field: "Model" },
    { headerName: "SerialNumber", field: "SerialNumber" },
    { 
        headerName: "Status", 
        field: "Status",
        cellRenderer: (params: any) => {
            return `
            <div class="flex justify-center items-center">
                <i class="${params.value ? 'text-green-500 mdi mdi-checkbox-marked' : 'text-gray-500 mdi mdi-checkbox-blank-outline'} text-xl"></i>
            </div>
            `;
        } 
    },
    {
      headerName: "Actions",
      field: "actions",
      sortable: false,
      filter: false,
      cellRenderer: MachineActionCell,
    },
  ]);
  
  const frameworkComponents = { MachineActionCell };
  const gridApi = ref<GridApi | null>(null);
  const gridContainer = ref<HTMLElement | null>(null);
  const defaultColDef: ColDef = { flex: 1, minWidth: 150, sortable: true, filter: "agTextColumnFilter" };
  
  const columnsToAutoSize = ["Description", "Name", "Type"];
  const { onGridReady, onFirstDataRendered, resizeNow } = useAutoResizeGrid(gridApi, gridContainer, columnsToAutoSize);
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
    },
    context: {
      onEdit: handleEdit,
      onDelete: handleDelete,
    }
  });

  async function handleEdit(machineId: number){
    const machine = machines.value.find((item) => item.MachineID === machineId);
    if (machine) {
        machineForm.value = { ...machine };
    }
};
  
  onMounted(async () => {
    await fetchMachines();
  });
  
  // Form reset
  function resetForm() {
    machineForm.value = {
      MachineID: 0,
      Name: "",
      Type: null,
      Manufacturer: null,
      Model: null,
      SerialNumber: null,
      PurchaseDate: null,
      LastMaintenance: null,
      Status: true,
      Location: null,
      Description: null,
      CreatedBy: null,
      CreateDate: null,
      LastUpdate: null,
    };
    errors.value.Name = false;
  }
  
  // Validate & save
  async function saveMachine() {
    errors.value.Name = !machineForm.value.Name;
    if (errors.value.Name) return;
  
    let response;
    if (!machineForm.value.MachineID) {
      response = await addMachine(machineForm.value);
    } else {
      response = await editMachine(machineForm.value.MachineID, machineForm.value);
    }
  
    if (response.success) {
      toast.value?.showToast(response.message, "success");
      await fetchMachines();
      resetForm();
    } else {
      toast.value?.showToast(response.message, "error");
    }    
  }
  
  async function handleDelete(machineId: number){
  await fetchMachineById(machineId);
        const machineName = selectedMachine.value?.Name;
        const confirmed = await showConfirmToast(`Are you sure you want to delete machine name ${machineName}?`);
        if (confirmed) {
          const response = await removeMachine(machineId);
          if (response.message) {
            const deletedMachineName =
              "deletedMachineName" in response ? response.deletedMachineName: "";
            toast?.value?.showToast(
              `Machine name ${deletedMachineName} has been deleted!`,
              "success"
            );
          } else {
            toast?.value?.showToast("Error deleting the machine", "error");
          }
        }
        resetForm();  
};
  // AG-Grid auto resize on data change
  watch(machines, () => {
    nextTick(resizeNow);
  });
  
  </script>
  