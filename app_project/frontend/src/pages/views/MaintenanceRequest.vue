<template>
  <div class="w-full max-w-12xl mx-auto p-2 my-2 space-y-2 transition-all duration-300">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500">
      <div class="flex items-center space-x-6">
        <div class="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm transform transition-all duration-500 hover:rotate-12">
          <Icon icon="mdi:toolbox-outline" class="w-10 h-10 text-blue-400" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Maintenance Management System</h1>
          <p class="text-indigo-200 mt-2 font-medium">Comprehensive maintenance workflow solution</p>
        </div>
      </div>
    </div>

    <!-- Form Container -->
    <div class="bg-white/3 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl transition-all duration-500 hover:shadow-2xl">
      <!-- Form Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
            <Icon icon="mdi:clipboard-text-outline" class="text-2xl text-emerald-400" />
          </div>
          <div>
            <h2 class="text-2xl font-semibold text-white">Maintenance Request</h2>
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
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-black/20 p-6 rounded-xl border border-white/10">
            <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Icon icon="mdi:information-outline" class="text-blue-400" />
              <span>Request Details</span>
            </h3>
            <div class="space-y-5">
              <!-- Các trường input được cập nhật -->
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Request Number</span>
                  <span class="text-rose-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <input
                    v-model="maintenanceForm.RequestNumber"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                    :class="{ 'border-rose-500': errors.RequestNumber }"
                    readonly
                  />
                  <Icon v-if="errors.RequestNumber" icon="mdi:alert-circle" class="absolute right-3 top-3.5 text-rose-500 text-lg" />
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Machine Name</span>
                  <span class="text-rose-500 ml-1">*</span>
                </label>
                <div class="relative group">
                  <select
                    v-model="maintenanceForm.MachineName"
                    required
                    class="w-full pl-4 pr-10 py-3 text-sm bg-white/5 backdrop-blur-sm rounded-xl border
                          border-white/15 hover:border-white/30 focus:border-blue-400/60
                          focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2 focus:ring-offset-gray-900
                          transition-all duration-300 appearance-none cursor-pointer
                          text-gray-200 placeholder-gray-400/60
                          shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                    :class="{ 'border-rose-500/60': errors.MachineName }"
                  >
                    <option 
                      disabled 
                      value="" 
                      class="bg-gray-800 text-gray-400"
                    >
                      Select Machine Name
                    </option>
                    <option
                      v-for="machine in machines"
                      :key="machine.Name"
                      :value="machine.Name"
                      class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                    >
                       {{ machine.Name }}
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
                    v-if="errors.MachineName"
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

                  <p 
                    v-if="errors.MachineName"
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
                    Please select a valid machine name
                  </p>
                </div>
                <p v-if="errors.MachineName" class="text-rose-500 text-xs mt-1.5 ml-1">Machine name is required</p>
              </div>

              <!-- Diagnosis -->
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Diagnosis</span>
                  <span class="text-rose-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <textarea
                    v-model="maintenanceForm.Diagnosis"
                    rows="4"
                    required
                    placeholder="Enter diagnosis details"
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 placeholder-gray-400 transition-all duration-300"
                    :class="{ 'border-rose-500': errors.Diagnosis }"
                  ></textarea>
                  <Icon v-if="errors.Diagnosis" icon="mdi:alert-circle" class="absolute right-3 top-3.5 text-rose-500 text-lg" />
                </div>
                <p v-if="errors.Diagnosis" class="text-rose-500 text-xs mt-1.5 ml-1">Diagnosis is required</p>
              </div>

              <!-- Warehouse Selection -->
              <div>
                <label class="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <span>Warehouse</span>
                  <span class="text-rose-500 ml-1">*</span>
                </label>
                <div class="relative group">
                  <select
                    v-model="selectedWarehouse"
                    required
                    class="w-full pl-4 pr-10 py-3 text-sm bg-white/5 backdrop-blur-sm rounded-xl border
                          border-white/15 hover:border-white/30 focus:border-blue-400/60
                          focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2 focus:ring-offset-gray-900
                          transition-all duration-300 appearance-none cursor-pointer
                          text-gray-200 placeholder-gray-400/60
                          shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
                    :class="{ 'border-rose-500/60': errors.WarehouseId }"
                  >
                    <option 
                      disabled 
                      value="" 
                      class="bg-gray-800 text-gray-400"
                    >
                      Select Warehouse
                    </option>
                    <option
                      v-for="warehouse in warehouses"
                      :key="warehouse.WarehouseID"
                      :value="warehouse.WarehouseID"
                      class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                    >
                      🏬 {{ warehouse.WarehouseName }} ({{ warehouse.WarehouseCode }})
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
                    v-if="errors.WarehouseId"
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

                  <p 
                    v-if="errors.WarehouseId"
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
                    Please select a valid warehouse
                  </p>
                </div>
              </div>

              <!-- Requester -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Requested By</label>
                <div class="relative">
                  <input
                    v-model="maintenanceForm.RequestedBy"
                    readonly
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>

              <!-- Request Date -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Request Date</label>
                <div class="relative">
                  <input
                    v-model="maintenanceForm.RequestDate"
                    type="date"
                    readonly
                    class="w-full px-4 py-2.5 text-sm bg-white/5 rounded-lg border border-white/15 cursor-not-allowed opacity-75"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column - Materials Selection -->
        <div class="lg:col-span-3 space-y-6">
          <div class="bg-black/20 p-6 rounded-xl border border-white/10 h-full">
            <h3 class="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
              <Icon icon="mdi:package-variant" class="text-purple-400" />
              <span>Material Selection</span>
            </h3>
            
            <!-- Search Input -->
            <div class="relative mb-4">
              <input
                v-model="searchMaterial"
                placeholder="Search materials..."
                class="w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
              <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
            </div>

            <!-- Material List -->
            <div class="border border-white/10 rounded-xl overflow-hidden">
              <div class="max-h-60 overflow-y-auto custom-scrollbar bg-white/3">
                <div
                  v-for="item in filteredMaterials"
                  :key="item.MaterialID"
                  class="group flex justify-between items-center p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer border-b border-white/5"
                  @click="handleSelect(item)"
                >
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-white">{{ item.MaterialName }}</p>
                    <p class="text-xs text-gray-400 mt-1">{{ item.MaterialCode }}</p>
                  </div>
                  <button class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg border border-blue-400/30">
                    <Icon icon="mdi:plus" class="text-blue-400 text-sm" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Selected Materials Grid -->
            <div class="mt-6">
              <div ref="gridContainer1" class="ag-theme-material-futura rounded-xl overflow-hidden" style="height: 300px">
                <ag-grid-vue
                  :defaultColDef="defaultColDef"
                  :columnDefs="detailColumnDefs"
                  :rowData="selectedMaterials"
                  :gridOptions="detailGridOptions"
                  @grid-ready="onGridReady1"
                  @first-data-rendered="onFirstDataRendered1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end">
        <button
          @click="saveMaintenanceRequest"
          class="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center gap-3 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <Icon icon="mdi:content-save-check" class="text-white text-xl animate-pulse" />
          <span class="text-white font-semibold text-lg tracking-wide">Save Request</span>
          <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl"></div>
        </button>
      </div>
    </div>

    <!-- Request List Section -->
    <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      <div class="px-8 py-6 border-b border-white/10 shadow-sm">
        <div class="flex flex-wrap items-center justify-between">
          <!-- Left Section: Icon, Title, and Status Summary -->
          <div class="flex items-center space-x-6">
            <div class="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
              <Icon icon="mdi:clipboard-list-outline" class="text-2xl text-blue-400" />
            </div>
            <div>
              <h3 class="text-3xl font-bold text-white font-sans">Maintenance Requests</h3>
              <span class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-300 bg-blue-500/10 rounded-full mt-1">
                {{ maintenanceRequests.length }} active requests
              </span>
            </div>
            <div class="flex space-x-4 ml-4">
              <div class="flex space-x-4 mt-3">
                <!-- Pending → awaiting approval -->
                <span class="flex items-center px-2 py-1 bg-gray-800/20 rounded-full text-sm text-gray-300">
                  <Icon icon="mdi:clock-outline" class="mr-1" />
                  Pending: {{ statusCounts.pending }}
                </span>

                <!-- Approved → approved & preparing -->
                <span class="flex items-center px-2 py-1 bg-blue-800/20 rounded-full text-sm text-blue-300">
                  <Icon icon="mdi:checkbox-marked-circle-outline" class="mr-1" />
                  Approved: {{ statusCounts.approved }}
                </span>

                <!-- In Progress → work in progress -->
                <span class="flex items-center px-2 py-1 bg-yellow-800/20 rounded-full text-sm text-yellow-300">
                  <Icon icon="mdi:progress-clock" class="mr-1" />
                  In Progress: {{ statusCounts.inProgress }}
                </span>

                <!-- Completed → task completed -->
                <span class="flex items-center px-2 py-1 bg-green-800/20 rounded-full text-sm text-green-300">
                  <Icon icon="mdi:check-circle-outline" class="mr-1" />
                  Completed: {{ statusCounts.completed }}
                </span>

                <!-- Closed → request closed -->
                <span class="flex items-center px-2 py-1 bg-red-800/20 rounded-full text-sm text-red-300">
                  <Icon icon="mdi:folder-open-outline" class="mr-1" />
                  Closed: {{ statusCounts.closed }}
                </span>
              </div>

            </div>
          </div>

          <!-- Right Section: Filters, Search, and Actions -->
          <div class="flex items-center space-x-4 mt-4 lg:mt-0">
            <!-- Status filter -->
            <div class="relative w-48">
              <select
                v-model="filterStatus"
                class="w-full pl-4 pr-10 py-3 text-sm bg-white/5 backdrop-blur-sm rounded-xl border
                      border-white/15 hover:border-white/30 focus:border-blue-400/60
                      focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2 focus:ring-offset-gray-900
                      transition-all duration-300 appearance-none cursor-pointer
                      text-gray-200 placeholder-gray-400/60
                      shadow-[0_2px_6px_rgba(0,0,0,0.05)]"
              >
                <option
                  value=""
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  All Statuses
                </option>
                <option
                  value="Pending"
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  Pending
                </option>
                <option
                  value="Approved"
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  Approved
                </option>
                <option
                  value="In Progress"
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  In Progress
                </option>
                <option
                  value="Completed"
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  Completed
                </option>
                <option
                  value="Closed"
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                >
                  Closed
                </option>
              </select>

              <!-- custom down‐chevron, white to match text -->
              <Icon
                icon="mdi:chevron-down"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none"
              />
            </div>


            <!-- Search input -->
            <div class="relative w-72">
              <input
                v-model="quickFilterText"
                placeholder="Search requests..."
                class="peer w-full pl-4 pr-10 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-gray-200
                      focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
              />
              <Icon icon="mdi:magnify" class="absolute right-3 top-2.5 text-gray-400" />
              <button
                v-if="quickFilterText"
                @click="quickFilterText = ''"
                class="absolute right-8 top-2.5 text-gray-400 hover:text-white transition-colors"
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
            <!-- Search Date -->
            <div class="flex items-center space-x-2">
              <div class="relative">
                <input
                  v-model="filterDate.from"
                  type="date"
                  class="pl-8 pr-3 py-2 text-sm bg-white/5 backdrop-blur-sm rounded-xl border border-white/15
                        focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2
                        focus:ring-offset-gray-900 transition duration-300 text-gray-200 w-full"
                />
                <span class="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none">
                  <Icon icon="mdi:calendar-start" width="18" height="18" />
                </span>
              </div>

              <span class="text-gray-400">—</span>

              <div class="relative">
                <input
                  v-model="filterDate.to"
                  type="date"
                  class="pl-8 pr-3 py-2 text-sm bg-white/5 backdrop-blur-sm rounded-xl border border-white/15
                        focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 focus:ring-offset-2
                        focus:ring-offset-gray-900 transition duration-300 text-gray-200 w-full"
                />
                <span class="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none">
                  <Icon icon="mdi:calendar-end" width="18" height="18" />
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div ref="gridContainer2" class="ag-theme-material-futura h-[600px] border-b border-white/10">
        <ag-grid-vue
          :defaultColDef="defaultCol"
          :columnDefs="columnDefs"
          :rowData="filteredRequests"
          :frameworkComponents="frameworkComponents"
          :gridOptions="gridOptions"
          :quickFilterText="quickFilterText"
          @grid-ready="onGridReady2"
          @first-data-rendered="onFirstDataRendered2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject, type Ref, watch, nextTick } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { useMaintenance } from "@/hooks/useMaintenance";
import { useMaterial } from "@/hooks/useMaterial";
import { useWarehouse } from "@/hooks/useWarehouse";
import { useMachine } from "@/hooks/useMachine";
import { useAuth } from "@/hooks/useAuth";
import { debounce } from "lodash";
import { formatDateToYMD, formatDateToDMY } from "@/utils/dateUtils";
import { useAutoResizeGrid } from '@/composables/useAutoReSizeGrid';
import { Icon } from '@iconify/vue';
import RequestFormActionCell from '@/components/ui/RequestFormActionCell.vue';
import DeleteMaterialCell from '@/components/ui/DeleteMaterialCell.vue';
import ApproveRequestCell from '@/components/ui/ApproveRequestCell.vue';

import type {
  MaintenanceRequestCreate,
  MaintenanceRequestUpdate
} from "@/models/maintenance";
import type { Material } from "@/models/material";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { showConfirmToast } from "@/utils/confirmToast";
import 'vue-multiselect/dist/vue-multiselect.css';
import type { GridApi, GridOptions, SortDirection, ColDef } from "ag-grid-community";

const {
  fetchMaintenanceRequests,
  addMaintenanceRequest,
  approveMaintenanceRequest,
  updateMaintenanceRequest,
  maintenanceRequests,
  selectedMaintenanceRequest,
  fetchMaintenanceRequestById,
  deleteMaintenanceRequest
} = useMaintenance();

const { fetchUser, user } = useAuth();
onMounted(fetchMaintenanceRequests);
const { warehouses ,fetchWarehouses } = useWarehouse();
const { machines, fetchMachines } = useMachine();

const selectedWarehouse = ref<number | null>(null);
const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;
const requestDate = ref(new Date().toISOString().slice(0, 10));

const statusCounts = computed(() => ({
  pending:      maintenanceRequests.value.filter(r => r.Status === 'Pending').length,
  approved:     maintenanceRequests.value.filter(r => r.Status === 'Approved').length,
  inProgress:   maintenanceRequests.value.filter(r => r.Status === 'In Progress').length,
  completed:    maintenanceRequests.value.filter(r => r.Status === 'Completed').length,
  closed:       maintenanceRequests.value.filter(r => r.Status === 'Closed').length,
}));
const filterStatus     = ref<string>('');
const quickFilterText = ref("");
const filteredRequests = computed(() => {
  const txt = quickFilterText.value.toLowerCase()
  const fromDate = filterDate.value.from ? new Date(filterDate.value.from) : null;
  const toDate   = filterDate.value.to   ? new Date(filterDate.value.to)   : null;
  
  return maintenanceRequests.value
    // status filter
    .filter(r => !filterStatus.value || r.Status === filterStatus.value)
    // text filter (search across multiple fields)
    .filter(r => {
      if (!txt) return true
      return (
        r.RequestNumber.toString().toLowerCase().includes(txt) ||
        r.MachineName.toLowerCase().includes(txt) ||
        r.RequestedBy.toLowerCase().includes(txt)
      )
    })
    //filter date
    .filter(r => {
      // cắt bỏ timestamp, chỉ lấy yyyy-MM-dd
      const dateStr = r.RequestDate.slice(0, 10)
      const d = new Date(dateStr)
      if (fromDate && d < fromDate) return false
      if (toDate   && d > toDate)   return false
      return true
    })
});
const filterDate = ref<{
  from: string;
  to: string;
}>({
  from: '',
  to: ''
});
const maintenance = computed(() => maintenanceRequests.value); 
watch(maintenance, (newVal) => {
  if (newVal.length === 0) return;

  const validDates = newVal
    .map(item => item.RequestDate?.slice(0, 10)) 
    .filter(Boolean)
    .sort();

  const minDate = validDates[0];
  const maxDate = validDates[validDates.length - 1];

  filterDate.value = {
    from: minDate,
    to: maxDate,
  };
}, { immediate: true });

const maintenanceForm = ref<MaintenanceRequestCreate & { RequestID?: number }>({
  RequestNumber: "",
  MachineName: "",
  Diagnosis: "",
  RequestedBy: "",
  RequestDate: requestDate.value,
  Status: "Pending",
  Details: []
});

const errors = ref({
  RequestNumber: false,
  MachineName: false,
  Diagnosis: false,
  RequestedBy: false,
  WarehouseId: false,
  RequestDate: false
});
onMounted(() => {
  fetchWarehouses();
  fetchMachines();
});

const validateAll = (): boolean => {
  let isValid = true;
  const requiredFields = ["MachineName", "Diagnosis", "RequestedBy"];
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
// The loadUserData function calls fetchUser and updates maintenanceForm.RequestedBy
const loadUserData = async (): Promise<string> => {
  try {
    await fetchUser(); // fetchUser is a wrapper function that handles the binding of authStore.fetchUser
    if (user.value && user.value.username) {
      return user.value.username;
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
  return "";
};

//Load data User
onMounted(async () => {
  const requestedBy = await loadUserData();
  maintenanceForm.value.RequestedBy = requestedBy;  
});
const resetForm = async () => {
  const requestedBy = await loadUserData();
  maintenanceForm.value = {
    RequestNumber: "",
    MachineName: "",
    Diagnosis: "",
    RequestedBy: requestedBy,
    RequestDate: requestDate.value,
    Status: "Pending",
    Details: []
  };
  searchMaterial.value = "";
  selectedMaterials.value = [];
  selectedWarehouse.value = null;
  Object.keys(errors.value).forEach((key) => {
    errors.value[key as keyof typeof errors.value] = false;
  });
  selectedEditRowId.value = null;
  gridApi.value?.refreshCells({ force: true });  
};

// ----------------- MATERIAL SECTION -----------------
const { fetchMaterials, materials, fetchMaterialWithStock } = useMaterial();
onMounted(fetchMaterials);

// selectedMaterials contains the selected materials with additional properties like QuantityUsed (default is 0)
const selectedMaterials = ref<(Material & { 
  QuantityUsed: number; 
  RemainingStock: number; 
  WarehouseID: number;
  WarehouseCode: string;
  RequestID: number;
})[]>([]);

const searchMaterial = ref("");

// materialOptions is updated from materials
const materialOptions = computed(() => materials.value);

// Filter the material list based on the keyword (if the user types directly)
const filteredMaterials = computed(() => {
  if (!searchMaterial.value) return materialOptions.value;
  return materialOptions.value.filter((mat) =>
    mat.MaterialName.toLowerCase().includes(searchMaterial.value.toLowerCase()) ||
    mat.MaterialCode.toLowerCase().includes(searchMaterial.value.toLowerCase())
  );
});


// Function to handle when the user selects a material
const handleSelect = async (material: Material) => {
  if (!selectedWarehouse.value) {
    toast.value?.showToast("Please select a warehouse", "error");
    return;
  }

  const insufficientItems = selectedMaterials.value.filter(
    (item) => Number(item.QuantityUsed) > Number(item.RemainingStock)
  );

  if (insufficientItems.length) {
    insufficientItems.forEach(item => {
      toast.value?.showToast(`Material code ${item.MaterialCode} does not have enough stock in warehouse ${item.WarehouseCode}!`, "error");
    });
    return;
  }

  if (material && !selectedMaterials.value.find((m) =>
    m.MaterialID === material.MaterialID && m.WarehouseID === selectedWarehouse.value)) {
    
    const warehouseId = selectedWarehouse.value;

    try {
      // Type-casting the return value of fetchMaterialWithStock
      const materialWithStock = await fetchMaterialWithStock(material.MaterialID, warehouseId);
      const remainingStock = materialWithStock?.remaining_quantity || 0;
      const warehouse = warehouses.value.find((w) => w.WarehouseID === warehouseId);
      const WarehouseCode = warehouse ? warehouse.WarehouseCode : "";

      selectedMaterials.value.push({
        ...material,
        QuantityUsed: 0,
        RemainingStock: remainingStock,
        WarehouseID: warehouseId,
        WarehouseCode: WarehouseCode,
        RequestID: 0
      });

    } catch (error) {
      console.error("Error fetching stock information:", error);
    }
  }
};

const defaultColDef: ColDef = { flex:1, minWidth:170, sortable:true, filter:'agTextColumnFilter' };
// ----------------- AG Grid CHO CHI TIẾT VẬT TƯ -----------------
const detailColumnDefs = ref([
  { 
    headerName: "Material Code",
    field: "MaterialCode" 
  },
  { 
    headerName: "Material Name", 
    field: "MaterialName",   
  },
  { 
    headerName: "Quantity Used", 
    field: "QuantityUsed", 
    editable: true, 
    cellEditor: "agNumberCellEditor", 
    cellEditorParams: {
      precision: 2,
      step: 1,
      showStepperButtons: true,
    }
  },
  { 
    headerName: "Available Stock", 
    field: "RemainingStock", 
    valueFormatter: (params: any) => params.value === 0 ? "" : params.value
  },
  { 
    headerName: "Unit", 
    field: "Unit" 
  },
  { 
    headerName: "Warehouse", 
    field: "WarehouseCode"
  },
  {
    headerName: "Actions",
    field: "actions",
    cellRenderer: DeleteMaterialCell,      
  }
]);

function handleDeleteMaterial(params: any){
  selectedMaterials.value = selectedMaterials.value.filter(
    item =>
      item.MaterialID  !== params.data.MaterialID ||
      item.WarehouseID !== params.data.WarehouseID
  )
};

const gridApi = ref<GridApi | null>(null);

const gridApi1 = ref(null);
const gridContainer1 = ref(null);
const columnsToAutoSize1 = ['MaterialName'];

const gridApi2 = ref(null);
const gridContainer2 = ref(null);
const columnsToAutoSize2 = ['MachineName'];

const { onGridReady: onGridReady1, onFirstDataRendered: onFirstDataRendered1, resizeNow: resizeNow1 } = useAutoResizeGrid(gridApi1, gridContainer1, columnsToAutoSize1);
const { onGridReady: onGridReady2, onFirstDataRendered: onFirstDataRendered2, resizeNow: resizeNow2 } = useAutoResizeGrid(gridApi2, gridContainer2, columnsToAutoSize2);

const debouncedResize = debounce(async () => {
  await nextTick();
  resizeNow1();
  resizeNow2();
}, 200);

watch(
  selectedMaterials,
  debouncedResize,
  { deep: true }
);

const detailGridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: 5,
  paginationPageSizeSelector: [5, 10, 20],
  domLayout: "autoHeight",
  stopEditingWhenCellsLoseFocus: true,
  onCellEditingStopped: (_params: any) => {
    if (_params.colDef.field === "QuantityUsed") {
      const index = selectedMaterials.value.findIndex(
        (item) => item.MaterialID === _params.data.MaterialID &&
        item.WarehouseID === _params.data.WarehouseID
      );
      if (index !== -1) {        
        // Update the object using splice to maintain reactivity
        selectedMaterials.value.splice(index, 1, {
          ...selectedMaterials.value[index],
          QuantityUsed: _params.data.QuantityUsed
        });

        const insufficientItems = selectedMaterials.value.filter(
          (item) => Number(item.QuantityUsed) > Number(item.RemainingStock)
        );

        if (insufficientItems.length) {
          insufficientItems.forEach(item => {
            toast.value?.showToast(
              `Material code ${item.MaterialCode} in warehouse ${item.WarehouseCode} does not have sufficient stock!`,
              "error"
            );
          });
          return;
        }
      }
    }
  },
  context: {
    onDeleteMaterial: handleDeleteMaterial
  }
});


// ----------------- SAVE MAINTENANCE REQUEST -----------------
const saveMaintenanceRequest = async () => {
  // Map selected materials to maintenance request details
  maintenanceForm.value.Details = selectedMaterials.value.map((item) => ({
    MaterialID: item.MaterialID,
    QuantityUsed: item.QuantityUsed,
    WarehouseID: item.WarehouseID,
    RequestID: item.RequestID
  }));

  if (maintenanceForm.value.RequestID) {
    await fetchMaintenanceRequestById(maintenanceForm.value.RequestID);

    if (
      selectedMaintenanceRequest.value &&
      selectedMaintenanceRequest.value.Status === "Approved"
    ) {
      toast?.value?.showToast("Unable to update because the request has already been approved!", "error");
      return;
    }
  }

  if (!validateAll()) return;

  if (selectedMaterials.value.length === 0) {
    toast?.value?.showToast("Please select at least one material!", "error");
    return;
  }

  const insufficientItem = selectedMaterials.value.find(
    (item) => Number(item.QuantityUsed) > Number(item.RemainingStock)
  );

  const zeroQuantityItem = selectedMaterials.value.find(
    (item) => Number(item.QuantityUsed) === 0
  );

  if (zeroQuantityItem) {
    toast.value?.showToast(
      `Please enter a usage quantity.`,
      "error"
    );
    return;
  }

  if (insufficientItem) {
    toast.value?.showToast(
      `Material code ${insufficientItem.MaterialCode} in warehouse ${insufficientItem.WarehouseCode} does not have sufficient stock.`,
      "error"
    );
    return;
  }

  try {
    let response;

    if (!maintenanceForm.value.RequestID) {
      // Create new maintenance request
      response = await addMaintenanceRequest(maintenanceForm.value);
    } else {
      // Update existing maintenance request
      response = await updateMaintenanceRequest(
        maintenanceForm.value.RequestID,
        maintenanceForm.value as MaintenanceRequestUpdate
      );
    }
    
    toast?.value?.showToast(response.message, response.success ? "success" : "error");

    if (response.success) {
      resetForm();
      fetchMaintenanceRequests();
    }
  } catch (error) {
    toast?.value?.showToast("An unexpected error occurred. Please try again.", "error");
  }
};

const defaultCol: ColDef = { flex:1, minWidth:170, sortable:true, filter:'agTextColumnFilter' };
const selectedEditRowId = ref<number | null>(null);
// ----------------- AG Grid MAINTENANCE REQUEST LIST -----------------
const columnDefs = ref([
  { 
    headerName: "Request Number", 
    field: "RequestNumber", 
    sort: 'desc' as SortDirection, 
  },
  { 
    headerName: "Machine Name", 
    field: "MachineName", 
  },
  { 
    headerName: "Request Date", 
    field: "RequestDate", 
    valueFormatter: (_params: any) => formatDateToDMY(_params.value)
  },
  { 
    headerName: "Requested By", 
    field: "RequestedBy", 
  },
  { 
    headerName: "Status", 
    field: "Status", 
  },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: RequestFormActionCell,
  },
  {
    headerName: "Approve Request",
    field: "approve",
    sortable: false,
    filter: false,
    cellRenderer: ApproveRequestCell,
    cellRendererParams: {
      showLabels: window.innerWidth > 768 // Responsive label
    },
    suppressMovable: true,
    lockPosition: 'right' as 'right'
  }
]);
async function handleApprove(requestId: number) {
    await fetchMaintenanceRequestById(requestId)
    if (selectedMaintenanceRequest.value?.Status === 'Approved') {
      toast?.value?.showToast('This request has already been approved','error')
      resetForm()
      return
    }
    const confirmed = await showConfirmToast(
      'Are you sure you want to approve this maintenance request?'
    )
    if (confirmed) {
      const response = await approveMaintenanceRequest(requestId)
      response.success
        ? toast?.value?.showToast(response.message,'success')
        : (toast?.value?.showToast(response.message || 'Error occurred while approving!','error'),
           resetForm())
      if (response.success) await fetchMaintenanceRequests()
    }
  }
  async function handleEdit(requestId: number) {
  await fetchMaintenanceRequestById(requestId);
  if (selectedMaintenanceRequest.value) {
    maintenanceForm.value = { 
      ...selectedMaintenanceRequest.value,
      RequestDate: formatDateToYMD(selectedMaintenanceRequest.value.RequestDate)    
    };
    
    if (maintenanceForm.value.Details?.length) {
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
                  console.error("Error fetching material stock");
                }
                const warehouse = warehouses.value.find(
                  (w) => w.WarehouseID === d.WarehouseID
                );
                const WarehouseCode = warehouse ? warehouse.WarehouseCode : '';
              
                return {
                  MaterialID: d.MaterialID,
                  MaterialCode: material ? material.MaterialCode : "",
                  MaterialName: material ? material.MaterialName : "",
                  QuantityUsed: d.QuantityUsed,
                  Unit: material ? material.Unit : "",
                  RemainingStock: remainingStock,
                  WarehouseID: d.WarehouseID,
                  WarehouseCode: WarehouseCode,
                  RequestID: d.RequestID
                };
        })
      );
      selectedMaterials.value = updatedMaterials;
    }
  }
};
async function handleDelete(requestId: number){
  await fetchMaintenanceRequestById(requestId);
        if (
          selectedMaintenanceRequest.value &&
          selectedMaintenanceRequest.value.Status === "Approved"
        ) {
          toast?.value?.showToast("Cannot delete because the request has been approved", "error");
          resetForm();
          return;
        }
        const RequestNumber = selectedMaintenanceRequest.value?.RequestNumber;
        const confirmed = await showConfirmToast(`Are you sure you want to delete request ${RequestNumber}?`);
        if (confirmed) {
          const response = await deleteMaintenanceRequest(requestId);
          if (response.success) {
            const deletedRequestNumber =
              "deletedRequestNumber" in response ? response.deletedRequestNumber : "";
            toast?.value?.showToast(
              `Request ${deletedRequestNumber} has been deleted!`,
              "success"
            );
          } else {
            toast?.value?.showToast("Error deleting the request", "error");
          }
        }
        resetForm();  
};
const frameworkComponents = {
  RequestFormActionCell,
  DeleteMaterialCell,
  ApproveRequestCell
};
const gridOptions = ref<GridOptions>({
  pagination: true,
  paginationPageSize: 5,
  domLayout: "autoHeight",
  paginationPageSizeSelector: [5, 10, 20, 50, 100],
  onGridReady: (params) => {
    gridApi.value = params.api;
    // params.api.sizeColumnsToFit();
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
  },
  context: {
      onEdit: handleEdit,
      onDelete: handleDelete,
      onApprove: handleApprove
    }
});
</script>
