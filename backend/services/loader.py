from pathlib import Path
import pandas as pd
import os

# Get the path to the data directory relative to this file
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"


def _read_csv(filename: str) -> pd.DataFrame:
    file_path = DATA_DIR / filename
    df = pd.read_csv(file_path)
    df.columns = df.columns.str.strip()
    return df


def load_video_details():

    return _read_csv("video_list_data_obfuscated.csv")


def load_video_details_copy():
    return _read_csv("video_list_data_obfuscated copy.csv")


def load_monthly_chart():
    return _read_csv("monthly-chart.csv")


def load_monthly_duration():
    return _read_csv("month-wise-duration.csv")


def load_clients():
    return _read_csv("CLIENT 1 combined_data(2025-3-1-2026-2-28).csv")


def load_channel_duration():
    return _read_csv("channel-wise-publishing duration.csv")


def load_channel_publish():
    return _read_csv("channel-wise-publishing.csv")


def load_channel_publish_copy():
    return _read_csv("channel-wise-publishing copy.csv")


def load_users():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by user.csv")


def load_channel_user():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by channel and user.csv")


def load_channel_user_copy():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by channel and user copy.csv")


def load_input():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by input type.csv")


def load_output():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by output type.csv")


def load_language():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by language.csv")

    path = os.path.join(DATA_DIR, "video_list_data_obfuscated copy.csv")
    return pd.read_csv(path)


def load_monthly_chart():
    path = os.path.join(DATA_DIR, "monthly-chart.csv")
    return pd.read_csv(path)


def load_clients():
    path = os.path.join(DATA_DIR, "CLIENT 1 combined_data(2025-3-1-2026-2-28).csv")
    return pd.read_csv(path)


def load_channel_duration():
    path = os.path.join(DATA_DIR, "channel-wise-publishing duration.csv")
    return pd.read_csv(path)


def load_channel_publish():
    path = os.path.join(DATA_DIR, "channel-wise-publishing.csv")
    return pd.read_csv(path)

def load_monthly_duration():
    path = os.path.join(DATA_DIR, "month-wise-duration.csv")
    return pd.read_csv(path)

def load_users():
    path = os.path.join(DATA_DIR, "combined_data(2025-3-1-2026-2-28) by channel and user.csv")
    return pd.read_csv(path)

