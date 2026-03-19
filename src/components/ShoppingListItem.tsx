import type { ShoppingListEntry } from '@src/api/hooks/useGetShoppingList'
import usePatchShoppingListItem from '@src/api/hooks/usePatchShoppingListItem'
import {
  acknowledgeChange,
  initChangesDB,
  type ModificationType,
} from '@src/api/indexedDb'
import styles from '@src/components/ShoppingListItem.module.css'

type ShoppingListItemProps = {
  shoppingListId?: number
  shoppingListEntry: ShoppingListEntry
  modificationType?: ModificationType
  loadChangesFromIdb: () => void
}

const ShoppingListItem = (props: ShoppingListItemProps) => {
  const { mutate } = usePatchShoppingListItem({
    entryId: props.shoppingListEntry.id || -1,
    shoppingListId: props.shoppingListId || -1,
    isChecked: !props.shoppingListEntry.is_checked
  })

  const getBackgroundColor = () => {
    if (props.modificationType === 'created')
      return 'hsla(74 100% 67.6% / 0.46)'
    else if (props.modificationType === 'updated')
      return 'hsla(53 100% 77% / 0.46)'
    else if (props.modificationType === 'deleted')
      return 'hsla(11 100% 77% / 0.46)'
    else return undefined
  }

  const acknowledge = async () => {
    const db = await initChangesDB()
    await acknowledgeChange(
      db,
      props.shoppingListEntry.id || -1,
      props.modificationType === 'deleted'
    )
    props.loadChangesFromIdb()
  }

  return (
    <li
      className={`${styles.shoppingListItem} ${props.shoppingListEntry.is_checked ? styles.checkedListItem : ''}`}
      style={{
        backgroundColor: getBackgroundColor()
      }}
      onClick={acknowledge}
    >
      <div className={styles.mainEntryContainer}>
        <div className={styles.textContentContainer}>
          <span className={styles.entryName}>
            {props.shoppingListEntry.product_name}
          </span>{' '}
          -{' '}
          <span className={styles.entryAmount}>
            {Number(props.shoppingListEntry.quantity)}{' '}
            {props.shoppingListEntry.unit_display}
          </span>
          <br />
          <span className={styles.additionalNotes}>
            {props.shoppingListEntry.extra_notes ?? 'Brak uwag'}
          </span>
        </div>
        <input
          type='checkbox'
          checked={props.shoppingListEntry.is_checked}
          onClick={() => {
            if (props.modificationType !== 'deleted') mutate()
          }}
        />
      </div>
    </li>
  )
}

export default ShoppingListItem
