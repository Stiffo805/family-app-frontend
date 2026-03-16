import useGetShoppingList from '@src/api/hooks/useGetShoppingList'
import ButtonWithIcon from '@src/components/ButtonWithIcon'
import GoBackArrow from '@src/components/GoBackArrow'
import LogoutButton from '@src/components/LogoutButton'
import ShoppingListItem from '@src/components/ShoppingListItem'
import Spinner from '@src/components/Spinner'
import styles from '@src/views/ShoppingListView.module.css'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Download } from 'lucide-react'
import { useRef } from 'react'
import { useParams } from 'react-router'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

const ShoppingListView = () => {
  const params = useParams()
  const { data, isLoading } = useGetShoppingList({
    shoppingListId: Number(params.shoppingListId)
  })

  const shoppingListContainerRef = useRef<HTMLElement>(null)

  const handleDownloadPdf = async () => {
    const element = shoppingListContainerRef.current

    if (!element) return

    try {
      // 1. Configure html2canvas to capture the full scrollable height
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        scrollY: -window.scrollY, // Prevents white spaces at the top if scrolled down
        windowHeight: element.scrollHeight, // Capture the full height of the element
        height: element.scrollHeight // Ensure the canvas is tall enough
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')

      // 2. Calculate dimensions for A4 page
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      // 3. Add the first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
      heightLeft -= pageHeight

      // 4. If the image is taller than one A4 page, add new pages dynamically
      while (heightLeft > 0) {
        // Shift the image upwards by the height of one page
        position = position - pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`Zakupy - ${data?.title}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF document: ', error)
    }
  }

  const handleDownloadDocx = async () => {
    // Safety check: ensure data is loaded before trying to export
    if (!data) return

    try {
      // 1. Map shopping list entries to DOCX paragraphs
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

      // 2. Construct the Word document structure
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
                text: '' // Empty line for spacing
              }),
              new Paragraph({
                text: 'Przedmioty zakupowe:',
                heading: HeadingLevel.HEADING_2
              }),
              // Inject the dynamically mapped items
              ...entryParagraphs
            ]
          }
        ]
      })

      // 3. Generate a binary blob and trigger the native browser download
      const blob = await Packer.toBlob(doc)
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = `Zakupy - ${data.title}.docx`
      document.body.appendChild(link)
      link.click()

      // 4. Cleanup to prevent memory leaks
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to generate DOCX document: ', error)
    }
  }

  return (
    <div className={styles.shoppingListsView}>
      <LogoutButton />
      <GoBackArrow targetUrl='/shopping/lists' />
      {isLoading ? (
        <Spinner />
      ) : (
        <article
          className={styles.shoppingListContainer}
          ref={shoppingListContainerRef}
        >
          <div className={styles.mainHeaderContainer}>
            <header className={styles.mainHeader}>Tytuł: {data?.title}</header>
          </div>
          <div className={styles.buttonsContainer}>
            <ButtonWithIcon
              icon={Download}
              iconSize={16}
              text='Pobierz pdf'
              variant='primary'
              onClick={handleDownloadPdf}
            />
            <ButtonWithIcon
              icon={Download}
              iconSize={16}
              text='Pobierz docx'
              variant='primary'
              onClick={handleDownloadDocx}
            />
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
