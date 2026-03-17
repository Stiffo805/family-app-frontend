import useGetShoppingList from '@src/api/hooks/useGetShoppingList'
import ButtonWithIcon from '@src/components/ButtonWithIcon'
import GoBackArrow from '@src/components/GoBackArrow'
import LogoutButton from '@src/components/LogoutButton'
import ShoppingListItem from '@src/components/ShoppingListItem'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListView.module.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { BellMinus, BellPlus, Download } from 'lucide-react'
import { useRef, useState } from 'react'
import { useParams } from 'react-router'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import {
  subscribeToListNotifications,
  unsubscribeFromListNotifications
} from '@src/api/pushSubscription'
import { usePushStatus } from '@src/api/hooks/usePushStatus'

const ShoppingListView = () => {
  const params = useParams()

  const [isPdfDownloading, setIsPdfDownloading] = useState(false)
  const [isDocxDownloading, setIsDocxDownloading] = useState(false)

  const { isSubscribed, setIsSubscribed } = usePushStatus(
    Number(params.shoppingListId)
  )

  const { data, isLoading } = useGetShoppingList({
    shoppingListId: Number(params.shoppingListId)
  })

  const shoppingListContainerRef = useRef<HTMLElement>(null)

  const handleDownloadPdf = async () => {
    if (!data) return
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

      pdf.save(`Zakupy - ${data.title}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF document: ', error)
    }
    setIsPdfDownloading(false)
  }

  const handleDownloadDocx = async () => {
    if (!data) return
    setIsDocxDownloading(true)
    try {
      const entryParagraphs = data.entries
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
                font: '24px',
                break: 1
              }),
              new TextRun({
                text: `${entry.product_name || 'Nieznany produkt'} - ${Number(entry.quantity)} ${entry.unit_display}`,
                font: '24px'
              }),
              new TextRun({
                text: entry.extra_notes || 'Brak uwag',
                color: '#808080',
                break: 1
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
                text: `Tytuł: ${data.title}`,
                heading: HeadingLevel.HEADING_1
              }),
              new Paragraph({
                text: 'Opis:',
                heading: HeadingLevel.HEADING_2
              }),
              new Paragraph({
                text: data.description || 'Brak opisu'
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
      link.download = `Zakupy - ${data.title}.docx`
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate DOCX document: ', error)
    }
    setIsDocxDownloading(false)
  }

  return (
    <div className={styles.shoppingListsView}>
      <LogoutButton />
      <GoBackArrow targetUrl='/shopping/lists' />
      {isLoading ? (
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
              if (data?.id)
                if (isSubscribed)
                  unsubscribeFromListNotifications(data.id).then(() =>
                    setIsSubscribed(false)
                  )
                else
                  subscribeToListNotifications(data.id).then(() => {
                    setIsSubscribed(true)
                  })
            }}
          />
          <article
            className={styles.shoppingListContainer}
            ref={shoppingListContainerRef}
          >
            <div className={`${styles.mainHeaderContainer} pdf-element`}>
              <header className={styles.mainHeader}>
                Tytuł: {data?.title}
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
              {data?.description ?? 'Brak opisu'}
            </section>
            <hr className='pdf-element' />
            <section>
              <header className='pdf-element'>Przedmioty zakupowe</header>
              {data?.entries
                .sort(
                  (entry1, entry2) =>
                    Number(entry1.is_checked) - Number(entry2.is_checked)
                )
                .map((entry) => (
                  <div key={entry.id} className='pdf-element'>
                    <ShoppingListItem
                      shoppingListEntry={entry}
                      shoppingListId={data.id}
                    />
                    <hr />
                  </div>
                ))}
            </section>
          </article>
        </main>
      )}
    </div>
  )
}

export default ShoppingListView
