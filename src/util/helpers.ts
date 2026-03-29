import type { Recipe } from '@src/api/hooks/useGetRecipe'
import type { RecipeInfo } from '@src/api/hooks/useGetRecipesList'

type ParsedDuration = {
  hours: number
  minutes: number
  seconds: number
}

export const parseDuration = (duration: string) => {
  console.log('duration: ', duration)
  let days = 0
  let durationArr
  if (duration.includes(' ')) {
    days = Number(duration.slice(0, duration.indexOf(' ')))
    durationArr = duration.slice(duration.indexOf(' ')).split(':')
  } else {
    durationArr = duration.split(':')
  }

  return {
    hours: Number(durationArr[0]) + days * 24,
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

export const convertDateToReadable = (date: string): string => {
  const zoneDate = new Date(date)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(zoneDate)
}
