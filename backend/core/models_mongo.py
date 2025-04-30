from mongoengine import Document, StringField, EmailField

class User(Document):
    meta = {"collection": "users"}
    name  = StringField(required=True, max_length=100)
    email = EmailField(required=True, unique=True)

# core/models_mongo.py

from datetime import datetime
from mongoengine import (
    Document, EmbeddedDocument,
    StringField, EmailField,
    FloatField, IntField, BooleanField,
    EmbeddedDocumentField, ObjectIdField, DateTimeField
)

class Features(EmbeddedDocument):
    Income            = FloatField(required=True)
    Rating            = FloatField(required=True)
    Cards             = IntField(required=True)
    Age               = IntField(required=True)
    Education         = IntField(required=True)     # numeric codes in your CSV
    Gender            = StringField(required=True)  # Male/Female
    Student           = BooleanField(required=True)
    Married           = BooleanField(required=True)
    Ethnicity         = StringField(required=True)
    Balance           = FloatField(required=True)

class Prediction(Document):
    meta               = {"collection": "predictions"}
    userId             = ObjectIdField(required=True)
    features           = EmbeddedDocumentField(Features, required=True)
    limitPrediction    = FloatField()    # your ML output
    approvalPrediction = BooleanField()  # your ML output
    createdAt          = DateTimeField(default=datetime.utcnow)
