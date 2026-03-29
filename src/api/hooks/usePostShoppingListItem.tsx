import { axiosClient } from "@src/api/axios"
import { queryClient } from "@src/api/queryClient"
import { useMutation } from "@tanstack/react-query"
import { AxiosError, type AxiosResponse } from "axios"

type UsePostShoppingListItemProps = {
  shoppingListId?: number
  onSuccess?: () => void
}

type PostShoppingListItemFormData = {
  itemId: number
  quantity?: number | null
  unit?: string | null
  extraNotes?: string | null
}

const usePostShoppingListItem = (props: UsePostShoppingListItemProps) => {
  const postShoppingListItem = async (formData: PostShoppingListItemFormData) => {
    const token = localStorage.getItem('authToken')
    return axiosClient.post(
      `/shopping/lists/${props.shoppingListId}/`,
      {
        item_id: formData.itemId,
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

  const shoppingListItemMutation = useMutation<
    AxiosResponse, 
    AxiosError,    
    PostShoppingListItemFormData
  >({
    mutationFn: postShoppingListItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
      props.onSuccess?.()
    }
  })

  const currentHttpStatus = 
    shoppingListItemMutation.data?.status || 
    shoppingListItemMutation.error?.response?.status

  return {
    mutate: shoppingListItemMutation.mutate,
    isPending: shoppingListItemMutation.isPending,
    isError: shoppingListItemMutation.isError,
    status: currentHttpStatus 
  }
}

export default usePostShoppingListItem