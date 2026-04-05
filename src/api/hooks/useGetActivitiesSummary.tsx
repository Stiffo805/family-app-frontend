import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

type UseGetActivitiesSummaryProps = {
  familyMemberId: number
}

type ActivitySummary = {
  activity_id: number
  activity_name: string
  is_good: boolean
  time_spent_hours: number
}

export type ActivitiesSummaryResponse = {
  items: ActivitySummary[]
}

const useGetActivitiesSummary = (props: UseGetActivitiesSummaryProps) => {
  const getActivitiesSummary = async (): Promise<ActivitiesSummaryResponse | undefined> => {
    const token = localStorage.getItem('authToken')
    return axiosClient
      .get(`/activities/members/${props.familyMemberId}/summary/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => response.data)
  }

  const activitiesSummaryQuery = useQuery({
    queryKey: [`activities-members-${props.familyMemberId}-summary`],
    queryFn: getActivitiesSummary
  })

  return {
    data: activitiesSummaryQuery.data,
    isLoading: activitiesSummaryQuery.isLoading
  }
}

export default useGetActivitiesSummary
