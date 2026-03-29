import { axiosClient } from '@src/api/axios'
import { queryClient } from '@src/api/queryClient'
import { useMutation } from '@tanstack/react-query'

type UseDeleteShoppingListItemProps = {
  shoppingListId: number
  entryId: number
  onSuccess?: () => void
  onError?: () => void
}

const useDeleteShoppingListItem = (props: UseDeleteShoppingListItemProps) => {
  const deleteShoppingListItem = async () => {
    const token = localStorage.getItem('authToken')
    return axiosClient.delete(
      `/shopping/lists/${props.shoppingListId}/entries/${props.entryId}/`,
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
  }

  const shoppingListItemMutation = useMutation({
    mutationFn: deleteShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
      props.onSuccess?.()
    },
    onError: props.onError
  })

  return {
    mutate: shoppingListItemMutation.mutate,
    isPending: shoppingListItemMutation.isPending,
    isError: shoppingListItemMutation.isError
  }
}

export default useDeleteShoppingListItem
