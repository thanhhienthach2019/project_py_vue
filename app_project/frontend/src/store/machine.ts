import { defineStore } from "pinia";
import {
  getAllMachines,
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineById,
} from "@/services/machine";
import type { Machine } from "@/models/machine";

interface MachineState {
  machines: Machine[];
  selectedMachine: Machine | null;
}

export const useMachineStore = defineStore("machine", {
  state: (): MachineState => ({
    machines: [],
    selectedMachine: null,
  }),

  actions: {
    async fetchMachines() {
      try {
        const response = await getAllMachines();
        if (response.success && response.data) {
          this.machines = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while fetching machines: ", error);
      }
    },

    async fetchMachineById(machineId: number) {
      try {
        const response = await getMachineById(machineId);
        if (response.success && response.data) {
          this.selectedMachine = response.data;
        } else {
          console.error(response.message);
        }
      } catch (error) {
        console.error("An error occurred while retrieving the machine: ", error);
      }
    },

    async addMachine(machineData: Machine) {
      try {
        const response = await createMachine(machineData);
        if (response.success && response.data) {
          this.machines.push(response.data);
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while adding the machine: ", error);
        return { success: false, message: "An unexpected error occurred while adding the machine." };
      }
    },

    async editMachine(machineId: number, machineData: Machine) {
      try {
        const response = await updateMachine(machineId, machineData);
        if (response.success && response.data) {
          this.machines = this.machines.map((mc) =>
            mc.MachineID === machineId ? response.data! : mc
          );
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while updating the machine: ", error);
        return { success: false, message: "An unexpected error occurred while updating the machine." };
      }
    },

    async removeMachine(machineId: number) {
      try {
        const response = await deleteMachine(machineId);
        if (response.success) {
          this.machines = this.machines.filter((mc) => mc.MachineID !== machineId);
        } else {
          console.error(response.message);
        }
        return response;
      } catch (error) {
        console.error("An error occurred while deleting the machine: ", error);
        return { success: false, message: "An unexpected error occurred while deleting the machine." };
      }
    },
  },
});
