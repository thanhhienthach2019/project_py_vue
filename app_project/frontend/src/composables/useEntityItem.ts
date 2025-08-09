// src/composables/useEntityItem.ts
import { computed } from 'vue'
import { useToastAction } from '@/composables/useToastAction'

export interface StoreWithEntityActions<ID, UpdateDto> {
  isUpdating: boolean
  updatingId: ID | null
  isDeleting: boolean
  deletingId: ID | null
  updateEntity: (id: ID, data: UpdateDto) => Promise<any>
  deleteEntity: (id: ID) => Promise<any>
}

export function createUseEntityItem<
  ID,
  UpdateDto,
  Item extends Record<string, any>,
  Store extends StoreWithEntityActions<ID, UpdateDto>
>(
  storeGetter: () => Store,
  idKey: keyof Item
) {
  return function useEntityItem(entity: Item) {
    const store = storeGetter()
    const withToastAction = useToastAction()      
    const id = entity[idKey] as unknown as ID

    const isUpdating = computed(() => store.isUpdating && store.updatingId === id)
    const isDeleting = computed(() => store.isDeleting && store.deletingId === id)

    function update(data: UpdateDto) {
      return withToastAction(() => store.updateEntity(id, data))
    }
    function remove() {
      return withToastAction(() => store.deleteEntity(id))
    }

    return { entity, isUpdating, isDeleting, update, remove }
  }
}
