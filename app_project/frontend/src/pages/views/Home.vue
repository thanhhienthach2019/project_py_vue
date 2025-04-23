<template>
  <!-- Welcome Card -->
  <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/10 hover:shadow-lg transition-all duration-300">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white mb-1">
          Welcome back, <span class="text-blue-400">Admin</span>!
        </h1>
        <p class="text-gray-400">Here's your dashboard overview for today</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-3">
        <div class="bg-blue-400/10 px-4 py-2 rounded-lg flex items-center border border-blue-400/20">
          <Icon icon="mdi:calendar" class="text-blue-400 mr-2" />
          <span>{{ today }}</span>
        </div>
        <button
          @click="refresh"
          class="bg-blue-400/10 px-4 py-2 rounded-lg flex items-center border border-blue-400/20 hover:bg-blue-400/20 transition"
        >
          <Icon icon="mdi:refresh" class="text-blue-400 mr-2" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <DashboardStatCard
      icon="mdi:package-variant"
      title="Total Materials"
      value="1,248"
      trend="up"
      trendValue="12%"
      color="blue"
    />
    <DashboardStatCard
      icon="mdi:clipboard-text"
      title="Pending Requests"
      value="24"
      trend="neutral"
      trendValue="5 new"
      color="purple"
    />
    <DashboardStatCard
      icon="mdi:alert-circle"
      title="Low Stock"
      value="18"
      trend="down"
      trendValue="3 critical"
      color="orange"
    />
    <DashboardStatCard
      icon="mdi:history"
      title="Today's Activity"
      value="42"
      trend="up"
      trendValue="8 active"
      color="green"
    />
  </div>

  <!-- Two Column Layout -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Recent Activity -->
    <div class="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-white flex items-center">
          <Icon icon="mdi:clock-outline" class="text-blue-400 mr-2" />
          Recent Activity
        </h2>
        <button class="text-blue-400 text-sm hover:text-blue-300 transition flex items-center">
          View All
          <Icon icon="mdi:chevron-right" class="ml-1" />
        </button>
      </div>
      <div class="space-y-4">
        <ActivityItem
          v-for="(item, i) in activities"
          :key="i"
          v-bind="item"
        />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center">
        <Icon icon="mdi:lightning-bolt" class="text-purple-400 mr-2" />
        Quick Actions
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="(action, i) in quickActions"
          :key="i"
          class="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-400/50 transition-all flex flex-col items-center justify-center group hover:bg-white/10"
        >
          <div class="bg-blue-400/10 p-3 rounded-full mb-2 group-hover:bg-blue-400/20 transition-all">
            <Icon :icon="action.icon" class="text-xl text-blue-400" />
          </div>
          <span class="text-white text-sm text-center">{{ action.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import DashboardStatCard from '@/components/ui/DashboardStatCard.vue';
import ActivityItem from '@/components/ui/ActivityItem.vue';

// Ngày hôm nay
const today = new Date().toLocaleDateString();

// Reload page
const refresh = () => {
  window.location.reload();
};

const activities = [
  {
    icon: 'mdi:package-variant-closed',
    title: 'New Material Added',
    description: 'Steel beams (50 units) added to inventory',
    time: '10 minutes ago',
    color: 'blue',
  },
  {
    icon: 'mdi:clipboard-check',
    title: 'Request Approved',
    description: 'Request #2456 approved by Manager',
    time: '1 hour ago',
    color: 'green',
  },
  {
    icon: 'mdi:truck-delivery',
    title: 'Delivery Received',
    description: 'Order #7890 delivered from Supplier',
    time: '3 hours ago',
    color: 'purple',
  },
];

const quickActions = [
  { icon: 'mdi:plus-circle', label: 'Add Material' },
  { icon: 'mdi:clipboard-text', label: 'New Request' },
  { icon: 'mdi:file-export', label: 'Generate Report' },
  { icon: 'mdi:account-group', label: 'Manage Users' },
];
</script>
