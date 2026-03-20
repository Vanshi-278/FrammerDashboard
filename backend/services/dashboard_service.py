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
            "Total Created   Duration": created,
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

    if get_kpis()["publish_rate"] < 60:
        alerts_list.append("Publish rate below 60%")

    alerts_list.append("Spike detected in uploads this month")

    return alerts_list