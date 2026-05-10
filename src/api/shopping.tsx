import useCustomMutation from '@src/api/hooks/useCustomMutation'
import useCustomQuery from '@src/api/hooks/useCustomQuery'
import { queryClient } from '@src/api/queryClient'
import type {
  LackingShoppingListItemsList,
  ShoppingItemsResponse,
  ShoppingList,
  ShoppingListsInfosList,
  TagsResponse,
  UnitsResponse
} from '@src/util/types'

export const useGetAllTags = () =>
  useCustomQuery<TagsResponse>({
    method: 'GET',
    url: '/shopping/tags',
    queryKey: ['tags']
  })

export const useCreateTag = (args: { onSuccess: () => void }) =>
  useCustomMutation({
    method: 'POST',
    url: '/shopping/tags/',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tags']
      })
      args.onSuccess()
    }
  })

export const useGetAllUnits = () =>
  useCustomQuery<UnitsResponse>({
    method: 'GET',
    queryKey: ['units'],
    url: '/shopping/units/'
  })

export const useGetAllShoppingLists = () =>
  useCustomQuery<ShoppingListsInfosList>({
    method: 'GET',
    url: '/shopping/lists',
    queryKey: ['shoppingLists']
  })

export const useGetShoppingList = (args: { shoppingListId: number }) =>
  useCustomQuery<ShoppingList>({
    method: 'GET',
    url: `/shopping/lists/${Number(args.shoppingListId)}`,
    queryKey: [`shoppingList-${Number(args.shoppingListId)}`]
  })

export const useGetAllShoppingItems = () =>
  useCustomQuery<ShoppingItemsResponse>({
    method: 'GET',
    url: '/shopping/items/',
    queryKey: ['shoppingItems']
  })

export const useAddShoppingListItemToList = (args: {
  shoppingListId: number | undefined
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'POST',
    url: `/shopping/lists/${args.shoppingListId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${args.shoppingListId}`]
      })
      args.onSuccess()
    }
  })

export const usePostShoppingListItem = (args: { onSuccess: () => void }) =>
  useCustomMutation({
    method: 'POST',
    url: '/shopping/items/',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['shoppingItems']
      })
      args.onSuccess()
    }
  })

export const usePutShoppingListItem = (args: {
  shoppingListId: number | undefined
  shoppingListItemsEntryId: number | undefined
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'PUT',
    url: `/shopping/lists/${args.shoppingListId}/entries/${args.shoppingListItemsEntryId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${args.shoppingListId}`]
      })
      args.onSuccess()
    }
  })

export const useCheckShoppingListItem = (args: {
  shoppingListId: number | undefined
  shoppingListItemsEntryId: number | undefined
}) =>
  useCustomMutation({
    method: 'PATCH',
    url: `/shopping/lists/${args.shoppingListId}/entries/${args.shoppingListItemsEntryId}/`,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${args.shoppingListId}`]
      })
  })

export const useDeleteShoppingListItem = (args: {
  shoppingListId: number | undefined
  shoppingListItemsEntryId: number | undefined
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'DELETE',
    url: `/shopping/lists/${args.shoppingListId}/entries/${args.shoppingListItemsEntryId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${args.shoppingListId}`]
      })
      args.onSuccess()
    }
  })

export const useGetLackingShoppingListItems = () =>
  useCustomQuery<LackingShoppingListItemsList>({
    method: 'GET',
    url: '/shopping/items/lacking/',
    queryKey: ['lackingItems']
  })

export const useCreateLackingShoppingListItem = (args: {
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'POST',
    url: '/shopping/items/lacking/',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      args.onSuccess()
    }
  })

export const usePutLackingShoppingListItem = (args: {
  lackingItemId: number | undefined
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'PUT',
    url: `/shopping/items/lacking/${args.lackingItemId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      args.onSuccess()
    }
  })

export const useDeleteLackingShoppingListItem = (args: {
  lackingItemId: number | undefined
  onSuccess: () => void
}) =>
  useCustomMutation({
    method: 'DELETE',
    url: `/shopping/items/lacking/${args.lackingItemId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      args.onSuccess()
    }
  })

export const useMoveLackingItems = (args: { targetShoppingListId: number }) =>
  useCustomMutation({
    method: 'POST',
    url: `/shopping/items/lacking/move/${args.targetShoppingListId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${args.targetShoppingListId}`]
      })
    }
  })

export const usePatchLackingShoppingListItem = (args: {
  entryId: number | undefined
}) =>
  useCustomMutation({
    method: 'PATCH',
    url: `/shopping/items/lacking/${args.entryId}/`,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`lackingItems`]
      })
  })
