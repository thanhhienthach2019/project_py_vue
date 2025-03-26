<template>
    <div class="w-64 bg-white shadow-md h-full">
      <!-- Logo -->
      <div class="p-4">
        <h1 class="text-2xl font-bold text-[#3B82F6] flex items-center">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
          TailAdmin
        </h1>
      </div>
      <!-- Menu -->
      <nav class="mt-4">
        <h3 class="px-4 text-xs font-semibold text-[#A0AEC0] uppercase">Menu</h3>
        <ul>
          <li class="px-4 py-2 hover:bg-gray-100 text-[#A0AEC0] flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
            Dashboard
          </li>
          <li class="px-4 py-2 hover:bg-gray-100 text-[#A0AEC0] flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Calendar
          </li>
          <li class="px-4 py-2 bg-[#EBF8FF] text-[#3B82F6] flex flex-col">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              Tables
            </div>
            <ul class="ml-6 mt-1">
              <li class="py-1 text-[#3B82F6]">Basic Tables</li>
              <li class="py-1 text-[#A0AEC0]">Data Tables</li>
            </ul>
          </li>
        </ul>
        <h3 class="px-4 text-xs font-semibold text-[#A0AEC0] uppercase mt-4">Support</h3>
        <ul>
          <li class="px-4 py-2 hover:bg-gray-100 text-[#A0AEC0] flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4m-6 0h6"></path>
            </svg>
            Chat
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar'
  }
  </script>