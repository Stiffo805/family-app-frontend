import { ArrowLeft } from 'lucide-react'
import styles from '@src/components/GoBackArrow.module.css'
import { useNavigate } from 'react-router'

type GoBackArrowProps = {
  targetUrl: string
}

const GoBackArrow = (props: GoBackArrowProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.arrowContainer} onClick={() => navigate(props.targetUrl)}>
      <ArrowLeft />
    </div>
  )
}

export default GoBackArrow
