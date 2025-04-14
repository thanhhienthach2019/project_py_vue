// useAutoSizeGrid.ts
import { ref } from 'vue';
import { debounce } from 'lodash';
import type { GridApi, GridReadyEvent, FirstDataRenderedEvent } from 'ag-grid-community';

export function useAutoSizeGrid() {
  const gridApiDetail = ref<GridApi | null>(null);

  const autoSizeColumns = debounce(() => {
    if (gridApiDetail.value) {
        gridApiDetail.value.autoSizeAllColumns();
      // console.log("Auto size columns (debounced) được gọi trong composition");
    }
  }, 100);

  const onGridReady = (params: GridReadyEvent) => {
    gridApiDetail.value = params.api;
    autoSizeColumns();
  };

  const onFirstDataRendered = (_params: FirstDataRenderedEvent) => {
    autoSizeColumns();
  };

  return {
    gridApiDetail,
    autoSizeColumns,
    onGridReady,
    onFirstDataRendered,
  };
}
