# Bulk Mailer

A lightweight, self-hosted email sending tool with a React frontend and a Fastify backend. Built for sending personalized bulk emails through any SMTP server

## Features

- **Compose** — send a single email to one recipient with a rich-text editor and optional raw HTML preview.
- **Bulk sender** — send personalized emails to a list of recipients using `{{placeholder}}` syntax in both the subject and body (e.g. `{{name}}`, `{{company}}`).
- **Configurable delay** — add a delay between sends (0.5 s – 5 s) to avoid SMTP rate limiting.
- **Live progress** — tracks per-recipient success/failure in real time while the batch is running.
- **SMTP settings UI** — configure host, port, credentials, and connection label without touching config files.

## Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React + TypeScript + Vite         |
| Backend  | Fastify + TypeScript + Nodemailer |
| Monorepo | npm workspaces + concurrently     |

## Getting Started

```bash
# Install dependencies
npm install

# Run both frontend and backend in dev mode
npm run dev
```

Backend runs on `http://localhost:3000` by default; the Vite dev server proxies API requests from the frontend.

## Configuration

SMTP settings are stored in `backend/config.json` and can also be edited through the **Settings** page in the UI. The connection can be verified directly from the settings panel before sending.
