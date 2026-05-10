import ErrorSpan from '@src/components/common/ErrorSpan'
import Modal, { type ModalFooterConfig } from '@src/components/common/Modal'
import { PlusIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import commonModalsStyles from '@src/components/shopping/modals/CommonModalsStyles.module.css'
import {
  useAddShoppingListItemToList,
  useCreateLackingShoppingListItem,
  useGetAllShoppingItems,
  useGetAllUnits
} from '@src/api/shopping'

type AddItemToShoppingListModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  setIsNewProductCreationModalVisible: Dispatch<SetStateAction<boolean>>
  shoppingListId?: number
}

const AddItemToShoppingListModal = (props: AddItemToShoppingListModalProps) => {
  const { data: units } = useGetAllUnits()

  const { data: shoppingItems } = useGetAllShoppingItems()

  const {
    mutate: addItemToList,
    isError: isAddItemToListError,
    isPending: isAddItemToListPending,
    reset: resetAddItemToListErrors
  } = useAddShoppingListItemToList({
    shoppingListId: props.shoppingListId,
    onSuccess: () => {
      props.setIsModalVisible(false)
    }
  })

  const {
    mutate: createLackingItem,
    isError: isCreateLackingItemError,
    isPending: isCreateLackingItemPending,
    reset: resetCreateLackingItemErrors
  } = useCreateLackingShoppingListItem({
    onSuccess: () => {
      props.setIsModalVisible(false)
    }
  })

  const body = (
    <div className={commonModalsStyles.modalBody}>
      <hr />
      <form
        id='add-item-form'
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const itemId = Number(formData.get('itemId'))
          const quantity = Number(formData.get('quantity'))
            ? Number(formData.get('quantity'))
            : null
          const unit = formData.get('unit')
            ? formData.get('unit')?.toString()
            : null
          const extraNotes = formData.get('extraNotes')?.toString()

          if (props.shoppingListId)
            addItemToList({
              item_id: itemId,
              quantity: quantity,
              unit: unit,
              extra_notes: extraNotes
            })
          else
            createLackingItem({
              item_id: itemId,
              quantity: quantity,
              unit: unit,
              extra_notes: extraNotes
            })
        }}
      >
        <p>Przedmiot zakupowy: </p>
        <div className={commonModalsStyles.shoppingItemsDropdown}>
          <select name='itemId'>
            {shoppingItems?.all_items
              .sort((item1, item2) => item1.name.localeCompare(item2.name))
              .map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
          </select>
          <PlusIcon
            size={26}
            className={commonModalsStyles.plusIcon}
            onClick={() => props.setIsNewProductCreationModalVisible(true)}
          />
        </div>
        {isAddItemToListError && (
          <ErrorSpan errorText='Na tej liście występuje już ten przedmiot zakupowy' />
        )}
        {isCreateLackingItemError && (
          <ErrorSpan errorText='Istnieje już na liście brakujący przedmiot zakupowy o tej nazwie' />
        )}
        <p>Ilość:</p>
        <input type='number' min={0} max={999999} step={0.01} name='quantity' />
        <p>Jednostka:</p>
        <select name='unit'>
          <option value=''>-</option>
          {units?.units.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input type='text' name='extraNotes' />
      </form>
    </div>
  )

  const footerConfig: ModalFooterConfig = {
    buttons: [
      {
        label: 'Dodaj',
        type: 'submit',
        form: 'add-item-form'
      },
      {
        label: 'Anuluj',
        onClick: () => {
          props.setIsModalVisible(false)
          resetAddItemToListErrors()
          resetCreateLackingItemErrors()
        },
        type: 'button',
        backgroundColor: 'var(--rose2)'
      }
    ]
  }

  return (
    <Modal
      isModalVisible={props.isModalVisible}
      setIsModalVisible={props.setIsModalVisible}
      body={body}
      footerConfig={footerConfig}
      title='Dodawanie produktu do listy'
      isLoading={isAddItemToListPending || isCreateLackingItemPending}
    />
  )
}

export default AddItemToShoppingListModal
