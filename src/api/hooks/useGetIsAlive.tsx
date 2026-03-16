import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

const useGetIsAlive = () => {
  const getIsAlive = () => axiosClient.get('/alive/')

  const isAliveQuery = useQuery({
    queryKey: ['alive'],
    queryFn: getIsAlive
  })

  return { status: isAliveQuery.status, refetch: isAliveQuery.refetch }
}

export default useGetIsAlive
