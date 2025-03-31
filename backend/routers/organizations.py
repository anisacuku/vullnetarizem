from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_organizations():
    return {"message": "Organizations endpoint is working!"}
