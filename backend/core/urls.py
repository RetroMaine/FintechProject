from django.urls import path
from .views import list_users, limit_view, approval_view

urlpatterns = [
    path('users/',     list_users,     name='list_users'),
    path('limit/',     limit_view,     name='limit'),
    path('approval/',  approval_view,  name='approval_probability'),
]
