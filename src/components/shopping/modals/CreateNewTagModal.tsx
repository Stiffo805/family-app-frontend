import type { Dispatch, SetStateAction } from 'react'
import commonModalsStyles from '@src/components/shopping/modals/CommonModalsStyles.module.css'
import { useCreateTag } from '@src/api/shopping'
import type { ModalFooterConfig } from '@src/components/common/Modal'
import Modal from '@src/components/common/Modal'

type CreateNewTagModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
}

const CreateNewTagModal = (props: CreateNewTagModalProps) => {
  const {
    mutate: createTag,
    reset: resetErrors,
    isError: isCreateTagError
  } = useCreateTag({
    onSuccess: () => props.setIsModalVisible(false)
  })

  const body = (
    <div className={commonModalsStyles.modalBody}>
      <hr />
      <form
        id='create-tag-form'
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const tagName = formData.get('tagName')

          createTag({
            name: tagName
          })
        }}
      >
        <p>Nazwa: </p>
        <input type='text' name='tagName' />
      </form>
    </div>
  )

  const footerConfig: ModalFooterConfig = {
    buttons: [
      {
        label: 'Stwórz',
        type: 'submit',
        form: 'create-tag-form'
      },
      {
        label: 'Anuluj',
        type: 'button',
        onClick: () => {
          props.setIsModalVisible(false)
          resetErrors()
        },
        backgroundColor: 'var(--rose2)'
      }
    ]
  }

  return (
    <Modal
      isModalVisible={props.isModalVisible}
      setIsModalVisible={props.setIsModalVisible}
      body={body}
      error={
        isCreateTagError ? 'Istnieje już etykieta o tej nazwie' : undefined
      }
      footerConfig={footerConfig}
      title='Tworzenie nowej etykiety'
    />
  )
}

export default CreateNewTagModal
