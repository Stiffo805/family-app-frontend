import styles from '@src/components/ConfirmationModal.module.css'
import type { Dispatch, SetStateAction } from 'react'

type ConfirmationModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  text: string
  onCancel?: () => void
  onSubmit?: () => void
}

const ConfirmationModal = (props: ConfirmationModalProps) => {
  if (!props.isModalVisible) return null

  return (
    <>
      <div
        className={styles.modalBackground}
        onClick={() => props.setIsModalVisible(false)}
      ></div>
      <div className={styles.modalContainer}>
        <p>{props.text}</p>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              props.onCancel?.()
              props.setIsModalVisible(false)
            }}
          >
            Anuluj
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              props.onSubmit?.()
              props.setIsModalVisible(false)
            }}
          >
            Potwierdź
          </button>
        </div>
      </div>
    </>
  )
}

export default ConfirmationModal
