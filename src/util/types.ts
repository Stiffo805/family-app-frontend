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
  tags: Tag[]
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

export type ItemCategory = {
  id: number
  name: string
}

export type ItemsCategoriesResponse = {
  items: ItemCategory[]
}

export type ItemRegisterEntry = {
  id: number
  name: string
  category?: ItemCategory
}

export type Room = {
  id: number
  name: string
}

export type RoomsResponse = {
  items: Room[]
}

export type ItemRegister = {
  id: number
  item: ItemRegisterEntry
  quantity?: number
  unit?: string
  unit_display?: string
  room?: Room
  place_description?: string
  last_updated_at: string
}

export type ItemsRegister = {
  items: ItemRegister[]
}