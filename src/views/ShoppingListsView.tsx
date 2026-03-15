import useGetShoppingLists from '@src/api/hooks/useGetShoppingLists'
import Breadcrumb from '@src/components/Breadcrumb'
import GoBackArrow from '@src/components/GoBackArrow'
import ShoppingListTile from '@src/components/ShoppingListTile'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListsView.module.css'

const ShoppingListsView = () => {
  const { data, isLoading } = useGetShoppingLists()

  return (
    <div className={styles.mainContainer}>
      <GoBackArrow targetUrl='/' left='10px' />
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.mainHeader}>
            <Breadcrumb text='Wybierz listę zakupów' />
          </div>
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
