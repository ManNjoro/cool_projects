from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _

# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)

    # Provide unique related_name for groups and user_permissions fields
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        related_name='custom_user_groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        related_name='custom_user_permissions'
    )

class Room(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self) -> str:
        return self.name

class Message(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sent_messages', default=1)
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='received_messages', default=1)

    def __str__(self) -> str:
        return f'From: {self.sender.username} - To: {self.receiver.username} - {self.created_at}'
    

