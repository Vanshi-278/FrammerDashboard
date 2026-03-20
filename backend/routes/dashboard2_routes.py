from fastapi import APIRouter
from services import dashboard2_service

router2 = APIRouter(prefix="/usage", tags=["Usage Dashboard"])


# -------------------------------
# Usage Trend
# -------------------------------
@router2.get("/trend")
def usage_trend(period: str = "month"):
    return dashboard2_service.usage_trend(period)


# -------------------------------
# Contributions (Top / Underused)
# -------------------------------
@router2.get("/contributions")
def contributions(
    level: str = "client",
    parent: str | None = None,
    metric: str = "published",
    type: str = "top",
    period: str = "month"   # 🔥 ADDED
):
    return dashboard2_service.get_contributions(
        level=level,
        parent=parent,
        metric=metric,
        type=type,
        period=period   # 🔥 PASSING
    )


# -------------------------------
# Underused (Wrapper)
# -------------------------------
@router2.get("/underused")
def underused(
    level: str = "client",
    parent: str | None = None,
    metric: str = "efficiency",
    period: str = "month"   # 🔥 ADDED
):
    return dashboard2_service.get_contributions(
        level=level,
        parent=parent,
        metric=metric,
        type="underused",
        period=period   # 🔥 PASSING
    )


# -------------------------------
# Duration Trend
# -------------------------------
@router2.get("/duration-trend")
def duration_trend(period: str = "month"):
    return dashboard2_service.duration_trend(period)


# -------------------------------
# Platform Distribution
# -------------------------------
@router2.get("/platform-distribution")
def platform_distribution():
    return dashboard2_service.platform_distribution()


# -------------------------------
# Channel vs Platform
# -------------------------------
@router2.get("/channel-platform")
def channel_platform():
    return dashboard2_service.channel_platform_matrix()