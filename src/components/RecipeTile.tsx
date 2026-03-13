import type { RecipeInfo } from '@src/api/hooks/useGetRecipesList'
import useRecipesOffline from '@src/api/hooks/useRecipesOffline'
import ConfirmationModal from '@src/components/ConfirmationModal'
import styles from '@src/components/RecipeTile.module.css'
import {
  convertDurationToReadablePreparationTime,
  parseDuration
} from '@src/util/helpers'
import { Save, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type RecipeTileInfo = {
  id: number
  title: string
  author: string
  preparation_time: string
}

type RecipeTileProps = {
  recipe: RecipeTileInfo
  isRecipeSavedLocally: (recipe: RecipeInfo) => boolean
}

const RecipeTile = (props: RecipeTileProps) => {
  const navigate = useNavigate()

  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] =
    useState(false)

  const {
    saveRecipeToLocalStorage,
    removeRecipeFromLocalStorage,
    isSaveSuccess: isSaveRecipeOfflineSuccess,
    isDeleteSuccess: isDeleteRecipeOfflineSuccess
  } = useRecipesOffline({
    recipeId: props.recipe?.id || -1
  })

  useEffect(() => {
    if (isDeleteRecipeOfflineSuccess) location.reload()
  }, [isDeleteRecipeOfflineSuccess])

  return (
    <>
      <div
        className={styles.recipeContainer}
        onClick={() => navigate(`recipes/${props.recipe.id}`)}
      >
        <div className={styles.titleContainer}>
          <header className={styles.titleHeader}>
            Tytuł: {props.recipe.title}
          </header>
          <button
            onClick={async (e) => {
              e.stopPropagation()
              if (!props.isRecipeSavedLocally(props.recipe))
                saveRecipeToLocalStorage()
              else {
                setIsConfirmDeleteModalVisible(true)
              }
            }}
            disabled={isSaveRecipeOfflineSuccess}
          >
            {props.isRecipeSavedLocally(props.recipe) ? (
              <Trash2 size={28} />
            ) : (
              <Save size={28} />
            )}
          </button>
        </div>
        <header className={styles.authorHeader}>
          Autor: {props.recipe.author}
        </header>
        <p className={styles.preparationTime}>
          Czas przygotowania:{' '}
          {convertDurationToReadablePreparationTime(
            parseDuration(props.recipe.preparation_time)
          )}
        </p>
      </div>
      <ConfirmationModal
        isModalVisible={isConfirmDeleteModalVisible}
        setIsModalVisible={setIsConfirmDeleteModalVisible}
        text={`Czy na pewno chcesz usunąć przepis '${props.recipe.title}'`}
        onSubmit={removeRecipeFromLocalStorage}
      />
    </>
  )
}

export default RecipeTile
