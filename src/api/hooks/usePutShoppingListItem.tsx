import { axiosClient } from '@src/api/axios'
import { queryClient } from '@src/api/queryClient'
import { useMutation } from '@tanstack/react-query'

type UsePutShoppingListItemProps = {
  shoppingListId: number
  entryId: number
  onSuccess?: () => void
}

type PutShoppingListItemFormData = {
  quantity?: number | null
  unit?: string | null
  extraNotes?: string | null
}

const usePutShoppingListItem = (props: UsePutShoppingListItemProps) => {
  const putShoppingListItem = (formData: PutShoppingListItemFormData) => {
    const token = localStorage.getItem('authToken')
    return axiosClient.put(
      `/shopping/lists/${props.shoppingListId}/entries/${props.entryId}/`,
      {
        quantity: formData.quantity,
        unit: formData.unit,
        extra_notes: formData.extraNotes
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    )
  }

  const shoppingListItemMutation = useMutation({
    mutationFn: putShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
      props.onSuccess?.()
    }
  })

  return {
    mutate: shoppingListItemMutation.mutate,
    isPending: shoppingListItemMutation.isPending,
    isError: shoppingListItemMutation.isError
  }
}

export default usePutShoppingListItem
