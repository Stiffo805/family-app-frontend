import { axiosClient } from '@src/api/axios'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export type RecipeInfo = {
  id: number
  title: string
  author: string
  preparation_time: string
}

export type RecipesInfosList = {
  recipes: RecipeInfo[] | undefined
}

const useGetRecipesList = () => {
  const [isUsingLocalData, setIsUsingLocalData] = useState(false)

  const getRecipes = (): Promise<RecipesInfosList> =>
    axiosClient
      .get(`/recipes`)
      .then((response) => {
        if (!response.data) throw new Error('Network response was not ok')
        setIsUsingLocalData(false)
        return response.data
      })
      .catch(() => {
        const saved = localStorage.getItem('recipes')
        setIsUsingLocalData(true)
        return saved ? { recipes: JSON.parse(saved) } : undefined
      })
      .then((data) => data)

  const recipesQuery = useQuery({
    queryKey: [`recipes`],
    queryFn: getRecipes
  })

  return {
    data: recipesQuery.data,
    isUsingLocalData,
    isLoading: recipesQuery.isLoading
  }
}

export default useGetRecipesList
