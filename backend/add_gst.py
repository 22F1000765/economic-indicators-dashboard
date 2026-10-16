
from datetime import date

from sqlalchemy import select
from app.database import Base, SessionLocal, engine
from app.models import IndicatorObservation

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    statement = select(IndicatorObservation).where(
        IndicatorObservation.indicator_id == "gst-collection"
    )
    observation = db.scalars(statement).first()

    values = {
        "indicator_id": "gst-collection",
        "name": "Gross GST Collection",
        "value": 203521,
        "unit": "₹ crore",
        "observation_date": date(2026, 9, 30),
        "source": "GSTN — provisional September 2026 collection",
        "source_url": "https://tutorial.gst.gov.in/downloads/news/final_gst_revenue_report_for_publishing_monthly_sep_2026.pdf",
        "data_status": "verified",
    }

    if observation:
        for key, value in values.items():
            setattr(observation, key, value)
    else:
        db.add(IndicatorObservation(**values))

    db.commit()

print("GST observation saved successfully.")
