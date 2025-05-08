from django.urls import path
from .views import ( list_users, limit_view, 
approval_view, credit_estimate, get_user_history,
user_setup, signin_view, signup_view, ai_chatbot, financial_insight
)

urlpatterns = [
    path('users/',     list_users,     name='list_users'),
    path('signup/',    signup_view,    name='signup'),
    path('signin/',    signin_view,    name='signin'),
    path('limit/',     limit_view,     name='credit_limit'),
    path('approval/',  approval_view,  name='approval_probability'),
    path('estimate/',  credit_estimate, name='credit_estimate'),
    path('setup/',     user_setup,     name='user_setup'), 
    path('chatbot/', ai_chatbot, name='ai_chatbot'),
    path('insight/', financial_insight, name='financial_insight'), 
    path('history/<str:user_id>/', get_user_history, name='user_history'),
]
