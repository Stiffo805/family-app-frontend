import ErrorSpan from '@src/components/common/ErrorSpan'
import Modal, { type ModalFooterConfig } from '@src/components/common/Modal'
import { PlusIcon } from 'lucide-react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
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
  justCreatedItemId?: number
}

type AddItemToShoppingListFormData = {
  itemId: number | undefined
  quantity?: number
  unit?: string
  extraNotes?: string
}

const initialFormData = {
  itemId: undefined,
  quantity: undefined,
  unit: '',
  extraNotes: ''
}

const AddItemToShoppingListModal = (props: AddItemToShoppingListModalProps) => {
  const [formData, setFormData] =
    useState<AddItemToShoppingListFormData>(initialFormData)

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (props.justCreatedItemId) setFormData((cur) => ({ ...cur, itemId: props.justCreatedItemId }))
  }, [props.justCreatedItemId])

  const body = (
    <div className={commonModalsStyles.modalBody}>
      <hr />
      <form
        id='add-item-form'
        onSubmit={(e) => {
          e.preventDefault()

          if (props.shoppingListId)
            addItemToList({
              item_id: formData.itemId,
              quantity: formData.quantity,
              unit: formData.unit,
              extra_notes: formData.extraNotes
            })
          else
            createLackingItem({
              item_id: formData.itemId,
              quantity: formData.quantity,
              unit: formData.unit,
              extra_notes: formData.extraNotes
            })
        }}
      >
        <p>Przedmiot zakupowy: </p>
        <div className={commonModalsStyles.shoppingItemsDropdown}>
          <select
            name='itemId'
            value={formData.itemId}
            onChange={(e) =>
              setFormData((cur) => ({ ...cur, itemId: Number(e.target.value) }))
            }
          >
            <option value={undefined}>Wybierz...</option>
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
        <input
          type='number'
          min={0}
          max={999999}
          step={0.01}
          name='quantity'
          value={formData.quantity}
          onChange={(e) =>
            setFormData((cur) => ({ ...cur, quantity: Number(e.target.value) }))
          }
        />
        <p>Jednostka:</p>
        <select
          name='unit'
          value={formData.unit}
          onChange={(e) =>
            setFormData((cur) => ({ ...cur, unit: e.target.value }))
          }
        >
          <option value=''>-</option>
          {units?.units.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input
          type='text'
          name='extraNotes'
          value={formData.extraNotes}
          onChange={(e) =>
            setFormData((cur) => ({ ...cur, extraNotes: e.target.value }))
          }
        />
      </form>
    </div>
  )

  const footerConfig: ModalFooterConfig = {
    buttons: [
      {
        label: 'Dodaj',
        type: 'submit',
        form: 'add-item-form',
        disabled: formData.itemId === undefined
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
