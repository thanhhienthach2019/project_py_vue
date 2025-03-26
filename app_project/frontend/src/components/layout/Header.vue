<template>
    <header class="bg-[#1A202C] text-white p-4 flex justify-between items-center">
      <div class="flex items-center">
        <input
          type="text"
          placeholder="Search or type command..."
          class="bg-[#2D3748] text-white rounded-full px-4 py-2 focus:outline-none"
        />
      </div>
      <div class="flex items-center space-x-4">
        <button class="text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        </button>
        <button class="text-white relative">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <span class="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">2</span>
        </button>
        <div class="flex items-center">
          <img src="https://via.placeholder.com/32" alt="User" class="h-8 w-8 rounded-full">
          <span class="ml-2">Musharof</span>
          <button class="ml-2 text-white">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
        <button class="bg-[#3182CE] px-4 py-2 rounded text-white">Verify it's you</button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'Header'
  }
  </script>