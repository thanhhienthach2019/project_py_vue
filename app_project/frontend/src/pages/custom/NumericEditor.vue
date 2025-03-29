<template>
    <div>
      <input
        ref="inputRef"
        v-model="value"
        @keydown.enter="finishEditing"
        @blur="finishEditing"
        class="border rounded p-1 w-full"
        :class="{'border-red-500': error}"
      />
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  // Nhận các props từ ag-grid
  const props = defineProps({
    value: { type: [Number, String], default: '' },
    params: { type: Object }
  })
  
  const inputRef = ref(null)
  const value = ref(props.value)
  const error = ref('')
  
  // Phương thức hoàn thành chỉnh sửa, kiểm tra dữ liệu và giữ focus nếu có lỗi
  function finishEditing() {
    const remaining = Number(props.params.data.RemainingStock)
    const numericValue = Number(value.value)
  
    if (numericValue > remaining) {
      error.value = 'Số lượng sử dụng không được vượt quá số lượng tồn kho'
      // Kiểm tra inputRef trước khi gọi focus
      if (inputRef.value) {
        inputRef.value.focus()
      }
    } else {
      error.value = ''
      // Gọi stopEditing() của ag-grid để kết thúc chế độ chỉnh sửa
      props.params.stopEditing()
    }
  }
  
  // Phương thức getValue() để trả về giá trị đã chỉnh sửa cho ag-grid
  function getValue() {
    const newValue = Number(value.value)
    return isNaN(newValue) ? 0 : newValue
  }
  
  // Phương thức afterGuiAttached để đảm bảo input được focus sau khi component được gắn vào DOM
  function afterGuiAttached() {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  }
  
  // Đảm bảo focus vào input khi component được mount
  onMounted(() => {
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
  
  // Expose các phương thức cần thiết cho ag-grid thông qua defineExpose
  defineExpose({
    getValue,
    afterGuiAttached,
  })
  </script>
  