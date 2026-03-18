from pydantic import BaseModel
from typing import List, Dict, Any


class KPIResponse(BaseModel):
    publish_rate: float
    avg_publish_declaration: float
    avg_creation_declaration: float
    efficiency_rate: float


class DistributionItem(BaseModel):
    name: str
    uploaded: float
    created: float
    published: float


class DistributionResponse(BaseModel):
    dimension: str
    items: List[DistributionItem]


class TrendPoint(BaseModel):
    month: str
    input: float
    output: float
    published: float


class TrendResponse(BaseModel):
    data: List[TrendPoint]


class DashboardResponse(BaseModel):
    kpis: KPIResponse
    input_distribution: DistributionResponse
    output_distribution: DistributionResponse
    trend_analysis: TrendResponse
    applied_filters: Dict[str, Any]