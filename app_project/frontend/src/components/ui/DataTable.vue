<template>
    <div>
      <div class="flex justify-between mb-4">
        <div>
          <label for="entries" class="mr-2 text-[#4A5568]">Show</label>
          <select id="entries" class="border border-[#E2E8F0] rounded px-2 py-1">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
          <span class="ml-2 text-[#4A5568]">entries</span>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            class="border border-[#E2E8F0] rounded px-4 py-2"
          />
        </div>
      </div>
      <table class="min-w-full bg-white">
        <thead class="bg-[#F7FAFC]">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">User</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">Position</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">Office</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">Age</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">Start date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-[#1A202C] uppercase tracking-wider">Salary</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr class="bg-white">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="">
                <div class="ml-4">
                  <div class="text-sm font-medium text-[#1A202C]">Abram Schiefler</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">Sales Assistant</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">Edinburgh</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">57</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">25 Apr, 2027</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">$89,500</td>
          </tr>
          <tr class="bg-[#F7FAFC]">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="">
                <div class="ml-4">
                  <div class="text-sm font-medium text-[#1A202C]">John Doe</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">Developer</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">London</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">45</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">11 May, 2027</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-[#4A5568]">$15,500</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataTable'
  }
  </script>