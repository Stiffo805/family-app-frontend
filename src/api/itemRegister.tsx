import useCustomQuery from '@src/api/hooks/useCustomQuery'
import type { ItemsRegister } from '@src/util/types'

export const useGetItemsRegister = (args: { searchText: string }) =>
  useCustomQuery<ItemsRegister>({
    method: 'GET',
    url: `/item_register/register/?searchText=${args.searchText}`,
    queryKey: ['itemsRegister', args.searchText]
  })
