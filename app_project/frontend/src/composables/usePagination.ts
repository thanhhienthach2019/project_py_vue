// src/composables/usePagination.ts
import { ref, computed, watch, type Ref } from 'vue';

export function usePagination<T>(dataRef: Ref<T[]>, initialPerPage = 5) {
  const itemsPerPage = ref(initialPerPage);
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(dataRef.value.length / itemsPerPage.value))
  );

  const pagedData = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return dataRef.value.slice(start, start + itemsPerPage.value);
  });

  const pagesToShow = computed<(number|'...')[]>(() => {
    const total = totalPages.value;
    const cur = currentPage.value;
    const delta = 2;
    const range: (number|'...')[] = [];
    let left = Math.max(2, cur - delta);
    let right = Math.min(total - 1, cur + delta);

    if (left > 2) {
      range.push(1, '...');
    } else {
      for (let i = 1; i < left; i++) range.push(i);
    }
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) {
      range.push('...', total);
    } else {
      for (let i = right + 1; i <= total; i++) range.push(i);
    }
    return range;
  });

  function goTo(page: number) {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
  }
  function next() { goTo(currentPage.value + 1); }
  function prev() { goTo(currentPage.value - 1); }

  watch([() => dataRef.value.length, itemsPerPage], () => {
    currentPage.value = 1;
  });

  return {
    itemsPerPage,
    currentPage,
    totalPages,
    pagedData,
    pagesToShow,
    goTo,
    next,
    prev,
  };
}
