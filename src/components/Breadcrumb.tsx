import styles from '@src/components/Breadcrumb.module.css'

type BreadcrumbProps = {
  text: string
}

const Breadcrumb = (props: BreadcrumbProps) => {
  return <div className={styles.breadcrumbContainer}>{props.text}</div>
}

export default Breadcrumb