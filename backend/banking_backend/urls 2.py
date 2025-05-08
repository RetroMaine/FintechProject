from django.urls import path
from django.http import HttpResponse
from core.views import list_users, limit_view, approval_view

def index(request):
    return HttpResponse("Welcome to FinTech API!")

urlpatterns = [
    path('',           index,          name='index'),
    path('users/',     list_users,     name='list_users'),
    path('limit/',     limit_view,     name='credit_limit'),
    path('approval/',  approval_view,  name='approval_probability'),
]
