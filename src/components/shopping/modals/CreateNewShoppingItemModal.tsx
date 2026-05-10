import { useGetAllTags, usePostShoppingListItem } from '@src/api/shopping'
import Modal from '@src/components/common/Modal'
import { useState, type Dispatch, type SetStateAction } from 'react'
import commonModalsStyles from '@src/components/shopping/modals/CommonModalsStyles.module.css'
import type { Tag } from '@src/util/types'
import Dropdown from '@src/components/common/Dropdown'
import { PlusIcon, X } from 'lucide-react'

type CreateNewShoppingItemModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  setIsNewTagCreationModalVisible: Dispatch<SetStateAction<boolean>>
}

const CreateNewShoppingItemModal = (props: CreateNewShoppingItemModalProps) => {
  const [checkedTags, setCheckedTags] = useState<Tag[]>([])

  const { data: allTags } = useGetAllTags()

  const {
    mutate: createItem,
    isError: isCreateItemError,
    reset: resetErrors
  } = usePostShoppingListItem({
    onSuccess: () => {
      props.setIsModalVisible(false)
      setCheckedTags([])
    }
  })

  const body = (
    <div className={commonModalsStyles.modalBody}>
      <hr />
      <form
        id='create-item-form'
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const itemName = formData.get('productName')

          createItem({
            name: itemName,
            tags_ids: checkedTags.map((tag) => tag.id)
          })
        }}
      >
        <p>Nazwa: </p>
        <input type='text' name='productName' />
        <br />
        <p>Etykiety: </p>
        <div className={commonModalsStyles.tagsDropdownContainer}>
          <Dropdown
            dropdownText='Wybierz etykietę...'
            items={
              allTags?.items
                .filter(
                  (tag) =>
                    !checkedTags
                      .map((checkedTag) => checkedTag.id)
                      .includes(tag.id)
                )
                .sort((tag1, tag2) => tag1.name.localeCompare(tag2.name))
                .map((tag) => ({
                  label: tag.name,
                  onClick: () => {
                    setCheckedTags((cur) =>
                      [...cur, tag].sort((tag1, tag2) =>
                        tag1.name.localeCompare(tag2.name)
                      )
                    )
                  }
                })) ?? []
            }
          />
          <PlusIcon
            size={26}
            className={commonModalsStyles.plusIcon}
            onClick={() => props.setIsNewTagCreationModalVisible(true)}
          />
        </div>
        <div className={commonModalsStyles.checkedTagContainer}>
          {checkedTags.map((checkedTag) => (
            <div className={commonModalsStyles.checkedTagBadge}>
              <p>{checkedTag.name}</p>
              <X
                onClick={() =>
                  setCheckedTags((cur) =>
                    cur
                      .filter((tag) => tag.id !== checkedTag.id)
                      .sort((tag1, tag2) => tag1.name.localeCompare(tag2.name))
                  )
                }
                className={commonModalsStyles.tagX}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  )

  return (
    <Modal
      isModalVisible={props.isModalVisible}
      setIsModalVisible={props.setIsModalVisible}
      title='Tworzenie nowego przedmiotu zakupowego'
      error={
        isCreateItemError
          ? 'Istnieje już przedmiot zakupowy o tej nazwie'
          : undefined
      }
      body={body}
      footerConfig={{
        buttons: [
          {
            label: 'Stwórz',
            type: 'submit',
            form: 'create-item-form'
          },
          {
            label: 'Anuluj',
            type: 'button',
            onClick: () => {
              props.setIsModalVisible(false)
              setCheckedTags([])
              resetErrors()
            },
            backgroundColor: 'var(--rose2)'
          }
        ]
      }}
      minHeight={500}
    />
  )
}

export default CreateNewShoppingItemModal
