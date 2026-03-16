import type { ShoppingListEntry } from '@src/api/hooks/useGetShoppingList'
import usePatchShoppingListItem from '@src/api/hooks/usePatchShoppingListItem'
import styles from '@src/components/ShoppingListItem.module.css'

type ShoppingListItemProps = {
  shoppingListId: number
  shoppingListEntry: ShoppingListEntry
}

const ShoppingListItem = (props: ShoppingListItemProps) => {
  const { mutate } = usePatchShoppingListItem({
    entryId: props.shoppingListEntry.id,
    shoppingListId: props.shoppingListId,
    isChecked: !props.shoppingListEntry.is_checked
  })

  return (
    <li
      className={`${styles.shoppingListItem} ${props.shoppingListEntry.is_checked ? styles.checkedListItem : ''}`}
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
          onClick={() => mutate()}
        />
      </div>
    </li>
  )
}

export default ShoppingListItem
