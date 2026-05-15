import useCustomQuery from '@src/api/hooks/useCustomQuery'
import type { ItemsRegister } from '@src/util/types'

export const useGetItemsRegister = () =>
  useCustomQuery<ItemsRegister>({
    method: 'GET',
    url: `/item_register/register/`,
    queryKey: ['itemsRegister']
  })
