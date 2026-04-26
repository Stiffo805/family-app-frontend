import { axiosClient } from '@src/api/axios'
import type { Tag } from '@src/api/hooks/useGetTags'
import { useQuery } from '@tanstack/react-query'

export type LackingShoppingListItemsListEntry = {
  id?: number
  product_id?: number
  product_name: string
  tags: Tag[]
  quantity: number | null
  unit?: string | null
  unit_display: string | null
  extra_notes: string | null
  is_checked: boolean
  updated_at?: string
}

type LackingShoppingListItemsList = {
  entries: LackingShoppingListItemsListEntry[]
}

const useGetLackingShoppingListItems = () => {
  const getLackingShoppingListItems =
    (): Promise<LackingShoppingListItemsList> => {
      const token = localStorage.getItem('authToken')
      return axiosClient
        .get(`/shopping/items/lacking/`, {
          headers: {
            Authorization: `Token ${token}`
          }
        })
        .then((response) => response.data)
    }

  const lackingShoppingListItemsQuery = useQuery({
    queryKey: ['lackingItems'],
    queryFn: getLackingShoppingListItems
  })

  return {
    data: lackingShoppingListItemsQuery.data,
    isLoading: lackingShoppingListItemsQuery.isLoading
  }
}

export default useGetLackingShoppingListItems
