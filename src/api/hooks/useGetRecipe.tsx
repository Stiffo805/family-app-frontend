import { apiUrl } from '@src/api/baseUrl'
import { useQuery } from '@tanstack/react-query'

type UseGetRecipeSettings = {
  recipeId: number
  lazy?: boolean
}

export type Equipment = {
  id?: number
  name: string
}

export type Ingredient = {
  id?: number
  name: string
  quantity: number
  unit: string
  unit_display: string
}

export type Recipe = {
  id: number
  title: string
  author: string
  preparation_time: string
  required_equipment: Equipment[]
  description: string
  ingredients: Ingredient[]
}

const useGetRecipe = (props: UseGetRecipeSettings) => {
  const getRecipe = (): Promise<Recipe> =>
    fetch(`${apiUrl}/recipes/${props.recipeId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok')
        return response.json()
      })
      .catch(() => {
        const saved = localStorage.getItem(`recipe-${props.recipeId}`)
        return saved ? JSON.parse(saved) : undefined
      })
      .then((data) => data)

  const recipeQuery = useQuery({
    queryKey: [`recipe-${props.recipeId}`],
    queryFn: getRecipe,
    enabled: !props.lazy
  })

  return {
    data: recipeQuery.data,
    isError: !!recipeQuery.error,
    isLoading: recipeQuery.isLoading,
    refetch: recipeQuery.refetch
  }
}

export default useGetRecipe
