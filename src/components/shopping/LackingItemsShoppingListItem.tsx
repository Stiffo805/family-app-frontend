import useCustomMutation from '@src/api/hooks/useCustomMutation'
import { queryClient } from '@src/api/queryClient'
import commonStyles from '@src/commonStyles/ShoppingListItemCommonStyles.module.css'
import styles from '@src/components/shopping/LackingItemsShoppingListItem.module.css'
import { convertDateToReadable } from '@src/util/helpers'
import type { LackingShoppingListItemsListEntry } from '@src/util/types'
import type { ShoppingListItemsSortingType } from '@src/views/shopping/ShoppingListView'

type ShoppingListItemProps = {
  lackingItemsShoppingListEntry: LackingShoppingListItemsListEntry
  tagsNames: string[]
  sorting?: ShoppingListItemsSortingType
  isEditionMode: boolean
  toggleCheckItem: (entry: LackingShoppingListItemsListEntry) => void
  isChecked: (entry: LackingShoppingListItemsListEntry) => boolean
}

const LackingItemsShoppingListItem = (props: ShoppingListItemProps) => {
  const { mutate: setChecked } = useCustomMutation({
    method: 'PATCH',
    url: `/shopping/items/lacking/${props.lackingItemsShoppingListEntry.id}/`,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`lackingItems`]
      })
  })

  return (
    <>
      <li
        className={`${commonStyles.shoppingListItem} ${props.lackingItemsShoppingListEntry.is_checked ? commonStyles.checkedListItem : ''}`}
        style={{}}
      >
        <div className={commonStyles.mainEntryContainer}>
          {props.isEditionMode && (
            <div className={styles.leftCheckbox}>
              <input
                type='checkbox'
                onClick={() =>
                  props.toggleCheckItem(props.lackingItemsShoppingListEntry)
                }
                checked={props.isChecked(props.lackingItemsShoppingListEntry)}
              />
            </div>
          )}
          <div className={commonStyles.textContentContainer}>
            <span className={commonStyles.entryName}>
              {props.lackingItemsShoppingListEntry.product_name}
            </span>{' '}
            {Number(props.lackingItemsShoppingListEntry.quantity) > 0 && (
              <>
                -{' '}
                <span className={commonStyles.entryAmount}>
                  {Number(props.lackingItemsShoppingListEntry.quantity)}{' '}
                  {props.lackingItemsShoppingListEntry.unit_display}
                </span>
              </>
            )}
            <br />
            <span className={commonStyles.additionalNotes}>
              {props.lackingItemsShoppingListEntry.extra_notes
                ? props.lackingItemsShoppingListEntry.extra_notes
                : 'Brak uwag'}
            </span>
            {props.sorting === 'timestamp' && (
              <>
                <br />
                <span className={commonStyles.lastUpdateDateLabel}>
                  Ostatnia aktualizacja:{' '}
                  {props.lackingItemsShoppingListEntry.updated_at
                    ? convertDateToReadable(
                        props.lackingItemsShoppingListEntry.updated_at
                      )
                    : 'Brak informacji'}
                </span>
              </>
            )}
            {props.tagsNames.length > 0 && (
              <>
                <br />
                <span className={commonStyles.tagsNames}>
                  {props.tagsNames.join(', ')}
                </span>
              </>
            )}
          </div>
          <div className={styles.shoppingItemPostfix}>
            <input
              type='checkbox'
              checked={props.lackingItemsShoppingListEntry.is_checked}
              onClick={() =>
                setChecked({
                  is_checked: !props.lackingItemsShoppingListEntry.is_checked
                })
              }
            />
          </div>
        </div>
      </li>
    </>
  )
}

export default LackingItemsShoppingListItem
