<script setup>
    import { Icon } from "@iconify/vue";
</script>

<template>
 <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Card 1 -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <Icon icon="mdi:account-group" class="text-blue-400 text-5xl" />
        <div>
          <h3 class="text-xl font-semibold">Người dùng</h3>
          <p class="text-gray-400">1.250 người</p>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <Icon icon="mdi:currency-usd" class="text-green-400 text-5xl" />
        <div>
          <h3 class="text-xl font-semibold">Doanh thu</h3>
          <p class="text-gray-400">$ 75.300</p>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
        <Icon icon="mdi:cart" class="text-yellow-400 text-5xl" />
        <div>
          <h3 class="text-xl font-semibold">Đơn hàng</h3>
          <p class="text-gray-400">325 đơn</p>
        </div>
      </div>
    </div>
</template>