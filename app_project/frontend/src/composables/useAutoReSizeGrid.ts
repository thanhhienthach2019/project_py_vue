// composables/useAutoResizeGrid.ts
import { onMounted, onBeforeUnmount, watch, type Ref, nextTick } from "vue";
import { debounce } from "lodash";
import type { GridApi, FirstDataRenderedEvent, GridReadyEvent } from "ag-grid-community";

type UseAutoResizeGridOptions = {
  afterFirstRender?: (api: GridApi) => void;
};

// composables/useAutoResizeGrid.ts
export function useAutoResizeGrid(
  gridApi: Ref<GridApi | null>,
  containerRef: Ref<HTMLElement | null>,
  columnsToAutoSize: string[] = [],
  options: UseAutoResizeGridOptions = {}
) {
  let resizeObserver: ResizeObserver | null = null;

  const handleResize = debounce(async () => {
    const api = gridApi.value;
    const container = containerRef.value;
    if (!api || api.isDestroyed?.() || !container) return;

    await nextTick();
    if (columnsToAutoSize.length > 0) {
      api.autoSizeColumns(columnsToAutoSize);
    }
  }, 200);

  const onGridReady = async (e: GridReadyEvent) => {
    gridApi.value = e.api;
    await nextTick();
    handleResize();
  };

  const onFirstDataRendered = async (e: FirstDataRenderedEvent) => {
    await nextTick();
    handleResize();

    const api = gridApi.value;
    if (api && !api.isDestroyed?.() && typeof options.afterFirstRender === "function") {
      options.afterFirstRender(api);
    }
  };

  const init = () => {
    if (!containerRef.value) return;
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.value);
  };

  onMounted(init);

  watch(containerRef, (newEl, oldEl) => {
    if (oldEl && resizeObserver) resizeObserver.unobserve(oldEl);
    if (newEl && resizeObserver) resizeObserver.observe(newEl);
  });

  onBeforeUnmount(() => {
    if (containerRef.value && resizeObserver) {
      resizeObserver.unobserve(containerRef.value);
    }
    resizeObserver = null;
  });

  return {
    onGridReady,
    onFirstDataRendered,
    resizeNow: handleResize,
  };
}
