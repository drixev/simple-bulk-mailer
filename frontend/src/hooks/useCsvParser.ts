import { useState } from 'react'
import Papa from 'papaparse'
import type { Recipient } from '../types/index.js'

export function useCsvParser() {
  const [error, setError] = useState('')

  function parseFile(file: File): Promise<Recipient[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete(results) {
          const rows = results.data as Record<string, string>[]
          if (!rows.length) {
            setError('CSV file is empty')
            return reject('empty')
          }
          const first = rows[0]
          if (!('email' in first)) {
            setError('CSV must have an "email" column')
            return reject('no email column')
          }
          setError('')
          resolve(rows as Recipient[])
        },
        error(err) {
          setError(err.message)
          reject(err)
        }
      })
    })
  }

  function parseText(raw: string): Recipient[] {
    const lines = raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    return lines.map((line) => {
      // support "Name <email>" format or plain email
      const match = line.match(/^(.+?)\s*<(.+?)>$/)
      if (match) {
        return { name: match[1].trim(), email: match[2].trim() }
      }
      return { email: line }
    })
  }

  return { parseFile, parseText, error }
}