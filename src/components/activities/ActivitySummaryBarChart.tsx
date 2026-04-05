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
        <ResponsiveContainer height={900} width='100%'>
          <BarChart barCategoryGap='2%' barGap={4} data={chartData}>
            <Bar
              dataKey='time_spent_hours'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              shape={(props: any) => {
                const fillColor = props.payload.is_good ? '#4ade80' : '#f87171'

                return <Rectangle {...props} fill={fillColor} />
              }}
            />
            <XAxis
              dataKey='activity_name'
              interval={0}
              angle={-90}
              textAnchor='end'
              fontSize='clamp(14px, 2.5cqw, 24px)'
              height={500}
            />
          </BarChart>
        </ResponsiveContainer>
      }
    />
  )
}

export default ActivitySummaryBarChart
