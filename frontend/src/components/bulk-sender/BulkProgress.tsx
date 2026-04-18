import type { SendResult } from '../../types/index.js'
import styles from './BulkProgress.module.css'

interface Props {
  total: number
  results: SendResult[]
  sending: boolean
}

export function BulkProgress({ total, results, sending }: Props) {
  if (!sending && !results.length) return null

  const sent = results.length
  const succeeded = results.filter((r:any) => r.success).length
  const failed = results.filter((r:any) => !r.success).length
  const percent = total ? Math.round((sent / total) * 100) : 0

  return (
    <div className={styles.wrapper}>
      <div className={styles.stats}>
        <span className={styles.stat}>
          {sent} / {total} sent
        </span>
        {succeeded > 0 && (
          <span className={`${styles.stat} ${styles.success}`}>
            {succeeded} succeeded
          </span>
        )}
        {failed > 0 && (
          <span className={`${styles.stat} ${styles.failed}`}>
            {failed} failed
          </span>
        )}
      </div>

      <div className={styles.barTrack}>
        <div
          className={failed > 0 ? `${styles.barFill} ${styles.barFillError}` : styles.barFill}
          style={{ width: `${percent}%` }}
        />
      </div>

      {results.length > 0 && (
        <div className={styles.log}>
          {results.map((r:any, i) => (
            <div
              key={i}
              className={r.success ? `${styles.logRow} ${styles.logSuccess}` : `${styles.logRow} ${styles.logFail}`}
            >
              <span className={styles.logIcon}>{r.success ? '✓' : '✕'}</span>
              <span className={styles.logEmail}>{r.email}</span>
              {r.error && <span className={styles.logError}>{r.error}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}