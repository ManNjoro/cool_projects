from django.contrib import admin
from .models import User, OneTimePassword
from django.utils import timezone
from datetime import datetime, timedelta
# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("first_name", "date_joined")

@admin.register(OneTimePassword)
class OtpAdmin(admin.ModelAdmin):
    list_display = ("user", "expires_at", "created_at")
    print("timezone",timezone.localtime(timezone.now()) + timedelta(minutes=5))
    print("datetime",datetime.now()) 
