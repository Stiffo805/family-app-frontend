import { axiosClient } from '@src/api/axios'
import type { ShoppingListInfo } from '@src/api/hooks/useGetShoppingLists'
import { useQuery } from '@tanstack/react-query'

type UseGetShoppingListProps = {
  shoppingListId: number
}

export type ShoppingListEntry = {
  id?: number
  product_id?: number
  product_name: string
  quantity: number
  unit?: string
  unit_display: string
  extra_notes: string | null
  is_checked: boolean
}

type ShoppingList = ShoppingListInfo & {
  entries: ShoppingListEntry[]
}

const useGetShoppingList = (props: UseGetShoppingListProps) => {
  const getShoppingList = (): Promise<ShoppingList> =>
    axiosClient
      .get(`/shopping/lists/${props.shoppingListId}`)
      .then((response) => response.data)

  const shoppingListQuery = useQuery({
    queryKey: [`shoppingList-${props.shoppingListId}`],
    queryFn: getShoppingList
  })

  return {
    data: shoppingListQuery.data,
    isLoading: shoppingListQuery.isLoading
  }
}

export default useGetShoppingList
