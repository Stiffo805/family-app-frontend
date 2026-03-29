import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

type ShoppingItem = {
  id: number
  name: string
}

type ShoppingItemsResponse = {
  all_items: ShoppingItem[]
}

const useGetShoppingItems = () => {
  const getShoppingItems = (): Promise<ShoppingItemsResponse> => {
    const token = localStorage.getItem('authToken')
    return axiosClient
      .get(`/shopping/items/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => response.data)
  }

  const shoppingItemsQuery = useQuery({
    queryKey: [`shoppingItems`],
    queryFn: getShoppingItems
  })

  return {
    data: shoppingItemsQuery.data,
    isLoading: shoppingItemsQuery.isLoading
  }
}

export default useGetShoppingItems
