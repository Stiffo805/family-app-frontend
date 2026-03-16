import type { PropsWithChildren } from 'react'
import styles from '@src/components/CenteredTileWrapper.module.css'

type CenteredTileWrapperProps = {
  containerMinHeight?: string
}

const CenteredTileWrapper = (
  props: PropsWithChildren<CenteredTileWrapperProps>
) => {
  return (
    <div
      className={styles.mainContainer}
      style={{
        minHeight: props.containerMinHeight
      }}
    >
      {props.children}
    </div>
  )
}

export default CenteredTileWrapper
