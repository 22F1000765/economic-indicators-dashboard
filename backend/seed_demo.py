from datetime import date

from sqlalchemy import select

from app.database import SessionLocal
from app.models import IndicatorObservation

with SessionLocal() as db:
    existing = db.scalar(
        select(IndicatorObservation).where(
            IndicatorObservation.indicator_id == "gdp-growth",
            IndicatorObservation.data_status == "illustrative",
        )
    )

    if existing:
        print("Illustrative GDP test record already exists.")
    else:
        observation = IndicatorObservation(
            indicator_id="gdp-growth",
            name="GDP Growth",
            value=6.5,
            unit="%",
            observation_date=date(2025, 3, 31),
            source="Illustrative demo data — not verified",
            source_url=None,
            data_status="illustrative",
        )

        db.add(observation)
        db.commit()
        print("Illustrative GDP test record inserted successfully.")
