import styles from '@src/components/common/Dropdown.module.css'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

export type DropdownItem = {
  label: string
  onClick: () => void
}

type DropdownProps = {
  dropdownText: string
  items: DropdownItem[]
}

const Dropdown = (props: DropdownProps) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false)

  return (
    <div
      className={styles.dropdownButtonContainer}
      onClick={() => setIsPopoverVisible((cur) => !cur)}
    >
      <p>{props.dropdownText}</p>
      <ChevronDown />
      {isPopoverVisible && (
        <div className={styles.popover}>
          {props.items.map((item) => (
            <div onClick={item.onClick} className={styles.dropdownItem}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown
