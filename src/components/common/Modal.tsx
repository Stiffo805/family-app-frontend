import { useEffect, type Dispatch, type JSX, type SetStateAction } from 'react'
import styles from '@src/components/common/Modal.module.css'
import Spinner from '@src/components/common/Spinner'
import ErrorSpan from '@src/components/common/ErrorSpan'

type ButtonConfig = {
  label: string
  onClick?: () => void
  backgroundColor?: string
  color?: string
  type: 'submit' | 'button'
  form?: string
}

export type ModalFooterConfig = {
  buttons: ButtonConfig[]
}

type ModalProps = {
  isModalVisible: boolean
  setIsModalVisible: Dispatch<SetStateAction<boolean>>
  isLoading?: boolean
  onExited?: () => void
  title: string | JSX.Element
  body: JSX.Element
  minHeight?: string | number
  error?: string
  footerConfig?: ModalFooterConfig
}

const Modal = (props: ModalProps) => {
  if (!props.isModalVisible) return null

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!props.isModalVisible) props.onExited?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isModalVisible, props.onExited])

  return (
    <>
      <div
        className={styles.modalBackground}
        onClick={() => props.setIsModalVisible(false)}
      ></div>
      <div
        className={styles.modalContainer}
        style={{
          minHeight: props.minHeight
        }}
      >
        {props.isLoading && (
          <>
            <div className={styles.modalBackground}></div>
            <Spinner />
          </>
        )}
        <div className={styles.modalTitle}>{props.title}</div>
        <div>{props.body}</div>
        {props.error && <ErrorSpan errorText={props.error} />}
        {props.footerConfig && (
          <div className={styles.footer}>
            {props.footerConfig.buttons.map((btn) => (
              <button
                type={btn.type}
                form={btn.form ? btn.form : undefined}
                style={{
                  backgroundColor: btn.backgroundColor,
                  color: btn.color
                }}
                onClick={btn.onClick}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Modal
