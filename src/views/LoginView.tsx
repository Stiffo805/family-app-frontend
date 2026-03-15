import useLogin from '@src/api/hooks/useLogin'
import GoBackArrow from '@src/components/GoBackArrow'
import styles from '@src/views/LoginView.module.css'
import { useEffect, type SyntheticEvent } from 'react'
import { useNavigate } from 'react-router'

const LoginView = () => {
  const navigate = useNavigate()

  const { mutate, isError, isSuccess } = useLogin()

  const handleLoginSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const credentials = Object.fromEntries(formData) as {
      username: string
      password: string
    }

    mutate(credentials)
  }

  useEffect(() => {
    if (isSuccess) {
      navigate('/shopping')
    }
  }, [isSuccess, navigate])

  return (
    <div className={styles.mainContainer}>
      <GoBackArrow targetUrl='/' />
      <div className={styles.loginFormContainer}>
        <form onSubmit={handleLoginSubmit}>
          <input type='text' placeholder='Nazwa użytkownika' name='username' />
          <br />
          <input type='password' placeholder='Hasło' name='password' />
          <br />
          <button className={styles.loginButton}>Zaloguj</button>
          <br />
          {isError && (
            <p className={styles.errorHolder}>Nie udało się zalogować</p>
          )}
        </form>
      </div>
    </div>
  )
}

export default LoginView
