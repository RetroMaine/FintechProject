from django.urls import path, include
from django.http import HttpResponse
from core.views import credit_estimate, list_users, limit_view, approval_view, user_setup

def index(request):
    return HttpResponse("Welcome to FinTech API!")

urlpatterns = [
    path('api/', include('core.urls')),  # ✅ this is good
    path('', index, name='index'),
]
