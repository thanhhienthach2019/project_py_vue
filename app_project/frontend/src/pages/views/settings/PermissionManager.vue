```html
<template>
  <div
    class="w-full max-w-12xl mx-auto p-2 my-2 space-y-6 transition-all duration-300"
  >
    <!-- Header -->
    <div
      class="bg-gradient-to-r from-indigo-600/40 via-purple-600/40 to-pink-500/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl ring-1 ring-white/20"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight">
            Router & Permission Management
          </h1>
          <p class="text-purple-200 mt-2 font-medium">
            Define routes, permissions and their bindings
          </p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div
      class="bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 shadow-xl"
    >
      <div class="flex space-x-4">
        <button @click="activeTab = 'routers'" :class="tabClass('routers')">
          Routers
        </button>
        <button
          @click="activeTab = 'permissions'"
          :class="tabClass('permissions')"
        >
          Permissions
        </button>
        <button @click="activeTab = 'bindings'" :class="tabClass('bindings')">
          Bindings
        </button>
      </div>
    </div>

    <!-- Content -->
    <div>
      <!-- Routers Tab -->
      <section v-if="activeTab === 'routers'" class="space-y-8">
        <!-- Form Container -->
        <div
          class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl"
        >
          <!-- Header + Reset -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 text-white">
              <Icon
                :icon="
                  routerEditMode
                    ? 'mdi:file-edit-outline'
                    : 'mdi:plus-box-outline'
                "
                class="text-3xl text-indigo-400"
              />
              <div>
                <h2 class="text-2xl font-semibold tracking-tight">
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
              class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20"
            >
              <Icon
                icon="mdi:autorenew"
                class="text-purple-400 text-xl group-hover:rotate-180 transition-transform"
              />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Router Name</label
              >
              <input
                v-model="routerForm.name"
                type="text"
                placeholder="Enter router name"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
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
              />
            </div>
            <!-- Method -->
            <div>
              <label
                class="block text-sm font-medium text-gray-300 mb-2"
                for="method"
              >
                Method
              </label>
              <select
                id="method"
                v-model="routerForm.method"
                required
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div class="flex flex-wrap gap-4 mt-6">
            <!-- Create Router -->
            <button
              v-permission.disable="'menu:settings:router:create'"
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

            <!-- Update -->
            <button
              v-permission.disable="'menu:settings:router:update'"
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

            <!-- Delete -->
            <button
              v-permission.disable="'menu:settings:router:delete'"
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
                    : 'mdi:account-remove'
                "
                :class="[
                  'text-lg',
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
                    Routers List Data
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    View and manage application routers
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm font-medium text-gray-400"
                      >Total Routers:</span
                    >
                    <span
                      class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                    >
                      {{ routers.length }} active
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right: search box -->
              <div class="relative w-72">
                <input
                  v-model="quickFilterText"
                  :disabled="isLoadingRouters"
                  placeholder="Search Routers..."
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
              v-if="delayedLoadingRouter"
              class="h-[600px] w-full flex items-start gap-2"
            >
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
      </section>

      <!-- Permissions Tab -->
      <section v-if="activeTab === 'permissions'" class="space-y-8">
        <!-- Form Section -->
        <div
          class="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 text-white">
              <Icon
                :icon="
                  permEditMode
                    ? 'mdi:lock-check-outline'
                    : 'mdi:lock-plus-outline'
                "
                class="text-3xl text-purple-400"
              />
              <div>
                <h2 class="text-2xl font-semibold tracking-tight">
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
              class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20"
            >
              <Icon
                icon="mdi:autorenew"
                class="text-purple-400 text-xl group-hover:rotate-180 transition-transform"
              />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Input Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Resource -->
            <div class="relative w-full">
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Resource</label
              >
              <SearchableSelect
                v-model="permForm.resource"
                :options="menuOptions"
                label-key="label"
                value-key="permission_key"
                placeholder="Select a resource"
              />
            </div>

            <!-- Action -->
            <div class="relative w-full">
              <label class="block text-sm font-medium text-gray-300 mb-2"
                >Action</label
              >
              <SearchableSelect
                v-model="permForm.action"
                :options="actionOptions"
                label-key="label"
                value-key="value"
                placeholder="Select an action"
              />
            </div>
          </div>
          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-300 mb-2"
              >Custom Resource</label
            >
            <input
              v-model="permForm.resource"
              type="text"
              placeholder="e.g. menu:settings:custom"
              class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white placeholder-gray-300"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 mt-6">
            <!-- Create -->
            <button
              v-permission.disable="'menu:settings:router:create'"
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

            <!-- Update -->
            <button
              v-permission.disable="'menu:settings:router:update'"
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
                    : "Update Router"
                }}
              </span>
            </button>

            <!-- Delete -->
            <button
              v-permission.disable="'menu:settings:router:delete'"
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
                    : 'mdi:account-remove'
                "
                :class="[
                  'text-lg',
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

        <!-- Table Section -->
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
                    Permissions List Data
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    View and manage application permissions
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm font-medium text-gray-400"
                      >Total Permissions:</span
                    >
                    <span
                      class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                    >
                      {{ permissions.length }} active
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right: search box -->
              <div class="relative w-72">
                <input
                  v-model="quickFilterTextPer"
                  :disabled="isLoadingPermissions"
                  placeholder="Search Permissions..."
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
            ref="gridContainerPer"
            class="grid-wrapper overflow-x-auto overflow-y-visible relative p-4 bg-gray-800 rounded-2xl shadow-xl border border-white/10 transition-all"
          >
            <div
              v-if="delayedLoadingPermission"
              class="h-[600px] w-full flex items-start gap-2"
            >
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
      </section>

      <!-- Bindings Tab -->
      <section v-if="activeTab === 'bindings'" class="space-y-8 relative">
        <!-- Form Section -->
        <div
          class="relative z-30 bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/15 shadow-xl"
        >
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3 text-white">
              <Icon
                :icon="bindEditMode ? 'mdi:link-edit' : 'mdi:link-plus'"
                class="text-3xl text-cyan-400"
              />
              <div>
                <h2 class="text-2xl font-semibold tracking-tight">
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
              class="group relative flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-gray-700/60 to-gray-800/60 rounded-xl border border-white/10 hover:bg-gray-700/80 hover:border-white/20"
            >
              <Icon
                icon="mdi:autorenew"
                class="text-purple-400 text-xl group-hover:rotate-180 transition-transform"
              />
              <span class="text-gray-100 font-medium">Reset Form</span>
            </button>
          </div>

          <!-- Form Inputs -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              />
            </div>

            <!-- Permission -->
            <div class="relative z-20">
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
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 mt-6">
            <button
              v-permission.disable="'menu:settings:router:create'"
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

            <button
              v-permission.disable="'menu:settings:router:update'"
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

            <button
              v-permission.disable="'menu:settings:router:delete'"
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
                    : 'mdi:account-remove'
                "
                :class="[
                  'text-lg',
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
        <!-- Table Section -->
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
                    Bindings List Data
                  </h3>
                  <p class="text-sm text-gray-400 mt-1">
                    View and manage application bindings
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="text-sm font-medium text-gray-400"
                      >Total Bindings:</span
                    >
                    <span
                      class="text-sm font-semibold text-green-300 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center"
                    >
                      {{ bindings.length }} active
                    </span>
                  </div>
                </div>
              </div>

              <!-- Right: search box -->
              <div class="relative w-72">
                <input
                  v-model="quickFilterTextBind"
                  :disabled="isLoadingBindings"
                  placeholder="Search Bindings..."
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
            ref="gridContainerBind"
            class="grid-wrapper overflow-x-auto overflow-y-visible relative p-4 bg-gray-800 rounded-2xl shadow-xl border border-white/10 transition-all"
          >
            <div
              v-if="delayedLoadingBinding"
              class="h-[600px] w-full flex items-start gap-2"
            >
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
  { headerName: "ID", field: "id", width: 80, minWidth: 80 },
  { headerName: "Name", field: "name", minWidth: 150 },
  { headerName: "Path", field: "path", minWidth: 150 },
  { headerName: "Method", field: "method", minWidth: 100, flex: 1 },
  { headerName: "Domain", field: "Domain", minWidth: 100, flex: 1 },
  { headerName: "Time", field: "Time", minWidth: 100, flex: 1 },
  { headerName: "Ip", field: "Ip", minWidth: 100, flex: 1 },
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

const columnsToAutoSize = ["name", "path"];
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
const routerForm = ref<RouterCreate>({ name: "", path: "", method: "" });
const routerEditMode = ref(false);
const editRouterId = ref<number | null>(null);

// Permission form
const permForm = ref<PermissionCreate>({ resource: "", action: "" });
const permEditMode = ref(false);
const editPermId = ref<number | null>(null);

// Binding form
const bindForm = ref<RouterPermissionCreate>({
  router_id: 0,
  permission_id: 0,
});
const bindEditMode = ref(false);
const editBindId = ref<number | null>(null);

// Lifecycle
onMounted(() => {
  fetchRouters();
  fetchPermissions();
  fetchBindings();
});

// Tab class
const tabClass = (tab: string) => {
  return [
    "px-4 py-2 rounded-lg font-medium transition",
    activeTab.value === tab
      ? "bg-indigo-600 text-white"
      : "text-gray-300 hover:bg-white/10",
  ];
};

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
  id: number;
  name: string;
  path: string;
  method: string;
}) {
  routerEditMode.value = true;
  editRouterId.value = r.id;
  routerForm.value = { name: r.name, path: r.path, method: r.method };
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
  routerForm.value = { name: "", path: "", method: "" };
  routerEditMode.value = false;
  editRouterId.value = null;
  routeKey.value = "";
  nextTick(() => inputRef.value?.focus());
}

// Permission handlers

const inputRefPer = ref<HTMLInputElement | null>(null);
const quickFilterTextPer = ref("");

const columnDefsPer = ref<ColDef[]>([
  { headerName: "ID", field: "id", width: 80, minWidth: 80 },
  { headerName: "Resource", field: "resource", minWidth: 150 },
  { headerName: "Action", field: "action", minWidth: 150 },
  { headerName: "Method", field: "method", minWidth: 100, flex: 1 },
  { headerName: "Domain", field: "Domain", minWidth: 100, flex: 1 },
  { headerName: "Time", field: "Time", minWidth: 100, flex: 1 },
  { headerName: "Ip", field: "Ip", minWidth: 100, flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    width: 100,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponentsPer = { EditActionCell };
const gridApiPer = ref<GridApi | null>(null);
const gridContainerPer = ref<HTMLElement | null>(null);

const defaultColDefPer: ColDef = {
  sortable: true,
  filter: "agTextColumnFilter",
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSizePer = ["resource", "action"];
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
  domLayout: "autoHeight",
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
  suppressHorizontalScroll: true,
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
  id: number;
  resource: string;
  action: string;
}) {
  permEditMode.value = true;
  editPermId.value = p.id;
  permForm.value = { resource: p.resource, action: p.action };
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
  permForm.value = { resource: "", action: "" };
  permEditMode.value = false;
  editPermId.value = null;
  nextTick(() => inputRefPer.value?.focus());
}

// Binding handlers
const inputRefBind = ref<HTMLInputElement | null>(null);
const quickFilterTextBind = ref("");

const columnDefsBind = ref<ColDef[]>([
  { headerName: "ID", field: "id", width: 80, minWidth: 80 },
  {
    headerName: "Router",
    field: "router",
    minWidth: 150,
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.name : "-";
    },
  },
  {
    headerName: "Path",
    field: "path",
    minWidth: 150,
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.path : "-";
    },
  },
  {
    headerName: "Method",
    field: "method",
    minWidth: 100,
    flex: 1,
    valueGetter: (params) => {
      const routerId = params.data.router_id;
      const router = routers.value.find((m) => m.id === routerId);
      return router ? router.method : "-";
    },
  },
  {
    headerName: "Permission",
    field: "permission",
    minWidth: 100,
    flex: 1,
    valueGetter: (params) => {
      const routerId = params.data.permission_id;
      const permission = permissions.value.find((m) => m.id === routerId);
      return permission ? `${permission.resource}:${permission.action}` : "-";
    },
  },
  { headerName: "Domain", field: "domain", minWidth: 100, flex: 1 },
  { headerName: "Time", field: "time", minWidth: 100, flex: 1 },
  { headerName: "Ip", field: "ip", minWidth: 100, flex: 1 },
  {
    headerName: "Actions",
    field: "actions",
    sortable: false,
    filter: false,
    width: 100,
    cellRenderer: EditActionCell,
  },
]);

const frameworkComponentsBind = { EditActionCell };
const gridApiBind = ref<GridApi | null>(null);
const gridContainerBind = ref<HTMLElement | null>(null);

const defaultColDefBind: ColDef = {
  sortable: true,
  filter: "agTextColumnFilter",
  valueFormatter: (params) => params.value || "-",
};

const columnsToAutoSizeBind = ["router", "path", "method", "permission"];
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
  domLayout: "autoHeight",
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
  suppressHorizontalScroll: true,
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
  id: number;
  router_id: number;
  permission_id: number;
}) {
  bindEditMode.value = true;
  editBindId.value = b.id;
  bindForm.value = { router_id: b.router_id, permission_id: b.permission_id };
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
  bindForm.value = { router_id: 0, permission_id: 0 };
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
