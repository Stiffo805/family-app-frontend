import Breadcrumb from '@src/components/common/Breadcrumb'
import GoBackArrow from '@src/components/common/GoBackArrow'
import LackingItemsShoppingListTile from '@src/components/shopping/LackingItemsShoppingListTile'
import LogoutButton from '@src/components/common/LogoutButton'
import ShoppingListTile from '@src/components/shopping/ShoppingListTile'
import Spinner from '@src/components/common/Spinner'
import styles from '@src/views/shopping/ShoppingListsView.module.css'
import { useGetAllShoppingLists } from '@src/api/shopping'

const ShoppingListsView = () => {
  const { data, isLoading } = useGetAllShoppingLists()

  return (
    <div className={styles.mainContainer}>
      <LogoutButton />
      <GoBackArrow targetUrl='/' left='10px' />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.mainHeader}>
            <Breadcrumb text='Wybierz listę zakupów' />
          </div>
          <p className={styles.listTypeHeader}>Listy specjalne</p>
          <div className={styles.shoppingListsTilesContainer}>
            <LackingItemsShoppingListTile />
          </div>
          <p className={styles.listTypeHeader}>Listy użytkownika</p>
          <div className={styles.shoppingListsTilesContainer}>
            {data?.shopping_lists?.map((shoppingList) => (
              <ShoppingListTile shoppingList={shoppingList} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingListsView
