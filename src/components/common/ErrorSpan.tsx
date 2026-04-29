import styles from '@src/components/common/ErrorSpan.module.css'

type ErrorSpanProps = {
  errorText: string
}

const ErrorSpan = (props: ErrorSpanProps) => {
  return <span className={styles.errorSpan}>{props.errorText}</span>
}

export default ErrorSpan