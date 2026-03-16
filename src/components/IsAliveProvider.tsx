import useGetIsAlive from '@src/api/hooks/useGetIsAlive'
import CenteredTileWrapper from '@src/components/CenteredTileWrapper'
import { useEffect, type PropsWithChildren } from 'react'
import styles from '@src/components/IsAliveProvider.module.css'
import { queryClient } from '@src/api/queryClient'

const IsAliveProvider = (props: PropsWithChildren) => {
  const { status } = useGetIsAlive()

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['alive']
    })
  }, [])

  if (status !== 'success')
    return (
      <CenteredTileWrapper containerMinHeight='100vh'>
        <div className={styles.inactiveServerInfoContainer}>
          <header>Serwer nieaktywny</header>
          <p>Prosimy poczekać około 1 minuty i odświeżyć stronę</p>
        </div>
      </CenteredTileWrapper>
    )

  return props.children
}

export default IsAliveProvider
