import pandas as pd


def load_video_details():
    return pd.read_csv("data/video_list_data_obfuscated.csv")


def load_monthly_chart():
    return pd.read_csv("data/monthly-chart.csv")


def load_clients():
    return pd.read_csv("data/CLIENT 1 combined_data(2025-3-1-2026-2-28).csv")


def load_channel_publish():
    return pd.read_csv("data\channel-wise-publishing.csv")