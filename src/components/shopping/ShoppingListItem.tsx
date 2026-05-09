import ButtonWithIcon from '@src/components/common/ButtonWithIcon'
import ConfirmationModal from '@src/components/common/ConfirmationModal'
import ErrorSpan from '@src/components/common/ErrorSpan'
import Modal from '@src/components/common/Modal'
import commonStyles from '@src/commonStyles/ShoppingListItemCommonStyles.module.css'
import { convertDateToReadable } from '@src/util/helpers'
import type { ShoppingListItemsSortingType } from '@src/views/shopping/ShoppingListView'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import useCustomMutation from '@src/api/hooks/useCustomMutation'
import { queryClient } from '@src/api/queryClient'
import useCustomQuery from '@src/api/hooks/useCustomQuery'
import type { ShoppingListEntry, UnitsResponse } from '@src/util/types'

type ShoppingListItemProps = {
  shoppingListId?: number
  shoppingListEntry: ShoppingListEntry
  tagsNames: string[]
  isEditionMode?: boolean
  sorting?: ShoppingListItemsSortingType
}

const ShoppingListItem = (props: ShoppingListItemProps) => {
  const [isEditionModalVisible, setIsEditionModalVisible] = useState(false)
  const [
    isDeleteItemConfirmationModalVisible,
    setIsDeleteItemConfirmationModalVisible
  ] = useState(false)

  const { data: units } = useCustomQuery<UnitsResponse>({
    method: 'GET',
    queryKey: ['units'],
    url: '/shopping/units/'
  })

  const {
    mutate: updateItem,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending
  } = useCustomMutation({
    method: 'PUT',
    url: `/shopping/lists/${props.shoppingListId}/entries/${props.shoppingListEntry.id}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
      setIsEditionModalVisible(false)
    }
  })

  const { mutate: toggleCheck } = useCustomMutation({
    method: 'PATCH',
    url: `/shopping/lists/${props.shoppingListId}/entries/${props.shoppingListEntry.id}/`,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
  })

  const {
    mutate: deleteItem,
    isPending: isDeleteItemPending,
    isError: isDeleteItemError
  } = useCustomMutation({
    method: 'DELETE',
    url: `/shopping/lists/${props.shoppingListId}/entries/${props.shoppingListEntry.id}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${props.shoppingListId}`]
      })
      setIsDeleteItemConfirmationModalVisible(false)
      setIsEditionModalVisible(false)
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
          defaultValue={props.shoppingListEntry.quantity || 0}
          name='quantity'
        />
        <p>Jednostka:</p>
        <select defaultValue={props.shoppingListEntry.unit || ''} name='unit'>
          <option value=''>-</option>
          {units?.units.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input
          type='text'
          defaultValue={props.shoppingListEntry.extra_notes || ''}
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
        className={`${commonStyles.shoppingListItem} ${props.shoppingListEntry.is_checked ? commonStyles.checkedListItem : ''}`}
      >
        <div className={commonStyles.mainEntryContainer}>
          <div className={commonStyles.textContentContainer}>
            <span className={commonStyles.entryName}>
              {props.shoppingListEntry.product_name}
            </span>{' '}
            {Number(props.shoppingListEntry.quantity) > 0 && (
              <>
                -{' '}
                <span className={commonStyles.entryAmount}>
                  {Number(props.shoppingListEntry.quantity)}{' '}
                  {props.shoppingListEntry.unit_display}
                </span>
              </>
            )}
            <br />
            <span className={commonStyles.additionalNotes}>
              {props.shoppingListEntry.extra_notes
                ? props.shoppingListEntry.extra_notes
                : 'Brak uwag'}
            </span>
            {props.sorting === 'timestamp' && (
              <>
                <br />
                <span className={commonStyles.lastUpdateDateLabel}>
                  Ostatnia aktualizacja:{' '}
                  {props.shoppingListEntry.updated_at
                    ? convertDateToReadable(props.shoppingListEntry.updated_at)
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
          <div className={commonStyles.shoppingItemPostfix}>
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
              checked={props.shoppingListEntry.is_checked}
              onClick={() =>
                toggleCheck({
                  is_checked: !props.shoppingListEntry.is_checked
                })
              }
            />
          </div>
        </div>
      </li>
      <Modal
        title={
          <>
            Edytuj produkt <b>{props.shoppingListEntry.product_name}</b>
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

export default ShoppingListItem
