import ButtonWithIcon from '@src/components/common/ButtonWithIcon'
import GoBackArrow from '@src/components/common/GoBackArrow'
import LogoutButton from '@src/components/common/LogoutButton'
import ShoppingListItem from '@src/components/shopping/ShoppingListItem'
import Spinner from '@src/components/common/Spinner'
import commonStyles from '@src/commonStyles/ShoppingListViewCommonStyles.module.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download, Pencil, PencilOff, Plus } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import type { ShoppingListEntry } from '@src/util/types'
import { useGetAllTags, useGetShoppingList } from '@src/api/shopping'
import AddItemToShoppingListModal from '@src/components/shopping/modals/AddItemToShoppingListModal'
import CreateNewShoppingItemModal from '@src/components/shopping/modals/CreateNewShoppingItemModal'
import CreateNewTagModal from '@src/components/shopping/modals/CreateNewTagModal'

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
  const [tagIdToFilterBy, setTagIdToFilterBy] = useState<number | null>(null)

  const [
    isNewProductCreationModalVisible,
    setIsNewProductCreationModalVisible
  ] = useState(false)

  const [isNewTagCreationModalVisible, setIsNewTagCreationModalVisible] =
    useState(false)

  const shoppingListContainerRef = useRef<HTMLElement>(null)

  const { data: shoppingListData, isLoading: isShoppingListDataLoading } =
    useGetShoppingList({
      shoppingListId: Number(params.shoppingListId)
    })

  const { data: allTags } = useGetAllTags()

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
      <div className={commonStyles.shoppingListsView}>
        <LogoutButton />
        <GoBackArrow targetUrl='/shopping/lists' />
        {isShoppingListDataLoading ? (
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
                  Tytuł: {shoppingListData?.title}
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
                {shoppingListData?.description ?? 'Brak opisu'}
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
                  {allTags?.items
                    .sort((tag1, tag2) => tag1.name.localeCompare(tag2.name))
                    .map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
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
                  .filter((entry) =>
                    tagIdToFilterBy !== null
                      ? entry.tags
                          .map((tag) => tag.id)
                          .includes(tagIdToFilterBy)
                      : true
                  )
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
                          tagsNames={entry.tags.map((tag) => tag.name)}
                          shoppingListEntry={entry}
                          shoppingListId={shoppingListData.id}
                          isEditionMode={isEditionMode}
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
      <AddItemToShoppingListModal
        isModalVisible={
          isAdditionModalVisible &&
          !isNewProductCreationModalVisible &&
          !isNewTagCreationModalVisible
        }
        setIsModalVisible={setIsAdditionModalVisible}
        shoppingListId={Number(params.shoppingListId)}
        setIsNewProductCreationModalVisible={
          setIsNewProductCreationModalVisible
        }
      />
      <CreateNewShoppingItemModal
        isModalVisible={
          isNewProductCreationModalVisible && !isNewTagCreationModalVisible
        }
        setIsModalVisible={setIsNewProductCreationModalVisible}
        setIsNewTagCreationModalVisible={setIsNewTagCreationModalVisible}
      />
      <CreateNewTagModal
        isModalVisible={isNewTagCreationModalVisible}
        setIsModalVisible={setIsNewTagCreationModalVisible}
      />
    </>
  )
}

export default ShoppingListView
