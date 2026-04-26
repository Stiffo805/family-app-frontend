import { axiosClient } from "@src/api/axios"
import { queryClient } from "@src/api/queryClient"
import { useMutation } from "@tanstack/react-query"

type UsePatchLackingShoppingListItemProps = {
  itemId: number
}

const usePatchLackingShoppingListItem = (props: UsePatchLackingShoppingListItemProps) => {
  const patchLackingShoppingListItem = (isChecked: boolean) => {
    const token = localStorage.getItem('authToken')
    return axiosClient.patch(
      `/shopping/items/lacking/${props.itemId}/`,
      {
        is_checked: isChecked
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
  }

  const lackingShoppingListItemMutation = useMutation({
    mutationKey: [
      `patchLackingShoppingListItem-${props.itemId}`
    ],
    mutationFn: patchLackingShoppingListItem,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`lackingItems`]
      })
  })

  return {
    mutate: lackingShoppingListItemMutation.mutate,
    isPending: lackingShoppingListItemMutation.isPending
  }
}

export default usePatchLackingShoppingListItem