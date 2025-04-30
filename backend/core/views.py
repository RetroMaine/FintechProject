# core/views.py
import os, json
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import (
    JsonResponse,
    HttpResponse,
    HttpResponseNotAllowed
)
import joblib
import pandas as pd

# — point this at your MLModel folder —
MODEL_DIR = os.path.join(settings.BASE_DIR, 'core', 'MLModel')

# — load once at startup —
credit_model        = joblib.load(os.path.join(MODEL_DIR, 'credit_limit_model.pkl'))
credit_preprocessor = joblib.load(os.path.join(MODEL_DIR, 'limit_preprocessor.pkl'))
approval_model      = joblib.load(os.path.join(MODEL_DIR, 'approval_model.pkl'))
approval_preprocessor = joblib.load(os.path.join(MODEL_DIR, 'approval_preprocessor.pkl'))

def index(request):
    return HttpResponse(
        "Available endpoints:\n"
        "  POST /limit/    with JSON {Income, Rating, Cards, Age, Balance, Ethnicity}\n"
        "  POST /approval/ with JSON { … same plus Education, Student, Married }\n",
        content_type="text/plain"
    )


@csrf_exempt
def limit_view(request):
    if request.method == 'GET':
        return HttpResponse(
            "Send a POST with JSON {Income, Rating, Cards, Age, Balance, Ethnicity} to get a prediction",
            content_type="text/plain"
        )
    if request.method != 'POST':
        return HttpResponseNotAllowed(['GET','POST'])

    try:
        payload = json.loads(request.body.decode('utf-8'))

        # build a DataFrame with the exact columns the preprocessor expects:
        df_input = pd.DataFrame([{
            "Income":    payload.get("Income",    payload.get("income")),
            "Rating":    payload.get("Rating",    payload.get("rating")),
            "Cards":     payload.get("Cards",     payload.get("cards")),
            "Age":       payload.get("Age",       payload.get("age")),
            "Balance":   payload.get("Balance",   payload.get("balance")),
            "Ethnicity": payload.get("Ethnicity", payload.get("ethnicity"))
        }])

        # transform & predict
        X_proc = credit_preprocessor.transform(df_input)
        pred   = credit_model.predict(X_proc)[0]

        return JsonResponse({"predicted_limit": round(float(pred), 2)})

    except KeyError as e:
        # missing one of the required keys
        return JsonResponse(
            {"error": f"Missing feature: {e.args[0]}"},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )


@csrf_exempt
def approval_view(request):
    if request.method == 'GET':
        return HttpResponse(
            "Send POST JSON {Income, Rating, Cards, Age, Balance, "
            "Education, Student, Married, Ethnicity} to get approval probability",
            content_type="text/plain"
        )
    if request.method != 'POST':
        return HttpResponseNotAllowed(['GET', 'POST'])

    try:
        payload = json.loads(request.body.decode('utf-8'))

        # --- Build a one‐row DataFrame with the exact columns approval_preprocessor expects ---
        df_input = pd.DataFrame([{
            "Income":    payload.get("Income",    payload.get("income")),
            "Rating":    payload.get("Rating",    payload.get("rating")),
            "Cards":     payload.get("Cards",     payload.get("cards")),
            "Age":       payload.get("Age",       payload.get("age")),
            "Balance":   payload.get("Balance",   payload.get("balance")),
            "Education": payload.get("Education", payload.get("education")),
            "Student":   payload.get("Student",   payload.get("student")),
            "Married":   payload.get("Married",   payload.get("married")),
            "Ethnicity": payload.get("Ethnicity", payload.get("ethnicity"))
        }])

        # --- Transform and pull out the probability for class ‘1’ ---
        X_proc      = approval_preprocessor.transform(df_input)
        probs       = approval_model.predict_proba(X_proc)[0]
        approval_p  = float(probs[1])

        return JsonResponse({"approval_probability": round(approval_p, 4)})

    except KeyError as e:
        return JsonResponse({"error": f"Missing feature: {e.args[0]}"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    
def list_users(request):
    users = User.objects.only("id","name","email")
    data = [{"id":str(u.id),"name":u.name,"email":u.email} for u in users]
    return JsonResponse(data, safe=False)
