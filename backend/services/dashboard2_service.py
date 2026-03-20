import pandas as pd
from datetime import datetime, timedelta

from services.loader import (
    load_video_details,
    load_monthly_chart,
    load_clients,
    load_channel_publish,
    load_channel_duration,
    load_monthly_duration,
    load_channel_user
)

# ---------------- LOAD DATA ---------------- #

video_df = load_video_details()
monthly_df = load_monthly_chart()
client_df = load_clients()
channel_df = load_channel_publish()
duration_df = load_monthly_duration()
users_df = load_channel_user()
channel_duration_df = load_channel_duration()
weekly_df = None

# ================= Limits ================= #

top_limit = 10
lower_limit = 10

# ================= HELPERS ================= #

def safe_div(a, b):
    return (a / b * 100) if b else 0


# 🔥 PERIOD FILTER (CORRECT WAY)
def apply_period_filter(df, period):

    df = df.copy()

    if "Published" not in df.columns:
        return df

    df["Published"] = pd.to_datetime(df["Published"], errors="coerce")
    df = df.dropna(subset=["Published"])

    now = datetime.now()

    if period == "day":
        return df[df["Published"] >= now - timedelta(days=1)]

    elif period == "week":
        return df[df["Published"] >= now - timedelta(days=7)]

    return df


# 🔥 METRIC LOGIC
def apply_metric(df, metric, type="top"):

    if metric == "uploaded":
        df["value"] = df["uploaded"]

    elif metric == "efficiency":
        if type == "underused":
            df["value"] = 100 - df["efficiency"]
        else:
            df["value"] = df["efficiency"]

    else:
        df["value"] = df["published"]

    return df


# ================= AGGREGATIONS ================= #

def aggregate_clients(metric, type, period):

    df = client_df.copy()

    if "Client" not in df.columns:
        df["Client"] = "Client1"

    df = apply_period_filter(df, period)

    df["uploaded"] = df["Uploaded Count"]
    df["published"] = df["Published Count"]

    grouped = df.groupby("Client").agg(
        uploaded=("uploaded","sum"),
        published=("published","sum")
    ).reset_index()

    grouped["efficiency"] = grouped.apply(
        lambda r: safe_div(r["published"], r["uploaded"]), axis=1
    )

    grouped = apply_metric(grouped, metric, type)
    grouped["name"] = grouped["Client"]

    return grouped


def aggregate_channels(metric, type, period):

    df = users_df.copy()
    df = apply_period_filter(df, period)

    grouped = df.groupby("Channel").agg(
        uploaded=("Uploaded Count","sum"),
        published=("Published Count","sum")
    ).reset_index()

    grouped["efficiency"] = grouped.apply(
        lambda r: safe_div(r["published"], r["uploaded"]), axis=1
    )

    grouped = apply_metric(grouped, metric, type)
    grouped["name"] = grouped["Channel"]

    return grouped


def aggregate_users(metric, type, period):

    df = users_df.copy()
    df = apply_period_filter(df, period)

    df["uploaded"] = df["Uploaded Count"]
    df["published"] = df["Published Count"]

    df["efficiency"] = df.apply(
        lambda r: safe_div(r["published"], r["uploaded"]), axis=1
    )

    df = apply_metric(df, metric, type)
    df["name"] = df["User"]

    return df


# ================= DRILL FUNCTIONS ================= #

def get_channels_by_client(client, metric, type, period):

    df = client_df.copy()

    if "Client" not in df.columns:
        df["Client"] = "Client1"

    df = apply_period_filter(df, period)

    df = df[df["Client"] == client]

    df["uploaded"] = df["Uploaded Count"]
    df["published"] = df["Published Count"]

    df["efficiency"] = df.apply(
        lambda r: safe_div(r["published"], r["uploaded"]), axis=1
    )

    df = apply_metric(df, metric, type)
    df["name"] = df["Channel"]

    return df


def get_users_by_channel(channel, metric, type, period):

    df = users_df.copy()

    df = apply_period_filter(df, period)

    df["Channel"] = df["Channel"].astype(str).str.strip().str.lower()
    channel = channel.strip().lower()

    df = df[df["Channel"] == channel]

    df["uploaded"] = df["Uploaded Count"]
    df["published"] = df["Published Count"]

    df["efficiency"] = df.apply(
        lambda r: safe_div(r["published"], r["uploaded"]), axis=1
    )

    df = apply_metric(df, metric, type)
    df["name"] = df["User"]

    return df


# ================= SORT ================= #

def process_data(df, order="desc", limit=top_limit, exclude_top=None):

    ascending = (order == "asc")

    df = df.sort_values("value", ascending=ascending)

    if exclude_top is not None:
        df = df[~df["name"].isin(exclude_top)]

    return df.head(limit)[["name","uploaded","published","efficiency","value"]] \
        .to_dict("records")


# ================= MAIN API ================= #

def get_contributions(
    level="client",
    parent=None,
    metric="published",
    type="top",
    period="month"
):

    order = "desc"  # both top & underused use desc

    # -------- MAIN -------- #

    if level == "client":
        df = aggregate_clients(metric, type, period).head(top_limit)

        if type == "underused" and len(df) <= 1:
            main = []
        else:
            main = process_data(df, order)

    elif level == "channel":
        df = aggregate_channels(metric, type, period)

        top_names = None
        if type == "underused":
            top_df = aggregate_channels(metric, "top", period)
            top_names = top_df.sort_values("value", ascending=False).head(top_limit)["name"]
            print(f"Total channels: {len(df)}, Top names to exclude: {len(top_names)}")
        main = process_data(df, order, exclude_top=top_names)

    elif level == "user":
        df = aggregate_users(metric, type, period)

        top_names = None
        if type == "underused":
            top_df = aggregate_users(metric, "top", period)
            top_names = top_df.sort_values("value", ascending=False).head(top_limit)["name"]

        main = process_data(df, order, exclude_top=top_names)

    else:
        main = []

    # -------- DRILL -------- #

    drill = []

    if level == "client" and parent:
        df = get_channels_by_client(parent, metric, type, period)
        drill = process_data(df, order)

    elif level == "channel" and parent:
        df = get_users_by_channel(parent, metric, type, period)
        drill = process_data(df, order)

    return {
        "main": main,
        "drill": drill
    }



def usage_trend(period="month"):

    df = monthly_df.copy()
    df["Month"] = pd.to_datetime(df["Month"])

    if period == "week":
        df = df[df["Month"] >= df["Month"].max() - pd.Timedelta(days=7)]
    elif period == "day":
        df = df[df["Month"] >= df["Month"].max() - pd.Timedelta(days=1)]

    return [
        {
            "period": row["Month"].strftime("%b %d"),
            "uploaded": int(row["Total Uploaded"]),
            "processed": int(row["Total Created"]),
            "published": int(row["Total Published"])
        }
        for _, row in df.sort_values("Month").iterrows()
    ]

def duration_to_hours(duration_str):
    try:
        h, m, s = map(int, str(duration_str).split(":"))
        return round(h + m/60 + s/3600, 2)
    except:
        return 0

def duration_trend(period="month"):

    df = duration_df.copy()
    df["Month"] = pd.to_datetime(df["Month"])

    if period == "week":
        df = df[df["Month"] >= df["Month"].max() - pd.Timedelta(days=7)]
    elif period == "day":
        df = df[df["Month"] >= df["Month"].max() - pd.Timedelta(days=1)]

    return [
        {
            "period": row["Month"].strftime("%b %d"),
            "uploaded_duration": duration_to_hours(row["Total Uploaded Duration"]),
            "processed_duration": duration_to_hours(row["Total Created Duration"]),
            "published_duration": duration_to_hours(row["Total Published Duration"])
        }
        for _, row in df.sort_values("Month").iterrows()
    ]

def top_users():
    df = users_df.sort_values("Published Count", ascending=False).head(top_limit)
    return [{"user": r["User"], "published": int(r["Published Count"])} for _, r in df.iterrows()]

def channel_usage():
    return [
        {
            "channel": r["Channel"],
            "uploaded": int(r["Uploaded Count"]),
            "created": int(r["Created Count"]),
            "published": int(r["Published Count"])
        }
        for _, r in client_df.iterrows()
    ]
