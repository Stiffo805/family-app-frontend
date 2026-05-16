import useCustomQuery from '@src/api/hooks/useCustomQuery'
import type { ItemsCategoriesResponse, ItemsRegister, RoomsResponse } from '@src/util/types'

export const useGetItemsRegister = () =>
  useCustomQuery<ItemsRegister>({
    method: 'GET',
    url: `/item_register/register/`,
    queryKey: ['itemsRegister']
  })

export const useGetRooms = () =>
  useCustomQuery<RoomsResponse>({
    method: 'GET',
    url: '/item_register/rooms/',
    queryKey: ['rooms']
  })

export const useGetCategories = () =>
  useCustomQuery<ItemsCategoriesResponse>({
    method: 'GET',
    url: '/item_register/categories/',
    queryKey: ['categories']
  })
