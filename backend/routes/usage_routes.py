from fastapi import APIRouter

router = APIRouter(prefix="/usage", tags=["Usage"])


@router.get("/")
def get_usage():
    return {"message": "usage route working"}