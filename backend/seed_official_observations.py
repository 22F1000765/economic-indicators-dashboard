
from datetime import date

from sqlalchemy import select

from app.database import SessionLocal
from app.models import IndicatorObservation


observations = [
    {
        "indicator_id": "debt-to-gdp",
        "name": "Central Government Debt to GDP",
        "value": 55.6,
        "unit": "%",
        "observation_date": date(2027, 3, 31),
        "source": "Union Budget 2026-27 — Budget Estimate",
        "source_url": (
            "https://www.pib.gov.in/PressReleasePage.aspx"
            "?PRID=2221389&lang=1&reg=6"
        ),
        "data_status": "verified",
    },
    {
        "indicator_id": "trade-balance",
        "name": "India Total Trade Balance",
        "value": -13.30,
        "unit": "US$ billion",
        "observation_date": date(2026, 9, 30),
        "source": "Ministry of Commerce and Industry / PIB",
        "source_url": (
            "https://www.pib.gov.in/PressReleseDetailm.aspx"
            "?PRID=2323944&lang=1&reg=3"
        ),
        "data_status": "verified",
    },
    {
        "indicator_id": "government-expenditure",
        "name": "Union Government Total Expenditure",
        "value": 4905151,
        "unit": "₹ crore",
        "observation_date": date(2026, 3, 31),
        "source": "Controller General of Accounts — Provisional FY 2025-26",
        "source_url": (
            "https://cga.nic.in/writereaddata/MonthAccount/"
            "32026/DATA2526.htm"
        ),
        "data_status": "verified",
    },
]


with SessionLocal() as db:
    for observation in observations:
        existing = db.scalar(
            select(IndicatorObservation)
            .where(
                IndicatorObservation.indicator_id
                == observation["indicator_id"]
            )
            .order_by(
                IndicatorObservation.observation_date.desc()
            )
        )

        if existing:
            for key, value in observation.items():
                setattr(existing, key, value)
        else:
            db.add(IndicatorObservation(**observation))

    db.commit()

print("Official-source observations saved successfully.")
