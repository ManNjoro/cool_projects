from django.contrib import admin
from .models import Message, CustomUser, Profile

# Register your models here.

class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username']

class ProfileAdmin(admin.ModelAdmin):
    list_editable = ['verified']
    list_display = ['user','full_name', 'verified']

class MessageAdmin(admin.ModelAdmin):
    list_editable = ['is_read']
    list_display = ['sender','receiver', 'content', 'is_read']

admin.site.register(Message, MessageAdmin)
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)
