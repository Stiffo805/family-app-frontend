import type { Dispatch, JSX, SetStateAction } from 'react'
import styles from '@src/components/common/Modal.module.css'
import Spinner from '@src/components/common/Spinner'
import ErrorSpan from '@src/components/common/ErrorSpan'

type ModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  isLoading?: boolean
  title: string | JSX.Element
  body: JSX.Element
  error?: string
  footer?: JSX.Element
}

const Modal = (props: ModalProps) => {
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
            <div className={styles.modalBackground}></div>
            <Spinner />
          </>
        )}
        <div className={styles.modalTitle}>{props.title}</div>
        <div>{props.body}</div>
        {props.error && <ErrorSpan errorText={props.error} />}
        {props.footer && <div className={styles.footer}>{props.footer}</div>}
      </div>
    </>
  )
}

export default Modal
