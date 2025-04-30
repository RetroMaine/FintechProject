import os
import mongoengine
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# BASE_DIR = os.path.dirname(os.path.dirname(__file__))

MONGO_USER = os.getenv("MONGO_DB_USER")
MONGO_PASS = os.getenv("MONGO_DB_PASS")
DB_NAME    = os.getenv("DB_NAME")
MONGODB_URI = os.getenv("MONGODB_URI")

SECRET_KEY = "your-secret-key"
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "[::1]", "10.165.172.169"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "corsheaders",  # Add CORS headers
    "core",         # Your app
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # Add CORS middleware
    "django.middleware.common.CommonMiddleware",
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:19006",  # Expo development server
    "http://localhost:19000",
    "http://localhost:19001",
    "http://localhost:19002",
    "exp://10.165.172.169:8081",  # Expo tunnel
]

CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]

CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# Allow all origins in development
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True

ROOT_URLCONF = "banking_backend.urls"
WSGI_APPLICATION = "banking_backend.wsgi.application"

# ─── MongoDB Connection ──────────────────────────────────
# settings.py

# DATABASES = {
#     "default": {
#         "ENGINE": "djongo",
#         "NAME": DB_NAME,             # must match the one in your URI
#         "CLIENT": {
#             "host": MONGODB_URI,
#         },
#     }
# }


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}



# minimal static config
STATIC_URL = "/static/"

mongoengine.connect(
    db=os.getenv("DB_NAME"),
    host=os.getenv("MONGODB_URI"),
)
