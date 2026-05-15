import { useGetItemsRegister } from '@src/api/itemRegister'
import GoBackArrow from '@src/components/common/GoBackArrow'
import LogoutButton from '@src/components/common/LogoutButton'
import Modal from '@src/components/common/Modal'
import { convertDateToReadable } from '@src/util/helpers'
import type { ItemRegister } from '@src/util/types'
import styles from '@src/views/itemRegister/ItemsRegisterView.module.css'
import { useState } from 'react'

const ItemsRegisterView = () => {
  const [selectedItem, setSelectedItem] = useState<ItemRegister | null>(null)
  const [searchText, setSearchText] = useState('')
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false)

  const { data: itemsRegister } = useGetItemsRegister({
    searchText
  })

  const body = (
    <div className={styles.detailsModalBody}>
      <p>
        Przedmiot: <b>{selectedItem?.item.name}</b>
      </p>
      <p>
        Kategoria: <b>{selectedItem?.item.category?.name ?? 'Brak danych'}</b>
      </p>
      <p>
        Ilość:{' '}
        <b>
          {selectedItem?.quantity
            ? `${selectedItem.quantity}${selectedItem.unit_display ? ` ${selectedItem.unit_display}` : ''}`
            : 'Brak danych'}
        </b>
      </p>
      <p>
        Pokój: <b>{selectedItem?.room?.name ?? 'Brak danych'}</b>
      </p>
      <p>
        Opis miejsca: <b>{selectedItem?.place_description ?? 'Brak danych'}</b>
      </p>
      <p>
        Czas ostatniej aktualizacji:{' '}
        <b>{convertDateToReadable(selectedItem?.last_updated_at ?? '')}</b>
      </p>
    </div>
  )

  return (
    <>
      <GoBackArrow targetUrl='/' />
      <LogoutButton />
      <div className={styles.itemsRegisterView}>
        <main className={styles.itemsRegisterContainer}>
          <header>Rejestr przedmiotów</header>
          <div className={styles.searchBarContainer}>
            <input
              type='text'
              placeholder='Szukaj przedmiotu po nazwie...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <hr />
          <div className={styles.itemsGridContainer}>
            {itemsRegister?.items.map((itemRegisterEntry) => (
              <div
                className={styles.gridItem}
                onClick={() => {
                  setSelectedItem(itemRegisterEntry)
                  setIsDetailsModalVisible(true)
                }}
              >
                {itemRegisterEntry.item.name}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Modal
        isModalVisible={isDetailsModalVisible}
        setIsModalVisible={setIsDetailsModalVisible}
        title='Szczegóły przedmiotu'
        body={body}
        footerConfig={{
          buttons: [
            {
              label: 'Zamknij',
              type: 'button',
              onClick: () => setIsDetailsModalVisible(false)
            }
          ]
        }}
      />
    </>
  )
}

export default ItemsRegisterView
