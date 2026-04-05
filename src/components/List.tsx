import type { ListItem } from '@src/util/types'
import styles from '@src/components/List.module.css'
import { useMemo } from 'react'

type ListProps = {
  type?: 'ol' | 'ul' | 'none'
  items: ListItem[]
}

const List = (props: ListProps) => {
  const listElements = useMemo(
    () =>
      props.items.map((item, index) => (
        <li
          key={index}
          className={`${props.type !== 'none' ? styles.usualListElement : ''}`}
        >
          {item.customListStyleType ?? ''}
          {item.name && (
            <>
              <span className={styles.listItemName}>{item.name}</span>:{' '}
            </>
          )}
          <span>{item.value}</span>
        </li>
      )),
    [props.items, props.type]
  )

  if (props.type === 'ul') {
    return <ul>{listElements}</ul>
  }

  if (props.type === 'ol') {
    return <ol>{listElements}</ol>
  }

  return (
    <ul
      style={{
        listStyleType: 'none'
      }}
    >
      {listElements}
    </ul>
  )
}

export default List
