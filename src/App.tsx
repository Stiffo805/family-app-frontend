import RecipeView from '@src/views/RecipeView'
import styles from '@src/App.module.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@src/api/queryClient'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import RecipesView from '@src/views/RecipesView'
import IndexView from '@src/views/IndexView'
import ShoppingListsView from '@src/views/ShoppingListsView'
import ShoppingListView from '@src/views/ShoppingListView'
import LoginView from '@src/views/LoginView'
import ProtectedRoutes from '@src/components/ProtectedRoutes'
import IsAliveProvider from '@src/components/IsAliveProvider'

const router = createBrowserRouter(
  [
    { path: '/', Component: IndexView },
    { path: '/login', Component: LoginView },
    { path: '/recipes', Component: RecipesView },
    { path: '/recipes/:recipeId', Component: RecipeView },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path: '/shopping',
          element: <Navigate to='/shopping/lists' replace />
        },
        { path: '/shopping/lists', Component: ShoppingListsView },
        { path: '/shopping/lists/:shoppingListId', Component: ShoppingListView }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.appContainer}>
        <IsAliveProvider>
          <RouterProvider router={router} />
          <footer className={styles.footer}>
            Design provided by Frontend Mentor
          </footer>
        </IsAliveProvider>
      </div>
    </QueryClientProvider>
  )
}

export default App
