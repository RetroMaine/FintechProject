import joblib
import numpy as np
import pandas as pd

# Load all models and preprocessors
limit_model = joblib.load('backend/core/MLModel/credit_limit_model.pkl')
limit_preprocessor = joblib.load('backend/core/MLModel/limit_preprocessor.pkl')
approval_model = joblib.load('backend/core/MLModel/approval_model.pkl')
approval_preprocessor = joblib.load('backend/core/MLModel/approval_preprocessor.pkl')

def predict_credit_limit(data):
    print("[ML_MODEL] Incoming data for prediction:", data)
    df = pd.DataFrame([{
        "Income": data['Income'] * 1000,
        "Rating": data['Rating'],
        "Cards": data['Cards'],
        "Age": data['Age'],
        "Education": data['Education'],
        "Balance": data['Balance'],
        # "Student": int(data['Student']),
        # "Married": int(data['Married'])
        "Ethnicity": data.get("Ethnicity", "Caucasian")  # <--- Add this default
    }])

    X_transformed = limit_preprocessor.transform(df)
    credit_limit = limit_model.predict(X_transformed)[0]

    approval_probability = min(1.0, credit_limit / 20000)

    return {
        'credit_limit': round(credit_limit, 2),
        'approval_probability': approval_probability
    }

def predict_approval(data):
    df = pd.DataFrame([{
        "Income": data['Income'] * 1000,  # Convert from thousands
        "Rating": data['Rating'],
        "Cards": data['Cards'],
        "Age": data['Age'],
        "Balance": data['Balance'],
        "Education": data['Education'],
        "Student": int(data['Student']),
        "Married": int(data['Married']),
        "Ethnicity": data.get("Ethnicity", "Caucasian")  # default fallback
    }])

    X_transformed = approval_preprocessor.transform(df)
    prob = approval_model.predict_proba(X_transformed)[0][1]

    return round(prob, 4)
