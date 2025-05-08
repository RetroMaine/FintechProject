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
import requests
from .models_mongo import UserProfile, Prediction, Features
from datetime import datetime

# — point this at your MLModel folder —
MODEL_DIR = os.path.join(settings.BASE_DIR, 'core', 'MLModel')

# — load once at startup —
credit_model        = joblib.load(os.path.join(MODEL_DIR, 'credit_limit_model.pkl'))
credit_preprocessor = joblib.load(os.path.join(MODEL_DIR, 'limit_preprocessor.pkl'))
approval_model      = joblib.load(os.path.join(MODEL_DIR, 'approval_model.pkl'))
approval_preprocessor = joblib.load(os.path.join(MODEL_DIR, 'approval_preprocessor.pkl'))

def index(request):
    return JsonResponse({
        'message': 'Welcome to the FinTech API',
        'endpoints': [
            '/users/ - List all users',
            '/signup/ - Create new user',
            '/signin/ - User authentication',
            '/setup/ - Complete user profile',
            '/estimate/ - Get credit estimate',
            '/history/<user_id>/ - Get user history'
        ]
    })

@csrf_exempt
def financial_insight(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        user_data = data.get('userData', {})

        prompt = f"""
        You are an advanced financial advisor. Here is a user's profile:
        - Income: ${user_data.get('Income')}
        - Credit Score: {user_data.get('Rating')}
        - Cards: {user_data.get('Cards')}
        - Age: {user_data.get('Age')}
        - Education: {user_data.get('Education')} years
        - Balance: ${user_data.get('Balance')}
        - Ethnicity: {user_data.get('Ethnicity')}
        - Student: {"Yes" if user_data.get('Student') else "No"}
        - Married: {"Yes" if user_data.get('Married') else "No"}

        Generate a bullet-pointed financial insight analysis with:
        - Risk assessment
        - Credit recommendations
        - Suggested actions to improve credit health
        """

        headers = { "Content-Type": "application/json" }
        payload = {
            "contents": [
                { "parts": [{ "text": prompt }] }
            ]
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}"

        response = requests.post(url, headers=headers, json=payload)
        print("🔍 Insight API Response:", response.status_code, response.text)

        result = response.json()
        message = result['candidates'][0]['content']['parts'][0]['text']
        return JsonResponse({'reply': message})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


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
    users = UserProfile.objects.only('id', 'email', 'created_at')
    data = [{
        'id': str(user.id),
        'email': user.email,
        'created_at': user.created_at.isoformat()
    } for user in users]
    return JsonResponse(data, safe=False)

@csrf_exempt
def signup_view(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
            
        # Check if user already exists
        if UserProfile.objects(email=email).first():
            return JsonResponse({'error': 'User already exists'}, status=400)
            
        # Create new user
        user = UserProfile(
            email=email,
            password=password,  # In production, hash the password
            created_at=datetime.utcnow()
        )
        user.save()
        
        return JsonResponse({
            'message': 'User created successfully',
            'userId': str(user.id)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def signin_view(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'error': 'Email and password are required'}, status=400)
            
        # Find user by email
        user = UserProfile.objects(email=email).first()
        
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
            
        # Check password (in production, use proper password hashing)
        if user.password != password:
            return JsonResponse({'error': 'Invalid password'}, status=401)
            
        return JsonResponse({
            'message': 'Sign in successful',
            'userId': str(user.id)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def user_setup(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        data = json.loads(request.body)
        user_id = data.get('userId')
        
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
            
        # Update user profile with additional information
        user = UserProfile.objects(id=user_id).first()
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
            
        user.dependent_count = int(data.get('dependent_count', 0))
        user.education_level = data.get('education_level', '')
        user.income_category = data.get('income_category', '')
        user.marital_status = data.get('marital_status', '')
        user.updated_at = datetime.utcnow()
        user.save()
        
        return JsonResponse({
            'message': 'User profile updated successfully',
            'userId': str(user.id)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def credit_estimate(request):
    print("=== Received POST on /api/estimate/ ===")
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    
    try:
        data = json.loads(request.body)
        user_id = data.get('userId', 'test_user_123')
        
        if not user_id:
            return JsonResponse({'error': 'User ID is required'}, status=400)
            
        # Create features object
        features = Features(
            Income=float(data['Income']),
            Rating=float(data['Rating']),
            Cards=int(data['Cards']),
            Age=int(data['Age']),
            Balance=float(data['Balance']),
            Education=int(data['Education']),
            Student=bool(data['Student']),
            Married=bool(data['Married']),
            Ethnicity=data.get('Ethnicity', 'Not Specified')
        )
        
        # Get credit limit prediction
        df_input = pd.DataFrame([{
            "Income": features.Income,
            "Rating": features.Rating,
            "Cards": features.Cards,
            "Age": features.Age,
            "Balance": features.Balance,
            "Ethnicity": features.Ethnicity
        }])
        
        X_proc = credit_preprocessor.transform(df_input)
        credit_limit = float(credit_model.predict(X_proc)[0])
        
        # Get approval probability
        df_input_approval = pd.DataFrame([{
            "Income": features.Income,
            "Rating": features.Rating,
            "Cards": features.Cards,
            "Age": features.Age,
            "Balance": features.Balance,
            "Education": features.Education,
            "Student": features.Student,
            "Married": features.Married,
            "Ethnicity": features.Ethnicity
        }])
        
        X_proc_approval = approval_preprocessor.transform(df_input_approval)
        approval_prob = float(approval_model.predict_proba(X_proc_approval)[0][1])
        
        # Store prediction
        prediction = Prediction(
            userId=user_id,
            features=features,
            creditLimit=credit_limit,
            approvalProbability=approval_prob,
            createdAt=datetime.utcnow()
        )
        prediction.save()
        
        return JsonResponse({
            'credit_limit': round(credit_limit, 2),
            'approval_probability': round(approval_prob, 4)
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

def get_user_history(request, user_id):
    if request.method != 'GET':
        return HttpResponseNotAllowed(['GET'])
    
    try:
        predictions = Prediction.objects(userId=user_id).order_by('-createdAt')
        history = [{
            'date': pred.createdAt.isoformat(),
            'limit': pred.creditLimit
        } for pred in predictions]
        
        latest = predictions.first()
        latest_data = {
            'creditLimit': latest.creditLimit,
            'approvalProbability': latest.approvalProbability
        } if latest else None
        
        return JsonResponse({
            'history': history,
            'latest': latest_data
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)# views.py
# from django.http import JsonResponse
# from .models import EstimationEntry  # a model we'll create
# from .ml_model import predict_credit_limit  # a function we'll make
# import json

# @csrf_exempt
# def estimate_view(request):
#     if request.method == 'POST':
#         try:    
#             data = json.loads(request.body)
#             print("[VIEWS] /credit_estimate payload received:", data)

            
#             # Save to MongoDB (using MongoEngine or Django ORM)
#             entry = EstimationEntry(**data)
#             entry.save()

#             # Predict using ML model
#             result = predict_credit_limit(data)

#             print("[VIEWS] Prediction output:", {
#     'credit_limit': round(predict_credit_limit, 2),
#     # 'approval_probability': round(approval_probability, 4)
# })

#             return JsonResponse({
#                 'credit_limit': result['credit_limit'],
#                 'approval_probability': result['approval_probability'],
#                 'history': result.get('history', [])  # optional
#             })

#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def ai_chatbot(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST allowed'}, status=405)

    try:
        data = json.loads(request.body)
        user_data = data.get('userData', {})
        question = data.get('question')

        prompt = f"""
        You are an AI financial assistant. Here is the user's profile:
        - Income: ${user_data.get('Income')}
        - Credit Score: {user_data.get('Rating')}
        - Cards: {user_data.get('Cards')}
        - Age: {user_data.get('Age')}
        - Education: {user_data.get('Education')} years
        - Balance: ${user_data.get('Balance')}
        - Ethnicity: {user_data.get('Ethnicity')}
        - Student: {"Yes" if user_data.get('Student') else "No"}
        - Married: {"Yes" if user_data.get('Married') else "No"}

        User Question: {question}
        Provide the best possible financial advice.
        """

        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ]
        }

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={settings.GEMINI_API_KEY}"

        response = requests.post(
            url,
            headers={"Content-Type": "application/json"},
            json=payload
        )

        print("🔁 Gemini raw response:", response.status_code, response.text)

        result = response.json()
        message = result['candidates'][0]['content']['parts'][0]['text']
        return JsonResponse({'reply': message})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


