import os
from datetime import datetime, timezone

import json
import time
from urllib.error import URLError, HTTPError
from urllib.request import Request, urlopen

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

frontend_origin = os.getenv("FRONTEND_ORIGIN")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

if frontend_origin:
    allowed_origins.append(frontend_origin.rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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

MARKET_CACHE = {"expires_at": 0, "data": None}

MARKET_INDICES = [
    {"name": "NIFTY 50", "symbol": "^NSEI"},
    {"name": "SENSEX", "symbol": "^BSESN"},
    {"name": "BANK NIFTY", "symbol": "^NSEBANK"},
]


def fetch_market_index(name: str, symbol: str):
    url = (
        "https://query1.finance.yahoo.com/v8/finance/chart/"
        f"{symbol}?range=5d&interval=1d"
    )

    request = Request(
        url,
        headers={"User-Agent": "Mozilla/5.0"},
    )

    try:
        with urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))

        result = payload["chart"]["result"][0]
        timestamps = result.get("timestamp", [])
        closes = result["indicators"]["quote"][0]["close"]

        valid_points = [
            (timestamp, close)
            for timestamp, close in zip(timestamps, closes)
            if close is not None
        ]

        if not valid_points:
            raise ValueError("No closing prices returned")

        timestamp, latest = valid_points[-1]
        previous = (
            valid_points[-2][1]
            if len(valid_points) >= 2
            else None
        )

        change = (
            round(latest - previous, 2)
            if previous is not None
            else None
        )

        change_percent = (
            round((latest - previous) / previous * 100, 2)
            if previous not in (None, 0)
            else None
        )

        return {
            "name": name,
            "symbol": symbol,
            "value": round(latest, 2),
            "change": change,
            "change_percent": change_percent,
            "timestamp": datetime.fromtimestamp(
                timestamp, timezone.utc
            ).isoformat(),
            "status": "available",
            "source": "Yahoo Finance",
            "source_url": (
                "https://finance.yahoo.com/quote/"
                + symbol.replace("^", "%5E")
            ),
        }

    except (
        HTTPError,
        URLError,
        TimeoutError,
        ValueError,
        KeyError,
        IndexError,
        TypeError,
    ):
        return {
            "name": name,
            "symbol": symbol,
            "value": None,
            "change": None,
            "change_percent": None,
            "timestamp": None,
            "status": "unavailable",
            "source": "Yahoo Finance",
            "source_url": (
                "https://finance.yahoo.com/quote/"
                + symbol.replace("^", "%5E")
            ),
        }


@app.get("/api/market-watch")
def get_market_watch():
    now = time.monotonic()

    if (
        MARKET_CACHE["data"] is not None
        and now < MARKET_CACHE["expires_at"]
    ):
        return MARKET_CACHE["data"]

    indices = [
        fetch_market_index(item["name"], item["symbol"])
        for item in MARKET_INDICES
    ]

    payload = {
        "data_status": (
            "available"
            if any(item["status"] == "available" for item in indices)
            else "unavailable"
        ),
        "as_of": datetime.now(timezone.utc).isoformat(),
        "indices": indices,
    }

    MARKET_CACHE["data"] = payload
    MARKET_CACHE["expires_at"] = now + 300

    return payload



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
            "breakdowns": {
    "trade-balance": {
        "period": "September 2026",
        "exports": 80.75,
        "imports": 94.05,
        "balance": -13.30,
        "unit": "US$ billion",
        "source": "Ministry of Commerce and Industry",
        "source_url": "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2323944&lang=1&reg=3",
    },
    "government-expenditure": {
        "period": "FY 2025–26 (provisional)",
        "total": 4905151,
        "capital": 1069119,
        "unit": "₹ crore",
        "source": "Controller General of Accounts",
        "source_url": "https://cga.nic.in/writereaddata/MonthAccount/32026/DATA2526.htm",
    },
},
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