import os
from django.core.wsgi import get_wsgi_application

# point to your settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "banking_backend.settings")

# this is the WSGI callable Django’s dev server and any WSGI server will use
application = get_wsgi_application()
