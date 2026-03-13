import RecipeView from '@src/views/RecipeView'
import styles from '@src/App.module.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@src/api/queryClient'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import RecipesView from '@src/views/RecipesView'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/recipes" replace /> },
  { path: '/recipes', Component: RecipesView },
  { path: '/recipes/:recipeId', Component: RecipeView }
], {
  basename: import.meta.env.BASE_URL
})

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
