import type { ShoppingListInfo } from '@src/api/hooks/useGetShoppingLists'
import styles from '@src/components/ShoppingListTile.module.css'
import { useNavigate } from 'react-router'

type ShoppingListTileProps = {
  shoppingList: ShoppingListInfo
}

const ShoppingListTile = (props: ShoppingListTileProps) => {
  const navigate = useNavigate()

  return (
    <>
      <div
        className={styles.shoppingListContainer}
        onClick={() => navigate(`/shopping/lists/${props.shoppingList.id}`)}
      >
        <div className={styles.titleContainer}>
          <header className={styles.titleHeader}>
            Tytuł: {props.shoppingList.title}
          </header>
        </div>
        <p className={styles.description}>Opis: {props.shoppingList.description ?? 'Brak opisu'}</p>
      </div>
    </>
  )
}

export default ShoppingListTile
