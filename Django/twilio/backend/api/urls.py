# urls.py
from django.urls import path
from .views import handle_incoming_call, bridge_call, hello, make_call, message
urlpatterns = [
    path('make_call/', make_call, name='make_call'),
    path('incoming_call/', handle_incoming_call, name='handle_incoming_call'),
    path('bridge_call/', bridge_call, name='bridge_call'),
    path('hello/', hello, name='hello'),
    path('sms/', message, name='message'),
]
