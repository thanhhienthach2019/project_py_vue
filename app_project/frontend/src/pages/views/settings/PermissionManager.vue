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
            <!-- Create -->
            <button
              v-permission.disable="'menu:settings:router:create'"
              v-if="!routerEditMode"
              @click="saveRouter"
              class="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:plus-box" class="text-xl" />
              Create Router
            </button>

            <!-- Update -->
            <button
              v-permission.disable="'menu:settings:router:update'"
              v-if="routerEditMode"
              @click="saveRouter"
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:content-save-edit" class="text-xl" />
              Update Router
            </button>

            <!-- Cancel -->
            <button
              v-if="routerEditMode"
              @click="resetRouterForm"
              class="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:cancel" class="text-xl" />
              Cancel
            </button>
          </div>
        </div>

        <!-- Table -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white">All Routers</h3>
            <div class="relative w-72">
              <input
                v-model="searchTextRouters"
                placeholder="Search Routers..."
                class="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Icon
                icon="mdi:magnify"
                class="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>
          <div
            class="overflow-x-auto bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 shadow-xl"
          >
            <table
              class="w-full text-left table-auto border-separate border-spacing-y-2"
            >
              <thead class="bg-[#1E2A38]">
                <tr>
                  <th class="px-4 py-2 text-gray-400">ID</th>
                  <th class="px-4 py-2 text-gray-400">Name</th>
                  <th class="px-4 py-2 text-gray-400">Path</th>
                  <th class="px-4 py-2 text-gray-400">Method</th>
                  <th class="px-4 py-2 text-right text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="r in paginatedRouters"
                  :key="r.id"
                  class="bg-[#1E2A38] hover:bg-[#27313f] transition-colors duration-200 rounded-lg"
                >
                  <td class="px-4 py-2 text-white">{{ r.id }}</td>
                  <td class="px-4 py-2 text-white">{{ r.name }}</td>
                  <td class="px-4 py-2 text-white">{{ r.path }}</td>
                  <td class="px-4 py-2 text-white">{{ r.method }}</td>
                  <td class="px-4 py-2 text-right">
                    <div class="flex justify-end items-center gap-2">
                      <button
                        v-permission.disable="'menu:settings:router:update'"
                        @click="editRouter(r)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:pencil" class="text-base" />
                        Edit
                      </button>
                      <button
                        v-permission.disable="'menu:settings:router:delete'"
                        @click="deleteRouter(r.id)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:delete" class="text-base" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="index in routerEmptyRowCount"
                  :key="'empty-router-' + index"
                  class="bg-[#1E2A38]"
                >
                  <td class="px-4 py-2" colspan="5">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="routerTotalPages > 1"
              class="flex justify-center items-center space-x-2 px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-800/30 via-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-b-2xl"
            >
              <!-- Prev -->
              <button
                @click="currentRouterPage--"
                :disabled="currentRouterPage === 1"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <Icon icon="mdi:chevron-left" class="text-lg" />
                <span class="ml-1 text-sm">Prev</span>
              </button>

              <template v-for="(page, idx) in routerPagesToShow" :key="idx">
                <span
                  v-if="page === '…'"
                  class="w-9 h-9 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
                <button
                  v-else
                  @click="currentRouterPage = page as number"
                  :class="[
                    'w-9 h-9 rounded-full text-sm font-semibold transition',
                    currentRouterPage === page
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Next -->
              <button
                @click="currentRouterPage++"
                :disabled="currentRouterPage === routerTotalPages"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <span class="mr-1 text-sm">Next</span>
                <Icon icon="mdi:chevron-right" class="text-lg" />
              </button>
            </div>
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
              @click="savePermission"
              class="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:plus-box" class="text-xl" />
              Create Permission
            </button>

            <!-- Update -->
            <button
              v-permission.disable="'menu:settings:router:update'"
              v-if="permEditMode"
              @click="savePermission"
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:content-save-edit" class="text-xl" />
              Update Permission
            </button>

            <!-- Cancel -->
            <button
              v-if="permEditMode"
              @click="resetPermForm"
              class="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:cancel" class="text-xl" />
              Cancel
            </button>
          </div>
        </div>

        <!-- Table Section -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white">All Permissions</h3>
            <div class="relative w-72">
              <input
                v-model="searchTextPermission"
                placeholder="Search Permissions..."
                class="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Icon
                icon="mdi:magnify"
                class="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>
          <div
            class="overflow-x-auto bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 shadow-xl"
          >
            <table
              class="w-full text-left table-auto border-separate border-spacing-y-2"
            >
              <thead class="bg-[#1E2A38]">
                <tr>
                  <th class="px-4 py-2 text-gray-400">ID</th>
                  <th class="px-4 py-2 text-gray-400">Resource</th>
                  <th class="px-4 py-2 text-gray-400">Action</th>
                  <th class="px-4 py-2 text-right text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in paginatedPermissions"
                  :key="p.id"
                  class="bg-[#1E2A38] hover:bg-[#27313f] transition-colors duration-200"
                >
                  <td class="px-4 py-2 text-white">{{ p.id }}</td>
                  <td class="px-4 py-2 text-white">{{ p.resource }}</td>
                  <td class="px-4 py-2 text-white">{{ p.action }}</td>
                  <td class="px-4 py-2 text-right">
                    <div class="flex justify-end items-center gap-2">
                      <button
                        v-permission.disable="'menu:settings:router:update'"
                        @click="editPermission(p)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:pencil" class="text-base" />
                        Edit
                      </button>
                      <button
                        v-permission.disable="'menu:settings:router:delete'"
                        @click="deletePermission(p.id)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:delete" class="text-base" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="index in permissionEmptyRowCount"
                  :key="'empty-row-' + index"
                  class="bg-[#1E2A38]"
                >
                  <td class="px-4 py-2" colspan="4">&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <div
              v-if="permissionTotalPages > 1"
              class="flex justify-center items-center space-x-2 px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-800/30 via-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-b-2xl"
            >
              <!-- Prev -->
              <button
                @click="currentPermissionPage--"
                :disabled="currentPermissionPage === 1"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <Icon icon="mdi:chevron-left" class="text-lg" />
                <span class="ml-1 text-sm">Prev</span>
              </button>

              <!-- Page numbers -->
              <template v-for="(page, idx) in permissionPagesToShow" :key="idx">
                <span
                  v-if="page === '...'"
                  class="w-9 h-9 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
                <button
                  v-else
                  @click="currentPermissionPage = page as number"
                  :class="[
                    'w-9 h-9 rounded-full text-sm font-semibold transition',
                    currentPermissionPage === page
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Next -->
              <button
                @click="currentPermissionPage++"
                :disabled="currentPermissionPage === permissionTotalPages"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <span class="mr-1 text-sm">Next</span>
                <Icon icon="mdi:chevron-right" class="text-lg" />
              </button>
            </div>
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
              <select
                v-model.number="bindForm.router_id"
                class="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-lg text-white"
              >
                <option class="bg-gray-800 text-gray-200" disabled value="0">
                  Select Router
                </option>
                <option
                  class="bg-gray-800 text-gray-200"
                  v-for="r in routers"
                  :key="r.id"
                  :value="r.id"
                >
                  {{ r.name }}
                </option>
              </select>
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
              @click="saveBinding"
              class="flex items-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:link-plus" class="text-xl" />
              Create Binding
            </button>

            <button
              v-permission.disable="'menu:settings:router:update'"
              v-if="bindEditMode"
              @click="saveBinding"
              class="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:link-edit" class="text-xl" />
              Update Binding
            </button>

            <button
              v-if="bindEditMode"
              @click="resetBindingForm"
              class="flex items-center gap-2 bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded-xl text-white font-semibold transition-all"
            >
              <Icon icon="mdi:cancel" class="text-xl" />
              Cancel
            </button>
          </div>
        </div>
        <!-- Table Section -->
        <div>
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white">All Bindings</h3>
            <div class="w-72">
              <input
                v-model="searchTextBinding"
                placeholder="Search Bindings..."
                class="w-full pl-4 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Icon
                icon="mdi:magnify"
                class="absolute right-3 top-3 text-gray-400"
              />
            </div>
          </div>

          <div
            class="overflow-x-visible bg-white/5 backdrop-blur-2xl rounded-2xl p-4 border border-white/15 shadow-xl relative z-0"
          >
            <table
              class="w-full text-left table-auto border-separate border-spacing-y-2"
            >
              <thead class="bg-[#1E2A38]">
                <tr>
                  <th class="px-4 py-2 text-gray-400">ID</th>
                  <th class="px-4 py-2 text-gray-400">Router</th>
                  <th class="px-4 py-2 text-gray-400">Path</th>
                  <th class="px-4 py-2 text-gray-400">Method</th>
                  <th class="px-4 py-2 text-gray-400">Permission</th>
                  <th class="px-4 py-2 text-right text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="b in paginatedBindings"
                  :key="b.id"
                  class="bg-[#1E2A38] hover:bg-[#27313f] transition-colors duration-200"
                >
                  <td class="px-4 py-2 text-white">{{ b.id }}</td>
                  <td class="px-4 py-2 text-white">
                    {{ findRouterName(b.router_id) }}
                  </td>
                  <td class="px-4 py-2 text-white">
                    {{ findRouterPath(b.router_id) }}
                  </td>
                  <td class="px-4 py-2 text-white">
                    {{ findRouterMethod(b.router_id) }}
                  </td>
                  <td class="px-4 py-2 text-white">
                    {{ findPermissionLabel(b.permission_id) }}
                  </td>
                  <td class="px-4 py-2 text-right">
                    <div class="flex justify-end items-center gap-2">
                      <button
                        v-permission.disable="'menu:settings:router:update'"
                        @click="editBinding(b)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:pencil" class="text-base" />
                        Edit
                      </button>
                      <button
                        v-permission.disable="'menu:settings:router:delete'"
                        @click="deleteBinding(b.id)"
                        class="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium shadow-sm transition"
                      >
                        <Icon icon="mdi:delete" class="text-base" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="index in bindingEmptyRowCount"
                  :key="'empty-binding-' + index"
                  class="bg-[#1E2A38]"
                >
                  <td class="px-4 py-2" colspan="6">&nbsp;</td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination -->
            <div
              v-if="bindingTotalPages > 1"
              class="flex justify-center items-center space-x-2 px-6 py-4 border-t border-white/10 bg-gradient-to-r from-gray-800/30 via-gray-900/30 to-gray-800/30 backdrop-blur-lg rounded-b-2xl"
            >
              <!-- Prev -->
              <button
                @click="currentBindingPage--"
                :disabled="currentBindingPage === 1"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <Icon icon="mdi:chevron-left" class="text-lg" />
                <span class="ml-1 text-sm">Prev</span>
              </button>

              <!-- Pages -->
              <template v-for="(page, idx) in bindingPagesToShow" :key="idx">
                <span
                  v-if="page === '…'"
                  class="w-9 h-9 flex items-center justify-center text-gray-400"
                >
                  ...
                </span>
                <button
                  v-else
                  @click="currentBindingPage = page as number"
                  :class="[
                    'w-9 h-9 rounded-full text-sm font-semibold transition',
                    currentBindingPage === page
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white',
                  ]"
                >
                  {{ page }}
                </button>
              </template>

              <!-- Next -->
              <button
                @click="currentBindingPage++"
                :disabled="currentBindingPage === bindingTotalPages"
                class="px-3 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center"
              >
                <span class="mr-1 text-sm">Next</span>
                <Icon icon="mdi:chevron-right" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, inject, type Ref, computed, watch } from "vue";
import ToastTailwind from "@/pages/Toast/ToastTailwind.vue";
import { usePermissionRouter } from "@/hooks/settings/usePermissionRouter";
import { useRouter } from "@/hooks/settings/useRouter";
import { useMenu } from "@/hooks/settings/useMenu";
import { Action } from "@/models/auth/user";
import { Icon } from "@iconify/vue";
import type {
  RouterCreate,
  RouterUpdate,
  PermissionCreate,
  PermissionUpdate,
  RouterPermissionCreate,
  RouterPermissionUpdate,
} from "@/models/settings/permissionRouter";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";

// Composable
const {
  fetchRouters,
  fetchPermissions,
  fetchBindings,
  addRouter,
  updateRouter,
  removeRouter,
  addPermission,
  updatePermission,
  removePermission,
  addBinding,
  updateBinding,
  removeBinding,
  routers,
  permissions,
  bindings,
} = usePermissionRouter();

const toast = inject<Ref<InstanceType<typeof ToastTailwind>>>("toast")!;
const { allMenus, fetchAllMenus } = useMenu();
//Router
const routeKey = ref("");
const { fetchAvailableRoutes, availableRoutes } = useRouter();

onMounted(() => {
  fetchAvailableRoutes();
  fetchAllMenus();
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
    toast?.value?.showToast(response.message, "success");
    resetRouterForm();
    fetchRouters();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}

function editRouter(r: {
  id: number;
  name: string;
  path: string;
  method: string;
}) {
  routerEditMode.value = true;
  editRouterId.value = r.id;
  routerForm.value = { name: r.name, path: r.path, method: r.method };
}

async function deleteRouter(id: number) {
  const response = await removeRouter(id);

  if (response.success) {
    toast?.value?.showToast(response.message, "success");
    fetchRouters();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}

function resetRouterForm() {
  routerForm.value = { name: "", path: "", method: "" };
  routerEditMode.value = false;
  editRouterId.value = null;
  routeKey.value = "";
}
const searchTextRouters = ref("");
const currentRouterPage = ref(1);
const routerPageSize = ref(5);

const filteredRouters = computed(() => {
  const keyword = searchTextRouters.value.toLowerCase().trim();
  return routers.value.filter((r) =>
    [r.name, r.path].some((field) => field.toLowerCase().includes(keyword))
  );
});

watch(searchTextRouters, () => {
  currentRouterPage.value = 1;
});

watch(filteredRouters, () => {
  const total = routerTotalPages.value;
  if (currentRouterPage.value > total) {
    currentRouterPage.value = total || 1;
  }
});

const paginatedRouters = computed(() => {
  const start = (currentRouterPage.value - 1) * routerPageSize.value;
  return filteredRouters.value.slice(start, start + routerPageSize.value);
});

const routerTotalPages = computed(() => {
  return Math.ceil(filteredRouters.value.length / routerPageSize.value);
});

const routerEmptyRowCount = computed(() => {
  return routerPageSize.value - paginatedRouters.value.length;
});

const routerPagesToShow = computed(() => {
  const total = routerTotalPages.value;
  const current = currentRouterPage.value;
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (
      last !== undefined &&
      typeof page === "number" &&
      typeof last === "number"
    ) {
      if (page - last === 2) rangeWithDots.push(last + 1);
      else if (page - last > 2) rangeWithDots.push("…");
    }
    rangeWithDots.push(page);
    last = page as number;
  }

  return rangeWithDots;
});

// Permission handlers
async function savePermission() {
  const response =
    permEditMode.value && editPermId.value !== null
      ? await updatePermission(
          editPermId.value,
          permForm.value as PermissionUpdate
        )
      : await addPermission(permForm.value);

  if (response.success) {
    toast?.value?.showToast(response.message, "success");
    resetPermForm();
    fetchPermissions();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}

function editPermission(p: { id: number; resource: string; action: string }) {
  permEditMode.value = true;
  editPermId.value = p.id;
  permForm.value = { resource: p.resource, action: p.action };
}

async function deletePermission(id: number) {
  const response = await removePermission(id);

  if (response.success) {
    toast?.value?.showToast(response.message, "success");
    fetchPermissions();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}
const searchTextPermission = ref("");
const currentPermissionPage = ref(1);
const permissionPageSize = ref(5);

const filteredPermissions = computed(() => {
  const keyword = searchTextPermission.value.toLowerCase().trim();
  return permissions.value.filter((p) =>
    [p.resource, p.action].some((field) =>
      field.toLowerCase().includes(keyword)
    )
  );
});

const permissionOptions = computed(() =>
  Array.isArray(permissions.value)
    ? permissions.value.map((p) => ({
        ...p,
        label: `${p.resource}:${p.action}`,
      }))
    : []
);

const paginatedPermissions = computed(() => {
  const start = (currentPermissionPage.value - 1) * permissionPageSize.value;
  return filteredPermissions.value.slice(
    start,
    start + permissionPageSize.value
  );
});

watch(searchTextPermission, () => {
  currentPermissionPage.value = 1;
});

watch(filteredPermissions, () => {
  const total = permissionTotalPages.value;
  if (currentPermissionPage.value > total) {
    currentPermissionPage.value = total || 1;
  }
});

const permissionTotalPages = computed(() => {
  return Math.ceil(filteredPermissions.value.length / permissionPageSize.value);
});

const permissionEmptyRowCount = computed(() => {
  return permissionPageSize.value - paginatedPermissions.value.length;
});

const permissionPagesToShow = computed(() => {
  const total = permissionTotalPages.value;
  const current = currentPermissionPage.value;
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (
      last !== undefined &&
      typeof page === "number" &&
      typeof last === "number"
    ) {
      if (page - last === 2) {
        rangeWithDots.push(last + 1);
      } else if (page - last > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(page);
    last = page as number;
  }

  return rangeWithDots;
});

function resetPermForm() {
  permForm.value = { resource: "", action: "" };
  permEditMode.value = false;
  editPermId.value = null;
}

// Binding handlers
async function saveBinding() {
  const response =
    bindEditMode.value && editBindId.value !== null
      ? await updateBinding(
          editBindId.value,
          bindForm.value as RouterPermissionUpdate
        )
      : await addBinding(bindForm.value);

  if (response.success) {
    toast?.value?.showToast(response.message, "success");
    resetBindingForm();
    fetchBindings();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}

function editBinding(b: {
  id: number;
  router_id: number;
  permission_id: number;
}) {
  bindEditMode.value = true;
  editBindId.value = b.id;
  bindForm.value = { router_id: b.router_id, permission_id: b.permission_id };
}

async function deleteBinding(id: number) {
  const response = await removeBinding(id);

  if (response.success) {
    toast?.value?.showToast(response.message, "success");
    fetchBindings();
  } else {
    toast?.value?.showToast(response.message, "error");
  }
}
// Helpers
const findRouterName = (id: number) =>
  routers.value.find((r) => r.id === id)?.name || "-";
const findRouterPath = (id: number) =>
  routers.value.find((r) => r.id === id)?.path || "-";
const findRouterMethod = (id: number) =>
  routers.value.find((r) => r.id === id)?.method || "-";
const findPermissionLabel = (id: number) => {
  const p = permissions.value.find((p) => p.id === id);
  return p ? `${p.resource}:${p.action}` : "-";
};

function resetBindingForm() {
  bindForm.value = { router_id: 0, permission_id: 0 };
  bindEditMode.value = false;
  editBindId.value = null;
}
const searchTextBinding = ref("");
const currentBindingPage = ref(1);
const bindingPageSize = ref(5);

const filteredBindings = computed(() => {
  const keyword = searchTextBinding.value.toLowerCase().trim();
  return bindings.value.filter((b) => {
    const routerName = findRouterName(b.router_id).toLowerCase();
    const permissionLabel = findPermissionLabel(b.permission_id).toLowerCase();
    return routerName.includes(keyword) || permissionLabel.includes(keyword);
  });
});

watch(searchTextBinding, () => {
  currentBindingPage.value = 1;
});

watch(filteredBindings, () => {
  const total = bindingTotalPages.value;
  if (currentBindingPage.value > total) {
    currentBindingPage.value = total || 1;
  }
});

const paginatedBindings = computed(() => {
  const start = (currentBindingPage.value - 1) * bindingPageSize.value;
  return filteredBindings.value.slice(start, start + bindingPageSize.value);
});

const bindingTotalPages = computed(() => {
  return Math.ceil(filteredBindings.value.length / bindingPageSize.value);
});

const bindingEmptyRowCount = computed(() => {
  return bindingPageSize.value - paginatedBindings.value.length;
});

const bindingPagesToShow = computed(() => {
  const total = bindingTotalPages.value;
  const current = currentBindingPage.value;
  const delta = 1;
  const range: (number | string)[] = [];
  const rangeWithDots: (number | string)[] = [];
  let last: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const page of range) {
    if (
      last !== undefined &&
      typeof page === "number" &&
      typeof last === "number"
    ) {
      if (page - last === 2) rangeWithDots.push(last + 1);
      else if (page - last > 2) rangeWithDots.push("…");
    }
    rangeWithDots.push(page);
    last = page as number;
  }

  return rangeWithDots;
});
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
