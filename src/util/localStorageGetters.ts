import type { ShoppingList, ShoppingListInfo } from '@src/util/types'

export const getShoppingListFromLocalStorage = (shoppingListId: number) => {
  const allLists = JSON.parse(
    localStorage.getItem('shoppingLists') ?? '[]'
  ) as ShoppingList[]
  const theList = allLists.find((l) => l.id === shoppingListId)
  return theList
}

export const getAllShoppingListsFromLocalStorage = () => {
  return {
    shopping_lists: JSON.parse(
      localStorage.getItem('shoppingLists') ?? '[]'
    ) as ShoppingListInfo[]
  }
}
