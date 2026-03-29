import styles from '@src/components/ConfirmationModal.module.css'
import DarkenedBackground from '@src/components/DarkenedBackground'
import ErrorSpan from '@src/components/ErrorSpan'
import Spinner from '@src/components/Spinner'
import type { Dispatch, SetStateAction } from 'react'

type ConfirmationModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  text: string
  dontCloseOnSubmit?: boolean
  error?: string
  isLoading?: boolean
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
        {props.isLoading && (
          <>
            <Spinner />
            <DarkenedBackground />
          </>
        )}
        <p>{props.text}</p>
        {props.error && <ErrorSpan errorText={props.error} />}
        <div className={styles.buttonsContainer}>
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
              if (!props.dontCloseOnSubmit) props.setIsModalVisible(false)
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
