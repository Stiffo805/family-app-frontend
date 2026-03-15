import useGetShoppingList from '@src/api/hooks/useGetShoppingList'
import GoBackArrow from '@src/components/GoBackArrow'
import ShoppingListItem from '@src/components/ShoppingListItem'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListView.module.css'
import { useParams } from 'react-router'

const ShoppingListView = () => {
  const params = useParams()
  const { data, isLoading } = useGetShoppingList({
    shoppingListId: Number(params.shoppingListId)
  })

  return (
    <div className={styles.shoppingListsView}>
      <GoBackArrow targetUrl='/shopping/lists' />
      {isLoading ? (
        <Spinner />
      ) : (
        <article className={styles.shoppingListContainer}>
          <div className={styles.mainHeaderContainer}>
            <header className={styles.mainHeader}>Tytuł: {data?.title}</header>
          </div>
          <section>
            <header>Opis: </header>
            {data?.description}
          </section>
          <hr />
          <section>
            <header>Przedmioty zakupowe</header>
            {data?.entries
              .sort(
                (entry1, entry2) =>
                  Number(entry1.is_checked) - Number(entry2.is_checked)
              )
              .map((entry) => (
                <>
                  <ShoppingListItem
                    shoppingListEntry={entry}
                    shoppingListId={data.id}
                  />
                  <hr />
                </>
              ))}
          </section>
        </article>
      )}
    </div>
  )
}

export default ShoppingListView
