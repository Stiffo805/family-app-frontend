import { axiosClient } from "@src/api/axios"
import { useQuery } from "@tanstack/react-query"

export type Tag = {
  id: number
  name: string
}

type TagsResponse = {
  items: Tag[]
}

const useGetTags = () => {
  const getTags = (): Promise<TagsResponse> => {
    const token = localStorage.getItem('authToken')
    return axiosClient
      .get(`/shopping/tags`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
      .then((response) => response.data)
  }

  const tagsQuery = useQuery({
    queryKey: ['tags'],
    queryFn: getTags
  })

  return {
    data: tagsQuery.data,
    isLoading: tagsQuery.isLoading
  }
}

export default useGetTags