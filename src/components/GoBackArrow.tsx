import { ArrowLeft } from 'lucide-react'
import styles from '@src/components/GoBackArrow.module.css'
import { useNavigate } from 'react-router'

type GoBackArrowProps = {
  targetUrl: string
  left?: string
  top?: string
}

const GoBackArrow = (props: GoBackArrowProps) => {
  const navigate = useNavigate()

  return (
    <div
      className={styles.arrowContainer}
      onClick={() => navigate(props.targetUrl)}
      style={{
        left: props.left,
        top: props.top
      }}
    >
      <ArrowLeft />
    </div>
  )
}

export default GoBackArrow
