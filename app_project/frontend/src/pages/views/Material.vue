<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useMaterial } from "@/hooks/useMaterial";
import { Icon } from "@iconify/vue";
import { ElMessage, ElMessageBox } from "element-plus";

// Import component vue3-easy-data-table và CSS của nó
import DataTable from "vue3-easy-data-table/dist/DataTable.vue";
import "vue3-easy-data-table/dist/style.css";

// Định nghĩa kiểu cho Material (bạn có thể sử dụng interface có sẵn từ model nếu đã export)
interface Material {
  MaterialID: number;
  MaterialCode: string;
  MaterialName: string;
  Unit: string;
  Description: string;
  ImageUrl: string;
  Model: string;
  Origin: string;
}

const {
  fetchMaterials,
  fetchMaterialById,
  addMaterial,
  editMaterial,
  removeMaterial,
  materials,
} = useMaterial();

const isDialogVisible = ref(false);
const isEditing = ref(false);
const materialForm = ref<Material>({
  MaterialID: 0,
  MaterialCode: "",
  MaterialName: "",
  Unit: "",
  Description: "",
  ImageUrl: "",
  Model: "",
  Origin: "",
});
const selectedMaterialId = ref<number | null>(null);

onMounted(() => {
  fetchMaterials();
});

const openDialog = (material: Material | null = null) => {
  isDialogVisible.value = true;
  if (material) {
    isEditing.value = true;
    selectedMaterialId.value = material.MaterialID;
    materialForm.value = { ...material };
  } else {
    isEditing.value = false;
    selectedMaterialId.value = null;
    materialForm.value = {
      MaterialID: 0,
      MaterialCode: "",
      MaterialName: "",
      Unit: "",
      Description: "",
      ImageUrl: "",
      Model: "",
      Origin: "",
    };
  }
};

const saveMaterial = async () => {
  if (isEditing.value && selectedMaterialId.value !== null) {
    await editMaterial(selectedMaterialId.value, materialForm.value);
    ElMessage.success("Vật tư đã được cập nhật!");
  } else {
    await addMaterial(materialForm.value);
    ElMessage.success("Vật tư đã được thêm mới!");
  }
  isDialogVisible.value = false;
  fetchMaterials();
};

const confirmDelete = async (materialId: number) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn xóa vật tư này?", "Xác nhận", {
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    type: "warning",
  })
    .then(async () => {
      await removeMaterial(materialId);
      ElMessage.success("Vật tư đã được xóa!");
      fetchMaterials();
    })
    .catch(() => {
      ElMessage.info("Hủy xóa");
    });
};
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white">Quản lý vật tư</h1>
    <button @click="openDialog()" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
      <Icon icon="mdi:plus" class="mr-2" /> Thêm vật tư
    </button>

    <!-- Sử dụng tên component đã import -->
    <DataTable 
  :headers="[
    { text: 'Mã', value: 'MaterialCode' },
    { text: 'Tên', value: 'MaterialName' },
    { text: 'Thao tác', value: 'actions' }
  ]" 
  :items="materials"
>
  <template #item-actions="{ item }">
    <button @click="openDialog(item)" class="text-yellow-500 hover:text-yellow-700">
      <Icon icon="mdi:pencil" class="text-xl" />
    </button>
    <button @click="confirmDelete(item.MaterialID)" class="text-red-500 hover:text-red-700 ml-4">
      <Icon icon="mdi:trash-can" class="text-xl" />
    </button>
  </template>
</DataTable>
  </div>

  <el-dialog v-model="isDialogVisible" title="Vật tư" width="500px">
    <el-form :model="materialForm">
      <el-form-item label="Mã vật tư">
        <el-input v-model="materialForm.MaterialCode" />
      </el-form-item>
      <el-form-item label="Tên vật tư">
        <el-input v-model="materialForm.MaterialName" />
      </el-form-item>
      <el-form-item label="Đơn vị">
        <el-input v-model="materialForm.Unit" />
      </el-form-item>
      <el-form-item label="Mô tả">
        <el-input v-model="materialForm.Description" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="isDialogVisible = false">Hủy</el-button>
      <el-button type="primary" @click="saveMaterial">Lưu</el-button>
    </template>
  </el-dialog>
</template>
