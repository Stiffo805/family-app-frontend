import { axiosClient } from '@src/api/axios'
import { queryClient } from '@src/api/queryClient'
import { useMutation } from '@tanstack/react-query'

type UseMoveLackingItemsToListProps = {
  targetShoppingListId: number
}

export type MoveLackingItemsOperationType = 'copy' | 'cut'

const useMoveLackingItemsToList = (props: UseMoveLackingItemsToListProps) => {
  const moveLackingItemsToList = (body: {
    itemsIds: number[]
    operationType: MoveLackingItemsOperationType
  }) => {
    const token = localStorage.getItem('authToken')
    return axiosClient.post(
      `/shopping/items/lacking/move/${props.targetShoppingListId}/`,
      {
        lacking_items_ids: body.itemsIds,
        operation_type: body.operationType
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
  }

  const moveLackingItemsToListMutation = useMutation({
    mutationKey: [`moveLackingItemsToList-${props.targetShoppingListId}`],
    mutationFn: moveLackingItemsToList,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.targetShoppingListId}`]
      })
    }
  })

  return {
    mutate: moveLackingItemsToListMutation.mutate,
    isPending: moveLackingItemsToListMutation.isPending
  }
}

export default useMoveLackingItemsToList
