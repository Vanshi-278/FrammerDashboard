from fastapi import APIRouter
from services.dashboard_service import (
    get_kpis,
    monthly_trend,
    monthly_duration_trend,
    platform_distribution,
    channel_contribution,
    alerts,
    get_video_details,
    get_filter_options,
    get_data_quality
)

router = APIRouter(prefix="/dashboard")


@router.get("/kpi")
def kpi():
    return get_kpis()


@router.get("/monthly-trend")
def trend():
    return monthly_trend()


@router.get("/monthly-duration-trend")
def duration_trend():
    return monthly_duration_trend()



@router.get("/platforms")
def platforms():
    return platform_distribution()


@router.get("/channels")
def channels(platform: str):
    return channel_contribution(platform)


@router.get("/alerts")
def get_alerts():
    return alerts()

@router.get("/video-details")
def video_details(
    search: str = None,
    published: str = None,
    team_name: str = None,
    type: str = None,
    uploaded_by: str = None,
    published_platform: str = None,
    limit: int = 50,
    offset: int = 0
):
    return get_video_details(
        search=search,
        published=published,
        team_name=team_name,
        type_filter=type,
        uploaded_by=uploaded_by,
        published_platform=published_platform,
        limit=limit,
        offset=offset
    )

@router.get("/filter-options")
def filter_options():
    return get_filter_options()


@router.get("/data-quality")
def data_quality():
    return get_data_quality()

