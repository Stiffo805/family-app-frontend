import useGetShoppingLists from '@src/api/hooks/useGetShoppingLists'
import Breadcrumb from '@src/components/Breadcrumb'
import GoBackArrow from '@src/components/GoBackArrow'
import LackingItemsShoppingListTile from '@src/components/LackingItemsShoppingListTile'
import LogoutButton from '@src/components/LogoutButton'
import ShoppingListTile from '@src/components/ShoppingListTile'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListsView.module.css'

const ShoppingListsView = () => {
  const { data, isLoading } = useGetShoppingLists()

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
