import useGetRecipesList, {
  type RecipeInfo
} from '@src/api/hooks/useGetRecipesList'
import Breadcrumb from '@src/components/Breadcrumb'
import RecipeTile from '@src/components/RecipeTile'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/RecipesView.module.css'
import diff from 'microdiff'
import { useCallback } from 'react'

const RecipesView = () => {
  const { data, isLoading, isUsingLocalData } = useGetRecipesList()

  const isRecipeSavedLocally = useCallback((recipe: RecipeInfo): boolean => {
    try {
      const parsedRecipes: { id: number }[] = JSON.parse(
        localStorage.getItem('recipes') ?? '[]'
      )
      const equalityCandidate = parsedRecipes.find(
        (item) => item.id === recipe.id
      )
      if (!equalityCandidate) return false
      console.log(diff(equalityCandidate, recipe))
      return !diff(equalityCandidate, recipe).length
    } catch {
      return false
    }
  }, [])

  return (
    <div className={styles.mainContainer}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.mainHeader}>
            <Breadcrumb
              text={`Wybierz przepis ${isUsingLocalData ? '(offline)' : ''}`}
            />
          </div>
          <div className={styles.recipesTilesContainer}>
            {data?.recipes?.map((recipe) => (
              <RecipeTile
                recipe={recipe}
                isRecipeSavedLocally={isRecipeSavedLocally}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RecipesView
