import useGetShoppingList, {
  type ShoppingListEntry
} from '@src/api/hooks/useGetShoppingList'
import ButtonWithIcon from '@src/components/ButtonWithIcon'
import GoBackArrow from '@src/components/GoBackArrow'
import LogoutButton from '@src/components/LogoutButton'
import ShoppingListItem from '@src/components/ShoppingListItem'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListView.module.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import {
  BellMinus,
  BellPlus,
  Download,
  Pencil,
  PencilOff,
  Plus
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import {
  subscribeToListNotifications,
  unsubscribeFromListNotifications
} from '@src/api/pushSubscription'
import { usePushStatus } from '@src/api/hooks/usePushStatus'
import {
  initChangesDB,
  retrieveCreatedAndUpdatedItems,
  retrieveDeletedItems,
  type DeletedItemRecord,
  type ModifiedItemRecord
} from '@src/api/indexedDb'
import Modal from '@src/components/Modal'
import ErrorSpan from '@src/components/ErrorSpan'
import useGetUnits from '@src/api/hooks/useGetUnits'
import useGetShoppingItems from '@src/api/hooks/useGetShoppingItems'
import usePostShoppingListItem from '@src/api/hooks/usePostShoppingListItem'

export type ShoppingListItemsSortingType = 'alphabetically' | 'timestamp'
const defaultSorting: ShoppingListItemsSortingType = 'alphabetically'

const ShoppingListView = () => {
  const params = useParams()

  const [isPdfDownloading, setIsPdfDownloading] = useState(false)
  const [isDocxDownloading, setIsDocxDownloading] = useState(false)
  const [isEditionMode, setIsEditionMode] = useState(false)
  const [isAdditionModalVisible, setIsAdditionModalVisible] = useState(false)
  const [sorting, setSorting] =
    useState<ShoppingListItemsSortingType>(defaultSorting)

  const [
    undiscoveredCreatedAndUpdatedItems,
    setUndiscoveredCreatedAndUpdatedItems
  ] = useState<ModifiedItemRecord[]>([])
  const [undiscoveredDeletedItems, setUndiscoveredDeletedItems] = useState<
    DeletedItemRecord[]
  >([])

  const { isSubscribed, setIsSubscribed } = usePushStatus(
    Number(params.shoppingListId)
  )

  const { data: shoppingListData, isLoading: isShoppingListDataLoading } =
    useGetShoppingList({
      shoppingListId: Number(params.shoppingListId)
    })

  const { data: units } = useGetUnits()

  const { data: shoppingItems } = useGetShoppingItems()

  const {
    mutate: createItem,
    isError: isCreateItemError,
    status: createItemStatus,
    isPending: isCreateItemPending
  } = usePostShoppingListItem({
    shoppingListId: shoppingListData?.id,
    onSuccess: () => setIsAdditionModalVisible(false)
  })

  console.log(createItemStatus)

  const shoppingListContainerRef = useRef<HTMLElement>(null)

  const handleDownloadPdf = async () => {
    if (!shoppingListData) return
    setIsPdfDownloading(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const marginY = 10
      const marginX = 15
      let currentY = marginY

      const usableWidth = pdfWidth - marginX * 2

      const addElementToPdf = async (element: HTMLElement) => {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')

        const imgHeight = (canvas.height * usableWidth) / canvas.width

        if (currentY + imgHeight > pdfHeight - marginY) {
          pdf.addPage()
          currentY = marginY
        }

        pdf.addImage(imgData, 'PNG', marginX, currentY, usableWidth, imgHeight)

        currentY += imgHeight + 2
      }

      const items = document.querySelectorAll('.pdf-element')

      for (const item of Array.from(items)) {
        await addElementToPdf(item as HTMLElement)
      }

      pdf.save(`Zakupy - ${shoppingListData.title}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF document: ', error)
    }
    setIsPdfDownloading(false)
  }

  const handleDownloadDocx = async () => {
    if (!shoppingListData) return
    setIsDocxDownloading(true)
    try {
      const entryParagraphs = shoppingListData.entries
        .sort(
          (entry1, entry2) =>
            Number(entry1.is_checked) - Number(entry2.is_checked)
        )
        .map((entry) => {
          return new Paragraph({
            children: [
              new TextRun({
                text: entry.is_checked ? '[X] ' : '[ ] ',
                bold: true,
                size: 32,
                break: 1
              }),
              new TextRun({
                text: `${entry.product_name || 'Nieznany produkt'}${Number(entry.quantity) ? ` - ${Number(entry.quantity)} ${entry.unit_display}` : ''}`,
                size: 32
              }),
              new TextRun({
                text: entry.extra_notes || 'Brak uwag',
                color: '#808080',
                break: 1,
                size: 24
              })
            ]
          })
        })

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: `Tytuł: ${shoppingListData.title}`,
                heading: HeadingLevel.HEADING_1
              }),
              new Paragraph({
                text: 'Opis:',
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                text: shoppingListData.description || 'Brak opisu'
              }),
              new Paragraph({
                text: ''
              }),
              new Paragraph({
                text: 'Przedmioty zakupowe:',
                heading: HeadingLevel.HEADING_2
              }),
              ...entryParagraphs
            ]
          }
        ]
      })

      const blob = await Packer.toBlob(doc)
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `Zakupy - ${shoppingListData.title}.docx`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate DOCX document: ', error)
    }
    setIsDocxDownloading(false)
  }

  const loadChangesFromIDB = async () => {
    const db = await initChangesDB()
    const createdAndUpdatedItems = await retrieveCreatedAndUpdatedItems(db)
    setUndiscoveredCreatedAndUpdatedItems(createdAndUpdatedItems)
    const deletedItems = await retrieveDeletedItems(db)
    setUndiscoveredDeletedItems(deletedItems)
  }

  const getModificationType = (listItemId: number) => {
    return undiscoveredCreatedAndUpdatedItems.find(
      (item) => item.id === listItemId
    )?.modificationType
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadChangesFromIDB()
  }, [])

  const modalBody = (
    <div className={styles.additionModalBody}>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)

          const itemId = Number(formData.get('itemId'))
          const quantity = Number(formData.get('quantity'))
            ? Number(formData.get('quantity'))
            : null
          const unit = formData.get('unit')
            ? formData.get('unit')?.toString()
            : null
          const extraNotes = formData.get('extraNotes')?.toString()

          createItem({ itemId, quantity, unit, extraNotes })
        }}
      >
        <p>Przedmiot zakupowy: </p>
        <select name='itemId'>
          {shoppingItems?.all_items.map((item) => (
            <option value={item.id}>{item.name}</option>
          ))}
        </select>
        <br />
        {isCreateItemError && createItemStatus === 409 && (
          <ErrorSpan errorText='Na tej liście występuje już ten przedmiot zakupowy' />
        )}
        <p>Ilość:</p>
        <input type='number' min={0} max={999999} step={0.01} name='quantity' />
        <p>Jednostka:</p>
        <select name='unit'>
          <option value=''>-</option>
          {units?.map((unit) => (
            <option value={unit.value}>{unit.label}</option>
          ))}
        </select>
        <p>Dodatkowe uwagi:</p>
        <input type='text' name='extraNotes' />
        <br />
        {isCreateItemError && createItemStatus !== 409 && (
          <ErrorSpan errorText='Wystąpił błąd' />
        )}
        <div className={styles.modalButtonsContainer}>
          <button type='submit'>Zapisz</button>
          <button
            type='button'
            onClick={() => setIsAdditionModalVisible(false)}
          >
            Anuluj
          </button>
        </div>
      </form>
    </div>
  )

  const sortingCompareFunction = useMemo(() => {
    if (sorting === 'alphabetically')
      return (entry1: ShoppingListEntry, entry2: ShoppingListEntry) =>
        entry1.product_name.localeCompare(entry2.product_name)
    else
      return (entry1: ShoppingListEntry, entry2: ShoppingListEntry) =>
        new Date(entry2.updated_at ?? 0).getTime() -
        new Date(entry1.updated_at ?? 0).getTime()
  }, [sorting])

  return (
    <>
      <div className={styles.shoppingListsView}>
        <LogoutButton />
        <GoBackArrow targetUrl='/shopping/lists' />
        {isShoppingListDataLoading ? (
          <Spinner />
        ) : (
          <main>
            <ButtonWithIcon
              icon={isSubscribed ? BellMinus : BellPlus}
              text={
                isSubscribed ? (
                  <>
                    <b>Wyłącz</b> powiadomienia dla tej listy
                  </>
                ) : (
                  <>
                    <b>Włącz</b> powiadomienia dla tej listy
                  </>
                )
              }
              variant='primary'
              onClick={() => {
                if (shoppingListData?.id)
                  if (isSubscribed)
                    unsubscribeFromListNotifications(shoppingListData.id).then(
                      () => setIsSubscribed(false)
                    )
                  else
                    subscribeToListNotifications(shoppingListData.id).then(
                      () => {
                        setIsSubscribed(true)
                      }
                    )
              }}
            />
            <br />
            <br />
            <ButtonWithIcon
              icon={isEditionMode ? PencilOff : Pencil}
              text={
                isEditionMode ? (
                  <>
                    <b>Wyłącz</b> tryb rozszerzonej edycji
                  </>
                ) : (
                  <>
                    <b>Włącz</b> tryb rozszerzonej edycji
                  </>
                )
              }
              variant='primary'
              onClick={() => setIsEditionMode((cur) => !cur)}
            />
            <article
              className={styles.shoppingListContainer}
              ref={shoppingListContainerRef}
            >
              <div className={`${styles.mainHeaderContainer} pdf-element`}>
                <header className={styles.mainHeader}>
                  Tytuł: {shoppingListData?.title}
                </header>
              </div>
              <div
                className={styles.buttonsContainer}
                data-html2canvas-ignore='true'
              >
                <ButtonWithIcon
                  icon={Download}
                  iconSize={16}
                  text={`${isPdfDownloading ? 'Pobieram...' : 'Pobierz pdf'}`}
                  variant='primary'
                  onClick={handleDownloadPdf}
                  disabled={isPdfDownloading}
                />
                <ButtonWithIcon
                  icon={Download}
                  iconSize={16}
                  text={`${isDocxDownloading ? 'Pobieram...' : 'Pobierz docx'}`}
                  variant='primary'
                  onClick={handleDownloadDocx}
                  disabled={isDocxDownloading}
                />
              </div>
              <section className='pdf-element'>
                <header>Opis: </header>
                {shoppingListData?.description ?? 'Brak opisu'}
              </section>
              <section className={styles.displaySettingsSection}>
                <header>Ustawienia wyświetlania</header>
                <span>Sortuj wg:</span>
                <select
                  onChange={(e) =>
                    setSorting(e.target.value as ShoppingListItemsSortingType)
                  }
                >
                  <option value='alphabetically'>Alfabetycznie</option>
                  <option value='timestamp'>Data ostatniej aktualizacji</option>
                </select>
              </section>
              <hr className='pdf-element' />
              <section>
                <header className='pdf-element'>Przedmioty zakupowe</header>
                {isEditionMode && (
                  <ButtonWithIcon
                    icon={Plus}
                    text='Dodaj przedmiot zakupowy'
                    fontSize='13px'
                    iconSize={13}
                    variant='primary'
                    onClick={() => setIsAdditionModalVisible(true)}
                  />
                )}
                {shoppingListData?.entries
                  .reduce<[ShoppingListEntry[], ShoppingListEntry[]]>(
                    (acc, cur) => {
                      if (!cur.is_checked) acc[0].push(cur)
                      else acc[1].push(cur)
                      return [acc[0], acc[1]]
                    },
                    [[], []]
                  )
                  .map((group) =>
                    group.sort(sortingCompareFunction).map((entry) => (
                      <div key={entry.id} className='pdf-element'>
                        <ShoppingListItem
                          shoppingListEntry={entry}
                          shoppingListId={shoppingListData.id}
                          modificationType={getModificationType(entry.id || -1)}
                          loadChangesFromIdb={loadChangesFromIDB}
                          isEditionMode={isEditionMode}
                          sorting={sorting}
                        />
                        <hr />
                      </div>
                    ))
                  )}
                {undiscoveredDeletedItems.map((item, index) => (
                  <div key={index} className='pdf-element'>
                    <ShoppingListItem
                      shoppingListEntry={item}
                      modificationType='deleted'
                      loadChangesFromIdb={loadChangesFromIDB}
                    />
                    <hr />
                  </div>
                ))}
              </section>
            </article>
          </main>
        )}
      </div>
      <Modal
        isModalVisible={isAdditionModalVisible}
        setIsModalVisible={setIsAdditionModalVisible}
        title='Dodawanie przedmiotu zakupowego do listy'
        body={modalBody}
        isLoading={isCreateItemPending}
      />
    </>
  )
}

export default ShoppingListView
