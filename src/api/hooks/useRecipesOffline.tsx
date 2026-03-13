import useGetRecipe from '@src/api/hooks/useGetRecipe'
import { mapRecipeToRecipeInfo } from '@src/util/helpers'
import diff from 'microdiff'
import { useState } from 'react'

type UseSaveRecipeOfflineProps = {
  recipeId: number
}

const useRecipesOffline = (props: UseSaveRecipeOfflineProps) => {
  const recipeQuery = useGetRecipe({ recipeId: props.recipeId, lazy: true })

  const [isSaveSuccess, setIsSaveSuccess] = useState(false)
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false)

  const saveRecipeToLocalStorage = async () => {
    // 1. Extract fresh data directly from the refetch promise
    const { data: fetchedRecipe } = await recipeQuery.refetch()

    if (!fetchedRecipe) {
      // 2. Throw an error so the .then() chain in the UI is stopped
      throw new Error('Recipe could not be fetched for offline storage.')
    }

    let savedRecipes = [] // Default to an empty array

    try {
      const savedRecipesString = localStorage.getItem('recipes')
      if (savedRecipesString) {
        savedRecipes = JSON.parse(savedRecipesString)

        // Safety check: ensure it's actually an array
        // in case someone manually messed with localStorage
        if (!Array.isArray(savedRecipes)) {
          savedRecipes = []
        }
      }
    } catch (error) {
      console.error('Failed to parse recipes from local storage:', error)
      savedRecipes = [] // Fallback on parse error
    }

    // 3. Optional but recommended: Prevent saving duplicates
    const equalityCandidate = savedRecipes.find((r) => r.id === props.recipeId)
    const isAlreadySaved =
      equalityCandidate && !diff(equalityCandidate, fetchedRecipe).length

    if (!isAlreadySaved) {
      const newRecipes = [...savedRecipes, mapRecipeToRecipeInfo(fetchedRecipe)]
      localStorage.setItem('recipes', JSON.stringify(newRecipes))
    }

    // Save the detailed recipe view
    localStorage.setItem(
      `recipe-${props.recipeId}`,
      JSON.stringify(fetchedRecipe)
    )

    setIsSaveSuccess(true)
  }

  const removeRecipeFromLocalStorage = async () => {
    let savedRecipes = [] // Default to an empty array

    try {
      const savedRecipesString = localStorage.getItem('recipes')
      if (savedRecipesString) {
        savedRecipes = JSON.parse(savedRecipesString)

        // Safety check: ensure it's actually an array
        // in case someone manually messed with localStorage
        if (!Array.isArray(savedRecipes)) {
          savedRecipes = []
        }
      }
    } catch (error) {
      console.error('Failed to parse recipes from local storage:', error)
      savedRecipes = [] // Fallback on parse error
    }

    const newRecipes = savedRecipes.filter(
      (savedRecipe) => savedRecipe.id !== props.recipeId
    )
    localStorage.setItem('recipes', JSON.stringify(newRecipes))

    localStorage.removeItem(`recipe-${props.recipeId}`)

    setIsDeleteSuccess(true)
  }

  return {
    removeRecipeFromLocalStorage,
    saveRecipeToLocalStorage,
    isSaveSuccess,
    isDeleteSuccess
  }
}

export default useRecipesOffline
