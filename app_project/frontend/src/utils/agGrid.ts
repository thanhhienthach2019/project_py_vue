// src/utils/agGrid.ts
import type { GridApi } from "ag-grid-community";

/**
 * Safely applies a quick filter to AG Grid (client-side only).
 *
 * @param gridApi - The AG Grid API instance
 * @param filterText - The quick filter text to apply
 */
export function setQuickFilterSafe(gridApi: GridApi | null | undefined, filterText: string) {
  const clientApi = gridApi as unknown as { setQuickFilter?: (text: string) => void };
  clientApi?.setQuickFilter?.(filterText);
}
