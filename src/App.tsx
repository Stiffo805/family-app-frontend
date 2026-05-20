import RecipeView from '@src/views/recipes/RecipeView'
import styles from '@src/App.module.css'
import { queryClient } from '@src/api/queryClient'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import RecipesView from '@src/views/recipes/RecipesView'
import IndexView from '@src/views/IndexView'
import ShoppingListsView from '@src/views/shopping/ShoppingListsView'
import ShoppingListView from '@src/views/shopping/ShoppingListView'
import LoginView from '@src/views/LoginView'
import ProtectedRoutes from '@src/components/ProtectedRoutes'
import IsAliveProvider from '@src/components/IsAliveProvider'
import ActivitiesView from '@src/views/activities/ActivitiesView'
import LackingItemsShoppingListView from '@src/views/shopping/LackingItemsShoppingListView'
import ItemsRegisterView from '@src/views/itemRegister/ItemsRegisterView'
import { useEffect, useState } from 'react'
import ButtonWithIcon from '@src/components/common/ButtonWithIcon'
import { Globe, GlobeOff, Trash2 } from 'lucide-react'
import { OfflineModeContext } from '@src/util/context'
import ConfirmationModal from '@src/components/common/ConfirmationModal'

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
        {
          path: '/shopping/lists/lacking-items',
          Component: LackingItemsShoppingListView
        },
        {
          path: '/shopping/lists/:shoppingListId',
          Component: ShoppingListView
        },
        {
          path: '/activities',
          Component: ActivitiesView
        },
        {
          path: '/items_register',
          Component: ItemsRegisterView
        }
      ]
    }
  ],
  {
    basename: import.meta.env.BASE_URL
  }
)

function App() {
  const [offlineMode, setOfflineMode] = useState(false)
  const [isConnection, setIsConnection] = useState(false)
  const [
    isDeleteOfflineDataButtonDisabled,
    setIsDeleteOfflineDataButtonDisabled
  ] = useState(false)
  const [
    isDeleteOfflineDataConfirmationModalVisible,
    setIsDeleteOfflineDataConfirmationModalVisible
  ] = useState(false)

  const clearLocalData = () => {
    localStorage.setItem('shoppingLists', '[]')
    setIsDeleteOfflineDataButtonDisabled(true)
    queryClient.invalidateQueries()
  }

  useEffect(() => {
    queryClient.invalidateQueries()
  }, [offlineMode])

  return (
    <OfflineModeContext.Provider value={{ offlineMode }}>
      <div className={styles.appContainer}>
        <header className={styles.appHeader}>
          <ButtonWithIcon
            text={
              offlineMode ? 'Przejdź na tryb online' : 'Przejdź na tryb offline'
            }
            disabled={offlineMode && !isConnection}
            icon={offlineMode ? Globe : GlobeOff}
            onClick={() => {
              if (offlineMode) window.location.reload()
              else setOfflineMode(true)
            }}
            variant='primary'
            margin='15px 0'
          />
        </header>
        <IsAliveProvider setIsConnection={setIsConnection}>
          <RouterProvider router={router} />
        </IsAliveProvider>
        <div className={styles.clearBtnContainer}>
          <ButtonWithIcon
            text='Wyczyść dane offline'
            icon={Trash2}
            variant='primary'
            onClick={() => setIsDeleteOfflineDataConfirmationModalVisible(true)}
            disabled={isDeleteOfflineDataButtonDisabled}
            margin='0 0 5px 0'
          />
        </div>
        <footer className={styles.footer}>
          Design provided by Frontend Mentor
        </footer>
      </div>
      <ConfirmationModal
        isModalVisible={isDeleteOfflineDataConfirmationModalVisible}
        setIsModalVisible={setIsDeleteOfflineDataConfirmationModalVisible}
        text='Czy na pewno chcesz wyczyścić wszystkie dane offline?'
        onSubmit={clearLocalData}
      />
    </OfflineModeContext.Provider>
  )
}

export default App
