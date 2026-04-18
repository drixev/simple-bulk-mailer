import { useState } from 'react'
import { mailApi } from '../api/index.js'
import type { Recipient, SendResult } from '../types/index.js'
import styles from './BulkPage.module.css'
import { BulkProgress } from '../components/bulk-sender/BulkProgress.js'
import { PlaceholderHint } from '../components/bulk-sender/PlaceholderHint.js'
import { RecipientManager } from '../components/bulk-sender/RecipientManager.js'
import { Editor } from '../components/editor/Editor.js'

export default function BulkPage() {
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [subject, setSubject] = useState('')
  const [html, setHtml] = useState('')
  const [showHtml, setShowHtml] = useState(false)
  const [delayMs, setDelayMs] = useState(1000)
  const [sending, setSending] = useState(false)
  const [results, setResults] = useState<SendResult[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const canSend = recipients.length > 0 && subject.trim() && html.trim() && !sending

  async function handleSend() {
    if (!canSend) return
    setSending(true)
    setResults([])
    setErrorMsg('')

    try {
      const res = await mailApi.bulk({ recipients, subject, html, delayMs })
      setResults(res.results)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error ?? err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bulk sender</h1>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showHtml}
            onChange={(e) => setShowHtml(e.target.checked)}
          />
          Show HTML
        </label>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recipients</h2>
        <RecipientManager recipients={recipients} onChange={setRecipients} />
      </section>

      {recipients.length > 0 && (
        <PlaceholderHint recipients={recipients} />
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Email</h2>
        <div className={styles.field}>
          <label className={styles.label}>Subject</label>
          <input
            className={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Hello {{name}}, here is your update"
          />
        </div>
        <Editor
          onChange={setHtml}
          showHtmlPanel={showHtml}
          placeholder="Write your email. Use {{name}}, {{company}} etc. for personalization..."
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Options</h2>
        <div className={styles.optionRow}>
          <label className={styles.label}>Delay between sends</label>
          <select
            className={styles.select}
            value={delayMs}
            onChange={(e) => setDelayMs(Number(e.target.value))}
          >
            <option value={500}>0.5 seconds</option>
            <option value={1000}>1 second</option>
            <option value={2000}>2 seconds</option>
            <option value={5000}>5 seconds</option>
          </select>
          <span className={styles.optionHint}>
            Avoid rate limiting by adding a delay between each email
          </span>
        </div>
      </section>

      {errorMsg && <p className={styles.error}>{errorMsg}</p>}

      <BulkProgress
        total={recipients.length}
        results={results}
        sending={sending}
      />

      <div className={styles.actions}>
        <span className={styles.recipientCount}>
          {recipients.length > 0
            ? `Sending to ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}`
            : 'No recipients added yet'}
        </span>
        <button
          className={styles.btnPrimary}
          onClick={handleSend}
          disabled={!canSend}
        >
          {sending ? `Sending... (${results.length}/${recipients.length})` : 'Send to all'}
        </button>
      </div>
    </div>
  )
}