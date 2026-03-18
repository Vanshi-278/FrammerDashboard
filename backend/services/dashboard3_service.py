from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def load_csv(filename: str) -> pd.DataFrame:
    df = pd.read_csv(DATA_DIR / filename)
    df.columns = df.columns.str.strip()
    return df


def hhmmss_to_minutes(value) -> float:
    if pd.isna(value) or value in ("", None):
        return 0.0

    parts = str(value).strip().split(":")
    if len(parts) != 3:
        return 0.0

    h, m, s = map(int, parts)
    return h * 60 + m + s / 60


def safe_div(a: float, b: float) -> float:
    return round(a / b, 2) if b else 0.0


def pct(a: float, b: float) -> float:
    return round((a / b) * 100, 2) if b else 0.0


def safe_pct(a: float, b: float) -> float:
    return round((a / b) * 100, 2) if b else 0.0


# =========================================================
# DISTRIBUTION + KPI SECTION
# =========================================================

def normalize_dimension_name(dimension: str) -> str:
    mapping = {
        "input_type": "Input Type",
        "output_type": "Output Type",
        "channel": "Channel",
        "platform": "Published Platform",
        "language": "Language",
        "user": "User",
    }
    return mapping.get(dimension, dimension)


def get_distribution_source(dimension: str) -> str:
    mapping = {
        "input_type": "combined_data(2025-3-1-2026-2-28) by input type.csv",
        "output_type": "combined_data(2025-3-1-2026-2-28) by output type.csv",
        "channel": "CLIENT 1 combined_data(2025-3-1-2026-2-28).csv",
        "language": "combined_data(2025-3-1-2026-2-28) by language.csv",
        "user": "combined_data(2025-3-1-2026-2-28) by user.csv",
    }
    return mapping.get(dimension, "")


def get_video_list_df() -> pd.DataFrame:
    df = load_csv("video_list_data_obfuscated.csv")
    df.columns = df.columns.str.strip()

    if "Published" in df.columns:
        df["Published"] = df["Published"].astype(str).str.strip().str.lower()

    return df


def get_platform_distribution():
    df = get_video_list_df()

    platform_col = "Published Platform"
    if platform_col not in df.columns:
        return []

    pub_df = df[df["Published"] == "yes"].copy()
    if pub_df.empty:
        return []

    grouped = (
        pub_df.groupby(platform_col)
        .size()
        .reset_index(name="value")
        .rename(columns={platform_col: "label"})
    )

    grouped["label"] = grouped["label"].fillna("Unknown")
    grouped = grouped.sort_values("value", ascending=False)

    total = grouped["value"].sum()

    items = []
    for _, row in grouped.iterrows():
        items.append(
            {
                "label": str(row["label"]),
                "value": int(row["value"]),
                "share": pct(row["value"], total),
            }
        )

    return items


def get_csv_distribution(dimension: str):
    file_name = get_distribution_source(dimension)
    if not file_name:
        return []

    df = load_csv(file_name)
    df.columns = df.columns.str.strip()

    label_col = normalize_dimension_name(dimension)
    if label_col not in df.columns:
        if dimension == "channel" and "Channel" in df.columns:
            label_col = "Channel"
        else:
            return []

    # important change:
    # output_type should use Created Count, not Uploaded Count
    if dimension == "output_type":
        value_col = "Created Count"
    else:
        value_col = "Uploaded Count"

    if value_col not in df.columns:
        return []

    grouped = (
        df[[label_col, value_col]]
        .copy()
        .rename(columns={label_col: "label", value_col: "value"})
    )

    grouped["label"] = grouped["label"].fillna("Unknown").astype(str)
    grouped["value"] = pd.to_numeric(grouped["value"], errors="coerce").fillna(0)
    grouped = grouped.sort_values("value", ascending=False)

    total = grouped["value"].sum()

    items = []
    for _, row in grouped.iterrows():
        items.append(
            {
                "label": row["label"],
                "value": int(row["value"]),
                "share": pct(row["value"], total),
            }
        )

    return items


def get_distribution(dimension: str):
    if dimension == "platform":
        return get_platform_distribution()
    return get_csv_distribution(dimension)


def get_overall_kpis():
    df = load_csv("CLIENT 1 combined_data(2025-3-1-2026-2-28).csv")

    uploaded = pd.to_numeric(df["Uploaded Count"], errors="coerce").fillna(0).sum()
    created = pd.to_numeric(df["Created Count"], errors="coerce").fillna(0).sum()
    published = pd.to_numeric(df["Published Count"], errors="coerce").fillna(0).sum()

    created_minutes = df["Created Duration (hh:mm:ss)"].apply(hhmmss_to_minutes).sum()
    published_minutes = df["Published Duration (hh:mm:ss)"].apply(hhmmss_to_minutes).sum()

    return {
        "publishRate": pct(published, created),
        "avgPublishingDeclaration": safe_div(published_minutes, published),
        "avgCreationDeclaration": safe_div(created_minutes, created),
        "uploadedCount": int(uploaded),
        "createdCount": int(created),
        "publishedCount": int(published),
        "selection": None,
    }


def get_platform_kpis(platform_name: str):
    df = get_video_list_df()

    platform_col = "Published Platform"
    if platform_col not in df.columns:
        return get_overall_kpis()

    filtered = df[df[platform_col].astype(str) == str(platform_name)].copy()
    if filtered.empty:
        return get_overall_kpis()

    published_count = len(filtered[filtered["Published"] == "yes"])
    uploaded_count = len(filtered)
    created_count = published_count

    return {
        "publishRate": pct(published_count, uploaded_count),
        "avgPublishingDeclaration": 0,
        "avgCreationDeclaration": 0,
        "uploadedCount": int(uploaded_count),
        "createdCount": int(created_count),
        "publishedCount": int(published_count),
        "selection": {
            "dimension": "platform",
            "value": platform_name,
        },
    }


def get_kpis_by_dimension_item(dimension: str, selected_value: str):
    if dimension == "platform":
        return get_platform_kpis(selected_value)

    file_name = get_distribution_source(dimension)
    if not file_name:
        return get_overall_kpis()

    df = load_csv(file_name)
    df.columns = df.columns.str.strip()

    label_col = normalize_dimension_name(dimension)
    if label_col not in df.columns:
        return get_overall_kpis()

    filtered = df[df[label_col].astype(str) == str(selected_value)].copy()
    if filtered.empty:
        return get_overall_kpis()

    uploaded = pd.to_numeric(filtered["Uploaded Count"], errors="coerce").fillna(0).sum()
    created = pd.to_numeric(filtered["Created Count"], errors="coerce").fillna(0).sum()
    published = pd.to_numeric(filtered["Published Count"], errors="coerce").fillna(0).sum()

    created_minutes = filtered["Created Duration (hh:mm:ss)"].apply(hhmmss_to_minutes).sum()
    published_minutes = filtered["Published Duration (hh:mm:ss)"].apply(hhmmss_to_minutes).sum()

    return {
        "publishRate": pct(published, created),
        "avgPublishingDeclaration": safe_div(published_minutes, published),
        "avgCreationDeclaration": safe_div(created_minutes, created),
        "uploadedCount": int(uploaded),
        "createdCount": int(created),
        "publishedCount": int(published),
        "selection": {
            "dimension": dimension,
            "value": selected_value,
        },
    }


def get_dashboard3_distribution(dimension: str, selected_value: str | None = None):
    distribution = get_distribution(dimension)

    if selected_value:
        kpis = get_kpis_by_dimension_item(dimension, selected_value)
    else:
        kpis = get_overall_kpis()

    return {
        "dimension": dimension,
        "distribution": distribution,
        "kpis": kpis,
    }


# =========================================================
# 2D INTERACTION SECTION
# =========================================================

def get_channel_user_interaction(metric: str = "content_volume"):
    df = load_csv("combined_data(2025-3-1-2026-2-28) by channel and user.csv")

    df["Uploaded Count"] = pd.to_numeric(df.get("Uploaded Count", 0), errors="coerce").fillna(0)
    df["Created Count"] = pd.to_numeric(df.get("Created Count", 0), errors="coerce").fillna(0)
    df["Published Count"] = pd.to_numeric(df.get("Published Count", 0), errors="coerce").fillna(0)

    row_col = "Channel"
    col_col = "User"

    if row_col not in df.columns or col_col not in df.columns:
        return {
            "dim1": "channel",
            "dim2": "user",
            "metric": metric,
            "rows": [],
            "cols": [],
            "matrix": [],
            "message": f"Required columns not found in channel-user file. Found: {df.columns.tolist()}",
        }

    rows = sorted(df[row_col].dropna().astype(str).unique().tolist())
    cols = sorted(df[col_col].dropna().astype(str).unique().tolist())

    matrix = []

    for row_value in rows:
        row_df = df[df[row_col].astype(str) == row_value]
        row_entry = {"rowLabel": row_value}

        for col_value in cols:
            cell = row_df[row_df[col_col].astype(str) == col_value]

            uploaded = cell["Uploaded Count"].sum()
            created = cell["Created Count"].sum()
            published = cell["Published Count"].sum()

            if metric == "publish_rate":
                value = safe_pct(published, created)
            else:
                value = int(uploaded)

            row_entry[col_value] = round(value, 2) if metric == "publish_rate" else int(value)

        matrix.append(row_entry)

    return {
        "dim1": "channel",
        "dim2": "user",
        "metric": metric,
        "rows": rows,
        "cols": cols,
        "matrix": matrix,
    }


def get_channel_platform_interaction(metric: str = "content_volume"):
    df = load_csv("channel-wise-publishing.csv")
    df.columns = df.columns.str.strip()

    print("channel-wise-publishing columns:", df.columns.tolist())

    possible_row_cols = [
        "Channel",
        "channel",
        "Channel Name",
        "channel name",
        "Content Channel",
    ]

    row_col = next((col for col in possible_row_cols if col in df.columns), None)

    if row_col is None:
        for col in df.columns:
            sample = df[col].dropna().astype(str).head(5).tolist()
            if any(not s.replace(".", "", 1).isdigit() for s in sample):
                row_col = col
                break

    if row_col is None:
        return {
            "dim1": "channel",
            "dim2": "platform",
            "metric": metric,
            "rows": [],
            "cols": [],
            "matrix": [],
            "message": f"Could not detect channel column. Found columns: {df.columns.tolist()}",
        }

    platform_cols = [col for col in df.columns if col != row_col]

    for col in platform_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

    rows = df[row_col].fillna("Unknown").astype(str).tolist()
    cols = platform_cols

    matrix = []

    for _, r in df.iterrows():
        row_entry = {"rowLabel": str(r[row_col])}
        row_total = sum(float(r[col]) for col in platform_cols)

        for col in platform_cols:
            value = float(r[col])

            if metric == "publish_rate":
                row_entry[col] = round((value / row_total) * 100, 2) if row_total else 0
            else:
                row_entry[col] = int(value)

        matrix.append(row_entry)

    return {
        "dim1": "channel",
        "dim2": "platform",
        "metric": metric,
        "rows": rows,
        "cols": cols,
        "matrix": matrix,
    }


def get_interaction_analysis(dim1: str, dim2: str, metric: str = "content_volume"):
    pair = (dim1.lower(), dim2.lower())

    if pair == ("channel", "user"):
        return get_channel_user_interaction(metric)

    if pair == ("channel", "platform"):
        return get_channel_platform_interaction(metric)

    return {
        "dim1": dim1,
        "dim2": dim2,
        "metric": metric,
        "rows": [],
        "cols": [],
        "matrix": [],
        "message": "This dimension pair is not available in the current source data.",
    }