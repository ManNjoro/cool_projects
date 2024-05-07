from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework import serializers
from .serializers import MessageSerializer, RoomSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Message, Room, CustomUser


class UserListCreateView(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
