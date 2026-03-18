from pathlib import Path
import pandas as pd

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


<<<<<<< HEAD
def load_input():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by input type.csv")


def load_output():
=======
def load_input_type():
    return _read_csv("combined_data(2025-3-1-2026-2-28) by input type.csv")


def load_output_type():
>>>>>>> e24dbbd (added navbar and dashboard 3)
    return _read_csv("combined_data(2025-3-1-2026-2-28) by output type.csv")


def load_language():
<<<<<<< HEAD
    return _read_csv("combined_data(2025-3-1-2026-2-28) by language.csv")
=======
    return _read_csv("combined_data(2025-3-1-2026-2-28) by language.csv")
>>>>>>> e24dbbd (added navbar and dashboard 3)
