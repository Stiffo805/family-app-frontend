import ButtonWithIcon from '@src/components/ButtonWithIcon'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router'
import styles from '@src/components/LogoutButton.module.css'

const LogoutButton = () => {
  const navigate = useNavigate()

  const token = localStorage.getItem('authToken')

  if (!token) return null

  return (
    <div className={styles.logoutButtonContainer}>
      <ButtonWithIcon text='Wyloguj' icon={LogOut} variant='secondary' onClick={() => {
        localStorage.removeItem('authToken')
        navigate('/login')
      }}/>
    </div>
  )
}

export default LogoutButton
