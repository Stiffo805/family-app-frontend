import type { Recipe } from '@src/api/hooks/useGetRecipe'
import type { RecipeInfo } from '@src/api/hooks/useGetRecipesList'

type ParsedDuration = {
  hours: number
  minutes: number
  seconds: number
}

export const parseDuration = (duration: string) => {
  const durationArr = duration.split(':')
  return {
    hours: Number(durationArr[0]),
    minutes: Number(durationArr[1]),
    seconds: Number(durationArr[2])
  }
}

export const convertDurationToReadablePreparationTime = (
  parsedDuration: ParsedDuration
) => {
  if (!parsedDuration.hours && !parsedDuration.minutes) return 'Brak informacji'
  let result = ''
  if (parsedDuration.hours) result += parsedDuration.hours + 'h '
  if (parsedDuration.minutes) result += parsedDuration.minutes + 'min'
  return result
}

export const mapRecipeToRecipeInfo = (recipe: Recipe): RecipeInfo => ({
  id: recipe.id,
  author: recipe.author,
  preparation_time: recipe.preparation_time,
  title: recipe.title
})
