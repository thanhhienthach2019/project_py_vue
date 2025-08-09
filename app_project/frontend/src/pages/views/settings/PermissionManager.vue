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
              Router & Permission Management
            </span>
          </h1>
          <p class="text-gray-300 mt-2 text-sm sm:text-base">
            Define routes, permissions and their bindings
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="bg-[#2E3A47] rounded-2xl p-4 border border-white/10 shadow-lg">
      <div class="flex flex-wrap gap-2 sm:gap-4">
        <button
          @click="activeTab = 'routers'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'routers'
              ? 'bg-blue-600 text-white'
              : 'bg-[#3B4856] text-gray-300 hover:bg-[#475769]',
          ]"
        >
          Routers
        </button>
        <button
          @click="activeTab = 'permissions'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'permissions'
              ? 'bg-purple-600 text-white'
              : 'bg-[#3B4856] text-gray-300 hover:bg-[#475769]',
          ]"
        >
          Permissions
        </button>
        <button
          @click="activeTab = 'bindings'"
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeTab === 'bindings'
              ? 'bg-cyan-600 text-white'
              : 'bg-[#3B4856] text-gray-300 hover:bg-[#475769]',
          ]"
        >
          Bindings
        </button>
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Routers Tab -->
      <section v-if="activeTab === 'routers'" class="space-y-6">
        <!-- Form Card -->
        <div
          class="bg-[#2E3A47] rounded-2xl p-6 border border-white/10 shadow-lg"
        >
          <!-- Header -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                <Icon
                  :icon="
                    routerEditMode
                      ? 'mdi:file-edit-outline'
                      : 'mdi:plus-box-outline'
                  "
                  class="text-blue-400 text-2xl"
                />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ routerEditMode ? "Edit Router" : "New Router" }}
                </h2>
                <p class="text-sm text-gray-400">
                  {{
                    routerEditMode
                      ? "Update existing router settings"
                      : "Create a new router entry"
                  }}
                </p>
              </div>
            </div>

            <button
              @click="resetRouterForm()"
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B4856] hover:bg-[#475769] rounded-xl border border-white/10 transition-all"
            >
              <Icon icon="mdi:autorenew" class="text-blue-400 text-lg" />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Router Name</label
              >
              <input
                v-model="routerForm.name"
                type="text"
                placeholder="Enter router name"
                class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition"
              />
            </div>

            <!-- Path -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Router Path</label
              >
              <SearchableSelect
                v-model="routeKey"
                :options="availableRouteOptions"
                label-key="label"
                value-key="key"
                code-key="code"
                placeholder="Select a route"
                class="bg-[#3B4856] border-white/10"
              />
            </div>

            <!-- Method -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Method</label
              >
              <select
                id="method"
                v-model="routerForm.method"
                required
                class="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                  disabled
                  value=""
                >
                  -- Select HTTP Method --
                </option>
                <option
                  class="bg-gray-800 text-gray-200 hover:bg-blue-500/20 focus:bg-blue-500/20"
                  v-for="m in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']"
                  :key="m"
                  :value="m"
                >
                  {{ m }}
                </option>
              </select>
              <p v-if="!routerForm.method" class="mt-1 text-xs text-red-400">
                Please choose an HTTP method.
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <!-- Create Button -->
            <button
              v-if="!routerEditMode"
              :disabled="isCreateRouterDisabled"
              @click="saveRouter"
              :class="[
                'flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                createRouterClass,
              ]"
            >
              <Icon
                :icon="isCreating ? 'mdi:loading' : 'mdi:plus-box'"
                :class="['text-xl', { 'animate-spin': isCreating }]"
              />
              <span>{{ isCreating ? "Creating..." : "Create Router" }}</span>
            </button>

            <!-- Update Button -->
            <button
              v-if="routerEditMode"
              :disabled="isUpdateRouterDisabled || updatingId !== editRouterId"
              @click="saveRouter"
              :class="[
                'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                updateRouterClass,
              ]"
            >
              <Icon
                :icon="
                  isUpdating && updatingId === editRouterId
                    ? 'mdi:loading'
                    : 'mdi:content-save-edit'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isUpdating && updatingId === editRouterId },
                ]"
              />
              <span>
                {{
                  isUpdating && updatingId === editRouterId
                    ? "Updating..."
                    : "Update Router"
                }}
              </span>
            </button>

            <!-- Delete Button -->
            <button
              v-if="routerEditMode"
              :disabled="isDeleteRouterDisabled || deletingId !== editRouterId"
              @click="deleteRouter"
              :class="[
                'btn-gradient-red flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                deleteRouterClass,
              ]"
            >
              <Icon
                :icon="
                  isDeleting && deletingId === editRouterId
                    ? 'mdi:loading'
                    : 'mdi:delete'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isDeleting && deletingId === editRouterId },
                ]"
              />
              <span>
                {{
                  isDeleting && deletingId === editRouterId
                    ? "Deleting..."
                    : "Delete Router"
                }}
              </span>
            </button>
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
                  <h3 class="text-xl font-bold text-white">Routers List</h3>
                  <p class="text-sm text-gray-400">
                    View and manage application routers
                    <span
                      class="ml-2 text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full text-xs"
                    >
                      {{ routers.length }} active
                    </span>
                  </p>
                </div>
              </div>

              <!-- Search Box -->
              <div class="relative w-full sm:w-64">
                <input
                  v-model="quickFilterText"
                  placeholder="Search Routers..."
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
            <div ref="gridContainer" class="overflow-x-auto">
              <div v-if="delayedLoadingRouter" class="h-[500px]">
                <SkeletonTable />
              </div>

              <ag-grid-vue
                v-else
                class="ag-theme-material-futura h-[600px] w-full"
                :defaultColDef="defaultColDef"
                :columnDefs="columnDefs"
                :rowData="routers"
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
      </section>

      <!-- Permissions Tab -->
      <section v-if="activeTab === 'permissions'" class="space-y-6">
        <!-- Form Card -->
        <div
          class="bg-[#2E3A47] rounded-2xl p-6 border border-white/10 shadow-lg"
        >
          <!-- Header -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"
              >
                <Icon
                  :icon="
                    permEditMode
                      ? 'mdi:lock-check-outline'
                      : 'mdi:lock-plus-outline'
                  "
                  class="text-purple-400 text-2xl"
                />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ permEditMode ? "Edit Permission" : "New Permission" }}
                </h2>
                <p class="text-sm text-gray-400">
                  {{
                    permEditMode
                      ? "Modify an existing permission rule"
                      : "Define a new permission rule"
                  }}
                </p>
              </div>
            </div>

            <button
              @click="resetPermForm()"
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B4856] hover:bg-[#475769] rounded-xl border border-white/10 transition-all"
            >
              <Icon icon="mdi:autorenew" class="text-purple-400 text-lg" />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Resource -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Resource</label
              >
              <SearchableSelect
                v-model="permForm.resource"
                :options="menuOptions"
                label-key="label"
                value-key="permission_key"
                placeholder="Select a resource"
                class="bg-[#3B4856] border-white/10"
              />
            </div>

            <!-- Action -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Action</label
              >
              <SearchableSelect
                v-model="permForm.action"
                :options="actionOptions"
                label-key="label"
                value-key="value"
                placeholder="Select an action"
                class="bg-[#3B4856] border-white/10"
              />
            </div>

            <!-- Custom Resource -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Custom Resource</label
              >
              <input
                v-model="permForm.resource"
                type="text"
                placeholder="e.g. menu:settings:custom"
                class="w-full px-3 py-2 bg-[#3B4856] border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <!-- Create Button -->
            <button
              v-if="!permEditMode"
              :disabled="isCreatePermDisabled"
              @click="savePermission"
              :class="[
                'flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                createPermClass,
              ]"
            >
              <Icon
                :icon="isCreating ? 'mdi:loading' : 'mdi:plus-box'"
                :class="['text-xl', { 'animate-spin': isCreating }]"
              />
              <span>{{
                isCreating ? "Creating..." : "Create Permission"
              }}</span>
            </button>

            <!-- Update Button -->
            <button
              v-if="permEditMode"
              :disabled="isUpdatePermDisabled || updatingId !== editPermId"
              @click="savePermission"
              :class="[
                'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                updatePermClass,
              ]"
            >
              <Icon
                :icon="
                  isUpdating && updatingId === editPermId
                    ? 'mdi:loading'
                    : 'mdi:content-save-edit'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isUpdating && updatingId === editPermId },
                ]"
              />
              <span>
                {{
                  isUpdating && updatingId === editPermId
                    ? "Updating..."
                    : "Update Permission"
                }}
              </span>
            </button>

            <!-- Delete Button -->
            <button
              v-if="permEditMode"
              :disabled="isDeletePermDisabled || deletingId !== editPermId"
              @click="deletePermission"
              :class="[
                'btn-gradient-red flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                deletePermClass,
              ]"
            >
              <Icon
                :icon="
                  isDeleting && deletingId === editPermId
                    ? 'mdi:loading'
                    : 'mdi:delete'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isDeleting && deletingId === editPermId },
                ]"
              />
              <span>
                {{
                  isDeleting && deletingId === editPermId
                    ? "Deleting..."
                    : "Delete Permission"
                }}
              </span>
            </button>
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
                  class="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"
                >
                  <Icon icon="mdi:database" class="text-purple-400 text-2xl" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Permissions List</h3>
                  <p class="text-sm text-gray-400">
                    View and manage application permissions
                    <span
                      class="ml-2 text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full text-xs"
                    >
                      {{ permissions.length }} active
                    </span>
                  </p>
                </div>
              </div>

              <!-- Search Box -->
              <div class="relative w-full sm:w-64">
                <input
                  v-model="quickFilterTextPer"
                  placeholder="Search Permissions..."
                  class="w-full pl-4 pr-10 py-2 text-sm bg-[#3B4856] border border-white/10 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all"
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
            <div ref="gridContainerPer" class="overflow-x-auto">
              <div v-if="delayedLoadingPermission" class="h-[500px]">
                <SkeletonTable />
              </div>

              <ag-grid-vue
                v-else
                class="ag-theme-material-futura h-[600px] w-full"
                :defaultColDef="defaultColDefPer"
                :columnDefs="columnDefsPer"
                :rowData="permissions"
                :frameworkComponents="frameworkComponentsPer"
                :gridOptions="gridOptionsPer"
                :quickFilterText="quickFilterTextPer"
                @grid-ready="onGridReadyPer"
                @first-data-rendered="onFirstDataRenderedPer"
                :rowModelType="'clientSide'"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Bindings Tab -->
      <section v-if="activeTab === 'bindings'" class="space-y-6">
        <!-- Form Card -->
        <div
          class="bg-[#2E3A47] rounded-2xl p-6 border border-white/10 shadow-lg"
        >
          <!-- Header -->
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
          >
            <div class="flex items-center gap-3">
              <div
                class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
              >
                <Icon
                  :icon="bindEditMode ? 'mdi:link-edit' : 'mdi:link-plus'"
                  class="text-cyan-400 text-2xl"
                />
              </div>
              <div>
                <h2 class="text-xl font-bold text-white">
                  {{ bindEditMode ? "Edit Binding" : "New Binding" }}
                </h2>
                <p class="text-sm text-gray-400">
                  {{
                    bindEditMode
                      ? "Update router-permission relationship"
                      : "Create new binding between router and permission"
                  }}
                </p>
              </div>
            </div>

            <button
              @click="resetBindingForm()"
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3B4856] hover:bg-[#475769] rounded-xl border border-white/10 transition-all"
            >
              <Icon icon="mdi:autorenew" class="text-cyan-400 text-lg" />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Router -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Router</label
              >
              <SearchableSelect
                v-model="bindForm.router_id"
                :options="routerOptions"
                label-key="label"
                value-key="id"
                code-key="code"
                placeholder="Select router"
                class="bg-[#3B4856] border-white/10"
              />
            </div>

            <!-- Permission -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Permission</label
              >
              <SearchableSelect
                v-model="bindForm.permission_id"
                :options="permissionOptions"
                label-key="label"
                value-key="id"
                code-key="code"
                placeholder="Select permission"
                class="bg-[#3B4856] border-white/10"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mt-6">
            <!-- Create Button -->
            <button
              v-if="!bindEditMode"
              :disabled="isCreateBindDisabled"
              @click="saveBinding"
              :class="[
                'flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                createBindClass,
              ]"
            >
              <Icon
                :icon="isCreating ? 'mdi:loading' : 'mdi:plus-box'"
                :class="['text-xl', { 'animate-spin': isCreating }]"
              />
              <span>{{ isCreating ? "Creating..." : "Create Binding" }}</span>
            </button>

            <!-- Update Button -->
            <button
              v-if="bindEditMode"
              :disabled="isUpdateBindDisabled || updatingId !== editBindId"
              @click="saveBinding"
              :class="[
                'flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                updateBindClass,
              ]"
            >
              <Icon
                :icon="
                  isUpdating && updatingId === editBindId
                    ? 'mdi:loading'
                    : 'mdi:content-save-edit'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isUpdating && updatingId === editBindId },
                ]"
              />
              <span>
                {{
                  isUpdating && updatingId === editBindId
                    ? "Updating..."
                    : "Update Binding"
                }}
              </span>
            </button>

            <!-- Delete Button -->
            <button
              v-if="bindEditMode"
              :disabled="isDeleteBindDisabled || deletingId !== editBindId"
              @click="deleteBinding"
              :class="[
                'btn-gradient-red flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all',
                deleteBindClass,
              ]"
            >
              <Icon
                :icon="
                  isDeleting && deletingId === editBindId
                    ? 'mdi:loading'
                    : 'mdi:delete'
                "
                :class="[
                  'text-xl',
                  { 'animate-spin': isDeleting && deletingId === editBindId },
                ]"
              />
              <span>
                {{
                  isDeleting && deletingId === editBindId
                    ? "Deleting..."
                    : "Delete Binding"
                }}
              </span>
            </button>
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
                  class="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                >
                  <Icon icon="mdi:database" class="text-cyan-400 text-2xl" />
                </div>
                <div>
                  <h3 class="text-xl font-bold text-white">Bindings List</h3>
                  <p class="text-sm text-gray-400">
                    View and manage application bindings
                    <span
                      class="ml-2 text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full text-xs"
                    >
                      {{ bindings.length }} active
                    </span>
                  </p>
                </div>
              </div>

              <!-- Search Box -->
              <div class="relative w-full sm:w-64">
                <input
                  v-model="quickFilterTextBind"
                  placeholder="Search Bindings..."
                  class="w-full pl-4 pr-10 py-2 text-sm bg-[#3B4856] border border-white/10 rounded-lg focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
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
            <div ref="gridContainerBind" class="overflow-x-auto">
              <div v-if="delayedLoadingBinding" class="h-[500px]">
                <SkeletonTable />
              </div>

              <ag-grid-vue
                v-else
                class="ag-theme-material-futura h-[600px] w-full"
                :defaultColDef="defaultColDefBind"
                :columnDefs="columnDefsBind"
                :rowData="bindings"
                :frameworkComponents="frameworkComponentsBind"
                :gridOptions="gridOptionsBind"
                :quickFilterText="quickFilterTextBind"
                @grid-ready="onGridReadyBind"
                @first-data-rendered="onFirstDataRenderedBind"
                :rowModelType="'clientSide'"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AgGridVue } from "ag-grid-vue3";
import type { ColDef, GridApi, GridOptions } from "ag-grid-community";
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { usePermissionRouter } from "@/hooks/settings/usePermissionRouter";
import { useRouter } from "@/hooks/settings/useRouter";
import { useMenu } from "@/hooks/settings/useMenu";
import { Action } from "@/models/auth/user";
import { Icon } from "@iconify/vue";
import EditActionCell from "@/components/ui/EditActionCell.vue";
import { useAutoResizeGrid } from "@/composables/useAutoReSizeGrid";
import { showConfirmToast } from "@/utils/confirmToast";
import { setQuickFilterSafe } from "@/utils/agGrid";
import type {
  RouterCreate,
  RouterUpdate,
  PermissionCreate,
  PermissionUpdate,
  RouterPermissionCreate,
  RouterPermissionUpdate,
} from "@/models/settings/permissionRouter";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import { useActionDisabled } from "@/composables/useActionDisabled";
import SkeletonTable from "@/components/skeletons/SkeletonTable.vue";
import { useDelayedLoading } from "@/composables/useDelayedLoading";
import { usePermissionRouterRealtime } from "@/composables/settings/usePermissionRouterRealtime";

// Composable
const {
  routers,
  permissions,
  bindings,
  isLoadingRouters,
  isLoadingPermissions,
  isLoadingBindings,
  isCreating,
  isUpdating,
  isDeleting,
  updatingId,
  deletingId,
  fetchRouters,
  fetchPermissions,
  fetchBindings,
  createRouter: addRouter,
  updateRouter,
  deleteRouter: removeRouter,
  createPermission: addPermission,
  updatePermission,
  deletePermission: removePermission,
  createBinding: addBinding,
  updateBinding,
  deleteBinding: removeBinding,
} = usePermissionRouter();

usePermissionRouterRealtime();
//router
const { isDisabled: isCreateRouterDisabled, disabledClass: createRouterClass } =
  useActionDisabled(isCreating, isLoadingRouters);
const { isDisabled: isUpdateRouterDisabled, disabledClass: updateRouterClass } =
  useActionDisabled(isUpdating, isLoadingRouters);
const { isDisabled: isDeleteRouterDisabled, disabledClass: deleteRouterClass } =
  useActionDisabled(isDeleting, isLoadingRouters);

//permissions:
const { isDisabled: isCreatePermDisabled, disabledClass: createPermClass } =
  useActionDisabled(isCreating, isLoadingPermissions);
const { isDisabled: isUpdatePermDisabled, disabledClass: updatePermClass } =
  useActionDisabled(isUpdating, isLoadingPermissions);
const { isDisabled: isDeletePermDisabled, disabledClass: deletePermClass } =
  useActionDisabled(isDeleting, isLoadingPermissions);

//bindings:
const { isDisabled: isCreateBindDisabled, disabledClass: createBindClass } =
  useActionDisabled(isCreating, isLoadingBindings);
const { isDisabled: isUpdateBindDisabled, disabledClass: updateBindClass } =
  useActionDisabled(isUpdating, isLoadingBindings);
const { isDisabled: isDeleteBindDisabled, disabledClass: deleteBindClass } =
  useActionDisabled(isDeleting, isLoadingBindings);

const delayedLoadingRouter = useDelayedLoading(isLoadingRouters, 300);

const delayedLoadingPermission = useDelayedLoading(isLoadingPermissions, 300);

const delayedLoadingBinding = useDelayedLoading(isLoadingBindings, 300);

const { allMenus, loadMenus } = useMenu();
//Router
const routeKey = ref("");
const { fetchAvailableRoutes, availableRoutes } = useRouter();
const inputRef = ref<HTMLInputElement | null>(null);
const quickFilterText = ref("");

const columnDefs = ref<ColDef[]>([
  { headerName: "ID", field: "id", minWidth: 320 },
  { headerName: "Name", field: "name", minWidth: 400 },
  { headerName: "Path", field: "path", minWidth: 350 },
  { headerName: "Method", field: "method" },
  { headerName: "Domain", field: "Domain" },
  { headerName: "Time", field: "Time" },
  { headerName: "Ip", field: "Ip" },
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

const columnsToAutoSize = ["id", "name", "path", "method"];
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
    if (gridApi.value && !gridApi.value.isDestroyed?.()) {
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
    onEdit: handleEdit,
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

watch(routers, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApi.value, quickFilterText.value);
    resizeNow();
  });
});

watch(quickFilterText, (val) => {
  setQuickFilterSafe(gridApi.value, val);
});

onMounted(() => {
  fetchAvailableRoutes();
  loadMenus();
});

const casbinActions = Object.values(Action).filter(
  (v) => typeof v === "string"
);

const actionOptions = computed(() =>
  casbinActions.map((action) => ({
    label: action,
    value: action,
  }))
);

const menuOptions = computed(() =>
  Array.isArray(allMenus.value)
    ? allMenus.value.map((menu) => ({
        ...menu,
        label: `${menu.title}`,
      }))
    : []
);

const availableRouteOptions = computed(() =>
  availableRoutes.value.map((route) => ({
    key: `${route.method}:${route.path}`,
    label: `${route.method} ${route.path}`,
    method: route.method,
    path: route.path,
    name: route.name || "",
  }))
);
watch(routeKey, (val) => {
  const selected = availableRouteOptions.value.find((r) => r.key === val);
  if (selected) {
    routerForm.value.method = selected.method;
    routerForm.value.path = selected.path;
    routerForm.value.name = selected.name;
  }
});
const routerOptions = computed(() =>
  routers.value.map((r) => ({
    id: r.id,
    label: `${r.name} (${r.method} ${r.path})`,
    code: `${r.method}:${r.path}`,
  }))
);

// State
const activeTab = ref<"routers" | "permissions" | "bindings">("routers");

// Router form
const routerForm = ref<RouterCreate>({
  name: "",
  path: "",
  method: "",
  version: 0,
});
const routerEditMode = ref(false);
const editRouterId = ref<string | null>(null);

// Permission form
const permForm = ref<PermissionCreate>({
  resource: "",
  action: "",
  version: 0,
});
const permEditMode = ref(false);
const editPermId = ref<string | null>(null);

// Binding form
const bindForm = ref<RouterPermissionCreate>({
  router_id: "",
  permission_id: "",
  version: 0,
});
const bindEditMode = ref(false);
const editBindId = ref<string | null>(null);

// Lifecycle
onMounted(() => {
  fetchRouters();
  fetchPermissions();
  fetchBindings();
});

// Router handlers
async function saveRouter() {
  const response =
    routerEditMode.value && editRouterId.value !== null
      ? await updateRouter(editRouterId.value, routerForm.value as RouterUpdate)
      : await addRouter(routerForm.value);

  if (response.success) {
    resetRouterForm();
  }
}

async function handleEdit(r: {
  id: string;
  name: string;
  path: string;
  method: string;
  version: number;
}) {
  routerEditMode.value = true;
  editRouterId.value = r.id;
  routerForm.value = {
    name: r.name,
    path: r.path,
    method: r.method,
    version: r.version,
  };
}

async function deleteRouter() {
  if (editRouterId.value === null) return;
  const confirmed = await showConfirmToast();
  if (!confirmed) return;
  const response = await removeRouter(editRouterId.value);

  if (response.success) {
    resetRouterForm();
  }
}

function resetRouterForm() {
  routerForm.value = { name: "", path: "", method: "", version: 0 };
  routerEditMode.value = false;
  editRouterId.value = null;
  routeKey.value = "";
  nextTick(() => inputRef.value?.focus());
}

// Permission handlers

const inputRefPer = ref<HTMLInputElement | null>(null);
const quickFilterTextPer = ref("");

const columnDefsPer = ref<ColDef[]>([
  { headerName: "ID", field: "id", minWidth: 320 },
  { headerName: "Resource", field: "resource", minWidth: 350 },
  { headerName: "Action", field: "action", minWidth: 350 },
  { headerName: "Method", field: "method" },
  { headerName: "Domain", field: "Domain" },
  { headerName: "Time", field: "Time" },
  { headerName: "Ip", field: "Ip" },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponentsPer = { EditActionCell };
const gridApiPer = ref<GridApi | null>(null);
const gridContainerPer = ref<HTMLElement | null>(null);

const defaultColDefPer: ColDef = {
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  minWidth: 100,
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSizePer = ["id", "resource", "action", "method"];
const {
  onGridReady: onGridReadyPer,
  onFirstDataRendered: onFirstDataRenderedPer,
  resizeNow: resizeNowPer,
} = useAutoResizeGrid(gridApiPer, gridContainerPer, columnsToAutoSizePer);

const itemsPerPagePer = ref(10);
const currentPagePer = ref(1);

const gridOptionsPer = ref<GridOptions>({
  pagination: true,
  paginationPageSize: itemsPerPagePer.value,
  paginationPageSizeSelector: [5, 10, 20, 50],
  onPaginationChanged: () => {
    if (gridApiPer.value && !gridApiPer.value.isDestroyed?.()) {
      currentPagePer.value = gridApiPer.value.paginationGetCurrentPage() + 1;
      nextTick(resizeNowPer);
    }
  },
  domLayout: "normal",
  onGridReady: (params) => {
    gridApiPer.value = params.api;
    params.api.sizeColumnsToFit();
  },
  context: {
    onEdit: handleEditPer,
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

watch(permissions, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApiPer.value, quickFilterTextPer.value);
    resizeNowPer();
  });
});

watch(quickFilterTextPer, (val) => {
  setQuickFilterSafe(gridApiPer.value, val);
});

async function savePermission() {
  const response =
    permEditMode.value && editPermId.value !== null
      ? await updatePermission(
          editPermId.value,
          permForm.value as PermissionUpdate
        )
      : await addPermission(permForm.value);

  if (response.success) {
    resetPermForm();
  }
}

async function handleEditPer(p: {
  id: string;
  resource: string;
  action: string;
  version: number;
}) {
  permEditMode.value = true;
  editPermId.value = p.id;
  permForm.value = {
    resource: p.resource,
    action: p.action,
    version: p.version,
  };
}

async function deletePermission() {
  if (editPermId.value === null) return;
  const confirmed = await showConfirmToast();
  if (!confirmed) return;
  const response = await removePermission(editPermId.value);

  if (response.success) {
    resetPermForm();
  }
}

const permissionOptions = computed(() =>
  Array.isArray(permissions.value)
    ? permissions.value.map((p) => ({
        ...p,
        label: `${p.resource}:${p.action}`,
      }))
    : []
);

function resetPermForm() {
  permForm.value = { resource: "", action: "", version: 0 };
  permEditMode.value = false;
  editPermId.value = null;
  nextTick(() => inputRefPer.value?.focus());
}

// Binding handlers
const inputRefBind = ref<HTMLInputElement | null>(null);
const quickFilterTextBind = ref("");

const columnDefsBind = ref<ColDef[]>([
  { headerName: "ID", field: "id", minWidth: 320 },
  {
    headerName: "Router",
    field: "router",
    minWidth: 350,
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.name : "-";
    },
  },
  {
    headerName: "Path",
    field: "path",
    minWidth: 350,
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.path : "-";
    },
  },
  {
    headerName: "Permission",
    field: "permission",
    minWidth: 350,
    valueGetter: (params) => {
      const routerId = params.data.permission_id;
      const permission = permissions.value.find((m) => m.id === routerId);
      return permission ? `${permission.resource}:${permission.action}` : "-";
    },
  },
  {
    headerName: "Method",
    field: "method",
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.method : "-";
    },
  },
  { headerName: "Domain", field: "domain" },
  { headerName: "Time", field: "time" },
  { headerName: "Ip", field: "ip" },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponentsBind = { EditActionCell };
const gridApiBind = ref<GridApi | null>(null);
const gridContainerBind = ref<HTMLElement | null>(null);

const defaultColDefBind: ColDef = {
  sortable: true,
  filter: "agTextColumnFilter",
  flex: 1,
  minWidth: 100,
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSizeBind = ["id", "router", "path", "method", "permission"];
const {
  onGridReady: onGridReadyBind,
  onFirstDataRendered: onFirstDataRenderedBind,
  resizeNow: resizeNowBind,
} = useAutoResizeGrid(gridApiBind, gridContainerBind, columnsToAutoSizeBind);

const itemsPerPageBind = ref(10);
const currentPageBind = ref(1);

const gridOptionsBind = ref<GridOptions>({
  pagination: true,
  paginationPageSize: itemsPerPageBind.value,
  paginationPageSizeSelector: [5, 10, 20, 50],
  onPaginationChanged: () => {
    if (gridApiBind.value && !gridApiBind.value.isDestroyed?.()) {
      currentPageBind.value = gridApiBind.value.paginationGetCurrentPage() + 1;
      nextTick(resizeNowBind);
    }
  },
  domLayout: "normal",
  onGridReady: (params) => {
    gridApiBind.value = params.api;
    params.api.sizeColumnsToFit();
  },
  context: {
    onEdit: handleEditBind,
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

watch(permissions, () => {
  nextTick(() => {
    setQuickFilterSafe(gridApiBind.value, quickFilterTextBind.value);
    resizeNowBind();
  });
});

watch(quickFilterTextBind, (val) => {
  setQuickFilterSafe(gridApiBind.value, val);
});
async function saveBinding() {
  const response =
    bindEditMode.value && editBindId.value !== null
      ? await updateBinding(
          editBindId.value,
          bindForm.value as RouterPermissionUpdate
        )
      : await addBinding(bindForm.value);

  if (response.success) {
    resetBindingForm();
  }
}

async function handleEditBind(b: {
  id: string;
  router_id: string;
  permission_id: string;
  version: number;
}) {
  bindEditMode.value = true;
  editBindId.value = b.id;
  bindForm.value = {
    router_id: b.router_id,
    permission_id: b.permission_id,
    version: b.version,
  };
}

async function deleteBinding() {
  if (editBindId.value === null) return;
  const confirmed = await showConfirmToast();
  if (!confirmed) return;
  const response = await removeBinding(editBindId.value);

  if (response.success) {
    resetBindingForm();
  }
}

function resetBindingForm() {
  bindForm.value = { router_id: "", permission_id: "", version: 0 };
  bindEditMode.value = false;
  editBindId.value = null;
  nextTick(() => inputRefBind.value?.focus());
}
</script>

<style scoped>
table::-webkit-scrollbar {
  height: 6px;
}
table::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
```
