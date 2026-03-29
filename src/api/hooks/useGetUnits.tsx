import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'

type CustomUnit = {
  value: string
  label: string
}

type UnitsResponse = {
  units: CustomUnit[]
}

const useGetUnits = () => {
  const getUnits = (): Promise<UnitsResponse> => {
    const token = localStorage.getItem('authToken')
    return axiosClient
      .get(`/shopping/units`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => response.data)
  }

  const unitsQuery = useQuery({
    queryKey: [`units`],
    queryFn: getUnits
  })

  return {
    data: unitsQuery.data?.units,
    isLoading: unitsQuery.isLoading
  }
}

export default useGetUnits
