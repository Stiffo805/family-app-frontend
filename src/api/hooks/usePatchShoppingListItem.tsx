import { axiosClient } from '@src/api/axios'
import { queryClient } from '@src/api/queryClient'
import { useMutation } from '@tanstack/react-query'

type UsePatchShoppingListItemProps = {
  shoppingListId: number
  entryId: number
  isChecked: boolean
}

const usePatchShoppingListItem = (props: UsePatchShoppingListItemProps) => {
  const patchShoppingListItem = () =>
    axiosClient.patch(
      `/shopping/lists/${props.shoppingListId}/entries/${props.entryId}/`,
      {
        is_checked: props.isChecked
      }
    )

  const shoppingListMutation = useMutation({
    mutationKey: [
      `patchShoppingList-${props.shoppingListId}-entry-${props.entryId}-data-${props.isChecked}`
    ],
    mutationFn: patchShoppingListItem,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
  })

  return {
    mutate: shoppingListMutation.mutate,
    isPending: shoppingListMutation.isPending
  }
}

export default usePatchShoppingListItem
