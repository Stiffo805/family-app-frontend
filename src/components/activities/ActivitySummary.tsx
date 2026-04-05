import { type ActivitiesSummaryResponse } from '@src/api/hooks/useGetActivitiesSummary'
import ActivityCard from '@src/components/activities/ActivityCard'
import styles from '@src/components/activities/ActivitySummary.module.css'

type ActivitySummaryProps = {
  data: ActivitiesSummaryResponse
}

const ActivitySummary = (props: ActivitySummaryProps) => {
  return (
    <ActivityCard
      title='Podsumowanie'
      body={
        <div>
          {props.data?.items.map((item) => (
            <span className={styles.summaryBadge}>
              {item.is_good ? '😊' : '😐'}
              {item.activity_name}
              {' - '}
              {item.time_spent_hours}h
            </span>
          ))}
        </div>
      }
    />
  )
}

export default ActivitySummary
