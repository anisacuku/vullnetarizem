from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def test_volunteers():
    return {"message": "Volunteers endpoint is working!"}
