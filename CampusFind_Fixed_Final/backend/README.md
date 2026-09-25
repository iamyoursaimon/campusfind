# CampusFind API

## Setup

1. Open a terminal in `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set MongoDB and SMTP values.
4. Run `npm run dev`.

The API runs on `http://localhost:5000`.

## Endpoints

- `GET /api/health`
- `GET /api/reports?campus=gec&status=lost`
- `POST /api/reports`
- `POST /api/subscribers`

New reports are stored in MongoDB. Email notifications are sent to subscribers registered for the report campus and to subscribers using `all` campuses when SMTP is configured.
