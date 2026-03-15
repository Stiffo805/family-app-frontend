import ButtonWithIcon from '@src/components/ButtonWithIcon'
import styles from '@src/views/IndexView.module.css'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router'

const IndexView = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.indexViewContainer}>
      <div className={styles.indexViewMainCard}>
        <nav>
          <ButtonWithIcon
            text='Przejdź do przepisów'
            icon={ArrowRight}
            variant='secondary'
            onClick={() => navigate('/recipes')}
          />
          <p>Nie wymaga logowania</p>
        </nav>
        <nav>
          <ButtonWithIcon
            text='Przejdź do list zakupów'
            icon={ArrowRight}
            variant='secondary'
            onClick={() => navigate('/shopping')}
          />
          <p>Wymaga logowania</p>
        </nav>
      </div>
    </div>
  )
}

export default IndexView
