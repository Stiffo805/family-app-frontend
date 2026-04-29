import { useNavigate } from 'react-router'
import styles from '@src/components/shopping/LackingItemsShoppingListTile.module.css'

const LackingItemsShoppingListTile = () => {
  const navigate = useNavigate()

  return (
    <>
      <div
        className={styles.shoppingListContainer}
        onClick={() => navigate(`/shopping/lists/lacking-items`)}
      >
        <div className={styles.titleContainer}>
          <header className={styles.titleHeader}>
            Tytuł: Brakujące produkty
          </header>
        </div>
        <p className={styles.description}>
          Opis: Lista przechowująca brakujące produkty, dla których nie wiadomo, na którą listę je wpisać
        </p>
      </div>
    </>
  )
}

export default LackingItemsShoppingListTile
