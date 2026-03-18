from fastapi import APIRouter, Query
from services.dashboard3_service import (
    get_dashboard3_distribution,
    get_interaction_analysis,
)

router = APIRouter(prefix="/dashboard3", tags=["dashboard3"])


@router.get("/distribution")
def distribution(
    dimension: str = Query("channel"),
    selected_value: str | None = Query(None)
):
    return get_dashboard3_distribution(dimension, selected_value)


@router.get("/interaction-analysis")
def interaction_analysis(
    dim1: str = Query(...),
    dim2: str = Query(...),
    metric: str = Query("content_volume"),
):
    return get_interaction_analysis(dim1, dim2, metric)