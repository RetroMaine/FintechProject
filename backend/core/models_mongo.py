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
    EmbeddedDocumentField, ObjectIdField, DateTimeField, ListField
)

class UserProfile(Document):
    meta = {"collection": "user_profiles"}
    email = StringField(required=True, unique=True)
    password = StringField(required=True)  # Note: In production, this should be properly hashed
    dependent_count = IntField(default=0)
    education_level = StringField()
    income_category = StringField()
    marital_status = StringField()
    created_at = DateTimeField(required=True)
    updated_at = DateTimeField()

    meta = {
        'collection': 'user_profiles',
        'indexes': ['email']
    }

class Features(EmbeddedDocument):
    Income = FloatField(required=True)
    Rating = FloatField(required=True)
    Cards = IntField(required=True)
    Age = IntField(required=True)
    Balance = FloatField(required=True)
    Education = IntField(required=True)
    Student = BooleanField(required=True)
    Married = BooleanField(required=True)
    Ethnicity = StringField(required=True)

class Prediction(Document):
    meta = {"collection": "predictions"}
    userId = StringField(required=True)
    features = EmbeddedDocumentField(Features, required=True)
    creditLimit = FloatField(required=True)
    approvalProbability = FloatField(required=True)
    createdAt = DateTimeField(required=True)

    meta = {
        'collection': 'predictions',
        'indexes': ['userId', 'createdAt']
    }
