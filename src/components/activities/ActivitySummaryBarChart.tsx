import type { ActivitiesSummaryResponse } from '@src/api/hooks/useGetActivitiesSummary'
import ActivityCard from '@src/components/activities/ActivityCard'
import { Bar, BarChart, Rectangle, ResponsiveContainer, XAxis } from 'recharts'

type ActivitySummaryChartProps = {
  data: ActivitiesSummaryResponse
}

const ActivitySummaryBarChart = (props: ActivitySummaryChartProps) => {
  const chartData = props.data.items ?? []

  return (
    <ActivityCard
      title='Podsumowanie - wykres'
      body={
        <ResponsiveContainer height={400} width='100%'>
          <BarChart barCategoryGap='10%' barGap={4} data={chartData}>
            <Bar
              dataKey='time_spent_hours'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const fillColor = props.payload.is_good ? '#4ade80' : '#f87171'

                return <Rectangle {...props} fill={fillColor} />
              }}
            />
            <XAxis dataKey='activity_name' />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  )
}

export default ActivitySummaryBarChart
