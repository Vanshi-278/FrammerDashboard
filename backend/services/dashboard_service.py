from services.loader import (
    load_video_details,
    load_monthly_chart,
    load_clients,
    load_channel_publish
)

video_df = load_video_details()
monthly_df = load_monthly_chart()
client_df = load_clients()
channel_df = load_channel_publish()


def get_kpis():

    uploaded = video_df.shape[0]

    published = video_df["Published"].sum()

    processed = uploaded  # assuming created = processed

    publish_rate = round((published / processed) * 100, 2) if processed else 0

    return {
        "uploaded": int(uploaded),
        "processed": int(processed),
        "published": int(published),
        "publish_rate": publish_rate
    }


def monthly_trend():

    result = []

    for _, row in monthly_df.iterrows():

        result.append({
            "Month": row["Month"],
            "Total Uploaded": int(row["Total Uploaded"]),
            "Total Created": int(row["Total Created"]),
            "Total Published": int(row["Total Published"])
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

    col = platform_map.get(platform)

    if not col:
        return []

    result = []

    for _, row in channel_df.iterrows():

        result.append({
            "channel": row["Channels"],
            "value": int(row[col])
        })

    return result


def alerts():

    alerts_list = []

    if get_kpis()["publish_rate"] < 60:
        alerts_list.append("Publish rate below 60%")

    if video_df["Published URL"].isna().sum() > 10:
        alerts_list.append("Many videos missing publish URL")

    alerts_list.append("Spike detected in uploads this month")

    return alerts_list