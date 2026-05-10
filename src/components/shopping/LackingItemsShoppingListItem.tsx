import {
  useDeleteLackingShoppingListItem,
  useGetAllUnits,
  usePatchLackingShoppingListItem,
  usePutLackingShoppingListItem
} from '@src/api/shopping'
import commonStyles from '@src/commonStyles/ShoppingListItemCommonStyles.module.css'
import ButtonWithIcon from '@src/components/common/ButtonWithIcon'
import ConfirmationModal from '@src/components/common/ConfirmationModal'
import ErrorSpan from '@src/components/common/ErrorSpan'
import Modal from '@src/components/common/Modal'
import styles from '@src/components/shopping/LackingItemsShoppingListItem.module.css'
import { convertDateToReadable } from '@src/util/helpers'
import type { LackingShoppingListItemsListEntry } from '@src/util/types'
import type { ShoppingListItemsSortingType } from '@src/views/shopping/ShoppingListView'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

type ShoppingListItemProps = {
  lackingItemsShoppingListEntry: LackingShoppingListItemsListEntry
  tagsNames: string[]
  sorting?: ShoppingListItemsSortingType
  isEditionMode: boolean
  toggleCheckItem: (entry: LackingShoppingListItemsListEntry) => void
  isChecked: (entry: LackingShoppingListItemsListEntry) => boolean
}

const LackingItemsShoppingListItem = (props: ShoppingListItemProps) => {
  const [isEditionModalVisible, setIsEditionModalVisible] = useState(false)
  const [
    isDeleteItemConfirmationModalVisible,
    setIsDeleteItemConfirmationModalVisible
  ] = useState(false)

  const { mutate: setChecked } = usePatchLackingShoppingListItem({
    entryId: props.lackingItemsShoppingListEntry.id
  })

  const { data: units } = useGetAllUnits()

  const {
    mutate: updateItem,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending
  } = usePutLackingShoppingListItem({
    lackingItemId: props.lackingItemsShoppingListEntry.id,
    onSuccess: () => {
      setIsEditionModalVisible(false)
    }
  })

  const {
    mutate: deleteItem,
    isError: isDeleteItemError,
    isPending: isDeleteItemPending
  } = useDeleteLackingShoppingListItem({
    lackingItemId: props.lackingItemsShoppingListEntry.id,
    onSuccess: () => {
      setIsEditionModalVisible(false)
      setIsDeleteItemConfirmationModalVisible(false)
    }
  })

  const modalBody = (
    <div className={commonStyles.editionModalBody}>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const quantity = Number(formData.get('quantity'))
            ? Number(formData.get('quantity'))
            : null
          const unit = formData.get('unit')
            ? formData.get('unit')?.toString()
            : null
          const extraNotes = formData.get('extraNotes')?.toString()

          updateItem({ quantity, unit, extra_notes: extraNotes })
        }}
      >
        <p>Ilość:</p>
        <input
          type='number'
          min={0}
          max={999999}
          step={0.01}
          defaultValue={props.lackingItemsShoppingListEntry.quantity || 0}
          name='quantity'
        />
        <p>Jednostka:</p>
        <select
          defaultValue={props.lackingItemsShoppingListEntry.unit || ''}
          name='unit'
        >
          <option value=''>-</option>
          {units?.units.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input
          type='text'
          defaultValue={props.lackingItemsShoppingListEntry.extra_notes || ''}
          name='extraNotes'
        />
        <br />
        {isUpdateItemError ||
          (isDeleteItemError && <ErrorSpan errorText='Wystąpił błąd' />)}
        <div className={commonStyles.modalButtonsContainer}>
          <button
            type='button'
            onClick={() => setIsDeleteItemConfirmationModalVisible(true)}
          >
            Usuń z tej listy
          </button>
          <div>
            <button type='submit'>Zapisz</button>
            <button
              type='button'
              onClick={() => setIsEditionModalVisible(false)}
            >
              Anuluj
            </button>
          </div>
        </div>
      </form>
    </div>
  )

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
            {props.isEditionMode && (
              <ButtonWithIcon
                icon={Pencil}
                text='Edytuj'
                variant='secondary'
                onClick={() => setIsEditionModalVisible(true)}
                iconSize='max(1.4cqw, 12px)'
                fontSize='max(1.4cqw, 12px)'
                padding={4}
              />
            )}
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
      <Modal
        title={
          <>
            Edytuj produkt{' '}
            <b>{props.lackingItemsShoppingListEntry.product_name}</b>
          </>
        }
        isModalVisible={isEditionModalVisible}
        setIsModalVisible={setIsEditionModalVisible}
        body={modalBody}
        isLoading={isUpdateItemPending}
      />
      <ConfirmationModal
        isModalVisible={isDeleteItemConfirmationModalVisible}
        setIsModalVisible={setIsDeleteItemConfirmationModalVisible}
        text='Czy na pewno usunąć ten przedmiot zakupowy z tej listy?'
        onSubmit={() => deleteItem({})}
        isLoading={isDeleteItemPending}
        error={isDeleteItemError ? 'Wystąpił błąd' : undefined}
        dontCloseOnSubmit
      />
    </>
  )
}

export default LackingItemsShoppingListItem
