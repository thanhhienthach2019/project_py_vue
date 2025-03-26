<template>
    <main class="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6 rounded-lg shadow m-6">
      <nav class="text-[#A0AEC0] mb-4">
        <span>Home</span> > <span class="font-bold">Data Tables</span>
      </nav>
      <h1 class="text-2xl font-bold text-[#1A202C] mb-4">Data Table 1</h1>
      <DataTable />
    </main>
  </template>
  
  <script>
  import DataTable from '@/components/ui/DataTable.vue'
  
  export default {
    name: 'MainContent',
    components: {
      DataTable
    }
  }
  </script>