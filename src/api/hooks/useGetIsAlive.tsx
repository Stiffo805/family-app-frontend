import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

const useGetIsAlive = () => {
  const getIsAlive = () => axiosClient.get('/alive/')

  const isAliveQuery = useQuery({
    queryKey: ['alive'],
    queryFn: getIsAlive,
    refetchInterval: 10000,
    retry: false,
    refetchOnWindowFocus: true
  })

  return { isError: isAliveQuery.isError, isLoading: isAliveQuery.isLoading }
}

export default useGetIsAlive
