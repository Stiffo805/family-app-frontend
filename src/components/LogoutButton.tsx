import ButtonWithIcon from '@src/components/ButtonWithIcon'
import { LogOut } from 'lucide-react'
import styles from '@src/components/LogoutButton.module.css'
import ConfirmationModal from '@src/components/ConfirmationModal'
import { useState } from 'react'
import useLogout from '@src/api/hooks/useLogout'

const LogoutButton = () => {
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] =
    useState(false)

  const token = localStorage.getItem('authToken')

  const { mutate: logout } = useLogout()

  if (!token) return null

  return (
    <>
      <div className={styles.logoutButtonContainer}>
        <ButtonWithIcon
          text='Wyloguj'
          icon={LogOut}
          variant='secondary'
          onClick={() => setIsConfirmationModalVisible(true)}
        />
      </div>
      <ConfirmationModal
        isModalVisible={isConfirmationModalVisible}
        setIsModalVisible={setIsConfirmationModalVisible}
        text='Czy na pewno wylogować?'
        onSubmit={logout}
      />
    </>
  )
}

export default LogoutButton
