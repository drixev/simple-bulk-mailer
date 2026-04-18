# bulk-mailer — backend

REST API responsible for sending emails through any SMTP server. It exposes endpoints for composing single emails, running bulk sends with personalized content, and managing the SMTP configuration. Settings are persisted locally in a `config.json` file so no database is needed.
