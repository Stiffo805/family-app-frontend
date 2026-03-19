import { type DBSchema, type IDBPDatabase, openDB } from 'idb'

// --- Types ---

const IDB_VERSION = 3

const storeNames = {
  DELETED_RECORDS: `deleted_records${IDB_VERSION}`,
  MODIFIED_RECORDS: `modified_records${IDB_VERSION}`
} as const

export type ModificationType = 'created' | 'updated' | 'deleted'

export interface ModifiedItemRecord {
  id: number // Original item ID
  modificationType: Exclude<ModificationType, 'deleted'>
}

export interface DeletedItemRecord {
  id?: number // Original item ID (used as key so we can easily delete this notification)
  product_name: string
  quantity: number
  unit_display: string
  extra_notes: string | null
  is_checked: boolean
}

// --- Schema ---

export interface ShoppingChangesSchema extends DBSchema {
  // Store for items that still exist but were changed/added
  [storeNames.MODIFIED_RECORDS]: {
    key: number
    value: ModifiedItemRecord
  }

  // Store for items that were completely removed
  [storeNames.DELETED_RECORDS]: {
    key: number
    value: DeletedItemRecord
  }
}

export const initChangesDB = async () => {
  return await openDB<ShoppingChangesSchema>('ShoppingChangesDB', IDB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeNames.MODIFIED_RECORDS)) {
        db.createObjectStore(storeNames.MODIFIED_RECORDS, { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains(storeNames.DELETED_RECORDS)) {
        db.createObjectStore(storeNames.DELETED_RECORDS, {
          keyPath: 'id',
          autoIncrement: true
        })
      }
    }
  })
}

export const saveIncomingChange = async (
  db: IDBPDatabase<ShoppingChangesSchema>,
  type: 'created' | 'updated' | 'deleted',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  itemData: any // Data received from push notification
) => {
  if (type === 'deleted') {
    // Save full data so UI can display "You deleted 5 apples"
    await db.put(storeNames.DELETED_RECORDS, {
      product_name: itemData.product_name,
      quantity: Number(itemData.quantity),
      unit_display: itemData.unit_display,
      extra_notes: itemData.extra_notes,
      is_checked: itemData.is_checked
    })
  } else {
    // Save only the ID and the type of modification
    await db.put(storeNames.MODIFIED_RECORDS, {
      id: itemData.id,
      modificationType: type
    })
  }
}

export const retrieveCreatedAndUpdatedItems = async (
  db: IDBPDatabase<ShoppingChangesSchema>
) => await db.getAll(storeNames.MODIFIED_RECORDS)

export const retrieveDeletedItems = async (
  db: IDBPDatabase<ShoppingChangesSchema>
) => await db.getAll(storeNames.DELETED_RECORDS)

export const acknowledgeChange = async (
  db: IDBPDatabase<ShoppingChangesSchema>,
  itemId: number,
  isDeletedRecord: boolean = false
) => {
  const storeName = isDeletedRecord
    ? storeNames.DELETED_RECORDS
    : storeNames.MODIFIED_RECORDS

  // Deletes the notification record.
  // The actual shopping item in Django remains completely untouched!
  await db.delete(storeName, itemId)

  console.log(`Notification for item ${itemId} cleared.`)
}
