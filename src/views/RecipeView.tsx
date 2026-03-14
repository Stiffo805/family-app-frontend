import List from '@src/components/List'
import styles from '@src/views/RecipeView.module.css'
import useGetRecipe from '@src/api/hooks/useGetRecipe'
import { useParams } from 'react-router'
import { useMemo } from 'react'
import {
  convertDurationToReadablePreparationTime,
  parseDuration
} from '@src/util/helpers'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import GoBackArrow from '@src/components/GoBackArrow'
import { Save } from 'lucide-react'
import useRecipesOffline from '@src/api/hooks/useRecipesOffline'
import Spinner from '@src/components/Spinner'
import diff from 'microdiff'
import ButtonWithIcon from '@src/components/ButtonWithIcon'

const RecipeView = () => {
  const params = useParams()
  const { data: recipe, isLoading } = useGetRecipe({
    recipeId: Number(params.recipeId)
  })

  const ingredients = useMemo(
    () =>
      recipe?.ingredients.map((ingredient) => ({
        name: ingredient.name,
        value: Number(ingredient.quantity) + ' ' + ingredient.unit_display
      })),
    [recipe?.ingredients]
  )

  const requiredEquipment = useMemo(
    () =>
      recipe?.required_equipment.map((item) => ({
        value: item.name
      })),
    [recipe?.required_equipment]
  )

  const {
    saveRecipeToLocalStorage,
    isSaveSuccess: isSaveRecipeOfflineSuccess
  } = useRecipesOffline({
    recipeId: recipe?.id || -1
  })

  const isRecipeSavedLocally = useMemo(() => {
    try {
      const localRecipe = localStorage.getItem(`recipe-${params.recipeId}`)
      const parsedRecipe = localRecipe ? JSON.parse(localRecipe) : { id: -1 }
      if (!recipe) return false
      return !diff(parsedRecipe, recipe).length
    } catch {
      return false
    }
  }, [recipe, params.recipeId])

  return (
    <div className={styles.recipeView}>
      <GoBackArrow targetUrl='/recipes' />
      {isLoading ? (
        <Spinner />
      ) : (
        <article className={styles.recipeContainer}>
          <div className={styles.mainHeaderContainer}>
            <header className={styles.mainHeader}>
              Tytuł: {recipe?.title}
            </header>
            <ButtonWithIcon
              icon={Save}
              iconSize={14}
              variant='primary'
              maxWidth={0.4}
              maxHeight={32}
              text={
                isSaveRecipeOfflineSuccess || isRecipeSavedLocally
                  ? 'Przepis zapisany w pamięci przeglądarki'
                  : 'Zapisz przepis w pamięci przeglądarki'
              }
              onClick={() => {
                saveRecipeToLocalStorage()
              }}
              disabled={isSaveRecipeOfflineSuccess || isRecipeSavedLocally}
              disabledTooltip='Przepis zapisany w pamięci przeglądarki'
            />
          </div>
          <section>
            <header className={styles.authorHeader}>
              Autor: {recipe?.author}
            </header>
          </section>
          <section>
            <header className={styles.preparationTimeHeader}>
              Czas przygotowania:{' '}
              {convertDurationToReadablePreparationTime(
                parseDuration(recipe?.preparation_time || '')
              )}
            </header>
          </section>
          <section>
            <header>Składniki</header>
            <List type='ul' items={ingredients || []} />
          </section>
          <section>
            <header>Potrzebne narzędzia</header>
            <List type='ul' items={requiredEquipment || []} />
          </section>
          <hr />
          <section>
            <header>Opis przygotowania</header>
            <Markdown rehypePlugins={[rehypeRaw]}>
              {recipe?.description}
            </Markdown>
          </section>
        </article>
      )}
    </div>
  )
}

export default RecipeView
