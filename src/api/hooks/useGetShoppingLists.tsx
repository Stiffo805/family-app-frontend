import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

export type ShoppingListInfo = {
  id: number
  title: string
  description: string | null
}

type ShoppingListsInfosList = {
  shopping_lists: ShoppingListInfo[]
}

const useGetShoppingLists = () => {
  const getShoppingLists = (): Promise<ShoppingListsInfosList> => axiosClient
    .get('/shopping/lists')
    .then((response) => response.data)
    .catch((err) => console.error(err))

  const shoppingListsQuery = useQuery({
    queryKey: ['shoppingLists'],
    queryFn: getShoppingLists
  })

  return {
    data: shoppingListsQuery.data,
    isLoading: shoppingListsQuery.isLoading
  }
}

export default useGetShoppingLists
