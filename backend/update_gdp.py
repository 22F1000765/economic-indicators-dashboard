from datetime import date

from sqlalchemy import select

from app.database import SessionLocal
from app.models import IndicatorObservation

SOURCE_URL = (
    "https://www.pib.gov.in/PressReleasePage.aspx"
    "?PRID=2304948&lang=2&reg=48"
)

with SessionLocal() as db:
    observation = db.scalar(
        select(IndicatorObservation)
        .where(
            IndicatorObservation.indicator_id == "gdp-growth",
            IndicatorObservation.data_status == "illustrative",
        )
        .order_by(IndicatorObservation.id.desc())
    )

    if observation is None:
        print("No illustrative GDP record found. No changes made.")
    else:
        observation.value = 7.8
        observation.unit = "%"
        observation.observation_date = date(2026, 3, 31)
        observation.source = (
            "MoSPI / PIB — official revised FY 2025-26 estimate"
        )
        observation.source_url = SOURCE_URL
        observation.data_status = "verified"

        db.commit()
        print("GDP observation updated successfully.")
