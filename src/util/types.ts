export type ListItem = {
  name?: string
  value: string
  customListStyleType?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export type CustomUnit = {
  value: string
  label: string
}

export type UnitsResponse = {
  units: CustomUnit[]
}

export type ShoppingListInfo = {
  id: number
  title: string
  description: string | null
}

export type ShoppingListsInfosList = {
  shopping_lists: ShoppingListInfo[]
}

export type ShoppingListEntry = {
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

export type ShoppingList = ShoppingListInfo & {
  entries: ShoppingListEntry[]
}

export type ShoppingItem = {
  id: number
  name: string
}

export type ShoppingItemsResponse = {
  all_items: ShoppingItem[]
}

export type Tag = {
  id: number
  name: string
}

export type TagsResponse = {
  items: Tag[]
}

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

export type LackingShoppingListItemsList = {
  entries: LackingShoppingListItemsListEntry[]
}

export type MoveLackingItemsOperationType = 'copy' | 'cut'