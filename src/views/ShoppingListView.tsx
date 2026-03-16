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
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true
      })

      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF('p', 'mm', 'a4')

      const pdfWidth = pdf.internal.pageSize.getWidth()

      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Zakupy - ${data?.title}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF document: ', error)
    }
  }

  return (
    <div className={styles.shoppingListsView}>
      <LogoutButton />
      <GoBackArrow targetUrl='/shopping/lists' />
      {isLoading ? (
        <Spinner />
      ) : (
        <article className={styles.shoppingListContainer} ref={shoppingListContainerRef}>
          <div className={styles.mainHeaderContainer}>
            <header className={styles.mainHeader}>Tytuł: {data?.title}</header>
            <ButtonWithIcon
              icon={Download}
              text='Pobierz pdf'
              variant='secondary'
              onClick={handleDownloadPdf}
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
