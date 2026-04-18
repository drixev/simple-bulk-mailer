import { useState, useRef } from 'react'
import { useCsvParser } from '../../hooks/useCsvParser.js'
import type { Recipient } from '../../types/index.js'
import styles from './RecipientManager.module.css'

interface Props {
  recipients: Recipient[]
  onChange: (recipients: Recipient[]) => void
}

export function RecipientManager({ recipients, onChange }: Props) {
  const [tab, setTab] = useState<'paste' | 'csv'>('paste')
  const [pasteValue, setPasteValue] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const { parseFile, parseText, error } = useCsvParser()

  function handlePasteApply() {
    const parsed = parseText(pasteValue)
    onChange(parsed)
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const parsed = await parseFile(file)
    onChange(parsed)
    e.target.value = ''
  }

  function removeRecipient(index: number) {
    onChange(recipients.filter((_, i) => i !== index))
  }

  function clearAll() {
    onChange([])
    setPasteValue('')
  }

  const columns = recipients.length
    ? Object.keys(recipients[0]).filter((k) => k !== 'email')
    : []

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputArea}>
        <div className={styles.tabs}>
          <button
            className={tab === 'paste' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setTab('paste')}
          >
            Paste list
          </button>
          <button
            className={tab === 'csv' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            onClick={() => setTab('csv')}
          >
            Upload CSV
          </button>
        </div>

        {tab === 'paste' && (
          <div className={styles.pasteArea}>
            <textarea
              className={styles.textarea}
              value={pasteValue}
              onChange={(e) => setPasteValue(e.target.value)}
              placeholder={`One email per line. Supports:\nemail@example.com\nJohn Doe <john@example.com>`}
              rows={5}
            />
            <button
              className={styles.btnApply}
              onClick={handlePasteApply}
              disabled={!pasteValue.trim()}
            >
              Apply
            </button>
          </div>
        )}

        {tab === 'csv' && (
          <div className={styles.csvArea}>
            <p className={styles.csvHint}>
              CSV must have an <code>email</code> column. Any other columns
              become available as <code>{'{{placeholders}}'}</code>.
            </p>
            <button
              className={styles.btnUpload}
              onClick={() => fileRef.current?.click()}
            >
              Choose CSV file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              onChange={handleFile}
            />
            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}
      </div>

      {recipients.length > 0 && (
        <div className={styles.tableArea}>
          <div className={styles.tableHeader}>
            <span className={styles.tableCount}>
              {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
            </span>
            <button className={styles.btnClear} onClick={clearAll}>
              Clear all
            </button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  {columns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {recipients.map((r, i) => (
                  <tr key={i}>
                    <td>{r.email}</td>
                    {columns.map((col) => (
                      <td key={col}>{r[col] ?? '—'}</td>
                    ))}
                    <td>
                      <button
                        className={styles.btnRemove}
                        onClick={() => removeRecipient(i)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}