import { axiosClient } from "@src/api/axios"
import { useQuery } from "@tanstack/react-query"

type FamilyMember = {
  id: number
  name: string
}

type FamilyMembersResponse = {
  items: FamilyMember[]
}

const useGetFamilyMembers = () => {
  const getActivitiesMembers = async (): Promise<FamilyMembersResponse> => {
    const token = localStorage.getItem('authToken')
    return axiosClient
      .get(`/activities/members/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => response.data)
  }

  const activitiesMembersQuery = useQuery({
    queryKey: [`activities-members`],
    queryFn: getActivitiesMembers
  })

  return {
    data: activitiesMembersQuery.data,
    isLoading: activitiesMembersQuery.isLoading
  }
}

export default useGetFamilyMembers
