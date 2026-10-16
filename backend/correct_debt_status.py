
from sqlalchemy import select
from app.database import SessionLocal
from app.models import IndicatorObservation

with SessionLocal() as db:
    statement = select(IndicatorObservation).where(
        IndicatorObservation.indicator_id == "debt-to-gdp"
    )
    observation = db.scalars(statement).first()

    if observation:
        observation.data_status = "illustrative"
        observation.source = (
            "Union Budget 2026-27 — Budget Estimate, not actual"
        )
        db.commit()
        print("Debt-to-GDP status corrected.")
    else:
        print("Debt-to-GDP observation not found.")
