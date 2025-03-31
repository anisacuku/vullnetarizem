from fastapi import APIRouter
import pandas as pd
from backend.database import OPPORTUNITIES_FILE, deserialize_list

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


@router.get("/")
def get_opportunities():
    df = pd.read_csv(OPPORTUNITIES_FILE)

    if df.empty:
        return []

    opportunities = df.to_dict(orient="records")

    # Convert stringified fields to real lists
    for opp in opportunities:
        opp["required_skills"] = deserialize_list(opp.get("required_skills", "[]"))
        opp["interests_alignment"] = deserialize_list()(opp.get("interests_alignment", "[]"))
        opp["tags"] = deserialize_list(opp.get("tags", "[]"))

    return opportunities
