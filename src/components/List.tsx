import type { ListItem } from '@src/util/types'
import styles from '@src/components/List.module.css'
import { useMemo } from 'react'

type ListProps = {
  type: 'ol' | 'ul'
  items: ListItem[]
}

const List = (props: ListProps) => {
  const listElements = useMemo(
    () =>
      props.items.map((item, index) => (
        <li key={index}>
          {item.name && (
            <>
              <span className={styles.listItemName}>{item.name}</span>:{' '}
            </>
          )}
          <span>{item.value}</span>
        </li>
      )),
    [props.items]
  )

  return props.type === 'ul' ? <ul>{listElements}</ul> : <ol>{listElements}</ol>
}

export default List
