#!/usr/bin/env python
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# ─── Load Environment Variables ────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# ─── Get MongoDB Configuration ────────────────────────────────────────────────
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

if not MONGODB_URI or not DB_NAME:
    print("ERROR: MONGODB_URI and DB_NAME must be set in .env")
    sys.exit(1)

# ─── MongoDB Connection Setup ──────────────────────────────────────────────────
from mongoengine import connect, disconnect
import certifi

print(f"DEBUG: Connecting to {MONGODB_URI.replace(os.getenv('MONGO_DB_PASS'), '*****')}")

try:
    disconnect(alias="default")
except Exception as e:
    pass  # Ignore if no connection exists

connect(
    db=DB_NAME,
    host=MONGODB_URI,
    alias="default",
    tls=True,
    tlsCAFile=certifi.where(),
    retryWrites=True,
    w="majority",
    authentication_source="admin"
)

# ─── Database Operations ───────────────────────────────────────────────────────
from core.models_mongo import User, Features, Prediction

EMAIL = "sample@admin.com"
NAME = "Sample User"

try:
    user = User.objects.get(email=EMAIL)
    print(f"Existing user found: {user.id}")
except User.DoesNotExist:
    user = User(email=EMAIL, name=NAME).save()
    print(f"New user created: {user.id}")

# ─── Create Sample Prediction ──────────────────────────────────────────────────
feat = Features(
    Income=55.882,
    Rating=357,
    Cards=2,
    Age=68,
    Education=16,
    Gender="Male",
    Student=False,
    Married=True,
    Ethnicity="Caucasian",
    Balance=331,
)

pred = Prediction(
    userId=user.id,
    features=feat,
    limitPrediction=4897,
    approvalPrediction=True,
    createdAt=datetime.utcnow(),
).save()

print(f"Successfully seeded prediction: {pred.id}")