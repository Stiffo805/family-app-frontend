import { Loader } from 'lucide-react'
import styles from '@src/components/Spinner.module.css'

const Spinner = () => {
  return (
    <div className={styles.loaderContainer}>
      <Loader size={32} />
    </div>
  )
}

export default Spinner
