from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save



# Create your models here.
class CustomUser(AbstractUser):
    username = models.CharField(max_length=150, unique=True)

    def profile(self):
        profile = Profile.objects.get(user=self)
    
    class Meta:
        verbose_name_plural = "User"


class Profile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=1000)
    bio = models.CharField(max_length=100)
    image = models.ImageField(upload_to='user_images', default='default.jpg')
    verified = models.BooleanField(default=False)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()

post_save.connect(create_user_profile, sender=CustomUser)
post_save.connect(save_user_profile, sender=CustomUser)


class Message(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    sender = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='sender')
    receiver = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, related_name='receiver')
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_at']

    def __str__(self) -> str:
        return f'From: {self.sender.username} - To: {self.receiver.username} - {self.created_at}'
    
    @property
    def sender_profile(self):
        sender_profile = Profile.objects.get(user=self.sender)
        return sender_profile
    
    @property
    def receiver_profile(self):
        receiver_profile = Profile.objects.get(user=self.receiver)
        return receiver_profile
    
    

