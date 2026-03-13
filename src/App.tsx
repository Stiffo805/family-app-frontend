import RecipeView from '@src/views/RecipeView'
import styles from '@src/App.module.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@src/api/queryClient'
import { createBrowserRouter, RouterProvider } from 'react-router'
import RecipesView from '@src/views/RecipesView'

const router = createBrowserRouter([
  { path: '/family-app-frontend/recipes', Component: RecipesView },
  { path: '/family-app-frontend/recipes/:recipeId', Component: RecipeView }
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.appContainer}>
        <RouterProvider router={router} />
        <footer className={styles.footer}>
          Design provided by Frontend Mentor
        </footer>
      </div>
    </QueryClientProvider>
  )
}

export default App
