from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import serializers
from .serializers import MessageSerializer, RoomSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Message, Room, CustomUser



class UserCreateView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        receiver_id = self.request.query_params.get('receiver')
        if receiver_id:
            return Message.objects.filter(sender=user, receiver_id=receiver_id) | Message.objects.filter(sender_id=receiver_id, receiver=user)
        return Message.objects.none()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
