
# Economic Indicators Dashboard

A full-stack dashboard for viewing Indian economic indicators using a React and TypeScript frontend, FastAPI backend, and PostgreSQL database.

## Live Application

- **Frontend:** https://economic-indicators-dashboard-snowy.vercel.app/
- **Backend API:** https://economic-indicators-dashboard-api.onrender.com/
- **API health:** https://economic-indicators-dashboard-api.onrender.com/health
- **Indicators endpoint:** https://economic-indicators-dashboard-api.onrender.com/api/indicators
- **API documentation:** https://economic-indicators-dashboard-api.onrender.com/docs

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Axios

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- psycopg

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Dashboard Indicators

The dashboard includes panels for:

1. GDP growth
2. Central government debt-to-GDP ratio
3. Imports, exports and trade balance
4. GST collection
5. CPI inflation
6. Government expenditure

Market Watch includes NIFTY 50, SENSEX and BANK NIFTY display cards.

## Data Sources and Limitations

Indicator records include a source name, source URL, observation date and data-status label where available.

Sources currently represented in the database include:
- Ministry of Statistics and Programme Implementation (MoSPI) / Press Information Bureau (PIB)
- Controller General of Accounts (CGA)
- GSTN
- Ministry of Commerce and Industry

Data may be provisional, revised, or budget estimates. Check the source and status displayed for each indicator before interpreting a value.

The debt-to-GDP record is a Budget Estimate, not an actual observed result. The current API stores individual observations rather than complete historical time series. Historical charts are therefore unavailable until historical observations are collected.

Market Watch currently uses unavailable placeholders; it is not yet a verified live market feed. Automated scheduled data collection has not yet been implemented. Data updates are currently managed through backend scripts.

The current API does not implement JWT authentication or protected user routes. These remain future enhancements.

## API

### `GET /health`

Returns the service health status.

### `GET /api/indicators`

Returns the stored indicator observations.

Example response structure:

```json
{
  "data_status": "available",
  "message": "Database observations retrieved.",
  "as_of": "ISO-8601 timestamp",
  "indicators": [
    {
      "id": "inflation",
      "name": "India CPI Inflation",
      "value": 5.54,
      "unit": "%",
      "observation_date": "2026-09-30",
      "source": "Source name",
      "source_url": "https://example.com/source",
      "data_status": "verified"
    }
  ]
}
```

The example illustrates the response format; the live API is the source of current stored values.

## Environment Variables

### Backend

Configure these in `backend/.env` locally and in the backend hosting provider's environment settings:

- `DATABASE_URL` — PostgreSQL connection string
- `FRONTEND_ORIGIN` — deployed frontend origin used for CORS

Never commit real credentials or `.env` files.

### Frontend

Configure `VITE_API_BASE_URL` in `frontend/.env` locally and in Vercel's environment settings.

Production value:

`https://economic-indicators-dashboard-api.onrender.com`

Vite environment variables prefixed with `VITE_` are exposed to the browser. Do not put secrets in them.

## Run Locally

### Backend

From the `backend` directory:

1. Create and activate a Python virtual environment.
2. Install dependencies:

   `pip install -r requirements.txt`

3. Configure `DATABASE_URL` in `backend/.env`.
4. Start FastAPI:

   `uvicorn app.main:app --reload`

The local API runs at `http://127.0.0.1:8000`.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

### Frontend

From the `frontend` directory:

1. Install dependencies:

   `npm install`

2. Configure `VITE_API_BASE_URL` in `frontend/.env`:

   `VITE_API_BASE_URL=http://127.0.0.1:8000`

3. Start the development server:

   `npm run dev`

4. Create a production build:

   `npm run build`

The frontend development server normally runs at `http://localhost:5173`.

## Database

The application uses PostgreSQL through SQLAlchemy. The current observation table stores indicator ID, name, value, unit, observation date, source metadata, data status and collection timestamp.

Keep database credentials private. The database should be accessed by the backend, not directly from browser code.

## Security and Reliability Notes

- The frontend calls the backend API rather than scraping upstream sources directly.
- CORS is configured using the local development origins and the configured production frontend origin.
- The API uses a request timeout on the frontend client.
- Historical series, scheduled collection, upstream retries and full stale-data handling remain areas for improvement.
- No evaluation login account is configured because authentication is not currently implemented.

## Repository Structure

```text
economic-indicators-dashboard/
├── backend/
│   ├── app/
│   │   ├── database.py
│   │   ├── main.py
│   │   └── models.py
│   ├── requirements.txt
│   └── .gitignore
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .gitignore
├── .gitignore
└── README.md
```

## Future Improvements

- Integrate and validate a live market data source.
- Collect and store historical observations.
- Implement scheduled collection, validation, caching and failure recovery.
- Add authentication and protected routes.
- Improve automated testing, monitoring and chart performance.
