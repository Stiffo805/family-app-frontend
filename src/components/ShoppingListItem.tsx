import type { ShoppingListEntry } from '@src/api/hooks/useGetShoppingList'
import useGetUnits from '@src/api/hooks/useGetUnits'
import usePatchShoppingListItem from '@src/api/hooks/usePatchShoppingListItem'
import usePutShoppingListItem from '@src/api/hooks/usePutShoppingListItem'
import {
  acknowledgeChange,
  initChangesDB,
  type ModificationType
} from '@src/api/indexedDb'
import ButtonWithIcon from '@src/components/ButtonWithIcon'
import ErrorSpan from '@src/components/ErrorSpan'
import Modal from '@src/components/Modal'
import styles from '@src/components/ShoppingListItem.module.css'
import { Pencil } from 'lucide-react'
import { useState } from 'react'

type ShoppingListItemProps = {
  shoppingListId?: number
  shoppingListEntry: ShoppingListEntry
  modificationType?: ModificationType
  loadChangesFromIdb: () => void
  isEditionMode?: boolean
}

const ShoppingListItem = (props: ShoppingListItemProps) => {
  const [isEditionModalVisible, setIsEditionModalVisible] = useState(false)

  const { data: units } = useGetUnits()

  const {
    mutate: updateItem,
    isError: isUpdateItemError,
    isPending: isUpdateItemPending
  } = usePutShoppingListItem({
    shoppingListId: props.shoppingListId || -1,
    entryId: props.shoppingListEntry.id || -1,
    onSuccess: () => setIsEditionModalVisible(false)
  })

  const { mutate: toggleCheck } = usePatchShoppingListItem({
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

  const getModificationTypeLabel = () => {
    if (props.modificationType === 'created') {
      return 'Dodane'
    }
    if (props.modificationType === 'updated') {
      return 'Zaktulizowane'
    }
    if (props.modificationType === 'deleted') {
      return 'Usunięte'
    }
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

  const modalBody = (
    <div className={styles.editionModalBody}>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const quantity = Number(formData.get('quantity')) ? Number(formData.get('quantity')) : null
          const unit = formData.get('unit') ? formData.get('unit')?.toString() : null
          const extraNotes = formData.get('extraNotes')?.toString()

          updateItem({ quantity, unit, extraNotes })
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
          {units?.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input
          type='text'
          defaultValue={props.shoppingListEntry.extra_notes || ''}
          name='extraNotes'
        />
        {isUpdateItemError && <ErrorSpan errorText='Wystąpił błąd' />}
        <div className={styles.modalButtonsContainer}>
          <button type='submit'>Zapisz</button>
          <button type='button' onClick={() => setIsEditionModalVisible(false)}>
            Anuluj
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <>
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
            {Number(props.shoppingListEntry.quantity) > 0 && (
              <>
                -{' '}
                <span className={styles.entryAmount}>
                  {Number(props.shoppingListEntry.quantity)}{' '}
                  {props.shoppingListEntry.unit_display}
                </span>
              </>
            )}
            <br />
            <span className={styles.additionalNotes}>
              {props.shoppingListEntry.extra_notes
                ? props.shoppingListEntry.extra_notes
                : 'Brak uwag'}
            </span>
            <br />
            {props.modificationType && (
              <span className={styles.modificationTypeLabel}>
                {getModificationTypeLabel()}
              </span>
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
              checked={props.shoppingListEntry.is_checked}
              onClick={() => {
                if (props.modificationType !== 'deleted') toggleCheck()
              }}
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
    </>
  )
}

export default ShoppingListItem
