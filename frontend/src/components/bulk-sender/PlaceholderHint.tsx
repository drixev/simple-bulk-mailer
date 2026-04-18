import type { Recipient } from '../../types/index.js'
import styles from './PlaceholderHint.module.css'

interface Props {
  recipients: Recipient[]
}

export function PlaceholderHint({ recipients }: Props) {
  if (!recipients.length) return null

  const keys = Object.keys(recipients[0])

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Available placeholders:</span>
      <div className={styles.pills}>
        {keys.map((key) => (
          <code key={key} className={styles.pill}>
            {`{{${key}}}`}
          </code>
        ))}
      </div>
    </div>
  )
}