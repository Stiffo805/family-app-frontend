import useGetIsAlive from '@src/api/hooks/useGetIsAlive'
import CenteredTileWrapper from '@src/components/CenteredTileWrapper'
import {
  useContext,
  useEffect,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction
} from 'react'
import styles from '@src/components/IsAliveProvider.module.css'
import { OfflineModeContext } from '@src/util/context'

type IsAliveProviderProps = {
  setIsConnection: Dispatch<SetStateAction<boolean>>
}

const IsAliveProvider = (props: PropsWithChildren<IsAliveProviderProps>) => {
  const { isError, isLoading } = useGetIsAlive()

  const offlineModeContext = useContext(OfflineModeContext)

  useEffect(() => {
    if (!isError && !isLoading) props.setIsConnection(true)
    else props.setIsConnection(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isLoading, props.setIsConnection])

  if (!offlineModeContext.offlineMode) {
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
  }

  return props.children
}

export default IsAliveProvider
