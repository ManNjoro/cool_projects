from django.db import models

# Create your models here.
class Room(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self) -> str:
        return self.name

class Message(models.Model):
    value = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.CharField(max_length=200)
    room = models.CharField(max_length=200)

    def __str__(self) -> str:
        return f"{self.user} - {self.room}"
