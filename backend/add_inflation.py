
from datetime import date

from sqlalchemy import select
from app.database import Base, SessionLocal, engine
from app.models import IndicatorObservation

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    statement = select(IndicatorObservation).where(
        IndicatorObservation.indicator_id == "inflation"
    )
    observation = db.scalars(statement).first()

    values = {
        "indicator_id": "inflation",
        "name": "India CPI Inflation",
        "value": 5.54,
        "unit": "%",
        "observation_date": date(2026, 9, 30),
        "source": "MoSPI / PIB — provisional September 2026 CPI",
        "source_url": "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2322244&lang=1&reg=3",
        "data_status": "verified",
    }

    if observation:
        for key, value in values.items():
            setattr(observation, key, value)
    else:
        db.add(IndicatorObservation(**values))

    db.commit()

print("Inflation observation saved successfully.")
