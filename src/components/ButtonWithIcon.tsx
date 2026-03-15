import type { LucideIcon } from 'lucide-react'
import styles from '@src/components/ButtonWithIcon.module.css'
import { useEffect, useRef, useState, type MouseEventHandler } from 'react'

type ButtonWithIconProps = {
  icon: LucideIcon
  text: string
  onClick: MouseEventHandler<HTMLButtonElement>
  variant: 'primary' | 'secondary'
  maxWidth?: number
  maxHeight?: number
  gap?: string
  iconSize?: number
  alwaysShowTooltip?: boolean
  isCircleButton?: boolean
  disabled?: boolean
  disabledTooltip?: string
}

const DEFAULT_GAP = '5px'

const ButtonWithIcon = (props: ButtonWithIconProps) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const ghostContentRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onResize = () => {
      const parentWidth = buttonRef.current?.parentElement?.offsetWidth
      const ghostContentWidth = ghostContentRef.current?.offsetWidth

      if (props.maxWidth && props.maxWidth <= 1) {
        if (
          ghostContentWidth &&
          parentWidth &&
          ghostContentWidth >= props.maxWidth * parentWidth
        ) {
          setShowTooltip(true)
        } else {
          setShowTooltip(false)
        }
      } else if (props.maxWidth) {
        if (ghostContentWidth && ghostContentWidth > props.maxWidth) {
          setShowTooltip(true)
        } else {
          setShowTooltip(false)
        }
      }
    }

    onResize()

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [props.maxWidth])

  return (
    <button
      ref={buttonRef}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${styles.button} ${props.isCircleButton ? styles.circleButton : ''} ${props.variant ? styles[props.variant] : ''}`}
      style={{
        maxHeight: props.maxHeight
      }}
    >
      <div style={{ gap: props.gap ?? DEFAULT_GAP }}>
        {showTooltip || props.alwaysShowTooltip ? (
          <span className={styles.tooltip}>
            {props.disabled && props.disabledTooltip
              ? props.disabledTooltip
              : props.text}
          </span>
        ) : (
          <span>{props.text}</span>
        )}
        <props.icon size={props.iconSize ?? 28} />
      </div>

      {/* GHOST ELEMENT - must be of the same size as button content */}
      {!props.alwaysShowTooltip && (
        <div
          ref={ghostContentRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            height: 0,
            overflow: 'hidden',
            display: 'flex',
            gap: props.gap ?? DEFAULT_GAP
          }}
          aria-hidden='true'
        >
          <span>{props.text}</span>
          <props.icon size={props.iconSize ?? 28} />
        </div>
      )}
    </button>
  )
}

export default ButtonWithIcon
