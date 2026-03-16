import useGetIsAlive from '@src/api/hooks/useGetIsAlive'
import CenteredTileWrapper from '@src/components/CenteredTileWrapper'
import { type PropsWithChildren } from 'react'
import styles from '@src/components/IsAliveProvider.module.css'

const IsAliveProvider = (props: PropsWithChildren) => {
  const { isError, isLoading } = useGetIsAlive()

  if (isLoading)
    return (
      <CenteredTileWrapper containerMinHeight='100vh'>
        <div className={styles.inactiveServerInfoContainer}>
          <header>Testowanie połączenia z serwerem</header>
          <p>Proszę czekać</p>
        </div>
      </CenteredTileWrapper>
    )

  if (isError)
    return (
      <CenteredTileWrapper containerMinHeight='100vh'>
        <div className={styles.inactiveServerInfoContainer}>
          <header>Serwer nieaktywny</header>
          <p>Proszę poczekać około 1 minuty i odświeżyć stronę</p>
        </div>
      </CenteredTileWrapper>
    )

  return props.children
}

export default IsAliveProvider
