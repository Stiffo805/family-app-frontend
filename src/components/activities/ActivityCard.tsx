import styles from '@src/components/activities/ActivityCard.module.css'
import type { JSX } from 'react'

type ActivityCardProps = {
  title: string
  body: JSX.Element
}

const ActivityCard = (props: ActivityCardProps) => {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{props.title}</p>
      <hr />
      {props.body}
    </div>
  )
}

export default ActivityCard
