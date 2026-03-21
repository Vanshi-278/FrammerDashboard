import pandas as pd
from services.loader import (
    load_video_details,
    load_monthly_chart,
    load_clients,
    load_channel_publish,
    load_channel_duration,
    load_monthly_duration,
    load_users
)

from services.dashboard3_service import(
    get_platform_distribution, 
    get_distribution
)

from services.dashboard4_services import(
    get_output_distribution,
    get_input_type_data,
)

import datetime
import math

video_df = load_video_details()
monthly_df = load_monthly_chart()
client_df = load_clients()
channel_df = load_channel_publish()
duration_df = load_monthly_duration()
users_df = load_users()
channel_duration_df = load_channel_duration()

def compute_duration_kpis(df):

    def time_to_seconds(t):
        h, m, s = map(int, t.split(":"))
        return h*3600 + m*60 + s

    df["uploaded_sec"] = df["Total Uploaded Duration"].apply(time_to_seconds)
    df["created_sec"] = df["Total Created Duration"].apply(time_to_seconds)
    df["published_sec"] = df["Total Published Duration"].apply(time_to_seconds)

    avg_uploaded = df["uploaded_sec"].mean()
    avg_created = df["created_sec"].mean()
    avg_published = df["published_sec"].mean()

    total_processing = df["created_sec"].sum()

    compression_ratio = df["published_sec"].sum() / df["uploaded_sec"].sum()
    shortening_percent = (1 - compression_ratio) * 100

    def sec_to_hms(s):
        import datetime
        return str(datetime.timedelta(seconds=int(s)))

    return {
        "avg_uploaded_duration": sec_to_hms(avg_uploaded),
        "avg_created_duration": sec_to_hms(avg_created),
        "avg_published_duration": sec_to_hms(avg_published),
        "total_processing_time": sec_to_hms(total_processing),
        "video_shortening_percent": round(shortening_percent,5),
    }



def avg_publish_for_hour_videos(df):

    df["uploaded_sec"] = pd.to_timedelta(df["Uploaded Duration (hh:mm:ss)"]).dt.total_seconds()
    df["published_sec"] = pd.to_timedelta(df["Published Duration (hh:mm:ss)"]).dt.total_seconds()

    mean = df["uploaded_sec"].mean()
    std = df["uploaded_sec"].std()
    n = len(df)

    margin = 1.96 * (std / math.sqrt(n))

    lower = mean - margin
    upper = mean + margin

    filtered = df[
        (df["uploaded_sec"] >= lower) &
        (df["uploaded_sec"] <= upper)
    ]

    avg_pub_sec = filtered["published_sec"].mean()
    avg_up_sec = filtered["uploaded_sec"].mean()

    avg_pub_time = str(datetime.timedelta(seconds=int(avg_pub_sec)))
    compression_ratio = avg_pub_sec/avg_up_sec *100

    return { "avg_pub_time":avg_pub_time, 
              "compression_ratio": round(compression_ratio, 3)}

def get_kpis():
     
    uploaded = monthly_df['Total Uploaded'].sum()

    published = monthly_df["Total Published"].sum()

    processed = monthly_df['Total Created'].sum()  # assuming created = processed

    publish_rate = round((published / uploaded) * 100, 3) if processed else 0

    duration_metrics = compute_duration_kpis(duration_df)
    
    one_hour_metrics = avg_publish_for_hour_videos(users_df)

    return {
        "uploaded": int(uploaded),
        "processed": int(processed),
        "published": int(published),
        "publish_rate": publish_rate,
        "video_shortening_percent": int(duration_metrics['video_shortening_percent']),
        "avg_published_duration(for 1 hour)": str(one_hour_metrics["avg_pub_time"]),
        "compression percent(for one hour)": one_hour_metrics["compression_ratio"]
    }


def monthly_trend():

    df = monthly_df.copy()
    df["Month"] = pd.to_datetime(df["Month"], format="%b, %Y", errors="coerce")
    df = df.sort_values("Month")

    result = []
    for _, row in df.iterrows():

        result.append({
            "Month": row["Month"].strftime("%b, %Y") if not pd.isna(row["Month"]) else "",
            "Total Uploaded": int(row["Total Uploaded"]),
            "Total Created": int(row["Total Created"]),
            "Total Published": int(row["Total Published"])
        })

    return result

def duration_to_hours(duration_str):
    if duration_str is None:
        return 0

    duration_str = str(duration_str).strip()

    if duration_str == "" or duration_str.lower() == "nan":
        return 0

    try:
        h, m, s = map(int, duration_str.split(":"))
        hours = h + m/60 + s/3600
        return round(hours, 2)
    except:
        return 0


def monthly_duration_trend():

    df = duration_df.copy()
    df["Month"] = pd.to_datetime(df["Month"], format="%b, %Y", errors="coerce")
    df = df.sort_values("Month")

    result = []

    for _, row in df.iterrows():

        uploaded = duration_to_hours(row["Total Uploaded Duration"])
        created = duration_to_hours(row["Total Created Duration"])
        published = duration_to_hours(row["Total Published Duration"])

        compression_rate = 0
        trimming_rate = 0

        if uploaded > 0:
            compression_rate = round((published / uploaded) * 100, 2)
            trimming_rate = round(((uploaded - published) / uploaded) * 100, 2)

        result.append({

            "Month": row["Month"].strftime("%b, %Y") if not pd.isna(row["Month"]) else "",

            "Total Uploaded Duration": uploaded,
            "Total Created Duration": created,
            "Total Published Duration": published,

            "Compression Rate": compression_rate,
            "Trimming Rate": trimming_rate

        })

    return result

def platform_distribution():

    platform_cols = [
        "Facebook",
        "Instagram",
        "Linkedin",
        "Reels",
        "Shorts",
        "X",
        "Youtube",
        "Threads"
    ]

    totals = {}

    for col in platform_cols:
        totals[col] = channel_df[col].sum()

    result = []

    for k, v in totals.items():

        result.append({
            "platform": k,
            "value": int(v)
        })

    return result

def duration_to_minutes(duration_str):

    if duration_str is None:
        return 0

    duration_str = str(duration_str).strip()

    if duration_str == "" or duration_str.lower() == "nan":
        return 0

    try:
        h, m, s = map(int, duration_str.split(":"))
        return h*60 + m + s/60
    except:
        return 0

def channel_contribution(platform):

    platform_map = {
        "Facebook": "Facebook",
        "Instagram": "Instagram",
        "Linkedin": "Linkedin",
        "Reels": "Reels",
        "Shorts": "Shorts",
        "X": "X",
        "Youtube": "Youtube",
        "Threads": "Threads"
    }

    duration_map = {
        "Facebook": "Facebook Duration",
        "Instagram": "Instagram Duration",
        "Linkedin": "Linkedin Duration",
        "Reels": "Reels Duration",
        "Shorts": "Shorts Duration",
        "X": "X Duration",
        "Youtube": "Youtube Duration",
        "Threads": "Threads Duration"
    }

    col = platform_map.get(platform)
    dur_col = duration_map.get(platform)

    if not col:
        return {}

    channel_result = []

    for _, row in channel_df.iterrows():

        channel = row["Channels"]

        videos = int(row[col]) if pd.notna(row[col]) else 0
        dur_row = channel_duration_df[
            channel_duration_df["Channels"] == channel
        ]

        if not dur_row.empty:
            duration = duration_to_minutes(dur_row.iloc[0][dur_col])
        else:
            duration = 0

        efficiency = round(duration / videos, 2) if videos else 0

        channel_result.append({
            "channel": channel,
            "videos": videos,
            "duration": round(duration,2),
            "efficiency": efficiency
        })

    # Content types from video dataset
    type_df = video_df[video_df["Published Platform"].str.strip().str.lower() == platform.lower()]

    type_counts = (
        type_df["Type"]
        .value_counts()
        .reset_index()
    )

    type_counts.columns = ["type","value"]

    type_result = type_counts.to_dict("records")

    # Top users
    user_counts = (
        type_df["Uploaded By"]
        .value_counts()
        .reset_index()
    )

    user_counts.columns = ["user","value"]

    user_result = user_counts.head(10).to_dict("records")

    return {
        "channels": channel_result,
        "types": type_result,
        "users": user_result
    }
def alerts():

    alerts_list = []

    kpis = get_kpis()

    # ================== GLOBAL ALERT ==================
    if kpis["publish_rate"] < 60:
        alerts_list.append({
            "type": "critical",
            "message": f"Overall publish rate is low ({kpis['publish_rate']}%)"
        })

    # ================== OUTPUT TYPE ALERT ==================
    output_data = get_output_distribution()

    for item in output_data:
        created = item.get("created_count", 0)
        published = item.get("published_count", 0)

        if created > 0:
            rate = (published / created) * 100

            if rate < 40:
                alerts_list.append({
                    "type": "warning",
                    "message": f"{item['output_type']} has low publish rate ({round(rate,2)}%)"
                })

    # ================== INPUT TYPE ALERT ==================
    input_data = get_input_type_data()

    for item in input_data:
        created = item.get("created_count", 0)
        published = item.get("published_count", 0)

        if created > 0:
            rate = (published / created) * 100

            if rate < 40:
                alerts_list.append({
                    "type": "warning",
                    "message": f"{item['input_type']} content underperforming ({round(rate,2)}% publish rate)"
                })

    # ================== PLATFORM ALERT ==================
    platforms = platform_distribution()

    total = sum([p["value"] for p in platforms]) or 1

    for p in platforms:
        share = (p["value"] / total) * 100

        if share < 5:
            alerts_list.append({
                "type": "info",
                "message": f"{p['platform']} is underutilized ({round(share,2)}% share)"
            })

    # ================== LANGUAGE ALERT ==================
    language_data = get_distribution("language")

    total_lang = sum([l["value"] for l in language_data]) or 1

    for l in language_data:
        share = (l["value"] / total_lang) * 100

        if share < 5:
            alerts_list.append({
                "type": "info",
                "message": f"{l['label']} language usage is low ({round(share,2)}%)"
            })

    # ================== TOP DROP-OFF ALERT ==================
    worst_output = None
    worst_rate = 100

    for item in output_data:
        created = item.get("created_count", 0)
        published = item.get("published_count", 0)

        if created > 0:
            rate = (published / created) * 100

            if rate < worst_rate:
                worst_rate = rate
                worst_output = item["output_type"]

    if worst_output:
        alerts_list.append({
            "type": "critical",
            "message": f"Worst performing output: {worst_output} ({round(worst_rate,2)}% publish rate)"
        })

    # ================== SORT BY PRIORITY ==================
    priority = {"critical": 1, "warning": 2, "info": 3}
    alerts_list = sorted(alerts_list, key=lambda x: priority[x["type"]])

    return alerts_list

def get_video_details(search=None, published=None, team_name=None, type_filter=None, uploaded_by=None, published_platform=None, limit=50, offset=0):
    df = video_df.copy()
    
    # Apply filters
    if search:
        df = df[df['Headline'].str.contains(search, case=False, na=False) | 
                df['Video ID'].astype(str).str.contains(search, na=False)]
    
    if published is not None and published != '':
        # Handle both string and boolean values
        target_value = 'yes' if isinstance(published, bool) and published else 'no' if isinstance(published, bool) else published
        df = df[df['Published'].str.lower() == target_value.lower()]
    
    if team_name:
        df = df[df['Team Name'].str.contains(team_name, case=False, na=False)]
    
    if type_filter:
        df = df[df['Type'].str.contains(type_filter, case=False, na=False)]
    
    if uploaded_by:
        df = df[df['Uploaded By'].str.contains(uploaded_by, case=False, na=False)]
    
    if published_platform:
        df = df[df['Published Platform'].str.contains(published_platform, case=False, na=False)]
    
    # Pagination
    total = len(df)
    df = df.iloc[offset:offset + limit]
    
    # Replace NaN with None for JSON serialization
    df = df.fillna('')
    
    # Convert to list of dicts
    result = df.to_dict('records')
    
    return {
        "data": result,
        "total": total,
        "limit": limit,
        "offset": offset
    }

def _missing_stats(series: pd.Series):
    """Return count and percentage of missing/blank values in a series."""
    total = len(series)
    if total == 0:
        return {"missing": 0, "missing_pct": 0.0, "complete_pct": 100.0}

    # Treat NaN and empty/whitespace-only strings as missing
    missing_mask = series.isna() | series.astype(str).str.strip().eq("")
    missing = int(missing_mask.sum())
    missing_pct = round((missing / total) * 100, 2)
    complete_pct = round(100.0 - missing_pct, 2)

    return {"missing": missing, "missing_pct": missing_pct, "complete_pct": complete_pct}


def get_data_quality():
    """Return data quality stats for key fields in the video details dataset."""
    total = len(video_df)

    fields = [
        "Published",
        "Uploaded By",
        "Published Platform",
        "Source",
        "Headline",
        "Video ID",
    ]

    field_stats = []
    for field in fields:
        if field in video_df.columns:
            stats = _missing_stats(video_df[field])
            field_stats.append({
                "field": field,
                "total": total,
                **stats,
            })

    return {
        "total_records": total,
        "fields": field_stats,
    }


def get_filter_options():
    """Return distinct values for all filter fields"""
    team_names = sorted(video_df['Team Name'].dropna().unique().tolist())
    types = sorted(video_df['Type'].dropna().unique().tolist())
    uploaded_by = sorted(video_df['Uploaded By'].dropna().unique().tolist())
    published_platforms = sorted(video_df['Published Platform'].dropna().unique().tolist())
    published_platforms = [p for p in published_platforms if p]  # Remove empty strings
    
    return {
        "team_names": team_names,
        "types": types,
        "uploaded_by": uploaded_by,
        "published_platforms": published_platforms
    }