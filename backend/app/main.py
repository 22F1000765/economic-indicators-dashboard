
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import IndicatorObservation

app = FastAPI(
    title="Economic Indicators Dashboard API",
    version="1.0.0",
    description="API for the Economic Indicators Dashboard",
)

# Local development origins. Restrict these to the deployed
# frontend origin when configuring production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "economic-indicators-dashboard-api",
    }


@app.get("/api/indicators")
def get_indicators():
    with SessionLocal() as db:
        statement = (
            select(IndicatorObservation)
            .order_by(
                IndicatorObservation.indicator_id,
                IndicatorObservation.observation_date.desc(),
            )
        )
        observations = db.scalars(statement).all()

        return {
            "data_status": (
                "available" if observations else "unavailable"
            ),
            "message": (
                "Database observations retrieved."
                if observations
                else "No indicator observations have been collected yet."
            ),
            "as_of": datetime.now(timezone.utc).isoformat(),
            "indicators": [
                {
                    "id": item.indicator_id,
                    "name": item.name,
                    "value": item.value,
                    "unit": item.unit,
                    "observation_date": (
                        item.observation_date.isoformat()
                    ),
                    "source": item.source,
                    "source_url": item.source_url,
                    "data_status": item.data_status,
                }
                for item in observations
            ],
        }