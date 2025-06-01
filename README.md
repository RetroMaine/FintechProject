**FintechProject**
*AI-powered mobile banking application for credit limit & loan approval predictions, personalized financial insights, and an AI chatbot, built with React Native (Expo), Django, and MongoDB.*

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Architecture & Workflow](#architecture--workflow)
5. [Directory Structure](#directory-structure)
6. [Installation & Setup](#installation--setup)
7. [Usage](#usage)
8. [API Endpoints](#api-endpoints)
9. [Machine Learning Model](#machine-learning-model)
10. [AI Chatbot Integration](#ai-chatbot-integration)
11. [Future Improvements](#future-improvements)
12. [Contributing](#contributing)
13. [License](#license)

---

## Project Overview

**FintechProject** is a full-stack, AI-driven mobile banking prototype that allows users to:

* Input personal financial details (income, expenses, debts, etc.).
* Receive an **estimated credit limit** based on a predictive ML model.
* Check **loan approval** likelihood for various loan products.
* Ask an embedded **AI chatbot** (powered by Google Gemini) for personalized financial advice in natural language.
* Continue using the app even when offline via local data persistence.

The front end is built in **React Native** (using Expo) to run on iOS and Android simulators, while the back end is a **Django REST** API connected to **MongoDB** (via MongoEngine). A scikit-learn/XGBoost model lives on the server to generate credit-limit and loan-approval predictions. All user data and model results are stored in MongoDB. The AI chatbot fetches user profile data and responds via Google’s Gemini API, ensuring a conversational, non-technical tone for financial guidance.

---

## Key Features

1. **User Profile & Authentication**

   * Users register (email/password) or log in to access their financial dashboard.
   * User data (income, employment status, monthly expenses, credit score range) is stored securely in MongoDB.

2. **Credit Limit Prediction**

   * Upon entering their financial metrics, users get a real-time credit limit estimate.
   * Under the hood, a trained XGBoost regression model predicts “maximum safe credit limit” based on historical data patterns.

3. **Loan Approval Classification**

   * Users can input details for a desired loan (amount, term, purpose).
   * A classification pipeline predicts “Approved / Denied / Review” based on user profile + loan parameters.

4. **AI Chatbot (“FinBot”)**

   * Embedded chatbot screen (React Native) that routes to `/api/chatbot/`.
   * Uses Google Gemini (via `google-generativeai`) to answer finance questions (e.g., “How can I improve my credit score?”) based on stored user data.
   * Ensures responses are in plain English, friendly, and actionable.

5. **Offline Persistence**

   * The app uses **AsyncStorage** on the device to persist the current user’s auth token and last known financial profile data.
   * Even when offline, users can view their most recent credit-limit prediction and chat history.
   * When connectivity is restored, new requests (credit-limit, loan-approval, chatbot) sync with the backend automatically.

---

## Technology Stack

* **Frontend (React Native / Expo)**

  * React Native (Expo CLI)
  * React Navigation
  * AsyncStorage for local persistence
  * Victory Native (or Recharts) for charts
  * Axios for HTTP requests

* **Backend (Django REST Framework)**

  * Python 3.11+
  * Django 4.x
  * Django REST Framework
  * MongoEngine (ODM for connecting to MongoDB)
  * Gunicorn / uWSGI (production WSGI server)

* **Database**

  * MongoDB Atlas (NoSQL document store)
  * Collections: `users`, `credit_predictions`, `loan_applications`, `chat_history`

* **Machine Learning**

  * scikit-learn (for preprocessing pipelines)
  * XGBoost (for regression & classification)
  * pandas / NumPy for data handling
  * Joblib (for serializing model files)

* **AI Integration**

  * google-generativeai Python SDK (for calling Gemini-2.0-Flash)
  * Custom prompt engineering for “FinBot”

* **DevOps / Environment**

  * .env files for environment variables: `MONGODB_URI`, `DJANGO_SECRET_KEY`, `GEMINI_API_KEY`
  * Dockerfile (optional) for containerizing the Django back end
  * Expo Go for mobile debugging
  * GitHub Actions (CI/CD) pipeline (optional)

---

## Architecture & Workflow

1. **User Flow (Mobile)**

   * Launch Expo app → **Login / Register** screen.
   * On success, fetch user profile via `/api/users/<id>/`.
   * Navigate to **Dashboard**: shows cached data if offline or fresh data if online.
   * Tap **“Estimate Credit Limit”**:

     1. Present form for entering income, debt, etc.
     2. On submit → POST to `/api/credit-limit/` → server loads XGBoost model → returns predicted limit → save result in `credit_predictions` → update local cache.
   * Tap **“Apply for Loan”**:

     1. Fill in loan amount, term, purpose.
     2. POST to `/api/loan-approval/` → server runs classification model → returns “Approved” / “Denied” / “Review” → save in `loan_applications` → update local cache.
   * Tap **“FinBot Chat”**:

     1. Opens chat UI.
     2. Each message is sent via POST to `/api/chatbot/` along with the user ID (if online).
     3. If offline, messages are queued locally; once back online, they sync.
     4. Backend constructs a prompt including cached user data and chat history, calls Gemini → returns a response → append both locally and on the server.

2. **Backend Flow (Django REST)**

   * **`/api/users/`** (GET, POST, PUT)
   * **`/api/credit-limit/`** (POST):

     * Serializer validates financial inputs.
     * Loads `xgboost_credit_limit_model.joblib`.
     * Returns `{ "predicted_limit": 7500 }`.
     * Stores result in MongoDB.
   * **`/api/loan-approval/`** (POST):

     * Serializer checks loan data.
     * Loads `xgboost_loan_classifier.joblib`.
     * Returns `{ "decision": "APPROVED" }`.
     * Stores result in MongoDB.
   * **`/api/chatbot/`** (POST/GET):

     * If POST and online, fetch user’s cached profile data and recent chat.
     * Build a Gemini prompt:

       ```
       You are FinBot, a friendly financial assistant. The user’s profile: 
       • Income: $60,000
       • Existing debts: $10,000
       • Credit score: 680
       Answer the question below in plain English:

       QUESTION: “How can I reduce my monthly expenses to increase savings?” 
       ```
     * Call Gemini → return response text → save to `chat_history`.
     * If GET, return cached conversation history so the mobile app can show offline messages.

3. **Data Persistence (MongoDB)**

   * **Users** collection:

     ```jsonc
     {
       "_id": ObjectId,
       "email": "alice@example.com",
       "password_hash": "<bcrypt>",
       "income": 60000,
       "debts": 10000,
       "credit_score": 680,
       "created_at": ISODate(...),
       "updated_at": ISODate(...)
     }
     ```
   * **CreditPredictions** collection:

     ```jsonc
     {
       "_id": ObjectId,
       "user_id": ObjectId,
       "input_features": { "income": 60000, "monthly_expenses": 3000, "existing_debt": 10000, "credit_score": 680 },
       "predicted_limit": 7500,
       "timestamp": ISODate(...)
     }
     ```
   * **LoanApplications** collection:

     ```jsonc
     {
       "_id": ObjectId,
       "user_id": ObjectId,
       "loan_amount": 15000,
       "term_months": 36,
       "purpose": "Home improvement",
       "decision": "DENIED",
       "timestamp": ISODate(...)
     }
     ```
   * **ChatHistory** collection:

     ```jsonc
     {
       "_id": ObjectId,
       "user_id": ObjectId,
       "messages": [
         { "role": "USER", "text": "How can I improve my credit score?", "timestamp": ... },
         { "role": "BOT", "text": "Start by paying down credit card balances…", "timestamp": ... },
         …
       ]
     }
     ```

---

## Directory Structure

```
FintechProject/
├── backend/                    # Django REST API
│   ├── fintech/               # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/                 # Django app for user management
│   │   ├── models.py          # User, Profile schemas (MongoEngine)
│   │   ├── serializers.py
│   │   ├── views.py           # Register, Login, User profile endpoints
│   │   └── urls.py
│   ├── finance/               # Django app for predictions
│   │   ├── models.py          # CreditPrediction, LoanApplication (MongoEngine)
│   │   ├── serializers.py     # Input serializers for credit/loan
│   │   ├── views.py           # /api/credit-limit/, /api/loan-approval/
│   │   └── urls.py
│   ├── chatbot/               # Django app for AI chatbot
│   │   ├── models.py          # ChatHistory (MongoEngine)
│   │   ├── views.py           # /api/chatbot/ endpoint
│   │   └── urls.py
│   ├── ml_models/             # Serialized ML models & training scripts
│   │   ├── xgboost_credit.joblib
│   │   ├── xgboost_loan.joblib
│   │   ├── train_credit.py    # Script to train credit limit model
│   │   └── train_loan.py      # Script to train loan classifier
│   ├── requirements.txt       # Python dependencies
│   └── manage.py
│
├── frontend/                   # React Native (Expo) project
│   ├── App.js                  # Entry point, sets up navigation
│   ├── screens/               # Individual screens
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js  # Displays financial overview
│   │   ├── CreditLimitScreen.js
│   │   ├── LoanApprovalScreen.js
│   │   └── ChatbotScreen.js
│   ├── components/            # Reusable UI components
│   │   ├── ChartCard.js        # Wrapper around Victory charts
│   │   ├── InputField.js
│   │   └── Button.js
│   ├── services/              # API client (Axios)
│   │   └── api.js              # Base URL + endpoints
│   ├── utils/                 # Helpers
│   │   ├── auth.js            # AsyncStorage token handlers
│   │   └── validation.js      # Form validation logic
│   ├── package.json
│   ├── app.json                # Expo configuration
│   └── babel.config.js
│
├── .env.example                # Sample environment variables
├── README.md                   # ← You are here
└── LICENSE
```

---

## Installation & Setup

### Prerequisites

* **Node.js** (v14+) & **npm** or **Yarn**
* **Python 3.11+**
* **Expo CLI** (install via `npm install -g expo-cli`)
* **MongoDB Atlas** cluster (free tier is fine)
* Google Gemini API key (for AI chatbot)

### 1. Clone the Repository

```bash
git clone https://github.com/RetroMaine/FintechProject.git
cd FintechProject
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root (copied from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` to include:

```env
# Backend (Django) settings
DJANGO_SECRET_KEY=<your-django-secret-key>
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/fintech_db?retryWrites=true&w=majority"
GEMINI_API_KEY=<your-google-gemini-api-key>

# Frontend (React Native) settings
API_BASE_URL=http://localhost:8000/api
```

### 3. Install & Configure the Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate     # macOS/Linux
# On Windows: .venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

* **Requirements** (excerpt from `backend/requirements.txt`):

  ```
  Django==4.x
  djangorestframework==3.x
  mongoengine==0.24.x
  scikit-learn==1.2.x
  xgboost==1.7.x
  google-generativeai==0.2.x
  python-dotenv==1.x
  ```

* **Configure MongoDB**
  In `backend/fintech/settings.py`, ensure:

  ```python
  import os
  from dotenv import load_dotenv

  load_dotenv()  
  MONGO_URI = os.getenv("MONGODB_URI")

  # MongoEngine config
  from mongoengine import connect
  connect(host=MONGO_URI)
  ```

* **Run the Server**

  ```bash
  python manage.py runserver
  ```

  This will start the Django server on port 8000.

### 4. Train or Load the ML Models (Optional)

Pre-trained `xgboost_credit.joblib` and `xgboost_loan.joblib` are included in `backend/ml_models/`. To retrain:

```bash
cd backend/ml_models
# Train credit limit regression
python train_credit.py --data-path ../data/credit_data.csv --output xgboost_credit.joblib

# Train loan approval classifier
python train_loan.py --data-path ../data/loan_data.csv --output xgboost_loan.joblib
```

Ensure your CSV files reside in a separate `data/` folder with matching feature columns.

### 5. Install & Configure the Frontend

Open a new terminal:

```bash
cd frontend
npm install           # or `yarn install`
```

* **Update API\_BASE\_URL** in `frontend/services/api.js` if your Django server runs on a different host/port.

### 6. Run the Frontend (Expo)

```bash
expo start
```

* Choose “Run on iOS Simulator” or “Run on Android Emulator.”
* You can also scan the QR code with a physical device’s Expo Go app.

---

## Usage

1. **Register & Login**

   * On first launch, you’re prompted to register an account (email + password).
   * On subsequent launches, login with your credentials.

2. **Dashboard**

   * The Dashboard screen shows a “Financial Overview” with any previously cached data if offline, or fresh data if online.

3. **Credit Limit Prediction**

   * Tap “Estimate Credit Limit” → fill in:

     * Annual income
     * Monthly expenses
     * Total existing debt
     * Credit score range (300–850)
   * Tap “Calculate.”
   * The predicted limit (e.g. \$8,200) is shown in a card and saved to both MongoDB and local cache.

4. **Loan Approval**

   * Tap “Apply for Loan” → enter:

     * Loan amount
     * Loan term (months)
     * Loan purpose (“Home Improvement,” “Car Purchase,” etc.)
   * Tap “Submit.”
   * You’ll see “Approved,” “Denied,” or “Review” with a brief reason, stored in database and local cache.

5. **FinBot Chat**

   * Tap “FinBot” (chat icon).
   * Type any finance question (e.g. “How do I build an emergency fund?”).
   * If online, FinBot responds in plain English, using your profile data; if offline, your question queues and sends when connectivity returns.

6. **Offline Persistence**

   * If you lose connectivity, you can still view your last credit-limit prediction, loan decision, and chat history.
   * Any new requests (credit-limit, loan, chat) are queued locally and automatically sync once you’re back online.

7. **Logout**

   * From the user menu, select “Logout.”
   * Clears AsyncStorage and returns to Login screen.

---

## API Endpoints

Below is a summary of the main REST endpoints in the Django backend. All endpoints expect/return JSON.

### Authentication & Users

* **POST** `/api/users/register/`

  * Registers a new user.
  * Request Body:

    ```jsonc
    {
      "email": "alice@example.com",
      "password": "SecurePass123",
      "income": 60000,
      "debts": 10000,
      "credit_score": 680
    }
    ```
  * Response: `201 Created` with user ID & profile data.

* **POST** `/api/users/login/`

  * Authenticates and returns a JWT or session token.
  * Request Body:

    ```jsonc
    {
      "email": "alice@example.com",
      "password": "SecurePass123"
    }
    ```
  * Response: `{ "token": "<jwt-token>", "user_id": "61234abcde..." }`

* **GET** `/api/users/<user_id>/`

  * Fetch user profile (requires auth header).
  * Response:

    ```jsonc
    {
      "email": "alice@example.com",
      "income": 60000,
      "debts": 10000,
      "credit_score": 680
    }
    ```

### Credit Limit Prediction

* **POST** `/api/credit-limit/`

  * Run credit limit regression model.
  * Request Body:

    ```jsonc
    {
      "user_id": "61234abcde...",
      "income": 60000,
      "monthly_expenses": 3000,
      "existing_debt": 10000,
      "credit_score": 680
    }
    ```
  * Response:

    ```jsonc
    {
      "predicted_limit": 7500,
      "timestamp": "2025-05-20T14:33:00Z"
    }
    ```

### Loan Approval Prediction

* **POST** `/api/loan-approval/`

  * Run loan approval classifier.
  * Request Body:

    ```jsonc
    {
      "user_id": "61234abcde...",
      "loan_amount": 15000,
      "term_months": 36,
      "purpose": "Home Improvement"
    }
    ```
  * Response:

    ```jsonc
    {
      "decision": "DENIED",
      "timestamp": "2025-05-20T14:35:12Z"
    }
    ```

### AI Chatbot

* **POST** `/api/chatbot/`

  * Send user message & receive FinBot response.
  * Request Body:

    ```jsonc
    {
      "user_id": "61234abcde...",
      "message": "How can I improve my credit score?"
    }
    ```
  * Response:

    ```jsonc
    {
      "reply": "To boost your credit score, start by paying down high-interest credit cards first. Ensure you pay at least the minimum each month, keep your utilization below 30%...",
      "timestamp": "2025-05-20T14:38:45Z"
    }
    ```

* **GET** `/api/chatbot/?user_id=<id>`

  * Retrieve the last N chat messages (for offline caching).
  * Response:

    ```jsonc
    [
      { "role": "USER", "text": "How do I build an emergency fund?", "timestamp": "2025-05-20T14:40:00Z" },
      { "role": "BOT", "text": "Start by setting aside 5% of each paycheck into a separate savings account...", "timestamp": "2025-05-20T14:40:05Z" }
    ]
    ```

---

## Machine Learning Model

### Data & Preprocessing

* **Data Source**:

  * Credit-limit model uses historical borrower data (age, income, credit history, existing debts, etc.).
  * Loan-approval model uses labeled data of past loan applications (`approved` vs. `denied`), with features like debt-to-income ratio, employment length, credit score, etc.

* **Preprocessing Steps (in `train_credit.py` / `train_loan.py`)**:

  1. Read CSV (pandas).
  2. Clean missing values (impute median for numerical, mode for categorical).
  3. One-hot encode categorical features (e.g., loan purpose).
  4. Scale numerical features (StandardScaler).
  5. Split into train/test sets (80/20 or 70/30).

### Model Training

* **Credit Limit Regression** (`train_credit.py`):

  ```python
  from xgboost import XGBRegressor
  import joblib

  # 1. Load data, preprocess
  X_train, X_test, y_train, y_test = preprocess_credit_data("credit_data.csv")

  # 2. Instantiate & train
  model = XGBRegressor(n_estimators=100, max_depth=5, learning_rate=0.1)
  model.fit(X_train, y_train)

  # 3. Evaluate
  mse = mean_squared_error(y_test, model.predict(X_test))
  print(f"Test MSE: {mse:.2f}")

  # 4. Save
  joblib.dump(model, "xgboost_credit.joblib")
  ```

* **Loan Approval Classification** (`train_loan.py`):

  ```python
  from xgboost import XGBClassifier
  import joblib

  # 1. Load data, preprocess (binary labels: 1=approved, 0=denied)
  X_train, X_test, y_train, y_test = preprocess_loan_data("loan_data.csv")

  # 2. Instantiate & train
  clf = XGBClassifier(n_estimators=200, max_depth=4, learning_rate=0.1)
  clf.fit(X_train, y_train)

  # 3. Evaluate
  accuracy = accuracy_score(y_test, clf.predict(X_test))
  print(f"Test Accuracy: {accuracy*100:.2f}%")

  # 4. Save
  joblib.dump(clf, "xgboost_loan.joblib")
  ```

### Loading & Inferencing (Django)

* In `backend/finance/views.py`, for credit limit:

  ```python
  import joblib
  from rest_framework import status
  from rest_framework.response import Response
  from rest_framework.views import APIView
  from .serializers import CreditInputSerializer
  from .models import CreditPrediction

  class CreditLimitView(APIView):
      def post(self, request):
          serializer = CreditInputSerializer(data=request.data)
          serializer.is_valid(raise_exception=True)
          inputs = serializer.validated_data

          model = joblib.load('backend/ml_models/xgboost_credit.joblib')
          features = [
              inputs['income'],
              inputs['monthly_expenses'],
              inputs['existing_debt'],
              inputs['credit_score']
          ]
          predicted = model.predict([features])[0]

          # Save to MongoDB
          CreditPrediction.objects.create(
              user_id=inputs['user_id'],
              input_features={
                  "income": inputs['income'],
                  "monthly_expenses": inputs['monthly_expenses'],
                  "existing_debt": inputs['existing_debt'],
                  "credit_score": inputs['credit_score']
              },
              predicted_limit=predicted
          )

          return Response(
              {"predicted_limit": predicted},
              status=status.HTTP_200_OK
          )
  ```

* Similarly for loan approval in `LoanApprovalView`.

---

## AI Chatbot Integration

* **Prompt Engineering**: In `backend/chatbot/views.py`, build a prompt that:

  1. Summarizes the user’s key financial stats.
  2. Appends the user’s question.
  3. Instructs Gemini to respond as a “friendly financial advisor for a non-technical audience.”

  ```python
  import os
  from google import generativeai as genai
  from rest_framework.views import APIView
  from rest_framework.response import Response
  from .models import ChatHistory
  from users.models import UserProfile

  class ChatbotView(APIView):
      def post(self, request):
          user_id = request.data.get('user_id')
          message = request.data.get('message')

          # Fetch user profile
          profile = UserProfile.objects.get(id=user_id)
          history = ChatHistory.objects.filter(user_id=user_id).order_by('-timestamp')[:5]

          # Build context
          user_ctx = (
              f"Income: ${profile.income}, "
              f"Debts: ${profile.debts}, "
              f"Credit Score: {profile.credit_score}\n"
          )
          convo_ctx = "\n".join(
              f"{msg['role']}: {msg['text']}" for msg in reversed(history)
          )

          prompt = (
              "You are FinBot, a friendly financial advisor. "
              "Use the user’s profile and recent chat history to answer in plain English.\n\n"
              f"USER PROFILE:\n{user_ctx}\n"
              f"CHAT HISTORY:\n{convo_ctx}\n\n"
              f"QUESTION: {message}\n\n"
              "ANSWER:"
          )

          # Call Gemini
          genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
          model = genai.GenerativeModel("gemini-2.0-flash")
          response = model.generate_content(prompt)

          # Save both user’s question and FinBot’s answer
          ChatHistory.objects.create(user_id=user_id, role="USER", text=message)
          ChatHistory.objects.create(user_id=user_id, role="BOT", text=response.text)

          return Response({"reply": response.text})
  ```

* **Offline Handling**

  * If the user is offline, store messages locally in `AsyncStorage` (React Native).
  * Upon reconnection, batch‐send any queued messages to `/api/chatbot/`.

* **Chat Screen** (`frontend/screens/ChatbotScreen.js`):

  ```jsx
  import React, { useState, useEffect } from "react";
  import { View, TextInput, Button, FlatList, Text, StyleSheet } from "react-native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import api from "../services/api";

  export default function ChatbotScreen() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
      // Load last messages from AsyncStorage on mount
      AsyncStorage.getItem("chat_history").then((stored) => {
        if (stored) setMessages(JSON.parse(stored));
      });
    }, []);

    const saveHistoryLocally = async (updated) => {
      await AsyncStorage.setItem("chat_history", JSON.stringify(updated));
    };

    const sendMessage = async () => {
      if (!input.trim()) return;
      const userId = await AsyncStorage.getItem("user_id");
      const newUserMsg = { role: "USER", text: input, timestamp: Date.now() };
      const updated = [...messages, newUserMsg];
      setMessages(updated);
      saveHistoryLocally(updated);
      setInput("");

      try {
        const res = await api.post("/chatbot/", {
          user_id: userId,
          message: input
        });
        const botReply = {
          role: "BOT",
          text: res.data.reply,
          timestamp: Date.now()
        };
        const newHistory = [...updated, botReply];
        setMessages(newHistory);
        saveHistoryLocally(newHistory);
      } catch (err) {
        // If offline, queue the message in AsyncStorage under “queued_messages”
        const queued = JSON.parse(await AsyncStorage.getItem("queued_messages") || "[]");
        const newQueue = [...queued, { userId, message: input }];
        await AsyncStorage.setItem("queued_messages", JSON.stringify(newQueue));
      }
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View
              style={item.role === "USER" ? styles.userBubble : styles.botBubble}
            >
              <Text>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask FinBot something..."
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 10 },
    userBubble: {
      alignSelf: "flex-end",
      backgroundColor: "#DCF8C6",
      margin: 5,
      padding: 8,
      borderRadius: 8
    },
    botBubble: {
      alignSelf: "flex-start",
      backgroundColor: "#ECECEC",
      margin: 5,
      padding: 8,
      borderRadius: 8
    },
    inputRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    input: {
      flex: 1,
      borderColor: "#CCC",
      borderWidth: 1,
      borderRadius: 5,
      padding: 8,
      marginRight: 5
    }
  });
  ```

---

## Future Improvements

1. **Enhanced Security & Compliance**

   * Migrate to OAuth2/JWT with refresh tokens.
   * Enforce strong password policies and email verification.
   * Add audit logging for financial requests.

2. **Role-Based Dashboards**

   * Build an admin dashboard (web) for internal analysts to view aggregate metrics (average credit limit, approval rates, user growth).

3. **Containerization & Deployment**

   * Dockerize backend and frontend.
   * Deploy to AWS/GCP/Heroku with CI/CD.
   * Use Kubernetes (EKS/GKE) for horizontal scaling.

4. **Improved ML Pipelines**

   * Automate nightly retraining on new data.
   * Experiment with LightGBM or TabNet for potentially better predictive performance.
   * Track model drift and data drift metrics in production.

5. **Enhanced Offline Sync**

   * Implement two-way sync so that when offline, changes to user profile (e.g., updated income) also queue and sync upstream.
   * Provide conflict-resolution dialogs if a profile was updated on another device.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Make your changes and commit with a clear message.
4. Push to your fork and open a Pull Request.
5. We’ll review and merge once everything checks out.

Please follow existing code conventions, write descriptive commit messages, and include tests where applicable.

---

## License

This project is released under the **MIT License**. See [LICENSE](LICENSE) for details.

---

*Built by Krish Joshi (RetroMaine) — Combining AI, data science, and mobile development to democratize personal financial insights.*
