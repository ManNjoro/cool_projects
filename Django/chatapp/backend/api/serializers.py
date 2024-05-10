from rest_framework import serializers
from .models import Message, CustomUser, Profile
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["id", "user", "full_name", "image", "bio", "verified"]

class MessageSerializer(serializers.ModelSerializer):
    receiver_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)
    class Meta:
        model = Message
        fields = ["id", "content", "created_at", "updated_at", "sender", "sender_profile", "receiver", "receiver_profile"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password"]
        extra_kwargs = {"password":{"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user