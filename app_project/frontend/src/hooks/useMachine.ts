// src/hooks/useMachine.ts

import { computed } from "vue";
import { useMachineStore } from "@/store/machine";
import type { Machine } from "@/models/machine";

export function useMachine() {
  const machineStore = useMachineStore();

  // Fetch all machines
  const fetchMachines = async () => {
    try {
      await machineStore.fetchMachines();
    } catch (error) {
      console.error("Failed to fetch machines:", error);
    }
  };

  // Fetch a machine by ID
  const fetchMachineById = async (machineId: number) => {
    try {
      await machineStore.fetchMachineById(machineId);
    } catch (error) {
      console.error("Failed to fetch machine by ID:", error);
    }
  };

  // Add a new machine
  const addMachine = async (machineData: Machine) => {
    try {
      const response = await machineStore.addMachine(machineData);
      return response;
    } catch (error) {
      console.error("Failed to add machine:", error);
      return { success: false, message: "An error occurred while adding the machine." };
    }
  };

  // Edit an existing machine
  const editMachine = async (machineId: number, machineData: Machine) => {
    try {
      const response = await machineStore.editMachine(machineId, machineData);
      return response;
    } catch (error) {
      console.error("Failed to update machine:", error);
      return { success: false, message: "An error occurred while updating the machine." };
    }
  };

  // Remove a machine
  const removeMachine = async (machineId: number) => {
    try {
      // Find the machine to be deleted (to get the name or other info)
      const deletedItem = machineStore.machines.find(
        (m) => m.MachineID === machineId
      );
  
      // Call the store action to delete the machine
      const response = await machineStore.removeMachine(machineId);
      
      if (response.success) {
        // If deletion is successful, return additional info (e.g., name)
        return { ...response, deletedMachineName: deletedItem?.Name };
      }
  
      return response;
    } catch (error) {
      console.error("Failed to delete machine:", error);
      return { success: false, message: "An error occurred while deleting the machine." };
    }
  };
  

  return {
    fetchMachines,
    fetchMachineById,
    addMachine,
    editMachine,
    removeMachine,
    machines: computed(() => machineStore.machines || []),
    selectedMachine: computed(() => machineStore.selectedMachine || null),
  };
}
