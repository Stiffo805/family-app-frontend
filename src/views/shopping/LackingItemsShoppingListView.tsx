import ButtonWithIcon from '@src/components/common/ButtonWithIcon'
import type { ShoppingListItemsSortingType } from '@src/views/shopping/ShoppingListView'
import {
  ArrowUpRight,
  CircleCheck,
  Download,
  Pencil,
  PencilOff
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import commonStyles from '@src/commonStyles/ShoppingListViewCommonStyles.module.css'
import styles from '@src/views/shopping/LackingItemsShoppingListView.module.css'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Paragraph, TextRun, Document, HeadingLevel, Packer } from 'docx'
import LogoutButton from '@src/components/common/LogoutButton'
import GoBackArrow from '@src/components/common/GoBackArrow'
import Spinner from '@src/components/common/Spinner'
import LackingItemsShoppingListItem from '@src/components/shopping/LackingItemsShoppingListItem'
import Modal from '@src/components/common/Modal'
import ConfirmationModal from '@src/components/common/ConfirmationModal'
import { useNavigate } from 'react-router'
import useCustomQuery from '@src/api/hooks/useCustomQuery'
import type {
  LackingShoppingListItemsList,
  LackingShoppingListItemsListEntry,
  MoveLackingItemsOperationType,
  ShoppingListsInfosList,
  TagsResponse
} from '@src/util/types'
import useCustomMutation from '@src/api/hooks/useCustomMutation'
import { queryClient } from '@src/api/queryClient'

const defaultSorting: ShoppingListItemsSortingType = 'alphabetically'
const LackingItemsShoppingListView = () => {
  const navigate = useNavigate()

  const [isEditionMode, setIsEditionMode] = useState(false)
  const [isExportModalVisible, setIsExportModalVisible] = useState(false)
  const [
    isExportConfirmationModalVisible,
    setIsExportConfirmationModalVisible
  ] = useState(false)
  const [isPdfDownloading, setIsPdfDownloading] = useState(false)
  const [isDocxDownloading, setIsDocxDownloading] = useState(false)
  const [sorting, setSorting] =
    useState<ShoppingListItemsSortingType>(defaultSorting)
  const [tagIdToFilterBy, setTagIdToFilterBy] = useState<number | null>(null)
  const [checkedItems, setCheckedItems] = useState<
    LackingShoppingListItemsListEntry[]
  >([])
  const [targetShoppingListId, setTargetShoppingListId] = useState(-1)
  const [selectedOperationType, setSelectedOperationType] =
    useState<MoveLackingItemsOperationType>('copy')
  const [exportError, setExportError] = useState('')
  const [isGlobalSelected, setIsGlobalSelected] = useState(false)

  const shoppingListContainerRef = useRef<HTMLElement>(null)

  const {
    data: lackingShoppingListItems,
    isLoading: isLackingShoppingListItemsDataLoading
  } = useCustomQuery<LackingShoppingListItemsList>({
    method: 'GET',
    url: '/shopping/items/lacking/',
    queryKey: ['lackingItems']
  })

  const {
    mutate: moveLackingItems,
    isPending: isMoveLackingItemsMutationPending
  } = useCustomMutation({
    method: 'POST',
    url: `/shopping/items/lacking/move/${targetShoppingListId}/`,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lackingItems']
      })
      queryClient.invalidateQueries({
        queryKey: [`shoppingList-${targetShoppingListId}`]
      })
    }
  })

  const { data: allTags } = useCustomQuery<TagsResponse>({
    method: 'GET',
    url: '/shopping/tags',
    queryKey: ['tags']
  })

  const { data: shoppingLists } = useCustomQuery<ShoppingListsInfosList>({
    method: 'GET',
    url: '/shopping/lists',
    queryKey: ['shoppingLists']
  })

  const toggleCheckItem = (entry: LackingShoppingListItemsListEntry) => {
    if (checkedItems.map((item) => item.id).includes(entry.id)) {
      setCheckedItems((cur) => cur.filter((item) => item.id !== entry.id))
    } else {
      setCheckedItems((cur) => [...cur, entry])
    }
  }

  const isChecked = (entry: LackingShoppingListItemsListEntry) => {
    return checkedItems.map((item) => item.id).includes(entry.id)
  }

  const filteredItems = useMemo(
    () =>
      lackingShoppingListItems?.entries.filter((entry) =>
        tagIdToFilterBy !== null
          ? entry.tags.map((tag) => tag.id).includes(tagIdToFilterBy)
          : true
      ) ?? [],
    [lackingShoppingListItems, tagIdToFilterBy]
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCheckedItems([])
    setIsGlobalSelected(false)
  }, [tagIdToFilterBy])

  const handleDownloadPdf = async () => {
    if (!lackingShoppingListItems) return
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

      pdf.save(`Brakujące produkty.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF document: ', error)
    }
    setIsPdfDownloading(false)
  }

  const handleDownloadDocx = async () => {
    if (!lackingShoppingListItems) return
    setIsDocxDownloading(true)
    try {
      const entryParagraphs = lackingShoppingListItems.entries
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
                text: `Tytuł: Brakujące produkty`,
                heading: HeadingLevel.HEADING_1
              }),
              new Paragraph({
                text: 'Opis:',
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                text: 'Lista przechowująca brakujące produkty, dla których nie wiadomo, na którą listę je wpisać'
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
      link.download = `Brakujące produkty.docx`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate DOCX document: ', error)
    }
    setIsDocxDownloading(false)
  }

  const sortingCompareFunction = useMemo(() => {
    if (sorting === 'alphabetically')
      return (
        entry1: LackingShoppingListItemsListEntry,
        entry2: LackingShoppingListItemsListEntry
      ) => entry1.product_name.localeCompare(entry2.product_name)
    else
      return (
        entry1: LackingShoppingListItemsListEntry,
        entry2: LackingShoppingListItemsListEntry
      ) =>
        new Date(entry2.updated_at ?? 0).getTime() -
        new Date(entry1.updated_at ?? 0).getTime()
  }, [sorting])

  const exportModalBody = (
    <div className={styles.exportModalBodyContainer}>
      <hr />
      <p>Docelowa lista:</p>
      <select onChange={(e) => setTargetShoppingListId(Number(e.target.value))}>
        <option>Wybierz...</option>
        {shoppingLists?.shopping_lists.map((shoppingList) => (
          <option value={shoppingList.id}>{shoppingList.title}</option>
        ))}
      </select>
      <p>Sposób przenoszenia</p>
      <select
        onChange={(e) =>
          setSelectedOperationType(
            e.target.value as unknown as MoveLackingItemsOperationType
          )
        }
      >
        <option value='copy'>Skopiuj -&gt; wklej</option>
        <option value='cut'>Wytnij -&gt; wklej</option>
      </select>
      <hr />
    </div>
  )

  const exportModalFooter = (
    <div className={styles.exportModalFooterContainer}>
      <button onClick={() => setIsExportModalVisible(false)}>Anuluj</button>
      <button
        onClick={() => {
          if (targetShoppingListId === -1) {
            setExportError('Wybierz docelową listę zakupów')
            return
          }
          moveLackingItems({
            lacking_items_ids: checkedItems.map((item) => item.id || -1),
            operation_type: selectedOperationType
          })
          setIsExportModalVisible(false)
          setIsExportConfirmationModalVisible(true)
        }}
      >
        Potwierdź
      </button>
    </div>
  )

  return (
    <>
      <div className={commonStyles.shoppingListsView}>
        <LogoutButton />
        <GoBackArrow targetUrl='/shopping/lists' />
        {isLackingShoppingListItemsDataLoading ? (
          <Spinner />
        ) : (
          <main>
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
              className={commonStyles.shoppingListContainer}
              ref={shoppingListContainerRef}
            >
              <div
                className={`${commonStyles.mainHeaderContainer} pdf-element`}
              >
                <header className={commonStyles.mainHeader}>
                  Tytuł: Brakujące produkty <em>(Lista specjalna)</em>
                </header>
              </div>
              <div
                className={commonStyles.buttonsContainer}
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
                Lista przechowująca brakujące produkty, dla których nie wiadomo,
                na którą listę je wpisać
              </section>
              <section className={commonStyles.displaySettingsSection}>
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
                <br />
                <br />
                <span>Wyświetl produkty z etykietami:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value === 'all') setTagIdToFilterBy(null)
                    else setTagIdToFilterBy(Number(e.target.value))
                  }}
                >
                  <option value='all'>Wszystkie</option>
                  {allTags?.items.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </section>
              <hr className='pdf-element' />
              <section>
                <header className='pdf-element'>Przedmioty zakupowe</header>
                {isEditionMode && (
                  <>
                    <div className={styles.shoppingListItemsBar}>
                      <ButtonWithIcon
                        text={
                          !isGlobalSelected
                            ? 'Zaznacz wszystkie'
                            : 'Odznacz wszystkie'
                        }
                        icon={CircleCheck}
                        variant='primary'
                        onClick={() => {
                          if (!isGlobalSelected)
                            setCheckedItems(filteredItems || [])
                          else setCheckedItems([])
                          setIsGlobalSelected((cur) => !cur)
                        }}
                        fontSize='clamp(14px, 2vw, 20px)'
                        padding={5}
                        iconSize={16}
                      />
                      <p>
                        | Wybrano: <b>{checkedItems.length}</b> |
                      </p>
                      <ButtonWithIcon
                        text='Eksportuj do listy'
                        icon={ArrowUpRight}
                        variant='primary'
                        onClick={() => setIsExportModalVisible(true)}
                        fontSize='clamp(14px, 2vw, 20px)'
                        padding={5}
                        iconSize={16}
                      />
                    </div>
                    <hr />
                  </>
                )}
                {filteredItems
                  .reduce<
                    [
                      LackingShoppingListItemsListEntry[],
                      LackingShoppingListItemsListEntry[]
                    ]
                  >(
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
                        <LackingItemsShoppingListItem
                          isEditionMode={isEditionMode}
                          toggleCheckItem={toggleCheckItem}
                          isChecked={isChecked}
                          lackingItemsShoppingListEntry={entry}
                          tagsNames={entry.tags.map((tag) => tag.name)}
                          sorting={sorting}
                        />
                        <hr />
                      </div>
                    ))
                  )}
              </section>
            </article>
          </main>
        )}
      </div>
      <Modal
        isModalVisible={isExportModalVisible}
        setIsModalVisible={setIsExportModalVisible}
        title='Przenoszenie produktów do listy zakupów'
        error={exportError !== '' ? exportError : undefined}
        isLoading={isMoveLackingItemsMutationPending}
        body={exportModalBody}
        footer={exportModalFooter}
      />
      <ConfirmationModal
        isModalVisible={isExportConfirmationModalVisible}
        setIsModalVisible={setIsExportConfirmationModalVisible}
        text='Przeniesiono produkty do listy'
        customSubmitButtonText='Przejdź do listy'
        customCancelButtonText='Zamknij'
        onSubmit={() => navigate(`/shopping/lists/${targetShoppingListId}`)}
      />
    </>
  )
}

export default LackingItemsShoppingListView
